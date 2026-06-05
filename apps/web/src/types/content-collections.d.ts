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
    html: string;
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
