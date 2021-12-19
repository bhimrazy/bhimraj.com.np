import BlogSection from 'src/components/blog/blog_section'
import Layout from 'src/components/layout'
import { GetStaticProps, GetStaticPaths } from 'next'
import { get_posts } from 'src/lib/utils'

export default function Blog({ post }) {
  const meta_data = {
    title: 'BLOG | BHIMRAJ YADAV',
  }
  return (
    <Layout meta_data={meta_data}>
      <main className="flex flex-col px-4 xl:px-0 space-y-10 w-full max-w-5xl mx-auto min-h-screen">
        <section className="flex flex-col py-10 md:py-16">
          <article className="prose lg:prose-lg dark:prose-invert">
            <h2>{post?.data?.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
          </article>
        </section>
      </main>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = get_posts().map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    }
  })
  return { paths, fallback: false }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = get_posts().find((post) => post.slug === params.slug)
  return {
    props: {
      post,
    },
  }
}
