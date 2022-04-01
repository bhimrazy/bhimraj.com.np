import Link from "next/link";

export default function BlogSection({ blogs }) {
  const blog_content = {
    title: "Blog",
    blogs,
  };
  return (
    <section className="flex flex-col py-10 md:py-16">
      <h1 className="text-5xl  font-bold md:font-black">
        {blog_content?.title}
      </h1>
      <div className="prose flex flex-col dark:prose-invert lg:prose-lg">
        {blog_content?.blogs.map((blog, idx) => (
          <article key={idx}>
            <Link href="/blog/[slug]/" as={`/blog/${blog.slug}/`}>
              <a>
                <h2>{blog?.data?.title}</h2>
              </a>
            </Link>
            <p>{blog?.data?.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
