import HeroSection from "src/components/homepage/hero_section";
import NewsLetter from "src/components/homepage/news_letter";
import PostSection from "src/components/homepage/post_section";
import ProjectSection from "src/components/homepage/project_section";
import VideoSection from "src/components/homepage/video_section";
import Layout from "src/components/layout";
import { GetStaticProps } from "next";
import { getProjects, getSiteInfo, getYoutubeData } from "@/lib/info";
import { MetaData, SiteInfo } from "@/lib/types";

export default function Home({
  data,
  youtube_videos,
  projects,
}: {
  data: SiteInfo;
  youtube_videos: any;
  projects: any;
}) {
  const meta_data: MetaData = data;
  return (
    <Layout meta_data={meta_data} site_info={data}>
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <HeroSection />
        {/* <PostSection /> */}
        <ProjectSection projects={projects} />
        <VideoSection videos={youtube_videos} />
        <NewsLetter />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = getSiteInfo();
  const res = await fetch(process.env.YOUTUBE_API_URL);
  const youtube_data = await res.json();
  const youtube_videos = youtube_data?.items.map((video) => {
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

  const projects = getProjects();

  return {
    props: { data, youtube_videos, projects },
  };
};
