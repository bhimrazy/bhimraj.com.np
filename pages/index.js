import Head from "next/head";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Software Developer | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gray-50 w-full container mx-auto px-12">
        <div className="flex flex-row justify-between items-center p-5 ">
          <Link href="/">
            <a title="Bhimraj Yadav" className="font-semibold text-xl">
              Bhimraj
            </a>
          </Link>
          <nav className="">
            <ul className="flex flex-row space-x-4 transition-all duration-500">
              <li className="hover:opacity-80 cursor-pointer">
                <a>Home</a>
              </li>
              <li className="hover:opacity-80 cursor-pointer">
                <a>About</a>
              </li>
              <li className="hover:opacity-80 cursor-pointer">
                <a>Contact</a>
              </li>
            </ul>
          </nav>
          <button className="hidden" title="Menu"></button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}
