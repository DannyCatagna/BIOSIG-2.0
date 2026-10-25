import { ReadingIndex } from "../../components/academic/ReadingIndex";
import { useReadingPosition } from "../../hooks/useReadingPosition";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  guides,
  topics,
  topicPath,
  guidePath,
  sectionId,
} from "../../data/academic";
import { AcademicNotice } from "../../components/academic/AcademicNotice";
import { AcademicMarkdown } from "../../components/academic/AcademicMarkdown";
import { RubricTable } from "../../components/academic/RubricTable";
import { NotFoundPage } from "../NotFoundPage";

export function GuidePage() {
  useReadingPosition();
  const { guideId } = useParams();
  const [search] = useSearchParams();
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return <NotFoundPage />;
  const linkedTopics = topics.filter((t) => guide.topicIds.includes(t.id));
  const origin = linkedTopics.find((t) => t.id === search.get("origen"));
  const guideLink = (section: string) =>
    `${guidePath(guide.id)}?apartado=${section}${origin ? `&origen=${origin.id}` : ""}`;
  return (
    <div className="container page-content academic-page">
      <Link to="/laboratorio-sig" className="breadcrumb">
        Laboratorio SIG / Guía {guide.id}
      </Link>
      <header className="academic-title">
        <p className="eyebrow">
          UNIDAD {guide.topicIds[0][0]} · GUÍA DIDÁCTICA
        </p>
        <h1>{guide.title}</h1>
      </header>
      {origin && (
        <Link className="button button-secondary" to={topicPath(origin)}>
          ← Volver al tema {origin.id}
        </Link>
      )}
      <AcademicNotice />
      <AcademicNotice cartography />
      <div className="reading-layout">
        <ReadingIndex>
          <nav aria-label="Índice de la guía">
            <h2>En esta guía</h2>
            <Link to={guideLink("fundamentacion")}>
              Fundamentación vinculada
            </Link>
            {guide.sections.map((section) => (
              <Link key={section.id} to={guideLink(section.id)}>
                {section.title}
              </Link>
            ))}
          </nav>
        </ReadingIndex>
        <article className="reading-body">
          <div className="document-metadata">
            <AcademicMarkdown text={guide.metadataMarkdown} />
          </div>
          <section className="reading-section">
            <h2 id={sectionId("fundamentacion")} tabIndex={-1}>
              Fundamentación vinculada
            </h2>
            <p>
              Consulta los desarrollos académicos de los temas asociados. El
              paquete no aporta un apartado independiente de fundamentación de
              esta guía; su revisión docente sigue pendiente.
            </p>
            <div className="related-links">
              {linkedTopics.map((topic) => (
                <Link key={topic.id} to={topicPath(topic)}>
                  {topic.id}. {topic.title}
                </Link>
              ))}
            </div>
          </section>
          {guide.sections.map((section, index) => (
            <section className="reading-section" key={section.id}>
              <p className="eyebrow">PASO {index + 1} DE LA GUÍA</p>
              <h2 id={sectionId(section.id)} tabIndex={-1}>
                {section.title}
              </h2>
              {section.title.startsWith("Evaluación") ? (
                <RubricTable />
              ) : (
                <AcademicMarkdown text={section.markdown} />
              )}
            </section>
          ))}
          <nav
            className="reading-pagination"
            aria-label="Navegación entre guías"
          >
            <Link to="/laboratorio-sig">← Todas las guías</Link>
            {guides[guides.indexOf(guide) + 1] && (
              <Link to={guidePath(guides[guides.indexOf(guide) + 1].id)}>
                Guía siguiente →
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
