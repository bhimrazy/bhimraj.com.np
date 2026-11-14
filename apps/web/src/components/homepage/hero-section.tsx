import Image from "next/image";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import AuroraBg from "./aurora-bg";
import { LATEST, PERSON } from "./data";

/*
 * Identity first: no org or project names in the headline or lede; the
 * cards in 01 carry the detail. No numbers up here: they live next to the
 * work they describe.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* Backdrop: a warm glow, and the slow aurora waves (they fade out at the bottom). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-[ellipse_at_80%_0%] from-site-accent-subtle via-transparent to-transparent" />
        <AuroraBg />
      </div>

      <Container className="relative px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div>
            {/* Mobile identity: small avatar instead of the portrait */}
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <Image
                src={PERSON.avatar}
                alt=""
                width={52}
                height={52}
                sizes="52px"
                className="size-13 rounded-full border border-site-border object-cover"
                priority
              />
              <div className="leading-tight">
                <p className="font-display font-semibold text-site-text">
                  {PERSON.name}
                </p>
                <p className="mt-0.5 font-mono text-site-text-tertiary text-xs">
                  {PERSON.role} · {PERSON.city}
                </p>
              </div>
            </div>

            <p className="mb-5 hidden font-mono text-[12px] text-site-text-secondary uppercase tracking-[1.5px] lg:block">
              {PERSON.name}
            </p>

            <h1 className="mb-6 text-balance font-bold font-display text-[34px] text-site-text leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-[50px] xl:text-[54px]">
              I build products,{" "}
              <span className="text-site-text-secondary xl:block">
                and the tools developers use to build them.
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-pretty text-base text-site-text-secondary leading-relaxed sm:mb-9 sm:text-[17px]">
              I&apos;m a software engineer based in Kathmandu, Nepal. Most days
              I&apos;m designing systems and shipping features with my team,
              contributing to open source, or experimenting with LLMs and
              agents, and I write about what I learn along the way.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-10 rounded-lg border-0 bg-site-accent px-4 font-semibold text-site-on-accent hover:bg-site-accent/85 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg sm:px-6"
              >
                <a href="#experience">
                  What I&apos;m working on
                  <span aria-hidden>↓</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-lg px-4 font-semibold text-site-text focus-visible:ring-2 focus-visible:ring-site-accent sm:px-6"
              >
                <a href="#contact" data-open-chat="Hiring / collab">
                  Get in touch
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-2 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.2px]">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-site-success motion-safe:animate-pulse-dot"
                />
                New
              </span>
              <ul className="flex flex-wrap gap-2">
                {LATEST.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-site-border bg-site-card/70 py-1.5 pr-3 pl-3.5 text-[13px] backdrop-blur-sm transition-colors hover:border-site-accent/40 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 dark:border-white/8"
                    >
                      <span className="font-medium text-site-text">
                        {item.text}
                      </span>
                      <span aria-hidden className="text-site-text-tertiary">
                        ·
                      </span>
                      <span className="text-site-text-secondary">
                        {item.note}
                      </span>
                      <span
                        aria-hidden
                        className="text-site-accent transition-transform group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop portrait */}
          <div className="relative hidden lg:block">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-3xl bg-site-accent-subtle blur-2xl"
            />
            <div className="relative h-82.5 w-67 overflow-hidden rounded-2xl border border-site-border shadow-2xl/30">
              <Image
                src={PERSON.avatar}
                alt={PERSON.name}
                fill
                className="object-cover"
                priority
                sizes="268px"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent to-site-bg opacity-50"
              />
            </div>
            <div className="absolute -right-4 -bottom-4 rounded-xl border border-site-border bg-site-card/90 px-4 py-3 backdrop-blur-md">
              <p className="mb-0.5 font-mono text-[11px] text-site-text-tertiary">
                From Lahan · based in
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
      </Container>
    </section>
  );
}
