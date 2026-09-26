import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { KathmanduTime } from "./local-time";

const ROLES = [
  { role: "Software Engineer", org: "Fetchly Labs" },
  { role: "Tier 2 OSS Contributor", org: "Lightning AI" },
  { role: "Core team", org: "LitData" },
  { role: "Consultant", org: "StableCluster" },
  { role: "Published", org: "IEEE Access" },
] as const;

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-44"
    >
      {/* Dot grid, faded toward the edges */}
      <div
        aria-hidden
        className="about-dot-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-site-accent opacity-10 blur-[140px]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
          {/* Copy */}
          <div className="motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:animate-in motion-safe:duration-700">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
                About
              </span>
              <span aria-hidden className="h-px w-6 bg-site-border-hover" />
              <span className="inline-flex items-center gap-2 font-mono text-[12px] text-site-text-secondary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-site-accent opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-site-accent" />
                </span>
                Available for collaboration
              </span>
            </div>

            <h1
              id="about-title"
              className="font-bold font-display text-5xl text-site-text leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Hi, I&apos;m Bhimraj<span className="text-site-accent">.</span>
            </h1>

            <p className="mt-6 max-w-2xl font-display text-site-text text-xl leading-snug sm:text-2xl">
              I build production software — and help maintain the open-source
              tools people use to{" "}
              <span className="text-site-accent">train</span>,{" "}
              <span className="text-site-accent">feed</span> and{" "}
              <span className="text-site-accent">serve</span> AI models.
            </p>

            <div className="mt-6 max-w-2xl space-y-4 text-[17px] text-site-text-secondary leading-relaxed">
              <p>
                I&apos;m a software engineer based in Kathmandu, Nepal. Since
                2022 I&apos;ve been building production software at{" "}
                <strong className="font-semibold text-site-text">
                  Fetchly Labs
                </strong>
                , a custom software consultancy serving clients across the US.
              </p>
              <p>
                Since 2024 I&apos;ve also been deep in the{" "}
                <strong className="font-semibold text-site-text">
                  Lightning AI
                </strong>{" "}
                open-source ecosystem — I&apos;m on the LitData core team, a
                Tier 2 OSS contributor, and I&apos;ve cut releases of both
                LitData and PyTorch Lightning. Alongside that I consult with
                StableCluster on AI infrastructure, and co-authored a computer
                vision paper in IEEE Access.
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Roles">
              {ROLES.map(({ role, org }) => (
                <li
                  key={org}
                  className="inline-flex items-center gap-1.5 rounded-full border border-site-border bg-site-card px-3 py-1 font-mono text-[11px] text-site-text-secondary dark:border-white/6 dark:bg-white/3"
                >
                  <span>{role}</span>
                  <span aria-hidden className="text-site-text-tertiary">
                    ·
                  </span>
                  <span className="text-site-accent">{org}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button
                asChild
                className="rounded-lg border-0 bg-site-accent px-6 font-semibold text-white hover:bg-site-accent/85"
              >
                <a href="#contact">Get in touch</a>
              </Button>
              <Link
                href="/oss"
                className="rounded-sm font-medium text-site-text-secondary text-sm transition-colors hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
              >
                Read my OSS journey →
              </Link>
            </div>
          </div>

          {/* Portrait */}
          <figure className="group motion-safe:fade-in relative mx-auto mt-2 w-full max-w-64 motion-safe:animate-in motion-safe:duration-1000 sm:max-w-80 lg:mx-0 lg:mt-0 lg:max-w-85">
            {/* Offset frame behind the card */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-2xl border border-site-accent/40 transition-transform duration-500 motion-safe:group-hover:rotate-1"
            />

            <div className="relative -rotate-2 overflow-hidden rounded-2xl border border-site-border bg-site-card shadow-2xl/20 transition-transform duration-500 motion-safe:group-hover:rotate-0 dark:border-white/8">
              <div className="relative aspect-[4/4.4] w-full">
                <Image
                  src="/bhimraj-yadav.jpg"
                  alt="Portrait of Bhimraj Yadav"
                  fill
                  priority
                  sizes="(min-width: 1024px) 340px, 85vw"
                  className="object-cover"
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
              </div>

              <figcaption className="flex items-end justify-between gap-4 border-site-border border-t px-4 py-3 font-mono text-[11px] dark:border-white/6">
                <div className="whitespace-nowrap">
                  <p className="font-semibold text-site-text uppercase tracking-[1px]">
                    Kathmandu, Nepal
                  </p>
                  <p className="mt-0.5 text-site-text-tertiary">
                    27.7172° N · 85.3240° E
                  </p>
                </div>
                <p className="whitespace-nowrap text-right text-site-text-tertiary">
                  <span className="block text-site-accent">
                    <KathmanduTime />
                  </span>
                  UTC+5:45
                </p>
              </figcaption>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
