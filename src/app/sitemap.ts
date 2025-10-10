import { siteConfig } from "@/config/site";
import { allBlogPosts, allProjects } from "content-collections";

export default async function sitemap() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  // Get all pages
  const pages = ["", "blog", "projects"];
  const pagesUrls =
    pages.map((page) => {
      return {
        url: `${baseUrl}/${page}`,
        lastModified: new Date(),
      };
    }) ?? [];

  // Get all posts slugs
  const postsUrls =
    allBlogPosts.map((post) => {
      return {
        url: `${baseUrl}/blog/${post._meta.path}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
      };
    }) || [];

  // Get all projects slugs
  const projectsUrls =
    allProjects.map((post) => {
      return {
        url: `${baseUrl}/projects/${post._meta.path}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
      };
    }) ?? [];

  return [...pagesUrls, ...postsUrls, ...projectsUrls];
}
