import { Container } from "@/components/container";
import { ArrowLink, SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { CompanyLogo, LOGOS, type Logo } from "./company-logo";
import { chip, surface } from "./surface";

type Experience = {
  role: string;
  company: string;
  type: string;
  location: string;
  period: string;
  description: string;
  tech: readonly string[];
  logo: Logo;
  /** Points at the homepage section that carries this role's numbers. */
  more?: { href: string; label: string };
};

const EXPERIENCES: readonly Experience[] = [
  {
    role: "Software Engineer",
    company: "Fetchly Labs",
    type: "Full-time",
    location: "Remote",
    period: "2022 — Present",
    description:
      "Building production software and scalable systems at a custom software consultancy serving clients across the US.",
    tech: ["Python", "React", "Next.js", "AWS"],
    logo: LOGOS.fetchly,
  },
  {
    role: "Tier 2 OSS Contributor",
    company: "Lightning AI",
    type: "Part-time",
    location: "Open Source",
    period: "2024 — Present",
    description:
      "Active contributor across the Lightning AI ecosystem — spanning data pipelines, model serving, training frameworks, and LLM tooling.",
    tech: ["PyTorch Lightning", "LitData", "LitServe", "LitGPT"],
    logo: LOGOS.lightning,
    more: { href: "#open-source", label: "See the merged work" },
  },
  {
    role: "Consultant",
    company: "StableCluster",
    type: "Part-time",
    location: "Remote / Onsite",
    period: "2024 — Present",
    description:
      "Consulting on cloud infrastructure, deployment workflows, and production-ready systems for AI and software teams.",
    tech: ["Cloud", "DevOps", "AI Infrastructure"],
    logo: LOGOS.stablecluster,
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 sm:py-28">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="Three roles, running in parallel"
          description="Product engineering, open-source contribution, and infrastructure consulting for AI and software teams."
        />

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EXPERIENCES.map((exp) => (
            <li
              key={exp.company}
              className={cn(surface, "flex flex-col p-6 sm:p-7")}
            >
              <div className="flex h-7 items-center justify-between gap-4">
                <CompanyLogo
                  logo={exp.logo}
                  company={exp.company}
                  className="h-6"
                />
                <span className="shrink-0 font-mono text-[11px] text-site-text-tertiary">
                  {exp.period}
                </span>
              </div>

              <h3 className="mt-6 font-display font-semibold text-lg text-site-text leading-snug">
                {exp.role}
              </h3>
              <p className="mt-0.5 text-site-text-tertiary text-sm">
                {exp.company} · {exp.type} · {exp.location}
              </p>

              <p className="mt-4 flex-1 text-pretty text-site-text-secondary text-sm leading-relaxed">
                {exp.description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                  <li key={t} className={chip}>
                    {t}
                  </li>
                ))}
              </ul>

              {exp.more && (
                <ArrowLink href={exp.more.href} className="mt-5 self-start">
                  {exp.more.label}
                </ArrowLink>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
