import Link from "next/link";
import { focusRing, surfaceInteractive } from "@/components/surface";
import { formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import { shortTitle } from "./paths";
import type { ResolvedPath } from "./resources";

/** A path in brief: what it gets you, and its steps in order. */
export function PathCard({ path }: { path: ResolvedPath }) {
  return (
    <Link
      href={`/resources/paths/${path.slug}`}
      className={cn(
        surfaceInteractive,
        "group flex h-full flex-col p-5 sm:p-6",
        focusRing,
      )}
    >
      <p className="font-mono text-2xs text-site-text-tertiary uppercase tracking-wider">
        {path.steps.length} steps
        {path.totalSec > 0 && ` · ${formatHours(path.totalSec)} of lectures`}
      </p>
      <h3 className="mt-2 text-pretty font-display font-semibold text-lg text-site-text leading-snug tracking-tight transition-colors group-hover:text-site-accent-text">
        {path.title}
        <span
          aria-hidden
          className="ml-1.5 inline-block text-site-accent text-sm transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </h3>
      <p className="mt-2 text-pretty text-site-text-secondary text-sm leading-relaxed">
        {path.promise}
      </p>
      <ol className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-5 font-mono text-2xs text-site-text-secondary">
        {path.steps.map((step, index) => (
          <li key={step.resource.slug} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden className="text-site-text-tertiary">
                →
              </span>
            )}
            <span className="rounded-md bg-site-bg-tertiary px-2 py-0.5">
              {shortTitle(step.resource.title)}
            </span>
          </li>
        ))}
      </ol>
    </Link>
  );
}
