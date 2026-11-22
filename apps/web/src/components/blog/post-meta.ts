import GithubSlugger from "github-slugger";
import type { Heading, Nodes, Root } from "mdast";
import { toString as textOf } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

// Type aliases, not interfaces: content-collections only accepts serializable types.
type TocItem = { id: string; text: string; level: number };

/** What the blog pages need besides the rendered body, read from the MDX source. */
type PostMeta = {
  /** A leading `##` heading, shown under the title instead of in the body. */
  dek: string | null;
  toc: TocItem[];
  readingTime: string;
  /** Whether the post's cover image already appears in its body. */
  coverInBody: boolean;
};

const WORDS_PER_MINUTE = 300;
const parser = unified().use(remarkParse).use(remarkMdx);

function leadingDek(tree: Root): Heading | undefined {
  const first = tree.children[0];
  return first?.type === "heading" && first.depth === 2 ? first : undefined;
}

/** Remark plugin: drops the dek from the body, since the page shows it under the title. */
export function remarkDropDek() {
  return (tree: Root) => {
    if (leadingDek(tree)) tree.children.shift();
  };
}

function* walk(node: Nodes): Generator<Nodes> {
  yield node;
  if ("children" in node) {
    for (const child of node.children as Nodes[]) yield* walk(child);
  }
}

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

export function postMeta(content: string, image: string): PostMeta {
  const tree = parser.parse(content);
  const dek = leadingDek(tree);
  // Slug every heading in order, like rehype-slug, so duplicates get the same suffixes.
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let words = 0;
  let coverInBody = false;

  for (const node of walk(tree)) {
    if (node.type === "heading" && node !== dek) {
      const text = textOf(node, { includeImageAlt: false });
      const id = slugger.slug(text);
      if (node.depth === 2 || node.depth === 3) {
        toc.push({
          id,
          text: text.trim().replace(/\s*:$/, ""),
          level: node.depth,
        });
      }
    } else if (
      node.type === "text" ||
      node.type === "inlineCode" ||
      node.type === "code"
    ) {
      words += countWords(node.value);
    } else if (node.type === "image" && node.url === image) {
      coverInBody = true;
    }
  }

  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return {
    dek: dek ? textOf(dek).trim() : null,
    toc,
    readingTime: `${minutes} min read`,
    coverInBody,
  };
}
