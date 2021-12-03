import HeroSection from 'src/components/homepage/hero_section'
import Layout from 'src/components/layout'

export default function Home() {
  
  return (
    <Layout>
      <main className="flex flex-col px-4 xl:px-0 w-full max-w-5xl mx-auto">
        <HeroSection/>
      </main>
    </Layout>
  )
}
