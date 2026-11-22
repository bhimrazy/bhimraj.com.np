import { allResources } from "content-collections";
import { notFound } from "next/navigation";
import {
  getLectures,
  getResource,
  totalSeconds,
} from "@/components/resources/resources";
import { KIND_LABELS } from "@/components/resources/taxonomy";
import { formatHours } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "A course on bhimraj.com.np/resources";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allResources
    .filter((r) => r.hasPage)
    .map((r) => ({ slug: r._meta.path }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resource = getResource((await params).slug);
  if (!resource?.hasPage) notFound();
  const lectures = getLectures(resource);
  return ogImage({
    kicker: [KIND_LABELS[resource.kind].one, resource.source, resource.term]
      .filter(Boolean)
      .join(" · "),
    title: resource.title,
    footLeft: "bhimraj.com.np/resources",
    footRight:
      lectures.length > 0
        ? `${lectures.length} lectures · ${formatHours(totalSeconds(lectures))}`
        : undefined,
  });
}
