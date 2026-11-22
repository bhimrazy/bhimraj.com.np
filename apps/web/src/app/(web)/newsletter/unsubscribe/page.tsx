import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsletterStep } from "@/components/newsletter/newsletter-step";
import { unsubscribeAction } from "../actions";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string; r?: string }> };

export default function UnsubscribePage({ searchParams }: Props) {
  return (
    <Suspense>
      <NewsletterStep
        step="unsubscribe"
        action={unsubscribeAction}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
