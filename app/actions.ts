'use server';

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminCredentials, clearAdminSession, createAdminSession, requireAdmin } from "@/lib/auth";
import type { FormState } from "@/lib/form-state";
import { prisma } from "@/lib/prisma";

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

async function readImageValue(formData: FormData) {
  const imageUrl = readText(formData, "imageUrl");
  const currentImageUrl = readText(formData, "currentImageUrl");
  const imageFile = formData.get("imageFile");

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen.");
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    return `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  if (imageUrl) {
    return imageUrl;
  }

  if (currentImageUrl) {
    return currentImageUrl;
  }

  return "";
}

async function setFeaturedMovie(movieId: number) {
  await prisma.movie.updateMany({
    where: {
      isFeatured: true,
      id: {
        not: movieId,
      },
    },
    data: {
      isFeatured: false,
    },
  });
}

async function parseMoviePayload(formData: FormData) {
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

export async function loginAdmin(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = readText(formData, "username");
  const password = readText(formData, "password");

  if (username !== adminCredentials.username || password !== adminCredentials.password) {
    return {
      status: "error",
      message: "Credenciales invalidas. Usa Admin / Admin.",
    };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createMovie(formData: FormData) {
  await requireAdmin();

  const payload = await parseMoviePayload(formData);
  const slugBase = slugify(payload.title);
  const slugCount = await prisma.movie.count({
    where: {
      slug: {
        startsWith: slugBase,
      },
    },
  });

  const movie = await prisma.movie.create({
    data: {
      ...payload,
      slug: slugCount === 0 ? slugBase : `${slugBase}-${slugCount + 1}`,
    },
  });

  if (payload.isFeatured) {
    await setFeaturedMovie(movie.id);
  }

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateMovie(formData: FormData) {
  await requireAdmin();

  const id = Number(readText(formData, "id"));
  if (!Number.isInteger(id)) {
    throw new Error("La pelicula no es valida.");
  }

  const payload = await parseMoviePayload(formData);
  const currentMovie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!currentMovie) {
    throw new Error("La pelicula no existe.");
  }

  const nextSlug = payload.title === currentMovie.title ? currentMovie.slug : slugify(payload.title);

  await prisma.movie.update({
    where: { id },
    data: {
      ...payload,
      slug: nextSlug,
    },
  });

  if (payload.isFeatured) {
    await setFeaturedMovie(id);
  }

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteMovie(formData: FormData) {
  await requireAdmin();

  const id = Number(readText(formData, "id"));
  if (!Number.isInteger(id)) {
    throw new Error("La pelicula no es valida.");
  }

  await prisma.movie.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createReview(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const movieId = Number(readText(formData, "movieId"));
  const author = readText(formData, "author");
  const body = readText(formData, "body");
  const rating = readNumber(formData, "rating");

  if (!Number.isInteger(movieId)) {
    return {
      status: "error",
      message: "La pelicula seleccionada no es valida.",
    };
  }

  if (!author || !body) {
    return {
      status: "error",
      message: "Nombre y resena son obligatorios.",
    };
  }

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return {
      status: "error",
      message: "La calificacion debe estar entre 1 y 5.",
    };
  }

  await prisma.review.create({
    data: {
      movieId,
      author,
      body,
      rating,
    },
  });

  revalidatePath("/");
  revalidatePath("/explorar");
  refresh();

  return {
    status: "success",
    message: "Resena publicada.",
  };
}
