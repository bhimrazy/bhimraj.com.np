import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMarkdown } from "@content-collections/markdown";

const BlogPost = defineCollection({
  name: "BlogPost",
  directory: "src/content/blog",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    featured: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return {
      ...document,
      html,
    };
  },
});

const Project = defineCollection({
  name: "Project",
  directory: "src/content/projects",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string(),
    githubLink: z.string(),
    featured: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return {
      ...document,
      html,
    };
  },
});

export default defineConfig({
  collections: [BlogPost, Project],
});
