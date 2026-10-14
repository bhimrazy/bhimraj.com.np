import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { Pluggable } from "unified";
import { z } from "zod";
import { postMeta, remarkDropDek } from "./src/components/blog/post-meta";
import rehypeArticle from "./src/components/blog/rehype-article";
import { codeTransformers } from "./src/components/mdx/shiki-transformers";

const rehypePlugins: Pluggable[] = [
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
  ],
];

// Blog posts get extra editorial markup (figures, heading anchors); the dek
// shows under the title, so the body drops it.
const blogMdxOptions = {
  remarkPlugins: [remarkDropDek],
  rehypePlugins: [...rehypePlugins, rehypeArticle],
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
    const mdx = await compileMDX(context, document, blogMdxOptions);
    return { ...document, ...postMeta(document.content, document.image), mdx };
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
    const html = await compileMarkdown(context, document, { rehypePlugins });
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
