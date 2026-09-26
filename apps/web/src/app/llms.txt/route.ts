import { allBlogPosts, allProjects } from "content-collections";
import { cacheLife } from "next/cache";
import { buildLlmsTxt } from "@/lib/llms";

async function getLlmsTxt() {
  "use cache";
  cacheLife("hours");

  const posts = [...allBlogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 15)
    .map((post) => ({
      title: post.title,
      description: post.description,
      slug: post._meta.path,
    }));

  const projects = allProjects.map((project) => ({
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
