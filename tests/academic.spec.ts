import { test, expect, type Page } from "@playwright/test";
import data from "../src/data/academic/generated.json" with { type: "json" };

const topicURL = (topic: (typeof data.topics)[number]) =>
  `/#/${topic.unitId === "2" ? "ecuador-megadiverso" : "conservacion"}/tema/${topic.id}`;
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") errors.push(e.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}

for (const width of [1440, 390]) {
  test(`Lecturas completas, subapartados y vínculos a ${width}px`, async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.setViewportSize({ width, height: 900 });
    for (const topic of data.topics) {
      await page.goto(topicURL(topic));
      await expect(page.locator("h1")).toHaveText(
        `${topic.id}. ${topic.title}`,
      );
      await expect(
        page.getByRole("complementary", { name: "Estado académico" }),
      ).toBeVisible();
      const body = normalize(await page.locator(".reading-body").innerText());
      // Verify every supplied prose paragraph, not just headings or card summaries.
      for (const section of topic.sections) {
        for (const paragraph of section.markdown.split(/\n\n+/)) {
          if (/^(#|>|-|\d+\.|\*\*)/.test(paragraph)) continue;
          expect(body).toContain(normalize(paragraph));
        }
      }
      for (const subtopic of topic.subtopics) {
        await page
          .getByRole("navigation", { name: "Índice del tema" })
          .getByRole("link", {
            name: `${subtopic.id}. ${subtopic.title}`,
            exact: true,
          })
          .click();
        const heading = page.locator(
          `[id="lectura-${subtopic.id.replaceAll(".", "-")}"]`,
        );
        await expect(heading).toHaveText(`${subtopic.id}. ${subtopic.title}`);
        await expect(heading).toBeFocused();
        expect(page.url()).toContain(`apartado=${subtopic.id}`);
        await page.reload();
        await expect(heading).toBeFocused();
      }
      const guide = data.guides.find((g) => g.topicIds.includes(topic.id))!;
      await page
        .locator(".guide-row")
        .getByRole("link", { name: "Consultar guía" })
        .click();
      await expect(page.locator("h1")).toHaveText(guide.title);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });

  test(`Cuatro guías, procedimientos, evidencias y rúbricas a ${width}px`, async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/laboratorio-sig");
    await expect(page.locator(".guide-row")).toHaveCount(4);
    for (const guide of data.guides) {
      await page.goto(`/#/laboratorio-sig/guias/${guide.id}`);
      await expect(page.locator("h1")).toHaveText(guide.title);
      await expect(
        page.getByRole("complementary", {
          name: "Disponibilidad cartográfica",
        }),
      ).toBeVisible();
      const body = normalize(await page.locator(".reading-body").innerText());
      for (const section of guide.sections.filter(
        (s) => !s.title.startsWith("Evaluación"),
      )) {
        for (const paragraph of section.markdown.split("\n").filter(Boolean)) {
          expect(body).toContain(normalize(paragraph.replace(/^\d+\. /, "")));
        }
      }
      await expect(page.locator(".rubric-table tbody tr")).toHaveCount(4);
      await expect(page.locator(".rubric-table tfoot td")).toHaveText("10");
      for (const topicId of guide.topicIds) {
        const topic = data.topics.find((t) => t.id === topicId)!;
        await expect(
          page
            .locator(".related-links")
            .getByRole("link", {
              name: `${topic.id}. ${topic.title}`,
              exact: true,
            }),
        ).toHaveAttribute("href", topicURL(topic).replace("/#/", "#/"));
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("Índices completos, referencias fieles, rutas y control editorial", async ({
  page,
}) => {
  const errors = watchErrors(page);
  for (const [id, path] of [
    ["2", "ecuador-megadiverso"],
    ["3", "conservacion"],
  ]) {
    await page.goto(`/#/${path}`);
    await expect(page.locator(".topic-index-row")).toHaveCount(4);
    await expect(page.locator(".topic-index-row li")).toHaveCount(12);
    for (const topic of data.topics.filter((t) => t.unitId === id)) {
      for (const subtopic of topic.subtopics) {
        await expect(
          page
            .locator(".unit-index")
            .getByRole("link", {
              name: `${subtopic.id} ${subtopic.title}`,
              exact: true,
            }),
        ).toHaveAttribute(
          "href",
          `${topicURL(topic).replace("/#/", "#/")}?apartado=${subtopic.id}`,
        );
      }
    }
  }
  await page.goto("/#/referencias");
  await expect(page.locator(".reference-entry")).toHaveCount(8);
  for (const source of data.references) {
    const entry = page.locator(`#fuente-${source.id}`);
    await expect(entry).toContainText(source.institucion);
    await expect(entry).toContainText(source.verificacion_pendiente);
    await expect(
      entry.getByRole("link", { name: /Consultar recurso externo/ }),
    ).toHaveAttribute("href", source.url);
    await expect(
      entry.getByRole("link", { name: /Consultar recurso externo/ }),
    ).toHaveAttribute("target", "_blank");
    await entry
      .getByRole("link", { name: source.recurso, exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText(`Referencia ${source.id}`);
    await page.getByRole("link", { name: "← Todas las referencias" }).click();
  }
  await page.goto("/#/revision-editorial");
  await expect(page.locator(".editorial-issues li")).toHaveCount(12);
  await expect(page.locator(".curriculum-table tbody tr")).toHaveCount(8);
  await page
    .getByRole("combobox", { name: "Mostrar" })
    .selectOption("integracion");
  await expect(page.locator(".editorial-issues")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Observaciones de integración" }),
  ).toBeVisible();
  for (const route of [
    "/ecuador-megadiverso/tema/3.1",
    "/conservacion/tema/9.9",
    "/laboratorio-sig/guias/99",
    "/referencias/S99",
  ]) {
    await page.goto(`/#${route}`);
    await expect(page.locator("h1")).toContainText(
      "Esta página no está disponible",
    );
  }
  expect(errors).toEqual([]);
});

test("Anterior/siguiente y navegación principal activa en lecturas", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto(topicURL(data.topics[0]));
  for (let index = 0; index < data.topics.length; index++) {
    const topic = data.topics[index];
    await expect(page.locator("h1")).toHaveText(`${topic.id}. ${topic.title}`);
    await expect(
      page
        .getByRole("navigation", { name: "Navegación principal" })
        .getByRole("link", {
          name: topic.unitId === "2" ? "Ecuador Megadiverso" : "Conservación",
          exact: true,
        }),
    ).toHaveAttribute("aria-current", "page");
    if (index < data.topics.length - 1)
      await page
        .getByRole("navigation", { name: "Navegación entre temas" })
        .getByRole("link", { name: /Tema siguiente/ })
        .click();
  }
  await page
    .getByRole("navigation", { name: "Navegación entre temas" })
    .getByRole("link", { name: /Tema anterior/ })
    .click();
  await expect(page.locator("h1")).toHaveText(
    `${data.topics[6].id}. ${data.topics[6].title}`,
  );
  expect(errors).toEqual([]);
});
