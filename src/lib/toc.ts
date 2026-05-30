import type { TocItem } from "@/components/blog/toc";

/** Extract h2/h3 headings with their IDs from compiled HTML. */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop pattern
  while ((match = regex.exec(html)) !== null) {
    const level = Number.parseInt(match[1], 10);
    const id = match[2];
    // Strip inner HTML tags to get plain text
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (id && text) {
      items.push({ id, text, level });
    }
  }

  return items;
}
