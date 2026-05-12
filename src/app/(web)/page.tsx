import type { Metadata } from "next";
import BlogPreview from "@/components/homepage/blog-preview";
import ExperienceSection from "@/components/homepage/experience-section";
import HeroSection from "@/components/homepage/hero-section";
import NewsLetter from "@/components/homepage/news-letter";
import OSSPreview from "@/components/homepage/oss-preview";
import ResearchPreview from "@/components/homepage/research-preview";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExperienceSection />
      <OSSPreview />
      <BlogPreview />
      <ResearchPreview />
      <NewsLetter />
    </main>
  );
}
