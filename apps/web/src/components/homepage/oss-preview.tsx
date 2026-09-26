import { getLightningAIEcosystemStats } from "@bhimrazy/github";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import FeaturedProjectCard from "./featured-project";
import { surface } from "./surface";

const UTM = siteConfig.utmParams;

/** Accent ramp for the bar segments, strongest first; the remainder is neutral. */
const SEGMENT_TONES = [
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
  href?: string;
  description?: string;
  stars?: number;
};

export default async function OSSPreview() {
  const { totalPrs, repos } = getLightningAIEcosystemStats();

  const tracked: Segment[] = repos.map((repo, i) => ({
    key: repo.fullName,
    name: repo.name,
    prs: repo.prs,
    tone: SEGMENT_TONES[i] ?? REST_TONE,
    href: `https://github.com/${repo.fullName}/pulls?q=is%3Apr+author%3A${siteConfig.author.username}+is%3Amerged&${UTM}`,
    description: repo.description,
    stars: repo.stars,
  }));
  // totalPrs is an org-wide search; the rest landed in smaller Lightning repos.
  const restPrs = Math.max(
    0,
    totalPrs - tracked.reduce((sum, s) => sum + s.prs, 0),
  );
  const segments: Segment[] = restPrs
    ? [
        ...tracked,
        {
          key: "rest",
          name: "Other Lightning AI repos",
          prs: restPrs,
          tone: REST_TONE,
        },
      ]
    : tracked;
  const barTotal = segments.reduce((sum, s) => sum + s.prs, 0) || 1;

  return (
    <section
      id="open-source"
      className="relative scroll-mt-20 border-site-border/60 border-y bg-site-bg-secondary/40 py-24 sm:py-28 dark:border-white/4 dark:bg-white/1.5"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-site-accent/40 to-transparent" />

      <Container>
        <SectionHeading
          index="01"
          eyebrow="Open source"
          title="Where the merged PRs land"
          description="As a Tier 2 contributor at Lightning AI, most of my open-source work goes into the stack teams use to load data, train, and serve models."
          action={{ href: "/oss", label: "Full OSS journey" }}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          {/* Contributor: PR distribution across the Lightning AI stack */}
          <div className={cn(surface, "p-6 sm:p-7")}>
            <p className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.2px]">
              Share of merged PRs · Lightning AI
            </p>

            <div
              className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-full"
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

            <ul className="mt-6 divide-y divide-site-border/60 dark:divide-white/5">
              {segments.map((s) => {
                const row = (
                  <>
                    <span
                      aria-hidden
                      className={cn(
                        "mt-1.5 size-2.5 shrink-0 rounded-sm",
                        s.tone,
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-display font-semibold text-site-text transition-colors group-hover:text-site-accent">
                          {s.name}
                        </span>
                        {s.stars !== undefined && (
                          <span className="font-mono text-[11px] text-site-text-tertiary">
                            ★ {formatCompact(s.stars)}
                          </span>
                        )}
                      </span>
                      {s.description && (
                        <span className="mt-0.5 line-clamp-1 block text-site-text-secondary text-sm">
                          {s.description}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-bold font-display text-lg text-site-text tabular-nums leading-none">
                        {s.prs}
                      </span>
                      <span className="font-mono text-[10px] text-site-text-tertiary uppercase tracking-[0.5px]">
                        PRs
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={s.key}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group -mx-3 flex items-start gap-3 rounded-lg px-3 py-3.5 transition-colors hover:bg-site-bg-secondary/70 focus-visible:outline-2 focus-visible:outline-site-accent dark:hover:bg-white/3"
                      >
                        {row}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 py-3.5">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Maintainer: the self-authored project */}
          <FeaturedProjectCard />
        </div>
      </Container>
    </section>
  );
}
