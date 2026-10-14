import { Intro } from "./intro";
import { Now } from "./now";
import { Contact, OutsideWork } from "./outro";
import { SelectedWork } from "./selected-work";
import { Writing } from "./writing";

/**
 * Version A, "Index": a single narrow reading column. Mostly text, almost no
 * chrome. The person first, then the threads, the work, the writing, the
 * life outside it, and how to reach him.
 */
export default function HomepageA() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <Intro />
      <Now />
      <SelectedWork />
      <Writing />
      <OutsideWork />
      <Contact />
    </main>
  );
}
