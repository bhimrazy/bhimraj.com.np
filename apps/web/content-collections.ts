import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { Pluggable } from "unified";
import { z } from "zod";
import rehypeArticle from "./src/components/blog/rehype-article";
import rehypeDropDek from "./src/components/mdx/rehype-drop-dek";
import { codeTransformers } from "./src/components/mdx/shiki-transformers";

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
        transformers: codeTransformers,
      },
    ] as Pluggable,
  ],
};

// Blog posts get extra editorial markup (figures, heading anchors, dek).
const blogMarkdownOptions = {
  rehypePlugins: [...markdownOptions.rehypePlugins, rehypeArticle],
};

// The rendered body is MDX so posts can embed interactive figures. The dek is
// shown under the title (read from `html`), so the MDX body drops it.
const blogMdxOptions = {
  rehypePlugins: [...blogMarkdownOptions.rehypePlugins, rehypeDropDek],
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
    // `html` is no longer rendered for posts; it still feeds the dek, TOC,
    // reading time and cover detection. JSX figures are not part of it.
    const html = await compileMarkdown(context, document, blogMarkdownOptions);
    const mdx = await compileMDX(context, document, blogMdxOptions);
    return { ...document, html, mdx };
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
