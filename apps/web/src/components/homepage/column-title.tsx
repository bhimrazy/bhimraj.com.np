import type { ReactNode } from "react";

/** Small heading row for a column inside a larger homepage section. */
export function ColumnTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h3 className="font-medium font-mono text-[12px] text-site-text-tertiary uppercase tracking-[1.2px]">
        {title}
      </h3>
      {action}
    </div>
  );
}
