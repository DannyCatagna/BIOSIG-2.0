# Registro de fuentes cartográficas y decisiones de uso

Revisión: 26 de octubre de 2026. Este registro describe evidencia consultada y límites; no certifica actualidad jurídica o integridad nacional. La fecha de consulta no es la fecha del conjunto.

## SNAP: servicio indicado por el investigador

- URL: https://geovisorm.controlrecursosyenergia.gob.ec/arcgis/rest/services/MAAE_WGS84_17S/MapServer/0
- Metadatos: misma URL con `?f=pjson`.
- Publicador del endpoint: dominio institucional de Control de Recursos y Energía. Autoría/créditos declarados en ArcGIS: MAAE. Nombre de capa: Sistema Nacional de Áreas Protegidas. Tipo: Feature Layer, esriGeometryPolygon.
- Evidencia consultada: metadatos públicos de capa y MapServer mediante consulta web. La descripción identifica SNAP; no se mezclan las capas 1, 2 y 3 (patrimonio forestal, bosques y vegetación protectora, zonas intangibles).
- CRS original: EPSG:32717, WGS 84 / UTM 17S. Consulta de geometrías con `outSR=4326`; Leaflet presenta el mapa en Web Mercator EPSG:3857. No se reproyectan coordenadas UTM como si fueran grados.
- Formatos anunciados: JSON y AMF. No se presupone soporte GeoJSON. Se convierte ArcGIS JSON a GeoJSON mediante Terraformer, conservando polígonos y huecos.
- Fecha, actualización, escala de levantamiento y licencia específica: **no documentadas en los metadatos consultados**. Los valores minScale/maxScale de visualización no se interpretan como escala de levantamiento. `esc` se conserva como atributo sin unidad o diccionario confirmado.
- Campos: `objectid`, `codigo_de_`, `csnap`, `nam`, `map`, `ror`, `rom`, `subap`, `esc`, `psj`, `are`, `edel`, `txt`, `shape`, `st_area(shape)`, `st_length(shape)`. La interfaz utiliza `nam` como etiqueta de búsqueda si está poblado y muestra los demás campos con sus nombres/aliases originales. No transforma `map` en categoría legal, `subap` en un subsistema confirmado ni `are` en hectáreas. No deriva provincias.
- La identificación institucional como SNAP no acredita la vigencia legal de cada entidad. Deben contrastarse registros y actos normativos con la autoridad ambiental antes de atribuir una categoría vigente o un inventario actual.
- Uso técnico: consulta pública, endpoint fijo `/api/snap`, solicitudes GET acotadas; JSON convertido por el backend. No se añade un archivo de polígonos SNAP al repositorio, no se habilita descarga de geometrías ni se presupone licencia de redistribución. La evidencia descargable contiene atributos consultados, identificadores y procedencia para uso académico.
- Límites: timeout de 18 segundos por consulta; hasta 8 identificadores por lote; respuesta de hasta 3,5 MB; máximo de 1.000 identificadores; caché de cinco minutos en memoria del proceso; sin almacenamiento permanente del SNAP en el servidor. La aplicación comprueba integridad por identificadores y no presenta una carga parcial como completa.
- Generalización: `maxAllowableOffset=0.0005` en unidades del CRS de salida (grados). Es una simplificación de visualización solicitada al proveedor, no una estimación de exactitud. No se calculan superficies ni se ofrecen usos catastrales.
- Estado de verificación: esquema y procedencia comprobados; descarga y consulta integral de polígonos **pendientes de acceso de red**. El proxy del entorno devolvió 403 antes de llegar al proveedor. Esto no demuestra que el servicio sea inaccesible para todos los usuarios. La prueba `BIOSIG_SNAP_LIVE=1` debe superar carga, selección, búsqueda, comparación y exportación con respuestas auténticas para cerrar la aceptación.

## Mapa contextual integrado: Natural Earth

- Fuente: https://www.naturalearthdata.com/ ; repositorio oficial https://github.com/nvkelso/natural-earth-vector
- Archivo origen fijado: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_admin_0_countries.geojson
- SHA-256 del archivo de origen descargado: `239eec57ac17f100a11e2536cffc56752c318b50ae765b0918ff7aab4ce8f255`.
- Descarga: 2026-10-26; revisión Git fijada, sin atribuir una fecha de levantamiento o actualización legal.
- Extracción local: features `ADM0_A3` ECU, COL y PER, geometrías originales completas; se conservan los atributos ADM0_A3, NAME_ES y NAME. Archivo `public/data/contexto-natural-earth.geojson`.
- Escala: **1:10 millones**; “10m” en el nombre no significa resolución de diez metros. Coordenadas geográficas GeoJSON, longitud/latitud WGS84. Incluye geometrías de Ecuador continental y Galápagos.
- Condiciones: dominio público, https://www.naturalearthdata.com/about/terms-of-use/ . Atribución visible voluntaria.
- Límites: contexto de pequeña escala, fronteras de facto de referencia; no se presenta como cartografía oficial ecuatoriana, como límites SNAP ni como dato catastral. No incorpora regiones naturales, elevación o registros biológicos. Los encuadres de los botones son ajustes de cámara, no geometrías de investigación.

## Fuentes investigadas, no integradas como capas

| Fuente | Evidencia y condiciones | Uso actual y pendientes |
| --- | --- | --- |
| [IEDG](https://iedg.presidencia.gob.ec/servicios/geoservicios/) | La consulta devolvió 502. No se obtuvo un catálogo utilizable para confirmar endpoint, CRS o licencia. | No se integra. Revisar disponibilidad y metadatos de un conjunto específico. |
| [MapBiomas Ecuador](https://ecuador.mapbiomas.org/) | Portal consultado: mapas por colección, leyendas y metodología; aviso CC BY 4.0. | Enlace real desde prácticas 01 y 02. Antes de integrar: elegir colección y producto, fechas, clasificación, resolución, licencia del archivo y método de comparación. No se afirma haber descargado capas ni calculado cambios. |
| [GBIF](https://www.gbif.org/terms) | Condiciones verificadas: datos de ocurrencias con CC0, CC BY o CC BY-NC según conjunto; GBIF no garantiza exactitud. | Enlace a consulta de Ecuador desde práctica 02. No se descargaron registros ni se dibujan puntos. Exigir licencia individual, cita de descarga, incertidumbre, fecha y revisión de datos sensibles. La ausencia de registros no prueba ausencia de especies. |
| [INABIO](https://inabio.biodiversidad.gob.ec/) | La consulta del portal agotó tiempo de espera. No se verificó un conjunto cartográfico ni sus condiciones. | Acceso externo para investigación documental. Revisar artículos, colecciones y metadatos específicos antes de afirmar presencia de especies o casos de conservación. |

## Afirmaciones y estado de validación

| Afirmación | Estado | Evidencia o condición pendiente |
| --- | --- | --- |
| El servicio 0 se identifica como SNAP y contiene polígonos en EPSG:32717 | Verificada en metadatos | URL de capa; revisar de nuevo ante cambios de esquema. |
| Todo polígono corresponde a un área jurídicamente vigente | Pendiente; no se afirma | Contraste individual con decretos y registros oficiales actualizados. |
| `are` expresa hectáreas, `map` una categoría, `subap` un subsistema | Pendiente; no se infiere | Diccionario oficial y documentación de unidades. |
| La base contextual contiene continente e islas | Verificada en archivo auténtico | Geometrías ECU de Natural Earth y prueba de coordenadas/representación. |
| La consulta SNAP funciona de extremo a extremo en este entorno | Pendiente | Dominio bloqueado por proxy; requiere prueba real. |
| La plataforma demuestra mejoras de aprendizaje | No evaluada; fuera del diseño declarado | La investigación prevista describe percepciones de utilidad y usabilidad. |

Las referencias académicas anteriores permanecen íntegras. Véase también `REVISION-BIBLIOGRAFICA.md`; no se presenta la incorporación de un enlace como corroboración de todas las afirmaciones asociadas.
