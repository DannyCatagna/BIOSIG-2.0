import { rubric } from "../../data/academic";

export function RubricTable() {
  return (
    <>
      <div
        className="academic-table-scroll"
        role="region"
        aria-label="Rúbrica propuesta"
        tabIndex={0}
      >
        <table className="rubric-table">
          <caption>Criterios ponderados aportados en las cuatro guías</caption>
          <thead>
            <tr>
              <th scope="col">Criterio</th>
              <th scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rubric.map((row) => (
              <tr key={row.criterion}>
                <th scope="row">{row.criterion}</th>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total propuesto</th>
              <td>{rubric.reduce((sum, row) => sum + row.points, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="editorial-inline">
        Propuesta para revisión docente. El material aporta criterios y
        puntajes, pero no descriptores por nivel de desempeño; no se han
        inventado ni añadido. Esta valoración formativa no demuestra mejoras de
        aprendizaje atribuibles a BIOSIG.
      </p>
    </>
  );
}
