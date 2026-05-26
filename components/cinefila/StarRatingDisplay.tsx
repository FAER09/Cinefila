type StarRatingDisplayProps = {
  value: number;
  max?: number;
  size?: "sm" | "md";
};

export function StarRatingDisplay({ value, max = 5, size = "sm" }: StarRatingDisplayProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const displayValue = Math.round(Math.max(0, Math.min(max, safeValue)));
  const starRange = Array.from({ length: max }, (_, index) => index + 1);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className="flex items-center gap-1" aria-label={`Calificacion ${displayValue} de ${max}`}>
      {starRange.map((starValue) => {
        const isActive = starValue <= displayValue;
        return (
          <svg
            key={starValue}
            viewBox="0 0 20 20"
            className={`${iconSize} ${isActive ? "text-[var(--accent)]" : "text-white/20"}`}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.149 3.54a1 1 0 00.95.69h3.72c.969 0 1.371 1.24.588 1.81l-3.01 2.187a1 1 0 00-.364 1.118l1.15 3.539c.3.922-.755 1.688-1.54 1.118l-3.01-2.186a1 1 0 00-1.175 0l-3.01 2.186c-.784.57-1.838-.196-1.539-1.118l1.15-3.539a1 1 0 00-.364-1.118L2.49 8.967c-.783-.57-.38-1.81.588-1.81h3.72a1 1 0 00.95-.69l1.149-3.54z"
            />
          </svg>
        );
      })}
    </span>
  );
}