import {
  getContributedRepos,
  getGitHubStars,
  getMonthlyContributions,
  getOSSActivity,
  getOSSStats,
  getSnapshotMeta,
  ossStartDate,
  username,
} from "@bhimrazy/github";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Chip } from "@/components/chip";
import { Container } from "@/components/container";
import ContactSection from "@/components/homepage/contact-section";
import { ActivityBreakdown } from "@/components/oss/activity-breakdown";
import { ContributionGraph } from "@/components/oss/contribution-graph";
import { OSS_START_LABEL } from "@/components/oss/start-date";
import { Timeline } from "@/components/oss/timeline";
import { PageSection } from "@/components/page-section";
import { PageHeader, SectionHeading } from "@/components/section-heading";
import { SectionSeparator } from "@/components/section-separator";
import { surface } from "@/components/surface";
import { siteConfig } from "@/config/site";
import {
  atLeast,
  formatCompact,
  formatShortDate,
  yearsAtLeast,
} from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

// Search snippets outlive the daily sync, so the description uses a floor.
const COMMITS_FLOOR = Math.floor(getOSSStats().totalCommits / 100) * 100;

export const metadata: Metadata = pageMetadata({
  title: "Open source contributions",
  description: `Bhimraj Yadav is a PyTorch Lightning contributor with ${COMMITS_FLOOR}+ contributions across Lightning, LitServe, LitData and LitGPT, plus reviews and issue work.`,
  path: "/oss",
  keywords: [
    "open source contributions",
    "PyTorch Lightning contributor",
    "LitServe",
    "LitData",
    "LitGPT",
    "Lightning AI",
    "code review",
  ],
});

const USERNAME = username;
const UTM = siteConfig.utmParams;

function repoUrl(fullName: string, org: string): string {
  if (org.toLowerCase() === USERNAME.toLowerCase()) {
    return `https://github.com/${fullName}?${UTM}`;
  }
  return `https://github.com/${fullName}/pulls?q=is%3Apr+author%3A${USERNAME}+is%3Amerged&${UTM}`;
}

/** Months elapsed between two ISO-ish date strings (year/month precision). */
function monthsBetween(fromISO: string, toISO: string): number {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  return (
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  );
}

export default async function OSSPage() {
  const contributions = getContributedRepos();
  const oss = getOSSStats();
  const monthly = getMonthlyContributions();
  // Hidden while the committed snapshot predates the activity metrics.
  const hasActivity = getOSSActivity().prsReviewed > 0;
  const { generatedAt } = getSnapshotMeta();

  const maxRepoCommits = Math.max(...contributions.map((c) => c.commits), 1);

  const stats = [
    { value: atLeast(oss.totalCommits), label: "Contributions" },
    { value: atLeast(oss.totalPrs), label: "PRs merged" },
    {
      value: atLeast(getGitHubStars()),
      label: "Stars on my repos",
    },
    {
      value: yearsAtLeast(monthsBetween(ossStartDate, generatedAt)),
      label: `Active since ${OSS_START_LABEL}`,
    },
  ];

  const sections = [
    hasActivity && "beyond",
    "activity",
    "contributions",
    "journey",
  ].filter(Boolean);
  const index = (key: string) =>
    String(sections.indexOf(key) + 1).padStart(2, "0");

  return (
    <main>
      <section className="pt-28 pb-20 sm:pb-24">
        <Container className="px-4 sm:px-8">
          <PageHeader
            eyebrow="Open source"
            title="My open-source journey"
            description="Contributing to open source has shaped how I write software, think about APIs, and collaborate at scale. Here's the story — with numbers synced daily from GitHub."
          />

          <dl className={cn(surface, "mt-12 grid grid-cols-2 sm:grid-cols-4")}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col-reverse items-center px-3 py-7 text-center sm:py-9",
                  "border-site-border dark:border-white/5",
                  // 2×2 on phones, one row from sm: hairlines between cells.
                  i % 2 === 1 && "border-l",
                  i >= 2 && "border-t sm:border-t-0",
                  i === 2 && "sm:border-l",
                )}
              >
                <dt className="mt-1.5 text-site-text-secondary text-sm">
                  {stat.label}
                </dt>
                <dd className="whitespace-nowrap font-bold font-display text-[28px] text-site-text tabular-nums tracking-tight sm:text-[34px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-right font-mono text-[11px] text-site-text-tertiary">
            Synced from GitHub {formatShortDate(generatedAt)}
          </p>
        </Container>
      </section>

      {hasActivity && (
        <>
          <SectionSeparator />
          <PageSection id="beyond">
            <SectionHeading
              index={index("beyond")}
              eyebrow="Maintainer work"
              title="Beyond the merge button"
              description="Reviews, resolved issues, and support threads across the same repos — each number links to the GitHub search behind it."
            />
            <ActivityBreakdown />
          </PageSection>
        </>
      )}

      <SectionSeparator />
      <PageSection id="activity">
        <SectionHeading
          index={index("activity")}
          eyebrow="Activity"
          title="Month by month"
        />
        <ContributionGraph data={monthly} />
      </PageSection>

      <SectionSeparator />
      <PageSection id="contributions">
        <SectionHeading
          index={index("contributions")}
          eyebrow="Repositories"
          title="Key contributions"
          description="Every repo where I have more than one commit — synced daily from GitHub."
        />
        <div
          className={cn(
            surface,
            "divide-y divide-site-border dark:divide-white/5",
          )}
        >
          {contributions.map((c) => (
            <a
              key={c.fullName}
              href={repoUrl(c.fullName, c.org)}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group relative isolate flex flex-col gap-1.5 overflow-hidden px-4 py-3 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
              title={c.fullName}
            >
              {/* Bar width ranks repos by commit volume at a glance. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 -z-10 bg-site-accent-subtle transition-all duration-300 group-hover:bg-site-accent/15"
                style={{
                  width: `${Math.max((c.commits / maxRepoCommits) * 100, 5)}%`,
                }}
              />

              <div className="flex min-w-0 items-center gap-2 sm:w-72 sm:shrink-0 lg:w-80">
                <GitHubLogoIcon className="h-3.5 w-3.5 shrink-0 text-site-text-tertiary transition-colors group-hover:text-site-accent" />
                <h3 className="min-w-0 truncate font-display font-semibold text-[15px] text-site-text">
                  {c.name}
                </h3>
                <Chip className="ml-auto shrink-0 font-mono text-[10px] sm:ml-0">
                  {c.org}
                </Chip>
              </div>

              {c.description && (
                <p
                  title={c.description}
                  className="hidden min-w-0 shrink truncate text-[13px] text-site-text-secondary md:block md:max-w-xs lg:max-w-md"
                >
                  {c.description}
                </p>
              )}

              <div className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-[11px] text-site-text-tertiary sm:ml-auto sm:flex sm:items-center">
                <span className="text-site-accent-text">
                  {atLeast(c.commits, 5)} commits
                </span>
                {c.prs > 0 && <span>{atLeast(c.prs, 5)} PRs</span>}
                {/* Others' repos: popularity context, so compact is enough. */}
                <span>★ {formatCompact(c.stars)}</span>
                <span>⑂ {formatCompact(c.forks)}</span>
              </div>
            </a>
          ))}
        </div>
      </PageSection>

      <SectionSeparator />
      <PageSection id="journey">
        <SectionHeading
          index={index("journey")}
          eyebrow="Journey"
          title="How I got here"
        />
        <Timeline />
      </PageSection>

      <ContactSection index={String(sections.length + 1).padStart(2, "0")} />
    </main>
  );
}
