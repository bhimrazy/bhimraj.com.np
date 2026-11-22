import { type FeaturedRepoStats, getFeaturedRepoStats } from "@bhimrazy/github";
import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { surfaceInteractive } from "@/components/surface";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SELECTED_WORK } from "./data";

type Work = (typeof SELECTED_WORK)[number];
type Featured = (typeof SELECTED_WORK)[0];

const CHART_W = 100;
const CHART_H = 40;

function sparkline(history: FeaturedRepoStats["history"]) {
  if (history.length < 2) return null;
  const t0 = history[0].t;
  const tRange = history[history.length - 1].t - t0 || 1;
  // Stars can drop (unstars), so scale to the peak, not the latest point.
  const sMax = Math.max(...history.map((p) => p.stars)) || 1;
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

/** The title is a stretched link, so the app and repo links can sit inside the card without nesting <a>. */
function FeaturedCard({ work }: { work: Featured }) {
  const repo = getFeaturedRepoStats();
  const spark = repo ? sparkline(repo.history) : null;
  const since = repo?.history[0]
    ? new Date(repo.history[0].t).getUTCFullYear()
    : null;

  return (
    <article
      className={cn(
        surfaceInteractive,
        "group isolate flex h-full flex-col p-6 sm:p-8",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 -z-10 size-72 rounded-full bg-site-accent-subtle opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <KindRow work={work} />

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="font-display font-semibold text-2xl text-site-text tracking-tight sm:text-[28px]">
          <Link
            href={work.href}
            className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-site-accent focus-visible:after:outline-offset-2"
          >
            {work.title}
          </Link>
        </h3>
        <Arrow href={work.href} />
      </div>
      <p className="mt-2 max-w-lg text-pretty text-site-text-secondary leading-relaxed">
        {work.line}
      </p>

      {repo && spark && (
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="h-24 w-full sm:h-28"
            role="img"
            aria-label={`Star history for ${repo.fullName}, now at ${repo.stars} stars`}
          >
            <defs>
              <linearGradient
                id="receipt-ocr-spark"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
            <path d={spark.area} fill="url(#receipt-ocr-spark)" />
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
            <span>GitHub stars · now</span>
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
        {repo && (
          <>
            <span className="flex items-center gap-1.5 font-semibold text-site-accent">
              <StarFilledIcon className="size-3.5" aria-hidden />
              {formatCompact(repo.stars)} stars
            </span>
            <span>{formatCompact(repo.forks)} forks</span>
            {repo.language && <span>{repo.language}</span>}
          </>
        )}
        {/* z-10 lifts these above the title's stretched link. */}
        <span className="relative z-10 ml-auto flex items-center gap-2">
          {repo && (
            <a
              href={`https://github.com/${repo.fullName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 font-mono text-site-text-secondary transition-colors hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent"
            >
              <GitHubLogoIcon className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{repo.fullName}</span>
              <span className="sm:hidden">Source</span>
            </a>
          )}
          <a
            href={work.app}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-site-accent px-3.5 font-semibold text-site-on-accent text-sm transition-colors hover:bg-site-accent/85 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
          >
            Try the app <span aria-hidden>↗</span>
          </a>
        </span>
      </div>
    </article>
  );
}

function WorkCard({ work }: { work: Work }) {
  return (
    <CardLink href={work.href} className="p-6">
      <KindRow work={work} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-pretty font-display font-semibold text-lg text-site-text leading-snug">
          {work.title}
        </h3>
        <Arrow href={work.href} />
      </div>
      <p className="mt-2 text-pretty text-site-text-secondary text-sm leading-relaxed">
        {work.line}
      </p>
      {"terminal" in work && (
        <div className="mt-5 flex flex-1 flex-col justify-center">
          <pre className="overflow-x-auto rounded-lg border border-site-border/60 bg-site-bg/60 p-4 font-mono text-[11px] leading-relaxed dark:border-white/5">
            {work.terminal.map(({ cmd, out }) => (
              <span key={cmd} className="not-first:mt-2 block">
                <span className="text-site-accent">$</span>{" "}
                <span className="text-site-text">{cmd}</span>
                {"\n"}
                <span className="text-site-text-tertiary">{out}</span>
              </span>
            ))}
          </pre>
        </div>
      )}
      {"stack" in work && (
        <p className="mt-5 flex items-center justify-between gap-3 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
          <span>{work.stack}</span>
          <span className="font-mono">{new URL(work.href).host}</span>
        </p>
      )}
    </CardLink>
  );
}

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
          <li className="md:col-span-2">
            <FeaturedCard work={featured} />
          </li>
          {rest.map((work, i) => (
            <li
              key={work.title}
              className={cn(i === rest.length - 1 && "md:col-span-2")}
            >
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
