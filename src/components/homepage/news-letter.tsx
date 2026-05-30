"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, type FormState } from "@/lib/types";

export default function NewsLetter() {
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ state: Form.Loading });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();

      if (res.ok) {
        setEmail("");
        setForm({ state: Form.Success, message: data?.message });
      } else {
        setForm({ state: Form.Error, message: data?.error });
      }
    } catch {
      setForm({
        state: Form.Error,
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="py-20">
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
              disabled={form.state === Form.Loading}
            />
            <input
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
              disabled={form.state === Form.Loading}
              className="cursor-pointer rounded-lg border-0 bg-site-accent px-6 font-semibold text-white hover:bg-site-accent/85"
            >
              {form.state === Form.Loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>

          {form.message && (
            <p
              className={`mt-4 text-sm ${form.state === Form.Error ? "text-red-400" : "text-site-accent"}`}
            >
              {form.message}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
