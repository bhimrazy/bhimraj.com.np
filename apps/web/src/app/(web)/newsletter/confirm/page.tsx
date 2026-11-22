import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsletterStep } from "@/components/newsletter/newsletter-step";
import { confirmAction } from "../actions";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string; r?: string }> };

export default function ConfirmPage({ searchParams }: Props) {
  return (
    <Suspense>
      <NewsletterStep
        step="confirm"
        action={confirmAction}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
