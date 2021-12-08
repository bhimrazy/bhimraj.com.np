import BlogSection from 'src/components/blog/blog_section'
import Layout from 'src/components/layout'
import { GetStaticProps } from 'next';
import { getPosts,POSTS_PATH } from 'src/utils/mdxUtils';
import fs from 'fs'

export default function Blog({posts}) {
  const meta_data = {
    title: 'BLOG | BHIMRAJ YADAV',
  }
  return (
    <Layout meta_data={meta_data}>
      <main className="flex flex-col px-4 xl:px-0 space-y-10 w-full max-w-5xl mx-auto">
        <BlogSection />
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const post = getPosts()
  console.log(POSTS_PATH)
  const posts="Hello"
  return { props: { posts } };
};