import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/blog-api";
import type { Metadata } from "next";
import BlogSection from "src/components/blog/blog_section";

export const metadata: Metadata = {
  title: "Blogs | " + siteConfig.name,
  description: "This is the blogs page where you can find some of my recent published articles. ",
  alternates: {
    canonical: "/blog",
  }
}

export default function Blog() {
  const posts = getPosts();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
      <BlogSection blogs={posts} />
    </main>
  );
}
