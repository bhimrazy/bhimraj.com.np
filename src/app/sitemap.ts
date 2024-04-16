import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/blog-api";
import { getProjects } from "@/lib/info";

export default async function sitemap() {
    const baseUrl = siteConfig.url;
    // Get all pages 
    const pages = [
        "",
        "blog",
        "projects",
    ];
    const pagesUrls =
        pages.map((page) => {
            return {
                url: `${baseUrl}/${page}`,
                lastModified: new Date(),
            };
        }) ?? [];

    // Get all posts slugs
    const postsUrls = getPosts().map((post) => {
        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.data?.updated_at || post.data?.published_at),
        };
    }) || [];

    // Get all projects slugs
    const projectsUrls = getProjects().map((post) => {
        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.data?.updated_at || post.data?.published_at),
        };
    }) ?? [];

    return [
        ...pagesUrls,
        ...postsUrls,
        ...projectsUrls
    ];
}