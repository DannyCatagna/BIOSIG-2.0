import { Link } from "react-router-dom";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { AcademicNotice } from "../../components/academic/AcademicNotice";
import { topics, units, topicPath } from "../../data/academic";

export function UnitPage({ unitId }: { unitId: string }) {
  const unit = units.find((u) => u.id === unitId)!;
  return (
    <div className="container page-content academic-page">
      <Link to="/" className="breadcrumb">
        Inicio / Unidad {unit.id}
      </Link>
      <SectionHeading
        eyebrow={`UNIDAD CURRICULAR ${unit.id}`}
        title={unit.title}
      >
        {unit.introduction}
      </SectionHeading>
      <AcademicNotice />
      <nav aria-label={`Índice de la unidad ${unit.id}`} className="unit-index">
        {topics
          .filter((t) => t.unitId === unit.id)
          .map((topic) => (
            <article key={topic.id} className="topic-index-row">
              <div className="topic-index-title">
                <span>{topic.id}</span>
                <h2>
                  <Link to={topicPath(topic)}>{topic.title}</Link>
                </h2>
              </div>
              <p>{topic.objective}</p>
              <ol>
                {topic.subtopics.map((subtopic) => (
                  <li key={subtopic.id}>
                    <Link to={`${topicPath(topic)}?apartado=${subtopic.id}`}>
                      <span>{subtopic.id}</span> {subtopic.title}
                    </Link>
                    {subtopic.differentiation && (
                      <small>{subtopic.differentiation}</small>
                    )}
                  </li>
                ))}
              </ol>
              <Link className="text-link" to={topicPath(topic)}>
                Leer tema completo →
              </Link>
            </article>
          ))}
      </nav>
      <div className="academic-utilities">
        <Link to="/laboratorio-sig">Guías didácticas SIG</Link>
        <Link to="/referencias">Registro de referencias</Link>
      </div>
    </div>
  );
}
