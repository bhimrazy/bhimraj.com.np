import React from 'react'

export default function BlogSection({blogs}) {
  const blog_content = {
    title: 'Blog',
    blogs
  }
  console.log(blog_content)
  return (
    <section className="flex flex-col space-y-3 pt-20 pb-10 min-h-screen">
      <h1 className="text-5xl font-black">{blog_content?.title}</h1>
    </section>
  )
}
