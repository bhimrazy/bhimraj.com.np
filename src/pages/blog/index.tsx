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
