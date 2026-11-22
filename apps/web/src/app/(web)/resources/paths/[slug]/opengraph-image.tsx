import { allLearningPaths } from "content-collections";
import { notFound } from "next/navigation";
import { getPath } from "@/components/resources/resources";
import { formatHours } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "A learning path on bhimraj.com.np/resources";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allLearningPaths.map((p) => ({ slug: p._meta.path }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const path = getPath((await params).slug);
  if (!path) notFound();
  return ogImage({
    kicker: `Learning path · ${path.steps.length} steps`,
    title: path.title,
    footLeft: "bhimraj.com.np/resources",
    footRight:
      path.totalSec > 0
        ? `${formatHours(path.totalSec)} of lectures`
        : undefined,
  });
}
