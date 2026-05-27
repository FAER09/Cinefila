"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { logoutAdmin } from "@/app/actions";
import { MoviesPdfButton } from "@/components/cinefila/MoviesPdfButton";
import { SectionHeading } from "@/components/cinefila/SectionHeading";
import { StarRatingInput } from "@/components/cinefila/StarRatingInput";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";
import { useLocalCatalog } from "@/lib/local-catalog";

export function AdminDashboardLocal() {
  const { movies, createMovie, updateMovie, deleteMovie } = useLocalCatalog();
  const [createFormState, setCreateFormState] = useState<FormState>(initialFormState);
  const [editFormState, setEditFormState] = useState<FormState>(initialFormState);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [query, setQuery] = useState("");

  const filteredMovies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return movies;
    }

    return movies.filter((movie) =>
      [movie.title, movie.synopsis].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [movies, query]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await createMovie(new FormData(event.currentTarget));
    setCreateFormState(result);
    setEditFormState(initialFormState);

    if (result.status === "success") {
      event.currentTarget.reset();
      setCreateFormKey((value) => value + 1);
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await updateMovie(new FormData(event.currentTarget));
    setEditFormState(result);
    setCreateFormState(initialFormState);
  };

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await deleteMovie(new FormData(event.currentTarget));
    setEditFormState(result);
    setCreateFormState(initialFormState);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-6 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Panel"
          title="Administracion del catalogo"
          copy="Da de alta peliculas, actualiza su informacion y elimina registros. Si marcas una pelicula como destacada se convierte en la portada del inicio."
        />

        <div className="flex flex-wrap gap-3">
          <MoviesPdfButton movies={movies} />
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white hover:bg-white/10"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        <form
          onSubmit={handleCreate}
          encType="multipart/form-data"
          className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Nuevo registro</p>
            <h2 className="text-4xl text-white">Alta de pelicula</h2>
          </div>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Nombre</span>
            <input
              type="text"
              name="title"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Trailer</span>
            <input
              type="url"
              name="trailerUrl"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              placeholder="https://youtube.com/..."
            />
          </label>

          <div className="space-y-3">
            <label className="block space-y-2 text-sm text-[var(--muted)]">
              <span>Imagen por link</span>
              <input
                type="url"
                name="imageUrl"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                placeholder="https://..."
              />
            </label>
            <label className="block space-y-2 text-sm text-[var(--muted)]">
              <span>O sube una imagen</span>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:text-white"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm text-[var(--muted)]">
            <span>Sinopsis</span>
            <textarea
              name="synopsis"
              required
              rows={5}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-end">
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <span>Calificacion</span>
              <StarRatingInput key={`create-rating-${createFormKey}`} name="rating" defaultValue={4} />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted-strong)]">
              <input type="checkbox" name="isFeatured" className="h-4 w-4 accent-[var(--accent)]" />
              Marcar como pelicula del momento
            </label>
          </div>

          {createFormState.message ? (
            <p
              className={`text-sm ${createFormState.status === "error" ? "text-red-300" : "text-[var(--muted)]"}`}
            >
              {createFormState.message}
            </p>
          ) : null}

          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
          >
            Guardar pelicula
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
            <h2 className="text-4xl text-white">CRUD del catalogo</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Edita cada pelicula inline. Los cambios se reflejan en Inicio y Explorar.
            </p>

            {editFormState.message ? (
              <p
                className={`mt-4 rounded-2xl border px-4 py-2 text-sm ${
                  editFormState.status === "error"
                    ? "border-red-400/20 bg-red-400/10 text-red-100"
                    : "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"
                }`}
              >
                {editFormState.message}
              </p>
            ) : null}
            <label className="mt-4 block space-y-2 text-sm text-[var(--muted)]">
              <span>Buscar pelicula</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
                placeholder="Titulo o sinopsis"
              />
            </label>
          </div>

          {filteredMovies.map((movie) => (
            <details
              key={movie.id}
              className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--panel)]"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <h3 className="text-2xl text-white">{movie.title}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {movie.rating.toFixed(1)} / 5 · {movie.reviews.length} resenas
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-strong)]">
                  {movie.isFeatured ? "Destacada" : "Editar"}
                </span>
              </summary>

              <div className="border-t border-[var(--border)] p-5">
                <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
                  <input type="hidden" name="id" value={movie.id} />
                  <input type="hidden" name="currentImageUrl" value={movie.imageUrl} />

                  <label className="block space-y-2 text-sm text-[var(--muted)]">
                    <span>Nombre</span>
                    <input
                      type="text"
                      name="title"
                      defaultValue={movie.title}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block space-y-2 text-sm text-[var(--muted)]">
                    <span>Trailer</span>
                    <input
                      type="url"
                      name="trailerUrl"
                      defaultValue={movie.trailerUrl}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    />
                  </label>

                  <div className="space-y-3">
                    <label className="block space-y-2 text-sm text-[var(--muted)]">
                      <span>Imagen por link</span>
                      <input
                        type="url"
                        name="imageUrl"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                        placeholder="https://..."
                      />
                    </label>
                    <label className="block space-y-2 text-sm text-[var(--muted)]">
                      <span>O sube una imagen</span>
                      <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:text-white"
                      />
                    </label>
                    <p className="text-xs text-[var(--muted)]">Deja vacio para mantener la imagen actual.</p>
                  </div>

                  <label className="block space-y-2 text-sm text-[var(--muted)]">
                    <span>Sinopsis</span>
                    <textarea
                      name="synopsis"
                      defaultValue={movie.synopsis}
                      required
                      rows={4}
                      className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-end">
                    <div className="space-y-2 text-sm text-[var(--muted)]">
                      <span>Calificacion</span>
                      <StarRatingInput
                        key={`edit-rating-${movie.id}-${movie.updatedAt}`}
                        name="rating"
                        defaultValue={movie.rating}
                      />
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted-strong)]">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        defaultChecked={movie.isFeatured}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      Mostrar como pelicula del momento
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>

                <form onSubmit={handleDelete} className="mt-4">
                  <input type="hidden" name="id" value={movie.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm text-red-100 hover:bg-red-400/15"
                  >
                    Eliminar pelicula
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
