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
    /** Compiled markdown; feeds the dek, TOC and reading time. */
    html: string;
    /** Compiled MDX body (rendered with `<MDXContent>`). */
    mdx: string;
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
    liveLink?: string;
    featured: boolean;
    category:
      | "Multimodal LLMs"
      | "Model Serving"
      | "Computer Vision & Medical AI";
    html: string;
  }

  export const allBlogPosts: BlogPost[];
  export const allProjects: Project[];
}
