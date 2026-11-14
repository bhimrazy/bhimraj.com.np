"use client";

import {
  ChatBubbleIcon,
  Cross2Icon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { capture } from "@/lib/analytics";
import {
  readDraft,
  readMemory,
  shouldAutoOpen,
  writeDraft,
  writeMemory,
} from "@/lib/feedback-widget-storage";
import { cn } from "@/lib/utils";

// Eligibility is gated by shouldAutoOpen() — skips dismissed/submitted
// visitors and caps lifetime auto-opens. These two just pick when to fire:
const AUTO_OPEN_MS = 25_000; // fire after 25s on the page…
const SCROLL_TRIGGER = 0.8; // …or after scrolling 80% down — whichever is first
/** Lets an in-page link (e.g. #contact) finish its scroll before the chat opens. */
const CTA_OPEN_DELAY_MS = 600;

const REASONS = [
  "Hiring / collab",
  "Your work / OSS",
  "A blog post",
  "Just curious",
] as const;
type Reason = (typeof REASONS)[number];

const isReason = (value: string | undefined): value is Reason =>
  REASONS.includes(value as Reason);

/** My reply once a topic is picked, so the panel reads like a conversation. */
const FOLLOW_UPS: Record<Reason, string> = {
  "Hiring / collab": "Great! Tell me a bit about the role or project.",
  "Your work / OSS": "Nice. Which project, and what's on your mind?",
  "A blog post": "Which post? Questions and corrections are both welcome.",
  "Just curious": "Happy you're here. Ask me anything.",
};

const bubble =
  "w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-site-bg-secondary px-3.5 py-2.5 text-site-text text-sm leading-relaxed dark:bg-white/5";

/** A slim input with its label inside the box, for the composer's reply-to rows. */
function InlineField({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<"input">) {
  return (
    <div className="flex h-8 items-center gap-2 rounded-lg border border-site-border/70 bg-site-bg px-2.5 transition-colors focus-within:border-site-accent/50 dark:border-white/8 dark:bg-site-bg-secondary">
      <label
        htmlFor={id}
        className="w-11 shrink-0 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.6px]"
      >
        {label}
      </label>
      <input
        id={id}
        placeholder="optional"
        className="h-full min-w-0 flex-1 bg-transparent text-site-text text-sm outline-none placeholder:text-site-text-tertiary/60"
        {...props}
      />
    </div>
  );
}

/**
 * Chat-style feedback box. Besides the launcher and the auto-open, any element
 * with `data-open-chat` opens it; a value naming one of REASONS preselects it.
 */
export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<Reason | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
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

  const openManually = useCallback((preset?: Reason) => {
    if (readMemory().status === "new") writeMemory({ status: "seen" });
    if (preset) setReason(preset);
    setOpen(true);
    capture("feedback_opened");
  }, []);

  // Delegated, so server-rendered CTAs can open the chat without a client wrapper.
  useEffect(() => {
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-open-chat]",
      );
      if (!trigger) return;
      const preset = trigger.dataset.openChat;
      window.clearTimeout(timer);
      timer = window.setTimeout(
        () => openManually(isReason(preset) ? preset : undefined),
        CTA_OPEN_DELAY_MS,
      );
    };
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick);
    };
  }, [openManually]);

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
          aria-label="Message Bhimraj"
          className="fade-in zoom-in-95 slide-in-from-bottom-2 relative isolate w-[min(calc(100vw-2rem),23rem)] origin-bottom-right animate-in overflow-hidden rounded-2xl border border-site-border/60 bg-site-card shadow-2xl shadow-black/10 duration-200 dark:border-white/8 dark:shadow-black/40"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-16 -z-10 size-56 rounded-full bg-site-accent-subtle blur-3xl"
          />
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <Image
              src="/bhimraj-yadav.jpg"
              alt=""
              width={40}
              height={40}
              className="relative size-10 shrink-0 rounded-full border border-site-border/60 object-cover dark:border-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-site-text text-sm">
                Bhimraj Yadav
              </p>
              <p className="text-site-text-tertiary text-xs">
                I read every message
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="-mr-1 rounded-md p-1.5 text-site-text-tertiary transition-colors hover:bg-site-bg-secondary hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent"
            >
              <Cross2Icon className="size-4" />
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="space-y-2.5 px-4 pb-4">
              <p className={bubble}>Hey 👋 What brought you by today?</p>

              {reason ? (
                <>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReason("")}
                      aria-label={`Topic: ${reason}. Change topic`}
                      className="group rounded-2xl rounded-tr-sm bg-site-accent px-3.5 py-2 font-medium text-site-on-accent text-sm focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
                    >
                      {reason}
                      <span
                        aria-hidden
                        className="ml-1.5 opacity-60 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </span>
                    </button>
                  </div>
                  <p className={bubble}>{FOLLOW_UPS[reason]}</p>
                </>
              ) : (
                <fieldset className="flex flex-wrap justify-end gap-1.5 pl-8">
                  <legend className="sr-only">What&apos;s it about?</legend>
                  {REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className="rounded-full border border-site-accent/30 px-3 py-1.5 font-medium text-site-accent text-xs transition-colors hover:bg-site-accent-subtle focus-visible:outline-2 focus-visible:outline-site-accent"
                    >
                      {r}
                    </button>
                  ))}
                </fieldset>
              )}
            </div>

            <div className="space-y-2 border-site-border/60 border-t bg-site-bg-secondary/40 p-3 dark:border-white/6 dark:bg-white/2">
              <InlineField
                id={`${fieldId}-name`}
                label="Name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <InlineField
                id={`${fieldId}-email`}
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                aria-describedby={`${fieldId}-hint`}
              />

              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    writeDraft(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    // Enter sends, Shift+Enter adds a line, as in any chat.
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  maxLength={2000}
                  rows={2}
                  required
                  aria-label="Message"
                  placeholder="Write a message…"
                  className="min-h-16 resize-none bg-site-bg pr-12 text-sm placeholder:text-site-text-tertiary dark:bg-site-bg-secondary"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  aria-label={loading ? "Sending" : "Send"}
                  className="absolute right-2 bottom-2 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-site-accent text-site-on-accent transition-colors hover:bg-site-accent/85 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 disabled:cursor-default disabled:bg-site-border/60 disabled:text-site-text-tertiary dark:disabled:bg-white/6"
                >
                  <PaperPlaneIcon
                    aria-hidden
                    className={cn("size-3.5", loading && "animate-pulse")}
                  />
                </button>
              </div>

              <p
                id={`${fieldId}-hint`}
                className="px-1 text-[11px] text-site-text-tertiary"
              >
                Your email is only used to reply.
              </p>

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
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openManually()}
          aria-label="Message Bhimraj"
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-site-accent text-site-on-accent shadow-lg shadow-site-accent/25 transition-transform hover:scale-105 hover:bg-site-accent/90 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 motion-reduce:hover:scale-100"
        >
          <ChatBubbleIcon className="size-5" />
        </button>
      )}
    </div>
  );
}
