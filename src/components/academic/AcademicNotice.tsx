import { Link } from "react-router-dom";

export function AcademicNotice({
  cartography = false,
}: {
  cartography?: boolean;
}) {
  return (
    <aside
      className="academic-notice"
      aria-label={
        cartography ? "Disponibilidad cartográfica" : "Estado académico"
      }
    >
      <strong>
        {cartography
          ? "Actividad SIG propuesta · herramientas pendientes"
          : "Borrador académico para revisión"}
      </strong>
      <p>
        {cartography
          ? "El visor y las capas aún no están implementados. Puedes consultar el procedimiento; su ejecución requiere datos reales, autorizados y revisados. No se generan análisis ni resultados espaciales."
          : "Se conserva el material entregado. Las afirmaciones, referencias y vigencia normativa requieren revisión científica y docente. Los títulos se reproducen del paquete; su cotejo con el sílabo sigue pendiente."}
      </p>
      {!cartography && (
        <Link to="/revision-editorial">Consultar pendientes editoriales</Link>
      )}
    </aside>
  );
}
