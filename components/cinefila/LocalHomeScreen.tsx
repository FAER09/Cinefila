/* eslint-disable @next/next/no-img-element */

'use client';

import { useState } from "react";
import { useLocalCatalog } from "@/lib/local-catalog";
import {
  getFeaturedMovie,
  getMostDiscussedMovies,
  getRecentMovies,
  getTopRatedMovies,
} from "@/lib/catalog";
import { MovieModal } from "@/components/cinefila/MovieModal";
import { MovieShelf } from "@/components/cinefila/MovieShelf";
import { SectionHeading } from "@/components/cinefila/SectionHeading";

export function LocalHomeScreen() {
  const { movies, createReview } = useLocalCatalog();
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const featuredMovie = getFeaturedMovie(movies);
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId) ?? null;

  if (!featuredMovie) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-5 py-20 sm:px-8">
        <div className="max-w-2xl rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--panel)] p-10">
          <SectionHeading
            eyebrow="Catalogo vacio"
            title="No hay peliculas todavia"
            copy="Entra a Admin con las credenciales indicadas y da de alta las primeras peliculas para poblar el catalogo."
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full pb-12 pt-8 sm:pt-12">
        <div className="relative w-full overflow-hidden bg-[var(--panel-strong)] sm:rounded-[2rem] sm:border sm:border-[var(--border)]">
          <div className="absolute inset-0">
            <img
              src={featuredMovie.imageUrl}
              alt={featuredMovie.title}
              className="h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/15" />
          </div>

          <div className="absolute inset-x-0 top-0 z-10">
            <div className="mx-auto w-full max-w-7xl px-5 pt-5 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/55 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Catalogo</p>
                <p className="mt-2 text-3xl text-white">{movies.length}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Peliculas activas para reseñar</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/55 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Comunidad</p>
                <p className="mt-2 text-3xl text-white">
                  {movies.reduce((sum, movie) => sum + movie.reviews.length, 0)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">Comentarios publicados</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/55 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Promedio</p>
                <p className="mt-2 text-3xl text-white">
                  {movies.length > 0 ? (movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length).toFixed(1) : "0.0"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">Calificacion curada del catalogo</p>
              </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto flex min-h-[32rem] w-full max-w-7xl flex-col justify-end gap-6 px-5 pb-8 pt-36 sm:px-10 sm:pb-10 sm:pt-40">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-strong)]">
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
                  Pelicula del momento
                </span>
                <span>{featuredMovie.rating.toFixed(1)} / 5</span>
                <span>{featuredMovie.reviews.length} comentarios</span>
              </div>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-6xl leading-none text-white sm:text-7xl">{featuredMovie.title}</h1>
                <p className="text-base leading-7 text-[var(--muted-strong)] sm:text-lg">
                  {featuredMovie.synopsis}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMovieId(featuredMovie.id)}
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
                >
                  Ver detalle y reseñas
                </button>
                <a
                  href={featuredMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-black/35 px-5 py-3 text-sm text-white hover:bg-black/55"
                >
                  Abrir trailer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-6 sm:px-8">
        <SectionHeading
          eyebrow="Cinefila"
          title="Reseñas sin ruido"
          copy="Una experiencia sobria para descubrir peliculas, comentar y mantener el catalogo listo para desplegarse."
        />
        <MovieShelf
          title="Lo mejor calificado"
          copy="Las peliculas con mejor evaluacion del catalogo."
          movies={getTopRatedMovies(movies)}
          onSelect={setSelectedMovieId}
        />
        <MovieShelf
          title="Mas comentadas"
          copy="Las que estan generando conversacion dentro de la comunidad."
          movies={getMostDiscussedMovies(movies)}
          onSelect={setSelectedMovieId}
        />
        <MovieShelf
          title="Nuevas en pantalla"
          copy="Las ultimas altas dadas desde el panel de administracion."
          movies={getRecentMovies(movies)}
          onSelect={setSelectedMovieId}
        />
      </section>

      <MovieModal
        key={selectedMovie?.id ?? "movie-modal"}
        movie={selectedMovie}
        onClose={() => setSelectedMovieId(null)}
        onCreateReview={createReview}
      />
    </>
  );
}
