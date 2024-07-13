import { formatDate, getReadingTime } from "@/lib/utils";
import { allBlogPosts } from "content-collections";
import Link from "next/link";

export default function BlogSection() {
  const blogContent = {
    title: "Blog",
    description: "All the latest posts",
    blogs: allBlogPosts,
  };
  return (
    <section className="relative flex flex-col py-6">
      <div className="space-y-1 py-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-4xl">
          {blogContent?.title}
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400">
          {blogContent?.description}
        </p>
      </div>
      <div className="flex flex-col space-y-10">
        {blogContent?.blogs
          .sort(
            (a, b) =>
              Number(new Date(b?.publishedAt)) -
              Number(new Date(a?.publishedAt))
          )
          .map((blog, idx) => (
            <article key={idx}>
              <div className="grid grid-cols-1 md:grid-cols-6">
                <div className="flex flex-col space-y-1">
                  <dl className="hidden md:block">
                    <dt className="sr-only">Date</dt>
                    <dd className="text-sm leading-6 text-gray-700 dark:text-slate-400">
                      <time
                        dateTime={new Date(blog?.publishedAt).toISOString()}
                      >
                        {formatDate(blog?.publishedAt)}
                      </time>
                    </dd>
                  </dl>
                  <p className="text-sm text-gray-500">
                    {getReadingTime(blog.content)}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <Link href="/blog/[slug]/" as={`/blog/${blog._meta.path}/`}>
                    <h3 className="prose mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                      {blog?.title}
                    </h3>
                  </Link>
                  <p className="prose prose-slate mb-6 max-w-none dark:text-slate-400">
                    {blog?.description}
                  </p>
                  <Link
                    href="/blog/[slug]/"
                    as={`/blog/${blog._meta.path}/`}
                    className="group inline-flex h-9 items-center whitespace-nowrap rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500"
                  >
                    Read more
                    <svg
                      className="ml-3 overflow-visible text-slate-300 group-hover:text-slate-400 dark:text-slate-500 dark:group-hover:text-slate-400"
                      width="3"
                      height="6"
                      viewBox="0 0 3 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M0 0L3 3L0 6"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
