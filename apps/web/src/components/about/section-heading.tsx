import type { ReactNode } from "react";

/** Numbered eyebrow + display heading shared by every /about section. */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <span className="inline-flex items-center gap-3 font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
        <span className="text-site-text-tertiary">{index}</span>
        <span aria-hidden className="h-px w-6 bg-site-accent/50" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className="mt-3 scroll-mt-28 font-bold font-display text-3xl text-site-text leading-tight tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {children && (
        <p className="mt-3 text-base text-site-text-secondary leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}
