import { Container } from "@/components/container";
import { Separator } from "@/components/ui/separator";

/** Hairline between sections that fades out at both ends. */
export function SectionSeparator() {
  return (
    <Container>
      <Separator className="bg-linear-to-r bg-transparent from-transparent via-site-border to-transparent dark:bg-transparent dark:via-white/8" />
    </Container>
  );
}
