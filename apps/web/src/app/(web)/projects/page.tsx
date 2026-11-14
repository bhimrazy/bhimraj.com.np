import type { Metadata } from "next";
import { Container } from "@/components/container";
import ContactSection from "@/components/homepage/contact-section";
import ProjectSection from "@/components/projects/project-section";
import { PageHeader } from "@/components/section-heading";
import { siteConfig } from "@/config/site";

const description =
  "Receipt OCR, vps-ready, and open-source model APIs and demos: multimodal LLMs, model serving and computer vision.";

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description,
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <main>
      <Container className="px-4 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-14">
        <PageHeader
          eyebrow="Projects"
          title="Things I've built"
          description="My own tools, plus open-source model APIs and demos built with LitServe and PyTorch."
        />
      </Container>
      <section className="pb-20 sm:pb-24">
        <Container className="px-4 sm:px-8">
          <ProjectSection />
        </Container>
      </section>
      <ContactSection index="01" />
    </main>
  );
}
