import data from "./generated.json";
import type {
  CurricularUnit,
  Topic,
  Guide,
  Reference,
  RubricCriterion,
  EditorialIssue,
} from "./types";

export const topics: Topic[] = data.topics;
export const guides: Guide[] = data.guides;
export const references: Reference[] = data.references;
export const rubric: RubricCriterion[] = data.rubric;
export const editorialIssues: EditorialIssue[] = data.editorial;
export const curricularMatrix = data.matrix;
export const orientation = data.orientation;
export const units: CurricularUnit[] = [
  {
    id: "2",
    title: "Ecuador, país Megadiverso",
    path: "/ecuador-megadiverso",
    introduction:
      "Lecturas sobre diversidad, flora, fauna, endemismo, cuencas y amenazas. Recorre los temas y relaciona sus preguntas con las guías de exploración propuestas.",
  },
  {
    id: "3",
    title: "Conservación de la biodiversidad en el Ecuador",
    path: "/conservacion",
    introduction:
      "Lecturas sobre normativa, áreas protegidas, estrategias de conservación y manejo. Distingue la evidencia territorial de las conclusiones biológicas y jurídicas.",
  },
];
export const topicPath = (topic: Topic) =>
  `${units.find((u) => u.id === topic.unitId)!.path}/tema/${topic.id}`;
export const guidePath = (id: string) => `/laboratorio-sig/guias/${id}`;
export const topicGuides = (topicId: string) =>
  guides.filter((guide) => guide.topicIds.includes(topicId));
export const sectionId = (value: string) =>
  `lectura-${value.replaceAll(".", "-")}`;
export function academicPageTitle(pathname: string) {
  const topic = topics.find((t) => topicPath(t) === pathname);
  if (topic) return `${topic.id}. ${topic.title}`;
  const guide = guides.find((g) => guidePath(g.id) === pathname);
  if (guide) return guide.title;
  if (pathname.startsWith("/referencias/"))
    return `Referencia ${pathname.split("/").at(-1)}`;
  if (pathname === "/referencias") return "Referencias de consulta";
  if (pathname === "/revision-editorial") return "Revisión editorial";
  return undefined;
}
