/**
 * Rehype plugin that upgrades compiled blog markdown into editorial markup:
 *
 * - A leading `<h2>` (before any other content) becomes the article dek,
 *   so it no longer competes with the page title or shows up in the TOC.
 * - `<p><img></p>` becomes `<figure>`; a following "Figure: …" paragraph
 *   becomes its `<figcaption>` (the "Figure:" prefix is rendered by CSS).
 * - h2/h3 headings get a hover/focus permalink anchor.
 * - Tables are wrapped in a horizontally scrollable container.
 * - External links open in a new tab.
 *
 * Only structure changes — the author's words are left untouched.
 * Types are declared locally to avoid depending on `@types/hast` directly.
 */

interface Text {
  type: "text";
  value: string;
}

interface Element {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: Node[];
}

interface Parent {
  type: string;
  children: Node[];
}

type Node = Text | Element | { type: string; children?: Node[] };

const isElement = (node: Node | undefined, tag?: string): node is Element =>
  node?.type === "element" &&
  (tag === undefined || (node as Element).tagName === tag);

const isBlank = (node: Node) =>
  node.type === "text" && (node as Text).value.trim() === "";

const hasChildren = (node: Node): node is Parent =>
  Array.isArray((node as Parent).children);

function textContent(node: Node): string {
  if (node.type === "text") return (node as Text).value;
  if (hasChildren(node)) return node.children.map(textContent).join("");
  return "";
}

/** Index of the next non-whitespace sibling after `index`, or -1. */
function nextContentIndex(children: Node[], index: number) {
  for (let i = index + 1; i < children.length; i++) {
    if (!isBlank(children[i])) return i;
  }
  return -1;
}

const CAPTION_PREFIX = /^\s*figure\s*:\s*/i;

/** Strip a leading "Figure:" from the first text node, unwrapping `<em>`. */
function toCaptionChildren(p: Element): Node[] {
  let children = p.children;
  const only = children.filter((c) => !isBlank(c));
  if (only.length === 1 && isElement(only[0], "em")) {
    children = only[0].children;
  }
  const [first, ...rest] = children;
  if (first?.type === "text") {
    const value = (first as Text).value.replace(CAPTION_PREFIX, "");
    return value ? [{ type: "text", value }, ...rest] : rest;
  }
  return children;
}

function transformFigures(parent: Parent) {
  const { children } = parent;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (!isElement(node, "p")) continue;

    const content = node.children.filter((c) => !isBlank(c));
    const img = content[0];
    if (content.length !== 1 || !isElement(img, "img")) continue;

    img.properties.loading = "lazy";
    img.properties.decoding = "async";

    const figure: Element = {
      type: "element",
      tagName: "figure",
      properties: {},
      children: [img],
    };

    const captionIndex = nextContentIndex(children, i);
    const captionNode = children[captionIndex];
    if (
      isElement(captionNode, "p") &&
      CAPTION_PREFIX.test(textContent(captionNode))
    ) {
      figure.children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: toCaptionChildren(captionNode),
      });
      children.splice(i, captionIndex - i + 1, figure);
    } else {
      children[i] = figure;
    }
  }
}

function transformDek(root: Parent) {
  const firstIndex = root.children.findIndex((c) => !isBlank(c));
  const first = root.children[firstIndex];
  if (!isElement(first, "h2")) return;
  first.tagName = "p";
  first.properties = { className: ["article-dek"] };
}

function walk(node: Node, visit: (el: Element, parent: Parent) => void) {
  if (!hasChildren(node)) return;
  // Copy: visitors may replace children in place.
  for (const child of [...node.children]) {
    if (isElement(child)) visit(child, node);
    walk(child, visit);
  }
}

export default function rehypeArticle() {
  return (tree: Parent) => {
    transformDek(tree);
    transformFigures(tree);

    walk(tree, (el, parent) => {
      const id = el.properties.id;
      if ((el.tagName === "h2" || el.tagName === "h3") && id) {
        el.children.push({
          type: "element",
          tagName: "a",
          properties: {
            className: ["heading-anchor"],
            href: `#${id}`,
            ariaLabel: `Link to section: ${textContent(el).trim()}`,
          },
          children: [],
        });
      }

      if (el.tagName === "table") {
        const index = parent.children.indexOf(el);
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrap"], tabIndex: 0 },
          children: [el],
        };
      }

      const href = el.properties.href;
      if (el.tagName === "a" && typeof href === "string") {
        if (/^https?:\/\//.test(href) && !href.includes("bhimraj.com.np")) {
          el.properties.target = "_blank";
          el.properties.rel = ["noopener", "noreferrer"];
        }
      }
    });
  };
}
