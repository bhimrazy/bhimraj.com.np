import TitleSection from "@/components/blog/title-section";
import { siteConfig } from "@/config/site";
import { allBlogPosts } from "content-collections";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((post) => post._meta.path === slug);

  const title = post?.title;
  const description = post?.description;
  const blogURL = `/blog/${post?._meta.path}`;
  const images = [
    {
      url: post?.image!,
      width: 1920,
      height: 1080,
      alt: title,
      type: "image/png",
    },
  ];
  return {
    title: title,
    description: description,
    alternates: {
      canonical: blogURL,
    },
    keywords: post?.tags,
    openGraph: {
      title: title,
      description: description,
      url: blogURL,
      siteName: siteConfig.name,
      authors: siteConfig.author.name,
      images: images,
      publishedTime: post?.publishedAt,
      modifiedTime: post?.updatedAt,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      creator: siteConfig.author.handle,
      images: images,
      site: siteConfig.author.handle,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateStaticParams() {
  // Get the paths we want to pre-render based on posts
  const paths = allBlogPosts.map((post) => ({
    slug: post._meta.path,
  }));
  return paths;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allBlogPosts.find((post) => post._meta.path === slug);
  const postContent = post?.html.split("\n").splice(1).join("\n") || "";
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-linear-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] md:left-1/2 lg:left-3/4 dark:block"></div>
      <section className="py-6. flex flex-col">
        <article className="mx-auto flex max-w-(--breakpoint-lg) flex-col items-center justify-center">
          <TitleSection blog={post!} />

          {/* blog content */}
          <div className="">
            <div
              className="prose prose-slate dark:prose-invert dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 max-w-sm overflow-hidden break-words whitespace-normal sm:max-w-2xl lg:max-w-full dark:text-slate-400"
              dangerouslySetInnerHTML={{ __html: postContent }}
            ></div>
          </div>
        </article>
      </section>
    </main>
  );
}
