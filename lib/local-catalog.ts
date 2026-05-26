"use client";

import { useCallback, useEffect, useState } from "react";
import type { CatalogMovie, CatalogReview } from "@/lib/catalog";
import type { FormState } from "@/lib/form-state";

const STORAGE_KEY = "cinefila_catalog_v1";
const UPDATE_EVENT = "cinefila-catalog-update";

type ReviewInput = Omit<CatalogReview, "id" | "createdAt">;

type MovieInput = Omit<
  CatalogMovie,
  "id" | "slug" | "createdAt" | "updatedAt" | "reviews"
>;

type LocalCatalogState = {
  movies: CatalogMovie[];
  nextMovieId: number;
  nextReviewId: number;
};

type SeedMovie = MovieInput & {
  reviews: ReviewInput[];
};

const seedMovies: SeedMovie[] = [
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string) {
  const value = Number(readText(formData, key));
  return Number.isFinite(value) ? value : NaN;
}

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

async function readImageValue(formData: FormData) {
  const imageUrl = readText(formData, "imageUrl");
  const currentImageUrl = readText(formData, "currentImageUrl");
  const imageFile = formData.get("imageFile");

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen.");
    }

    return readFileAsDataUrl(imageFile);
  }

  if (imageUrl) {
    return imageUrl;
  }

  if (currentImageUrl) {
    return currentImageUrl;
  }

  return "";
}

function sortCatalogMovies(movies: CatalogMovie[]) {
  return [...movies].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }

    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

function buildSeedState(): LocalCatalogState {
  const baseTime = Date.now();
  let reviewId = 1;

  const movies = seedMovies.map((movie, index) => {
    const createdAt = new Date(baseTime + index * 24 * 60 * 60 * 1000).toISOString();
    const reviews = movie.reviews.map((review, reviewIndex) => ({
      id: reviewId++,
      author: review.author,
      rating: review.rating,
      body: review.body,
      createdAt: new Date(
        baseTime + index * 24 * 60 * 60 * 1000 + (reviewIndex + 1) * 60 * 60 * 1000,
      ).toISOString(),
    }));

    return {
      id: index + 1,
      title: movie.title,
      slug: slugify(movie.title),
      trailerUrl: movie.trailerUrl,
      imageUrl: movie.imageUrl,
      synopsis: movie.synopsis,
      rating: movie.rating,
      isFeatured: movie.isFeatured,
      createdAt,
      updatedAt: createdAt,
      reviews,
    } satisfies CatalogMovie;
  });

  return {
    movies,
    nextMovieId: movies.length + 1,
    nextReviewId: reviewId,
  };
}

function readCatalogState(): LocalCatalogState {
  if (typeof window === "undefined") {
    return buildSeedState();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seed = buildSeedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(stored) as LocalCatalogState;
    if (!parsed || !Array.isArray(parsed.movies)) {
      throw new Error("Invalid catalog");
    }
    return parsed;
  } catch {
    const seed = buildSeedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeCatalogState(nextState: LocalCatalogState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

async function parseMoviePayload(formData: FormData): Promise<MovieInput> {
  const title = readText(formData, "title");
  const trailerUrl = readText(formData, "trailerUrl");
  const imageUrl = await readImageValue(formData);
  const synopsis = readText(formData, "synopsis");
  const rating = readNumber(formData, "rating");
  const isFeatured = isChecked(formData, "isFeatured");

  if (!title || !trailerUrl || !synopsis) {
    throw new Error("Todos los campos de la pelicula son obligatorios.");
  }

  if (!imageUrl) {
    throw new Error("Debes indicar una imagen por link o subir un archivo.");
  }

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("La calificacion debe estar entre 1 y 5.");
  }

  return { title, trailerUrl, imageUrl, synopsis, rating, isFeatured };
}

function validateReviewInput(input: ReviewInput) {
  if (!input.author || !input.body) {
    return "Nombre y resena son obligatorios.";
  }

  if (Number.isNaN(input.rating) || input.rating < 1 || input.rating > 5) {
    return "La calificacion debe estar entre 1 y 5.";
  }

  return null;
}

export function useLocalCatalog() {
  const [movies, setMovies] = useState<CatalogMovie[]>(() =>
    typeof window === "undefined" ? [] : sortCatalogMovies(readCatalogState().movies),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleUpdate = () => {
      setMovies(sortCatalogMovies(readCatalogState().movies));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        handleUpdate();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
    };
  }, []);

  const createMovie = useCallback(async (formData: FormData): Promise<FormState> => {
    try {
      const payload = await parseMoviePayload(formData);
      const state = readCatalogState();
      const slugBase = slugify(payload.title);
      const slugCount = state.movies.filter((movie) => movie.slug.startsWith(slugBase)).length;
      const slug = slugCount === 0 ? slugBase : `${slugBase}-${slugCount + 1}`;
      const now = new Date().toISOString();
      const nextMovies = payload.isFeatured
        ? state.movies.map((movie) => ({ ...movie, isFeatured: false }))
        : state.movies;

      const movie: CatalogMovie = {
        id: state.nextMovieId,
        title: payload.title,
        slug,
        trailerUrl: payload.trailerUrl,
        imageUrl: payload.imageUrl,
        synopsis: payload.synopsis,
        rating: payload.rating,
        isFeatured: payload.isFeatured,
        createdAt: now,
        updatedAt: now,
        reviews: [],
      };

      state.movies = [...nextMovies, movie];
      state.nextMovieId += 1;
      writeCatalogState(state);

      return { status: "success", message: "Pelicula creada." };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "No se pudo guardar la pelicula.",
      };
    }
  }, []);

  const updateMovie = useCallback(async (formData: FormData): Promise<FormState> => {
    const id = Number(readText(formData, "id"));
    if (!Number.isInteger(id)) {
      return { status: "error", message: "La pelicula no es valida." };
    }

    try {
      const payload = await parseMoviePayload(formData);
      const state = readCatalogState();
      const currentMovie = state.movies.find((movie) => movie.id === id);

      if (!currentMovie) {
        return { status: "error", message: "La pelicula no existe." };
      }

      const nextSlug = payload.title === currentMovie.title ? currentMovie.slug : slugify(payload.title);
      const updatedMovie: CatalogMovie = {
        ...currentMovie,
        title: payload.title,
        trailerUrl: payload.trailerUrl,
        imageUrl: payload.imageUrl,
        synopsis: payload.synopsis,
        rating: payload.rating,
        isFeatured: payload.isFeatured,
        slug: nextSlug,
        updatedAt: new Date().toISOString(),
      };

      let nextMovies = state.movies;
      if (payload.isFeatured) {
        nextMovies = nextMovies.map((movie) => ({
          ...movie,
          isFeatured: movie.id === id ? movie.isFeatured : false,
        }));
      }

      state.movies = nextMovies.map((movie) => (movie.id === id ? updatedMovie : movie));
      writeCatalogState(state);

      return { status: "success", message: "Pelicula actualizada." };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "No se pudo actualizar la pelicula.",
      };
    }
  }, []);

  const deleteMovie = useCallback(async (formData: FormData): Promise<FormState> => {
    const id = Number(readText(formData, "id"));
    if (!Number.isInteger(id)) {
      return { status: "error", message: "La pelicula no es valida." };
    }

    const state = readCatalogState();
    const exists = state.movies.some((movie) => movie.id === id);
    if (!exists) {
      return { status: "error", message: "La pelicula no existe." };
    }

    state.movies = state.movies.filter((movie) => movie.id !== id);
    writeCatalogState(state);

    return { status: "success", message: "Pelicula eliminada." };
  }, []);

  const createReview = useCallback(async (movieId: number, input: ReviewInput): Promise<FormState> => {
    if (!Number.isInteger(movieId)) {
      return { status: "error", message: "La pelicula seleccionada no es valida." };
    }

    const errorMessage = validateReviewInput(input);
    if (errorMessage) {
      return { status: "error", message: errorMessage };
    }

    const state = readCatalogState();
    const movie = state.movies.find((item) => item.id === movieId);

    if (!movie) {
      return { status: "error", message: "La pelicula no existe." };
    }

    const review: CatalogReview = {
      id: state.nextReviewId,
      author: input.author,
      rating: input.rating,
      body: input.body,
      createdAt: new Date().toISOString(),
    };

    state.nextReviewId += 1;
    state.movies = state.movies.map((item) =>
      item.id === movieId ? { ...item, reviews: [review, ...item.reviews] } : item,
    );

    writeCatalogState(state);

    return { status: "success", message: "Resena publicada." };
  }, []);

  return {
    movies,
    createMovie,
    updateMovie,
    deleteMovie,
    createReview,
  };
}
