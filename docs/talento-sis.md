# SIS — Landing de talento (`/talento-sis`)

## Qué incluye

- Landing independiente sin enlaces en menú ni footer global, con `noindex,nofollow`.
- Diseño coherente con `/(campaigns)/diagnostico-sgsst`: fondo oscuro, azul SIS, tarjetas glass y tipografía del sitio.
- Formulario responsive para nombre, correo, teléfono, ciudad, profesión, experiencia, modalidad, comentario y hoja de vida.
- Validación en cliente y servidor, consentimiento obligatorio, honeypot y límite básico de cinco intentos por IP/hora (por hash).
- PDFs de hasta 10 MB enviados **directamente desde el navegador** a Cloudinary, con firma emitida por backend.
- Cloudinary `resource_type=raw`, `type=authenticated` y `allowed_formats=pdf`. No publicar el archivo en modo `upload`.
- El servidor consulta la Admin API de Cloudinary para comprobar el archivo antes de pasar `PENDIENTE` a `RECIBIDA`.
- Tabla Prisma `PostulacionTalento` en MySQL y atribución de campaña UTM.
- Evento de conversión `talento_postulacion_recibida` en dataLayer y `CompleteRegistration` en Meta Pixel si está disponible.

## Variables de entorno para Vercel

El servidor utiliza, **sin exponer el secret al cliente**:

```env
DATABASE_URL=mysql://USUARIO:CLAVE@HOST:3306/BASE_DE_DATOS
CLOUDINARY_CLOUD_NAME=nombre_cloud
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

Alternativamente, Cloudinary se puede configurar mediante `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. La aplicación prioriza las variables individuales si están presentes. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` es una alternativa opcional para el nombre, **nunca** para el secret.

Verificar en Vercel que las variables estén disponibles en el entorno de deployment correcto (Production / Preview). No subir `.env` a Git.

## Cómo sincronizar la base de datos Hostinger

1. Hacer backup de MySQL desde Hostinger/phpMyAdmin.
2. Elegir **solo un** método:
   - Recomendado con el esquema Prisma actualizado: `npx prisma db push` usando `DATABASE_URL` del entorno correcto y revisar el resultado antes de confirmar. Luego `npx prisma generate`.
   - Manual en phpMyAdmin: pestaña SQL, pegar el bloque `CREATE TABLE` de `prisma/sql/postulaciones-talento.sql` y ejecutar. Después correr `npx prisma generate` **en el proyecto local**.
3. Para comprobar la tabla desde phpMyAdmin:
   ```sql
   SHOW TABLES LIKE 'PostulacionTalento';
   SELECT id, nombreCompleto, correo, estado, creadoEn
   FROM PostulacionTalento
   ORDER BY creadoEn DESC
   LIMIT 10;
   ```
4. Realizar un envío de prueba usando un PDF no sensible, verificar estado `RECIBIDA` en MySQL y archivo `raw/authenticated` en Cloudinary.

**No ejecutar `prisma migrate reset`.** El SQL manual no registra un historial de migraciones Prisma; adoptar después migraciones formales requiere reconciliar la base existente.

## Estados y tratamiento de archivos

- `PENDIENTE`: se crearon datos y una firma de carga con vigencia de 20 minutos; todavía **no** supone recepción.
- `RECIBIDA`: Cloudinary confirmó el archivo; ya se puede gestionar el perfil.
- `EN_REVISION`, `DESCARTADA`: disponibles para el flujo interno posterior.

El campo `hojaVidaPublicId` es **una referencia privada**, no un enlace público. No construir URLs de Cloudinary sin autenticación ni incluir la firma del archivo en respuestas públicas. El `tokenHash` es un hash SHA-256 del token de confirmación, no el token en claro.

La gestión interna de candidatos y descarga autorizada de CV no está incluida en esta fase. Se pueden revisar los registros en phpMyAdmin y los archivos desde la consola privada de Cloudinary.

## Seguridad y producción

- La ruta `/talento-sis` es **no listada**, no protegida por contraseña. Cualquier persona con el enlace puede visitarla, como requiere la pauta publicitaria.
- `noindex` indica a buscadores que no la indexen, pero no garantiza confidencialidad de la URL.
- Es recomendable configurar WAF/Turnstile o rate-limit distribuido si aumenta el tráfico malicioso; la cuota por IP es una defensa básica, no una garantía bajo concurrencia elevada.
- Las postulaciones `PENDIENTE` y archivos no confirmados **necesitan una tarea posterior de limpieza** según política de retención; esta entrega no automatiza la eliminación.
- Revisar y publicar una política de tratamiento de datos personales que cubra finalidad, responsable, derechos, plazo de conservación y contacto antes de iniciar la campaña.
- Cloudinary puede tener restricciones de entrega PDF según configuración de seguridad de la cuenta. Probar la subida y el acceso autenticado en el entorno real.
- No hay análisis antivirus de archivos en esta fase. Al gestionar hojas de vida desde Cloudinary, no redistribuir archivos sin verificación adicional.
- Antes de fusionar, ejecutar `npm ci`, `npx prisma validate`, `npx tsc --noEmit`, `npm run build` y realizar una prueba completa del formulario.

## Archivos

- `app/(campaigns)/talento-sis/page.tsx`: metadatos de la nueva ruta.
- `app/(campaigns)/talento-sis/_components/TalentoLanding.tsx`: página y formulario.
- `app/api/talento/iniciar/route.ts`: validación, persistencia inicial y firma de Cloudinary.
- `app/api/talento/confirmar/route.ts`: verificación real de Cloudinary y confirmación.
- `lib/talento.ts`: funciones compartidas solo de servidor.
- `prisma/schema.prisma`: enum y modelo para postulaciones.
- `prisma/sql/postulaciones-talento.sql`: alternativa para phpMyAdmin.

## Ejemplo de enlace de pauta

`https://TU_DOMINIO/talento-sis?utm_source=facebook&utm_medium=paid_social&utm_campaign=reclutamiento_sis`

Sustituir `TU_DOMINIO` por el dominio real del despliegue.
