const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const COMMENT_ONLY = /^\s*\{\/\*(?:(?!\*\/\})[\s\S])*\*\/\}\s*$/;

/**
 * Drop lines that hold nothing but an MDX comment, such as the FIGURE,
 * SCREENSHOT and VOICE placeholders in drafts. Comments may span several
 * lines; code fences are left alone.
 *
 * The MDX body ignores these comments, but the plain-markdown `html` compile
 * (RSS, TOC, reading time, dek) would print them as text.
 */
export function stripMdxComments(source: string): string {
  const lines = source.split("\n");
  const out: string[] = [];
  let fence: string | null = null;
  let pending: string[] | null = null;

  for (const line of lines) {
    if (pending) {
      pending.push(line);
      if (line.includes("*/}")) {
        // Keep the lines if the comment shares its last line with content.
        if (!COMMENT_ONLY.test(pending.join("\n"))) out.push(...pending);
        pending = null;
      }
      continue;
    }

    const marker = line.match(FENCE)?.[1];
    if (fence) {
      if (marker?.[0] === fence[0] && marker.length >= fence.length) {
        fence = null;
      }
      out.push(line);
      continue;
    }
    if (marker) {
      fence = marker;
      out.push(line);
      continue;
    }

    if (COMMENT_ONLY.test(line)) continue;
    if (/^\s*\{\/\*/.test(line) && !line.includes("*/}")) {
      pending = [line];
      continue;
    }
    out.push(line);
  }

  if (pending) out.push(...pending);
  return out.join("\n");
}
