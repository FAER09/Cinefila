import { AdminDashboardLocal } from "@/components/cinefila/AdminDashboardLocal";
import { AdminLoginForm } from "@/components/cinefila/AdminLoginForm";
import { SiteHeader } from "@/components/cinefila/SiteHeader";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  return (
    <main className="min-h-screen pb-16">
      <SiteHeader />

      {authenticated ? (
        <AdminDashboardLocal />
      ) : (
        <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Control total</p>
            <h1 className="text-6xl text-white sm:text-7xl">CRUD de peliculas para Cinefila</h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              Desde aqui se administra el catalogo que aparece en Inicio y Explorar. El acceso inicial es Admin / Admin.
            </p>
          </div>

          <AdminLoginForm />
        </section>
      )}
    </main>
  );
}
