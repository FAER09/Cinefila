import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ensureDatabaseUrl } from "../lib/database-url";

function isRemoteDatabase(connectionString: string) {
  return !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const connectionString = ensureDatabaseUrl("runtime");

if (!connectionString) {
  throw new Error(
    "No se encontro una conexion Postgres. Configura DATABASE_URL o usa las variables de integracion que Vercel haya agregado.",
  );
}

const pool = new Pool({
  connectionString,
  ssl: isRemoteDatabase(connectionString) ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const movies = [
  {
    title: "Spider-Man: No Way Home",
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Peter intenta recuperar su vida, pero el multiverso abre la puerta a viejos enemigos.",
    rating: 4.7,
    isFeatured: true,
    reviews: [],
  },
  {
    title: "Dune: Part Two",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Paul Atreides se une a los Fremen y enfrenta un destino que puede cambiar el imperio.",
    rating: 4.8,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Avatar: The Way of Water",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "La familia de Jake y Neytiri explora los oceanos de Pandora mientras una amenaza regresa.",
    rating: 4.6,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    trailerUrl: "https://www.youtube.com/watch?v=VyHV0BRtdxo",
    imageUrl:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Harry descubre que es mago y entra a Hogwarts para enfrentar un misterio antiguo.",
    rating: 4.5,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Godzilla",
    trailerUrl: "https://www.youtube.com/watch?v=vIu85WQTPRc",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Una fuerza titanica despierta y el mundo entra en alerta mientras la ciudad colapsa.",
    rating: 4.1,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Obsesion",
    trailerUrl: "https://www.youtube.com/watch?v=2SpWwnL2b3M",
    imageUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Una relacion intensa se vuelve peligrosa cuando los limites se rompen.",
    rating: 3.9,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Sinners",
    trailerUrl: "https://www.youtube.com/watch?v=BNZtF0WJmQ8",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Un grupo de extraños se enfrenta a secretos que los arrastran hacia una noche oscura.",
    rating: 4.0,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "Oppenheimer",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    imageUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "El cientifico lidera el Proyecto Manhattan mientras carga con el peso de su legado.",
    rating: 4.6,
    isFeatured: false,
    reviews: [],
  },
  {
    title: "The Batman",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
    synopsis:
      "Batman investiga una conspiracion que amenaza a Gotham mientras forja su identidad.",
    rating: 4.4,
    isFeatured: false,
    reviews: [],
  },
];

async function main() {
  console.info("Seeding Cinefila...");

  await prisma.review.deleteMany();
  await prisma.movie.deleteMany();

  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        slug: slugify(movie.title),
        trailerUrl: movie.trailerUrl,
        imageUrl: movie.imageUrl,
        synopsis: movie.synopsis,
        rating: movie.rating,
        isFeatured: movie.isFeatured,
        reviews: {
          create: movie.reviews,
        },
      },
    });
  }

  console.info(`Peliculas insertadas: ${movies.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
