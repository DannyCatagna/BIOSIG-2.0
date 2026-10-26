import { Link, useSearchParams } from "react-router-dom";
import { topics, topicPath } from "../data/academic";
import { useReadingPosition } from "../hooks/useReadingPosition";
import { GuideList } from "../components/academic/GuideList";
import { Compass, Layers3, Map, ScanLine } from "lucide-react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { LinkButton } from "../components/ui/LinkButton";

export function LabPage() {
  useReadingPosition();
  const [search] = useSearchParams();
  const origin = topics.find((t) => t.id === search.get("tema"));
  return (
    <>
      <div className="lab-page">
        <div className="container page-content">
          <SectionHeading
            eyebrow="EXPLORACIÓN GEOGRÁFICA / PRÓXIMA ETAPA"
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
          <div className="lab-workspace">
            <aside className="lab-sidebar">
              <span className="lab-sidebar-title">
                <Layers3 size={19} /> Espacio de trabajo
              </span>
              <p>Las herramientas se incorporarán en una próxima etapa.</p>
              <ul>
                <li>
                  <Map size={18} /> Cartografía de referencia
                </li>
                <li>
                  <Layers3 size={18} /> Capas de información
                </li>
                <li>
                  <ScanLine size={18} /> Exploración de áreas
                </li>
              </ul>
              <span className="lab-status">Sin capas cargadas</span>
            </aside>
            <div className="lab-empty">
              <span className="compass-mark">
                <Compass size={46} strokeWidth={1} />
              </span>
              <span className="pill">En preparación</span>
              <h2>
                Aquí conectaremos
                <br />
                el aprendizaje con el mapa.
              </h2>
              <p>
                El visor todavía no está disponible. La integración de
                cartografía y datos oficiales se realizará en la siguiente
                etapa.
              </p>
              <LinkButton to="/areas-protegidas" secondary>
                Explorar áreas protegidas
              </LinkButton>
            </div>
          </div>
          <p className="lab-disclaimer">
            Vista preliminar de la interfaz. No representa un mapa ni contiene
            datos geográficos.
          </p>
        </div>
      </div>
      <section className="container page-content academic-page lab-guides">
        <p className="eyebrow">GUÍAS DIDÁCTICAS · UNIDADES 2 Y 3</p>
        <h2 id="lectura-guias" tabIndex={-1}>
          Explorar con una pregunta, interpretar con evidencia.
        </h2>
        <p>
          Cuatro guías propuestas para revisión docente. Sus procedimientos
          requieren capas y herramientas verificadas que todavía no están
          integradas en BIOSIG.
        </p>
        <GuideList />
      </section>
    </>
  );
}
