/**
 * Closed lists for resource entries. The content schema validates against
 * these, so a typo in a file fails the build instead of making a new group.
 */

/** Order here is the order of the groups on /resources. */
export const RESOURCE_KINDS = [
  "course",
  "book",
  "talk",
  "blog",
  "paper",
  "article",
] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export const KIND_LABELS: Record<ResourceKind, { one: string; many: string }> =
  {
    course: { one: "Course", many: "Courses" },
    book: { one: "Book", many: "Books" },
    talk: { one: "Talk", many: "Talks" },
    blog: { one: "Blog", many: "Blogs" },
    paper: { one: "Paper", many: "Papers" },
    article: { one: "Article", many: "Articles" },
  };

export const RESOURCE_TOPICS = [
  "llms",
  "agents",
  "efficient-ai",
  "ml-systems",
  "computer-vision",
  "research-skills",
  "dev-workflow",
  "sre",
  "security",
] as const;
export type ResourceTopic = (typeof RESOURCE_TOPICS)[number];

export const TOPIC_LABELS: Record<ResourceTopic, string> = {
  llms: "LLMs",
  agents: "Agents",
  "efficient-ai": "Efficient AI",
  "ml-systems": "ML systems",
  "computer-vision": "Computer vision",
  "research-skills": "Research skills",
  "dev-workflow": "Dev workflow",
  sre: "SRE",
  security: "Security",
};

export const RESOURCE_STATUSES = [
  "recommended",
  "revisiting",
  "queued",
] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const STATUS_LABELS: Record<ResourceStatus, string> = {
  recommended: "Recommended",
  revisiting: "Revisiting",
  queued: "On my list",
};

/** What a course-material link points to; the page shows its label. */
export const MATERIAL_KINDS = [
  "slides",
  "reading",
  "code",
  "lab",
  "page",
  "exam",
  "doc",
] as const;
export type MaterialKind = (typeof MATERIAL_KINDS)[number];

export const MATERIAL_LABELS: Record<MaterialKind, string> = {
  slides: "Slides",
  reading: "Reading",
  code: "Code",
  lab: "Lab",
  page: "Lecture page",
  exam: "Exam",
  doc: "Document",
};
