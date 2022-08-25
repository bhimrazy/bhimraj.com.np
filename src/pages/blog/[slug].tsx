import { useRouter } from "next/router";
import { get_posts } from "src/lib/utils";
import Layout from "src/components/layout";
import { GetStaticProps, GetStaticPaths } from "next";
import { getSiteInfo } from "@/lib/info";

export default function Blog({ post, site_info }) {
  const meta_data = {
    title: "BLOG | BHIMRAJ YADAV",
  };
  const router = useRouter();

  const post_content = post.content.split("\n").splice(1).join("\n");
  return (
    <Layout meta_data={meta_data} site_info={site_info}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
        <section className="flex flex-col py-6">
          <article className="flex flex-col">
            <div className="space-y-2 py-10 text-center">
              <dl className="hidden md:block">
                <dt className="sr-only">Date</dt>
                <dd className="text-slate-700 dark:text-slate-400">
                  <time dateTime="2022-02-24T12:00:00.000Z">
                    Thursday, Febuary 24, 2022
                  </time>
                </dd>
              </dl>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-4xl">
                {post?.data?.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6">
              <div>
                <a
                  className="group flex font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                  onClick={() => router.back()}
                >
                  <svg
                    viewBox="0 -9 3 24"
                    className="mr-3 h-6 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  >
                    <path
                      d="M3 0L0 3L3 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  Go back to blog
                </a>
              </div>
              <div
                className="prose prose-slate col-span-5 overflow-hidden whitespace-normal break-words dark:prose-invert dark:text-slate-400 lg:prose-lg "
                dangerouslySetInnerHTML={{ __html: post_content }}
              ></div>
            </div>
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
