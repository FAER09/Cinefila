# Cinefila

Aplicacion con `Next.js 16` y `React 19` para:

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
- `LocalStorage` para persistencia de datos

## Funcionamiento (LocalStorage)

Esta aplicacion utiliza `LocalStorage` del navegador para persistir el catalogo de peliculas y reseñas. No requiere una base de datos externa.

Al iniciar por primera vez, la aplicacion se precargara con un conjunto de peliculas semilla. Cualquier cambio (creacion, edicion, eliminacion de peliculas o reseñas) se guardara localmente en tu navegador.

## Comandos

```bash
npm install
npm run dev
```

## Nota

El login de `Admin` es intencionalmente simple para pruebas del CRUD. Si luego quieres endurecerlo para producción real, hay que reemplazarlo por autenticacion real y secretos fuera del código.
