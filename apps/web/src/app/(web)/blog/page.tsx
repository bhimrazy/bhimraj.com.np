import type { Metadata } from "next";
import BlogSection from "@/components/blog/blog-section";
import { sortedPosts } from "@/components/blog/posts";
import { Container } from "@/components/container";
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

const years = sortedPosts.map((p) => new Date(p.publishedAt).getFullYear());
const span =
  years.length > 0
    ? [Math.min(...years), Math.max(...years)]
        .filter((y, i, all) => all.indexOf(y) === i)
        .join("–")
    : null;

export default function Blog() {
  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <Container>
        {/* Page header */}
        <header className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
              Blog
            </span>
            <h1 className="mb-3 font-bold font-display text-4xl text-site-text leading-tight tracking-tight sm:text-5xl">
              Writing &amp; thinking
            </h1>
            <p className="max-w-lg text-base text-site-text-secondary">
              Technical deep-dives on architecture, ML, open source, and
              building in the open.
            </p>
          </div>
          {sortedPosts.length > 0 && (
            <p className="font-mono text-site-text-tertiary text-xs md:text-right">
              {sortedPosts.length}{" "}
              {sortedPosts.length === 1 ? "article" : "articles"}
              {span && <> · {span}</>}
            </p>
          )}
        </header>

        <BlogSection />
      </Container>
    </main>
  );
}
