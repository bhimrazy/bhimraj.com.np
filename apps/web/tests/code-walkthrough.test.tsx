import { describe, expect, it } from "vitest";
import { CodeWalkthrough, Step } from "@/components/mdx/code-walkthrough";

/** Shiki-shaped code: one `.line` span per line, numbered by `data-line`. */
const code = (lines: number) => (
  <pre>
    <code>
      {Array.from({ length: lines }, (_, i) => i + 1).map((n) => (
        <span key={n} className="line" data-line={n} />
      ))}
    </code>
  </pre>
);

describe("CodeWalkthrough", () => {
  it("accepts steps inside the code", () => {
    expect(() =>
      CodeWalkthrough({
        children: [code(5), <Step key="s" lines="1,3-5" title="ok" />],
      }),
    ).not.toThrow();
  });

  it("fails on a step past the last line", () => {
    expect(() =>
      CodeWalkthrough({
        children: [code(5), <Step key="s" lines="4-6" title="Decoder" />],
      }),
    ).toThrow(/<Step title="Decoder" lines="4-6"> is outside the 5-line/);
  });

  it("fails on a step with no readable lines", () => {
    expect(() =>
      CodeWalkthrough({
        children: [code(5), <Step key="s" lines="x" title="typo" />],
      }),
    ).toThrow(/is outside/);
  });
});
