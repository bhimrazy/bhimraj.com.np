import { getGitHubStars, getLightningAIEcosystemStats } from "@bhimrazy/github";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import AuroraBg from "./aurora-bg";
import { CompanyLogo, LOGOS } from "./company-logo";

type Proof = {
  mark: ReactNode;
  value: string;
  label: string;
  href: string;
  external?: boolean;
};

function ProofItem({ mark, value, label, href, external }: Proof) {
  const content = (
    <>
      <span className="flex h-6 items-center text-site-text-secondary">
        {mark}
      </span>
      <span className="mt-4 whitespace-nowrap font-bold font-display text-[22px] text-site-text tracking-tight sm:text-[28px]">
        {value}
      </span>
      <span className="mt-1 text-pretty text-site-text-tertiary text-xs leading-snug sm:text-[13px]">
        {label}
      </span>
    </>
  );
  const className =
    "group flex h-full flex-col bg-site-card/85 p-5 transition-colors hover:bg-site-bg-secondary focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:p-6 dark:bg-site-bg/80 dark:hover:bg-site-card";

  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}

export default async function HeroSection() {
  "use cache";
  cacheLife("hours");

  const githubStars = getGitHubStars();
  const { totalPrs: lightningPrs } = getLightningAIEcosystemStats();

  // Each number appears once on the page, with the exact thing it counts.
  const PROOF: Proof[] = [
    {
      mark: (
        <CompanyLogo
          logo={LOGOS.lightning}
          company="Lightning AI"
          className="h-7"
        />
      ),
      value: String(lightningPrs),
      label: "merged PRs across Lightning AI repos",
      href: "#open-source",
    },
    {
      mark: (
        <span className="inline-flex items-center gap-2 font-mono text-[13px]">
          <GitHubLogoIcon className="size-4.5" aria-hidden />@
          {siteConfig.author.username}
        </span>
      ),
      value: githubStars.toLocaleString("en-US"),
      label: "GitHub stars on my own repositories",
      href: siteConfig.links.github,
      external: true,
    },
    {
      mark: (
        <CompanyLogo
          logo={LOGOS.fetchly}
          company="Fetchly Labs"
          className="h-5"
        />
      ),
      value: "Since 2022",
      label: "Software Engineer at Fetchly Labs",
      href: "#experience",
    },
    {
      mark: (
        <span className="font-bold font-display text-[15px] text-site-text tracking-tight">
          IEEE <span className="font-medium">Access</span>
        </span>
      ),
      value: "2024",
      label: "peer-reviewed deep-learning journal paper",
      href: "#writing",
    },
  ];

  return (
    <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-20 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuroraBg />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_280px] lg:gap-12">
          <div>
            {/* Mobile identity: a small avatar instead of the full portrait */}
            <div className="mb-5 flex items-center gap-3 lg:hidden">
              <Image
                src="/bhimraj-yadav.jpg"
                alt=""
                width={52}
                height={52}
                sizes="52px"
                className="size-13 rounded-full border border-site-border object-cover"
                priority
              />
              <div className="leading-tight">
                <p className="font-display font-semibold text-site-text">
                  Bhimraj Yadav
                </p>
                <p className="mt-0.5 font-mono text-site-text-tertiary text-xs">
                  Kathmandu, Nepal
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="group mb-5 inline-flex items-center gap-2 rounded-full border border-site-border bg-site-card/70 py-1 pr-3 pl-2.5 font-mono text-[12px] text-site-text-secondary backdrop-blur-sm transition-colors hover:border-site-accent/40 hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:mb-6"
            >
              <span className="size-1.5 rounded-full bg-green-500 motion-safe:animate-pulse-dot" />
              Available for collaboration
              <span
                aria-hidden
                className="text-site-accent transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>

            <h1 className="mb-6 text-balance font-bold font-display text-[34px] text-site-text leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-[52px]">
              I ship production software{" "}
              <span className="text-site-text-secondary xl:block">
                and land code in PyTorch&nbsp;Lightning.
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-pretty text-base text-site-text-secondary leading-relaxed sm:mb-9 sm:text-[17px]">
              I&apos;m <strong className="text-site-text">Bhimraj Yadav</strong>
              , a software engineer at Fetchly Labs and a Tier&nbsp;2
              open-source contributor at Lightning AI. I also consult at
              StableCluster and publish computer-vision research.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-10 rounded-lg border-0 bg-site-accent px-4 font-semibold text-white hover:bg-site-accent/85 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg sm:px-6"
              >
                <Link href="/oss">See my OSS work →</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-lg px-4 font-semibold text-site-text focus-visible:ring-2 focus-visible:ring-site-accent sm:px-6"
              >
                <a href="#contact">Get in touch</a>
              </Button>
            </div>
          </div>

          {/* Desktop portrait */}
          <div className="relative hidden lg:block">
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-3xl opacity-20 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--site-accent), transparent 40%, var(--site-accent-hover), transparent 80%, var(--site-accent))",
              }}
            />

            <div
              className="relative h-82.5 w-67 overflow-hidden rounded-2xl border border-site-border"
              style={{
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.3), 0 0 60px var(--site-accent-subtle)",
              }}
            >
              <Image
                src="/bhimraj-yadav.jpg"
                alt="Bhimraj Yadav"
                fill
                className="object-cover"
                priority
                sizes="268px"
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-10"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 40%, var(--site-accent))",
                  mixBlendMode: "color",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent to-site-bg opacity-50"
              />
            </div>

            <div className="absolute -right-4 -bottom-4 rounded-xl border border-site-border bg-site-card/90 px-4 py-3 backdrop-blur-md">
              <p className="mb-0.5 font-mono text-[11px] text-site-text-tertiary">
                Based in
              </p>
              <p className="font-mono text-[12px] text-site-text-secondary">
                <span className="font-semibold text-site-accent">
                  Kathmandu
                </span>
                , Nepal
              </p>
            </div>
          </div>
        </div>

        {/* Proof strip — the page's only headline numbers */}
        <ul
          aria-label="Highlights"
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-site-border bg-site-border shadow-xl/3 sm:mt-20 lg:grid-cols-4 dark:border-white/6 dark:bg-white/6"
        >
          {PROOF.map((item) => (
            <ProofItem key={item.label} {...item} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
