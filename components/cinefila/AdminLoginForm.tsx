'use client';

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions";
import { initialFormState } from "@/lib/form-state";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialFormState);

  return (
    <form action={formAction} className="space-y-5 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Acceso</p>
        <h1 className="text-5xl text-white">Admin</h1>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Este acceso es simple y esta pensado solo para pruebas del CRUD.
        </p>
      </div>

      <label className="block space-y-2 text-sm text-[var(--muted)]">
        <span>Usuario</span>
        <input
          type="text"
          name="username"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
          placeholder="Admin"
        />
      </label>

      <label className="block space-y-2 text-sm text-[var(--muted)]">
        <span>Contraseña</span>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
          placeholder="Admin"
        />
      </label>

      <div className="flex items-center justify-between gap-4">
        <p className={`text-sm ${state.status === "error" ? "text-red-300" : "text-[var(--muted)]"}`}>
          {state.message || "Credenciales de prueba: Admin / Admin"}
        </p>
        <button
          type="submit"
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-black hover:bg-[var(--accent-strong)]"
        >
          {pending ? "Entrando..." : "Ingresar"}
        </button>
      </div>
    </form>
  );
}
