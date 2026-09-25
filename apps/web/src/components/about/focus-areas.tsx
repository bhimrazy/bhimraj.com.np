import { getContributedRepos, getFeaturedRepoStats } from "@bhimrazy/github";
import {
  CubeIcon,
  EyeOpenIcon,
  RocketIcon,
  StackIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import type { ComponentType } from "react";
import { Container } from "@/components/container";
import { SectionHeading } from "./section-heading";

type Area = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  body: string;
  /** Live proof points, e.g. "55 PRs · LitServe". */
  proof: string[];
  link: { label: string; href: string };
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function FocusAreas() {
  const repos = getContributedRepos();
  const prs = (fullName: string, label: string): string[] => {
    const repo = repos.find(
      (r) => r.fullName.toLowerCase() === fullName.toLowerCase(),
    );
    return repo && repo.prs > 0 ? [`${repo.prs} PRs · ${label}`] : [];
  };
  const receiptOcr = getFeaturedRepoStats();

  const areas: Area[] = [
    {
      icon: RocketIcon,
      title: "Model serving",
      kicker: "LitServe",
      body: "Contributing to LitServe, and building serving APIs on top of it — vision-language models, text-to-speech and real-time object detection.",
      proof: prs("Lightning-AI/LitServe", "LitServe"),
      link: { label: "LitServe examples", href: "/projects/litserve-examples" },
    },
    {
      icon: StackIcon,
      title: "Data pipelines",
      kicker: "LitData",
      body: "On the LitData core team — from streaming datasets to cutting releases. My most active corner of the ecosystem.",
      proof: prs("Lightning-AI/litdata", "LitData"),
      link: {
        label: "Merged PRs",
        href: "https://github.com/Lightning-AI/litdata/pulls?q=is%3Apr+author%3Abhimrazy+is%3Amerged",
      },
    },
    {
      icon: CubeIcon,
      title: "Training frameworks",
      kicker: "PyTorch Lightning · LitGPT",
      body: "Contributions across PyTorch Lightning and LitGPT, including owning the Lightning v2.6.1 release end to end.",
      proof: [
        ...prs("Lightning-AI/pytorch-lightning", "PyTorch Lightning"),
        ...prs("Lightning-AI/litgpt", "LitGPT"),
      ],
      link: {
        label: "v2.6.1 release notes",
        href: "https://github.com/Lightning-AI/pytorch-lightning/releases/tag/2.6.1",
      },
    },
    {
      icon: EyeOpenIcon,
      title: "Computer vision",
      kicker: "Research & applied",
      body: "Semantic segmentation research published in IEEE Access, 3D medical imaging with MONAI, and an open-source receipt OCR engine.",
      proof: receiptOcr
        ? [`★ ${formatCount(receiptOcr.stars)} · ${receiptOcr.name}`]
        : [],
      link: { label: "Research", href: "/research" },
    },
  ];

  return (
    <section aria-labelledby="work" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="work"
          index="03"
          eyebrow="What I work on"
          title="The problems I keep coming back to"
        >
          Most of my open-source time goes into the plumbing of machine
          learning: getting data in, training at scale, and serving models in
          production.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {areas.map((area) => {
            const Icon = area.icon;
            const external = area.link.href.startsWith("http");
            const LinkTag = external ? "a" : Link;
            return (
              <article
                key={area.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-site-border bg-site-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 motion-reduce:hover:translate-y-0 sm:p-7 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10 dark:hover:shadow-site-accent-subtle"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-site-accent/25 bg-site-accent-subtle text-site-accent">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1px]">
                    {area.kicker}
                  </span>
                </div>

                <h3 className="relative mt-5 font-display font-semibold text-site-text text-xl">
                  {area.title}
                </h3>
                <p className="relative mt-2 flex-1 text-site-text-secondary text-sm leading-relaxed">
                  {area.body}
                </p>

                <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {area.proof.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono font-semibold text-[11px] text-site-accent"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <LinkTag
                    href={area.link.href}
                    {...(external && {
                      target: "_blank",
                      rel: "nofollow noopener noreferrer",
                    })}
                    className="inline-flex items-center gap-1 rounded-sm font-mono text-[12px] text-site-text-secondary transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
                  >
                    {area.link.label}
                    <span aria-hidden>{external ? "↗" : "→"}</span>
                  </LinkTag>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
