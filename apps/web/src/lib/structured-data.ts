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

/** Google doesn't follow `@id` across pages, so refs stay self-describing. */
const personRef = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.author.name,
  url: siteConfig.url,
};

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The home page as a ProfilePage about the Person (Google's profile markup). */
export function buildProfilePageJsonLd(): JsonLdObject {
  const { "@context": _, ...person } = buildPersonJsonLd();
  return {
    "@context": CONTEXT,
    "@type": "ProfilePage",
    url: siteConfig.url,
    mainEntity: person,
  };
}

function buildPersonJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": PERSON_ID,
    description: siteConfig.description,
    name: siteConfig.author.name,
    alternateName: siteConfig.author.username,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.author.photo),
    jobTitle: siteConfig.author.designation,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    worksFor: { "@type": "Organization", name: "Fetchly Labs" },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kathford International College of Engineering and Management",
    },
    knowsAbout: [
      "PyTorch Lightning",
      "LitServe",
      "LitData",
      "LitGPT",
      "Computer vision",
      "Deep learning",
      "Python",
    ],
    sameAs: Object.values(siteConfig.links),
  };
}

/** /about as an AboutPage; the full Person lives on the homepage's ProfilePage. */
export function buildAboutPageJsonLd(description: string): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "AboutPage",
    url: absoluteUrl("/about"),
    name: `About ${siteConfig.author.name}`,
    description,
    mainEntity: personRef,
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
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
