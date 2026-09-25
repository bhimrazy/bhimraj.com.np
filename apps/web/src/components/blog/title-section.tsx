import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn, formatDate, getReadingTime } from "@/lib/utils";
import { type BlogPost, tagLabel, wasUpdated } from "./posts";

export default function TitleSection({
  blog,
  dek,
}: {
  blog: BlogPost;
  /** Trusted HTML subtitle split from the post body (see `splitDek`). */
  dek?: string | null;
}) {
  const updated = wasUpdated(blog) ? blog.updatedAt : null;

  return (
    <header className="mx-auto mb-10 max-w-measure sm:mb-12">
      <Link
        href="/blog"
        className="group mb-10 inline-flex items-center gap-2 rounded-sm font-mono text-site-text-secondary text-xs uppercase tracking-[1.5px] transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
      >
        <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
        All writing
      </Link>

      {blog.tags.length > 0 && (
        <p className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium font-mono text-[11px] text-site-accent uppercase tracking-[1.5px]">
          {blog.tags.slice(0, 3).map((tag, i) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-2",
                // Keep the kicker to one line on phones.
                i > 0 && "hidden sm:inline-flex",
              )}
            >
              {i > 0 && (
                <span aria-hidden className="text-site-text-tertiary">
                  /
                </span>
              )}
              {tagLabel(tag)}
            </span>
          ))}
        </p>
      )}

      <h1 className="text-balance font-bold font-display text-[2rem] text-site-text leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05]">
        {blog.title}
      </h1>

      {dek && (
        <p
          className="mt-5 text-pretty font-display text-site-text-secondary text-xl leading-snug tracking-tight sm:text-2xl"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: from trusted MDX
          dangerouslySetInnerHTML={{ __html: dek }}
        />
      )}

      <div className="mt-8 flex items-center gap-3 border-site-border border-y py-4">
        <Image
          src={siteConfig.author.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover ring-1 ring-site-border"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-sm font-medium text-site-text text-sm transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
          >
            {siteConfig.author.name}
          </a>
          {/* Stacks on phones so a wrapped line never ends on a separator. */}
          <p className="flex flex-col font-mono text-site-text-secondary text-xs sm:flex-row sm:items-center sm:gap-2">
            <span>
              Published{" "}
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
              <span aria-hidden> · </span>
              {getReadingTime(blog.html)}
            </span>
            {updated && (
              <span>
                <span aria-hidden className="hidden sm:inline">
                  ·{" "}
                </span>
                Updated <time dateTime={updated}>{formatDate(updated)}</time>
              </span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
}
