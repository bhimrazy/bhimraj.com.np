import BlogSection from 'src/components/blog/blog_section'
import Layout from 'src/components/layout'
export default function Blog() {
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
