'use server';

import { redirect } from "next/navigation";
import { adminCredentials, clearAdminSession, createAdminSession } from "@/lib/auth";
import type { FormState } from "@/lib/form-state";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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
