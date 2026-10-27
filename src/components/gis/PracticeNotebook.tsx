import { useState } from "react";
import { Link } from "react-router-dom";
import { guides, guidePath } from "../../data/academic";
import { practices } from "../../data/gis/practices";
import { SNAP_URL, areaId, areaName, type Area } from "../../data/gis/snap";

export interface Territory {
  id: string;
  name: string;
  attributes: Area["properties"];
  retrievedAt: string;
}
interface Notebook {
  version: 1;
  answers: string[];
  conclusion: string;
  territories: Territory[];
}
const empty = (): Notebook => ({
  version: 1,
  answers: ["", "", ""],
  conclusion: "",
  territories: [],
});
const notebookKey = (id: string) => `biosig-practica-v1-${id}`;
function restore(id: string): Notebook {
  try {
    const data = JSON.parse(localStorage.getItem(notebookKey(id)) ?? "null");
    if (
      data?.version === 1 &&
      data.answers?.length === 3 &&
      data.answers.every((a: unknown) => typeof a === "string") &&
      typeof data.conclusion === "string" &&
      Array.isArray(data.territories) &&
      data.territories.length <= 2 &&
      data.territories.every(
        (t: Territory) =>
          typeof t.id === "string" &&
          typeof t.name === "string" &&
          typeof t.retrievedAt === "string" &&
          t.attributes &&
          typeof t.attributes === "object",
      )
    )
      return data;
  } catch {
    /* La práctica sigue disponible sin almacenamiento local. */
  }
  return empty();
}
export function PracticeNotebook({
  guideId,
  origin,
  selected,
  retrievedAt,
}: {
  guideId: string;
  origin?: string;
  selected?: Area;
  retrievedAt?: string;
}) {
  const guide = guides.find((g) => g.id === guideId)!;
  const practice = practices[guideId];
  const [book, updateBook] = useState(() => restore(guideId));
  const [storage, setStorage] = useState(
    "Las respuestas se guardan en este navegador al editarlas. No se envían al servidor.",
  );
  const [exported, setExported] = useState("");
  function setBook(update: (previous: Notebook) => Notebook) {
    const next = update(book);
    updateBook(next);
    setExported("");
    try {
      localStorage.setItem(notebookKey(guideId), JSON.stringify(next));
      setStorage(
        "Guardado en este navegador. No se envían respuestas al servidor.",
      );
    } catch {
      setStorage(
        "No se pudo guardar en este navegador. Descarga tu evidencia antes de salir.",
      );
    }
  }
  function evidence() {
    const lines = [
      `BIOSIG 2.0 · ${guide.title}`,
      `Fecha de exportación: ${new Date().toISOString()}`,
      `Objetivo: ${practice.objective}`,
      "",
      "TERRITORIOS CONSULTADOS",
      ...book.territories.flatMap((t) => [
        `${t.name} · objectid: ${t.id}`,
        `Consulta: ${t.retrievedAt}`,
        ...Object.entries(t.attributes).map(
          ([k, v]) => `${k}: ${v ?? "No informado"}`,
        ),
      ]),
      "",
      `Fuente cartográfica de los territorios: ${book.territories.length ? SNAP_URL : "No se seleccionaron áreas SNAP."}`,
      "Fecha del conjunto SNAP: no documentada. Atributos originales, sin unidades inferidas. Vigencia jurídica pendiente de contraste.",
      "Contexto del visor: Natural Earth, 1:10 millones, dominio público. No usado para medir superficies.",
      "",
      ...practice.questions.flatMap((q, i) => [
        q,
        book.answers[i] || "[Sin responder]",
        "",
      ]),
      "CONCLUSIÓN",
      book.conclusion || "[Sin redactar]",
      "",
      `Limitación: ${practice.limit}`,
      "La evidencia recoge respuestas del estudiante; no acredita validación científica ni una calificación. No incluye captura ni geometrías cartográficas.",
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `BIOSIG-guia-${guideId}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported("Evidencia descargada. Puedes abrir el archivo e imprimirlo.");
  }
  const hasSelected =
    selected && book.territories.some((t) => t.id === areaId(selected));
  return (
    <section
      className="practice-notebook"
      aria-label={`Cuaderno de la guía ${guideId}`}
    >
      <p className="eyebrow">PRÁCTICA SIG · GUÍA {guideId}</p>
      <h2>{guide.title}</h2>
      <h3>1. Objetivo y recorrido</h3>
      <p>{practice.objective}</p>
      <ol>
        {practice.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p className="gis-notice">{practice.limit}</p>
      <details>
        <summary>Recursos para investigar</summary>
        <ul>
          {practice.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p>
          Son portales de consulta. Cita el documento o conjunto específico que
          utilices, su fecha y licencia; no basta citar su página de inicio.
        </p>
      </details>
      <h3>2. Territorios de mi práctica</h3>
      <p>
        Selecciona un polígono o un resultado de búsqueda. Puedes conservar dos
        áreas. Los registros guardados corresponden a la fecha de consulta
        indicada.
      </p>
      <button
        disabled={
          !selected ||
          !retrievedAt ||
          hasSelected ||
          book.territories.length >= 2
        }
        onClick={() => {
          if (selected && retrievedAt)
            setBook((b) => ({
              ...b,
              territories: [
                ...b.territories,
                {
                  id: areaId(selected),
                  name: areaName(selected),
                  attributes: selected.properties,
                  retrievedAt,
                },
              ],
            }));
        }}
      >
        Añadir área seleccionada al cuaderno
      </button>
      <ul>
        {book.territories.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong>
            <small> Consulta: {t.retrievedAt.slice(0, 10)}</small>{" "}
            <button
              aria-label={`Quitar ${t.name} del cuaderno`}
              onClick={() =>
                setBook((b) => ({
                  ...b,
                  territories: b.territories.filter((a) => a.id !== t.id),
                }))
              }
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
      {!book.territories.length && <p>Aún no has incorporado territorios.</p>}
      <h3>3. Observaciones y respuestas</h3>
      <button
        onClick={() => {
          const map = document.querySelector<HTMLElement>(".gis-map");
          map?.scrollIntoView({ block: "center" });
          map?.focus({ preventScroll: true });
        }}
      >
        Volver a consultar el mapa
      </button>
      {practice.questions.map((q, i) => (
        <label className="notebook-field" key={q}>
          {q}
          <textarea
            rows={4}
            maxLength={12000}
            value={book.answers[i]}
            onChange={(e) =>
              setBook((b) => ({
                ...b,
                answers: b.answers.map((v, j) =>
                  j === i ? e.target.value : v,
                ),
              }))
            }
          />
        </label>
      ))}
      <label className="notebook-field">
        <strong>4. Conclusión y límites de tu interpretación</strong>
        <textarea
          rows={4}
          maxLength={12000}
          value={book.conclusion}
          onChange={(e) =>
            setBook((b) => ({ ...b, conclusion: e.target.value }))
          }
        />
      </label>
      <h3>5. Revisar y obtener evidencia</h3>
      <Link
        to={`${guidePath(guideId)}?apartado=${guide.sections.find((s) => s.title.startsWith("Evaluación"))?.id ?? "fundamentacion"}${origin ? `&origen=${origin}` : ""}`}
      >
        Consultar la guía completa y su rúbrica →
      </Link>
      <p>
        Comprueba que incluiste fuentes, fechas y límites de la interpretación.
        Puedes descargar un borrador incompleto; los campos vacíos se
        identificarán.
      </p>
      <button onClick={evidence}>Descargar evidencia (.txt)</button>
      <p role="status">{exported || storage}</p>
      <p className="gis-notice">
        Evita datos personales y ubicaciones sensibles. En un dispositivo
        compartido, descarga tu trabajo y borra después este cuaderno.
      </p>
      <details>
        <summary>Borrar el cuaderno de esta guía</summary>
        <p>
          Esta acción elimina las respuestas y territorios guardados de esta
          guía en este navegador.
        </p>
        <button
          onClick={() => {
            setBook(empty);
            setExported("Cuaderno borrado.");
          }}
        >
          Confirmar borrado del cuaderno
        </button>
      </details>
    </section>
  );
}
