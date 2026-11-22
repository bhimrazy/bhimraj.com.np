import { allBlogPosts, allProjects } from "content-collections";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// No lastModified: `new Date()` would mark every page changed on each build.
const STATIC_PAGES = ["", "blog", "projects", "oss", "research", "resources"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const staticUrls = STATIC_PAGES.map((path) => ({
    url: `${baseUrl}/${path}`,
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
