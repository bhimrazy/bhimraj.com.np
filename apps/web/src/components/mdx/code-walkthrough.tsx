import { Children, isValidElement, type ReactNode } from "react";
import { WalkthroughClient, type WalkthroughStep } from "./walkthrough-client";

/**
 * A code walkthrough: one code block, several `<Step>`s that each highlight
 * some of its lines.
 *
 * ```mdx
 * <CodeWalkthrough caption="…">
 *
 * ```python
 * …
 * ```
 *
 * <Step lines="1-3" title="Encode">Prose for this step.</Step>
 * <Step lines="5,7-9" title="Decode">…</Step>
 *
 * </CodeWalkthrough>
 * ```
 */
export function CodeWalkthrough({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  const steps: WalkthroughStep[] = [];
  const code: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<StepProps>(child) && child.type === Step) {
      steps.push({
        lines: parseLineRanges(child.props.lines),
        title: child.props.title,
        content: child.props.children,
        aside: child.props.aside,
      });
    } else if (isValidElement(child)) {
      code.push(child);
    }
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
