import Link from "next/link";
import { AvatarIcon } from "@/components/avatar";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";

export default function TitleSection({
  blog,
}: {
  blog: typeof import("content-collections").allBlogPosts[number];
}) {
  return (
    <div className="space-y-2 py-10 text-center">
      <div className="flex justify-start">
        <Link
          href="/blog"
          className="group flex cursor-pointer font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          passHref
        >
          <svg
            viewBox="0 -9 3 24"
            className="mr-3 h-6 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            role="img"
            aria-label="Back arrow"
          >
            <title>Back arrow</title>
            <path
              d="M3 0L0 3L3 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          Go back
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        {blog?.tags.slice(0, 4).map((tag: string, _i) => (
          <span
            key={tag}
            className="cursor-pointer whitespace-nowrap bg-gray-200 p-2 font-medium text-2xs uppercase tracking-wider transition hover:bg-gray-200/80 hover:shadow-2xs dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-left font-extrabold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-slate-200">
        {blog?.title}
      </h1>
      <div className="flex flex-row flex-wrap gap-2 text-left">
        <span>{blog?.updatedAt ? "Last updated:" : "Published on:"}</span>
        <dl>
          <dt className="sr-only">Date</dt>
          <dd className="font-medium text-slate-700 dark:text-slate-700">
            <time dateTime={blog?.updatedAt ?? blog?.publishedAt}>
              {formatDate(blog?.updatedAt ?? blog?.publishedAt)}
            </time>
          </dd>
        </dl>
        <span className="inline-flex items-center space-x-2">
          <span>by</span>
          <Link
            className="inline-flex items-center space-x-1 font-medium text-blue-600"
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            passHref
          >
            <AvatarIcon />
            <span>{siteConfig.author.name}</span>
          </Link>
        </span>
      </div>
    </div>
  );
}
