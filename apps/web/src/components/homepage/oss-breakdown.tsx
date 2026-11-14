import {
  getLightningAIEcosystemStats,
  getOSSActivity,
  getOSSActivitySearchUrls,
  getOSSStats,
} from "@bhimrazy/github";
import { ArrowLink } from "@/components/section-heading";
import { surface } from "@/components/surface";
import { siteConfig } from "@/config/site";
import { atLeast, formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Accent ramp, strongest first; the remainder is neutral. */
const TONES = [
  "bg-site-accent",
  "bg-site-accent/70",
  "bg-site-accent/45",
  "bg-site-accent/25",
] as const;
const REST_TONE = "bg-site-text-tertiary/35";

type Segment = {
  key: string;
  name: string;
  prs: number;
  tone: string;
  stars?: number;
  href?: string;
};

/**
 * Open-source activity under the Experience cards: headline counts (reviews
 * and issue work, not just merged PRs), then where the merged PRs land.
 */
export function OssBreakdown() {
  const { totalPrs, repos } = getLightningAIEcosystemStats();
  const tracked: Segment[] = repos.map((repo, i) => ({
    key: repo.fullName,
    name: repo.name,
    prs: repo.prs,
    tone: TONES[i] ?? REST_TONE,
    stars: repo.stars,
    href: `https://github.com/${repo.fullName}/pulls?q=is%3Apr+author%3A${siteConfig.author.username}+is%3Amerged&${siteConfig.utmParams}`,
  }));
  // totalPrs is an org-wide search; the rest landed in smaller repos.
  const restPrs = Math.max(
    0,
    totalPrs - tracked.reduce((sum, s) => sum + s.prs, 0),
  );
  const segments: Segment[] = restPrs
    ? [
        ...tracked,
        { key: "rest", name: "Other repos", prs: restPrs, tone: REST_TONE },
      ]
    : tracked;
  const barTotal = segments.reduce((sum, s) => sum + s.prs, 0) || 1;

  const activity = getOSSActivity();
  const search = getOSSActivitySearchUrls();
  const stats = [
    { value: getOSSStats().totalPrs, label: "PRs merged", href: "/oss" },
    {
      value: activity.prsReviewed,
      label: "PRs reviewed",
      href: search.prsReviewed,
    },
    {
      value: activity.issuesHelped,
      label: "issues helped on",
      href: search.issuesHelped,
    },
    {
      value: activity.issuesResolved,
      label: "issues resolved",
      href: search.issuesResolved,
    },
  ];

  return (
    <div className={cn(surface, "mt-4 p-5 sm:p-7")}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-medium font-mono text-[12px] text-site-text-tertiary uppercase tracking-[1.2px]">
          In open source
        </p>
        <ArrowLink href="/oss">Full open-source journey</ArrowLink>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-site-text-secondary text-sm">{s.label}</dt>
            <dd>
              <a
                href={s.href}
                {...(s.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="rounded-sm font-bold font-display text-[26px] text-site-text tabular-nums tracking-tight transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:text-[28px]"
              >
                {atLeast(s.value)}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-7 border-site-border/60 border-t pt-5 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1px] dark:border-white/5">
        Merged PRs across the Lightning AI ecosystem
      </p>
      <div
        className="mt-3 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={segments
          .map((s) => `${s.name}: ${s.prs} merged PRs`)
          .join(", ")}
      >
        {segments.map((s) => (
          <span
            key={s.key}
            className={cn(
              "h-full first:rounded-l-full last:rounded-r-full",
              s.tone,
            )}
            style={{ width: `${(s.prs / barTotal) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {segments.map((s) => {
          const body = (
            <>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2 shrink-0 rounded-sm", s.tone)}
                />
                <span className="truncate font-medium text-site-text text-sm transition-colors group-hover:text-site-accent">
                  {s.name}
                </span>
              </span>
              <span className="mt-1 block pl-4 font-mono text-[11px] text-site-text-tertiary">
                <span className="text-site-text-secondary tabular-nums">
                  {atLeast(s.prs, 5)} PRs
                </span>
                {s.stars !== undefined && ` · ★ ${formatCompact(s.stars)}`}
              </span>
            </>
          );
          return (
            <li key={s.key} className="min-w-0">
              {s.href ? (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
