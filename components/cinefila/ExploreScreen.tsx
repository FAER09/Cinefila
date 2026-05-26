/* eslint-disable @next/next/no-img-element */

'use client';

import { useDeferredValue, useState } from "react";
import { MovieModal, type CreateReviewHandler } from "@/components/cinefila/MovieModal";
import { StarRatingInput } from "@/components/cinefila/StarRatingInput";
import { SectionHeading } from "@/components/cinefila/SectionHeading";
import type { CatalogMovie } from "@/lib/catalog";

type ExploreScreenProps = {
  movies: CatalogMovie[];
  onCreateReview?: CreateReviewHandler;
};

export function ExploreScreen({ movies, onCreateReview }: ExploreScreenProps) {
  const [search, setSearch] = useState("");
  const [minimumRating, setMinimumRating] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const deferredSearch = useDeferredValue(search);
  const filteredMovies = movies.filter((movie) => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      movie.title.toLowerCase().includes(normalizedSearch) ||
      movie.synopsis.toLowerCase().includes(normalizedSearch);

    const matchesRating = movie.rating >= minimumRating;

    return matchesSearch && matchesRating;
  });

  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId) ?? null;

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
        <SectionHeading
          eyebrow="Explorar"
          title="Busca, filtra y abre cada pelicula"
          copy="Consulta el catalogo completo, filtra por calificacion minima y abre un modal para dejar tu comentario sin salir de la pagina."
        />

        <div className="grid gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5 sm:grid-cols-[1fr_220px]">
          <label className="space-y-2 text-sm text-[var(--muted)]">
            <span>Buscar pelicula</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
              placeholder="Titulo o sinopsis"
            />
          </label>

          <div className="space-y-2 text-sm text-[var(--muted)]">
            <span>Calificacion minima</span>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <StarRatingInput value={minimumRating} allowZero onChange={setMinimumRating} size="sm" />
              <button
                type="button"
                onClick={() => setMinimumRating(0)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--muted)] hover:bg-white/10"
              >
                Todas
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <span>{filteredMovies.length} resultados</span>
          <span>{movies.length} peliculas registradas en total</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMovies.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => setSelectedMovieId(movie.id)}
              className="group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--panel)] text-left"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
                  <span>{movie.rating.toFixed(1)} / 5</span>
                  <span>{movie.reviews.length} comentarios</span>
                </div>
                <h2 className="text-3xl text-white">{movie.title}</h2>
                <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">{movie.synopsis}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredMovies.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--panel)] p-8 text-sm text-[var(--muted)]">
            No hay coincidencias con esos filtros.
          </div>
        ) : null}
      </section>

      <MovieModal
        key={selectedMovie?.id ?? "movie-modal"}
        movie={selectedMovie}
        onClose={() => setSelectedMovieId(null)}
        onCreateReview={onCreateReview}
      />
    </>
  );
}
