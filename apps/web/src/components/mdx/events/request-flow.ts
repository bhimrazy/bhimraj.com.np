/**
 * Timelines for the ride-pricing example in
 * `content/blog/event-driven-architecture.mdx`: A manages driver
 * availability, B manages ride demand, C prices a ride from both.
 *
 * Time is in "network hops" (one message = 1 unit, plus a little processing
 * between hops); it is illustrative, not measured.
 */

export interface Message {
  from: string;
  to: string;
  label: string;
  start: number;
  end: number;
  /** Published on the service's own schedule, not part of the customer's request. */
  background?: boolean;
}

export interface Lane {
  title: string;
  actors: readonly string[];
  messages: readonly Message[];
  /** When the customer's request is sent and when the price comes back. */
  wait: { start: number; end: number; hops: number };
}

/** Processing time between receiving one message and sending the next. */
const GAP = 0.4;

/** Back-to-back hops starting at t = 0, each 1 unit long. */
function chain(hops: [from: string, to: string, label: string][]): Message[] {
  return hops.map(([from, to, label], i) => {
    const start = i * (1 + GAP);
    return { from, to, label, start, end: start + 1 };
  });
}

const requestHops = chain([
  ["customer", "C", "price?"],
  ["C", "A", "drivers?"],
  ["A", "C", "availability"],
  ["C", "B", "demand?"],
  ["B", "C", "demand"],
  ["C", "customer", "price"],
]);

export const REQUEST_DRIVEN: Lane = {
  title: "Request-driven",
  actors: ["customer", "C", "A", "B"],
  messages: requestHops,
  wait: { start: 0, end: requestHops.at(-1)?.end ?? 0, hops: 6 },
};

const eventHops = chain([
  ["customer", "C", "price?"],
  ["C", "customer", "price"],
]);

/** A and B publish changes to the stream; C, subscribed, keeps the latest. */
const published = [
  { from: "A", start: 0.3, label: "drivers" },
  { from: "B", start: 2.9, label: "demand" },
  { from: "A", start: 5.5, label: "drivers" },
].flatMap(({ from, start, label }): Message[] => [
  { from, to: "stream", label, start, end: start + 0.8, background: true },
  {
    from: "stream",
    to: "C",
    label: "",
    start: start + 1,
    end: start + 1.8,
    background: true,
  },
]);

export const EVENT_DRIVEN: Lane = {
  title: "Event-driven",
  actors: ["customer", "C", "stream", "A", "B"],
  messages: [...eventHops, ...published],
  wait: { start: 0, end: eventHops.at(-1)?.end ?? 0, hops: 2 },
};

export const DURATION = 8.2;

/** 0 before a message is sent, 1 once it has arrived. */
export function progress(message: Pick<Message, "start" | "end">, t: number) {
  if (t <= message.start) return 0;
  if (t >= message.end) return 1;
  return (t - message.start) / (message.end - message.start);
}
