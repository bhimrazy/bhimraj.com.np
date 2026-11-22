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

// Loads the script only once the form nears the viewport or takes focus.
export function useTurnstile(form: RefObject<HTMLFormElement | null>) {
  const [armed, setArmed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
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

  // Tokens are single use.
  const reset = useCallback(() => {
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, []);

  const blocker =
    !SITE_KEY || token
      ? null
      : broken
        ? "The security check didn't load. Turn off content blockers for this site, or reload."
        : "Wait a moment for the security check to finish, then try again.";

  return {
    token,
    blocker,
    reset,
    widget: { armed, setToken, setBroken, widgetId },
  };
}

export function Turnstile({ state }: { state: TurnstileState }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const { armed, setToken, setBroken, widgetId } = state.widget;

  useEffect(() => {
    const node = container.current;
    if (!SITE_KEY || !ready || !node || !window.turnstile) return;
    const turnstile = window.turnstile;
    const id = turnstile.render(node, {
      sitekey: SITE_KEY,
      theme: resolvedTheme === "light" ? "light" : "dark",
      size: "flexible",
      appearance: "interaction-only",
      callback: (t: string) => {
        setBroken(false);
        setToken(t);
      },
      "expired-callback": () => setToken(null),
      "error-callback": () => {
        setToken(null);
        setBroken(true);
      },
    });
    widgetId.current = id;
    return () => {
      turnstile.remove(id);
      widgetId.current = null;
      setToken(null);
    };
  }, [ready, resolvedTheme, setToken, setBroken, widgetId]);

  if (!SITE_KEY || !armed) return null;
  return (
    <>
      <Script
        src={SCRIPT_SRC}
        onReady={() => setReady(true)}
        onError={() => setBroken(true)}
      />
      <div ref={container} className="w-full empty:hidden" />
    </>
  );
}
