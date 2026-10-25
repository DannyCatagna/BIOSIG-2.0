export interface AcademicSection {
  id: string;
  title: string;
  markdown: string;
}
export interface AcademicReading {
  metadataMarkdown: string;
  sections: AcademicSection[];
  sourceFile: string;
}
export interface OfficialSubtopic {
  id: string;
  title: string;
  differentiation: string | null;
}
export interface LearningEvidence {
  description: string;
}
export interface GISActivity {
  description: string;
  evidence: LearningEvidence;
  status: string;
}
export interface Topic extends AcademicReading {
  id: string;
  unitId: string;
  title: string;
  objective: string;
  subtopics: OfficialSubtopic[];
  referenceIds: string[];
  activity: GISActivity;
}
export interface Guide extends AcademicReading {
  id: string;
  title: string;
  topicIds: string[];
  objective: string;
  evidence: LearningEvidence;
  rubricId: string;
}
export interface Reference {
  id: string;
  institucion: string;
  recurso: string;
  url: string;
  verificacion_pendiente: string;
}
export interface RubricCriterion {
  criterion: string;
  points: number;
}
export interface CurricularUnit {
  id: string;
  title: string;
  path: string;
  introduction: string;
}
export interface ComplementaryResource {
  label: string;
  to: string;
  status: "available" | "pending";
}
export interface EditorialIssue {
  id: string;
  text: string;
  status: string;
}
