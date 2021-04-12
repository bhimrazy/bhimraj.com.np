import Head from "next/head";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center top-0">
      <Head>
        <title>Software Developer | AI Enthusiast | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Bhimraj Yadav" />
      </Head>
      <Header />
      <main className="flex flex-col container mx-auto px-4 sm:px-20">
        <Hero />
      </main>

      <Footer />
    </div>
  );
}
