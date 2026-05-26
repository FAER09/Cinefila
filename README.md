# Cinefila

Aplicacion con `Next.js 16`, `React 19` y `Prisma 7` para:

- mostrar una portada con la pelicula del momento
- explorar el catalogo con busqueda y filtros
- administrar peliculas desde un panel `Admin`
- publicar reseñas en modal por cada pelicula

## Credenciales de prueba

- Usuario: `Admin`
- Contraseña: `Admin`

## Stack

- `Next.js 16 App Router`
- `Tailwind CSS 4`
- `Prisma 7`
- `PostgreSQL` compatible con integraciones Postgres de `Vercel Marketplace`

## Variables de entorno

La app busca la conexion Postgres en este orden:

- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- credenciales `PG*` de Vercel o con prefijo, por ejemplo `DATABASE_PGHOST`

Si defines tu conexion manualmente, usa:

```env
DATABASE_URL="postgresql://..."
```

## Modo local (LocalStorage)

Si quieres probar sin base de datos, crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_DATA_MODE="local"
```

Luego ejecuta `npm run dev`. El catalogo se guarda en localStorage del navegador.

Para volver a usar la base de Vercel, elimina `NEXT_PUBLIC_DATA_MODE` y configura `DATABASE_URL` en el proyecto.

## Comandos

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Despliegue en Vercel

1. Crea una base Postgres desde `Vercel Marketplace`.
2. Conecta la base al proyecto.
3. Si Vercel te crea `DATABASE_URL`, no necesitas tocar codigo.
4. Si te crea `POSTGRES_URL`, `POSTGRES_PRISMA_URL` o variables `PG*`, esta app ya las detecta automaticamente.
5. Elimina `NEXT_PUBLIC_DATA_MODE` si estaba activo.
6. Ejecuta `npm run db:deploy` para aplicar migraciones en la base nueva.
7. Opcionalmente corre `npm run db:seed` para cargar peliculas demo.

Si estas usando una base vieja del proyecto anterior solo para probar, puedes crear las tablas nuevas con `npx prisma db push`. Para una base limpia de Vercel usa migraciones con `npm run db:deploy`.

## Nota

El login de `Admin` es intencionalmente simple para pruebas del CRUD. Si luego quieres endurecerlo para producción real, hay que reemplazarlo por autenticacion real y secretos fuera del código.
