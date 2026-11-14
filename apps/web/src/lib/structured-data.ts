import { siteConfig } from "@/config/site";

/** Minimal JSON-LD shape: a schema.org `@type` plus arbitrary fields. */
export type JsonLdObject = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

const CONTEXT = "https://schema.org" as const;
const PERSON_ID = `${siteConfig.url}/#person`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** Other blocks point at the Person by `@id` instead of repeating it. */
const personRef = { "@id": PERSON_ID, name: siteConfig.author.name };

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPersonJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.author.name,
    alternateName: siteConfig.author.username,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.author.avatar),
    jobTitle: siteConfig.author.designation,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    sameAs: Object.values(siteConfig.links),
  };
}

export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.author.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": PERSON_ID },
  };
}

type BlogPostingInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  image?: string;
};

export function buildBlogPostingJsonLd(post: BlogPostingInput): JsonLdObject {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    keywords: post.tags?.join(", "),
    image: post.image ? absoluteUrl(post.image) : undefined,
    author: personRef,
    publisher: personRef,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** A flat trail of `{ name, path }` steps ending at the current page. */
export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ScholarlyArticleInput = {
  title: string;
  authors: readonly string[];
  journal: string;
  volume: string;
  pages: readonly [string, string];
  year: string;
  doi: string;
  url: string;
  abstract: string;
};

export function buildScholarlyArticleJsonLd(
  article: ScholarlyArticleInput,
): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "ScholarlyArticle",
    headline: article.title,
    name: article.title,
    abstract: article.abstract,
    datePublished: article.year,
    url: article.url,
    sameAs: `https://doi.org/${article.doi}`,
    pagination: `${article.pages[0]}-${article.pages[1]}`,
    isPartOf: {
      "@type": "PublicationVolume",
      volumeNumber: article.volume,
      isPartOf: { "@type": "Periodical", name: article.journal },
    },
    author: article.authors.map((name) =>
      name === siteConfig.author.name ? personRef : { "@type": "Person", name },
    ),
  };
}

type SoftwareSourceCodeInput = {
  title: string;
  description: string;
  slug: string;
  githubLink?: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
};

export function buildSoftwareSourceCodeJsonLd(
  project: SoftwareSourceCodeInput,
): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    codeRepository: project.githubLink,
    keywords: project.tags?.join(", "),
    datePublished: project.publishedAt,
    dateModified: project.updatedAt || project.publishedAt,
    author: personRef,
  };
}
