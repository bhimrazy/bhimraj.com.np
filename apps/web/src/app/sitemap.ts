import { allBlogPosts, allProjects } from "content-collections";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Static, non-content routes. `lastModified` is omitted for pages whose
 * content doesn't change on a knowable cadence — using `new Date()` here
 * would mark every page "modified" on every build/crawl, which is
 * misleading to search engines. Add a new page by appending an entry;
 * give it a `lastModified` only if you have a real date for it.
 */
const STATIC_PAGES: { path: string; lastModified?: Date }[] = [
  { path: "" },
  { path: "blog" },
  { path: "projects" },
  { path: "oss" },
  { path: "research" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const staticUrls = STATIC_PAGES.map(({ path, lastModified }) => ({
    url: `${baseUrl}/${path}`,
    ...(lastModified ? { lastModified } : {}),
  }));

  const postUrls = allBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post._meta.path}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
  }));

  const projectUrls = allProjects.map((project) => ({
    url: `${baseUrl}/projects/${project._meta.path}`,
    lastModified: new Date(project.updatedAt || project.publishedAt),
  }));

  return [...staticUrls, ...postUrls, ...projectUrls];
}
