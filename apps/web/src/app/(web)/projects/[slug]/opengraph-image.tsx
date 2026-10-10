import { allProjects } from "content-collections";
import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

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

  return renderOgImage({
    eyebrow: "Project",
    title: project.title,
    tags: project.tags,
  });
}
