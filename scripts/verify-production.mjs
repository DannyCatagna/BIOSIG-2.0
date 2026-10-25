import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const directory = resolve("dist");
const html = await readFile(resolve(directory, "index.html"), "utf8");
assert(
  !/\/src\/|\.tsx?["']|\/@vite\/|react-refresh/.test(html),
  "El HTML publicado contiene referencias de desarrollo",
);
const assets = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(
  (match) => match[1],
);
assert(
  assets.some((asset) => /^\/assets\/.+\.js$/.test(asset)),
  "Falta el JavaScript compilado",
);
assert(
  assets.some((asset) => /^\/assets\/.+\.css$/.test(asset)),
  "Falta el CSS compilado",
);
for (const asset of [...assets, "/images/andes.svg"]) {
  assert(
    (await stat(resolve(directory, `.${asset}`))).isFile(),
    `Recurso ausente: ${asset}`,
  );
}
console.log(
  "Producción verificada: HTML sin entradas de desarrollo y recursos compilados presentes.",
);
