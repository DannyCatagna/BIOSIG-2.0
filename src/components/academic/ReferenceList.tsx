import { Link } from "react-router-dom";
import { references, topics, topicPath } from "../../data/academic";

export function ReferenceList({
  ids,
  detailed = false,
}: {
  ids: string[];
  detailed?: boolean;
}) {
  return (
    <div className="reference-list">
      {ids.map((id) => {
        const source = references.find((s) => s.id === id)!;
        return (
          <article key={id} className="reference-entry" id={`fuente-${id}`}>
            <p className="eyebrow">
              {id} · CONSULTA PROPUESTA · REVISIÓN PENDIENTE
            </p>
            <h3>
              <Link to={`/referencias/${id}`}>{source.recurso}</Link>
            </h3>
            <p>{source.institucion}</p>
            <p className="source-caveat">
              <strong>Nota del registro: </strong>
              {source.verificacion_pendiente}
            </p>
            <a
              className="text-link"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              Consultar recurso externo ↗
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            {detailed && (
              <>
                <p className="source-url">{source.url}</p>
                <p>
                  La ficha conserva los metadatos aportados; no certifica
                  acceso, vigencia ni validación científica.
                </p>
                <div className="related-links">
                  {topics
                    .filter((t) => t.referenceIds.includes(id))
                    .map((t) => (
                      <Link key={t.id} to={topicPath(t)}>
                        Tema {t.id}: {t.title}
                      </Link>
                    ))}
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
