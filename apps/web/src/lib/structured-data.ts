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

type ResourceInput = {
  title: string;
  url: string;
  kind: string;
  source: string;
  people: string[];
  tldr: string;
};

/** Talks stay CreativeWork: a VideoObject without thumbnail and date fails validation. */
const RESOURCE_TYPES: Record<string, string> = {
  course: "Course",
  book: "Book",
  paper: "ScholarlyArticle",
  article: "Article",
};

/** /resources as a CollectionPage whose main entity lists every entry. */
export function buildResourceCollectionJsonLd(input: {
  path: string;
  name: string;
  description: string;
  resources: ResourceInput[];
}): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: { "@id": WEBSITE_ID },
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.resources.length,
      itemListElement: input.resources.map((r, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: resourceItem(r),
      })),
    },
  };
}

function resourceItem(r: ResourceInput) {
  return {
    "@type": RESOURCE_TYPES[r.kind] ?? "CreativeWork",
    name: r.title,
    url: r.url,
    description: r.tldr,
    ...(r.kind === "course"
      ? { provider: { "@type": "Organization", name: r.source } }
      : { publisher: { "@type": "Organization", name: r.source } }),
    ...(r.people.length > 0 && {
      [r.kind === "course" ? "instructor" : "author"]: r.people.map((name) => ({
        "@type": "Person",
        name,
      })),
    }),
  };
}

/** A learning path: an ordered ItemList of its steps, in the order to take them. */
export function buildLearningPathJsonLd(path: {
  slug: string;
  title: string;
  promise: string;
  steps: ResourceInput[];
}): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: path.title,
    description: path.promise,
    url: absoluteUrl(`/resources/paths/${path.slug}`),
    author: personRef,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: path.steps.length,
    itemListElement: path.steps.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: resourceItem(r),
    })),
  };
}

const PROVIDERS: [prefix: string, name: string][] = [
  ["Stanford", "Stanford University"],
  ["MIT", "Massachusetts Institute of Technology"],
  ["Harvard", "Harvard University"],
  ["Google", "Google"],
];

// `source` may be a format, not an institution: no provider then.
function providerName(source: string): string | undefined {
  return PROVIDERS.find(([prefix]) => source.startsWith(prefix))?.[1];
}

/** A course page: the course itself, offered online as recorded lectures. */
export function buildCourseJsonLd(course: {
  title: string;
  tldr: string;
  slug: string;
  url: string;
  source: string;
  people: string[];
  term?: string;
  totalSec: number;
}): JsonLdObject {
  const instructor = course.people.map((name) => ({ "@type": "Person", name }));
  const provider = providerName(course.source);
  return {
    "@context": CONTEXT,
    "@type": "Course",
    name: course.title,
    description: course.tldr,
    url: absoluteUrl(`/resources/${course.slug}`),
    sameAs: course.url,
    ...(provider && { provider: { "@type": "Organization", name: provider } }),
    ...(instructor.length > 0 && { instructor }),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      ...(course.term && { name: course.term }),
      ...(course.totalSec > 0 && {
        courseWorkload: `PT${Math.round(course.totalSec / 3600)}H`,
      }),
      ...(instructor.length > 0 && { instructor }),
    },
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
