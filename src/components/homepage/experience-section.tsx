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
    role: "AI/ML Researcher",
    company: "IEEE Published",
    location: "Academic",
    period: "2024",
    current: false,
    description:
      "Published comparative study on deep learning models for semantic segmentation of pores in SEM images in IEEE Access.",
    tech: ["Deep Learning", "Computer Vision", "Segmentation"],
  },
  {
    role: "Vice President",
    company: "KathFOSS Community",
    location: "Kathmandu",
    period: "2022",
    current: false,
    description:
      "Led the Kathford Free & Open Source Software community, organizing events and mentoring students in open source.",
    tech: ["Community", "Open Source", "Leadership"],
  },
] as const;

export default function ExperienceSection() {
  return (
    <section className="border-site-border border-t py-20">
      <div className="mx-auto max-w-[1120px] px-6">
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
              className="border border-site-border bg-site-card px-8 py-7"
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
      </div>
    </section>
  );
}
