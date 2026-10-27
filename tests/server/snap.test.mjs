import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import { upstreamURL, normalize, snapResponse } from "../../server/snap.mjs";

test("API fija, consultas acotadas y sin URLs o SQL arbitrarios", () => {
  assert.throws(() =>
    upstreamURL(new URLSearchParams("mode=features&ids=1%3BDROP")),
  );
  assert.throws(() =>
    upstreamURL(new URLSearchParams("mode=features&ids=1,2,3,4,5,6,7,8,9")),
  );
  assert.throws(() => upstreamURL(new URLSearchParams("mode=other")));
  const url = upstreamURL(
    new URLSearchParams(
      "mode=features&ids=1,2&url=https://example.org&where=anything",
    ),
  );
  assert.equal(url.hostname, "geovisorm.controlrecursosyenergia.gob.ec");
  assert.equal(url.searchParams.get("where"), null);
  assert.equal(url.searchParams.get("outSR"), "4326");
});
test("Rechaza respuestas incompletas, geometrías ausentes y proyección inesperada", () => {
  assert.throws(() => normalize({ error: {} }, "ids"));
  assert.throws(() => normalize({ objectIds: ["1"] }, "ids"));
  assert.throws(() =>
    normalize({ features: [], exceededTransferLimit: true }, "features"),
  );
  assert.throws(() =>
    normalize({ features: [], spatialReference: { wkid: 32717 } }, "features"),
  );
  assert.throws(() =>
    normalize({ features: [{ geometry: null }] }, "features"),
  );
});
test("Conversión con geometría REAL Natural Earth (no valida cartografía SNAP)", async () => {
  const data = JSON.parse(
    await readFile("public/data/contexto-natural-earth.geojson", "utf8"),
  );
  const ecuador = data.features.find((f) => f.properties.ADM0_A3 === "ECU");
  const feature = geojsonToArcGIS(ecuador);
  const result = normalize(
    { features: [feature], spatialReference: { wkid: 4326 } },
    "features",
  );
  assert.ok(
    ["Polygon", "MultiPolygon"].includes(result.features[0].geometry.type),
  );
  assert.equal(result.features[0].properties.ADM0_A3, "ECU");
  const points = result.features[0].geometry.coordinates
    .flat(Infinity)
    .filter((_, i) => i % 2 === 0);
  assert.ok(points.some((x) => x < -89)); // Galápagos está presente en la fuente real.
  assert.ok(points.some((x) => x > -80)); // Ecuador continental.
});
test("Errores HTTP, JSON inválido y límites generan un fallo controlado", async () => {
  for (const fetcher of [
    async () => new Response("blocked", { status: 403 }),
    async () => new Response("<html>"),
    async () => {
      throw new Error("timeout");
    },
    async () => new Response("x".repeat(3_500_001)),
  ]) {
    const result = await snapResponse(
      new URLSearchParams("mode=metadata"),
      fetcher,
    );
    assert.equal(result.status, 502);
    assert.match(result.body.error, /No fue posible/);
  }
  assert.equal(
    (await snapResponse(new URLSearchParams("mode=features&ids=bad"))).status,
    400,
  );
});
