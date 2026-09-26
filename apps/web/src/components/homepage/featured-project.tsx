import { type FeaturedRepoStats, getFeaturedRepoStats } from "@bhimrazy/github";
import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { siteConfig } from "@/config/site";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { surfaceInteractive } from "./surface";

const UTM = siteConfig.utmParams;
const CHART_W = 100;
const CHART_H = 40;

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

/** The self-authored repo, as the "maintainer" half of the open-source story. */
export default function FeaturedProjectCard() {
  const repo = getFeaturedRepoStats();
  if (!repo) return null;

  const spark = buildSparkline(repo.history);
  const sinceYear = repo.history[0]
    ? new Date(repo.history[0].t).getFullYear()
    : null;

  return (
    <a
      href={`${repo.url}?${UTM}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        surfaceInteractive,
        "group flex h-full flex-col p-6 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:p-7",
      )}
    >
      <span className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <p className="relative font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.2px]">
        Also building my own
      </p>

      <div className="relative mt-4 flex items-center gap-2 text-site-text-secondary">
        <GitHubLogoIcon className="size-4" aria-hidden />
        <span className="font-mono text-sm">{repo.fullName}</span>
      </div>
      <p className="relative mt-2 text-pretty text-site-text-secondary text-sm leading-relaxed">
        {repo.description}
      </p>

      {spark && (
        <div className="relative mt-6 flex flex-1 flex-col">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="min-h-20 w-full flex-1"
            role="img"
            aria-label={`Star growth for ${repo.name}, now at ${repo.stars} stars`}
          >
            <defs>
              <linearGradient id="star-spark-fill" x1="0" y1="0" x2="0" y2="1">
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
          <p className="mt-1.5 flex justify-between font-mono text-[10px] text-site-text-tertiary uppercase tracking-[0.5px]">
            <span>{sinceYear ?? ""}</span>
            <span>Star history</span>
          </p>
        </div>
      )}

      <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
        <span className="flex items-center gap-1.5 font-semibold text-site-accent">
          <StarFilledIcon className="size-3.5" aria-hidden />
          {formatCompact(repo.stars)} stars
        </span>
        <span>{formatCompact(repo.forks)} forks</span>
        {repo.language && <span>{repo.language}</span>}
        <span className="ml-auto font-medium text-site-accent text-sm transition-transform group-hover:translate-x-0.5">
          ↗
        </span>
      </div>
    </a>
  );
}
