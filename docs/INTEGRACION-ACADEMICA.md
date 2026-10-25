# Integración académica de BIOSIG 2.0

## Alcance y autorización

Implementación solicitada expresamente por el usuario en el texto pegado y ratificada al adjuntar el Word: integrar contenidos respetando títulos, guías y referencias. Las instrucciones históricas incluidas dentro del documento son material del paquete, no sustituyen la solicitud actual de integración.

Rama local: `integracion-academica`, creada desde `desarrollo-inicial`. No se modificó `main`, no hubo fusión, push ni publicación. No se accedió a Tesis-2. No se implementó Google Earth Engine.

## Material recibido y concordancia

Se recibieron ocho temas Markdown, cuatro guías Markdown, matriz_curricular.csv y fuentes.csv. Los trece textos pegados son copias idénticas de la solicitud (SHA-256 coincidente). Después se recibió BIOSIG_2_0_Contenido_Academico_Completo_Para_Codex.docx.

Se comparó cada párrafo de los doce Markdown (sin los marcadores de formato) y cada campo de ambos CSV con el texto extraído del Word: no se detectaron ausencias. Las secciones I y VII del Word aportaron las orientaciones y el registro editorial que no llegaron como archivos separados. Sus extractos se guardaron con procedencia identificada; no se presentan como archivos originales adjuntos.

Los archivos importados y el Word se conservan bajo `content/academic/`; un manifiesto SHA-256 comprueba su integridad en cada compilación. `control/CONCORDANCIA.json` registra la comparación; `control/DOCX-extraido.txt` conserva el texto extraído.

## Qué se integró

- Dos unidades y ocho lecturas completas, sin sustituirlas por tarjetas o resúmenes.
- Veinticuatro subapartados con identificadores originales y enlaces directos compatibles con HashRouter.
- Conservación de títulos repetidos, mayúsculas, grafías y contenido. Las seis etiquetas que distinguen subapartados repetidos están identificadas como diferenciación didáctica propuesta.
- Navegación anterior/siguiente entre temas y vínculo de retorno al índice.
- Cuatro guías accesibles desde el laboratorio y sus temas; enlaces de regreso a las lecturas asociadas.
- Objetivos, recursos, procedimientos, preguntas, productos, inclusión y advertencias originales de las guías.
- Tabla compartida de los cuatro criterios ponderados, con total de diez puntos. No se inventaron niveles de desempeño.
- Ocho referencias con identificadores S01–S08 y todos los campos del CSV, incluidos los avisos de verificación. No se añadieron autores, DOI, fechas ni supuestas validaciones.
- Registro editorial con doce pendientes originales, filtro, orientaciones del Word y matriz curricular completa.
- Conservación de las cinco secciones. Áreas Protegidas mantiene la orientación inicial y añade accesos a lecturas relacionadas.
- Identidad visual clara en lecturas y guías; área oscura de laboratorio mantenida; índices laterales en escritorio y disposición de una columna en móvil.
- Foco accesible al navegar a subapartados, recarga de enlaces directos y tablas desplazables sin desbordar la página.

## Archivos nuevos

- `content/academic/`: originales, Word, extractos, concordancia y manifiesto.
- `scripts/sync-academic-content.mjs`: generación reproducible y validaciones de contenido.
- `src/data/academic/{types.ts,index.ts,generated.json}`: entidades, relaciones y datos generados.
- `src/components/academic/{AcademicMarkdown,AcademicNotice,GuideList,ReferenceList,RubricTable}.tsx`.
- `src/pages/academic/{UnitPage,TopicPage,GuidePage,ReferencesPage,EditorialPage}.tsx`.
- `src/hooks/useReadingPosition.ts`.
- `src/styles/academic.css`.
- `tests/academic.spec.ts`.
- Este informe.

## Archivos existentes ajustados

- `src/app/App.tsx`: nuevas rutas y carga diferida de páginas académicas.
- `src/components/layout/Layout.tsx`: títulos, estado activo en rutas hijas, enlaces de referencias y revisión, espera accesible de lectura.
- `src/pages/HomePage.tsx`: identificación de las unidades 2 y 3 en las tarjetas existentes.
- `src/pages/LearningPage.tsx`: conexiones de Áreas Protegidas con las lecturas.
- `src/pages/LabPage.tsx`: acceso a guías manteniendo el aviso de visor pendiente.
- `src/main.tsx`: estilos académicos.
- `package.json` y `package-lock.json`: react-markdown, remark-gfm, csv-parse y generación académica durante desarrollo/compilación.
- `tests/production.spec.ts`: títulos de las unidades actualizados.
- `README.md`: arquitectura, procedencia y alcance.
- `scripts/verify-production.mjs`: formato; se mantiene el verificador previo de compilación.

## Validaciones realizadas

1. Instalación de dependencias completada.
2. `npm run content:sync`: integridad SHA-256, ocho temas, 24 identificadores únicos, tres subapartados por tema, correspondencia literal con matriz, ocho fuentes HTTPS, vínculos de guías a temas y criterios que suman diez puntos.
3. `npm run build`: generación de contenido, TypeScript estricto, Vite y verificación de recursos de producción, satisfactorios. Se aplicó carga diferida para eliminar el aviso inicial de un único bloque mayor de 500 kB.
4. `npm run lint`: satisfactorio.
5. `CHROMIUM_PATH=/usr/bin/chromium npm run test:production`: **10 pruebas satisfactorias** sobre la versión compilada, 41,5 s en esta ejecución.
6. Lecturas completas y navegación de los 24 subapartados, incluidos foco y recarga: escritorio y móvil.
7. Cuatro guías: todos sus párrafos de contenido, procedimientos, evidencias, tabla de criterios y enlaces a temas.
8. Índices de unidades: cuatro temas y doce subapartados por unidad.
9. Fuentes: ocho fichas, correspondencia de metadatos y URL literal del CSV, enlaces externos que no se convierten en rutas internas.
10. Anterior/siguiente entre temas, sección principal activa, rutas inválidas y control editorial.
11. Cinco secciones principales a 1440, 768, 390 y 320 px; sin errores de JavaScript ni solicitudes fallidas en las pruebas.
12. Revisión visual de una lectura en escritorio, tabla de evaluación en móvil y ausencia de desbordamiento del registro editorial en móvil.

El primer intento de pruebas requirió corregir el atributo de importación JSON del archivo de pruebas para Node 24. La ejecución final fue satisfactoria. Estas pruebas no validan hechos científicos, vigencia legal, disponibilidad de sitios externos ni resultados de aprendizaje.

## Pendientes reales

- Los temas son borradores condensados del paquete; no se ampliaron inventando información.
- Revisar los 24 títulos y resultados propuestos contra el sílabo original.
- Añadir citas por afirmación y documentos específicos; comprobar fechas, licencias y vigencia normativa.
- Revisar correspondencia entre fuentes y contenidos. S03 se refiere a carbono/estratos forestales y no suple automáticamente hidrografía o límites SNAP; UICN se menciona en 2.4 sin una entrada específica en el CSV.
- Definir fundamentación independiente de las guías si se requiere, y descriptores de niveles de desempeño de las rúbricas. La fundamentación actual remite a los temas asociados.
- Seleccionar casos y capas auténticas; integrar y validar visor y herramientas. Actualmente no hay mapa interactivo ni análisis espacial implementado.
- Resolver erratas y puntuación con revisión docente sin alterar silenciosamente títulos recibidos.
- El registro editorial es accesible sin autenticación; no contiene información privada ni simula aprobaciones.
- La evaluación descriptiva de percepciones de utilidad/usabilidad permanece independiente de la evaluación formativa. No se afirman mejoras causales de aprendizaje.
- No se verificó esta versión en una URL pública: no se publicó por instrucción del usuario. Los paquetes de producción anteriores corresponden a versiones anteriores.

## Rutas de revisión

- `/#/ecuador-megadiverso` y `/#/conservacion`: índices de unidades.
- `/#/ecuador-megadiverso/tema/2.1?apartado=2.1.1`: ejemplo de subapartado.
- `/#/laboratorio-sig`: índice de guías y laboratorio pendiente.
- `/#/laboratorio-sig/guias/01`: primera guía.
- `/#/referencias` y `/#/referencias/S01`: registro y detalle.
- `/#/revision-editorial`: pendientes y matriz.

La vista previa se probó dentro del entorno remoto; no se confunde su localhost con una dirección pública accesible desde la computadora del usuario.
