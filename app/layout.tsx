import type { Metadata } from "next";
import { Bebas_Neue, Instrument_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinefila",
  description: "Catalogo minimalista para calificar, reseñar y administrar peliculas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</body>
    </html>
  );
}
