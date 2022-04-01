import BlogSection from "src/components/blog/blog_section";
import Layout from "src/components/layout";
import { GetStaticProps } from "next";
import { get_posts } from "src/lib/utils";

export default function Blog({ posts }) {
  const meta_data = {
    title: "BLOG | BHIMRAJ YADAV",
  };
  return (
    <Layout meta_data={meta_data}>
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-3/4 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px]  dark:block"></div>
        <BlogSection blogs={posts} />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = get_posts();
  return {
    props: {
      posts,
    },
  };
};
