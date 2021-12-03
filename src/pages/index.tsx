import Layout from 'src/components/layout'

export default function Home() {
  const hero_content: { [key: string]: string } = {
    greetings: "Hi there, I'm Bhimraj.",
    // heading: "The Future CEO of \n Google.",
    description: "I am a Computer Engineering Student at Kathford \
                  International College of Engineering and Management. \
                  I like making websites with NextJs and Tailwind\s CSS and \
                  playing with AI tools.\
                  "
  }
  return (
    <Layout>
      <main className="flex flex-col px-4 xl:px-0 w-full max-w-5xl mx-auto">
        <section className="flex flex-col justify-center text-center space-y-3 items-center h-[85vh]">
          <span className='text-lg md:text-xl font-semibold'>{hero_content?.greetings}</span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold">{hero_content?.heading}</h1>
          <p className=" max-w-2xl md:text-lg mx-auto">
            {hero_content?.description}
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
