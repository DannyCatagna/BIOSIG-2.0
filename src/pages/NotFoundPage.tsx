import { SectionHeading } from "../components/ui/SectionHeading";
import { LinkButton } from "../components/ui/LinkButton";
export function NotFoundPage() {
  return (
    <div className="container page-content">
      <SectionHeading
        eyebrow="404 / FUERA DE LA RUTA"
        title="Esta página no está disponible."
      >
        Regresa al inicio para continuar explorando BIOSIG.
      </SectionHeading>
      <LinkButton to="/">Volver al inicio</LinkButton>
    </div>
  );
}
