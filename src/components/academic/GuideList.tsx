import { Link } from "react-router-dom";
import { guides, guidePath } from "../../data/academic";

export function GuideList({ topicId }: { topicId?: string }) {
  const selected = topicId
    ? guides.filter((g) => g.topicIds.includes(topicId))
    : guides;
  return (
    <div className="guide-list">
      {selected.map((guide) => (
        <article key={guide.id} className="guide-row">
          <span className="guide-number">{guide.id}</span>
          <div>
            <p className="eyebrow">
              UNIDAD {guide.topicIds[0][0]} · TEMAS {guide.topicIds.join(" / ")}
            </p>
            <h3>
              <Link
                to={`${guidePath(guide.id)}${topicId ? `?origen=${topicId}` : ""}`}
              >
                {guide.title}
              </Link>
            </h3>
            <p>{guide.objective}</p>
            <Link
              className="text-link"
              to={`${guidePath(guide.id)}${topicId ? `?origen=${topicId}` : ""}`}
            >
              Consultar guía →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
