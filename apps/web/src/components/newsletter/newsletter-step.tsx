import { Container } from "@/components/container";
import { ArrowLink, PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

const COPY = {
  confirm: {
    title: "Confirm your subscription",
    body: "One click and you're on the list: occasional notes on engineering, open source and AI. No spam.",
    button: "Confirm subscription",
    done: "You're subscribed 🎉",
    doneBody:
      "Thanks for joining. A short welcome note is on its way, and every email has an unsubscribe link.",
  },
  unsubscribe: {
    title: "Unsubscribe",
    body: "Press the button and I'll stop sending the newsletter to this address.",
    button: "Unsubscribe",
    done: "You're unsubscribed",
    doneBody: "You won't get the newsletter any more. Sorry to see you go.",
  },
} as const;

const PROBLEMS: Record<string, { title: string; body: string }> = {
  invalid: {
    title: "This link doesn't work",
    body: "It may be incomplete. Open the link from the email again, or subscribe again from the home page.",
  },
  expired: {
    title: "This link has expired",
    body: "Confirmation links last 48 hours. Subscribe again from the home page and I'll send a new one.",
  },
  unavailable: {
    title: "That didn't work right now",
    body: "Please try again in a few minutes by opening the link in the email again.",
  },
};

// Mail scanners prefetch links, so only the button acts.
export async function NewsletterStep({
  step,
  action,
  searchParams,
}: {
  step: keyof typeof COPY;
  action: (formData: FormData) => Promise<void>;
  searchParams: Promise<{ token?: string; r?: string }>;
}) {
  const { token, r } = await searchParams;
  const copy = COPY[step];
  const done = r === "done";
  const problem = done
    ? undefined
    : (PROBLEMS[r ?? ""] ?? (token ? undefined : PROBLEMS.invalid));

  return (
    <main className="min-h-[70dvh] pt-32 pb-24">
      <Container className="px-4 sm:px-8">
        {done || problem ? (
          <PageHeader
            eyebrow="Newsletter"
            title={problem?.title ?? copy.done}
            description={problem?.body ?? copy.doneBody}
          >
            <div className="mt-8">
              <ArrowLink href="/">Back to the home page</ArrowLink>
            </div>
          </PageHeader>
        ) : (
          <PageHeader
            eyebrow="Newsletter"
            title={copy.title}
            description={copy.body}
          >
            <form action={action} className="mt-8">
              <input type="hidden" name="token" value={token} />
              <Button
                type="submit"
                className="h-11 cursor-pointer rounded-lg border-0 bg-site-accent px-6 font-semibold text-site-on-accent hover:bg-site-accent/85 focus-visible:ring-2 focus-visible:ring-site-accent/40"
              >
                {copy.button}
              </Button>
            </form>
          </PageHeader>
        )}
      </Container>
    </main>
  );
}
