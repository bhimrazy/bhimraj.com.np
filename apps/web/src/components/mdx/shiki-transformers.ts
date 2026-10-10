import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

type ShikiTransformer = ReturnType<typeof transformerMetaHighlight>;

/** `title="unet.py"` (or single quotes) in a code fence's meta string. */
function parseTitle(meta: string | undefined): string | null {
  const match = meta?.match(/\btitle=(?:"([^"]*)"|'([^']*)')/);
  return match ? (match[1] ?? match[2] ?? null) : null;
}

/** Adds 1-based `data-line` to every line and wraps `title="…"` blocks in a titled frame. */
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

/** Every code block: `{1,4-6}` line highlights, `[!code …]` notations, `title="…"` filename bar. */
export const codeTransformers: ShikiTransformer[] = [
  transformerMetaHighlight(),
  transformerNotationHighlight(),
  transformerNotationFocus(),
  transformerNotationDiff(),
  transformerNotationErrorLevel(),
  transformerCodeFrame(),
];
