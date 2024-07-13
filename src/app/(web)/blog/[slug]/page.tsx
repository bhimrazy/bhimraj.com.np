import TitleSection from "@/components/blog/title_section";
import { getSiteInfo } from "@/lib/info";
import { getPosts } from "@/lib/blog-api";


export async function generateStaticParams() {
  // Get the paths we want to pre-render based on posts
  const paths = getPosts().map((post) => ({
    slug: post.slug,
  }));

  return paths;
}

type Props = {
  params: {
    slug: string;
  };
};
export default function BlogPage({ params: { slug } }: Props) {
  const post = getPosts().find((post) => post.slug === slug);
  const site_info = getSiteInfo();

  // const meta_data = {
  //   title: post?.data?.title,
  //   description: post?.data?.description,
  //   image: post?.data?.image,
  //   url: useSiteUrl(),
  //   schemaType: "WebPage",
  //   createdAt: post?.data?.published_at,
  //   updatedAt: post?.data?.updated_at,
  // };
  const post_content = post?.content.split("\n").splice(1).join("\n");
  return (

    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
      <section className="py-6. flex flex-col">
        <article className="flex flex-col items-center justify-center">
          <TitleSection blog={post} site_info={site_info} />

          {/* blog content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 w-full">
            <div
              className="prose prose-slate overflow-hidden whitespace-normal break-words dark:prose-invert dark:text-slate-400 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 max-w-none lg:col-span-4"
              dangerouslySetInnerHTML={{ __html: post_content }}
            ></div>
            <div className="flex flex-row flex-wrap gap-4">
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}