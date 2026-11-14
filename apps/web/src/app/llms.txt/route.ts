import { cacheLife } from "next/cache";
import { sortedPosts } from "@/components/blog/posts";
import { getSortedProjects } from "@/components/projects/projects";
import { buildLlmsTxt } from "@/lib/llms";

async function getLlmsTxt() {
  "use cache";
  cacheLife("max"); // content changes only on deploy

  const posts = sortedPosts.slice(0, 15).map((post) => ({
    title: post.title,
    description: post.description,
    slug: post._meta.path,
  }));

  const projects = getSortedProjects().map((project) => ({
    title: project.title,
    description: project.description,
    slug: project._meta.path,
  }));

  return buildLlmsTxt({ posts, projects });
}

export async function GET() {
  const text = await getLlmsTxt();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
