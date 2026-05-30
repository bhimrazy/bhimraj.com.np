import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Open Source Journey — Bhimraj Yadav",
  description:
    "200+ contributions across PyTorch Lightning, LitServe, LitData, and LitGPT. My open source story.",
  alternates: { canonical: "/oss" },
};

const STATS = [
  { value: "200+", label: "Total Contributions" },
  { value: "50+", label: "PRs Merged" },
  { value: "4", label: "Major Projects" },
  { value: "2", label: "Years Active" },
] as const;

const CONTRIBUTIONS = [
  {
    project: "LitServe",
    org: "Lightning AI",
    url: "https://github.com/Lightning-AI/LitServe",
    description:
      "Enhanced OpenAI API compatibility layer, enabling drop-in replacement for existing integrations. Improved request handling and response streaming.",
    prs: 18,
    highlights: [
      "OpenAI compatibility",
      "Streaming responses",
      "Auth middleware",
    ],
  },
  {
    project: "LitData",
    org: "Lightning AI",
    url: "https://github.com/Lightning-AI/litdata",
    description:
      "Added AES encryption support for streaming datasets and integrated MosaicML StreamingDataset format for cross-framework data loading.",
    prs: 14,
    highlights: [
      "AES encryption",
      "MosaicML integration",
      "Format compatibility",
    ],
  },
  {
    project: "PyTorch Lightning",
    org: "Lightning AI",
    url: "https://github.com/Lightning-AI/pytorch-lightning",
    description:
      "Bug fixes, documentation improvements, and test coverage enhancements across the core training loop.",
    prs: 12,
    highlights: ["Bug fixes", "Test coverage", "Docs improvements"],
  },
  {
    project: "LitGPT",
    org: "Lightning AI",
    url: "https://github.com/Lightning-AI/litgpt",
    description:
      "Contributions to model evaluation pipelines and inference optimizations for large language models.",
    prs: 8,
    highlights: ["Eval pipelines", "Inference optimization", "Model support"],
  },
  {
    project: "receipt-ocr",
    org: "bhimrazy",
    url: "https://github.com/bhimrazy/receipt-ocr",
    description:
      "Built and maintain an efficient OCR engine for receipt processing using FastAPI and PyTorch. 195 stars, 40 forks.",
    prs: null,
    highlights: ["FastAPI", "PyTorch", "195 ★"],
  },
] as const;

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

export default function OSSPage() {
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
            about APIs, and collaborate at scale. Here&apos;s the story.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 overflow-hidden rounded-xl bg-site-border sm:grid-cols-4">
          {STATS.map((stat) => (
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

        {/* Contributions */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Key Contributions
        </h2>
        <div className="mb-16 flex flex-col gap-4">
          {CONTRIBUTIONS.map((c) => (
            <a
              key={c.project}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="relative overflow-hidden border border-site-border/50 bg-site-card transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-site-border-hover group-hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:group-hover:border-white/10 dark:group-hover:shadow-site-accent-subtle">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-semibold text-base text-site-text">
                          {c.project}
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
                    {c.prs != null && (
                      <div className="shrink-0 text-right font-mono text-site-text-tertiary text-xs">
                        {c.prs} PRs merged
                      </div>
                    )}
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
