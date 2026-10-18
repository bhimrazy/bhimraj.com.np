import type { Metadata } from "next";
import BeyondSection from "@/components/homepage/beyond-section";
import ContactSection from "@/components/homepage/contact-section";
import ExperienceSection from "@/components/homepage/experience-section";
import HeroSection from "@/components/homepage/hero-section";
import SelectedWork from "@/components/homepage/selected-work";
import WritingSection from "@/components/homepage/writing-section";
import { SectionSeparator } from "@/components/section-separator";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Who he is (hero), the lines of work side by side (01), the evidence across
 * all of them (02), how he thinks (03), the person behind it (04), and how to
 * reach him (05).
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <SectionSeparator />
      <ExperienceSection />
      <SectionSeparator />
      <SelectedWork />
      <SectionSeparator />
      <WritingSection />
      <BeyondSection />
      <ContactSection />
    </main>
  );
}
