import { blog } from "@/config/blog";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import BlogSection from "@/components/blog/blog-section";

export const metadata: Metadata = {
  title: blog.title,
  description: blog.description,
  alternates: {
    canonical: blog.url,
  },
  openGraph: {
    type: "website",
    url: blog.url,
    title: blog.title,
    description: blog.description,
    siteName: siteConfig.name,
    images: blog.images,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.author.handle,
    creator: siteConfig.author.handle,
    title: blog.title,
    description: blog.description,
    images: blog.images,
  },
};

export default function Blog() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-linear-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] md:left-1/2 lg:left-3/4 dark:block"></div>
      <BlogSection />
    </main>
  );
}
