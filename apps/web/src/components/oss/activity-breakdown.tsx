import {
  getOSSActivity,
  getOSSActivitySearchUrls,
  getOSSStats,
  type OSSActivityMetric,
} from "@bhimrazy/github";
import { cn } from "@/lib/utils";

type Tile = {
  metric: OSSActivityMetric;
  label: string;
  hint: string;
};

/** Reviews lead: it's the metric a merged-PR count hides the most. */
const SECONDARY: readonly Tile[] = [
  {
    metric: "issuesResolved",
    label: "Issues resolved",
    hint: "Closed by my merged pull requests",
  },
  {
    metric: "issuesHelped",
    label: "Issues helped on",
    hint: "Other people's issues I've weighed in on",
  },
  {
    metric: "prsOpen",
    label: "PRs in review",
    hint: "Open right now, ready for review",
  },
  {
    metric: "issuesOpened",
    label: "Issues reported",
    hint: "Bugs and proposals I've filed",
  },
];

const tileClass =
  "group relative flex flex-col overflow-hidden rounded-xl border border-site-border bg-site-card p-5 transition-colors hover:border-site-border-hover focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10";

function VerifyHint() {
  return (
    <span className="mt-auto whitespace-nowrap pt-3 font-mono text-[11px] text-site-text-tertiary transition-colors group-hover:text-site-accent">
      Verify<span className="hidden sm:inline"> on GitHub</span> ↗
    </span>
  );
}

/**
 * The maintainer work a merged-PR count misses — reviews, resolved issues,
 * support threads — each linking to the GitHub search that produced it.
 */
export function ActivityBreakdown() {
  const activity = getOSSActivity();
  const urls = getOSSActivitySearchUrls();
  const { totalPrs } = getOSSStats();

  // An empty block (snapshot predates these metrics) is worse than none.
  if (activity.prsReviewed === 0) return null;

  const reviewRatio = totalPrs > 0 ? activity.prsReviewed / totalPrs : 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <a
        href={urls.prsReviewed}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={cn(tileClass, "col-span-2 p-6 lg:row-span-2")}
      >
        <span className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-site-accent-subtle blur-3xl" />
        <span className="relative font-mono text-[11px] text-site-accent uppercase tracking-[1.5px]">
          Code review
        </span>
        <span className="relative mt-4 font-bold font-display text-5xl text-site-text tracking-tight sm:text-6xl">
          {activity.prsReviewed}
        </span>
        <span className="relative mt-1 font-display font-semibold text-lg text-site-text">
          PRs reviewed for other contributors
        </span>
        {reviewRatio > 1 && (
          <p className="relative mt-3 max-w-sm text-site-text-secondary text-sm leading-relaxed">
            That&apos;s{" "}
            <strong className="font-semibold text-site-accent">
              {reviewRatio.toFixed(1)}×
            </strong>{" "}
            the {totalPrs} pull requests of my own that have merged.
          </p>
        )}
        <span className="relative mt-auto">
          <VerifyHint />
        </span>
      </a>

      {SECONDARY.map((tile) => (
        <a
          key={tile.metric}
          href={urls[tile.metric]}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={tileClass}
        >
          <span className="flex items-center gap-2 font-bold font-display text-3xl text-site-text">
            {activity[tile.metric]}
            {tile.metric === "prsOpen" && (
              <span
                role="img"
                aria-label="Live"
                className="size-2 animate-pulse-dot rounded-full bg-green-500 motion-reduce:animate-none"
              />
            )}
          </span>
          <span className="mt-1 font-medium text-site-text text-sm">
            {tile.label}
          </span>
          <span className="mt-0.5 text-site-text-tertiary text-xs leading-snug">
            {tile.hint}
          </span>
          <VerifyHint />
        </a>
      ))}
    </div>
  );
}
