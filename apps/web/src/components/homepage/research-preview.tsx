import Link from "next/link";
import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";

export default function ResearchPreview() {
  return (
    <section className="py-20">
      <Container>
        {/* Section header */}
        <div className="mb-12">
          <span className="font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Research
          </span>
          <h2 className="mt-2 font-bold font-display text-3xl text-site-text leading-tight">
            Academic work
          </h2>
          <p className="mt-3 max-w-lg text-base text-site-text-secondary">
            Publications and research notes on AI, computer vision, and deep
            learning.
          </p>
        </div>

        <Link href="/research" className="group block">
          <Card className="relative overflow-hidden border border-site-border bg-site-card shadow-2xs transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-site-border-hover group-hover:shadow-lg/3 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:group-hover:border-white/10 dark:group-hover:shadow-site-accent/30">
            <span className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-60" />
            <CardContent className="relative p-6">
              <div className="flex gap-5">
                {/* Accent bar */}
                <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-site-accent to-transparent" />

                <div>
                  <span className="mb-3 inline-block rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[11px] text-site-accent">
                    IEEE Access · 2024
                  </span>

                  <h3 className="mb-2 font-display font-semibold text-base text-site-text leading-snug">
                    A Comparative Study of State-of-the-Art Deep Learning Models
                    for Semantic Segmentation of Pores in SEM Images
                  </h3>

                  <p className="mb-3 text-site-text-secondary text-sm">
                    B. Pokharel et al. · IEEE Access, vol. 12, pp. 50217–50243
                  </p>

                  <span className="font-medium text-site-accent text-sm transition-opacity group-hover:opacity-80">
                    View all research →
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </Container>
    </section>
  );
}
