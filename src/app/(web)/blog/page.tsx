import type { Metadata } from "next";
import BlogSection from "@/components/blog/blog-section";
import { blog } from "@/config/blog";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: blog.title,
  description: blog.description,
  alternates: { canonical: blog.url },
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
    <main className="pt-28 pb-20">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Page header */}
        <div className="mb-12">
          <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Blog
          </span>
          <h1 className="mb-3 font-bold font-display text-4xl text-site-text leading-tight sm:text-5xl">
            Writing &amp; thinking
          </h1>
          <p className="max-w-lg text-base text-site-text-secondary">
            Technical deep-dives on architecture, ML, open source, and building
            in the open.
          </p>
        </div>

        <BlogSection />
      </div>
    </main>
  );
}
