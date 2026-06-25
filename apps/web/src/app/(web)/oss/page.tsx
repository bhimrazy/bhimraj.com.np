import {
  getContributedRepos,
  getGitHubStars,
  getMonthlyContributions,
  getOSSStats,
  ossStartYear,
  username,
} from "@bhimrazy/github";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContributionGraph } from "@/components/oss/contribution-graph";
import { Timeline } from "@/components/oss/timeline";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Open Source Journey — Bhimraj Yadav",
  description:
    "200+ contributions across PyTorch Lightning, LitServe, LitData, and LitGPT. My open source story.",
  alternates: { canonical: "/oss" },
};

const USERNAME = username;
const UTM = siteConfig.utmParams;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function repoUrl(fullName: string, org: string): string {
  if (org.toLowerCase() === USERNAME.toLowerCase()) {
    return `https://github.com/${fullName}?${UTM}`;
  }
  return `https://github.com/${fullName}/pulls?q=is%3Apr+author%3A${USERNAME}+is%3Amerged&${UTM}`;
}

export default async function OSSPage() {
  const contributions = getContributedRepos();
  const oss = getOSSStats();
  const monthly = getMonthlyContributions();
  const ownStars = getGitHubStars();

  const currentYear = monthly.at(-1)?.year ?? ossStartYear;
  const yearsActive = currentYear - ossStartYear;

  const maxRepoCommits = Math.max(...contributions.map((c) => c.commits), 1);

  const stats = [
    {
      value: `${formatCount(oss.totalCommits)}+`,
      label: "Contributions",
    },
    {
      value: `${oss.totalPrs}`,
      label: "PRs Merged",
    },
    {
      value: `${formatCount(ownStars)}+`,
      label: "Stars Earned",
    },
    { value: `${yearsActive}+`, label: "Years Active" },
  ];

  return (
    <main className="pt-28 pb-20">
      <Container>
        {/* Hero */}
        <div className="mb-12">
          <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Open Source
          </span>
          <h1 className="mb-4 font-bold font-display text-4xl text-site-text leading-tight sm:text-5xl">
            My OSS Journey
          </h1>
          <p className="max-w-2xl text-lg text-site-text-secondary leading-relaxed">
            Contributing to open source has shaped how I write software, think
            about APIs, and collaborate at scale. Here&apos;s the story — with
            live numbers straight from GitHub.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-site-border shadow-lg/2 transition-shadow duration-200 hover:shadow-xl/5 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-site-card px-6 py-8 text-center"
            >
              <span className="font-bold font-display text-3xl text-site-text">
                {stat.value}
              </span>
              <span className="mt-1 text-site-text-tertiary text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Contribution graph */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Activity
        </h2>
        <div className="mb-12">
          <ContributionGraph data={monthly} />
        </div>

        {/* Contributions */}
        <h2 className="mb-2 font-bold font-display text-2xl text-site-text">
          Key Contributions
        </h2>
        <p className="mb-6 text-site-text-secondary text-sm">
          Every repo where I have more than one contribution — live from GitHub.
        </p>
        <div className="mb-12 divide-y divide-site-border overflow-hidden rounded-xl border border-site-border bg-site-card dark:divide-white/4 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
          {contributions.map((c) => (
            <a
              key={c.fullName}
              href={repoUrl(c.fullName, c.org)}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group relative isolate flex flex-col gap-1.5 overflow-hidden px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
            >
              {/* Commit-volume bar — ranks repos at a glance */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 -z-10 bg-site-accent-subtle transition-all duration-300 group-hover:bg-site-accent/15"
                style={{
                  width: `${Math.max((c.commits / maxRepoCommits) * 100, 5)}%`,
                }}
              />

              {/* Repo + org */}
              <div className="flex items-center gap-2 sm:w-60 sm:shrink-0">
                <GitHubLogoIcon className="h-3.5 w-3.5 shrink-0 text-site-text-tertiary transition-colors group-hover:text-site-accent" />
                <h3 className="truncate font-display font-semibold text-[15px] text-site-text">
                  {c.name}
                </h3>
                <span className="ml-auto shrink-0 rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[10px] text-site-accent sm:ml-0">
                  {c.org}
                </span>
              </div>

              {/* Description (wide screens only) */}
              {c.description && (
                <p className="hidden min-w-0 flex-1 truncate text-[13px] text-site-text-secondary md:block">
                  {c.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-x-3 font-mono text-[11px] text-site-text-tertiary sm:ml-auto sm:shrink-0">
                <span className="text-site-accent">{c.commits} commits</span>
                {c.prs > 0 && <span>{c.prs} PRs</span>}
                <span>★ {formatCount(c.stars)}</span>
                <span>⑂ {formatCount(c.forks)}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Journey
        </h2>
        <div>
          <Timeline />
        </div>
      </Container>
    </main>
  );
}
