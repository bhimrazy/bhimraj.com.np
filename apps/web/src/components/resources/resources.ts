import { allResources, type Resource } from "content-collections";

/** The fields a card needs; the markdown body stays on the server. */
export type ResourceCardData = Omit<Resource, "_meta" | "content"> & {
  slug: string;
};

/** Featured first, then newest added. */
export function getSortedResources(): Resource[] {
  return [...allResources].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || b.added.localeCompare(a.added),
  );
}

export function toCardData(resource: Resource): ResourceCardData {
  const { _meta, content: _, ...rest } = resource;
  return { ...rest, slug: _meta.path };
}
