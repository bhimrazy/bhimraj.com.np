import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { Pluggable } from "unified";
import { z } from "zod";
import { feedHtml } from "./src/components/blog/feed-html";
import { postMeta, remarkDropDek } from "./src/components/blog/post-meta";
import rehypeArticle from "./src/components/blog/rehype-article";
import { codeTransformers } from "./src/components/mdx/shiki-transformers";
import {
  MATERIAL_KINDS,
  RESOURCE_KINDS,
  RESOURCE_STATUSES,
  RESOURCE_TOPICS,
} from "./src/components/resources/taxonomy";

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
    /** Search title and description when the on-page ones run long. */
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, blogMdxOptions);
    return {
      ...document,
      ...postMeta(document.content, document.image),
      mdx,
      feedHtml: feedHtml(mdx, `/blog/${document._meta.path}`),
    };
  },
});

const Project = defineCollection({
  name: "Project",
  directory: "src/content/projects",
  include: "*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    /** Search title and description when the on-page ones run long. */
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string(),
    githubLink: z.string().optional(),
    liveLink: z.string().optional(),
    /** CTA text for `liveLink`; see `liveLabel()` for the default. */
    liveLabel: z.string().optional(),
    featured: z.boolean().default(false),
    category: z.enum([
      "Developer Tools",
      "Multimodal LLMs",
      "Model Serving",
      "Computer Vision & Medical AI",
    ]),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, { rehypePlugins });
    return { ...document, html };
  },
});

const Resource = defineCollection({
  name: "Resource",
  directory: "src/content/resources",
  include: "*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    url: z.url(),
    kind: z.enum(RESOURCE_KINDS),
    /** Institution or publisher, e.g. "Stanford". */
    source: z.string(),
    /** Instructors or authors, as the source names them. */
    people: z.array(z.string()).default([]),
    /** The offering linked to, e.g. "Fall 2026" or "2017". */
    term: z.string().optional(),
    /** One factual sentence on what it covers. */
    tldr: z.string(),
    topics: z.array(z.enum(RESOURCE_TOPICS)).min(1),
    /** ISO date it went on the list; newest sort first within a group. */
    added: z.iso.date(),
    status: z.enum(RESOURCE_STATUSES).optional(),
    /** One line in my own words on why it's here. */
    note: z.string().optional(),
    /** Lecture or talk recordings are public. */
    video: z.boolean().default(false),
    featured: z.boolean().default(false),
    // Course pages (/resources/[slug]). An entry gets one when it has a
    // playlist or notes in its body.
    /** YouTube playlist ID; `bun run sync:youtube` fetches its lectures. */
    playlist: z.string().optional(),
    /** "playlist" keeps YouTube's order instead of sorting by upload date. */
    playlistOrder: z.enum(["published", "playlist"]).default("published"),
    /** How many lectures I've watched, shown as my progress. */
    watched: z.number().int().nonnegative().optional(),
    /** Who it suits, and when to skip it, in a sentence each. */
    forWho: z.string().optional(),
    skipIf: z.string().optional(),
    prereqs: z.array(z.string()).default([]),
    /** Earlier offerings, newest first. */
    otherTerms: z
      .array(z.object({ term: z.string(), url: z.url() }))
      .default([]),
    /**
     * Links to what the course publishes (slides, readings, labs). Links
     * only, never copies. `lecture` is the position in the lecture list,
     * counting from 1; leave it out for course-wide links.
     */
    materials: z
      .array(
        z.object({
          kind: z.enum(MATERIAL_KINDS),
          url: z.url(),
          lecture: z.number().int().positive().optional(),
          /** Defaults to the kind's label; readings fall back to their source. */
          label: z.string().optional(),
        }),
      )
      .default([]),
  }),
  transform: async (document, context) => {
    const notes = document.content.trim()
      ? await compileMarkdown(context, document, { rehypePlugins })
      : null;
    return { ...document, notes, hasPage: Boolean(document.playlist || notes) };
  },
});

/**
 * A route through resources in an order I chose. `getPaths()` checks each
 * step's slug against the resources, so a typo fails the build.
 */
const LearningPath = defineCollection({
  name: "LearningPath",
  directory: "src/content/paths",
  include: "*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    /** One sentence on where the path gets you. */
    promise: z.string(),
    forWho: z.string(),
    /** Position on /resources, lowest first. */
    order: z.number().int().default(100),
    steps: z
      .array(
        z.object({
          /** A resource's file name, without `.md`. */
          resource: z.string(),
          /** One line on why it comes at this point. */
          why: z.string(),
        }),
      )
      .min(2),
  }),
  transform: async (document, context) => {
    const intro = document.content.trim()
      ? await compileMarkdown(context, document, { rehypePlugins })
      : null;
    return { ...document, intro };
  },
});

export default defineConfig({
  content: [BlogPost, Project, Resource, LearningPath],
});
