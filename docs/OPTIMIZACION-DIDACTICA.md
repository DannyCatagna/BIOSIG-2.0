# Optimización didáctica para revisión

## Auditoría y cambios

Se trabajó exclusivamente sobre BIOSIG-2.0 y se conservó la integración académica. Antes de editar se comprobó Git limpio. La rama de trabajo es feat/optimizacion-didactica-biosig.

Problemas encontrados: Inicio con tres tarjetas sin priorizar las dos unidades; falta de acceso directo a prácticas; índices extensos antes del contenido en móvil; lectura sin etapas didácticas; guías sin retorno contextual; ausencia de recuperación ante fallos al cargar páginas diferidas.

Implementación:
- Inicio: dos unidades, accesos Aprender, Explorar mapa (en preparación) y Realizar prácticas.
- Temas: Comprender, Explorar, Aplicar, Comprobar con enlaces, foco y URLs recargables. Textos completos y referencias originales preservados; se reordenaron las secciones, no se resumieron.
- Índice plegable (compacto inicialmente en móvil); procedencia accesible bajo un desplegable.
- Guías: secuencia numerada y retorno al tema mediante parámetro origen validado contra los temas de la guía, conservado al navegar por apartados y recargar.
- Laboratorio: retorno al tema y acceso directo a las guías. No existe todavía mapa interactivo en el código auditado; no se fabricaron capas, herramientas o resultados. Se conserva la interfaz de preparación.
- Accesibilidad: controles principales de lectura de 44 px, foco visible, navegación sin paneles superpuestos y etapas en dos columnas en móvil. No se afirma certificación WCAG 2.2 AA; falta auditoría completa con tecnologías de asistencia.
- Recuperación de errores de páginas diferidas con recarga y regreso al Inicio.

Archivos: HomePage, LabPage, TopicPage, GuidePage, GuideList, Layout, academic.css; nuevos ReadingIndex y PageErrorBoundary; pruebas academic y didactic. No se cambiaron rutas principales, inventarios originales, la configuración de producción ni Google Earth Engine. No se accedió a Tesis-2.

## Verificación

npm run build: TypeScript, Vite y validación de integridad académica satisfactorios.
npm run lint: satisfactorio.
10 pruebas existentes aprobadas (cinco secciones, ocho temas, 24 subapartados, cuatro guías, referencias, recargas, escritorio/móvil).
2 pruebas nuevas aprobadas (recorrido móvil completo y fallo/recuperación de chunk).
Revisión visual de Inicio en escritorio y tema en teléfono de 390 px.
Las pruebas no demuestran mejora de aprendizaje ni validan la vigencia científica de los contenidos.

## Bibliografía y limitaciones

Ver REVISION-BIBLIOGRAFICA.md: Bearman et al., Fast y Hossain y Mestanza-Ramón et al. Se distingue identificación de metadatos de comprobación de afirmaciones. Las fuentes no accesibles, la normativa vigente y las cifras actuales quedan pendientes. Los textos académicos no se modificaron a partir de fragmentos de búsqueda.

## Revisión antes de producción

Cambios preparados para rama y Pull Request hacia main, sin fusión. No se ejecuta despliegue de producción. Las capturas son evidencias locales, no sustituyen la validación de una URL pública. No hay credenciales Vercel en este entorno; se revisará si GitHub devuelve un estado de Preview.
