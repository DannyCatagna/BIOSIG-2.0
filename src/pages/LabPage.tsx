import { Link, useSearchParams } from "react-router-dom";
import { topics, topicPath } from "../data/academic";
import { useReadingPosition } from "../hooks/useReadingPosition";
import { GuideList } from "../components/academic/GuideList";
import { GisWorkspace } from "../components/gis/GisWorkspace";
import { SectionHeading } from "../components/ui/SectionHeading";

export function LabPage() {
  useReadingPosition();
  const [search] = useSearchParams();
  const origin = topics.find((t) => t.id === search.get("tema"));
  return (
    <>
      <div className="lab-page">
        <div className="container page-content">
          <SectionHeading
            eyebrow="EXPLORACIÓN GEOGRÁFICA / PRÁCTICAS SIG"
            title="Laboratorio SIG"
          >
            Un espacio para aprender a interpretar el territorio con Sistemas de
            Información Geográfica.
          </SectionHeading>
          {origin && (
            <Link className="button button-secondary" to={topicPath(origin)}>
              ← Volver al tema {origin.id}
            </Link>
          )}
          <GisWorkspace />
        </div>
      </div>
      <section className="container page-content academic-page lab-guides">
        <p className="eyebrow">GUÍAS DIDÁCTICAS · UNIDADES 2 Y 3</p>
        <h2 id="lectura-guias" tabIndex={-1}>
          Explorar con una pregunta, interpretar con evidencia.
        </h2>
        <p>
          Cuatro guías con cuaderno de práctica y consulta territorial. La
          cartografía depende de la disponibilidad del proveedor; las capas de
          especies y cobertura se consultan externamente. El material conserva
          su revisión docente pendiente.
        </p>
        <GuideList />
      </section>
    </>
  );
}
