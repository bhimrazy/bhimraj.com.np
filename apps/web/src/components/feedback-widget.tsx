"use client";

import {
  ChatBubbleIcon,
  Cross2Icon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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

const fieldClass = "h-9 bg-site-bg text-sm dark:bg-site-bg-secondary";

function FieldLabel({
  children,
  htmlFor,
  optional,
}: {
  children: string;
  htmlFor?: string;
  optional?: boolean;
}) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag
      htmlFor={htmlFor}
      className="flex items-baseline gap-1.5 font-medium font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.8px]"
    >
      {children}
      {optional && (
        <span className="text-site-text-tertiary/70 normal-case tracking-normal">
          optional
        </span>
      )}
    </Tag>
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
  const nameRef = useRef<HTMLInputElement>(null);
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
    // Start at the top field, unless a restored draft means they've begun writing.
    if (!open) return;
    const draft = textareaRef.current?.value;
    (draft ? textareaRef.current : nameRef.current)?.focus();
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

          <form onSubmit={submit} className="space-y-4 px-4 pb-4">
            <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-site-bg-secondary px-3.5 py-2.5 text-site-text text-sm leading-relaxed dark:bg-white/4">
              Hey 👋 What brought you by? A project, a question, or just saying
              hi, all welcome.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${fieldId}-name`} optional>
                  Name
                </FieldLabel>
                <Input
                  id={`${fieldId}-name`}
                  ref={nameRef}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${fieldId}-email`} optional>
                  Email
                </FieldLabel>
                <Input
                  id={`${fieldId}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  aria-describedby={`${fieldId}-hint`}
                  className={fieldClass}
                />
              </div>
            </div>

            <fieldset className="space-y-1.5">
              <legend>
                <FieldLabel>About</FieldLabel>
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={reason === r}
                    onClick={() => setReason(reason === r ? "" : r)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 font-medium text-xs transition-colors focus-visible:outline-2 focus-visible:outline-site-accent",
                      reason === r
                        ? "border-site-accent/40 bg-site-accent-subtle text-site-accent"
                        : "border-site-border/60 text-site-text-secondary hover:border-site-border-hover hover:text-site-text dark:border-white/8",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <FieldLabel htmlFor={`${fieldId}-message`}>Message</FieldLabel>
              <Textarea
                id={`${fieldId}-message`}
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  writeDraft(e.target.value);
                }}
                maxLength={2000}
                rows={3}
                required
                className="min-h-20 resize-none bg-site-bg text-sm dark:bg-site-bg-secondary"
              />
            </div>

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

            <div className="flex items-center justify-between gap-3">
              <p
                id={`${fieldId}-hint`}
                className="text-[11px] text-site-text-tertiary leading-snug"
              >
                Add an email if you&apos;d like a reply.
              </p>
              <Button
                type="submit"
                disabled={loading || !message.trim()}
                className="h-9 shrink-0 cursor-pointer gap-1.5 rounded-lg border-0 bg-site-accent px-4 font-semibold text-site-on-accent hover:bg-site-accent/85 disabled:bg-site-bg-secondary disabled:text-site-text-tertiary disabled:opacity-100 dark:disabled:bg-white/5"
              >
                {loading ? "Sending…" : "Send"}
                <PaperPlaneIcon aria-hidden className="size-3.5" />
              </Button>
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
