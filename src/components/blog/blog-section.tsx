import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
          className="site-card-hover group block rounded-xl border border-site-border px-7 py-6 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-4">
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
            <span className="mt-1 shrink-0 text-site-text-tertiary text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
