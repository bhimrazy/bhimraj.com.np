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
  /** What the GitHub link shows; defaults to the search that reproduces the count. */
  linkLabel?: string;
};

/** Reviews lead: it's the metric a merged-PR count hides the most. */
const SECONDARY: readonly Tile[] = [
  {
    metric: "issuesResolved",
    label: "Issues resolved",
    hint: "Closed by my merged pull requests",
    // The search lists the PRs; the number is the distinct issues they closed.
    linkLabel: "See the PRs",
  },
  {
    metric: "issuesHelped",
    label: "Issues helped on",
    hint: "Other people's issues I've weighed in on",
  },
  {
    metric: "prsOpen",
    label: "PRs in review",
    hint: "Open at the last sync, awaiting review",
  },
  {
    metric: "issuesOpened",
    label: "Issues reported",
    hint: "Bugs and proposals I've filed",
  },
];

const tileClass =
  "group relative flex flex-col overflow-hidden rounded-xl border border-site-border bg-site-card p-5 transition-colors hover:border-site-border-hover focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10";

function VerifyHint({ label }: { label?: string }) {
  return (
    <span className="mt-auto whitespace-nowrap pt-3 font-mono text-[11px] text-site-text-tertiary transition-colors group-hover:text-site-accent">
      {label ?? (
        <>
          Verify<span className="hidden sm:inline"> on GitHub</span>
        </>
      )}{" "}
      ↗
    </span>
  );
}

/** Two bars that make the reviewed-to-merged ratio visible at a glance. */
function ReviewedVsMerged({
  reviewed,
  merged,
}: {
  reviewed: number;
  merged: number;
}) {
  const rows = [
    { label: "Reviewed for others", value: reviewed, bar: "bg-site-accent" },
    { label: "Merged of my own", value: merged, bar: "bg-site-text-tertiary" },
  ];
  return (
    <dl
      aria-label="Reviewed versus merged pull requests"
      className="relative mt-5 mb-2 flex max-w-sm flex-col gap-2"
    >
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[1fr_auto] gap-x-3">
          <dt className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1px]">
            {row.label}
          </dt>
          <dd className="font-mono text-[11px] text-site-text-secondary tabular-nums">
            {row.value}
          </dd>
          <dd className="col-span-2 h-1.5 overflow-hidden rounded-full bg-site-bg-tertiary">
            <span
              className={cn("block h-full rounded-full", row.bar)}
              style={{ width: `${(row.value / reviewed) * 100}%` }}
            />
          </dd>
        </div>
      ))}
    </dl>
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
          <>
            <p className="relative mt-3 max-w-sm text-site-text-secondary text-sm leading-relaxed">
              That&apos;s{" "}
              <strong className="font-semibold text-site-accent">
                {reviewRatio.toFixed(1)}×
              </strong>{" "}
              the {totalPrs} pull requests of my own that have merged.
            </p>
            <ReviewedVsMerged
              reviewed={activity.prsReviewed}
              merged={totalPrs}
            />
          </>
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
                aria-label="Open"
                className="size-2 rounded-full bg-site-success"
              />
            )}
          </span>
          <span className="mt-1 font-medium text-site-text text-sm">
            {tile.label}
          </span>
          <span className="mt-0.5 text-site-text-tertiary text-xs leading-snug">
            {tile.hint}
          </span>
          <VerifyHint label={tile.linkLabel} />
        </a>
      ))}
    </div>
  );
}
