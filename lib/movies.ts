import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { CatalogMovie } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

const movieInclude = {
  reviews: {
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.MovieInclude;

type MovieRecord = Prisma.MovieGetPayload<{
  include: typeof movieInclude;
}>;

function serializeMovie(movie: MovieRecord): CatalogMovie {
  return {
    id: movie.id,
    title: movie.title,
    slug: movie.slug,
    trailerUrl: movie.trailerUrl,
    imageUrl: movie.imageUrl,
    synopsis: movie.synopsis,
    rating: movie.rating,
    isFeatured: movie.isFeatured,
    createdAt: movie.createdAt.toISOString(),
    updatedAt: movie.updatedAt.toISOString(),
    reviews: movie.reviews.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
    })),
  };
}

export async function getCatalog() {
  const movies = await prisma.movie.findMany({
    include: movieInclude,
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }, { createdAt: "desc" }],
  });

  return movies.map(serializeMovie);
}
