import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { ColumnTitle } from "./column-title";
import { PERSONAL } from "./data";
import { NowItems } from "./now-items";
import { OffTheClock } from "./off-the-clock";
import { surface } from "./surface";

const CURRENTLY = [
  { label: "Building", value: PERSONAL.currently.building },
  { label: "Learning", value: PERSONAL.currently.learning },
  { label: "Reading", value: PERSONAL.currently.reading },
  { label: "Off-screen", value: PERSONAL.currently.elsewhere },
] as const;

/** The person behind the work: what he's on right now, and off the clock. */
export default function BeyondSection() {
  return (
    <section id="beyond" className="scroll-mt-20 pt-4 pb-20 sm:pb-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Beyond code"
          title="A little more about me"
          description={PERSONAL.voiceLine}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-5">
          <div className="flex flex-col">
            <ColumnTitle title="Currently" />
            <dl
              className={cn(
                surface,
                "flex-1 divide-y divide-site-border/60 dark:divide-white/5",
              )}
            >
              {CURRENTLY.map(({ label, value }) => (
                <div
                  key={label}
                  className="grid grid-cols-[88px_1fr] gap-4 px-6 py-4 sm:grid-cols-[110px_1fr] sm:px-7"
                >
                  <dt className="pt-0.5 font-mono text-[12px] text-site-text-tertiary">
                    {label}
                  </dt>
                  <dd className="text-pretty text-site-text text-sm leading-relaxed">
                    <NowItems items={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col">
            <ColumnTitle title="Off the clock" />
            <OffTheClock />
          </div>
        </div>
      </Container>
    </section>
  );
}
