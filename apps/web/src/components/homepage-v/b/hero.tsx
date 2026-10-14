import Image from "next/image";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { PERSON, PERSONAL } from "../facts";
import { Ph } from "../ph";

/*
 * Identity first: no org or project names in the headline or lede; the
 * cards in 01 carry the detail. No numbers up here: they live next to the
 * work they describe.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* Static backdrop: a warm glow plus a dot grid that fades out. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-[ellipse_at_80%_0%] from-site-accent-subtle via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--site-border-hover)_1px,transparent_1px)] bg-size-[22px_22px] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_75%_10%,black,transparent)]" />
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

            <p className="mb-5 hidden items-center gap-3 font-mono text-[12px] text-site-text-tertiary uppercase tracking-[1.5px] lg:flex">
              <span className="text-site-text-secondary">{PERSON.name}</span>
              <span aria-hidden className="h-px w-6 bg-site-border-hover" />
              {PERSON.handle}
            </p>

            <h1 className="mb-6 text-balance font-bold font-display text-[34px] text-site-text leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-[50px] xl:text-[54px]">
              I build products,{" "}
              <span className="text-site-text-secondary xl:block">
                and the tools developers use to build them.
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-pretty text-base text-site-text-secondary leading-relaxed sm:mb-9 sm:text-[17px]">
              I&apos;m a software engineer based in Kathmandu, Nepal. Most days
              I&apos;m shipping products, contributing to open source, or
              experimenting with LLMs and agents, and I write about what I learn
              along the way.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-10 rounded-lg border-0 bg-site-accent px-4 font-semibold text-site-on-accent hover:bg-site-accent/85 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg sm:px-6"
              >
                <a href="#what-i-do">
                  What I&apos;m working on
                  <span aria-hidden>↓</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-lg px-4 font-semibold text-site-text focus-visible:ring-2 focus-visible:ring-site-accent sm:px-6"
              >
                <a href="#contact">Get in touch</a>
              </Button>
            </div>

            {/* The one quiet line: what's on the bench right now. */}
            <p className="mt-10 flex max-w-xl items-start gap-2.5 text-pretty font-mono text-[12px] text-site-text-tertiary leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-site-success motion-safe:animate-pulse-dot" />
              <span>
                <span className="text-site-text-secondary">Now:</span>{" "}
                <Ph value={PERSONAL.currently.building} />
              </span>
            </p>
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
