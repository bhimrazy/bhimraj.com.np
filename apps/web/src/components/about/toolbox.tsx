import { Container } from "@/components/container";
import { TOOLBOX } from "./data";
import { SectionHeading } from "./section-heading";

export function Toolbox() {
  return (
    <section aria-labelledby="toolbox" className="pb-20 sm:pb-24">
      <Container>
        <SectionHeading
          id="toolbox"
          index="04"
          eyebrow="Toolbox"
          title="What I reach for"
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-site-border bg-site-border md:grid-cols-3 dark:border-white/5 dark:bg-white/5">
          {TOOLBOX.map(({ group, items }) => (
            <div key={group} className="bg-site-card p-6 dark:bg-site-bg">
              <h3 className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.2px]">
                {group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-site-border bg-site-bg-tertiary px-2.5 py-1 font-mono text-[12px] text-site-text-secondary transition-colors hover:border-site-accent/40 hover:bg-site-accent-subtle hover:text-site-accent dark:border-white/6 dark:bg-white/3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
