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
  const res = await fetch(process.env.YOUTUBE_API_URL!);
  const youtubeData = await res.json();
  const youtubeVideos = youtubeData?.items.map((video) => {
    return {
      title: video?.snippet?.title,
      description: video?.snippet?.description,
      published_at: video?.snippet?.publishedAt,
      thumbnail_url: video?.snippet?.thumbnails?.default?.url.replace(
        "default",
        "maxresdefault"
      ),
      video_url: "https://www.youtube.com/watch?v=" + video?.id?.videoId,
    };
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <HeroSection />
      {/* <PostSection /> */}
      <ProjectSection />
      <VideoSection videos={youtubeVideos} />
      <NewsLetter />
    </main>
  );
}
