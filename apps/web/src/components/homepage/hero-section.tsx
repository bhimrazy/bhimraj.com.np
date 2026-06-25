import { getGitHubContributions, getGitHubStars } from "@bhimrazy/github";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import AuroraBg from "./aurora-bg";

export default async function HeroSection() {
  "use cache";
  cacheLife("hours");

  const yearsExp = new Date().getFullYear() - 2022;
  const githubStars = getGitHubStars();
  const contributions = getGitHubContributions();

  const STATS = [
    { value: `${contributions}+`, label: "OSS Contributions" },
    { value: `${githubStars}+`, label: "GitHub Stars" },
    { value: `${yearsExp}+`, label: "Years Building" },
    { value: "IEEE", label: "Published Researcher" },
  ];
  return (
    <section className="relative pt-44 pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuroraBg />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_300px]">
          {/* Left: content */}
          <div>
            <span className="mb-5 inline-flex items-center gap-2 font-mono text-[13px] text-site-accent">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-500" />
              Available for collaboration
            </span>

            <h1 className="mb-5 font-bold font-display text-4xl text-site-text leading-[1.1] tracking-tight sm:text-5xl lg:text-[52px]">
              Building the open-source
              <br />
              <span className="text-site-text-secondary">
                tools ML teams run in production.
              </span>
            </h1>

            <p className="mb-8 max-w-130 text-[17px] text-site-text-secondary leading-relaxed">
              I&apos;m <strong className="text-site-text">Bhimraj Yadav</strong>{" "}
              — a Tier 2 contributor at Lightning AI (PyTorch Lightning,
              LitServe, LitData), IEEE-published in deep learning, and a
              production engineer at Fetchly Labs. Building for the world from
              Kathmandu, Nepal 🇳🇵.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button
                asChild
                className="rounded-lg border-0 bg-site-accent px-6 font-semibold text-white hover:bg-site-accent/85"
              >
                <Link href="/oss">Explore my OSS work →</Link>
              </Button>
              <Link
                href="/blog"
                className="font-medium text-site-text-secondary text-sm transition-colors hover:text-site-text"
              >
                Read the blog
              </Link>
            </div>
          </div>

          {/* Right: photo */}
          <div className="relative flex justify-center lg:block">
            <div
              className="absolute inset-0 -m-5 rounded-3xl opacity-25 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--site-accent), transparent 40%, var(--site-accent-hover), transparent 80%, var(--site-accent))",
              }}
            />
            <div className="absolute top-[20%] left-[10%] h-[60%] w-[80%] animate-glow-pulse rounded-full bg-site-accent opacity-15 blur-3xl" />

            {/* Photo frame */}
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
                // height={266}
                // width={328}
              />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 40%, var(--site-accent))",
                  mixBlendMode: "color",
                }}
              />
              <div
                className="absolute inset-0 animate-light-sweep"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 45%, transparent 60%)",
                }}
              />
              <div
                className="absolute right-0 bottom-0 left-0 h-2/5 opacity-50"
                style={{
                  background: "linear-gradient(transparent, var(--site-bg))",
                }}
              />
            </div>

            {/* Location chip */}
            <div className="absolute -right-4 -bottom-4 rounded-xl border border-site-border bg-site-card px-4 py-3 backdrop-blur-md">
              <p className="mb-0.5 font-mono text-[11px] text-site-text-tertiary">
                Currently based in
              </p>
              <p className="font-mono text-[12px] text-site-text-secondary">
                <span className="font-semibold text-site-accent">
                  Kathmandu
                </span>
                , Nepal 🇳🇵
              </p>
            </div>

            {/* Floating accent dot */}
            <div
              className="absolute -top-2 left-5 h-4 w-4 animate-float-dot rounded-full bg-site-accent opacity-70"
              style={{ boxShadow: "0 0 20px var(--site-accent)" }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-site-border shadow-xl/2 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-site-card px-8 py-9 text-center"
            >
              <span className="font-bold font-display text-2xl text-site-text">
                {stat.value}
              </span>
              <span className="mt-1 text-site-text-tertiary text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
