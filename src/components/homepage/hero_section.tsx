import { Key } from 'react'

export default function HeroSection() {
  const hero_content: { [key: string]: any } = {
    greetings: "Hi there, I'm Bhimraj.",
    // heading: "The Future CEO of \n Google.",
    description:
      'I am a Computer Engineering Student at Kathford \
                      International College of Engineering and Management. \
                      I like making websites with NextJs and Tailwinds CSS and \
                      playing with AI tools.\
                      ',
    cta: "Don't forget to sign my",
    cta_d: 'guestbook!',
    buttons: [{ title: 'Read the blog' }, { title: 'Learn more about me' }],
  }
//   h-[85vh]
  return (
    <section className="flex flex-col justify-center text-left space-y-3 py-16">
      <span className="text-xl sm:text-3xl md:text-5xl font-semibold">{hero_content?.greetings}</span>

      {/* <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold">{hero_content?.heading}</h1> */}

      <p className=" max-w-2xl md:text-lg">{hero_content?.description}</p>
      <p className="py-1 md:text-lg space-x-1">
        <span>{hero_content?.cta}</span>
        <span className="border-b-2 py-1 border-gray-200 hover:border-gray-300 hover:text-indigo-600 border-dotted cursor-pointer transition-all">
          {hero_content?.cta_d}
        </span>
      </p>
      <div className="justify-center py-2 space-x-2">
        {hero_content?.buttons.map((button: { title: string }, idx: Key) => (
          <button
            key={idx}
            className="bg-white text-gray-800 text-base font-medium px-6 py-2 rounded-md shadow-sm hover:shadow-md border transition-all"
          >
            {button?.title}
          </button>
        ))}
      </div>

      {/* <div className="absolute inset-x-1/2 bottom-6 animate-bounce transition-all">
            <svg className="w-8 h-8 text-gray-600 hover:text-indigo-600 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </div> */}
    </section>
  )
}
