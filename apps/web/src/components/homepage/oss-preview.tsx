import {
  getContributedRepos,
  getLightningAIEcosystemStats,
  getOSSStats,
} from "@bhimrazy/github";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/config/site";

const UTM = siteConfig.utmParams;

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default async function OSSPreview() {
  const { repos } = getLightningAIEcosystemStats();
  const { totalPrs, totalCommits } = getOSSStats();
  const contributedRepos = getContributedRepos();

  const topRepos = repos.slice(0, 3);
  const ecosystemStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

  const stats = [
    { value: `${totalCommits}+`, label: "Contributions" },
    { value: `${totalPrs}+`, label: "PRs Merged" },
    { value: formatStars(ecosystemStars), label: "Ecosystem Stars" },
    { value: `${contributedRepos.length}+`, label: "Repos Contributed" },
  ];

  return (
    <section className="relative overflow-hidden border-site-border/40 border-y bg-site-bg-secondary/30 py-32 dark:bg-white/1.5">
      {/* Full-bleed accent line — marks this as the page's centerpiece */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-site-accent/40 to-transparent" />

      <Container className="relative">
        {/* Section header — centered to break the section rhythm */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Open Source
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight sm:text-4xl">
            Contributing to the ecosystem
          </h2>
          <p className="mt-3 text-base text-site-text-secondary">
            Merged work across PyTorch Lightning, LitServe, LitData, and the
            wider open-source ecosystem.
          </p>
        </div>

        {/* Stats band — the OSS data is the strongest asset, rendered large */}
        <div className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-site-border/50 bg-site-border/30 sm:grid-cols-4 dark:border-white/5 dark:bg-white/5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-site-card px-6 py-7 text-center dark:bg-site-bg"
            >
              <div className="font-bold font-display text-3xl text-site-text sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Repo cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRepos.map((repo) => (
            <a
              key={repo.name}
              href={`https://github.com/${repo.fullName}/pulls?q=is%3Apr+author%3Abhimrazy+is%3Amerged&${UTM}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group block"
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-site-border bg-site-card px-6 py-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-site-border-hover group-hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:group-hover:border-white/10 dark:group-hover:shadow-site-accent-subtle">
                {/* Hover glow */}
                <span className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col">
                  {/* Icon + org badge */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <GitHubLogoIcon className="h-4 w-4 text-site-text-tertiary" />
                      <span className="rounded-full bg-site-accent-subtle px-2.5 py-0.5 font-mono font-semibold text-[10px] text-site-accent uppercase tracking-[0.5px]">
                        Lightning AI
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[11px] text-site-accent">
                      {repo.prs} PRs
                    </span>
                  </div>

                  <h3 className="mb-2 font-display font-semibold text-base text-site-text">
                    {repo.name}
                  </h3>
                  <p className="mb-4 flex-1 text-site-text-secondary text-sm leading-relaxed">
                    {repo.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-site-text-tertiary text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#3572A5]" />
                      Python
                    </span>
                    <span>★ {formatStars(repo.stars)}</span>
                    <span>⑂ {formatStars(repo.forks)}</span>
                  </div>
                </div>
              </div>
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
