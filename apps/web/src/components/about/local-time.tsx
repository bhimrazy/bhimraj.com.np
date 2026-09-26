"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kathmandu",
});

/**
 * Current time in Kathmandu, so collaborators can tell at a glance whether a
 * message will land during the day. Renders a placeholder until mounted — the
 * clock is client-only, so the server output stays static.
 */
export function KathmanduTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}
