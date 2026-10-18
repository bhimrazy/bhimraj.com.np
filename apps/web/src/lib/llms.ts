import { siteConfig } from "@/config/site";

export type LlmsPost = { title: string; description: string; slug: string };
export type LlmsProject = { title: string; description: string; slug: string };

/**
 * Builds a concise, plain-text index of who Bhimraj is and where to find
 * key pages/posts/projects — the `llms.txt` convention for LLM crawlers.
 * Pure and testable.
 */
export function buildLlmsTxt(input: {
  posts: LlmsPost[];
  projects: LlmsProject[];
}): string {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const lines: string[] = [
    `# ${siteConfig.author.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.author.name} (${siteConfig.author.handle}) is a Software Engineer at Fetchly Labs and a Tier 2 open-source contributor at Lightning AI, working on PyTorch Lightning, LitServe, LitData, and LitGPT. IEEE-published researcher in computer vision and deep learning, based in Kathmandu, Nepal.`,
    "",
    "## Pages",
    "",
    `- [Home](${baseUrl}/): Overview, experience, and highlights.`,
    `- [Open Source](${baseUrl}/oss): OSS contribution history and stats across Lightning AI projects.`,
    `- [Projects](${baseUrl}/projects): Open-source AI projects — multimodal LLMs, model serving, computer vision, dev tools.`,
    `- [Blog](${baseUrl}/blog): Writing on engineering, open source, and AI.`,
    `- [Research](${baseUrl}/research): Academic publications and reading notes.`,
    `- [RSS Feed](${baseUrl}/feed.xml)`,
  ];

  if (input.posts.length > 0) {
    lines.push("", "## Recent Posts", "");
    for (const post of input.posts) {
      lines.push(
        `- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.description}`,
      );
    }
  }

  if (input.projects.length > 0) {
    lines.push("", "## Projects", "");
    for (const project of input.projects) {
      lines.push(
        `- [${project.title}](${baseUrl}/projects/${project.slug}): ${project.description}`,
      );
    }
  }

  lines.push(
    "",
    `Links: GitHub ${siteConfig.links.github} · Twitter ${siteConfig.links.twitter} · LinkedIn ${siteConfig.links.linkedin}`,
  );

  return `${lines.join("\n")}\n`;
}
