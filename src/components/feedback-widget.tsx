"use client";

import {
  ChatBubbleIcon,
  Cross2Icon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { capture } from "@/lib/analytics";
import {
  readDraft,
  readMemory,
  shouldAutoOpen,
  writeDraft,
  writeMemory,
} from "@/lib/feedback-widget-storage";

// Eligibility is gated by shouldAutoOpen() — skips dismissed/submitted
// visitors and caps lifetime auto-opens. These two just pick when to fire:
const AUTO_OPEN_MS = 25_000; // fire after 25s on the page…
const SCROLL_TRIGGER = 0.8; // …or after scrolling 80% down — whichever is first

const REASONS = [
  "Your work / OSS",
  "A blog post",
  "Hiring / collab",
  "Just curious",
] as const;

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [wantsReply, setWantsReply] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Restore any in-progress draft from a previous visit.
  useEffect(() => {
    setMessage(readDraft());
  }, []);

  // Auto-expand once for engaged visitors, respecting prior interactions.
  useEffect(() => {
    if (!shouldAutoOpen(readMemory())) return;

    let fired = false;
    let timer = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) tryAutoOpen();
    };
    function tryAutoOpen() {
      if (fired) return;
      fired = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      // Re-check at fire time: the visitor may have opened or dismissed the
      // widget while the timer/scroll was pending — don't reopen or waste a nudge.
      if (openRef.current || !shouldAutoOpen(readMemory())) return;
      const mem = readMemory();
      writeMemory({ status: "seen", autoOpens: mem.autoOpens + 1 });
      setOpen(true);
      capture("feedback_auto_opened");
    }

    timer = window.setTimeout(tryAutoOpen, AUTO_OPEN_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const openManually = () => {
    if (readMemory().status === "new") writeMemory({ status: "seen" });
    setOpen(true);
    capture("feedback_opened");
  };

  const dismiss = useCallback(() => {
    if (readMemory().status !== "submitted")
      writeMemory({ status: "dismissed" });
    setOpen(false);
    capture("feedback_dismissed");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          reason,
          name,
          email,
          website,
          path: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        writeMemory({ status: "submitted" });
        writeDraft("");
        capture("feedback_submitted", {
          reason: reason || null,
          has_email: Boolean(email.trim()),
        });
        setOpen(false);
        setMessage("");
        setReason("");
        setName("");
        setEmail("");
        setWantsReply(false);
        toast.success(data?.message ?? "Thanks — I read every note 🙏");
      } else {
        toast.error(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          role="dialog"
          aria-label="Send feedback to Bhimraj"
          className="fade-in zoom-in-95 w-[min(92vw,22rem)] origin-bottom-right animate-in overflow-hidden rounded-2xl border border-site-border/60 bg-site-card shadow-2xl shadow-black/10 duration-200 dark:border-white/8 dark:shadow-black/40"
        >
          <div className="flex items-start gap-3 border-site-border/50 border-b bg-site-bg-secondary/50 px-4 py-3.5 dark:border-white/6">
            <Image
              src="/bhimraj-yadav.jpg"
              alt="Bhimraj Yadav"
              width={40}
              height={40}
              className="size-10 rounded-full border border-site-border/50 object-cover dark:border-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-site-text text-sm">
                Hey, I&apos;m Bhimraj 👋
              </p>
              <p className="text-site-text-secondary text-xs">
                Curious what brought you by?
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="-mr-1 rounded-md p-1 text-site-text-tertiary transition-colors hover:bg-site-bg-secondary hover:text-site-text"
            >
              <Cross2Icon className="size-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3 px-4 py-4">
            <div className="flex flex-wrap gap-1.5">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(reason === r ? "" : r)}
                  className={`rounded-full border px-2.5 py-1 font-medium text-xs transition-colors ${
                    reason === r
                      ? "border-site-accent/40 bg-site-accent-subtle text-site-accent"
                      : "border-site-border/60 text-site-text-secondary hover:border-site-border-hover hover:text-site-text dark:border-white/8"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                writeDraft(e.target.value);
              }}
              maxLength={2000}
              rows={3}
              required
              placeholder="What were you looking for, or any feedback?"
              className="resize-none bg-site-bg text-sm dark:bg-site-bg-secondary"
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

            {wantsReply ? (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Name (optional)"
                  className="bg-site-bg text-sm dark:bg-site-bg-secondary"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  placeholder="Email for a reply"
                  className="bg-site-bg text-sm dark:bg-site-bg-secondary"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setWantsReply(true)}
                className="font-medium text-site-accent text-xs hover:underline"
              >
                Want a reply? Add your email →
              </button>
            )}

            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full cursor-pointer gap-1.5 rounded-lg border-0 bg-site-accent font-semibold text-white hover:bg-site-accent/85"
            >
              <PaperPlaneIcon className="size-3.5" />
              {loading ? "Sending…" : "Send"}
            </Button>

            <p className="text-center text-[11px] text-site-text-tertiary">
              Anonymous unless you add your email.
            </p>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={openManually}
          aria-label="Send feedback"
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-site-accent text-white shadow-lg shadow-site-accent/25 transition-transform hover:scale-105 hover:bg-site-accent/90"
        >
          <ChatBubbleIcon className="size-5" />
        </button>
      )}
    </div>
  );
}
