import { Blog, SiteInfo } from "@/lib/types";
import { getDate } from "@/utils/helpers";
import Link from "next/link";
import React from "react";

export default function TitleSection({
  blog,
  site_info,
}: {
  blog: Blog;
  site_info: SiteInfo;
}) {
  return (
    <div className="space-y-2 py-10 text-center sm:max-w-md lg:max-w-3xl">
      <div className="flex justify-start">
        <Link href="/blog">
          <a className="group flex cursor-pointer font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
            <svg
              viewBox="0 -9 3 24"
              className="mr-3 h-6 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            >
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
          </a>
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        {blog?.data?.tags
          .split(",")
          .slice(0, 4)
          .map((tag: string, i) => (
            <span
              key={i}
              className="text transitio cursor-pointer whitespace-nowrap bg-gray-200 p-2 text-2xs font-medium uppercase tracking-wider hover:bg-gray-200/80 hover:shadow-sm dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80"
            >
              {tag}
            </span>
          ))}
      </div>
      <h1 className="text-left text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-4xl">
        {blog?.data?.title}
      </h1>
      <div className="flex flex-row space-x-2 text-left">
        <span>
          {blog?.data?.updated_at ? "Last updated:" : "Published on:"}
        </span>
        <dl>
          <dt className="sr-only">Date</dt>
          <dd className="font-medium text-slate-700 dark:text-slate-700">
            <time dateTime={blog?.data?.updated_at ?? blog?.data?.published_at}>
              {getDate(blog?.data?.updated_at ?? blog?.data?.published_at)}
            </time>
          </dd>
        </dl>
        <span>
          by{" "}
          <a
            className="font-medium text-blue-600"
            href={site_info?.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            @bhimrazy
          </a>
        </span>
      </div>
    </div>
  );
}
