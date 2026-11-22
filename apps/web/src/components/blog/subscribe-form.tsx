"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { submitSubscription } from "@/components/newsletter/subscribe";
import { Turnstile, useTurnstile } from "@/components/newsletter/turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Compact newsletter form for the end of a post. Same API as the homepage. */
export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const turnstile = useTurnstile(formRef);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const check = await turnstile.getToken();
    if (check.error !== undefined) {
      toast.error(check.error);
      setLoading(false);
      return;
    }
    const { ok, message } = await submitSubscription({
      email,
      website,
      turnstileToken: check.token,
    });
    turnstile.reset();
    if (ok) setEmail("");
    (ok ? toast.success : toast.error)(message);
    setLoading(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={subscribe}
      className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        aria-label="Email address"
        autoComplete="email"
        className="h-10 flex-1 rounded-lg border border-site-border bg-site-bg text-site-text text-sm placeholder:text-site-text-tertiary focus-visible:border-site-accent/40 focus-visible:ring-site-accent/15 dark:border-white/6"
        // readOnly rather than disabled, so the field keeps focus while submitting.
        readOnly={loading}
      />
      {/* Honeypot: invisible to people, filled in by naive bots. The name is
          deliberately meaningless so browser autofill never touches it. */}
      <input
        type="text"
        name="hp-leave-empty"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="sr-only"
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-10 cursor-pointer rounded-lg border-0 bg-site-accent px-5 font-semibold text-site-on-accent hover:bg-site-accent/85 focus-visible:ring-site-accent/40"
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </Button>
      <Turnstile state={turnstile} />
    </form>
  );
}
