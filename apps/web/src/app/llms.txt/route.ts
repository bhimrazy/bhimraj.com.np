import { cacheLife } from "next/cache";
import { sortedPosts } from "@/components/blog/posts";
import { getSortedProjects } from "@/components/projects/projects";
import { getPaths } from "@/components/resources/resources";
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

  const paths = getPaths().map((path) => ({
    title: path.title,
    promise: path.promise,
    slug: path.slug,
    steps: path.steps.map((s) => s.resource.title),
  }));

  return buildLlmsTxt({ posts, projects, paths });
}

export async function GET() {
  const text = await getLlmsTxt();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
