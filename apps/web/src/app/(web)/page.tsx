import type { Metadata } from "next";
import BlogPreview from "@/components/homepage/blog-preview";
import ExperienceSection from "@/components/homepage/experience-section";
import FeaturedProject from "@/components/homepage/featured-project";
import HeroSection from "@/components/homepage/hero-section";
import NewsLetter from "@/components/homepage/news-letter";
import OSSPreview from "@/components/homepage/oss-preview";
import ResearchPreview from "@/components/homepage/research-preview";
import { JsonLd } from "@/components/json-ld";
import { SectionSeparator } from "@/components/section-separator";
import { buildPersonJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={[buildPersonJsonLd(), buildWebSiteJsonLd()]} />
      <HeroSection />
      <SectionSeparator />
      <ExperienceSection />
      <OSSPreview />
      <FeaturedProject />
      <SectionSeparator />
      <BlogPreview />
      <SectionSeparator />
      <ResearchPreview />
      <SectionSeparator />
      <NewsLetter />
    </main>
  );
}
