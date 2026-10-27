import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { guides, guidePath, topics } from "../../data/academic";
import {
  SNAP_URL,
  areaId,
  areaName,
  fieldValue,
  loadSnap,
  type Area,
  type SnapData,
} from "../../data/gis/snap";
import { MapCanvas } from "./MapCanvas";
import { PracticeNotebook } from "./PracticeNotebook";
import "../../styles/gis.css";
import sourcesURL from "../../../docs/fuentes-cartograficas.md?url";
import socializationURL from "../../../docs/socializacion-tesis.md?url";

const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function GisWorkspace() {
  const [search, setSearch] = useSearchParams();
  const guide = guides.find((g) => g.id === search.get("guia"));
  const origin = topics.find((t) => t.id === search.get("tema"));
  const [data, setData] = useState<SnapData>();
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState<Area>();
  const [comparison, setComparison] = useState<Area[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(
    "La capa SNAP se consulta al pulsar «Cargar capa SNAP».",
  );
  const [failed, setFailed] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  async function load() {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true);
    setFailed(false);
    setStatus("Consultando el servicio SNAP…");
    try {
      const result = await loadSnap(controller.signal, setStatus);
      if (!controller.signal.aborted) {
        setData(result);
        setVisible(true);
        setSelected(undefined);
        setComparison([]);
        setStatus(
          `${result.areas.length} registros cargados del servicio. Esta cantidad no representa un inventario nacional actualizado.`,
        );
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        setFailed(true);
        setStatus(
          e instanceof Error
            ? e.message
            : "No fue posible consultar el servicio.",
        );
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  const results =
    data?.areas
      .filter((a) => fold(areaName(a)).includes(fold(query)))
      .sort((a, b) => areaName(a).localeCompare(areaName(b))) ?? [];
  const properties =
    data?.fields.filter(
      (f) =>
        !["objectid", "st_area(shape)", "st_length(shape)"].includes(f.name),
    ) ?? [];
  function choosePractice(value: string) {
    const next = new URLSearchParams(search);
    if (value) next.set("guia", value);
    else next.delete("guia");
    if (
      origin &&
      value &&
      !guides.find((g) => g.id === value)?.topicIds.includes(origin.id)
    )
      next.delete("tema");
    setSearch(next, { preventScrollReset: true });
  }
  return (
    <div className="gis-workspace">
      <div className="gis-practice-picker">
        <label>
          Práctica vinculada{" "}
          <select
            value={guide?.id ?? ""}
            onChange={(e) => choosePractice(e.target.value)}
          >
            <option value="">Exploración libre</option>
            {guides.map((g) => (
              <option key={g.id} value={g.id}>
                Guía {g.id} · {g.title}
              </option>
            ))}
          </select>
        </label>
        <Link to={`/laboratorio-sig?guia=03&modo=demostracion`}>
          Demostración para el aula
        </Link>
      </div>
      {search.get("guia") && !guide && (
        <p role="alert">
          La guía solicitada no existe. Selecciona una de las cuatro prácticas.
        </p>
      )}
      {search.get("modo") === "demostracion" && (
        <aside className="gis-demo">
          <h2>Demostración académica</h2>
          <ol>
            <li>
              Presenta el propósito de BIOSIG y abre un tema desde su unidad.
            </li>
            <li>Regresa al laboratorio y explora continente y Galápagos.</li>
            <li>
              Carga SNAP, busca y selecciona dos áreas; consulta y compara sus
              atributos.
            </li>
            <li>
              Añade las áreas al cuaderno de la guía 03 y registra una
              observación con fuente.
            </li>
            <li>
              Consulta la rúbrica y descarga la evidencia. Explica los límites
              del mapa.
            </li>
          </ol>
          <p>
            Si falla SNAP, no presentes el ejercicio cartográfico como
            completado. Registra la incidencia y reprograma esa parte.
          </p>
          <a href={socializationURL} download="BIOSIG-socializacion.md">
            Descargar guion y borrador de encuesta (.md)
          </a>
        </aside>
      )}
      <div className={`gis-exploration${guide ? " with-practice" : ""}`}>
        <div className="gis-map-column">
          <MapCanvas
            areas={data?.areas ?? []}
            visible={visible}
            selected={selected}
            onSelect={setSelected}
          />
          <details className="gis-sources">
            <summary>Fuentes, fecha y limitaciones cartográficas</summary>
            <p>
              <strong>SNAP:</strong>{" "}
              <a href={SNAP_URL} target="_blank" rel="noreferrer">
                capa 0 del servicio MAAE_WGS84_17S ↗
              </a>
              . Créditos del servicio: MAAE. No se incluyen las capas vecinas de
              patrimonio forestal, bosques protectores ni zonas intangibles.
            </p>
            <p>
              Fecha del conjunto y escala: no documentadas. Consulta:{" "}
              {data
                ? new Date(data.retrievedAt).toLocaleString("es-EC")
                : "todavía no realizada"}
              . La consulta no equivale a una actualización de los datos. El
              servicio no acredita la vigencia jurídica individual de sus
              registros.
            </p>
            <p>
              Origen EPSG:32717; consulta al proveedor en EPSG:4326;
              visualización Leaflet en EPSG:3857. Geometrías generalizadas por
              el proveedor con tolerancia 0,0005 grados para visualización. No
              utilizar para mediciones, trámites legales o delimitación predial.
            </p>
            <p>
              El servicio admite consultas públicas. No declara una licencia de
              redistribución en sus metadatos: no se distribuye una copia SNAP
              ni se ofrece descarga de geometrías. Los campos se presentan con
              sus nombres originales. No se infieren provincias, categorías ni
              unidades de superficie.
            </p>
            <p>
              <strong>Contexto:</strong>{" "}
              <a
                href="https://www.naturalearthdata.com/"
                target="_blank"
                rel="noreferrer"
              >
                Natural Earth
              </a>
              , países a escala 1:10 millones, dominio público. Copia de
              Ecuador, Colombia y Perú del repositorio, revisión ca96624 (fecha
              de descarga: 26-10-2026). Límites de referencia de facto, no
              oficiales para fines jurídicos. Sin relieve, coberturas o
              especies.
            </p>
            <p>
              MapBiomas, GBIF e INABIO se consultan externamente desde las
              prácticas. No son capas integradas. Véase el registro completo en{" "}
              <a href={sourcesURL} download="BIOSIG-fuentes-cartograficas.md">
                la documentación de fuentes (.md)
              </a>
              .
            </p>
          </details>
        </div>
        <aside className="gis-tools" aria-label="Herramientas de consulta SNAP">
          <h2>Explorar áreas protegidas</h2>
          <button onClick={load} disabled={loading}>
            {loading
              ? "Cargando SNAP…"
              : data
                ? "Actualizar capa SNAP"
                : "Cargar capa SNAP"}
          </button>
          {loading && (
            <button
              onClick={() => {
                abort.current?.abort();
                setLoading(false);
                setStatus("Consulta cancelada. Puedes volver a cargar SNAP.");
              }}
            >
              Cancelar carga
            </button>
          )}
          <p role={failed ? "alert" : "status"}>{status}</p>
          {failed && (
            <p>
              No se muestran geometrías de sustitución. Puedes reintentar o{" "}
              <a href={SNAP_URL} target="_blank" rel="noreferrer">
                consultar el proveedor ↗
              </a>
              .
              {data &&
                " Se conserva la consulta anterior, con su fecha original."}
            </p>
          )}
          <label className="gis-layer-toggle">
            <input
              type="checkbox"
              checked={visible && !!data}
              disabled={!data}
              onChange={(e) => setVisible(e.target.checked)}
            />{" "}
            Mostrar capa SNAP
          </label>
          <label className="notebook-field">
            Buscar área por nombre (campo nam)
            <input
              type="search"
              value={query}
              disabled={!data}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe parte del nombre"
            />
          </label>
          {data && (
            <>
              <p>{results.length} coincidencias en los registros cargados.</p>
              <ul className="gis-results" aria-label="Resultados de búsqueda">
                {results.map((a) => (
                  <li key={areaId(a)}>
                    <button
                      aria-pressed={selected && areaId(selected) === areaId(a)}
                      onClick={() => setSelected(a)}
                    >
                      {areaName(a)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {selected && (
            <section
              className="gis-feature"
              aria-label="Ficha del área seleccionada"
            >
              <h3>{areaName(selected)}</h3>
              <p>objectid: {areaId(selected)} · fuente: MAAE, capa SNAP</p>
              {!visible && (
                <p>La capa está oculta. Actívala para ver el polígono.</p>
              )}
              <button
                disabled={
                  comparison.length >= 2 ||
                  comparison.some((a) => areaId(a) === areaId(selected))
                }
                onClick={() => setComparison((list) => [...list, selected])}
              >
                Añadir a comparación
              </button>
              <p>
                Campos originales. «No informado» no significa ausencia. El
                campo are no tiene unidades documentadas.
              </p>
              <dl>
                {properties.map((f) => (
                  <div key={f.name}>
                    <dt>{f.alias || f.name}</dt>
                    <dd>{fieldValue(selected.properties[f.name])}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {comparison.length > 0 && (
            <section
              className="gis-comparison"
              aria-label="Comparación de áreas"
            >
              <h2>Comparar atributos originales</h2>
              <p>
                Añade dos áreas desde sus fichas. Contrasta el significado de
                los campos y la normativa con documentos oficiales.
              </p>
              <div
                className="academic-table-scroll"
                tabIndex={0}
                role="region"
                aria-label="Tabla comparativa"
              >
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Campo del servicio</th>
                      {comparison.map((a) => (
                        <th key={areaId(a)} scope="col">
                          {areaName(a)}
                          <button
                            onClick={() =>
                              setComparison((list) =>
                                list.filter((f) => areaId(f) !== areaId(a)),
                              )
                            }
                          >
                            Quitar de comparación: {areaName(a)}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((f) => (
                      <tr key={f.name}>
                        <th scope="row">{f.alias || f.name}</th>
                        {comparison.map((a) => (
                          <td key={areaId(a)}>
                            {fieldValue(a.properties[f.name])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {guide ? (
            <PracticeNotebook
              key={guide.id}
              guideId={guide.id}
              origin={origin?.id}
              selected={selected}
              retrievedAt={data?.retrievedAt}
            />
          ) : (
            <p className="gis-notice">
              Elige una práctica para registrar respuestas y obtener tu
              evidencia de trabajo.
            </p>
          )}
        </aside>
      </div>
      {guide && (
        <Link
          className="text-link"
          to={`${guidePath(guide.id)}${origin ? `?origen=${origin.id}` : ""}`}
        >
          Volver a la guía {guide.id} →
        </Link>
      )}
    </div>
  );
}
