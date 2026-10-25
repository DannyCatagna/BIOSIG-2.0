export type LearningContent = {
  eyebrow: string;
  title: string;
  intro: string;
  question: string;
  steps: { title: string; description: string }[];
  source: { name: string; url: string; description: string };
};
export const learning: Record<string, LearningContent> = {
  ecuador: {
    eyebrow: "01 / OBSERVAR Y COMPRENDER",
    title: "Ecuador Megadiverso",
    intro:
      "Comienza con una mirada al territorio. Observa sus paisajes y transforma tu curiosidad en preguntas que puedas investigar.",
    question:
      "¿Cómo investigarías la relación entre las características de un paisaje y los seres vivos que lo habitan?",
    steps: [
      {
        title: "Observa el paisaje",
        description:
          "Elige un paisaje de la Costa, los Andes, la Amazonía o Galápagos. Describe lo que observas y distingue tus observaciones de tus interpretaciones.",
      },
      {
        title: "Formula una pregunta",
        description:
          "Selecciona un aspecto del clima, el relieve o la vegetación que te interese. Plantea una pregunta que pueda responderse con evidencia.",
      },
      {
        title: "Contrasta tus ideas",
        description:
          "Consulta publicaciones científicas y fuentes institucionales. Registra la autoría, la fecha y el alcance de la información.",
      },
    ],
    source: {
      name: "Instituto Nacional de Biodiversidad",
      url: "https://www.biodiversidad.gob.ec/",
      description:
        "Punto de partida institucional para buscar información sobre biodiversidad del Ecuador.",
    },
  },
  areas: {
    eyebrow: "02 / EXPLORAR EL TERRITORIO",
    title: "Áreas Protegidas",
    intro:
      "Aprende a leer la información de un área protegida: su ubicación, sus objetivos de manejo y las fuentes que permiten estudiarla.",
    question:
      "¿Qué información necesitarías verificar antes de diseñar una clase sobre un área protegida?",
    steps: [
      {
        title: "Selecciona un área",
        description:
          "Consulta el portal oficial del Sistema Nacional de Áreas Protegidas. Registra el nombre oficial del área elegida y la fecha de consulta.",
      },
      {
        title: "Revisa su documentación",
        description:
          "Busca su ficha y su plan de manejo. Identifica qué información está disponible y qué preguntas quedan abiertas.",
      },
      {
        title: "Construye una ficha didáctica",
        description:
          "Organiza ubicación, objetivos de conservación y fuentes. Incluye únicamente datos que puedas respaldar con documentación.",
      },
    ],
    source: {
      name: "Sistema Nacional de Áreas Protegidas",
      url: "https://areasprotegidas.ambiente.gob.ec/",
      description:
        "Portal institucional de consulta. Esta versión de BIOSIG no incorpora todavía un catálogo ni límites geográficos oficiales.",
    },
  },
  conservacion: {
    eyebrow: "03 / REFLEXIONAR Y ACTUAR",
    title: "Conservación",
    intro:
      "Conecta la indagación científica con la enseñanza. Practica cómo analizar un problema y fundamentar una propuesta de cuidado de la biodiversidad.",
    question:
      "¿Cómo diferenciarías una propuesta de conservación basada en evidencia de una afirmación sin sustento?",
    steps: [
      {
        title: "Delimita un problema",
        description:
          "Selecciona una situación documentada de tu entorno. Identifica el lugar, las fuentes y las personas involucradas sin asumir causas que no se hayan investigado.",
      },
      {
        title: "Examina la evidencia",
        description:
          "Compara las explicaciones disponibles. Diferencia datos, hipótesis y opiniones, e identifica las limitaciones de cada fuente.",
      },
      {
        title: "Diseña una propuesta educativa",
        description:
          "Plantea un objetivo de aprendizaje, una actividad y una forma de evaluar lo aprendido. Explica qué evidencia respalda tu propuesta.",
      },
    ],
    source: {
      name: "Convenio sobre la Diversidad Biológica",
      url: "https://www.cbd.int/",
      description:
        "Referencia internacional para consultar documentos sobre biodiversidad y conservación.",
    },
  },
};
