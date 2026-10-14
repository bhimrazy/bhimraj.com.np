import type { Metadata } from "next";
import Beyond from "@/components/homepage-v/b/beyond";
import Contact from "@/components/homepage-v/b/contact";
import Hero from "@/components/homepage-v/b/hero";
import SelectedWork from "@/components/homepage-v/b/selected-work";
import Threads from "@/components/homepage-v/b/threads";
import Writing from "@/components/homepage-v/b/writing";
import { SectionSeparator } from "@/components/section-separator";

export const metadata: Metadata = {
  title: "Homepage exploration B: Threads",
  robots: { index: false, follow: false },
};

/*
 * Version B, "Threads": who he is (hero), the parallel lines of work with
 * equal weight (01), evidence from all of them (02), how he thinks (03), the
 * person behind it (04), and how to reach him (05).
 */
export default function HomepageThreads() {
  return (
    <main>
      <Hero />
      <SectionSeparator />
      <Threads />
      <SectionSeparator />
      <SelectedWork />
      <SectionSeparator />
      <Writing />
      <Beyond />
      <Contact />
    </main>
  );
}
