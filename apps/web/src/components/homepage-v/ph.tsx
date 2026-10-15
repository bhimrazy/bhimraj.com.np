import { PLACEHOLDER, type Placeholder } from "./facts";

export function isPlaceholder(v: unknown): v is Placeholder {
  return typeof v === "object" && v !== null && PLACEHOLDER in v;
}

/**
 * Renders a slot Bhimraj still has to fill: a dashed amber outline around the
 * hint, so nobody mistakes it for real copy.
 */
export function Ph({ value }: { value: string | Placeholder }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <span
      title="Placeholder: needs Bhimraj's input"
      className="rounded border border-site-accent/60 border-dashed px-1 font-mono text-[0.85em] text-site-accent/90"
    >
      [{value.hint}]
    </span>
  );
}
