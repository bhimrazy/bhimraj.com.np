"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capture } from "@/lib/analytics";

export default function NewsLetter() {
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
    <section className="py-24">
      <Container>
        <div className="rounded-2xl border border-site-border/50 bg-site-card px-8 py-14 text-center dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
          <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Newsletter
          </span>
          <h2 className="mb-3 font-bold font-display text-2xl text-site-text">
            Stay in the loop
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-base text-site-text-secondary">
            Thoughts on software engineering, OSS, AI research, and what
            I&apos;m building — delivered occasionally.
          </p>

          <form
            onSubmit={subscribe}
            className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              required
              aria-label="Email for newsletter"
              className="flex-1 rounded-lg border border-site-border/50 bg-site-bg text-site-text text-sm placeholder:text-site-text-tertiary focus-visible:border-site-accent/40 focus-visible:ring-site-accent/15 dark:border-white/6 dark:bg-site-bg-secondary"
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
              className="cursor-pointer rounded-lg border-0 bg-site-accent px-6 font-semibold text-white hover:bg-site-accent/85"
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
