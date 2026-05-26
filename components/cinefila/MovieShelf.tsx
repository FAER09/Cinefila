/* eslint-disable @next/next/no-img-element */

import type { CatalogMovie } from "@/lib/catalog";

type MovieShelfProps = {
  title: string;
  copy: string;
  movies: CatalogMovie[];
  onSelect: (movieId: number) => void;
};

export function MovieShelf({ title, copy, movies, onSelect }: MovieShelfProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-4xl text-white">{title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy}</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {movies.map((movie) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => onSelect(movie.id)}
            className="group min-w-[18rem] max-w-[18rem] overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--panel)] text-left"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-[var(--muted-strong)]">
                <span>{movie.rating.toFixed(1)} / 5</span>
                <span>{movie.reviews.length} reseñas</span>
              </div>
            </div>

            <div className="space-y-2 p-4">
              <h3 className="text-2xl text-white">{movie.title}</h3>
              <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">{movie.synopsis}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
