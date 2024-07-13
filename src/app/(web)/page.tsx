import HeroSection from "@/components/homepage/hero-section";
import NewsLetter from "@/components/homepage/news-letter";
import PostSection from "@/components/homepage/post-section";
import ProjectSection from "@/components/homepage/project-section";
import VideoSection from "@/components/homepage/video-section";
import type { Metadata } from "next";
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <HeroSection />
      {/* <PostSection /> */}
      <ProjectSection />
      <VideoSection />
      <NewsLetter />
    </main>
  );
}
