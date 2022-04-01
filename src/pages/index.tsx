import HeroSection from "src/components/homepage/hero_section";
import NewsLetter from "src/components/homepage/news_letter";
import PostSection from "src/components/homepage/post_section";
import ProjectSection from "src/components/homepage/project_section";
import VideoSection from "src/components/homepage/video_section";
import Layout from "src/components/layout";

export default function Home() {
  const meta_data = {
    title: "HOME | BHIMRAJ YADAV",
  };
  return (
    <Layout meta_data={meta_data}>
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <HeroSection />
        <VideoSection />
        <PostSection />
        <ProjectSection />
        <NewsLetter />
      </main>
    </Layout>
  );
}
