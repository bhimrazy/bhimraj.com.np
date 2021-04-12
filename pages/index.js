import Head from "next/head";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
import { NextSeo } from "next-seo";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center top-0">
      <Head>
        <title>Software Developer | AI Enthusiast | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Bhimraj Yadav" />
      </Head>
      <NextSeo
        title="Software Developer | AI Enthusiast | Bhimraj Yadav"
        description="Software Developer | AI Enthusiast | Bhimraj Yadav."
        canonical="https://www.bhimraj.com.np"
        openGraph={{
          url: "https://www.bhimraj.com.np",
          title: "Software Developer | AI Enthusiast | Bhimraj Yadav",
          description: "Software Developer | AI Enthusiast | Bhimraj Yadav",
          images: [
            {
              url: "http://www.bhimraj.com.np/bhimraj.com.np.png",
              width: 1920,
              height: 1323,
              alt: "Bhimraj Yadav",
            },
            {
              url: "http://www.bhimraj.com.np/bhimraj.com.np.png",
              width: 1920,
              height: 1323,
              alt: "Bhimraj Yadav",
            },
          ],
          site_name: "Bhimraj Yadav",
        }}
        twitter={{
          handle: "@bhimrazyadav",
          site: "https://www.twitter.com",
          cardType: "summary_large_image",
        }}
      />
      <Header />
      <main className="flex flex-col container mx-auto px-4 sm:px-20">
        <Hero />
      </main>

      <Footer />
    </div>
  );
}
