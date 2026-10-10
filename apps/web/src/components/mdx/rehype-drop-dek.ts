/** Removes the dek from the MDX body; the page already shows it under the title. */

interface Node {
  type: string;
  tagName?: string;
  properties?: { className?: unknown };
  children?: Node[];
  value?: string;
}

const isBlank = (node: Node) =>
  node.type === "text" && (node.value ?? "").trim() === "";

export default function rehypeDropDek() {
  return (tree: Node) => {
    const children = tree.children ?? [];
    const index = children.findIndex((c) => !isBlank(c));
    const first = children[index];
    const className = first?.properties?.className;
    if (
      first?.tagName === "p" &&
      Array.isArray(className) &&
      className.includes("article-dek")
    ) {
      children.splice(index, 1);
    }
  };
}
