"use client";

import {
  Children,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/*
 * Variants of the same step (macOS / Linux / Windows, HTTPS / SSH). The
 * reader's picks are remembered as a most-recent-first list of labels, so
 * choosing "Linux" switches every OS tab group on the page (and on the next
 * part) while an "HTTPS / SSH" group keeps its own choice.
 */

const STORAGE_KEY = "mdx-tabs";
const CHANGE_EVENT = "mdx-tabs-change";
const MAX_PREFS = 12;

function readPrefs(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function rememberLabel(label: string) {
  const prefs = [label, ...readPrefs().filter((l) => l !== label)].slice(
    0,
    MAX_PREFS,
  );
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked (private mode, sandboxed iframe): still sync this page.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: prefs }));
}

/** First remembered label this group has, else its first tab. */
const preferredIndex = (labels: string[], prefs: string[]) => {
  for (const pref of prefs) {
    const index = labels.indexOf(pref);
    if (index !== -1) return index;
  }
  return 0;
};

type TabProps = { label: string; children: ReactNode };

/** One panel of `<Tabs>`; rendered by its parent, never on its own. */
export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

/**
 * ```mdx
 * <Tabs>
 *   <Tab label="macOS">…</Tab>
 *   <Tab label="Linux">…</Tab>
 * </Tabs>
 * ```
 * The server renders the first tab; the remembered choice applies after
 * hydration.
 */
export function Tabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> =>
      isValidElement<TabProps>(child) && typeof child.props.label === "string",
  );
  const labels = tabs.map((t) => t.props.label);
  const key = labels.join("\u0000");

  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const list = key.split("\u0000");
    const sync = (prefs: string[]) => setActive(preferredIndex(list, prefs));
    sync(readPrefs());

    const onChange = (e: Event) => sync((e as CustomEvent<string[]>).detail);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync(readPrefs());
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  if (tabs.length === 0) return null;

  const select = (index: number, focus = false) => {
    const label = labels[index];
    if (label === undefined) return;
    setActive(index);
    rememberLabel(label);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-site-border bg-site-card">
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="not-prose flex gap-1 overflow-x-auto border-site-border border-b px-2 sm:px-3"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.props.label}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "relative shrink-0 rounded-md px-3 py-2.5 font-mono text-[12px] transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:bg-site-accent after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 motion-reduce:after:transition-none",
                selected
                  ? "text-site-text after:scale-x-100"
                  : "text-site-text-tertiary after:scale-x-0 hover:text-site-text",
              )}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.props.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tabs pattern; panels take focus when they hold no focusable content
          tabIndex={0}
          className="tab-panel px-5 py-1 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:px-6 [&>:first-child]:mt-5 [&>:last-child]:mb-5"
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
}
