import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, getReadingTime } from "@/lib/utils";

const sortedPosts = [...allBlogPosts]
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  )
  .slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="border-site-border border-t py-20">
      <div className="mx-auto max-w-[1120px] px-6">
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
        <div className="overflow-hidden rounded-xl bg-site-border">
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
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="text-site-text-tertiary">·</span>
                  <span className="text-site-text-tertiary text-sm">
                    {getReadingTime(post.html)}
                  </span>
                  {post.tags?.slice(0, 2).map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-md bg-site-accent-subtle font-mono text-[10px] text-site-accent"
                      style={{ border: "none" }}
                    >
                      {tag}
                    </Badge>
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
      </div>
    </section>
  );
}
