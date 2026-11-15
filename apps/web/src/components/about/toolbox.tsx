import { Chip } from "@/components/chip";
import { surface } from "@/components/surface";
import { cn } from "@/lib/utils";
import { TOOLBOX } from "./data";

export function Toolbox() {
  return (
    <div
      className={cn(
        surface,
        "grid grid-cols-1 divide-y divide-site-border md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-white/5",
      )}
    >
      {TOOLBOX.map(({ group, items }) => (
        <div key={group} className="p-6">
          <h3 className="font-mono text-[11px] text-site-text-secondary uppercase tracking-[1.2px]">
            {group}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item}>
                <Chip tone="neutral" className="font-mono text-[12px]">
                  {item}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
