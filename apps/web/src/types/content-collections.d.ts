declare module "content-collections" {
  export interface ContentMeta {
    path: string;
  }

  export interface BlogPost {
    _meta: ContentMeta;
    title: string;
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
  }

  export interface Project {
    _meta: ContentMeta;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    image: string;
    githubLink: string;
    featured: boolean;
    html: string;
  }

  export const allBlogPosts: BlogPost[];
  export const allProjects: Project[];
}
