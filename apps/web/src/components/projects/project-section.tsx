import { allProjects } from "content-collections";
import type { Project } from "@/lib/types";
import { type ProjectCardData, ProjectGrid } from "./project-grid";

export default function ProjectSection() {
  const projects = [...(allProjects as Project[])].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Pass only what the card needs — the full `html` field stays on the
  // server and never ships to the client bundle.
  const cards: ProjectCardData[] = projects.map((project) => ({
    slug: project._meta.path,
    title: project.title,
    description: project.description,
    tags: project.tags,
    githubLink: project.githubLink,
    liveLink: project.liveLink,
    featured: project.featured,
    category: project.category,
  }));

  return <ProjectGrid projects={cards} />;
}
