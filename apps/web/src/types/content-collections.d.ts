declare module "content-collections" {
  export interface ContentMeta {
    path: string;
  }

  export interface BlogPost {
    _meta: ContentMeta;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    image: string;
    featured: boolean;
    /** Compiled MDX body (rendered with `<MDXContent>`). */
    mdx: string;
    /** From `postMeta()` in `components/blog/post-meta.ts`. */
    dek: string | null;
    toc: { id: string; text: string; level: number }[];
    readingTime: string;
    coverInBody: boolean;
    /** Body as static HTML for the RSS feed; figures link to the post. */
    feedHtml: string;
  }

  export interface Project {
    _meta: ContentMeta;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    image: string;
    githubLink?: string;
    liveLink?: string;
    liveLabel?: string;
    featured: boolean;
    category:
      | "Developer Tools"
      | "Multimodal LLMs"
      | "Model Serving"
      | "Computer Vision & Medical AI";
    html: string;
  }

  export interface Resource {
    _meta: ContentMeta;
    content: string;
    title: string;
    url: string;
    kind: import("@/components/resources/taxonomy").ResourceKind;
    source: string;
    people: string[];
    term?: string;
    tldr: string;
    topics: import("@/components/resources/taxonomy").ResourceTopic[];
    added: string;
    status?: import("@/components/resources/taxonomy").ResourceStatus;
    note?: string;
    video: boolean;
    featured: boolean;
    playlist?: string;
    playlistOrder: "published" | "playlist";
    watched?: number;
    forWho?: string;
    skipIf?: string;
    prereqs: string[];
    otherTerms: { term: string; url: string }[];
    materials: {
      kind: import("@/components/resources/taxonomy").MaterialKind;
      url: string;
      lecture?: number;
      label?: string;
    }[];
    /** The body as HTML: my notes on the course, or null when empty. */
    notes: string | null;
    hasPage: boolean;
  }

  export interface LearningPath {
    _meta: ContentMeta;
    content: string;
    title: string;
    promise: string;
    forWho: string;
    order: number;
    steps: { resource: string; why: string }[];
    /** The body as HTML, or null when empty. */
    intro: string | null;
  }

  export const allBlogPosts: BlogPost[];
  export const allProjects: Project[];
  export const allResources: Resource[];
  export const allLearningPaths: LearningPath[];
}
