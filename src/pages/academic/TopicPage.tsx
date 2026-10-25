import { useReadingPosition } from "../../hooks/useReadingPosition";
import { Link, useParams, useLocation } from "react-router-dom";
import { topics, units, topicPath, sectionId } from "../../data/academic";
import { AcademicNotice } from "../../components/academic/AcademicNotice";
import { AcademicMarkdown } from "../../components/academic/AcademicMarkdown";
import { ReferenceList } from "../../components/academic/ReferenceList";
import { GuideList } from "../../components/academic/GuideList";
import { NotFoundPage } from "../NotFoundPage";

export function TopicPage() {
  useReadingPosition();
  const { topicId } = useParams();
  const { pathname } = useLocation();
  const topic = topics.find((t) => t.id === topicId);
  if (!topic || topicPath(topic) !== pathname) return <NotFoundPage />;
  const unit = units.find((u) => u.id === topic.unitId)!;
  const position = topics.indexOf(topic);
  const previous = topics[position - 1];
  const next = topics[position + 1];
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
      <AcademicNotice />
      <div className="reading-layout">
        <aside className="reading-index">
          <nav aria-label="Índice del tema">
            <h2>En esta lectura</h2>
            {topic.sections.map((section) => (
              <div key={section.id}>
                <Link to={`${topicPath(topic)}?apartado=${section.id}`}>
                  {section.title}
                </Link>
                {section.id === "desarrollo-por-subtemas" && (
                  <ol>
                    {topic.subtopics.map((subtopic) => (
                      <li key={subtopic.id}>
                        <Link
                          to={`${topicPath(topic)}?apartado=${subtopic.id}`}
                        >
                          {subtopic.id}. {subtopic.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
            <Link to={`${topicPath(topic)}?apartado=guias`}>Guía asociada</Link>
          </nav>
        </aside>
        <article className="reading-body">
          <div className="document-metadata">
            <AcademicMarkdown text={topic.metadataMarkdown} />
          </div>
          {topic.sections.map((section) => (
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
                    text={section.markdown.replace(/^- S\d+\s*$/gm, "").trim()}
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
          <section className="reading-section">
            <h2 id={sectionId("guias")} tabIndex={-1}>
              Guía didáctica asociada
            </h2>
            <GuideList topicId={topic.id} />
          </section>
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
