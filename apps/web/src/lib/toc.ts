import type { TocItem } from "@/components/blog/toc";

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** Decode the handful of HTML entities rehype emits in heading text. */
function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const hex = code[1]?.toLowerCase() === "x";
      const n = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Extract h2/h3 headings with their IDs from compiled HTML. */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop pattern
  while ((match = regex.exec(html)) !== null) {
    const level = Number.parseInt(match[1], 10);
    const id = match[2];
    // Strip inner HTML tags (incl. the empty permalink anchor), decode
    // entities, and drop trailing colons like "References:".
    const text = decodeEntities(match[3].replace(/<[^>]+>/g, ""))
      .trim()
      .replace(/\s*:$/, "");
    if (id && text) {
      items.push({ id, text, level });
    }
  }

  return items;
}
