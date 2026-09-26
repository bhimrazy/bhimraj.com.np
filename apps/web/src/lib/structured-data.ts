import { siteConfig } from "@/config/site";

/** Minimal JSON-LD shape: a schema.org `@type` plus arbitrary fields. */
export type JsonLdObject = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** `Person` schema for Bhimraj, reused wherever an author needs to be identified. */
export function buildPersonJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    alternateName: siteConfig.author.handle,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.author.avatar),
    jobTitle: siteConfig.author.designation,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
    ],
  };
}

/** `WebSite` schema for the site root, with a `SearchAction` omitted (no site search exists). */
export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { "@type": "Person", name: siteConfig.author.name },
  };
}

export type BlogPostingInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  image?: string;
};

/** `BlogPosting` schema for an individual blog post. */
export function buildBlogPostingJsonLd(post: BlogPostingInput): JsonLdObject {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    keywords: post.tags?.join(", "),
    image: post.image ? absoluteUrl(post.image) : undefined,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };
}

/** `BreadcrumbList` schema — a flat trail of `{ name, path }` steps ending at the current page. */
export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type ScholarlyArticleInput = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  abstract: string;
};

/** `ScholarlyArticle` schema for the IEEE (or similar) publications listed on /research. */
export function buildScholarlyArticleJsonLd(
  article: ScholarlyArticleInput,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    name: article.title,
    abstract: article.abstract,
    datePublished: article.year,
    url: article.doi,
    isPartOf: { "@type": "Periodical", name: article.venue },
    author: article.authors
      .split(",")
      .map((name) => ({ "@type": "Person", name: name.trim() })),
  };
}

export type SoftwareSourceCodeInput = {
  title: string;
  description: string;
  slug: string;
  githubLink: string;
  liveLink?: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  image?: string;
};

/** `SoftwareSourceCode` schema for an individual project page. */
export function buildSoftwareSourceCodeJsonLd(
  project: SoftwareSourceCodeInput,
): JsonLdObject {
  const url = absoluteUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    url,
    codeRepository: project.githubLink,
    ...(project.liveLink ? { discussionUrl: project.liveLink } : {}),
    keywords: project.tags?.join(", "),
    image: project.image ? absoluteUrl(project.image) : undefined,
    datePublished: project.publishedAt,
    dateModified: project.updatedAt || project.publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };
}
