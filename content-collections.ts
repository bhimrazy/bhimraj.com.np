import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { Pluggable } from "unified";
import { z } from "zod";

const markdownOptions = {
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeShiki,
      {
        themes: {
          dark: "github-dark",
          light: "github-light",
        },
        defaultColor: false,
      },
    ] as Pluggable,
  ],
};

const BlogPost = defineCollection({
  name: "BlogPost",
  directory: "src/content/blog",
  include: "*.mdx",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, markdownOptions);
    return { ...document, html };
  },
});

const Project = defineCollection({
  name: "Project",
  directory: "src/content/projects",
  include: "*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string(),
    githubLink: z.string(),
    liveLink: z.string().optional(),
    featured: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, markdownOptions);
    return {
      ...document,
      html,
      liveLink: document.liveLink,
      updatedAt: document.updatedAt,
    };
  },
});

export default defineConfig({
  content: [BlogPost, Project],
});
