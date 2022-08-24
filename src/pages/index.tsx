import HeroSection from "src/components/homepage/hero_section";
import NewsLetter from "src/components/homepage/news_letter";
import PostSection from "src/components/homepage/post_section";
import ProjectSection from "src/components/homepage/project_section";
import VideoSection from "src/components/homepage/video_section";
import Layout from "src/components/layout";
import { GetStaticProps } from "next";
import { getSiteInfo } from "@/lib/info";
import { MetaData, SiteInfo } from "@/lib/types";

export default function Home({ data }: { data: SiteInfo }) {
  const meta_data: MetaData = {
    title: "HOME | BHIMRAJ YADAV",
  };
  return (
    <Layout meta_data={meta_data} site_info={data}>
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = getSiteInfo();
  return {
    props: { data },
    revalidate: 1,
  };
};
