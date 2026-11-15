import { Chip } from "@/components/chip";
import { surface } from "@/components/surface";
import { cn } from "@/lib/utils";
import { EDUCATION } from "./data";

export function Education() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {EDUCATION.map((item) => (
        <li key={item.degree} className={cn(surface, "flex flex-col p-6")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-site-text-secondary">
              {item.years}
            </span>
            {item.current && <Chip>In progress</Chip>}
          </div>
          <h3 className="mt-3 text-balance font-display font-semibold text-lg text-site-text leading-snug">
            {item.degree}
          </h3>
          <p className="mt-1 text-site-text-secondary text-sm leading-relaxed">
            {item.school}
            {item.via && (
              <span className="text-site-text-tertiary"> · {item.via}</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
