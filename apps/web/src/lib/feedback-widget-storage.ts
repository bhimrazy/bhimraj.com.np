type WidgetStatus = "new" | "seen" | "dismissed" | "submitted";

export type WidgetMemory = {
  status: WidgetStatus;
  autoOpens: number;
  updatedAt: number;
};

const KEY = "fb_widget_v1";
const DRAFT_KEY = "fb_widget_draft";
const MAX_AUTO_OPENS = 2;
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT: WidgetMemory = { status: "new", autoOpens: 0, updatedAt: 0 };

export function readMemory(): WidgetMemory {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<WidgetMemory>;
    return {
      status: parsed.status ?? "new",
      autoOpens: parsed.autoOpens ?? 0,
      updatedAt: parsed.updatedAt ?? 0,
    };
  } catch {
    return DEFAULT;
  }
}

export function writeMemory(patch: Partial<WidgetMemory>): WidgetMemory {
  const next: WidgetMemory = {
    ...readMemory(),
    ...patch,
    updatedAt: Date.now(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode / quota) — degrade gracefully */
  }
  return next;
}

/** Whether the widget may auto-expand on this visit, given prior interactions. */
export function shouldAutoOpen(mem: WidgetMemory): boolean {
  if (mem.status === "submitted") return false;
  if (mem.autoOpens >= MAX_AUTO_OPENS) return false;
  if (
    mem.status === "dismissed" &&
    Date.now() - mem.updatedAt < DISMISS_COOLDOWN_MS
  ) {
    return false;
  }
  return true;
}

export function readDraft(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeDraft(value: string): void {
  try {
    if (value) window.localStorage.setItem(DRAFT_KEY, value);
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable — draft persistence is best-effort */
  }
}
