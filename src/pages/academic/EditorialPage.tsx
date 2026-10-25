import { useState } from "react";
import { Link } from "react-router-dom";
import {
  editorialIssues,
  topics,
  topicPath,
  curricularMatrix,
  orientation,
} from "../../data/academic";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { AcademicMarkdown } from "../../components/academic/AcademicMarkdown";

export function EditorialPage() {
  const [view, setView] = useState("todos");
  return (
    <div className="container page-content academic-page">
      <Link to="/" className="breadcrumb">
        Inicio / Control académico
      </Link>
      <SectionHeading
        eyebrow="REGISTRO DE TRABAJO · SIN VALIDACIÓN AUTOMÁTICA"
        title="Revisión editorial"
      >
        Pendientes procedentes de la sección VII del documento unificado. Este
        registro organiza la revisión; no certifica que los contenidos estén
        aprobados.
      </SectionHeading>
      <p className="editorial-inline">
        Vista de trabajo sin autenticación: no es un espacio privado. Los
        estados permanecen pendientes hasta una revisión documentada.
      </p>
      <label className="editorial-filter">
        Mostrar{" "}
        <select value={view} onChange={(event) => setView(event.target.value)}>
          <option value="todos">Todos los pendientes</option>
          <option value="documento">Lista del documento</option>
          <option value="integracion">Observaciones de integración</option>
        </select>
      </label>
      {view !== "integracion" && (
        <section>
          <h2>Pendientes del documento</h2>
          <ol className="editorial-issues">
            {editorialIssues.map((issue) => (
              <li key={issue.id}>
                <span>{issue.id} · Pendiente</span>
                <p>{issue.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      {view !== "documento" && (
        <section className="reading-section">
          <h2>Observaciones de integración</h2>
          <ul className="academic-list">
            <li>
              Las cuatro guías aportan criterios sobre diez puntos; faltan
              descriptores por nivel de desempeño y aprobación docente.
            </li>
            <li>
              La fundamentación de cada guía se enlaza con sus temas; no hay un
              apartado independiente desarrollado en el material.
            </li>
            <li>
              El visor, las capas, los casos geográficos y los análisis siguen
              pendientes. No hay resultados cartográficos simulados.
            </li>
            <li>
              Las fuentes S01–S08 conservan sus metadatos originales. Faltan
              citas por afirmación, documentos específicos y verificaciones de
              vigencia.
            </li>
            <li>
              Revisar la correspondencia de las fuentes con cada tema: por
              ejemplo, S03 describe carbono y estratos forestales, mientras
              algunas actividades requieren hidrografía o límites SNAP; el tema
              2.4 menciona UICN sin una referencia específica en el registro.
            </li>
            <li>
              Los títulos repetidos se conservaron. Las etiquetas de
              diferenciación didáctica son ayudas de lectura, no títulos
              atribuidos al sílabo.
            </li>
            <li>
              Se preservaron las grafías y puntuación del material, incluidas
              repeticiones y erratas, para su revisión editorial posterior.
            </li>
            <li>
              Las actividades y criterios son formativos. La evaluación de la
              tesis se limita a percepciones de utilidad y usabilidad; no se
              atribuyen mejoras de aprendizaje.
            </li>
          </ul>
        </section>
      )}
      <details className="editorial-details">
        <summary>Orientaciones originales recuperadas del documento</summary>
        <AcademicMarkdown text={orientation.replace(/^# .+\n/, "")} />
      </details>
      <section className="reading-section">
        <h2>Matriz curricular aportada</h2>
        <p>
          Resultados, actividades y evidencias se identifican como propuestas.
          La condición oficial de los títulos se recoge del paquete y queda
          pendiente de cotejo con el sílabo.
        </p>
        <div
          className="academic-table-scroll"
          role="region"
          aria-label="Matriz curricular completa"
          tabIndex={0}
        >
          <table className="curriculum-table">
            <thead>
              <tr>
                <th scope="col">Tema y subtemas</th>
                <th scope="col">Resultado propuesto</th>
                <th scope="col">Actividad SIG propuesta</th>
                <th scope="col">Evidencia propuesta</th>
              </tr>
            </thead>
            <tbody>
              {curricularMatrix.map((row) => (
                <tr key={row.tema}>
                  <th scope="row">
                    <Link
                      to={topicPath(topics.find((t) => t.id === row.tema)!)}
                    >
                      {row.tema}. {row.titulo_oficial}
                    </Link>
                    <p>{row.subtemas_oficiales}</p>
                  </th>
                  <td>{row.resultado_propuesto}</td>
                  <td>{row.actividad_SIG_propuesta}</td>
                  <td>{row.evidencia_propuesta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
