import Image from "next/image";
import { PERSON, PERSONAL } from "../facts";
import { Ph } from "../ph";
import { TextLink } from "./primitives";

/**
 * Who he is, in four sentences. Every thread gets a clause and a link; none
 * of them is the headline.
 */
export function Intro() {
  return (
    <header>
      <div className="flex items-center gap-3.5">
        <Image
          src={PERSON.avatar}
          alt={PERSON.name}
          width={88}
          height={88}
          priority
          className="size-11 rounded-full object-cover ring-1 ring-site-border"
        />
        <div className="leading-tight">
          <h1 className="font-display font-semibold text-[17px] text-site-text tracking-tight">
            {PERSON.name}
          </h1>
          <p className="mt-0.5 text-site-text-tertiary text-sm">
            {PERSON.role} · {PERSON.city}
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-5 text-[17px] text-site-text-secondary leading-[1.7] sm:text-lg sm:leading-[1.75]">
        <p>
          I build products full-time at{" "}
          <span className="font-medium text-site-text">Fetchly Labs</span>, from
          the first version to production.
        </p>
        <p>
          I also maintain{" "}
          <TextLink href="/oss">open source at Lightning AI</TextLink>, and
          consult on cloud infrastructure at{" "}
          <TextLink href="https://stablecluster.com">StableCluster</TextLink>.
        </p>
        <p>
          In between, I do <TextLink href="/research">research</TextLink> on
          computer vision for healthcare, and{" "}
          <TextLink href="/blog">write</TextLink> about what I learn.
        </p>
        <p>
          <Ph value={PERSONAL.voiceLine} />
        </p>
      </div>
    </header>
  );
}
