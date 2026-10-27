import { arcgisToGeoJSON } from "@terraformer/arcgis";

export const SNAP_URL =
  "https://geovisorm.controlrecursosyenergia.gob.ec/arcgis/rest/services/MAAE_WGS84_17S/MapServer/0";
const MAX_BYTES = 3_500_000;
const cache = new Map();

export function upstreamURL(params) {
  const mode = params.get("mode") ?? "metadata";
  const url = new URL(SNAP_URL + (mode === "metadata" ? "" : "/query"));
  url.searchParams.set("f", "json");
  if (mode === "ids") {
    url.searchParams.set("where", "1=1");
    url.searchParams.set("returnIdsOnly", "true");
  } else if (mode === "features") {
    const ids = params.get("ids") ?? "";
    if (!/^\d+(,\d+){0,7}$/.test(ids) || ids.length > 100)
      throw new Error("Selecciona de uno a ocho identificadores numéricos.");
    for (const [key, value] of Object.entries({
      objectIds: ids,
      outFields: "*",
      returnGeometry: "true",
      outSR: "4326",
      maxAllowableOffset: "0.0005",
    }))
      url.searchParams.set(key, value);
  } else if (mode !== "metadata") throw new Error("Consulta no admitida.");
  return url;
}

export function normalize(data, mode) {
  if (data.error)
    throw new Error("El proveedor devolvió un error de consulta.");
  if (mode === "metadata") {
    if (data.geometryType !== "esriGeometryPolygon" || !data.fields?.length)
      throw new Error("El esquema del proveedor cambió.");
    return {
      name: data.name,
      copyrightText: data.copyrightText,
      spatialReference: data.extent?.spatialReference,
      fields: data.fields.filter((f) => f.type !== "esriFieldTypeGeometry"),
      description: data.description,
      maxRecordCount: data.maxRecordCount,
    };
  }
  if (mode === "ids") {
    if (
      !Array.isArray(data.objectIds) ||
      data.objectIds.length > 1000 ||
      !data.objectIds.every(Number.isSafeInteger)
    )
      throw new Error(
        "Lista de áreas no válida o superior al límite de consulta.",
      );
    return { objectIds: [...new Set(data.objectIds)].sort((a, b) => a - b) };
  }
  if (
    data.exceededTransferLimit ||
    !Array.isArray(data.features) ||
    data.features.length > 8 ||
    ![4326, 0].includes(data.spatialReference?.wkid ?? 0)
  )
    throw new Error("Respuesta incompleta o proyección inesperada.");
  const features = data.features.map((item) => {
    if (
      !item.geometry?.rings?.length ||
      !item.geometry.rings.every(
        (r) =>
          r.length >= 4 &&
          r.every(
            (p) =>
              p.length >= 2 &&
              Number.isFinite(p[0]) &&
              Number.isFinite(p[1]) &&
              Math.abs(p[0]) <= 180 &&
              Math.abs(p[1]) <= 90,
          ),
      )
    )
      throw new Error("Geometría geográfica no válida.");
    const feature = arcgisToGeoJSON(item, "objectid");
    if (!["Polygon", "MultiPolygon"].includes(feature.geometry?.type))
      throw new Error("El proveedor no devolvió polígonos.");
    return feature;
  });
  return { type: "FeatureCollection", features };
}

export async function snapResponse(params, fetcher = fetch) {
  let url;
  try {
    url = upstreamURL(params);
  } catch (error) {
    return { status: 400, body: { error: error.message } };
  }
  const key = url.href;
  const saved = cache.get(key);
  if (fetcher === fetch && saved && Date.now() - saved.time < 300_000)
    return saved.result;
  try {
    const response = await fetcher(url, {
      signal: AbortSignal.timeout(18_000),
      redirect: "error",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Servicio no disponible.");
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new Error("Respuesta demasiado grande.");
      }
      chunks.push(value);
    }
    const result = {
      status: 200,
      body: {
        ...normalize(
          JSON.parse(Buffer.concat(chunks).toString()),
          params.get("mode") ?? "metadata",
        ),
        source: SNAP_URL,
        retrievedAt: new Date().toISOString(),
        datasetDate: null,
        generalizationDegrees: 0.0005,
      },
    };
    if (fetcher === fetch) {
      if (cache.size >= 150) cache.clear();
      cache.set(key, { time: Date.now(), result });
    }
    return result;
  } catch {
    return {
      status: 502,
      body: {
        error:
          "No fue posible obtener cartografía SNAP válida del proveedor. Comprueba la conexión o inténtalo más tarde. No se han sustituido los datos por geometrías simuladas.",
        source: SNAP_URL,
      },
    };
  }
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Método no admitido." }));
    return;
  }
  const { status, body } = await snapResponse(
    new URL(req.url, "http://localhost").searchParams,
  );
  res.statusCode = status;
  res.end(JSON.stringify(body));
}
