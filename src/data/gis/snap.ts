import type { Feature, Polygon, MultiPolygon } from "geojson";
export const SNAP_URL =
  "https://geovisorm.controlrecursosyenergia.gob.ec/arcgis/rest/services/MAAE_WGS84_17S/MapServer/0";
export type Area = Feature<
  Polygon | MultiPolygon,
  Record<string, string | number | null>
>;
export interface SnapData {
  areas: Area[];
  fields: { name: string; alias: string }[];
  retrievedAt: string;
}
export const areaId = (area: Area) =>
  String(area.properties.objectid ?? area.id);
export const areaName = (area: Area) =>
  String(
    area.properties.nam || area.properties.codigo_de_ || `Área ${areaId(area)}`,
  );
export const fieldValue = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "No informado"
    : String(value);
async function query(params: string, signal: AbortSignal) {
  const response = await fetch(`/api/snap?${params}`, { signal });
  if (!response.ok)
    throw new Error(
      "No se pudo cargar la capa SNAP. El proveedor puede estar temporalmente inaccesible.",
    );
  return response.json();
}
export async function loadSnap(
  signal: AbortSignal,
  progress: (value: string) => void,
): Promise<SnapData> {
  const [metadata, list] = await Promise.all([
    query("mode=metadata", signal),
    query("mode=ids", signal),
  ]);
  if (
    !Array.isArray(list.objectIds) ||
    !list.objectIds.length ||
    !Array.isArray(metadata.fields)
  )
    throw new Error("El servicio no devolvió áreas consultables.");
  const areas: Area[] = [];
  for (let index = 0; index < list.objectIds.length; index += 8) {
    const ids = list.objectIds.slice(index, index + 8);
    progress(
      `Consultando geometrías: ${index} de ${list.objectIds.length} registros del servicio…`,
    );
    const data = await query(`mode=features&ids=${ids.join(",")}`, signal);
    if (
      !Array.isArray(data.features) ||
      data.features.length !== ids.length ||
      data.features.some((f: Area) => !ids.includes(Number(areaId(f))))
    )
      throw new Error(
        "La respuesta cartográfica está incompleta. Vuelve a intentarlo.",
      );
    areas.push(...data.features);
  }
  if (new Set(areas.map(areaId)).size !== list.objectIds.length)
    throw new Error("Los identificadores del servicio no son consistentes.");
  return { areas, fields: metadata.fields, retrievedAt: metadata.retrievedAt };
}
