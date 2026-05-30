import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContributionGraph } from "@/components/oss/contribution-graph";
import { Timeline } from "@/components/oss/timeline";
import { Card, CardContent } from "@/components/ui/card";
import { ossRepos } from "@/config/oss";
import { siteConfig } from "@/config/site";
import {
  getContributedRepos,
  getGitHubStars,
  getMonthlyContributions,
  getOSSStats,
} from "@/lib/github";

export const metadata: Metadata = {
  title: "Open Source Journey — Bhimraj Yadav",
  description:
    "200+ contributions across PyTorch Lightning, LitServe, LitData, and LitGPT. My open source story.",
  alternates: { canonical: "/oss" },
};

const USERNAME = "bhimrazy";
const OSS_START_YEAR = 2022;
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
  const [contributions, oss, monthly, ownStars] = await Promise.all([
    getContributedRepos(USERNAME, ossRepos),
    getOSSStats(USERNAME, ossRepos),
    getMonthlyContributions(USERNAME, ossRepos),
    getGitHubStars(USERNAME),
  ]);

  const currentYear = monthly.at(-1)?.year ?? OSS_START_YEAR;
  const yearsActive = currentYear - OSS_START_YEAR;

  const stats = [
    {
      value:
        oss.totalCommits > 0 ? `${formatCount(oss.totalCommits)}+` : "300+",
      label: "Contributions",
    },
    {
      value: oss.totalPrs > 0 ? `${oss.totalPrs}` : "220+",
      label: "PRs Merged",
    },
    {
      value: ownStars > 0 ? `${formatCount(ownStars)}+` : "200+",
      label: "Stars Earned",
    },
    { value: `${yearsActive}`, label: "Years Active" },
  ];

  return (
    <main className="pt-28 pb-20">
      <Container>
        {/* Hero */}
        <div className="mb-16">
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
        <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-site-border shadow-lg/2 transition-shadow duration-200 hover:shadow-xl/5 sm:grid-cols-4">
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
        <div className="mb-16">
          <ContributionGraph data={monthly} />
        </div>

        {/* Timeline */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Journey
        </h2>
        <div className="mb-16">
          <Timeline />
        </div>

        {/* Contributions */}
        <h2 className="mb-2 font-bold font-display text-2xl text-site-text">
          Key Contributions
        </h2>
        <p className="mb-6 text-site-text-secondary text-sm">
          Every repo where I have more than one contribution — live from GitHub.
        </p>
        <div className="flex flex-col gap-4">
          {contributions.map((c) => (
            <a
              key={c.fullName}
              href={repoUrl(c.fullName, c.org)}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group block"
            >
              <Card className="relative overflow-hidden border border-site-border/50 bg-site-card transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-site-border-hover group-hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:group-hover:border-white/10 dark:group-hover:shadow-site-accent-subtle">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <GitHubLogoIcon className="h-4 w-4 text-site-text-tertiary" />
                        <h3 className="font-display font-semibold text-base text-site-text">
                          {c.name}
                        </h3>
                        <span className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[10px] text-site-accent">
                          {c.org}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-site-text-secondary text-sm leading-relaxed">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-4 font-mono text-site-text-tertiary text-xs sm:flex-col sm:items-end sm:gap-1.5 sm:text-right">
                      <span className="text-site-accent">
                        {c.commits} commits
                      </span>
                      {c.prs > 0 && <span>{c.prs} PRs</span>}
                      <span>★ {formatCount(c.stars)}</span>
                      <span>⑂ {formatCount(c.forks)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}
