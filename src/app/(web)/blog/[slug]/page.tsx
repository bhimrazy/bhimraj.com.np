import TitleSection from "@/components/blog/title-section";
import { getTableOfContents } from "@/lib/toc";
import { allBlogPosts } from "content-collections";

export async function generateStaticParams() {
  // Get the paths we want to pre-render based on posts
  const paths = allBlogPosts.map((post) => ({
    slug: post._meta.path,
  }));

  return paths;
}

type Props = {
  params: {
    slug: string;
  };
};
export default async function BlogPage({ params: { slug } }: Props) {
  const post = allBlogPosts.find((post) => post._meta.path === slug);
  const postContent = post?.html.split("\n").splice(1).join("\n") || "";
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
      <section className="py-6. flex flex-col">
        <article className="mx-auto flex max-w-screen-lg flex-col items-center justify-center">
          <TitleSection blog={post!} />

          {/* blog content */}
          <div className="">
            <div
              className="prose prose-slate max-w-sm overflow-hidden whitespace-normal break-words dark:prose-invert dark:text-slate-400 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 sm:max-w-2xl lg:max-w-full"
              dangerouslySetInnerHTML={{ __html: postContent }}
            ></div>
          </div>
        </article>
      </section>
    </main>
  );
}
