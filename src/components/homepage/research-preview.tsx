import Link from "next/link";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
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
          <Card className="border border-site-border bg-site-card transition-all duration-200 group-hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex gap-5">
                {/* Accent bar */}
                <div
                  className="w-1 shrink-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--site-accent), transparent)",
                  }}
                />

                <div>
                  <Badge
                    variant="secondary"
                    className="mb-3 rounded-md font-mono text-[11px]"
                    style={{
                      background: "rgba(34, 197, 94, 0.12)",
                      color: "#22c55e",
                      border: "none",
                    }}
                  >
                    IEEE Access · 2024
                  </Badge>

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
