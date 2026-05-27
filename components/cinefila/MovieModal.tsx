/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { StarRatingInput } from "@/components/cinefila/StarRatingInput";
import { StarRatingDisplay } from "@/components/cinefila/StarRatingDisplay";
import type { CatalogMovie, CatalogReview } from "@/lib/catalog";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

type MovieModalProps = {
  movie: CatalogMovie | null;
  onClose: () => void;
  onCreateReview: CreateReviewHandler;
};

type ReviewInput = Omit<CatalogReview, "id" | "createdAt">;

export type CreateReviewHandler = (movieId: number, input: ReviewInput) => Promise<FormState> | FormState;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const videoId =
      parsed.hostname.includes("youtu.be")
        ? parsed.pathname.replace("/", "")
        : parsed.searchParams.get("v");

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string) {
  const value = Number(readText(formData, key));
  return Number.isFinite(value) ? value : NaN;
}

function ReviewForm({
  movieId,
  onCreateReview,
}: {
  movieId: number;
  onCreateReview: CreateReviewHandler;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return;
    }

    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await onCreateReview(movieId, {
      author: readText(formData, "author"),
      body: readText(formData, "body"),
      rating: readNumber(formData, "rating"),
    });

    setState(result);

    if (result.status === "success") {
      event.currentTarget.reset();
      setResetKey((value) => value + 1);
    }

    setPending(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-black/25 p-5"
    >
      <input type="hidden" name="movieId" value={movieId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--muted)]">
          <span>Nombre</span>
          <input
            type="text"
            name="author"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
            placeholder="Tu nombre"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted)]">
          <span>Calificacion</span>
          <StarRatingInput key={`local-rating-${resetKey}`} name="rating" defaultValue={5} />
        </label>
      </div>

      <label className="space-y-2 text-sm text-[var(--muted)]">
        <span>Reseña</span>
        <textarea
          name="body"
          required
          rows={4}
          className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
          placeholder="Que te parecio la pelicula"
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm ${state.status === "error" ? "text-red-300" : "text-[var(--muted)]"}`}>
          {pending ? "Publicando..." : state.message}
        </p>
        <button
          type="submit"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
        >
          Publicar reseña
        </button>
      </div>
    </form>
  );
}

export function MovieModal({ movie, onClose, onCreateReview }: MovieModalProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!movie) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) {
    return null;
  }

  const embedUrl = getYoutubeEmbedUrl(movie.trailerUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-hidden bg-black/70 px-4 py-10">
      <div className="relative w-full max-w-5xl transform-gpu overflow-hidden overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[#0f0f0f] shadow-2xl max-h-[calc(100vh-5rem)]">
        <div className="sticky top-0 z-20 flex justify-end border-b border-[var(--border)] bg-black/80 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[18rem] border-b border-[var(--border)] lg:min-h-full lg:border-b-0 lg:border-r">
            <img
              src={movie.imageUrl}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-strong)]">
                <span>{movie.rating.toFixed(1)} / 5</span>
                <span>{movie.reviews.length} comentarios</span>
              </div>
              <h2 className="text-5xl text-white sm:text-6xl">{movie.title}</h2>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted-strong)]">{movie.synopsis}</p>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Trailer</p>
              {embedUrl ? (
                showTrailer ? (
                  <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
                    <iframe
                      src={embedUrl}
                      title={`${movie.title} trailer`}
                      className="aspect-video w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-black/40 p-5">
                    <p className="text-sm text-[var(--muted)]">
                      El trailer se carga al abrir para mantener el modal fluido.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setShowTrailer(true)}
                        className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
                      >
                        Ver trailer
                      </button>
                      <a
                        href={movie.trailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        Abrir en nueva pestana
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10"
                >
                  Abrir trailer
                </a>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Escribe tu reseña</p>
              <ReviewForm key={movie.id} movieId={movie.id} onCreateReview={onCreateReview} />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Comentarios</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--muted)]">{movie.reviews.length} publicados</span>
                  {movie.reviews.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowReviews((value) => !value)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--muted)] hover:bg-white/10"
                    >
                      {showReviews ? "Ocultar" : "Ver"}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                {movie.reviews.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                    Aun no hay comentarios. Publica la primera resena.
                  </div>
                ) : showReviews ? (
                  movie.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-[1.5rem] border border-[var(--border)] bg-white/4 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-medium text-white">{review.author}</h3>
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <StarRatingDisplay value={review.rating} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{review.body}</p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                    Activa el listado para ver los comentarios.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
