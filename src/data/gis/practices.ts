export interface Practice {
  objective: string;
  steps: string[];
  questions: string[];
  resources: { label: string; url: string }[];
  limit: string;
}
const resources = {
  mapbiomas: {
    label: "MapBiomas Ecuador · coberturas y metodología",
    url: "https://ecuador.mapbiomas.org/",
  },
  gbif: {
    label: "GBIF · registros de biodiversidad",
    url: "https://www.gbif.org/occurrence/search?country=EC",
  },
  inabio: {
    label: "INABIO · investigación ecuatoriana",
    url: "https://inabio.biodiversidad.gob.ec/",
  },
  ambiente: {
    label: "Autoridad ambiental · documentos institucionales",
    url: "https://www.ambiente.gob.ec/",
  },
};
export const practices: Record<string, Practice> = {
  "01": {
    objective:
      "Relacionar diversidad ambiental y distribución territorial de áreas protegidas mediante observaciones y fuentes documentadas.",
    steps: [
      "Explora Ecuador continental y Galápagos con los controles del mapa.",
      "Carga SNAP y selecciona dos áreas con el mapa o el buscador; añádelas al cuaderno.",
      "Contrasta su ubicación con información ambiental publicada y registra la fuente.",
    ],
    questions: [
      "¿Qué diferencias territoriales observas entre las dos áreas? Distingue lo observado de lo inferido.",
      "¿Qué características ambientales documentadas ayudan a interpretar esas diferencias? Incluye documento, enlace y fecha.",
      "¿Qué no permite concluir este mapa sobre diversidad o presencia de especies?",
    ],
    resources: [resources.inabio, resources.mapbiomas],
    limit:
      "Los límites protegidos no son mapas de ecosistemas ni evidencias de presencia de especies.",
  },
  "02": {
    objective:
      "Interpretar relaciones entre distribución geográfica, biodiversidad y amenazas distinguiendo registros, observaciones e hipótesis.",
    steps: [
      "Selecciona un área real y añádela al cuaderno.",
      "Abre MapBiomas y consulta la leyenda, colección, años y metodología del territorio. Compara fechas solamente si son compatibles.",
      "Consulta GBIF o INABIO. Registra identificador, fecha, incertidumbre espacial y licencia de cada dato que uses.",
    ],
    questions: [
      "¿Qué cobertura y fecha documenta la fuente para tu territorio? Si comparaste años, justifica su comparabilidad.",
      "¿Qué registros biológicos consultaste y cuáles son sus limitaciones? Si no los obtuviste, indícalo.",
      "¿Qué amenaza está documentada y qué relación es solo una hipótesis? Cita fuentes.",
    ],
    resources: [resources.mapbiomas, resources.gbif, resources.inabio],
    limit:
      "BIOSIG no integra capas temporales ni registros biológicos. Su consulta se realiza en los portales enlazados; no hay puntos simulados ni cálculo automático de amenazas.",
  },
  "03": {
    objective:
      "Comprender la organización de áreas protegidas mediante la consulta y comparación de la cartografía del servicio SNAP.",
    steps: [
      "Carga la capa SNAP y busca un área por el atributo nam.",
      "Selecciona dos áreas y consulta sus atributos originales en la comparación.",
      "Contrasta categorías y organización con documentos oficiales. No interpretes abreviaturas o unidades sin un diccionario.",
    ],
    questions: [
      "¿Qué áreas seleccionaste y qué atributos del servicio permiten compararlas?",
      "¿Qué categoría, ubicación y norma pudiste documentar externamente? Señala fuente, fecha y qué sigue pendiente.",
      "¿Qué diferencias hay entre un límite cartográfico y una declaración jurídica vigente?",
    ],
    resources: [resources.ambiente],
    limit:
      "El servicio se identifica como SNAP, pero no documenta fecha de actualización ni acredita por sí solo la vigencia jurídica de cada polígono. Los campos abreviados se conservan sin atribuirles significados no confirmados.",
  },
  "04": {
    objective:
      "Analizar estrategias in situ y ex situ y participación comunitaria, separando evidencia territorial, biológica y social.",
    steps: [
      "Selecciona un área SNAP real como contexto territorial.",
      "Busca un documento que describa acciones in situ en esa área y un caso ecuatoriano documentado ex situ.",
      "Contrasta participación comunitaria mediante fuentes verificables, sin publicar ubicaciones sensibles.",
    ],
    questions: [
      "¿Qué acción in situ está documentada para el área seleccionada? Cita la fuente y su fecha.",
      "¿Qué caso ecuatoriano ex situ puedes documentar y cómo se complementa con la estrategia in situ?",
      "¿Qué evidencia respalda la participación comunitaria? ¿Qué puede y qué no puede mostrar el mapa?",
    ],
    resources: [resources.inabio, resources.ambiente],
    limit:
      "No se cartografían comunidades ni especies sensibles. El mapa no demuestra efectividad de conservación ni participación social.",
  },
};
