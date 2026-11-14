import { withUtm } from "./link-utils";
import { ProjectCover } from "./project-cover";
import { type ProjectCardData, ProjectGrid } from "./project-grid";
import { getRepoStats, getSortedProjects, liveLabel } from "./projects";

export default function ProjectSection() {
  // Only card fields cross to the client; `html` stays server-side.
  const cards: ProjectCardData[] = getSortedProjects().map((project) => ({
    slug: project._meta.path,
    title: project.title,
    description: project.description,
    publishedAt: project.publishedAt,
    tags: project.tags,
    category: project.category,
    featured: project.featured,
    githubLink: project.githubLink && withUtm(project.githubLink),
    liveLink: project.liveLink && withUtm(project.liveLink),
    liveLabel: liveLabel(project),
    stats: getRepoStats(project.githubLink),
    cover: (
      <ProjectCover
        slug={project._meta.path}
        className="border-site-border border-b dark:border-white/5"
      />
    ),
  }));

  return <ProjectGrid projects={cards} />;
}
