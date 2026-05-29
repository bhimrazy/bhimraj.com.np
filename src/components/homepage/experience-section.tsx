import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const EXPERIENCES = [
  {
    role: "Software Engineer",
    company: "Fetchly Labs",
    location: "Austin, TX (Remote)",
    period: "Present",
    current: true,
    description:
      "Building production software and scalable systems at a custom software consultancy serving clients across the US.",
    tech: ["Python", "React", "Next.js", "AWS"],
  },
  {
    role: "Tier 2 OSS Contributor",
    company: "Lightning AI",
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
    location: "Remote",
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

        {/* Experience cards */}
        <div className="flex flex-col gap-4">
          {EXPERIENCES.map((exp) => (
            <Card
              key={`${exp.company}-${exp.role}`}
              className="border border-site-border bg-site-card px-8 py-7 shadow-none transition-colors duration-200 hover:border-site-border-hover dark:border-white/7 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:shadow-[0_18px_50px_rgba(0,0,0,0.18)] dark:hover:border-site-border-hover"
            >
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    {/* Role + current badge */}
                    <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display font-semibold text-lg text-site-text">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="rounded-full bg-site-accent-subtle px-2.5 py-0.5 font-mono font-semibold text-[10px] text-site-accent uppercase tracking-[0.5px]">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Company + location */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-medium text-site-accent text-sm">
                        {exp.company}
                      </span>
                      <span className="text-site-text-tertiary text-xs">·</span>
                      <span className="text-site-text-tertiary text-sm">
                        {exp.location}
                      </span>
                    </div>

                    <p className="mb-4 max-w-2xl text-site-text-secondary text-sm leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="rounded-md bg-site-accent-subtle font-mono text-[11px] text-site-accent"
                          style={{ border: "none" }}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Period */}
                  <span className="shrink-0 font-mono text-site-text-tertiary text-xs">
                    {exp.period}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
