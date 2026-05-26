import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-black/35 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-3xl tracking-[0.32em] text-[var(--accent-strong)]">
          Cinefila
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 p-1 text-sm text-[var(--muted)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 hover:bg-white/8 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
