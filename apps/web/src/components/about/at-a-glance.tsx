import {
  getContributedRepos,
  getGitHubStars,
  getOSSStats,
  getSnapshotMeta,
} from "@bhimrazy/github";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeading } from "./section-heading";

const FACTS: readonly { term: string; detail: ReactNode }[] = [
  { term: "Based in", detail: "Kathmandu, Nepal · UTC+5:45" },
  {
    term: "Day job",
    detail: "Software Engineer at Fetchly Labs · remote, since 2022",
  },
  {
    term: "Open source",
    detail: "Tier 2 OSS Contributor at Lightning AI · LitData core team",
  },
  { term: "Consulting", detail: "StableCluster · since 2024" },
  {
    term: "Research",
    detail: (
      <Link
        href="/research"
        className="underline decoration-site-accent/40 underline-offset-4 transition-colors hover:text-site-accent"
      >
        IEEE Access, vol. 12 · 2024
      </Link>
    ),
  },
  {
    term: "Focus",
    detail: "Model serving, data pipelines, training frameworks, vision",
  },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const SYNC_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function AtAGlance() {
  const oss = getOSSStats();
  const stats = [
    { value: `${formatCount(oss.totalCommits)}+`, label: "Contributions" },
    { value: `${oss.totalPrs}`, label: "PRs merged" },
    { value: `${getContributedRepos().length}`, label: "OSS repos" },
    { value: `${formatCount(getGitHubStars())}+`, label: "Stars earned" },
  ];
  const syncedOn = SYNC_DATE.format(new Date(getSnapshotMeta().generatedAt));

  return (
    <section aria-labelledby="glance" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="glance"
          index="01"
          eyebrow="At a glance"
          title="The short version"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Fact sheet */}
          <dl className="divide-y divide-site-border overflow-hidden rounded-2xl border border-site-border bg-site-card lg:col-span-3 dark:divide-white/5 dark:border-white/5 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
            {FACTS.map(({ term, detail }) => (
              <div
                key={term}
                className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[140px_1fr] sm:gap-6 sm:px-6"
              >
                <dt className="font-mono text-[11px] text-site-text-tertiary uppercase leading-6 tracking-[1.2px]">
                  {term}
                </dt>
                <dd className="text-[15px] text-site-text leading-6">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>

          {/* Live numbers */}
          <div className="flex flex-col lg:col-span-2">
            <div className="grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-site-border bg-site-border dark:border-white/5 dark:bg-white/5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-end bg-site-card px-5 py-6 dark:bg-site-bg"
                >
                  <span className="font-bold font-display text-3xl text-site-text tracking-tight sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-site-text-tertiary">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-site-accent"
              />
              Synced from GitHub · {syncedOn}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
