import Link from "next/link";
import { Key } from "react";

export default function HeroSection() {
  const hero_content: { [key: string]: any } = {
    greetings: "Hi there, I'm Bhimraj.",
    tagline: "ML/DL Engineer | Django Developer | NextJs Developer",
    description:
      "I am a final year Computer Engineering Student at Kathford \
                      International College of Engineering and Management. \
                      I like exploring and researching Computer Vision projects ,\
                      developing websites with NextJs and Tailwinds CSS and \
                      playing with AI tools.\
                      ",
    cta: "Don't forget to sign my",
    cta_d: "guestbook!",
    buttons: [
      { title: "Read the blog", link: "/blog" },
      {
        title: "Explore more about me",
        link: "https://www.linkedin.com/in/bhimrazy",
      },
    ],
  };
  return (
    <section className="flex flex-col justify-center space-y-4 pt-32 pb-10 text-left dark:text-gray-200">
      <div className="flex flex-col space-y-2">
        <h1 className="font-inter text-xl font-bold sm:text-3xl md:text-5xl ">
          {hero_content?.greetings}
        </h1>
        <p className=" max-w-2xl md:text-base">{hero_content?.tagline}</p>
      </div>
      <p className=" max-w-2xl md:text-lg">{hero_content?.description}</p>
      {/* <p className="space-x-1 py-1 md:text-lg">
        <span>{hero_content?.cta}</span>
        <span className="cursor-pointer border-b-2 border-dotted border-gray-200 py-1 transition-all hover:border-gray-300 hover:text-indigo-600">
          {hero_content?.cta_d}
        </span>
      </p> */}
      <div className="justify-center space-x-2 py-4">
        {hero_content?.buttons.map(
          (button: { title: string; link: string }, idx: Key) => (
            <Link href={button?.link} key={idx}>
              <a>
                <button className="rounded-md border bg-white px-6 py-2 text-base font-medium text-gray-800 shadow-sm transition-all hover:shadow-md dark:border-gray-900 dark:bg-slate-800 dark:text-gray-200 dark:hover:text-gray-300 dark:hover:shadow-slate-800">
                  {button?.title}
                </button>
              </a>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
