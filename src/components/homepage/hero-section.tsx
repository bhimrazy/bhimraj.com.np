import Link from "next/link";
import type { Key } from "react";

export default function HeroSection() {
  const hero_content = {
    greetings: "👋 Hi, I'm Bhimraj Yadav!",
    tagline: "ML/DL Engineer | Django Developer | NextJs Developer",
    description:
      "💡 Passionate Software Engineer | 🧠 AI Engineer | 🌍 Opensource Contributor |\n 🌐 Research Enthusiast in Computer Vision & Generative AI.",
    subDescription:
      "🌱 Always excited to collaborate on projects involving AI, healthcare, and innovative technologies.",
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
    <section className="flex flex-col justify-center space-y-6 pt-32 pb-10 text-left font-inter dark:text-gray-200">
      <div className="flex flex-col space-y-2">
        <span className="font-medium md:text-base">
          {hero_content.greetings}
        </span>
        <h1 className="max-w-2xl whitespace-pre-line font-bold text-xl sm:text-2xl md:text-4xl">
          {hero_content.tagline}
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <p className="max-w-3xl whitespace-pre-line hover:text-gray-800 md:text-sm">
          {hero_content.description}
        </p>
        <p className="max-w-3xl hover:text-gray-800 md:text-sm">
          {hero_content.subDescription}
        </p>
      </div>
      <div className="flex flex-col gap-2 py-4 sm:flex-row">
        {hero_content.buttons.map(
          (button: { title: string; link: string }, _idx: Key) => (
            <Link href={button.link} key={button.link} passHref>
              <button
                type="button"
                className="rounded-md border bg-white px-6 py-2 font-medium text-base text-gray-800 shadow-2xs transition-all hover:shadow-md dark:border-gray-900 dark:bg-slate-800 dark:text-gray-200 dark:hover:text-gray-300 dark:hover:shadow-slate-800"
              >
                {button.title}
              </button>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
