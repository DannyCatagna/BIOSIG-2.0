# Implementación WebGIS y guías de tesis

Estado de revisión técnica: 27 de octubre de 2026. Rama `feat/visor-sig-y-guias-tesis`, basada en main `4c42b32088619b3b11d78c7f154b4b75e5982561`.

**Resultado parcial de aceptación:** el mapa contextual auténtico, la navegación y los cuadernos están implementados y comprobados. La consulta SNAP está implementada, pero la aceptación de polígonos, búsqueda y comparación SNAP en vivo sigue pendiente: el dominio no está permitido por el proxy del entorno. No considerar este informe una certificación de que la guía 03 ya cumple el ejercicio con polígonos SNAP cargados.

## Cambio respecto al punto de partida

El laboratorio anterior era una interfaz sin mapa ni consulta geográfica. Ahora utiliza Leaflet con contexto real de Ecuador, Colombia y Perú (Natural Earth), encuadres de continente/Galápagos, zoom, desplazamiento, escala, leyenda y controles accesibles.

La capa SNAP se solicita explícitamente. La API usa únicamente la capa 0 del servicio indicado; consulta metadatos e identificadores y obtiene geometrías por lotes, en coordenadas geográficas. Valida errores, formato, coordenadas y completitud; convierte ArcGIS JSON a GeoJSON. No se inventan polígonos ni se incorpora una copia cuya licencia no esté confirmada.

El código ofrece búsqueda por `nam`, selección por polígono o lista accesible, ficha de atributos y comparación de dos registros. La leyenda distingue una capa sin cargar de una visible u oculta. Si falla la consulta se conserva el contexto territorial, se explica la incidencia y se permite reintentar o cancelar. No se confunde el número de registros descargados con un total nacional actualizado.

En escritorio, el mapa permanece junto al cuaderno mientras se desplaza la página; en móvil, los controles y la actividad se distribuyen verticalmente con retorno directo al mapa. Se carga el laboratorio por separado para evitar incluir Leaflet en la entrada inicial.

## Recorridos y práctica

Se mantienen las cinco secciones principales. No se altera ningún archivo académico original, título, texto, referencia, ocho temas, 24 subapartados ni cuatro guías.

- Cada tema enlaza su guía y práctica con `?tema=…&guia=…`.
- Cada guía permite abrir la práctica y volver al tema de origen.
- El selector permite cambiar de guía; elimina el origen incompatible para evitar retornos engañosos.
- Los cuadernos se almacenan por guía en el navegador; cambiar de ruta o recargar no pierde respuestas guardadas.
- Si localStorage está bloqueado se informa y se conserva la edición en memoria con descarga disponible.

| Guía | Experiencia implementada | Alcance pendiente |
| --- | --- | --- |
| 01 | Contexto continental/insular, selección y registro de dos territorios, observaciones y contraste ambiental | Selección SNAP requiere servicio; no hay mapa integrado de regiones naturales o ecosistemas. |
| 02 | Territorio de contexto, investigación en MapBiomas/GBIF/INABIO, respuestas que separan datos e hipótesis | No integra capas de cobertura temporal ni registros de especies. No calcula amenazas. |
| 03 | Flujo de carga SNAP, selección, fichas, comparación y cuaderno con norma/fuente | Falta superar prueba en vivo y contrastar definiciones de campos, unidades y vigencia legal. |
| 04 | Territorio seleccionado, documentación in situ/ex situ, participación comunitaria y conclusiones | Los casos biológicos/sociales requieren investigación documental; no existen límites comunitarios inventados. |

La evidencia TXT descargable incluye título de la guía, objetivo, territorios seleccionados con identificadores y atributos, fecha de consulta, procedencia, respuestas, conclusión, campos sin completar, límites y fecha de exportación. Puede imprimirse desde un editor de texto. No incluye captura cartográfica ni geometrías; no asigna calificación automática ni certifica mejoras de aprendizaje.

## Archivos y despliegue

- `src/components/gis/`: mapa, consulta, comparación y cuaderno.
- `src/data/gis/`: cliente SNAP y secuencias de práctica.
- `src/styles/gis.css`: distribución adaptable y controles del visor.
- `public/data/contexto-natural-earth.geojson`: extracción documentada de fuente auténtica de dominio público.
- `server/snap.mjs`: consultas acotadas, conversión y manejo de errores.
- `api/snap.mjs`: función para Vercel; `vite.config.ts` ofrece el mismo endpoint en dev/preview.
- `tests/gis.spec.ts` y `tests/server/snap.test.mjs`: validación funcional y de API.
- `docs/fuentes-cartograficas.md`: registro de metadatos, condiciones de uso, afirmaciones y pendientes.
- `docs/socializacion-tesis.md`: demostración, lista de verificación y encuesta Likert propuesta.

Se conserva la configuración de producción. La rama se prepara para revisión mediante Pull Request, sin merge ni despliegue de producción. Vercel necesita el repositorio completo para construir también `/api/snap`; subir solo `dist` no instala el backend. No se requieren claves de proveedor ni nuevas variables de producción.

## Verificaciones realizadas

- `npm run lint`: sin errores ni advertencias del código.
- `npm run build`: TypeScript, sincronización/verificación SHA de originales, Vite y comprobación de HTML/recursos de producción correctos; no se sirve `/src/main.tsx`.
- `npm run test:api`: cuatro pruebas satisfactorias de consultas acotadas, errores, proyección y conversión. La prueba geométrica utiliza Natural Earth auténtico, **no valida el SNAP**.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:production`: 19 pruebas satisfactorias y una de SNAP en vivo omitida por defecto. Incluye las cinco secciones a 1440/768/390/320 píxeles, temas/subapartados completos, guías/rúbricas, retorno/contexto, dibujo de geometrías contextuales reales, encuadres, edición/recarga, descarga, almacenamiento bloqueado, cancelación y fallo externo controlado.
- Ejecución separada con `BIOSIG_SNAP_LIVE=1`: **falló**, al no poder cargar el servicio. Verificación HTTP local: `/api/snap?mode=metadata` devolvió 502 controlado; la conexión directa al proveedor recibió 403 del proxy antes de llegar al servidor de origen. La política observada no incluía el dominio habilitado.
- Inspección visual mediante Chromium de escritorio y móvil. Ajustados contraste del encabezado de práctica, controles de zoom táctiles y separación de escala/atribución. Estas comprobaciones no equivalen a una certificación integral WCAG.
- Revisión de diff y búsqueda de patrones de credenciales: sin secretos añadidos; artefactos temporales, node_modules, dist y resultados locales de pruebas no se versionan.

No se usaron fixtures de SNAP para convertir una prueba bloqueada en satisfactoria. Los fallos de red de las pruebas específicas son intencionales para validar recuperación; no representan resultados científicos.

## Pendientes para cerrar la aceptación

1. Aplicar el permiso de red al entorno activo para `geovisorm.controlrecursosyenergia.gob.ec`; ejecutar la prueba real de SNAP. Si falla después de habilitarse, diagnosticar disponibilidad/protocolo del proveedor y ajustar solo con evidencia.
2. Comprobar la URL de preview, incluido `/api/snap`, desde una conexión que permita ese dominio. Un estado de compilación de Vercel no valida por sí solo el mapa publicado.
3. Confirmar con la autoridad los nombres/definiciones de campos, escala, fecha, licencia y vigencia jurídica. No convertir las abreviaturas en atributos oficiales sin diccionario.
4. Revisión docente de actividades y rúbricas; validación académica del instrumento antes de aplicarlo a estudiantes reales.
5. Capas adicionales solo después de comprobar sus datos, licencia, fechas y metodología. Google Earth Engine queda fuera del alcance; no se accedió al repositorio Tesis-2.
