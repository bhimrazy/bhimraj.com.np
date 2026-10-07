import { type Level as LevelValue, levelLabel } from "@/components/blog/series";
import { cn } from "@/lib/utils";

const filled: Record<LevelValue, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  all: 0,
};

/** A small pill: three bars, filled up to the level, and its name. */
export function LevelBadge({
  value,
  className,
}: {
  value: LevelValue;
  className?: string;
}) {
  const bars = filled[value];
  if (bars === undefined) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-site-border px-2.5 py-1 font-medium font-mono text-[10px] text-site-text-secondary uppercase leading-none tracking-[0.14em]",
        className,
      )}
    >
      {bars > 0 ? (
        <span aria-hidden className="flex items-end gap-0.5">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={cn(
                "w-0.75 rounded-full",
                n === 1 && "h-1.5",
                n === 2 && "h-2",
                n === 3 && "h-2.5",
                n <= bars ? "bg-site-accent" : "bg-site-border-hover",
              )}
            />
          ))}
        </span>
      ) : null}
      <span className="sr-only">Level: </span>
      {levelLabel[value]}
    </span>
  );
}

/**
 * Badges the section above it. Put it on its own line under a `##` heading:
 *
 * ```mdx
 * ## Signing commits
 * <Level value="intermediate" />
 * ```
 */
export function Level({ value }: { value: LevelValue }) {
  return (
    <span className="not-prose -mt-2 mb-6 flex">
      <LevelBadge value={value} />
    </span>
  );
}
