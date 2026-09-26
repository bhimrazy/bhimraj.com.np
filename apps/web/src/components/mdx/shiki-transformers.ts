import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

type ShikiTransformer = ReturnType<typeof transformerMetaHighlight>;

/** `title="unet.py"` (or single quotes) in a code fence's meta string. */
export function parseTitle(meta: string | undefined): string | null {
  const match = meta?.match(/\btitle=(?:"([^"]*)"|'([^']*)')/);
  return match ? (match[1] ?? match[2] ?? null) : null;
}

/**
 * - Numbers every line (`data-line`, 1-based) so figures such as
 *   `<CodeWalkthrough>` can target lines with CSS.
 * - Wraps blocks that have a `title="…"` meta in a titled frame.
 */
function transformerCodeFrame(): ShikiTransformer {
  return {
    name: "site:code-frame",
    line(node, line) {
      node.properties["data-line"] = line;
    },
    root(root) {
      const title = parseTitle(this.options.meta?.__raw);
      const pre = root.children.find((node) => node.type === "element");
      if (!title || pre?.type !== "element") return;
      root.children = [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["code-block"] },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: { className: ["code-block-title"] },
              children: [{ type: "text", value: title }],
            },
            pre,
          ],
        },
      ];
    },
  };
}

/**
 * Shared by every code block on the site:
 * - ```` ```python {1,4-6} ```` highlights lines from the meta string,
 * - `# [!code highlight]`, `[!code focus]`, `[!code ++]` / `[!code --]`,
 *   `[!code error]` / `[!code warning]` comments work inside the code,
 * - ```` ```python title="unet.py" ```` adds a filename bar.
 */
export const codeTransformers: ShikiTransformer[] = [
  transformerMetaHighlight(),
  transformerNotationHighlight(),
  transformerNotationFocus(),
  transformerNotationDiff(),
  transformerNotationErrorLevel(),
  transformerCodeFrame(),
];
