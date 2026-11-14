import { allProjects } from "content-collections";
import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Project by Bhimraj Yadav";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project._meta.path }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path === slug);
  if (!project) notFound();
  return ogImage({
    kicker: project.category,
    title: project.title,
    footLeft: "bhimraj.com.np/projects",
    footRight: project.tags.slice(0, 3).join(" · "),
  });
}
