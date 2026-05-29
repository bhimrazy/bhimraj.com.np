import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuroraBg from "./aurora-bg";

const STATS = [
  { value: "200+", label: "OSS Contributions" },
  { value: "195", label: "Stars on receipt-ocr" },
  { value: "5.6K", label: "YouTube Views" },
  { value: "1", label: "IEEE Publication" },
] as const;

export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-16">
      {/* Aurora animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuroraBg />
      </div>

      <div className="relative z-10 mx-auto max-w-280 px-6">
        {/* Main hero grid */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_300px]">
          {/* Left: content */}
          <div>
            {/* Status badge */}
            <span className="mb-5 inline-flex items-center gap-2 font-mono text-[13px] text-site-accent">
              <span
                className="h-2 w-2 rounded-full bg-green-500"
                style={{ animation: "pulse-dot 2s ease infinite" }}
              />
              Available for collaboration
            </span>

            <h1 className="mb-5 font-bold font-display text-4xl text-site-text leading-[1.1] tracking-tight sm:text-5xl lg:text-[52px]">
              Software Engineer
              <br />
              <span className="text-site-text-secondary">
                &amp; OSS Contributor
              </span>
            </h1>

            <p className="mb-8 max-w-[520px] text-[17px] text-site-text-secondary leading-relaxed">
              I&apos;m <strong className="text-site-text">Bhimraj Yadav</strong>{" "}
              — Software Engineer at Fetchly Labs, Consultant at StableCluster,
              Tier 2 OSS contributor at Lightning AI, and AI Researcher. I build
              production systems and explore computer vision &amp; generative
              AI. Based in Kathmandu, Nepal.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-lg bg-site-accent px-6 font-semibold text-white"
                style={{ border: "none" }}
              >
                <Link href="/oss">Explore My OSS Journey</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-site-border bg-transparent px-6 text-site-text"
              >
                <Link href="/blog">Read the Blog</Link>
              </Button>
            </div>
          </div>

          {/* Right: photo */}
          <div className="relative flex justify-center lg:block">
            {/* Glow behind photo */}
            <div
              className="absolute inset-0 -m-5 rounded-3xl opacity-25 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--site-accent), transparent 40%, var(--site-accent-hover), transparent 80%, var(--site-accent))",
              }}
            />
            <div
              className="absolute top-[20%] left-[10%] h-[60%] w-[80%] rounded-full bg-site-accent opacity-15 blur-3xl"
              style={{
                animation: "glow-pulse 4s ease-in-out infinite",
              }}
            />

            {/* Photo frame */}
            <div
              className="relative h-[330px] w-[268px] overflow-hidden rounded-2xl border border-site-border shadow-2xl"
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
              {/* Accent overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 40%, var(--site-accent))",
                  opacity: 0.1,
                  mixBlendMode: "color",
                }}
              />
              {/* Light sweep */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 45%, transparent 60%)",
                  animation: "light-sweep 5s ease-in-out infinite",
                }}
              />
              {/* Bottom fade */}
              <div
                className="absolute right-0 bottom-0 left-0 h-2/5"
                style={{
                  background: "linear-gradient(transparent, var(--site-bg))",
                  opacity: 0.5,
                }}
              />
            </div>

            {/* Stats chip */}
            <div
              className="absolute -right-4 -bottom-4 rounded-xl border border-site-border bg-site-card px-4 py-3 backdrop-blur-md"
              style={{
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <p className="font-mono text-[12px] text-site-text-secondary">
                <span className="font-semibold text-site-accent">200+</span>{" "}
                contributions at Lightning AI
              </p>
            </div>

            {/* Floating accent dot */}
            <div
              className="absolute -top-2 left-5 h-4 w-4 rounded-full bg-site-accent opacity-70"
              style={{
                boxShadow: "0 0 20px var(--site-accent)",
                animation: "float-dot 6s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 overflow-hidden rounded-xl bg-site-border sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-site-card px-6 py-7 text-center"
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
      </div>
    </section>
  );
}
