import type { Metadata } from "next";
import { Currently } from "@/components/homepage-v/c/currently";
import { Hello } from "@/components/homepage-v/c/hello";
import { Intro } from "@/components/homepage-v/c/intro";
import { Made } from "@/components/homepage-v/c/made";
import { Outside } from "@/components/homepage-v/c/outside";
import { Path } from "@/components/homepage-v/c/path";
import { Writing } from "@/components/homepage-v/c/writing";

export const metadata: Metadata = {
  title: "Version C · Personal — Bhimraj Yadav",
};

/*
 * Version C, "personal / journal": the person first, the work as evidence.
 * A sticky intro on the left (desktop) and a scrolling notebook on the right;
 * on mobile the two simply stack.
 */
export default function HomeVersionC() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pt-24 pb-24 sm:px-8 sm:pt-32 lg:pt-0 lg:pb-32">
      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-0 lg:self-start lg:pt-32 lg:pb-12">
          <Intro />
        </div>

        <div className="mt-16 space-y-20 sm:space-y-24 lg:mt-0 lg:pt-32">
          <Currently />
          <Path />
          <Made />
          <Writing />
          <Outside />
          <Hello />
        </div>
      </div>
    </main>
  );
}
