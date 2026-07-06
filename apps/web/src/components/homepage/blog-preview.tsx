import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { Container } from "@/components/container";
import { getReadingTime } from "@/lib/utils";

const sortedPosts = [...allBlogPosts]
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  )
  .slice(0, 2);

export default function BlogPreview() {
  return (
    <section className="py-24">
      <Container>
        {/* Section header */}
        <div className="mb-12">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Blog
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight">
            Writing &amp; thinking
          </h2>
          <p className="mt-3 max-w-lg text-base text-site-text-secondary">
            Technical deep-dives on architecture, ML, and building in the open.
          </p>
        </div>

        {/* Post list */}
        <div className="divide-y divide-site-border/50 overflow-hidden rounded-xl border border-site-border/50 dark:divide-white/3 dark:border-white/4">
          {sortedPosts.map((post) => (
            <Link
              key={post._meta.path}
              href={`/blog/${post._meta.path}/`}
              className="site-card-hover group flex items-center justify-between gap-4 px-7 py-6 transition-colors"
            >
              <div className="min-w-0">
                <h3 className="mb-2 font-display font-semibold text-base text-site-text leading-snug">
                  {post.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-site-text-tertiary text-sm">
                    {getReadingTime(post.html)}
                  </span>
                  {post.tags?.slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[10px] text-site-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="shrink-0 text-site-text-tertiary text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-medium text-site-accent text-sm transition-opacity hover:opacity-80"
          >
            All posts →
          </Link>
        </div>
      </Container>
    </section>
  );
}
