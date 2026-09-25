import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import BlogPreview from "./blog-preview";
import ResearchPreview from "./research-preview";

export default function WritingSection() {
  return (
    <section id="writing" className="scroll-mt-20 py-24 sm:py-28">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Writing & research"
          title="Notes, tutorials, and a paper"
          description="Technical deep-dives on architecture and ML, plus peer-reviewed work on computer vision."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5">
          <BlogPreview />
          <ResearchPreview />
        </div>
      </Container>
    </section>
  );
}
