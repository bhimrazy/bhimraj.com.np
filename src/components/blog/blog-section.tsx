import { ChevronRightIcon } from "@radix-ui/react-icons";
import { allBlogPosts } from "content-collections";
import Link from "next/link";
import { formatDate, getReadingTime } from "@/lib/utils";

const BLOG_CONTENT = {
  title: "Blog",
  description: "All the latest posts",
} as const;

// Pre-sort blogs at module level since allBlogPosts is static
const sortedBlogPosts = [...allBlogPosts].sort(
  (a, b) => Number(new Date(b?.publishedAt)) - Number(new Date(a?.publishedAt)),
);

export default function BlogSection() {
  return (
    <section className="relative flex flex-col py-6">
      <div className="space-y-1 py-10 text-center">
        <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-slate-200">
          {BLOG_CONTENT.title}
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400">
          {BLOG_CONTENT.description}
        </p>
      </div>
      <div className="flex flex-col space-y-10">
        {sortedBlogPosts.map((blog, idx) => (
          <article key={blog?._meta.path || idx}>
            <div className="grid grid-cols-1 md:grid-cols-6">
              <div className="flex flex-col space-y-1">
                <dl className="hidden md:block">
                  <dt className="sr-only">Date</dt>
                  <dd className="text-gray-700 text-sm leading-6 dark:text-slate-400">
                    <time dateTime={new Date(blog?.publishedAt).toISOString()}>
                      {formatDate(blog?.publishedAt)}
                    </time>
                  </dd>
                </dl>
                <p className="text-gray-500 text-sm">
                  {getReadingTime(blog.html)}
                </p>
              </div>
              <div className="md:col-span-5">
                <Link
                  href="/blog/[slug]/"
                  as={`/blog/${blog._meta.path}/`}
                  passHref
                >
                  <h3 className="prose mb-4 font-bold text-slate-900 text-xl tracking-tight dark:text-slate-200">
                    {blog?.title}
                  </h3>
                </Link>
                <p className="prose prose-slate mb-6 max-w-none dark:text-slate-400">
                  {blog?.description}
                </p>
                <Link
                  href="/blog/[slug]/"
                  as={`/blog/${blog._meta.path}/`}
                  className="group inline-flex h-9 items-center whitespace-nowrap rounded-full bg-slate-100 px-3 font-semibold text-slate-700 text-sm hover:bg-slate-200 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-slate-500 dark:hover:bg-slate-600 dark:hover:text-white"
                  passHref
                >
                  Read more
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
