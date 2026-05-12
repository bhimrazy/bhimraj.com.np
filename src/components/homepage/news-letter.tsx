"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, type FormState } from "@/lib/types";

export default function NewsLetter() {
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const [email, setEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ state: Form.Loading });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          ...(process.env.NEXT_PUBLIC_API_ROUTE_SECRET
            ? {
                Authorization: `Basic ${process.env.NEXT_PUBLIC_API_ROUTE_SECRET}`,
              }
            : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
    <section className="border-site-border border-t py-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="rounded-2xl border border-site-border bg-site-card px-8 py-14 text-center">
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
              placeholder="you@example.com"
              required
              aria-label="Email for newsletter"
              className="flex-1 rounded-lg border border-site-border bg-site-bg-secondary text-site-text text-sm"
              disabled={form.state === Form.Loading}
            />
            <Button
              type="submit"
              disabled={form.state === Form.Loading}
              className="rounded-lg bg-site-accent px-6 font-semibold text-white"
              style={{ border: "none" }}
            >
              {form.state === Form.Loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>

          {form.message && (
            <p
              className="mt-4 text-sm"
              style={{
                color: form.state === Form.Error ? "#ef4444" : "#22c55e",
              }}
            >
              {form.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
