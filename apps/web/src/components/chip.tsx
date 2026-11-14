import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The site's one tag style: accent for topics, neutral for stack or meta. */
export function Chip({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px]",
        tone === "accent"
          ? "bg-site-accent-subtle text-site-accent-text"
          : "bg-site-bg-tertiary text-site-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
