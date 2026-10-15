import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { ColumnTitle } from "../../homepage/column-title";
import { surface } from "../../homepage/surface";
import { PERSON, PERSONAL } from "../facts";
import { NowItems } from "../now-items";
import { Ph } from "../ph";

const CURRENTLY = [
  { label: "Building", value: PERSONAL.currently.building },
  { label: "Learning", value: PERSONAL.currently.learning },
  { label: "Reading", value: PERSONAL.currently.reading },
  { label: "Elsewhere", value: PERSONAL.currently.elsewhere },
] as const;

/*
 * Deliberately small: the personal slots are placeholders until Bhimraj
 * fills them, and <Ph> keeps the gaps visible instead of inventing hobbies.
 */
export default function Beyond() {
  return (
    <section id="beyond" className="scroll-mt-20 pt-4 pb-20 sm:pb-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Beyond code"
          title="A little more about me"
          description={<Ph value={PERSONAL.voiceLine} />}
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
            <div className={cn(surface, "flex flex-1 flex-col p-6 sm:p-7")}>
              <ul className="flex flex-wrap gap-2">
                {PERSONAL.interests.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-site-border bg-site-bg-secondary px-3 py-1.5 text-sm dark:border-white/6 dark:bg-white/3"
                  >
                    {interest}
                  </li>
                ))}
              </ul>

              <p className="mt-auto flex flex-wrap items-baseline gap-x-2 border-site-border/60 border-t pt-5 text-site-text-secondary text-sm leading-relaxed max-lg:mt-6 dark:border-white/5">
                <span className="font-mono text-[12px] text-site-text-tertiary">
                  Based in
                </span>
                {PERSON.city}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
