import { Children, isValidElement, type ReactNode } from "react";
import { WalkthroughClient, type WalkthroughStep } from "./walkthrough-client";

/** One code block plus `<Step lines="1-3" title="…">` children that highlight its lines. */
export function CodeWalkthrough({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  const stepProps: StepProps[] = [];
  const code: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<StepProps>(child) && child.type === Step) {
      stepProps.push(child.props);
    } else if (isValidElement(child)) {
      code.push(child);
    }
  });
  if (stepProps.length === 0) {
    throw new Error(
      '<CodeWalkthrough> needs at least one <Step lines="…" title="…">.',
    );
  }

  // Line numbers are hand-typed, so a step that drifts off the code fails the build.
  const total = lineCount(code);
  const steps: WalkthroughStep[] = stepProps.map((p) => {
    const lines = parseLineRanges(p.lines);
    if (lines.length === 0 || (lines.at(-1) ?? 0) > total) {
      throw new Error(
        `<Step title="${p.title}" lines="${p.lines}"> is outside the ${total}-line code block.`,
      );
    }
    return { lines, title: p.title, content: p.children, aside: p.aside };
  });

  return (
    <WalkthroughClient caption={caption} steps={steps}>
      {code}
    </WalkthroughClient>
  );
}

type StepProps = {
  /** Lines to highlight, e.g. `"1,4-6"`. */
  lines: string;
  title: string;
  /** Optional visual shown next to the step's prose (e.g. a small diagram). */
  aside?: ReactNode;
  children?: ReactNode;
};

/** Marker element read by `<CodeWalkthrough>`; never rendered on its own. */
export function Step(_props: StepProps) {
  return null;
}

/** Highest Shiki `data-line` in the rendered code, i.e. its line count. */
function lineCount(node: ReactNode): number {
  let max = 0;
  Children.forEach(node, (child) => {
    if (!isValidElement<{ children?: ReactNode; "data-line"?: number }>(child))
      return;
    const own = Number(child.props["data-line"] ?? 0);
    max = Math.max(max, own, lineCount(child.props.children));
  });
  return max;
}

/** `"1,4-6"` → `[1, 4, 5, 6]` (1-based line numbers). */
function parseLineRanges(spec: string): number[] {
  const out = new Set<number>();
  for (const part of spec.split(",")) {
    const [a, b] = part.trim().split("-").map(Number);
    if (!Number.isFinite(a)) continue;
    const end = Number.isFinite(b) ? b : a;
    for (let n = a; n <= end; n++) out.add(n);
  }
  return [...out].sort((x, y) => x - y);
}
