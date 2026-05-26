"use client";

import { jsPDF } from "jspdf";
import type { CatalogMovie } from "@/lib/catalog";

type MoviesPdfButtonProps = {
  movies: CatalogMovie[];
};

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

export function MoviesPdfButton({ movies }: MoviesPdfButtonProps) {
  const handleClick = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const lineHeight = 16;
    let cursorY = margin;

    const totalReviews = movies.reduce((sum, movie) => sum + movie.reviews.length, 0);
    const averageRating =
      movies.length > 0 ? movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length : 0;

    const ensureSpace = (lines: number) => {
      if (cursorY + lines * lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Reporte de peliculas", margin, cursorY);
    cursorY += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleString("es-MX")}`, margin, cursorY);
    cursorY += lineHeight;
    doc.text(`Total peliculas: ${movies.length}`, margin, cursorY);
    cursorY += lineHeight;
    doc.text(`Promedio calificacion: ${formatNumber(averageRating)}`, margin, cursorY);
    cursorY += lineHeight;
    doc.text(`Resenas totales: ${totalReviews}`, margin, cursorY);
    cursorY += lineHeight * 1.5;

    if (movies.length === 0) {
      doc.text("No hay peliculas registradas.", margin, cursorY);
    } else {
      const availableWidth = pageWidth - margin * 2;
      movies.forEach((movie, index) => {
        const synopsis = movie.synopsis?.trim() ?? "";
        const synopsisText = synopsis.length > 220 ? `${synopsis.slice(0, 217)}...` : synopsis;
        const synopsisLines = doc.splitTextToSize(
          synopsisText || "Sinopsis no disponible.",
          availableWidth,
        );

        const blockLines = 2 + synopsisLines.length + 1;
        ensureSpace(blockLines);

        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${movie.title}`, margin, cursorY);
        cursorY += lineHeight;

        doc.setFont("helvetica", "normal");
        doc.text(
          `Calificacion: ${formatNumber(movie.rating)} | Resenas: ${movie.reviews.length} | Destacada: ${
            movie.isFeatured ? "si" : "no"
          }`,
          margin,
          cursorY,
        );
        cursorY += lineHeight;

        doc.text(synopsisLines, margin, cursorY);
        cursorY += synopsisLines.length * lineHeight + lineHeight;
      });
    }

    doc.save("cinefila-peliculas.pdf");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={movies.length === 0}
      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Descargar PDF
    </button>
  );
}
