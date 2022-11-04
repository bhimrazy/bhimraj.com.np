import { useRouter } from "next/router";
import { get_posts } from "src/lib/utils";
import Layout from "src/components/layout";
import TitleSection from "@/components/blog/title_section";
import { GetStaticProps, GetStaticPaths } from "next";
import { getSiteInfo } from "@/lib/info";
import { useSiteUrl } from "@/lib/helper";

export default function Blog({ post, site_info }) {
  const meta_data = {
    title: post?.data?.title,
    description: post?.data?.description,
    image: post?.data?.image,
    url: useSiteUrl(),
    schemaType: "WebPage",
    createdAt: post?.data?.published_at,
    updatedAt: post?.data?.updated_at,
  };
  const post_content = post.content.split("\n").splice(1).join("\n");
  return (
    <Layout meta_data={meta_data} site_info={site_info}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
        <section className="py-6. flex flex-col">
          <article className="flex flex-col items-center justify-center">
            <TitleSection blog={post} site_info={site_info} />

            <div
              className="prose prose-slate col-span-5 max-w-xs overflow-hidden whitespace-normal break-words dark:prose-invert dark:text-slate-400 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 sm:max-w-md lg:max-w-3xl"
              dangerouslySetInnerHTML={{ __html: post_content }}
            ></div>
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
  const { data: site_info } = getSiteInfo();

  return {
    props: {
      post,
      site_info,
    },
  };
};
