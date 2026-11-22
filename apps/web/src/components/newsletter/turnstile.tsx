"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileState = ReturnType<typeof useTurnstile>;

const TOKEN_WAIT_MS = 15_000;
const WAITING = "Please finish the security check, then try again.";
const BROKEN =
  "The security check didn't load. Turn off content blockers for this site, or reload.";

// Loads the script only once the form nears the viewport or takes focus.
export function useTurnstile(form: RefObject<HTMLFormElement | null>) {
  const [armed, setArmed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const token = useRef<string | null>(null);
  const broken = useRef(false);
  const waiters = useRef<Array<() => void>>([]);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const node = form.current;
    if (!SITE_KEY || armed || !node) return;
    const arm = () => setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && arm(),
      { rootMargin: "200px" },
    );
    observer.observe(node);
    node.addEventListener("focusin", arm);
    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", arm);
    };
  }, [form, armed]);

  const settle = useCallback((next: string | null, failed = false) => {
    token.current = next;
    broken.current = failed;
    if (next || failed) for (const wake of waiters.current.splice(0)) wake();
  }, []);

  // Resolves once the invisible widget has a token, so submit never waits on a box.
  const getToken = useCallback(async (): Promise<
    { token: string | null; error?: undefined } | { error: string }
  > => {
    if (!SITE_KEY) return { token: null };
    setArmed(true);
    if (!token.current && !broken.current) {
      await new Promise<void>((resolve) => {
        waiters.current.push(resolve);
        setTimeout(resolve, TOKEN_WAIT_MS);
      });
    }
    if (token.current) return { token: token.current };
    return { error: broken.current ? BROKEN : WAITING };
  }, []);

  // Tokens are single use.
  const reset = useCallback(() => {
    token.current = null;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, []);

  return {
    getToken,
    reset,
    widget: { armed, interactive, setInteractive, settle, widgetId },
  };
}

// Managed widget, interaction-only: invisible unless Cloudflare needs the visitor.
export function Turnstile({ state }: { state: TurnstileState }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const { armed, interactive, setInteractive, settle, widgetId } = state.widget;

  useEffect(() => {
    const node = container.current;
    if (!SITE_KEY || !ready || !node || !window.turnstile) return;
    const turnstile = window.turnstile;
    const id = turnstile.render(node, {
      sitekey: SITE_KEY,
      theme: resolvedTheme === "light" ? "light" : "dark",
      size: "flexible",
      appearance: "interaction-only",
      callback: (t: string) => settle(t),
      "expired-callback": () => settle(null),
      "error-callback": () => settle(null, true),
      "before-interactive-callback": () => setInteractive(true),
      "after-interactive-callback": () => setInteractive(false),
    });
    widgetId.current = id;
    return () => {
      turnstile.remove(id);
      widgetId.current = null;
      settle(null);
      setInteractive(false);
    };
  }, [ready, resolvedTheme, settle, setInteractive, widgetId]);

  if (!SITE_KEY || !armed) return null;
  return (
    <>
      <Script
        src={SCRIPT_SRC}
        onReady={() => setReady(true)}
        onError={() => settle(null, true)}
      />
      {/* Out of flow while invisible, so the form's gap leaves no empty row. */}
      <div
        ref={container}
        className={interactive ? "w-full" : "pointer-events-none absolute"}
      />
    </>
  );
}
