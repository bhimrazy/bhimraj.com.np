import HeroSection from 'src/components/homepage/hero_section'
import ProjectSection from 'src/components/homepage/project_section'
import VideoSection from 'src/components/homepage/video_section'
import Layout from 'src/components/layout'

export default function Home() {
  
  return (
    <Layout>
      <main className="flex flex-col px-4 xl:px-0 space-y-2 w-full max-w-5xl mx-auto">
        <HeroSection/>
        <VideoSection/>
        <ProjectSection/>
      </main>
    </Layout>
  )
}
