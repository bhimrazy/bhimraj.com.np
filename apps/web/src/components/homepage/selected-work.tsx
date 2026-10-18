import { type FeaturedRepoStats, getFeaturedRepoStats } from "@bhimrazy/github";
import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SELECTED_WORK } from "./data";
import { surfaceInteractive } from "./surface";

type Work = (typeof SELECTED_WORK)[number];

const CHART_W = 100;
const CHART_H = 40;

function sparkline(history: FeaturedRepoStats["history"]) {
  if (history.length < 2) return null;
  const t0 = history[0].t;
  const tRange = history[history.length - 1].t - t0 || 1;
  const sMax = history[history.length - 1].stars || 1;
  const line = history
    .map((p, i) => {
      const x = ((p.t - t0) / tRange) * CHART_W;
      const y = CHART_H - (p.stars / sMax) * CHART_H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return { line, area: `${line} L${CHART_W},${CHART_H} L0,${CHART_H} Z` };
}

function CardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    surfaceInteractive,
    "group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2",
    className,
  );
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

function Arrow({ href }: { href: string }) {
  return (
    <span
      aria-hidden
      className="text-site-accent text-sm transition-transform group-hover:translate-x-0.5"
    >
      {href.startsWith("http") ? "↗" : "→"}
    </span>
  );
}

function KindRow({ work }: { work: Work }) {
  return (
    <p className="flex items-center justify-between gap-3 font-mono text-[11px]">
      <span className="rounded-md bg-site-accent-subtle px-2 py-0.5 text-site-accent">
        {work.kind}
      </span>
      <span className="text-site-text-tertiary">
        {work.meta === "stars" ? null : work.meta}
      </span>
    </p>
  );
}

/** Receipt OCR: the one self-started project, with its live star history. */
function FeaturedCard({ work }: { work: Work }) {
  const repo = getFeaturedRepoStats();
  const spark = repo ? sparkline(repo.history) : null;
  const since = repo?.history[0]
    ? new Date(repo.history[0].t).getUTCFullYear()
    : null;

  return (
    <CardLink href={work.href} className="p-6 sm:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-site-accent-subtle opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <KindRow work={work} />

      <div className="relative mt-5 flex items-start justify-between gap-4">
        <h3 className="font-display font-semibold text-2xl text-site-text tracking-tight sm:text-[28px]">
          {work.title}
        </h3>
        <Arrow href={work.href} />
      </div>
      <p className="relative mt-2 max-w-lg text-pretty text-site-text-secondary leading-relaxed">
        {work.line}
      </p>

      {repo && spark && (
        <div className="relative mt-8 flex flex-1 flex-col">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="min-h-28 w-full flex-1"
            role="img"
            aria-label={`Star history for ${repo.fullName}, now at ${repo.stars} stars`}
          >
            <defs>
              <linearGradient id="v-b-spark" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--site-accent)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor="var(--site-accent)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path d={spark.area} fill="url(#v-b-spark)" />
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
          <p className="mt-2 flex justify-between font-mono text-[10px] text-site-text-tertiary uppercase tracking-[0.5px]">
            <span>{since ?? ""}</span>
            <span>Stars over time</span>
          </p>
        </div>
      )}

      {repo && (
        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
          <span className="flex items-center gap-1.5 font-semibold text-site-accent">
            <StarFilledIcon className="size-3.5" aria-hidden />
            {formatCompact(repo.stars)} stars
          </span>
          <span>{formatCompact(repo.forks)} forks</span>
          {repo.language && <span>{repo.language}</span>}
          <span className="ml-auto hidden items-center gap-1.5 font-mono sm:flex">
            <GitHubLogoIcon className="size-3.5" aria-hidden />
            {repo.fullName}
          </span>
        </div>
      )}
    </CardLink>
  );
}

type Stat = { value: string; label: string };

function WorkCard({
  work,
  line = work.line,
  stat,
}: {
  work: Work;
  line?: string;
  stat?: Stat;
}) {
  return (
    <CardLink href={work.href} className="p-6">
      <KindRow work={work} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-pretty font-display font-semibold text-lg text-site-text leading-snug">
          {work.title}
        </h3>
        <Arrow href={work.href} />
      </div>
      <p className="mt-2 flex-1 text-pretty text-site-text-secondary text-sm leading-relaxed">
        {line}
      </p>
      {stat && (
        <p className="mt-5 flex items-baseline gap-2.5 border-site-border/60 border-t pt-4 dark:border-white/5">
          <span className="font-bold font-display text-2xl text-site-text tracking-tight">
            {stat.value}
          </span>
          <span className="text-pretty text-site-text-tertiary text-xs leading-snug">
            {stat.label}
          </span>
        </p>
      )}
    </CardLink>
  );
}

/*
 * Grid: Receipt OCR takes a 2×2 block (it has a chart to show), two cards
 * stack beside it, and the paper runs full width underneath.
 */
export default function SelectedWork() {
  const [featured, ...rest] = SELECTED_WORK;

  return (
    <section id="work" className="scroll-mt-20 py-20 sm:py-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Projects"
          title="Selected work"
          description="My own projects, model APIs, and research."
          action={{ href: "/projects", label: "All projects" }}
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li className="md:col-span-2 lg:row-span-2">
            <FeaturedCard work={featured} />
          </li>
          {rest.map((work, i) => (
            <li
              key={work.title}
              className={cn(
                i === rest.length - 1 && "md:col-span-2 lg:col-span-3",
              )}
            >
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
