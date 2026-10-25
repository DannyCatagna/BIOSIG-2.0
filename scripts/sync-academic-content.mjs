import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { parse } from "csv-parse/sync";

const root = new URL("../content/academic/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const manifest = JSON.parse(await read("manifest.json"));
for (const item of manifest) {
  const bytes = await readFile(new URL(item.path, root));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    item.sha256,
    `Original modificado: ${item.path}`,
  );
}
const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const document = (markdown) => {
  const lines = markdown.trim().split("\n");
  const title = lines.shift().replace(/^# /, "");
  const body = lines.join("\n");
  const headings = [...body.matchAll(/^## (.+)$/gm)];
  const metadataMarkdown = body
    .slice(0, headings[0]?.index ?? body.length)
    .trim();
  const sections = headings.map((heading, index) => ({
    id: slug(heading[1]),
    title: heading[1],
    markdown: body
      .slice(
        heading.index + heading[0].length,
        headings[index + 1]?.index ?? body.length,
      )
      .trim(),
  }));
  return { title, metadataMarkdown, sections };
};
const matrix = parse(await read("control/matriz_curricular.csv"), {
  columns: true,
  bom: true,
  skip_empty_lines: true,
});
const references = parse(await read("control/fuentes.csv"), {
  columns: true,
  bom: true,
  skip_empty_lines: true,
});
assert.equal(matrix.length, 8);
assert.equal(references.length, 8);
const differentiation = {
  "2.1.1":
    "Enfoque didáctico: relieve, posición geográfica y heterogeneidad ambiental.",
  "2.1.2":
    "Enfoque didáctico: clima, humedad y límites de la interpretación altitudinal.",
  "2.4.2":
    "Enfoque didáctico: transformación de coberturas, degradación y fragmentación.",
  "2.4.3":
    "Enfoque didáctico: otras presiones y límites de la inferencia cartográfica.",
  "3.2.2": "Enfoque didáctico: planificación y medidas de manejo.",
  "3.2.3":
    "Enfoque didáctico: monitoreo, indicadores y comparabilidad temporal.",
};
const topics = [];
for (const row of matrix) {
  const file = `unidad-${row.tema[0]}/tema-${row.tema.replace(".", "-")}.md`;
  const markdown = await read(file);
  const parsed = document(markdown);
  const heading = /^Tema (\d\.\d)\. (.+)$/.exec(parsed.title);
  assert.equal(heading?.[1], row.tema);
  assert.equal(heading?.[2], row.titulo_oficial);
  const subtopics = [...markdown.matchAll(/^### (\d\.\d\.\d)\. (.+)$/gm)].map(
    (match) => ({
      id: match[1],
      title: match[2],
      differentiation: differentiation[match[1]] ?? null,
    }),
  );
  assert.equal(subtopics.length, 3);
  assert.equal(
    subtopics.map((s) => `${s.id} ${s.title}`).join(", "),
    row.subtemas_oficiales,
  );
  const referenceIds = [...markdown.matchAll(/^- (S\d+)$/gm)].map(
    (match) => match[1],
  );
  for (const id of referenceIds)
    assert(
      references.some((r) => r.id === id),
      `Referencia ausente: ${id}`,
    );
  assert.equal(
    parsed.sections.find((s) => s.title === "Propósito formativo")?.markdown,
    row.resultado_propuesto,
  );
  topics.push({
    ...parsed,
    title: row.titulo_oficial,
    id: row.tema,
    unitId: row.tema[0],
    sourceFile: file,
    subtopics,
    referenceIds,
    objective: row.resultado_propuesto,
    activity: {
      description: row.actividad_SIG_propuesta,
      evidence: { description: row.evidencia_propuesta },
      status: "pending",
    },
  });
}
const guides = [];
let rubric = [];
for (const id of ["01", "02", "03", "04"]) {
  const file = `guias/guia-${id}.md`;
  const markdown = await read(file);
  const parsed = document(markdown);
  const topicIds = [
    ...(
      /^\*\*Vinculación curricular:\*\* (.+)$/m.exec(markdown)?.[1] ?? ""
    ).matchAll(/\d\.\d/g),
  ].map((match) => match[0]);
  assert.equal(topicIds.length, 2);
  const evaluation = parsed.sections.find((s) =>
    s.title.startsWith("Evaluación"),
  );
  // Parse the supplied weighted criteria; do not invent performance descriptors.
  const supplied = evaluation.markdown
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const match = /^- (.+): (\d+) puntos\.$/.exec(line);
      assert(match, `Criterio no reconocido: ${line}`);
      return { criterion: match[1], points: Number(match[2]) };
    });
  assert.equal(
    supplied.reduce((sum, c) => sum + c.points, 0),
    10,
  );
  if (rubric.length) assert.deepEqual(rubric, supplied);
  else rubric = supplied;
  guides.push({
    ...parsed,
    id,
    sourceFile: file,
    topicIds,
    rubricId: "propuesta-10",
    objective: parsed.sections.find((s) => s.title === "Objetivo").markdown,
    evidence: {
      description: parsed.sections.find(
        (s) => s.title === "Evidencia de aprendizaje",
      ).markdown,
    },
  });
}
assert.equal(
  new Set(topics.flatMap((t) => t.subtopics.map((s) => s.id))).size,
  24,
);
for (const guide of guides)
  for (const id of guide.topicIds) assert(topics.some((t) => t.id === id));
for (const source of references)
  assert.equal(new URL(source.url).protocol, "https:");
const editorialText = await read("control/REVISION_EDITORIAL.md");
const editorial = [...editorialText.matchAll(/^\[ \] (.+)$/gm)].map(
  (match, i) => ({
    id: `ED-${String(i + 1).padStart(2, "0")}`,
    text: match[1],
    status: "pending",
  }),
);
assert.equal(editorial.length, 12);
const output = {
  topics,
  guides,
  references,
  matrix,
  rubric,
  editorial,
  orientation: await read("LEEME.md"),
};
await writeFile(
  new URL("../src/data/academic/generated.json", import.meta.url),
  JSON.stringify(output, null, 2) + "\n",
);
console.log(
  "Contenido contrastado: 8 temas, 24 subapartados, 4 guías, 8 fuentes y 12 pendientes. Originales íntegros.",
);
