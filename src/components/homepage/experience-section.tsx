import { Container } from "@/components/container";

const EXPERIENCES = [
  {
    role: "Software Engineer",
    company: "Fetchly Labs",
    type: "Full-time",
    location: "Remote",
    period: "Present",
    current: true,
    description:
      "Building production software and scalable systems at a custom software consultancy serving clients across the US.",
    tech: ["Python", "React", "Next.js", "AWS"],
  },
  {
    role: "Tier 2 OSS Contributor",
    company: "Lightning AI",
    type: "Part-time",
    location: "Open Source",
    period: "Ongoing",
    current: true,
    description:
      "200+ contributions across PyTorch Lightning, LitServe, LitData, and LitGPT. Enhanced OpenAI compatibility, added encryption support, and MosaicML integration.",
    tech: ["PyTorch", "LitServe", "LitData", "LitGPT"],
  },
  {
    role: "Consultant",
    company: "StableCluster",
    type: "Part-time",
    location: "Remote / Onsite",
    period: "Present",
    current: true,
    description:
      "Consulting on cloud infrastructure, deployment workflows, and production-ready systems for AI and software teams.",
    tech: ["Cloud", "DevOps", "AI Infrastructure"],
  },
] as const;

export default function ExperienceSection() {
  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <div className="mb-12">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Experience
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight">
            Where I&apos;ve worked
          </h2>
          <p className="mt-3 max-w-lg text-base text-site-text-secondary">
            Building software professionally and contributing to the open source
            ecosystem.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-5 before:absolute before:top-2 before:bottom-2 before:left-1.75 before:w-px before:bg-site-border sm:before:left-2.25">
          {EXPERIENCES.map((exp) => (
            <div
              key={`${exp.company}-${exp.role}`}
              className="group relative pl-8 sm:pl-10"
            >
              {/* Timeline node */}
              <span className="absolute top-1.5 left-0 flex size-4 items-center justify-center sm:size-4.5">
                {exp.current ? (
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-site-accent opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-site-accent ring-4 ring-site-bg" />
                  </span>
                ) : (
                  <span className="size-2.5 rounded-full bg-site-border-hover ring-4 ring-site-bg" />
                )}
              </span>

              {/* Card */}
              <div className="relative overflow-hidden rounded-xl border border-site-border bg-site-card px-6 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)] dark:border-white/[0.07] dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/12 dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                {/* Hover glow */}
                <span className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <h3 className="font-display font-semibold text-lg text-site-text">
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span className="rounded-full bg-site-accent-subtle px-2.5 py-0.5 font-mono font-semibold text-[10px] text-site-accent uppercase tracking-[0.5px]">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Company · type · location */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                        <span className="font-medium text-site-accent">
                          {exp.company}
                        </span>
                        <span className="text-site-text-tertiary">·</span>
                        <span className="text-site-text-secondary">
                          {exp.type}
                        </span>
                        <span className="text-site-text-tertiary">·</span>
                        <span className="text-site-text-tertiary">
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Period */}
                    <span className="shrink-0 font-mono text-site-text-tertiary text-xs">
                      {exp.period}
                    </span>
                  </div>

                  <p className="max-w-2xl text-site-text-secondary text-sm leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-site-border bg-site-bg-tertiary px-2.5 py-1 font-mono text-[11px] text-site-text-secondary transition-colors hover:border-site-accent/40 hover:bg-site-accent-subtle hover:text-site-accent dark:border-white/6 dark:bg-white/3"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
