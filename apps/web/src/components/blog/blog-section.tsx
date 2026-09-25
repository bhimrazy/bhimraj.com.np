import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { cn, formatDate, formatMonthDay, getReadingTime } from "@/lib/utils";
import { type BlogPost, postHref, sortedPosts, tagLabel } from "./posts";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4";

/** Featured post (flagged `featured`, else the newest), then a year-grouped archive. */
export default function BlogSection() {
  const featured = sortedPosts.find((p) => p.featured) ?? sortedPosts[0];
  if (!featured) return null;

  const rest = sortedPosts.filter((p) => p !== featured);
  const years = groupByYear(rest);

  return (
    <>
      <FeaturedPost post={featured} />

      {rest.length > 0 && (
        <section aria-labelledby="archive" className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-site-border border-b pb-4">
            <h2
              id="archive"
              className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]"
            >
              More writing
            </h2>
            <span className="font-mono text-site-text-tertiary text-xs">
              {rest.length} {rest.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {years.map(([year, posts]) => (
            <div
              key={year}
              className="grid gap-x-10 gap-y-2 border-site-border border-b py-8 md:grid-cols-[7rem_minmax(0,1fr)] md:py-10"
            >
              <h3 className="self-start font-bold font-display text-2xl text-site-text-tertiary tabular-nums md:sticky md:top-28">
                {year}
              </h3>
              <ul className="flex flex-col divide-y divide-site-border">
                {posts.map((post) => (
                  <li
                    key={post._meta.path}
                    className="py-6 first:pt-2 last:pb-0"
                  >
                    <ArchiveRow post={post} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="group relative grid overflow-hidden rounded-2xl border border-site-border bg-site-card transition-colors duration-200 hover:border-site-border-hover md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] dark:border-white/6 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/12">
      <div className="relative aspect-video overflow-hidden border-site-border border-b bg-site-bg-secondary md:aspect-auto md:min-h-88 md:border-r md:border-b-0 dark:border-white/6">
        <Image
          src={post.image}
          alt=""
          fill
          preload
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-site-text-tertiary text-xs">
          <span className="rounded-full bg-site-accent-subtle px-2.5 py-0.5 font-medium text-[10px] text-site-accent uppercase tracking-[1.5px]">
            {post.featured ? "Featured" : "Latest"}
          </span>
          <span className="whitespace-nowrap">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden> · </span>
            {getReadingTime(post.html)}
          </span>
        </div>

        <h2 className="text-balance font-bold font-display text-2xl text-site-text leading-tight tracking-tight sm:text-3xl">
          <Link
            href={postHref(post)}
            className={cn(
              "rounded-sm transition-colors after:absolute after:inset-0 group-hover:text-site-accent",
              focusRing,
            )}
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-4 line-clamp-3 text-site-text-secondary leading-relaxed">
          {post.description}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <TagList tags={post.tags} />
          <span className="inline-flex items-center gap-1.5 font-medium text-site-accent text-sm">
            Read article
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </article>
  );
}

function ArchiveRow({ post }: { post: BlogPost }) {
  return (
    <article className="group relative grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_11rem]">
      <div className="min-w-0">
        <p className="mb-2 font-mono text-site-text-tertiary text-xs">
          <time dateTime={post.publishedAt}>
            {formatMonthDay(post.publishedAt)}
          </time>
          <span aria-hidden> · </span>
          {getReadingTime(post.html)}
        </p>
        <h4 className="text-pretty font-display font-semibold text-site-text text-xl leading-snug">
          <Link
            href={postHref(post)}
            className={cn(
              "rounded-sm transition-colors after:absolute after:inset-0 group-hover:text-site-accent",
              focusRing,
            )}
          >
            {post.title}
          </Link>
        </h4>
        <p className="mt-2 line-clamp-2 text-site-text-secondary text-sm leading-relaxed">
          {post.description}
        </p>
        <TagList tags={post.tags} className="mt-4" />
      </div>
      <div className="relative hidden aspect-video overflow-hidden rounded-lg border border-site-border bg-site-bg-secondary sm:block dark:border-white/6">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    </article>
  );
}

function TagList({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label="Tags" className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.slice(0, 3).map((tag) => (
        <li
          key={tag}
          className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[10px] text-site-accent"
        >
          {tagLabel(tag)}
        </li>
      ))}
    </ul>
  );
}

function groupByYear(posts: BlogPost[]): [number, BlogPost[]][] {
  const groups = new Map<number, BlogPost[]>();
  for (const post of posts) {
    const year = new Date(post.publishedAt).getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()];
}
