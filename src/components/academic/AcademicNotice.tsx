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
          ? "Práctica SIG · alcance de las herramientas"
          : "Borrador académico para revisión"}
      </strong>
      <p>
        {cartography
          ? "El laboratorio permite explorar el mapa de referencia, consultar SNAP cuando el proveedor responde y registrar evidencias. Especies, coberturas y análisis temporales requieren fuentes externas; no se generan resultados espaciales automáticos."
          : "Se conserva el material entregado. Las afirmaciones, referencias y vigencia normativa requieren revisión científica y docente. Los títulos se reproducen del paquete; su cotejo con el sílabo sigue pendiente."}
      </p>
      {!cartography && (
        <Link to="/revision-editorial">Consultar pendientes editoriales</Link>
      )}
    </aside>
  );
}
