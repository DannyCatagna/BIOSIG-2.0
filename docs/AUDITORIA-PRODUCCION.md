# Auditoría de producción de BIOSIG 2.0

## Diagnóstico

El index.html de desarrollo contiene /src/main.tsx, como requiere Vite. Servir ese archivo directamente en un alojamiento estático no equivale a compilar React/TypeScript. El 404 reportado por el usuario es consistente con una publicación de la entrada de desarrollo. La compilación auditada genera dist/index.html con referencias exclusivamente a JavaScript y CSS compilados en /assets/.

No se confirmó de forma independiente el contenido actual de biosig2.vercel.app: la solicitud HTTPS fue rechazada por el proxy del entorno con CONNECT 403; la herramienta web tampoco pudo abrir la URL. Ese rechazo no es un código HTTP observado del sitio Vercel.

El rechazo de conexión a localhost es un problema separado: localhost de la computadora del usuario no es localhost del entorno remoto. La entrega estática no requiere mantener Vite activo.

## Cambios

- vercel.json: configura instalación, compilación Vite y salida dist para publicación desde código fuente.
- scripts/verify-production.mjs: comprueba la entrada compilada y los recursos, integrado en npm run build.
- tests/production.spec.ts y playwright.config.ts: pruebas sobre producción local o una URL mediante BIOSIG_BASE_URL.
- package.json y package-lock.json: dependencia de pruebas y comandos de validación.
- README.md: diferencia entre fuente y entrega estática, publicación sin instalación local.
- .gitignore: excluye credenciales de Vercel y resultados temporales de pruebas.
- Sin cambios en componentes, estilos, contenido educativo ni funcionalidades.

## Comprobaciones ejecutadas

1. npm ci: instalación reproducible desde el archivo de bloqueo.
2. npm run build: TypeScript, Vite y comprobación de recursos satisfactorios.
3. npm run lint: sin advertencias ni errores después de corregir un escape innecesario en el verificador.
4. Cuatro pruebas Playwright sobre dist con Vite preview, en 1440, 768, 390 y 320 px: satisfactorias.
5. Cuatro pruebas adicionales sobre el ZIP extraído y servido por Python como archivos estáticos, sin Vite: satisfactorias.
6. Se comprobaron cinco rutas, recarga, estado 404 de la interfaz, regreso al inicio, imagen, desbordamiento horizontal, errores de consola/JavaScript y solicitudes de recursos.
7. El navegador no solicitó /src/ ni /@vite/. Solicitó JavaScript compilado de /assets/.
8. El servidor estático respondió HTTP 200 al HTML; /src/main.tsx respondió 404, como corresponde a un archivo que no se incluye ni se solicita en producción.
9. Integridad ZIP comprobada; manifiesto SHA-256 generado por archivo.

## Entrega

Archivo: /workspace/shared/BIOSIG-2.0-produccion.zip
SHA-256: 525c7b37e16c98312fbd5f813cde6d559dab3470607a3a00db638efc9b3a94ca

Incluye una carpeta biosig2-produccion con index.html, assets/, favicon.svg, images/ y vercel.json estático. Este vercel.json desactiva la instalación y compilación porque los archivos ya están compilados; es distinto de la configuración del repositorio fuente.

La acción pendiente del propietario es extraer el ZIP y arrastrar la carpeta biosig2-produccion sobre el proyecto existente en su panel de Vercel. Vercel documenta que esto crea una nueva publicación de un proyecto previamente creado con Drop y sin conexión Git: https://vercel.com/docs/drop#keep-iterating-on-a-dropped-project

## Estado público

No se realizó un despliegue: no hay conector, token ni vinculación de proyecto Vercel disponibles en esta sesión. No se afirma que la URL pública esté reparada. La validación realizada cubre la entrega compilada, no una publicación posterior. Tras publicar, deben repetirse las comprobaciones contra la URL pública desde un entorno con acceso a ella.
