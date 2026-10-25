import { Link, useParams } from "react-router-dom";
import { references } from "../../data/academic";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { ReferenceList } from "../../components/academic/ReferenceList";
import { AcademicNotice } from "../../components/academic/AcademicNotice";
import { NotFoundPage } from "../NotFoundPage";

export function ReferencesPage() {
  const { referenceId } = useParams();
  if (referenceId && !references.some((r) => r.id === referenceId))
    return <NotFoundPage />;
  return (
    <div className="container page-content academic-page references-page">
      <Link to={referenceId ? "/referencias" : "/"} className="breadcrumb">
        {referenceId ? "← Todas las referencias" : "Inicio / Referencias"}
      </Link>
      <SectionHeading
        eyebrow="TRAZABILIDAD ACADÉMICA"
        title={
          referenceId ? `Referencia ${referenceId}` : "Referencias de consulta"
        }
      >
        Registro recibido con el paquete académico. Se conservan sus
        instituciones, recursos, enlaces y notas de verificación; no constituye
        todavía una bibliografía definitiva.
      </SectionHeading>
      <AcademicNotice />
      <ReferenceList
        ids={referenceId ? [referenceId] : references.map((r) => r.id)}
        detailed
      />
    </div>
  );
}
