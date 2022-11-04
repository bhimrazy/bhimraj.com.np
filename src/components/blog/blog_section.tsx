import { Blog } from "@/lib/types";
import { getDate } from "@/utils/helpers";
import Link from "next/link";

export default function BlogSection({ blogs }) {
  const blog_content = {
    title: "Blog",
    description: "All the latest posts",
    blogs,
  };
  return (
    <section className="relative flex flex-col py-6">
      <div className="space-y-1 py-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-4xl">
          {blog_content?.title}
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400">
          {blog_content?.description}
        </p>
      </div>
      <div className="flex flex-col space-y-10">
        {blog_content?.blogs.map((blog: Blog, idx) => (
          <article key={idx}>
            <div className="grid grid-cols-1 md:grid-cols-6">
              <dl className="hidden md:block">
                <dt className="sr-only">Date</dt>
                <dd className="text-sm leading-6 text-gray-700 dark:text-slate-400">
                  <time
                    dateTime={new Date(blog?.data?.published_at).toISOString()}
                  >
                    {getDate(blog?.data?.published_at)}
                  </time>
                </dd>
              </dl>
              <div className="md:col-span-5">
                <Link href="/blog/[slug]/" as={`/blog/${blog.slug}/`}>
                  <a>
                    <h3 className="prose mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                      {blog?.data?.title}
                    </h3>
                  </a>
                </Link>
                <p className="prose prose-slate mb-6 max-w-none dark:text-slate-400">
                  {blog?.data?.description}
                </p>
                <Link href="/blog/[slug]/" as={`/blog/${blog.slug}/`}>
                  <a className="group inline-flex h-9 items-center whitespace-nowrap rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500">
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
                  </a>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
