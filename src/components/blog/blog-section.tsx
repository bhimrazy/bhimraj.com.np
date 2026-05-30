import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { formatDate, getReadingTime } from "@/lib/utils";

const sortedPosts = [...allBlogPosts].sort(
  (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
);

export default function BlogSection() {
  return (
    <div className="flex flex-col gap-4">
      {sortedPosts.map((post) => (
        <Link
          key={post._meta.path}
          href={`/blog/${post._meta.path}/`}
          className="group relative overflow-hidden rounded-xl border border-site-border bg-site-card px-7 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10 dark:hover:shadow-site-accent-subtle"
        >
          <span className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 font-display font-semibold text-lg text-site-text leading-snug">
                {post.title}
              </h2>
              <p className="mb-4 line-clamp-2 text-site-text-secondary text-sm leading-relaxed">
                {post.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-site-text-tertiary text-xs">
                  {formatDate(post.publishedAt)}
                </span>
                <span className="text-site-text-tertiary">·</span>
                <span className="font-mono text-site-text-tertiary text-xs">
                  {getReadingTime(post.html)}
                </span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[10px] text-site-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="mt-1 shrink-0 text-site-text-tertiary text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
