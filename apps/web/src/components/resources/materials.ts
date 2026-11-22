import type { Resource } from "content-collections";
import { MATERIAL_LABELS } from "./taxonomy";

export type MaterialLink = { label: string; url: string };

/** "arXiv:1706.03762" for arXiv links, else the site name. */
function sourceLabel(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    const arxiv = pathname.match(/^\/abs\/(.+)$/);
    if (hostname === "arxiv.org" && arxiv) return `arXiv:${arxiv[1]}`;
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function materialLabel(m: Resource["materials"][number]): string {
  if (m.label) return m.label;
  if (m.kind === "reading")
    return sourceLabel(m.url) ?? MATERIAL_LABELS.reading;
  return MATERIAL_LABELS[m.kind];
}

/** Links for each lecture (by 1-based position) and the course-wide rest. */
export function groupMaterials(materials: Resource["materials"]): {
  byLecture: Map<number, MaterialLink[]>;
  general: MaterialLink[];
} {
  const byLecture = new Map<number, MaterialLink[]>();
  const general: MaterialLink[] = [];
  for (const m of materials) {
    const link = { label: materialLabel(m), url: m.url };
    if (m.lecture === undefined) general.push(link);
    else byLecture.set(m.lecture, [...(byLecture.get(m.lecture) ?? []), link]);
  }
  return { byLecture, general };
}
