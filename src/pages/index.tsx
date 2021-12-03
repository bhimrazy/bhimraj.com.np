import { ReactChild, ReactFragment, ReactPortal, Key } from 'react'
import Layout from 'src/components/layout'

export default function Home() {
  const hero_content: { [key: string]: any } = {
    greetings: "Hi there, I'm Bhimraj.",
    // heading: "The Future CEO of \n Google.",
    description: "I am a Computer Engineering Student at Kathford \
                  International College of Engineering and Management. \
                  I like making websites with NextJs and Tailwind\s CSS and \
                  playing with AI tools.\
                  ",
    cta: "Don't forget to sign my",
    cta_d: "guestbook!",
    buttons: [{ title: "Read the blog" }, { title: "Learn more about me" }]
  }
  return (
    <Layout>
      <main className="flex flex-col px-4 xl:px-0 w-full max-w-5xl mx-auto">
        <section className="flex flex-col justify-center text-left space-y-3 h-[85vh]">
          <span className='text-xl md:text-4xl font-semibold'>{hero_content?.greetings}</span>
          {/* <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold">{hero_content?.heading}</h1> */}
          <p className=" max-w-2xl md:text-lg">
            {hero_content?.description}
          </p>
          <p className="py-1 md:text-lg space-x-1"><span>{hero_content?.cta}</span><span className="border-b-2 py-1 border-gray-200 hover:border-gray-300 hover:text-indigo-600 border-dotted cursor-pointer transition-all">{hero_content?.cta_d}</span></p>
          <div className='justify-center py-2 space-x-2'>
            {
              hero_content?.buttons.map((button: { title: string }, idx: Key) => (
                <button key={idx} className="bg-white text-gray-800 text-base font-medium px-6 py-2 rounded-md shadow-sm hover:shadow-md border transition-all">
                  {button?.title}
                </button>
              ))
            }
          </div>
        </section>
      </main>
    </Layout>
  )
}
