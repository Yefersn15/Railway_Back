# Despliegue en Railway — Backend

## Servicio

- Tipo: Node.js
- Root Directory: `/` (raíz de este repositorio)

## Build Command

```bash
npm install
```

## Start Command

```bash
npm run start:railway
```

## Variables de entorno exactas

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SSL=true
JWT_SECRET=pon_aqui_una_clave_larga_y_segura
ALLOWED_ORIGINS=https://tu-frontend.up.railway.app,http://localhost:5173,http://localhost:5174
```

### Notas

- `DATABASE_URL` sale del servicio PostgreSQL creado en el mismo proyecto de Railway (usa "Add Reference" para inyectarlo automáticamente).
- `ALLOWED_ORIGINS` debe llevar la URL pública real del frontend, sin barra final.
- El comando `npm run start:railway` aplica `database/database.sql` antes de iniciar el servidor.

## Orden recomendado de despliegue

1. Crear el servicio PostgreSQL en Railway.
2. Desplegar este servicio (backend) y vincular las variables de la base de datos.
3. Verificar `https://tu-backend.up.railway.app/health`.
4. Desplegar el frontend con `VITE_API_URL` apuntando a este backend.
5. Actualizar `ALLOWED_ORIGINS` aquí con la URL final del frontend.
