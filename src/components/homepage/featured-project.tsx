import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { Container } from "@/components/container";
import { featuredRepo } from "@/config/oss";
import { siteConfig } from "@/config/site";
import { type FeaturedRepoStats, getFeaturedRepoStats } from "@/lib/github";

const UTM = siteConfig.utmParams;
const CHART_W = 100;
const CHART_H = 40;

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function buildSparkline(history: FeaturedRepoStats["history"]) {
  if (history.length < 2) return null;

  const tMin = history[0].t;
  const tMax = history[history.length - 1].t;
  const sMax = history[history.length - 1].stars || 1;
  const tRange = tMax - tMin || 1;

  const coords = history.map((p) => {
    const x = ((p.t - tMin) / tRange) * CHART_W;
    const y = CHART_H - (p.stars / sMax) * CHART_H;
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${CHART_W},${CHART_H} L0,${CHART_H} Z`;

  return { line, area };
}

export default async function FeaturedProject() {
  const repo = await getFeaturedRepoStats(featuredRepo);
  if (!repo) return null;

  const spark = buildSparkline(repo.history);
  const sinceYear = repo.history[0]
    ? new Date(repo.history[0].t).getFullYear()
    : null;

  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <div className="mb-12">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Featured Project
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight">
            Building in the open
          </h2>
          <p className="mt-3 max-w-lg text-base text-site-text-secondary">
            A self-authored project that&apos;s found an audience — and keeps
            growing.
          </p>
        </div>

        <a
          href={`${repo.url}?${UTM}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="group block"
        >
          <div className="relative overflow-hidden rounded-xl border border-site-border bg-site-card px-7 py-7 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-site-border-hover group-hover:shadow-xl/5 sm:px-9 sm:py-9 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:group-hover:border-white/10 dark:group-hover:shadow-site-accent-subtle">
            {/* Hover glow */}
            <span className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              {/* Left: meta */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <GitHubLogoIcon className="h-4 w-4 text-site-text-tertiary" />
                  <span className="font-mono text-site-text-secondary text-sm">
                    {repo.fullName}
                  </span>
                </div>

                <h3 className="mb-2 font-bold font-display text-site-text text-xl">
                  {repo.name}
                </h3>
                <p className="mb-5 max-w-md text-site-text-secondary text-sm leading-relaxed">
                  {repo.description}
                </p>

                <div className="flex flex-wrap items-center gap-5 text-site-text-tertiary text-xs">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: "#3572A5" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 font-medium text-site-accent">
                    <StarFilledIcon className="h-3.5 w-3.5" />
                    {formatStars(repo.stars)}
                  </span>
                  <span>⑂ {formatStars(repo.forks)}</span>
                  {sinceYear && <span>since {sinceYear}</span>}
                </div>
              </div>

              {/* Right: star-growth chart */}
              {spark && (
                <div className="w-full sm:w-64">
                  <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
                    <span>Star history</span>
                    <span className="text-site-accent">↗ growing</span>
                  </div>
                  <svg
                    viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                    preserveAspectRatio="none"
                    className="h-16 w-full"
                    role="img"
                    aria-label={`Star growth for ${repo.name}: ${repo.stars} stars`}
                  >
                    <title>{`${repo.name} star history`}</title>
                    <defs>
                      <linearGradient
                        id="star-spark-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--site-accent)"
                          stopOpacity="0.32"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--site-accent)"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path d={spark.area} fill="url(#star-spark-fill)" />
                    <path
                      d={spark.line}
                      fill="none"
                      stroke="var(--site-accent)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="relative mt-7 border-site-border/50 border-t pt-5 dark:border-white/4">
              <span className="inline-flex items-center gap-1.5 font-medium text-site-accent text-sm transition-opacity group-hover:opacity-80">
                View on GitHub →
              </span>
            </div>
          </div>
        </a>
      </Container>
    </section>
  );
}
