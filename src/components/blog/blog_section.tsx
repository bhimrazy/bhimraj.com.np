export default function BlogSection({blogs}) {
  const blog_content = {
    title: 'Blog',
    blogs
  }
  return (
    <section className="flex flex-col py-10 md:py-16">
      <h1 className="text-5xl  font-bold md:font-black">{blog_content?.title}</h1>
      <div className="flex flex-col prose lg:prose-lg dark:prose-invert">
        {blog_content?.blogs.map((blog,idx)=>(
          <article key={idx}>
            <a href="#"><h2>{blog?.data?.title}</h2></a>
            <p>{blog?.data?.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
