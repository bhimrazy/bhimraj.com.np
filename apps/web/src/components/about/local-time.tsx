"use client";

import { type ReactNode, useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kathmandu",
});

/** The clock is client-only; `null` until mounted keeps the server output static. */
function useKathmanduTime(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

/**
 * Current time in Kathmandu, so collaborators can tell at a glance whether a
 * message will land during the day. Shows a placeholder until mounted.
 */
export function KathmanduTime() {
  const time = useKathmanduTime();
  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

/** A whole pill around the clock; rendered only once the time is known. */
export function KathmanduTimePill({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const time = useKathmanduTime();
  if (!time) return null;
  return (
    <p className={className}>
      <span className="text-site-accent tabular-nums">{time}</span>
      {children}
    </p>
  );
}
