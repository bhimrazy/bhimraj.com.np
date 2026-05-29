import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const REPOS = [
  {
    name: "receipt-ocr",
    description:
      "Efficient OCR engine for receipt processing using FastAPI and PyTorch",
    stars: 195,
    forks: 40,
    lang: "Python",
    org: null,
    href: "https://github.com/bhimrazy/receipt-ocr",
  },
  {
    name: "LitServe",
    description:
      "Enhanced OpenAI compatibility & blazing-fast AI model inference",
    stars: null,
    forks: null,
    lang: "Python",
    org: "Lightning AI",
    href: "https://github.com/Lightning-AI/LitServe",
  },
  {
    name: "LitData",
    description: "Encryption support and MosaicML StreamingDataset integration",
    stars: null,
    forks: null,
    lang: "Python",
    org: "Lightning AI",
    href: "https://github.com/Lightning-AI/litdata",
  },
] as const;

export default function OSSPreview() {
  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <div className="mb-12">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Open Source
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight">
            Contributing to the ecosystem
          </h2>
          <p className="mt-3 max-w-lg text-base text-site-text-secondary">
            50+ PRs merged across Lightning AI projects. Building tools
            developers love.
          </p>
        </div>

        {/* Repo cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPOS.map((repo) => (
            <a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full border border-site-border bg-site-card transition-all duration-200 group-hover:-translate-y-0.5">
                <CardContent className="p-6">
                  {/* Icon + org badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <GitHubLogoIcon className="h-4 w-4 text-site-text-tertiary" />
                    {repo.org && (
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-site-accent-subtle font-mono text-[10px] text-site-accent"
                        style={{ border: "none" }}
                      >
                        {repo.org}
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-2 font-display font-semibold text-base text-site-text">
                    {repo.name}
                  </h3>
                  <p className="mb-4 text-site-text-secondary text-sm leading-relaxed">
                    {repo.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-site-text-tertiary text-xs">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: "#3572A5" }}
                      />
                      {repo.lang}
                    </span>
                    {repo.stars != null && <span>★ {repo.stars}</span>}
                    {repo.forks != null && <span>⑂ {repo.forks}</span>}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/oss"
            className="inline-flex items-center gap-1.5 font-medium text-site-accent text-sm transition-opacity hover:opacity-80"
          >
            View full OSS journey →
          </Link>
        </div>
      </Container>
    </section>
  );
}
