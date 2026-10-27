import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import academic from "../src/data/academic/generated.json" with { type: "json" };

for (const width of [1440, 390, 320]) {
  test(`Mapa de referencia auténtico, controles y cuaderno a ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/laboratorio-sig?guia=01&tema=2.1");
    await expect(
      page.getByText("Mapa de referencia cargado.", { exact: false }),
    ).toBeVisible();
    const source = JSON.parse(
      await readFile("public/data/contexto-natural-earth.geojson", "utf8"),
    );
    expect(
      source.features
        .map((f: { properties: { ADM0_A3: string } }) => f.properties.ADM0_A3)
        .sort(),
    ).toEqual(["COL", "ECU", "PER"]);
    await expect(page.locator(".leaflet-overlay-pane path")).toHaveCount(3);
    const before = await page
      .locator(".leaflet-overlay-pane path")
      .first()
      .getAttribute("d");
    await page.getByRole("button", { name: "Galápagos", exact: true }).click();
    await expect
      .poll(() =>
        page.locator(".leaflet-overlay-pane path").first().getAttribute("d"),
      )
      .not.toBe(before);
    await page
      .getByRole("button", { name: "Ecuador continental", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Acercar mapa", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Vista inicial", exact: true })
      .click();
    await page
      .getByLabel("¿Qué diferencias territoriales observas", { exact: false })
      .fill(
        "Observación de prueba del cuaderno; no es un resultado de investigación.",
      );
    await page.reload();
    await expect(
      page.getByLabel("¿Qué diferencias territoriales observas", {
        exact: false,
      }),
    ).toHaveValue(/Observación de prueba/);
    const download = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Descargar evidencia (.txt)", exact: true })
      .click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^BIOSIG-guia-01/);
    const text = await readFile((await file.path())!, "utf8");
    expect(text).toContain("Observación de prueba");
    expect(text).toContain("No se seleccionaron áreas SNAP.");
    expect(text).toContain("[Sin redactar]");
    await page.getByRole("link", { name: "← Volver al tema 2.1" }).click();
    await expect(page.locator("h1")).toContainText("2.1.");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
test("Las cuatro guías y ocho temas abren su práctica, conservan respuestas y origen", async ({
  page,
}) => {
  for (const guide of academic.guides) {
    const origin = guide.topicIds[0];
    await page.goto(`/#/laboratorio-sig/guias/${guide.id}?origen=${origin}`);
    await page
      .getByRole("link", { name: `Abrir práctica SIG de la guía ${guide.id}` })
      .click();
    await expect(page.getByLabel("Práctica vinculada")).toHaveValue(guide.id);
    await page
      .locator("textarea")
      .first()
      .fill(`Respuesta local guía ${guide.id}`);
    await page
      .getByRole("link", { name: /Consultar la guía completa y su rúbrica/ })
      .click();
    await expect(page.locator("h1")).toHaveText(guide.title);
    await page
      .getByRole("link", { name: `Abrir práctica SIG de la guía ${guide.id}` })
      .click();
    await expect(page.locator("textarea").first()).toHaveValue(
      `Respuesta local guía ${guide.id}`,
    );
  }
  for (const topic of academic.topics) {
    await page.goto(
      `/#/${topic.unitId === "2" ? "ecuador-megadiverso" : "conservacion"}/tema/${topic.id}`,
    );
    await page
      .getByRole("link", { name: /Abrir mapa y práctica del tema/ })
      .click();
    expect(page.url()).toContain(`tema=${topic.id}`);
    await expect(
      page.getByRole("region", { name: /Cuaderno de la guía/ }),
    ).toBeVisible();
  }
});
test("Fallo externo explícito y reintento sin inventar polígonos", async ({
  page,
}) => {
  await page.route("**/api/snap?**", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ error: "Proveedor inaccesible" }),
    }),
  );
  await page.goto("/#/laboratorio-sig?guia=03");
  await page
    .getByRole("button", { name: "Cargar capa SNAP", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("No se pudo cargar");
  await expect(
    page.getByText("SNAP (sin cargar)", { exact: false }),
  ).toBeVisible();
  await expect(page.getByLabel("Mostrar capa SNAP")).toBeDisabled();
  await expect(page.locator(".leaflet-overlay-pane path")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Añadir área seleccionada al cuaderno" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Cargar capa SNAP", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
});
test("Cuaderno utilizable cuando el almacenamiento local está bloqueado", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage bloqueado");
    };
  });
  await page.goto("/#/laboratorio-sig?guia=04");
  await page
    .locator("textarea")
    .first()
    .fill("Respuesta conservada en memoria.");
  await expect(
    page.getByText("No se pudo guardar en este navegador.", { exact: false }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar evidencia (.txt)" })
    .click();
  expect(await readFile((await (await download).path())!, "utf8")).toContain(
    "Respuesta conservada en memoria.",
  );
});

test("Una carga pendiente puede cancelarse sin perder las respuestas", async ({
  page,
}) => {
  await page.route("**/api/snap?**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.fulfill({ status: 503, body: "Unavailable" }).catch(() => {});
  });
  await page.goto("/#/laboratorio-sig?guia=03");
  await page
    .locator("textarea")
    .first()
    .fill("Cuaderno conservado al cancelar.");
  await page
    .getByRole("button", { name: "Cargar capa SNAP", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Cancelar carga", exact: true })
    .click();
  await expect(
    page.getByText("Consulta cancelada.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator("textarea").first()).toHaveValue(
    "Cuaderno conservado al cancelar.",
  );
  await expect(
    page.getByRole("button", { name: "Cargar capa SNAP", exact: true }),
  ).toBeEnabled();
});

// Nunca reemplazar esta aceptación por datos sintéticos. Se habilita con acceso real al proveedor.
test("SNAP EN VIVO: polígonos, búsqueda, selección, comparación y evidencia móvil", async ({
  page,
}) => {
  test.skip(
    process.env.BIOSIG_SNAP_LIVE !== "1",
    "Requiere acceso de red real al servicio SNAP. No validado con mocks.",
  );
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/laboratorio-sig?guia=03");
  await page
    .getByRole("button", { name: "Cargar capa SNAP", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Cancelar carga", exact: true }),
  ).not.toBeVisible({ timeout: 150_000 });
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText(/registros cargados del servicio/)).toBeVisible();
  const results = page
    .getByRole("list", { name: "Resultados de búsqueda" })
    .getByRole("button");
  expect(await results.count()).toBeGreaterThan(1);
  const names = [
    await results.nth(0).innerText(),
    await results.nth(1).innerText(),
  ];
  for (const name of names) {
    await page.getByLabel("Buscar área por nombre").fill(name);
    await page
      .getByRole("list", { name: "Resultados de búsqueda" })
      .getByRole("button", { name, exact: true })
      .first()
      .click();
    await expect(
      page.getByRole("region", { name: "Ficha del área seleccionada" }),
    ).toContainText(name);
    await page
      .getByRole("button", { name: "Añadir a comparación", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Añadir área seleccionada al cuaderno" })
      .click();
  }
  for (const name of names)
    await expect(
      page.getByRole("region", { name: "Tabla comparativa" }),
    ).toContainText(name);
  expect(
    await page.locator(".leaflet-overlay-pane path").count(),
  ).toBeGreaterThan(3);
  await page.getByLabel("Mostrar capa SNAP").uncheck();
  await expect(page.locator(".leaflet-overlay-pane path")).toHaveCount(3);
  await page.getByLabel("Mostrar capa SNAP").check();
  expect(
    await page.locator(".leaflet-overlay-pane path").count(),
  ).toBeGreaterThan(3);
  await page
    .locator("textarea")
    .first()
    .fill(
      "Comprobación técnica de selección real. No representa una respuesta estudiantil.",
    );
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar evidencia (.txt)" })
    .click();
  const text = await readFile((await (await download).path())!, "utf8");
  for (const name of names) expect(text).toContain(name);
  expect(text).toContain("geovisorm.controlrecursosyenergia.gob.ec");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
