import type { Metadata } from "next";
import BeyondSection from "@/components/homepage/beyond-section";
import ContactSection from "@/components/homepage/contact-section";
import ExperienceSection from "@/components/homepage/experience-section";
import HeroSection from "@/components/homepage/hero-section";
import SelectedWork from "@/components/homepage/selected-work";
import WritingSection from "@/components/homepage/writing-section";
import { SectionSeparator } from "@/components/section-separator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.author.avatar}`,
      jobTitle: siteConfig.author.designation,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      sameAs: Object.values(siteConfig.links),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.author.name,
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};

/*
 * Who he is (hero), the lines of work side by side (01), the evidence across
 * all of them (02), how he thinks (03), the person behind it (04), and how to
 * reach him (05).
 */
export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
