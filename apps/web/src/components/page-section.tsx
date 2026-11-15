import type { ReactNode } from "react";
import { Container } from "@/components/container";

/** A top-level page section; `id` is its anchor, offset for the fixed header. */
export function PageSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-24">
      <Container className="px-4 sm:px-8">{children}</Container>
    </section>
  );
}
