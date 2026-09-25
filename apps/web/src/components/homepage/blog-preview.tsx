import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { ArrowLink } from "@/components/section-heading";
import { formatShortDate } from "@/lib/format";
import { cn, getReadingTime } from "@/lib/utils";
import { ColumnTitle } from "./column-title";
import { surface } from "./surface";

const latestPosts = [...allBlogPosts]
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  )
  .slice(0, 3);

/** Latest posts as a dated list — one column of the Writing & research pair. */
export default function BlogPreview() {
  return (
    <div className="flex flex-col">
      <ColumnTitle
        title="From the blog"
        action={<ArrowLink href="/blog">All posts</ArrowLink>}
      />

      <ol
        className={cn(
          surface,
          "flex-1 divide-y divide-site-border/60 dark:divide-white/5",
        )}
      >
        {latestPosts.map((post) => (
          <li key={post._meta.path}>
            <Link
              href={`/blog/${post._meta.path}/`}
              className="group flex gap-5 px-6 py-5 transition-colors hover:bg-site-bg-secondary/70 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:px-7 dark:hover:bg-white/3"
            >
              <time
                dateTime={post.publishedAt}
                className="hidden w-24 shrink-0 pt-0.5 font-mono text-[12px] text-site-text-tertiary sm:block"
              >
                {formatShortDate(post.publishedAt)}
              </time>
              <div className="min-w-0 flex-1">
                <h4 className="text-pretty font-display font-semibold text-base text-site-text leading-snug transition-colors group-hover:text-site-accent">
                  {post.title}
                </h4>
                <p className="mt-1.5 line-clamp-2 text-site-text-secondary text-sm leading-relaxed">
                  {post.description}
                </p>
                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-site-text-tertiary">
                  <time dateTime={post.publishedAt} className="sm:hidden">
                    {formatShortDate(post.publishedAt)}
                  </time>
                  <span aria-hidden className="sm:hidden">
                    ·
                  </span>
                  <span>{getReadingTime(post.html)}</span>
                  {post.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-site-accent/80">
                      #{tag.replace(/\s+/g, "-")}
                    </span>
                  ))}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
