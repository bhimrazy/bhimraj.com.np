import Head from "next/head";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center top-0">
      <Head>
        <title>Software Developer | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-col container mx-auto px-20">
        <Hero />
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
