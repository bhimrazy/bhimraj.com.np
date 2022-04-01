import BlogSection from "src/components/blog/blog_section";
import Layout from "src/components/layout";
import { GetStaticProps, GetStaticPaths } from "next";
import { get_posts } from "src/lib/utils";

export default function Blog({ post }) {
  const meta_data = {
    title: "BLOG | BHIMRAJ YADAV",
  };
  return (
    <Layout meta_data={meta_data}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <section className="flex flex-col py-10 md:py-16">
          <article className="prose dark:prose-invert lg:prose-lg">
            <h2>{post?.data?.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
          </article>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = get_posts().map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
  return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = get_posts().find((post) => post.slug === params.slug);
  return {
    props: {
      post,
    },
  };
};
