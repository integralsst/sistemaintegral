# Administración de postulaciones

Ruta: `/dashboard/postulaciones`. Usa el modelo `PostulacionTalento` existente, sin migraciones y sin cambios al flujo de subida, confirmación, UTM o conversiones.

## Datos y autorización

Los endpoints bajo `/api/admin/postulaciones` verifican `verifySessionToken` y consultan el usuario actual: debe estar activo y conservar el rol `ADMIN`. Las respuestas, incluidos los errores y redirecciones, llevan `Cache-Control: private, no-store` y `Referrer-Policy: no-referrer`.

Solo se incluyen estados `RECIBIDA`, `EN_REVISION` y `DESCARTADA` con asset ID registrado, public ID no vacío y tamaño entre 100 bytes y 10 MB. `PENDIENTE` representa una subida sin confirmar y se excluye de listados, indicadores, detalles, cambios y documentos. El indicador de recibidas suma todos los estados confirmados; pendientes de revisión cuenta `RECIBIDA`.

Búsqueda por nombre/correo/profesión, ciudad, estado y paginación se ejecutan en MySQL. Las filas tienen selección explícita; no se entregan hashes, tokens ni identificadores de almacenamiento. Los cambios de estado aceptan exclusivamente `EN_REVISION` y `DESCARTADA`, verifican origen y persisten con Prisma. No existe endpoint de eliminación.

## PDF privado

Se usa el equivalente REST oficial de `private_download_url`: `https://api.cloudinary.com/v1_1/{cloud}/raw/download`, con `type=authenticated`, `public_id` completo incluyendo `.pdf`, `format=pdf`, `timestamp`, `expires_at` y firma SHA-1 del servidor. No se usa una firma permanente de la CDN.

Referencia: https://cloudinary.com/documentation/control_access_to_media#providing_time_limited_access_to_private_media_assets

- Cada autorización dura 120 segundos y requiere sesión administrativa.
- `POST /api/admin/postulaciones/{id}/pdf` entrega un enlace temporal únicamente al administrador.
- El navegador obtiene los bytes directamente de Cloudinary y comprueba el tamaño y la cabecera `%PDF-`. Convierte el contenido raw a un Blob `application/pdf` para el iframe; revoca su URL al cerrar el visor.
- El documento no pasa por una función de Vercel: se evita su límite de respuesta de 4.5 MB y se admiten los 10 MB del flujo existente.
- Abrir y descargar usan `GET` del endpoint protegido con `mode=inline|download`, que genera una autorización nueva y responde con una redirección `303`. No se guardan enlaces firmados en la base, almacenamiento del navegador, analítica o logs de la aplicación.
- Si CORS, la red o el visor nativo impiden la vista previa, el modal conserva las acciones Abrir/Descargar y permite reintentar con una autorización nueva.
- En celulares el modal ocupa la pantalla. El visor usa las capacidades PDF del navegador; si este no las ofrece, se puede abrir o descargar el archivo.

Variables de servidor: `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`, junto al nombre del cloud existente, o `CLOUDINARY_URL`. Nunca usar un prefijo `NEXT_PUBLIC_` para credenciales. No compartir valores en tickets o capturas.

## Validación de esta entrega

- `npx prisma validate`, `npx prisma generate`, `npx tsc --noEmit` y `npm run build`: correctos.
- `node --test tests/postulaciones.test.cjs`: 9 pruebas aisladas correctas. Cubren autorización en todos los handlers, validación estricta, selección de campos, consultas paginadas, exclusión de intentos sin confirmar, actualización de estados, CSRF y firma temporal/redirección PDF. No usan MySQL ni Cloudinary.
- ESLint en archivos modificados: correcto. El lint global conserva 17 errores previos y 15 advertencias fuera del alcance. Se verificó el contenido de `origin/main` con las mismas reglas: 18 errores y 16 advertencias. El usuario autorizó omitir esos errores globales si la compilación pasa.
- Chrome: 375, 390, 430, 768, 1024, 1440 y 1920 px; además 1024×480, 1440×600 y 1920×600. Se verificaron foto original cargada y proporcionada, posición constante al desplazar sobre foto/encabezado/formulario/borde, teclado, anclas, orden móvil, ausencia de overflow horizontal y retirada de las reglas de scrollbar al navegar fuera.
- 39 comprobaciones HTTP sobre el entorno local con MySQL real: acceso ADMIN, rechazos sin sesión/USER/sesión inválida/usuario inexistente, filtros inválidos, validación de cambios y documentos inexistentes. Sin mutaciones de registros.
- Dashboard real con estado vacío: Chrome a 375, 768 y 1440 px; redirección de acceso no autenticado.
- Prueba de interfaz aislada en Chrome a 375 y 1440 px: detalle, actualización visual del estado, PDF de prueba renderizado dentro del modal, pantalla completa móvil, cierre, error de red, acciones de fallback y nueva autorización al reintentar. Se interceptaron las respuestas solo dentro del navegador; no se insertaron filas ni se subieron archivos de prueba a servicios externos. Esta comprobación no sustituye la entrega real de Cloudinary.

### Comprobaciones pendientes con servicios reales

La tabla estaba vacía y el entorno local no tenía `CLOUDINARY_API_KEY` ni `CLOUDINARY_API_SECRET`. Por ello no se certifican todavía listado/paginación con filas reales, persistencia de cambios sobre un postulante real, entrega del PDF privado por Cloudinary, cabeceras CORS/inline, descarga ni rechazo de la firma expirada. No se introdujeron datos simulados en producción.

Para cerrar esa validación: configurar las credenciales en el entorno, registrar una postulación de prueba autorizada mediante el formulario existente y comprobar recepción, filtros, estados, apertura/descarga, caducidad a los 120 segundos y reapertura con nueva autorización. Completar también la revisión manual en Safari y la navegación táctil del PDF en iOS. Mantener el PR en borrador hasta completar estas comprobaciones.

## Compatibilidad de compilación Vercel

El build CI emplea temporalmente `next build --webpack` para evitar el fallo del cargador de Plus Jakarta Sans en Turbopack de Next.js 16.2.10. No cambia la tipografía ni la ejecución en producción. Volver a evaluar Turbopack cuando Next.js publique una corrección y se compruebe con un deployment Preview. Validar el comando `npm run build` en Vercel antes de fusionar.
