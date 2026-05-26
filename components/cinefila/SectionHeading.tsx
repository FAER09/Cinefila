type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function SectionHeading({ eyebrow, title, copy }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="text-4xl text-white sm:text-5xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{copy}</p>
    </div>
  );
}
