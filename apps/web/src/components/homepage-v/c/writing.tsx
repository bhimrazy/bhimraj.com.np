import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { ArrowLink } from "@/components/section-heading";
import { Chapter } from "./chapter";

const latest = [...allBlogPosts]
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  )
  .slice(0, 4);

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Latest posts as plain rows, like an index at the back of a notebook. */
export function Writing() {
  return (
    <Chapter id="writing" aside="long-form, with figures">
      <ol className="-mx-3">
        {latest.map((post) => (
          <li key={post._meta.path}>
            <Link
              href={`/blog/${post._meta.path}/`}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 rounded-lg px-3 py-3.5 transition-colors hover:bg-site-bg-secondary focus-visible:outline-2 focus-visible:outline-site-accent dark:hover:bg-white/3"
            >
              <span className="text-pretty font-display font-medium text-[16px] text-site-text leading-snug transition-colors group-hover:text-site-accent">
                {post.title}
              </span>
              <time
                dateTime={post.publishedAt}
                className="font-mono text-[11px] text-site-text-tertiary tabular-nums"
              >
                {monthYear.format(new Date(post.publishedAt))}
              </time>
              <span className="col-span-2 line-clamp-1 text-site-text-secondary text-sm">
                {post.description}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <ArrowLink href="/blog">Everything I&rsquo;ve written</ArrowLink>
      </div>
    </Chapter>
  );
}
