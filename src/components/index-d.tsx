import Head from "next/head";
import Image from "next/image";
import profilePic from "public/bhimraj_yadav.jpg";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white ">
      <Head>
        <title>Software Developer | AI Enthusiast | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Bhimraj Yadav" />
      </Head>
      <main className="relative w-full max-w-lg">
        <div className="absolute left-4 top-4 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
        <div className="animation-delay-2000 absolute right-4 top-0 h-72 w-72 animate-blob rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
        <div className="animation-delay-4000 absolute left-28  top-20 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-50 mix-blend-multiply blur-xl filter"></div>
        <div className="flex h-full w-full flex-col items-center space-y-2 rounded-2xl bg-gray-100/20 p-8 backdrop-blur-md">
          <Image
            src={profilePic}
            alt="Bhimraj Yadav"
            width={300}
            height={300}
            priority
            loading="eager"
            className="rounded-full object-center drop-shadow-sm saturate-100 filter"
          />
          <h1 className="pb-2 pt-4 text-5xl font-semibold text-gray-800">
            Bhimraj Yadav
          </h1>
          <p className="text-lg font-light text-gray-700">
            Software Developer | AI Enthusiast
          </p>
          <small className="py-4 text-gray-500 md:hidden">
            !!! Website Launching Soon !!!
          </small>

          <div className="hidden md:flex">
            <nav className="flex">
              <ul className="grid  grid-cols-3 space-x-2 text-center text-base font-medium text-gray-600 transition-all">
                <li className="cursor-pointer rounded bg-gray-100 px-3 py-2 shadow-sm backdrop-blur hover:bg-gray-100/10 hover:text-gray-700">
                  Home
                </li>
                <li className="cursor-pointer rounded bg-gray-100 px-3 py-2 shadow-sm backdrop-blur hover:bg-gray-100/10 hover:text-gray-700">
                  Blog
                </li>
                <li className="cursor-pointer rounded bg-gray-100 px-3 py-2 shadow-sm backdrop-blur hover:bg-gray-100/10 hover:text-gray-700">
                  Contact
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
