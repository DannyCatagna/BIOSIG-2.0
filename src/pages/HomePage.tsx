import { ArrowRight, BookOpen, Compass, Layers3, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { LinkButton } from "../components/ui/LinkButton";

const modules = [
  {
    number: "U2",
    icon: Compass,
    title: "Ecuador Megadiverso",
    text: "Una mirada a los paisajes y las preguntas que nos conectan con la biodiversidad.",
    to: "/ecuador-megadiverso",
    tag: "UNIDAD 2 · LECTURAS Y GUÍAS",
  },
  {
    number: "U3",
    icon: Leaf,
    title: "Conservación",
    text: "Relaciona lo que aprendes con decisiones y propuestas para el cuidado de la vida.",
    to: "/conservacion",
    tag: "UNIDAD 3 · LECTURAS Y GUÍAS",
  },
];
export function HomePage() {
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" /> EDUCACIÓN, BIODIVERSIDAD Y
            TERRITORIO
          </p>
          <h1>
            El Ecuador se explora.
            <br />
            La vida se <em>comprende.</em>
          </h1>
          <p className="hero-description">
            Un espacio para descubrir nuestro territorio, comprender su
            biodiversidad y aprender a conservarla.
          </p>
          <div className="hero-actions">
            <LinkButton to="/ecuador-megadiverso">Aprender</LinkButton>
            <Link to="/laboratorio-sig" className="text-link">
              Explorar mapa · en preparación <ArrowRight size={17} />
            </Link>
            <Link to="/laboratorio-sig?apartado=guias" className="text-link">
              Realizar prácticas <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <BookOpen size={21} aria-hidden="true" />
            <p>
              Diseñado para quienes enseñarán ciencias.
              <span>Quinto semestre · Química y Biología</span>
            </p>
          </div>
        </div>
        <figure className="hero-art">
          <img
            src="/images/andes.svg"
            alt="Ilustración de montañas, un volcán y vegetación inspirada en el paisaje andino"
          />
          <figcaption>
            <span className="art-caption">UNA MIRADA A NUESTRO TERRITORIO</span>
            <strong>
              Aprender empieza
              <br />
              por observar.
            </strong>
            <span>Ilustración conceptual · Paisaje andino</span>
          </figcaption>
          <span className="image-label">
            <Leaf size={14} /> Ecuador, territorio de vida
          </span>
        </figure>
      </section>
      <section className="learning-section">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">TU RUTA DE APRENDIZAJE</p>
              <h2>Del asombro al conocimiento.</h2>
            </div>
            <p>
              Explora, conecta ideas y construye
              <br className="desktop-break" /> tu propia mirada sobre la
              conservación.
            </p>
          </div>
          <div className="module-grid home-units">
            {modules.map(({ icon: Icon, ...item }) => (
              <Link className="module-card" to={item.to} key={item.number}>
                <div className="card-top">
                  <span className="module-icon">
                    <Icon size={25} />
                  </span>
                  <span className="module-number">{item.number}</span>
                </div>
                <p className="card-tag">{item.tag}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-link">
                  Explorar sección <ArrowRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container lab-invitation">
        <div className="lab-symbol">
          <Layers3 size={34} />
        </div>
        <div>
          <p className="eyebrow">EL SIG COMO HERRAMIENTA EDUCATIVA</p>
          <h2>Otra forma de leer el territorio.</h2>
          <p>Conoce el espacio que integrará mapas y aprendizaje geográfico.</p>
        </div>
        <LinkButton to="/laboratorio-sig" secondary>
          Visitar laboratorio
        </LinkButton>
      </section>
    </>
  );
}
