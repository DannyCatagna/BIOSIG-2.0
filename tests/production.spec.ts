import { test, expect } from "@playwright/test";

const routes = [
  { name: "Inicio", path: "/", heading: "El Ecuador se explora." },
  {
    name: "Ecuador Megadiverso",
    path: "/ecuador-megadiverso",
    heading: "Ecuador, país Megadiverso",
  },
  {
    name: "Áreas Protegidas",
    path: "/areas-protegidas",
    heading: "Áreas Protegidas",
  },
  {
    name: "Conservación",
    path: "/conservacion",
    heading: "Conservación de la biodiversidad en el Ecuador",
  },
  {
    name: "Laboratorio SIG",
    path: "/laboratorio-sig",
    heading: "Laboratorio SIG",
  },
];

for (const width of [1440, 768, 390, 320]) {
  test(`Producción: navegación y recursos a ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    const requested: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("requestfailed", (request) =>
      errors.push(`${request.url()}: ${request.failure()?.errorText}`),
    );
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()}: ${response.url()}`);
    });
    page.on("request", (request) =>
      requested.push(new URL(request.url()).pathname),
    );
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(await response!.text()).not.toMatch(
      /\/src\/main\.tsx|\/@vite\/client/,
    );
    for (const route of routes) {
      if (width <= 900)
        await page.getByRole("button", { name: "Abrir menú" }).click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: route.name, exact: true })
        .click();
      await expect(page.locator("h1")).toContainText(route.heading);
      expect(new URL(page.url()).hash).toBe(`#${route.path}`);
      await page.reload();
      await expect(page.locator("h1")).toContainText(route.heading);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/#/no-existe");
    await expect(page.locator("h1")).toContainText(
      "Esta página no está disponible",
    );
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page.locator("h1")).toContainText("El Ecuador");
    await expect(page.locator(".hero-art img")).toBeVisible();
    expect(
      await page
        .locator(".hero-art img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    ).toBe(true);
    expect(requested.some((path) => /^\/assets\/.+\.js$/.test(path))).toBe(
      true,
    );
    expect(
      requested.filter(
        (path) => path.startsWith("/src/") || path.startsWith("/@vite/"),
      ),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}
