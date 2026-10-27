import { Link, useLocation, useParams } from "react-router-dom";
import { useReadingPosition } from "../../hooks/useReadingPosition";
import {
  topics,
  units,
  topicPath,
  sectionId,
  topicGuides,
} from "../../data/academic";
import { AcademicNotice } from "../../components/academic/AcademicNotice";
import { AcademicMarkdown } from "../../components/academic/AcademicMarkdown";
import { ReferenceList } from "../../components/academic/ReferenceList";
import { GuideList } from "../../components/academic/GuideList";
import { ReadingIndex } from "../../components/academic/ReadingIndex";
import { NotFoundPage } from "../NotFoundPage";
const stages = [
  {
    id: "comprender",
    label: "Comprender",
    sections: ["proposito-formativo", "desarrollo-por-subtemas"],
  },
  {
    id: "explorar",
    label: "Explorar",
    sections: ["integracion-sig-propuesta"],
  },
  { id: "aplicar", label: "Aplicar", sections: [] },
  {
    id: "comprobar",
    label: "Comprobar",
    sections: [
      "preguntas-para-el-estudiante",
      "control-de-rigor",
      "fuentes-de-consulta-propuestas",
    ],
  },
];
export function TopicPage() {
  useReadingPosition();
  const { topicId } = useParams();
  const { pathname } = useLocation();
  const topic = topics.find((t) => t.id === topicId);
  if (!topic || topicPath(topic) !== pathname) return <NotFoundPage />;
  const unit = units.find((u) => u.id === topic.unitId)!;
  const previous = topics[topics.indexOf(topic) - 1],
    next = topics[topics.indexOf(topic) + 1];
  const jump = (id: string) => `${topicPath(topic)}?apartado=${id}`;
  return (
    <div className="container page-content academic-page">
      <Link to={unit.path} className="breadcrumb">
        Unidad {unit.id} / {unit.title}
      </Link>
      <header className="academic-title">
        <p className="eyebrow">LECTURA ACADÉMICA · TEMA {topic.id}</p>
        <h1>
          {topic.id}. {topic.title}
        </h1>
      </header>
      <nav className="stage-nav" aria-label="Etapas didácticas">
        {stages.map((s, i) => (
          <Link key={s.id} to={jump(s.id)}>
            <span>0{i + 1}</span>
            {s.label}
          </Link>
        ))}
      </nav>
      <AcademicNotice />
      <div className="reading-layout">
        <ReadingIndex>
          <nav aria-label="Índice del tema">
            <h2>En esta lectura</h2>
            {topic.sections.map((s) => (
              <div key={s.id}>
                <Link to={jump(s.id)}>{s.title}</Link>
                {s.id === "desarrollo-por-subtemas" && (
                  <ol>
                    {topic.subtopics.map((sub) => (
                      <li key={sub.id}>
                        <Link to={jump(sub.id)}>
                          {sub.id}. {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
            <Link to={jump("guias")}>Guía asociada</Link>
          </nav>
        </ReadingIndex>
        <article className="reading-body">
          <details className="document-metadata">
            <summary>Procedencia y estado del material</summary>
            <AcademicMarkdown text={topic.metadataMarkdown} />
          </details>
          {stages.map((stage) => (
            <section className="learning-stage" key={stage.id}>
              <header>
                <p className="eyebrow">ETAPA DIDÁCTICA</p>
                <h2 id={sectionId(stage.id)} tabIndex={-1}>
                  {stage.label}
                </h2>
              </header>
              {stage.id === "aplicar" && (
                <section className="reading-section">
                  <h3 id={sectionId("guias")} tabIndex={-1}>
                    Guía didáctica asociada
                  </h3>
                  <GuideList topicId={topic.id} />
                </section>
              )}
              {stage.id === "explorar" && (
                <Link
                  className="text-link"
                  to={`/laboratorio-sig?tema=${topic.id}&guia=${topicGuides(topic.id)[0]?.id ?? "01"}`}
                >
                  Abrir mapa y práctica del tema →
                </Link>
              )}
              {topic.sections
                .filter((s) => stage.sections.includes(s.id))
                .map((section) => (
                  <section key={section.id} className="reading-section">
                    <h2 id={sectionId(section.id)} tabIndex={-1}>
                      {section.title}
                    </h2>
                    {section.id === "integracion-sig-propuesta" && (
                      <AcademicNotice cartography />
                    )}
                    {section.id === "fuentes-de-consulta-propuestas" ? (
                      <>
                        <ReferenceList ids={topic.referenceIds} />
                        <AcademicMarkdown
                          text={section.markdown
                            .replace(/^- S\d+\s*$/gm, "")
                            .trim()}
                        />
                      </>
                    ) : (
                      <AcademicMarkdown
                        text={section.markdown}
                        subtopics={topic.subtopics}
                      />
                    )}
                  </section>
                ))}
              {stage.id === "comprobar" && (
                <details className="editorial-details">
                  <summary>Orientación para revisar tu respuesta</summary>
                  <p>
                    Identifica la fuente, su fecha y alcance. Separa lo
                    observado de tus interpretaciones y explica qué evidencia
                    adicional necesitarías. Contrasta el producto con los
                    criterios de la guía. Esta orientación no asigna una
                    calificación automática.
                  </p>
                </details>
              )}
            </section>
          ))}
          <nav
            className="reading-pagination"
            aria-label="Navegación entre temas"
          >
            {previous ? (
              <Link to={topicPath(previous)}>
                <small>← Tema anterior · Unidad {previous.unitId}</small>
                {previous.id}. {previous.title}
              </Link>
            ) : (
              <Link to={unit.path}>← Índice de la unidad</Link>
            )}
            {next ? (
              <Link to={topicPath(next)}>
                <small>Tema siguiente · Unidad {next.unitId} →</small>
                {next.id}. {next.title}
              </Link>
            ) : (
              <Link to="/laboratorio-sig">Continuar con las guías →</Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
