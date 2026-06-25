import { Container } from "@/components/container";
import { Separator } from "@/components/ui/separator";

export function SectionSeparator() {
  return (
    <Container>
      <Separator className="bg-site-border/50 dark:bg-white/4" />
    </Container>
  );
}
