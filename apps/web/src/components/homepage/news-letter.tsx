"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capture } from "@/lib/analytics";

/** Newsletter sign-up form — the only interactive leaf of the contact section. */
export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const statusId = useId();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();

      if (res.ok) {
        setEmail("");
        capture("newsletter_submitted", { result: "success" });
        const message =
          data?.message ?? "🎉 You're in! Please check your inbox.";
        setStatus(message);
        toast.success(message);
      } else {
        capture("newsletter_submitted", { result: "error" });
        const message =
          data?.error ?? "Something went wrong. Please try again.";
        setStatus(message);
        toast.error(message);
      }
    } catch {
      capture("newsletter_submitted", { result: "error" });
      setStatus("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={subscribe}
      aria-busy={loading}
      aria-describedby={statusId}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          aria-label="Email for newsletter"
          className="h-10 flex-1 rounded-lg border border-site-border bg-site-bg text-site-text text-sm placeholder:text-site-text-tertiary focus-visible:border-site-accent/50 focus-visible:ring-site-accent/20 dark:border-white/8 dark:bg-site-bg-secondary"
          // readOnly rather than disabled, so the field keeps focus while submitting.
          readOnly={loading}
        />
        {/* Honeypot: invisible to people, filled in by naive bots. The name is
            deliberately meaningless so browser autofill never touches it. */}
        <div aria-hidden="true" className="sr-only">
          <input
            type="text"
            name="hp-leave-empty"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          aria-disabled={loading}
          variant="outline"
          className="h-10 cursor-pointer rounded-lg px-5 font-semibold text-site-text focus-visible:ring-2 focus-visible:ring-site-accent aria-disabled:opacity-60"
        >
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {/* Inline status for people who miss the toast (and for screen readers). */}
      <p
        id={statusId}
        aria-live="polite"
        className="min-h-5 text-site-text-secondary text-xs"
      >
        {status}
      </p>
    </form>
  );
}
