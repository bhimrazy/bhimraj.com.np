import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

type ShikiTransformer = ReturnType<typeof transformerMetaHighlight>;
type HastElement = Parameters<NonNullable<ShikiTransformer["line"]>>[0];

/** `title="unet.py"` (or single quotes) in a code fence's meta string. */
function parseTitle(meta: string | undefined): string | null {
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

const CONSOLE_LANGS = new Set(["console", "shellsession"]);

const lineText = (node: HastElement): string =>
  node.children
    .map((child) =>
      child.type === "text"
        ? child.value
        : child.type === "element"
          ? lineText(child)
          : "",
    )
    .join("");

/** Move a leading "$ " out of the line's first token into its own span. */
function splitPrompt(line: HastElement) {
  const first = line.children.find((c) => c.type === "element");
  if (first?.type !== "element") return;
  const text = first.children[0];
  if (text?.type !== "text") return;

  const prompt = text.value.match(/^\$ ?/)?.[0];
  if (!prompt) return;
  text.value = text.value.slice(prompt.length);
  const promptSpan: HastElement = {
    type: "element",
    tagName: "span",
    properties: { className: ["prompt"], "aria-hidden": "true" },
    children: [{ type: "text", value: prompt }],
  };
  const index = line.children.indexOf(first);
  // Replace the token if the prompt was all of it, else insert before it.
  line.children.splice(index, text.value ? 0 : 1, promptSpan);
}

/**
 * ```` ```console ```` / ```` ```shellsession ````: lines that start with
 * `$ ` are commands, and so are the lines a trailing `\` continues; the rest
 * is output. The prompt moves into an unselectable `.prompt` span and lines
 * get `.command` (plus `.continuation`) or `.output`, so the copy button can
 * copy just the commands.
 */
function transformerConsole(): ShikiTransformer {
  let continued = false;
  return {
    name: "site:console",
    preprocess() {
      continued = false;
    },
    pre(node) {
      if (CONSOLE_LANGS.has(this.options.lang)) {
        this.addClassToHast(node, "console");
      }
    },
    line(node) {
      if (!CONSOLE_LANGS.has(this.options.lang)) return;
      const text = lineText(node);
      const isPrompt = /^\$(\s|$)/.test(text);
      if (isPrompt) {
        this.addClassToHast(node, "command");
        splitPrompt(node);
      } else if (continued) {
        this.addClassToHast(node, ["command", "continuation"]);
      } else {
        this.addClassToHast(node, "output");
      }
      continued = (isPrompt || continued) && /\\\s*$/.test(text);
    },
  };
}

/**
 * Shared by every code block on the site:
 * - ```` ```python {1,4-6} ```` highlights lines from the meta string,
 * - `# [!code highlight]`, `[!code focus]`, `[!code ++]` / `[!code --]`,
 *   `[!code error]` / `[!code warning]` comments work inside the code,
 * - ```` ```python title="unet.py" ```` adds a filename bar,
 * - ```` ```console ```` separates `$ ` prompts, commands and output.
 */
export const codeTransformers: ShikiTransformer[] = [
  transformerMetaHighlight(),
  transformerNotationHighlight(),
  transformerNotationFocus(),
  transformerNotationDiff(),
  transformerNotationErrorLevel(),
  transformerConsole(),
  transformerCodeFrame(),
];
