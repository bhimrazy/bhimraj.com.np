import type { Metadata } from "next";
import BlogSection from "@/components/blog/blog-section";
import { sortedPosts } from "@/components/blog/posts";
import { Container } from "@/components/container";
import { blog } from "@/config/blog";
import { pageMetadata } from "@/lib/metadata";

// No explicit images: the generated card in ./opengraph-image.tsx applies.
export const metadata: Metadata = pageMetadata({
  title: blog.title,
  description: blog.description,
  path: "/blog",
});

const years = sortedPosts.map((p) => new Date(p.publishedAt).getUTCFullYear());
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
