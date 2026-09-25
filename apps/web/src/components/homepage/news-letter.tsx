"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capture } from "@/lib/analytics";

/** Newsletter sign-up form — the only interactive leaf of the contact section. */
export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        toast.success(
          data?.message ?? "🎉 You're in! Please check your inbox.",
        );
      } else {
        capture("newsletter_submitted", { result: "error" });
        toast.error(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        aria-label="Email for newsletter"
        className="h-10 flex-1 rounded-lg border border-site-border bg-site-bg text-site-text text-sm placeholder:text-site-text-tertiary focus-visible:border-site-accent/50 focus-visible:ring-site-accent/20 dark:border-white/8 dark:bg-site-bg-secondary"
        disabled={loading}
      />
      <Input
        type="text"
        name="website"
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
        variant="outline"
        className="h-10 cursor-pointer rounded-lg px-5 font-semibold text-site-text focus-visible:ring-2 focus-visible:ring-site-accent"
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </Button>
    </form>
  );
}
