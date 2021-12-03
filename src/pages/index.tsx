import Layout from 'src/components/layout'

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col px-4 xl:px-0 w-full max-w-5xl mx-auto">
        <section className="flex flex-col justify-center text-center space-y-3 items-center h-[85vh]">
          <span className='text-lg md:text-xl font-semibold'>Hi there,</span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold">The Future of Writing <br /> SEO Content.</h1>
          <p className=" max-w-2xl md:text-lg mx-auto">
            Artificial intelligence makes it fast & easy to create content for your blog, social
            media, website, and more! Rated 5/5 stars in 1,000+ reviews.
          </p>
          <div className='justify-center py-4'>
            <button className="bg-blue-600 text-white text-lg px-8 py-2 rounded-md hover:bg-white border border-opacity-0 hover:border-opacity-100 hover:text-blue-700 border-blue-600">
              Get started →
            </button>
          </div>
        </section>
      </main>
    </Layout>
  )
}
