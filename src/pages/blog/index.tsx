import BlogSection from "src/components/blog/blog_section";
import Layout from "src/components/layout";
import { GetStaticProps } from "next";
import { get_posts } from "src/lib/utils";
import { getSiteInfo } from "@/lib/info";
import { useSiteUrl } from "@/lib/helper";

export default function Blog({ posts, site_info }) {
  const meta_data = {
    ...site_info,
    title: "Blogs | " + site_info?.title,
    description:
      "This is the blogs page where you can find some of my recent published articles. " +
      site_info?.description,
    url: useSiteUrl(),
  };
  return (
    <Layout meta_data={meta_data} site_info={site_info}>
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
        <BlogSection blogs={posts} />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: site_info } = getSiteInfo();
  const posts = get_posts();
  return {
    props: {
      posts,
      site_info,
    },
  };
};
