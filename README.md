# BIOSIG 2.0

Aplicación educativa para estudiantes de quinto semestre de Pedagogía de las Ciencias Experimentales, Química y Biología. Lecturas académicas, visor geográfico y prácticas para explorar biodiversidad, áreas protegidas y conservación del Ecuador.

## Requisitos e instalación

Node.js 22.12 o superior (recomendado: Node.js 24 LTS) y npm.

```bash
npm ci
npm run dev
```

Abre http://localhost:5173. Para acceso desde otro dispositivo de la misma red o desde un entorno remoto con reenvío de puertos:

```bash
npm run dev -- --host 0.0.0.0
```

En un entorno remoto, abre el puerto 5173 mediante la vista de puertos del entorno. `localhost` en tu computadora no apunta automáticamente al servidor remoto.

## Validación y producción

```bash
npm run lint
npm run build
npm run preview -- --host 0.0.0.0
```

La compilación comprueba TypeScript y genera `dist/`. La vista previa usa http://localhost:4173. No es un servidor de producción. `HashRouter` permite navegar y recargar rutas sin configurar redirecciones en un hosting estático. La configuración actual asume que la aplicación se sirve desde la raíz del dominio.

## Estructura

```text
public/
  favicon.svg
  images/andes.svg          Ilustración conceptual local
src/
  app/App.tsx              Definición de rutas
  components/
    layout/Layout.tsx      Cabecera, menú responsive, contenido y pie
    ui/                    Botón de enlace y encabezado reutilizables
  data/                    Navegación y guías educativas tipadas
  pages/                   Inicio, aprendizaje, laboratorio y página 404
  styles/global.css        Paleta, componentes y reglas responsive
  main.tsx                 Entrada React y router
```

Tecnologías: React, TypeScript estricto, Vite, React Router y Lucide (iconos). Tipografías del sistema y Georgia, sin servicios externos de fuentes ni imágenes. Paleta: verde bosque `#194d3b`, verde natural `#5b7954`, azul noche `#10272f`, marfil `#faf9f4`, tierra andina `#947155`.

## Alcance de esta etapa

- Cinco secciones navegables, menú móvil, estado de ruta activa y página 404.
- Inicio con ilustración conceptual original inspirada en los Andes: no es una fotografía ni cartografía.
- Guías iniciales de indagación, preguntas para el aula y enlaces institucionales de consulta.
- Laboratorio SIG con Leaflet, contexto real Natural Earth, consulta SNAP mediante `/api/snap`, selección, búsqueda y comparación de atributos. Cuatro cuadernos con almacenamiento local y evidencia TXT. La conexión SNAP requiere disponibilidad del proveedor; no hay cuentas, especies simuladas ni análisis automáticos.
- Navegación por teclado, enlace para saltar al contenido, foco al cambiar de ruta, etiquetas accesibles y respeto de movimiento reducido.

Los textos son propuestas didácticas, no un inventario científico. No se incluyen cifras de especies, superficies, delimitaciones ni catálogos sin verificar. Los portales de INABIO, SNAP y el Convenio sobre la Diversidad Biológica son puntos de consulta; antes de integrar datos habrá que comprobar publicaciones, fechas, licencias y metadatos. No existe sincronización con esas fuentes en esta etapa.

## Ramas

`main` contiene las mejoras académicas aprobadas. El visor y las prácticas de esta entrega se revisan en `feat/visor-sig-y-guias-tesis`, sin fusión automática. El repositorio Tesis-2 no forma parte de este proyecto.

## Publicación en Vercel

No publiques el `index.html` de la raíz como archivo estático: es la entrada de desarrollo y referencia `/src/main.tsx`. Vite transforma esa entrada en `dist/index.html`, que carga el JavaScript compilado de `dist/assets/`.

El `vercel.json` de este repositorio configura Vite, `npm ci`, `npm run build` y salida `dist` para despliegues desde código fuente. El router usa fragmentos `/#/...`, por lo que no necesita una regla que reescriba todas las solicitudes a HTML.

Esta versión utiliza una función Node en `api/snap.mjs`. Publica desde el repositorio completo conectado a Vercel, usando una rama de revisión para obtener una vista previa. El paquete estático de etapas anteriores no incluye esa API y no permite consultar SNAP. No es necesario instalar Node.js en el dispositivo del estudiante. La incorporación a producción requiere revisión y autorización.

## Pruebas de producción para mantenimiento

La compilación ejecuta `scripts/verify-production.mjs`: rechaza entradas de desarrollo y comprueba que existan los recursos enlazados. Las pruebas Playwright sirven `dist` y comprueban navegación, recarga, imágenes, errores de consola/red y ausencia de solicitudes a `/src/` en cuatro tamaños de pantalla.

```bash
npm run build
npm run test:production
```

Playwright requiere Chromium instalado en el entorno de pruebas; `CHROMIUM_PATH` permite usar un ejecutable existente. `BIOSIG_BASE_URL` permite comprobar un despliegue público con las mismas pruebas, sin iniciar un servidor local. Estas instrucciones son para mantenimiento: el usuario que recibe el paquete compilado no necesita ejecutarlas.

Una respuesta HTTP 200 dentro del entorno remoto no garantiza que `localhost` sea accesible desde la computadora del usuario. La URL de Vercel es independiente del servidor de desarrollo y debe verificarse después de publicar.

## Integración académica de unidades 2 y 3

La rama `integracion-academica` incorpora el paquete académico aportado por el usuario y el documento Word unificado. Se conservan las cinco secciones principales. Ecuador Megadiverso y Conservación incluyen índices de unidad y lecturas completas; Áreas Protegidas enlaza los temas relacionados; Laboratorio SIG permite consultar las cuatro guías, sin simular mapas ni análisis.

### Contenidos y trazabilidad

- `content/academic/`: ocho Markdown de temas, cuatro guías, dos CSV y Word original; `manifest.json` conserva sus huellas SHA-256.
- `content/academic/control/CONCORDANCIA.json`: contraste de todos los párrafos Markdown y campos CSV con el texto del Word.
- `LEEME.md` y `control/REVISION_EDITORIAL.md`: extractos de las secciones I y VII del Word; no se recibieron como archivos independientes.
- `scripts/sync-academic-content.mjs`: valida integridad, numeración, relaciones y criterios; genera `src/data/academic/generated.json`. Se ejecuta antes de desarrollo y durante la compilación. No editar el JSON generado.
- `src/data/academic/types.ts`: unidades, lecturas, subtemas, fuentes, actividades, guías, evidencias y criterios de evaluación.
- `src/components/academic/`: lectura Markdown sin ejecutar HTML, avisos de revisión, referencias, guías y rúbrica compartida.
- `src/pages/academic/`: índices, temas, guías, referencias y registro editorial.

Cada tema admite enlaces directos a subapartados mediante `?apartado=2.1.1` dentro de la ruta HashRouter. La recarga y el foco del encabezado conservan la sección seleccionada. Las páginas académicas se cargan de forma diferida.

Los originales importados se mantienen íntegros. Una revisión intencional de esos archivos requiere revisar también el manifiesto y documentar la nueva versión; la compilación rechazará cambios accidentales.

### Estado académico

Todo el material está marcado como borrador. Los títulos repetidos se conservan, con diferenciación pedagógica expresamente identificada como propuesta. El paquete aún requiere cotejo con el sílabo, revisión científica, referencias por afirmación, comprobación normativa y validación docente. Las guías contienen criterios ponderados sobre diez puntos, no descriptores completos de niveles de desempeño. La fundamentación se vincula a los temas, sin inventar textos adicionales.

La ruta `/#/revision-editorial` presenta los doce pendientes del documento, observaciones de integración y la matriz completa. Es una vista de trabajo sin autenticación, no un espacio privado. No incorpora acciones ficticias de aprobación. La disponibilidad externa o vigencia científica de los enlaces no está certificada por las pruebas de navegación.

No se incorporó Google Earth Engine, cartografía inventada, persistencia de respuestas ni afirmaciones sobre mejora del aprendizaje. La valoración de utilidad y usabilidad de la tesis permanece separada de los criterios formativos de las guías.

Consulta `docs/INTEGRACION-ACADEMICA.md` para el detalle de archivos, comprobaciones y pendientes. Esta integración no se ha publicado ni fusionado con `main`; los ZIP de producción de entregas anteriores no se actualizaron.

## Visor y prácticas SIG

Abre **Laboratorio SIG**, elige una guía y pulsa **Cargar capa SNAP**. Usa el mapa o el buscador para seleccionar un área, consultar su ficha y añadirla a la comparación o al cuaderno. La base contextual se distribuye localmente; SNAP se consulta en vivo. Si falla, la interfaz muestra el error y permite reintentar.

Las respuestas se guardan solo en el navegador, por guía. Se pueden descargar en TXT e imprimir desde un editor de texto. En dispositivos compartidos, borra el cuaderno después de descargarlo. La descarga no incluye geometrías ni captura cartográfica.

- [Fuentes, licencias, proyección y límites](docs/fuentes-cartograficas.md).
- [Guion de socialización e instrumento Likert pendiente de validación](docs/socializacion-tesis.md).
- [Implementación y validación WebGIS](docs/WEBGIS-TESIS.md).

### Backend y pruebas

Vercel ejecuta `api/snap.mjs` como función Node; `server/snap.mjs` comparte el manejador con Vite en desarrollo y preview. No se requieren claves o variables de producción. **Publicar solamente la carpeta dist en un servidor estático no incluye la API**: importa el repositorio completo en Vercel.

Comandos reales: `npm run lint`, `npm run test:api`, `npm run build` y `npm run test:production`. Las pruebas de navegador requieren Chromium de Playwright o `CHROMIUM_PATH` apuntando a un Chromium instalado.

Prueba cartográfica de aceptación: `BIOSIG_SNAP_LIVE=1 npm run test:production -- --grep "SNAP EN VIVO"`. Realiza consultas auténticas, no sustituye el proveedor con fixtures. Sin esa variable se indica explícitamente como omitida y no se considera validación del SNAP.

En entornos gestionados con proxy, habilita el dominio `geovisorm.controlrecursosyenergia.gob.ec` en la configuración de red. Node 24 permite respetar el proxy con `NODE_USE_ENV_PROXY=1` al iniciar Vite. No desactives la verificación TLS ni intentes eludir la política de red. Esta configuración local no modifica Vercel.
