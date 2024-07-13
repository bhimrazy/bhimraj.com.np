import ProjectSection from "@/components/projects/project-section";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | " + siteConfig.name,
  description: "This is the projects page where you can find some of my recent projects with all the details.",
  alternates: {
    canonical: "/projects",
  }
}
export default function Projects() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2 lg:left-3/4"></div>
      <ProjectSection />
    </main>
  );
}