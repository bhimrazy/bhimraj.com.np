import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContributionGraph } from "@/components/oss/contribution-graph";
import { Card, CardContent } from "@/components/ui/card";
import { featuredRepo, ossRepos } from "@/config/oss";
import { siteConfig } from "@/config/site";
import {
  getFeaturedRepoStats,
  getGitHubStars,
  getLightningAIEcosystemStats,
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

/** Curated narrative + highlights, merged with live GitHub numbers by repo slug. */
const CONTRIB_COPY: Record<
  string,
  { org: string; description: string; highlights: readonly string[] }
> = {
  "Lightning-AI/LitServe": {
    org: "Lightning AI",
    description:
      "Enhanced the OpenAI API compatibility layer, enabling drop-in replacement for existing integrations, plus improvements to request handling and response streaming.",
    highlights: [
      "OpenAI compatibility",
      "Streaming responses",
      "Auth middleware",
    ],
  },
  "Lightning-AI/litdata": {
    org: "Lightning AI",
    description:
      "Added AES encryption support for streaming datasets and integrated the MosaicML StreamingDataset format for cross-framework data loading.",
    highlights: [
      "AES encryption",
      "MosaicML integration",
      "Format compatibility",
    ],
  },
  "Lightning-AI/pytorch-lightning": {
    org: "Lightning AI",
    description:
      "Bug fixes, documentation improvements, and test-coverage enhancements across the core training loop.",
    highlights: ["Bug fixes", "Test coverage", "Docs improvements"],
  },
  "Lightning-AI/litgpt": {
    org: "Lightning AI",
    description:
      "Contributions to model evaluation pipelines and inference optimizations for large language models.",
    highlights: ["Eval pipelines", "Inference optimization", "Model support"],
  },
  "bhimrazy/receipt-ocr": {
    org: "bhimrazy",
    description:
      "Built and maintain an efficient OCR engine for receipt processing using FastAPI and PyTorch.",
    highlights: ["FastAPI", "PyTorch", "Self-authored"],
  },
};

const TIMELINE = [
  {
    year: "2024",
    event: "Reached Tier 2 OSS Contributor status at Lightning AI",
  },
  {
    year: "2023",
    event: "Merged 50th PR at Lightning AI — LitData encryption support",
  },
  { year: "2023", event: "receipt-ocr crossed 100 GitHub stars" },
  {
    year: "2022",
    event: "First contribution to PyTorch Lightning — started OSS journey",
  },
  { year: "2022", event: "Led KathFOSS community as Vice President" },
] as const;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type ContribCard = {
  name: string;
  fullName: string;
  url: string;
  org: string;
  description: string;
  highlights: readonly string[];
  prs: number | null;
  stars: number;
  forks: number;
};

function mergedPrsUrl(fullName: string): string {
  return `https://github.com/${fullName}/pulls?q=is%3Apr+author%3A${USERNAME}+is%3Amerged&${UTM}`;
}

export default async function OSSPage() {
  const [ecosystem, oss, monthly, ownStars, ownRepo] = await Promise.all([
    getLightningAIEcosystemStats(USERNAME),
    getOSSStats(USERNAME, ossRepos),
    getMonthlyContributions(USERNAME, ossRepos),
    getGitHubStars(USERNAME),
    getFeaturedRepoStats(featuredRepo),
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

  const contributions: ContribCard[] = ecosystem.repos.map((r) => {
    const copy = CONTRIB_COPY[r.fullName];
    return {
      name: r.name,
      fullName: r.fullName,
      url: mergedPrsUrl(r.fullName),
      org: copy?.org ?? "Lightning AI",
      description: copy?.description ?? r.description,
      highlights: copy?.highlights ?? [],
      prs: r.prs,
      stars: r.stars,
      forks: r.forks,
    };
  });

  if (ownRepo) {
    const copy = CONTRIB_COPY[ownRepo.fullName];
    contributions.push({
      name: ownRepo.name,
      fullName: ownRepo.fullName,
      url: `${ownRepo.url}?${UTM}`,
      org: copy?.org ?? USERNAME,
      description: copy?.description ?? ownRepo.description,
      highlights: copy?.highlights ?? [],
      prs: null,
      stars: ownRepo.stars,
      forks: ownRepo.forks,
    });
  }

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
        <div className="mb-16 grid grid-cols-2 overflow-hidden rounded-xl bg-site-border sm:grid-cols-4">
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

        {/* Contributions */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Key Contributions
        </h2>
        <div className="mb-16 flex flex-col gap-4">
          {contributions.map((c) => (
            <a
              key={c.fullName}
              href={c.url}
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
                      <p className="mb-3 text-site-text-secondary text-sm leading-relaxed">
                        {c.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.highlights.map((h) => (
                          <span
                            key={h}
                            className="rounded-md bg-site-bg-tertiary px-2 py-0.5 font-mono text-[11px] text-site-text-secondary"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 font-mono text-site-text-tertiary text-xs sm:flex-col sm:items-end sm:gap-1.5 sm:text-right">
                      {c.prs != null && c.prs > 0 && (
                        <span className="text-site-accent">{c.prs} PRs</span>
                      )}
                      <span>★ {formatCount(c.stars)}</span>
                      <span>⑂ {formatCount(c.forks)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Timeline
        </h2>
        <div className="flex flex-col gap-4">
          {TIMELINE.map((item) => (
            <div key={item.event} className="flex gap-5">
              <span className="w-12 shrink-0 font-mono text-site-accent text-sm">
                {item.year}
              </span>
              <div className="flex-1 border-site-border border-l pb-4 pl-5">
                <p className="text-site-text-secondary text-sm leading-relaxed">
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
