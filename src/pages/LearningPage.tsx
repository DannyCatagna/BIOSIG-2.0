import { topics, topicPath } from "../data/academic";
import { ExternalLink, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/ui/SectionHeading";
import type { LearningContent } from "../data/learning";

export function LearningPage({ content }: { content: LearningContent }) {
  return (
    <div className="container page-content">
      <Link to="/" className="breadcrumb">
        Inicio / Ruta de aprendizaje
      </Link>
      <SectionHeading eyebrow={content.eyebrow} title={content.title}>
        {content.intro}
      </SectionHeading>
      <section className="area-academic-links">
        <p className="eyebrow">
          LECTURAS VINCULADAS · BORRADORES PARA REVISIÓN
        </p>
        <h2>Del contexto biogeográfico a la conservación.</h2>
        <div className="related-links">
          {topics
            .filter((topic) =>
              ["2.2", "3.1", "3.2", "3.3", "3.4"].includes(topic.id),
            )
            .map((topic) => (
              <Link key={topic.id} to={topicPath(topic)}>
                {topic.id}. {topic.title}
              </Link>
            ))}
        </div>
      </section>
      <div className="activity-banner">
        <BookLabel />
        <p>
          Una primera actividad para observar, investigar y conversar en clase.
        </p>
      </div>
      <div className="module-grid learning-cards">
        {content.steps.map((step, index) => (
          <article className="study-card" key={step.title}>
            <span className="step-index">0{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <aside className="reflection">
        <MessageCircle aria-hidden="true" />
        <div>
          <p className="eyebrow">PREGUNTA PARA EL AULA</p>
          <h2>{content.question}</h2>
          <p>
            Discute tu respuesta con el grupo y explica qué fuentes
            consultarías.
          </p>
        </div>
      </aside>
      <div className="source-panel">
        <div>
          <p className="eyebrow">CONSULTA Y VERIFICA</p>
          <h2>{content.source.name}</h2>
          <p>{content.source.description}</p>
        </div>
        <a
          className="text-link"
          href={content.source.url}
          target="_blank"
          rel="noreferrer"
        >
          Consultar fuente <ExternalLink size={17} />
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
      <Link to="/laboratorio-sig" className="text-link">
        Conoce el próximo espacio de exploración <ArrowRight size={18} />
      </Link>
    </div>
  );
}
function BookLabel() {
  return <span className="pill">Guía de indagación</span>;
}
