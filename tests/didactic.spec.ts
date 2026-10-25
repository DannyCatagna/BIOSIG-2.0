import { test, expect } from "@playwright/test";
test("Recorrido móvil: inicio, tema, etapas, guía y retorno", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Aprender", exact: true }).click();
  await page.getByRole("link", { name: "Leer tema completo" }).first().click();
  await expect(
    page.getByRole("button", { name: "Mostrar índice de lectura" }),
  ).toBeVisible();
  for (const label of ["Comprender", "Explorar", "Aplicar", "Comprobar"]) {
    await page
      .getByRole("navigation", { name: "Etapas didácticas" })
      .getByRole("link", { name: new RegExp(label) })
      .click();
    await expect(
      page.getByRole("heading", { name: label, exact: true }),
    ).toBeFocused();
  }
  await page
    .getByRole("navigation", { name: "Etapas didácticas" })
    .getByRole("link", { name: /Aplicar/ })
    .click();
  await page.getByRole("link", { name: "Consultar guía" }).click();
  await expect(
    page.getByRole("link", { name: "← Volver al tema 2.1" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "← Volver al tema 2.1" }).click();
  await expect(page.locator("h1")).toContainText("2.1. Diversidad");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/");
  await page.getByRole("link", { name: /Realizar prácticas/ }).click();
  await expect(page.locator("#lectura-guias")).toBeFocused();
  await expect(page.locator(".guide-row")).toHaveCount(4);
});
test("Fallo de recurso de lectura ofrece recuperación visible", async ({
  page,
}) => {
  await page.route("**/assets/TopicPage-*.js", (route) => route.abort());
  await page.goto("/#/ecuador-megadiverso/tema/2.1");
  await expect(page.getByRole("alert")).toContainText("No pudimos cargar");
  await expect(
    page.getByRole("button", { name: "Volver a cargar" }),
  ).toBeVisible();
  await page.unroute("**/assets/TopicPage-*.js");
  await page.getByRole("button", { name: "Volver a cargar" }).click();
  await expect(page.locator("h1")).toContainText("2.1. Diversidad");
});
