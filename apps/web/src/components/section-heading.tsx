import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

/** Accent text link with a trailing arrow that nudges on hover. */
export function ArrowLink({
  href,
  children,
  external,
  className,
}: ArrowLinkProps) {
  const classes = cn(
    "group/arrow inline-flex items-center gap-1.5 rounded-sm font-medium text-site-accent text-sm transition-colors hover:text-site-accent-hover focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4",
    className,
  );
  const arrow = (
    <span
      aria-hidden
      className="transition-transform group-hover/arrow:translate-x-0.5"
    >
      {external ? "↗" : "→"}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}

type SectionHeadingProps = {
  /** Two-digit chapter number, e.g. "01" — gives the page a readable spine. */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional link shown at the right edge (below the text on mobile). */
  action?: { href: string; label: string; external?: boolean };
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="flex items-center gap-3 font-medium font-mono text-[12px] text-site-accent uppercase tracking-[1.5px]">
          {index && (
            <>
              <span className="text-site-text-tertiary">{index}</span>
              <span aria-hidden className="h-px w-6 bg-site-border-hover" />
            </>
          )}
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance font-bold font-display text-3xl text-site-text leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-pretty text-base text-site-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <ArrowLink
          href={action.href}
          external={action.external}
          className="shrink-0"
        >
          {action.label}
        </ArrowLink>
      )}
    </div>
  );
}
