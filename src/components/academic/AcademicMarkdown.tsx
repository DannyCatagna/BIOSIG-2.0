import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { sectionId } from "../../data/academic";
import type { OfficialSubtopic } from "../../data/academic/types";

export function AcademicMarkdown({
  text,
  subtopics = [],
}: {
  text: string;
  subtopics?: OfficialSubtopic[];
}) {
  return (
    <div className="academic-prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Raw HTML is not executed. Only safe internal routes and HTTPS references are linked.
          a: ({ href, children }) =>
            href?.startsWith("/") && !href.startsWith("//") ? (
              <Link to={href}>{children}</Link>
            ) : href?.startsWith("https://") ? (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            ) : (
              <span>{children}</span>
            ),
          h3: ({ children }) => {
            const id = /^(\d\.\d\.\d)\./.exec(String(children))?.[1];
            const subtopic = subtopics.find((s) => s.id === id);
            return (
              <>
                <h3 id={id ? sectionId(id) : undefined} tabIndex={-1}>
                  {children}
                </h3>
                {subtopic?.differentiation && (
                  <p className="differentiation">
                    <strong>
                      Diferenciación propuesta · no modifica el título
                    </strong>
                    {subtopic.differentiation}
                  </p>
                )}
              </>
            );
          },
          table: ({ children }) => (
            <div
              className="academic-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Tabla de contenido académico"
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}
