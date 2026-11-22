export const siteConfig = {
  name: "Bhimraj Yadav – Software Engineer & OSS Contributor",
  author: {
    handle: "@bhimrazy",
    username: "bhimrazy",
    name: "Bhimraj Yadav",
    designation: "Software Engineer",
    avatar: "/bhimraj-yadav-avatar.webp",
    /** Larger photo for structured data and other sites. */
    photo: "/bhimraj-yadav.jpg",
  },
  url: "https://bhimraj.com.np",
  description:
    "Software Engineer at Fetchly Labs and Tier 2 OSS contributor at Lightning AI. Writing about engineering, open source, and AI from Kathmandu, Nepal.",
  links: {
    twitter: "https://twitter.com/bhimrazy",
    github: "https://github.com/bhimrazy",
    linkedin: "https://www.linkedin.com/in/bhimrazy",
    youtube: "https://www.youtube.com/@bhimrajyadav",
    lightning: "https://lightning.ai/bhimrajyadav",
  },
  utmParams: "utm_source=bhimraj.com.np&utm_medium=referral",
  /** giscus: IDs come from the GitHub GraphQL API (repository, discussionCategories). */
  comments: {
    repo: "bhimrazy/bhimraj.com.np" as `${string}/${string}`,
    repoId: "MDEwOlJlcG9zaXRvcnkzNDIzMjM3NDU=",
    category: "General",
    categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNjEyMzg3",
  },
};
