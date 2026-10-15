import type { Metadata } from "next";
import ContactSection from "@/components/homepage/contact-section";
import ExperienceSection from "@/components/homepage/experience-section";
import HeroSection from "@/components/homepage/hero-section";
import OSSPreview from "@/components/homepage/oss-preview";
import WritingSection from "@/components/homepage/writing-section";
import { JsonLd } from "@/components/json-ld";
import { SectionSeparator } from "@/components/section-separator";
import { buildPersonJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Narrative order: who he is and why he's credible (hero + proof strip), the
 * strongest evidence (open source), where he works, how he thinks (writing &
 * research), then how to reach him.
 */
export default function Home() {
  return (
    <main>
      <JsonLd data={[buildPersonJsonLd(), buildWebSiteJsonLd()]} />
      <HeroSection />
      <OSSPreview />
      <ExperienceSection />
      <SectionSeparator />
      <WritingSection />
      <ContactSection />
    </main>
  );
}
