import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { formatShortDate } from "@/lib/format";
import { Section } from "./primitives";

const latest = [...allBlogPosts]
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  )
  .slice(0, 3);

/** Latest three posts as date + title rows. */
export function Writing() {
  return (
    <Section label="Writing" action={{ href: "/blog", text: "All posts" }}>
      <ul className="-mx-3">
        {latest.map((post) => (
          <li key={post._meta.path}>
            <Link
              href={`/blog/${post._meta.path}/`}
              className="group grid grid-cols-1 gap-x-6 gap-y-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-site-bg-secondary focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:grid-cols-[6.5rem_1fr]"
            >
              <time
                dateTime={post.publishedAt}
                className="font-mono text-[11.5px] text-site-text-tertiary tabular-nums sm:pt-[3px]"
              >
                {formatShortDate(post.publishedAt)}
              </time>
              <span className="text-pretty text-[15px] text-site-text transition-colors group-hover:text-site-accent">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
