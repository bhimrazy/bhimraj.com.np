import { PERSONAL } from "../facts";
import { Chapter } from "./chapter";

/** The non-code parts. Every slot here is Bhimraj's to fill. */
export function Outside() {
  return (
    <Chapter id="outside" aside="the non-code parts">
      <ul className="flex flex-wrap gap-2.5 text-[15px]">
        {PERSONAL.interests.map((interest) => (
          <li
            key={interest}
            className="rounded-full border border-site-border bg-site-card px-3.5 py-1.5 dark:border-white/6"
          >
            {interest}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-pretty text-[15px] text-site-text-secondary leading-relaxed">
        Into any of these too? I&rsquo;d genuinely like to hear about it.{" "}
        <a
          href="#hello"
          className="rounded-sm text-site-text underline decoration-site-accent/40 underline-offset-4 transition-colors hover:text-site-accent hover:decoration-site-accent focus-visible:outline-2 focus-visible:outline-site-accent"
        >
          Say hello
        </a>
        .
      </p>
    </Chapter>
  );
}
