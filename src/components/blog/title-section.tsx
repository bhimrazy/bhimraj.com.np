import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { formatDate, getReadingTime } from "@/lib/utils";

type BlogPost = typeof import("content-collections").allBlogPosts[number];

export default function TitleSection({ blog }: { blog: BlogPost }) {
  const date = blog.updatedAt ?? blog.publishedAt;
  const dateLabel = blog.updatedAt ? "Updated" : "Published";

  return (
    <div className="mb-10">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-site-text-secondary text-sm transition-colors hover:text-site-text"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        All posts
      </Link>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md border-transparent bg-site-accent-subtle font-mono text-[10px] text-site-accent"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-5 font-bold font-display text-3xl text-site-text leading-tight sm:text-4xl">
        {blog.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-site-border border-b pb-8 text-sm">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Image
            src="/bhimraj-yadav.jpg"
            alt={siteConfig.author.name}
            width={28}
            height={28}
            className="rounded-full object-cover ring-2 ring-site-border"
          />
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-site-text transition-colors hover:text-site-accent"
          >
            {siteConfig.author.name}
          </a>
        </div>

        <span className="text-site-border">·</span>

        {/* Date */}
        <time
          dateTime={date}
          className="font-mono text-site-text-tertiary text-xs"
        >
          {dateLabel} {formatDate(date)}
        </time>

        <span className="text-site-border">·</span>

        {/* Reading time */}
        <span className="font-mono text-site-text-tertiary text-xs">
          {getReadingTime(blog.html)}
        </span>
      </div>
    </div>
  );
}
