# Farmacia App — Backend

API REST en Node.js/Express con PostgreSQL para la aplicación de farmacia (autenticación, usuarios, productos, categorías, ventas y domicilios).

## Estructura

- `server.js`: punto de entrada del servidor Express.
- `config/`: configuración (conexión a PostgreSQL, etc.).
- `features/`: rutas y lógica de negocio por módulo.
- `database/database.sql`: esquema completo de la base de datos (tablas, triggers, datos de prueba).
- `scripts/applyDatabase.js`: crea la base de datos si no existe y aplica `database/database.sql`.
- `utils/`: utilidades compartidas.

## Requisitos previos

- Node.js 20.x (o compatible)
- npm
- PostgreSQL

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en esta carpeta:

```env
PORT=5000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=tu_contraseña_postgres
PGDATABASE=farmacia_db

JWT_SECRET=una_clave_secreta_segura
```

> En producción también se admite `DATABASE_URL`/`DB_URL` como cadena de conexión única, `DB_SSL=true` para habilitar SSL, y `ALLOWED_ORIGINS` para CORS.

### 3. Inicializar la base de datos

Crea la base de datos (si no existe) y aplica el esquema de `database/database.sql`:

```bash
npm run db:apply
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:5000`. Verifica con `GET /health`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `NODE_ENV` | `development` o `production` |
| `PGHOST` | Host de PostgreSQL |
| `PGPORT` | Puerto de PostgreSQL |
| `PGUSER` | Usuario de PostgreSQL |
| `PGPASSWORD` | Contraseña de PostgreSQL |
| `PGDATABASE` | Nombre de la base de datos |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `DATABASE_URL` / `DB_URL` | Alternativa de conexión en una sola cadena |
| `DB_SSL` | `true`/`false` para habilitar SSL en PostgreSQL |
| `ALLOWED_ORIGINS` | Orígenes permitidos por CORS (producción) |

## Comandos disponibles

- `npm install`: instala dependencias.
- `npm run dev`: inicia el servidor con `nodemon`.
- `npm start`: inicia el servidor con `node server.js`.
- `npm run db:apply`: crea la base de datos y aplica el esquema.
- `npm run start:railway`: aplica el esquema y arranca el servidor (usado en Railway).

## Rutas principales de la API

- `GET /`: estado de la API.
- `GET /health`: health check.
- `POST /api/auth/...`: autenticación.
- `GET/POST/PUT/DELETE /api/usuarios`: gestión de usuarios.
- `GET/POST/PUT/DELETE /api/productos`: gestión de productos. Los `GET` (listar/ver) son públicos, sin necesidad de login, para permitir el catálogo público de la tienda; crear/editar/eliminar siguen requiriendo admin.
- `GET/POST/PUT/DELETE /api/categorias`: gestión de categorías. Los `GET` también son públicos por el mismo motivo.
- `GET/POST/PUT/DELETE /api/ventas`: gestión de ventas. `POST /api/ventas` acepta un campo opcional `domicilio` (`{ direccion, direccion2, barrio, ciudad, telefono, notas }`) para registrar una entrega a domicilio junto con la venta.
- `GET /api/ventas/mis-compras`: historial de compras del usuario autenticado (con o sin domicilio).
- `GET /api/domicilios`: lista todos los domicilios (admin).
- `GET /api/domicilios/mis-domicilios`: domicilios del usuario autenticado (como comprador).
- `GET /api/domicilios/mis-entregas`: domicilios asignados al domiciliario autenticado.
- `PATCH /api/domicilios/:id/asignar`: asigna un usuario con rol `domiciliario` a un domicilio (admin). Body: `{ repartidor_id }` (o `null` para desasignar).
- `PATCH /api/domicilios/:id/estado`: cambia el estado de un domicilio (admin, o el domiciliario asignado únicamente sobre sus propios domicilios). Estados válidos: `pendiente`, `en_camino`, `entregado`, `cancelado`.

## Roles y permisos

- **admin**: acceso completo (productos, categorías, usuarios, ver todas las ventas y domicilios, asignar domiciliarios, cambiar estado de domicilios).
- **usuario**: puede ver productos/categorías, crear ventas (incluyendo con domicilio), ver su propio historial de compras (`mis-compras`) y sus propios domicilios (`mis-domicilios`).
- **domiciliario**: puede ver los domicilios que le fueron asignados (`mis-entregas`) y cambiar el estado únicamente de esos.

## Despliegue

Ver [`RAILWAY_DEPLOY.md`](./RAILWAY_DEPLOY.md) para Railway o [`render.yaml`](./render.yaml) para Render.
