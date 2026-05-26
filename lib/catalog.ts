export type CatalogReview = {
  id: number;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type CatalogMovie = {
  id: number;
  title: string;
  slug: string;
  trailerUrl: string;
  imageUrl: string;
  synopsis: string;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  reviews: CatalogReview[];
};

export function getFeaturedMovie(movies: CatalogMovie[]) {
  return movies.find((movie) => movie.isFeatured) ?? movies[0] ?? null;
}

export function getTopRatedMovies(movies: CatalogMovie[]) {
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
}

export function getRecentMovies(movies: CatalogMovie[]) {
  return [...movies]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 10);
}

export function getMostDiscussedMovies(movies: CatalogMovie[]) {
  return [...movies]
    .sort((a, b) => b.reviews.length - a.reviews.length || b.rating - a.rating)
    .slice(0, 10);
}
