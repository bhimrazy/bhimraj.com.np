import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Internal links go through next/link; external ones open in a new tab. */
export function SmartLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/** Inline prose link: quiet underline that warms to the accent on hover. */
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <SmartLink
      href={href}
      className="rounded-sm font-medium text-site-text underline decoration-1 decoration-site-text-tertiary/50 underline-offset-[5px] transition-colors hover:decoration-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
    >
      {children}
    </SmartLink>
  );
}

/** A labelled block of the index. The label is a small mono caption. */
export function Section({
  label,
  action,
  children,
  className,
}: {
  label: string;
  action?: { href: string; text: string };
  children: ReactNode;
  className?: string;
}) {
  const id = `a-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={id} className={cn("mt-14 sm:mt-16", className)}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2
          id={id}
          className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.16em]"
        >
          {label}
        </h2>
        {action && (
          <SmartLink
            href={action.href}
            className="group/more rounded-sm font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.16em] transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
          >
            {action.text}{" "}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover/more:translate-x-0.5 motion-reduce:transition-none"
            >
              →
            </span>
          </SmartLink>
        )}
      </div>
      {children}
    </section>
  );
}
