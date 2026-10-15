import { getLightningAIEcosystemStats } from "@bhimrazy/github";
import { ArrowLink } from "@/components/section-heading";
import { siteConfig } from "@/config/site";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { surface } from "../../homepage/surface";

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
 * Where the merged open-source PRs land, as one compact strip under the
 * Experience cards: a share bar, then each repo in a row of columns.
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

  return (
    <div className={cn(surface, "mt-4 p-5 sm:p-7")}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <p className="flex items-baseline gap-3">
          <span className="font-bold font-display text-[26px] text-site-text tabular-nums tracking-tight sm:text-[28px]">
            {totalPrs}
          </span>
          <span className="text-site-text-secondary text-sm">
            merged pull requests across Lightning AI repositories
          </span>
        </p>
        <ArrowLink href="/oss">Full open-source journey</ArrowLink>
      </div>

      <div
        className="mt-5 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
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
                  {s.prs} PRs
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
