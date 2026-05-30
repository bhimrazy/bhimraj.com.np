import type { Metadata } from "next";
import { Container } from "@/components/container";
import ProjectSection from "@/components/projects/project-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description:
    "Open-source AI projects spanning multimodal LLMs, model serving, computer vision, and developer tools.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        {/* Hero */}
        <div className="mb-16">
          <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Projects
          </span>
          <h1 className="mb-4 font-bold font-display text-4xl text-site-text leading-tight sm:text-5xl">
            What I&apos;m building
          </h1>
          <p className="max-w-2xl text-lg text-site-text-secondary leading-relaxed">
            Open-source projects spanning multimodal LLMs, model serving,
            computer vision, and AI tooling — mostly built with LitServe and
            PyTorch.
          </p>
        </div>

        <ProjectSection />
      </Container>
    </main>
  );
}
