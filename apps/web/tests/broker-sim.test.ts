import { describe, expect, it } from "vitest";
import {
  advance,
  type BrokerState,
  brokerReducer,
  initialBrokerState,
  lag,
  retainedOffsets,
} from "@/components/mdx/events/broker-sim";

const consumer = (s: BrokerState, id: string) => {
  const c = s.consumers.find((c) => c.id === id);
  if (!c) throw new Error(`no consumer ${id}`);
  return c;
};

describe("brokerReducer", () => {
  it("publishes and delivers each event to every subscriber", () => {
    const s = advance(initialBrokerState("pubsub"), 20);
    expect(s.nextOffset).toBeGreaterThan(0);
    for (const c of s.consumers) expect(lag(s, c)).toBeLessThanOrEqual(1);
  });

  it("pub/sub deletes events once every subscriber consumed them", () => {
    const s = advance(initialBrokerState("pubsub"), 20);
    expect(s.head).toBe(Math.min(...s.consumers.map((c) => c.offset)));
    expect(retainedOffsets(s).length).toBeLessThanOrEqual(1);
  });

  it("keeps a paused subscriber's backlog in the broker", () => {
    let s = advance(initialBrokerState("pubsub"), 4);
    s = brokerReducer(s, { type: "togglePause", id: "C2" });
    s = advance(s, 10);
    const c2 = consumer(s, "C2");
    expect(lag(s, c2)).toBeGreaterThan(3);
    expect(s.head).toBe(c2.offset);
    expect(lag(s, consumer(s, "C1"))).toBeLessThanOrEqual(1);
  });

  it("lets a resumed subscriber catch up", () => {
    let s = brokerReducer(initialBrokerState("pubsub"), {
      type: "togglePause",
      id: "C2",
    });
    s = advance(s, 10);
    s = brokerReducer(s, { type: "togglePause", id: "C2" });
    s = advance(s, 30);
    expect(lag(s, consumer(s, "C2"))).toBeLessThanOrEqual(1);
  });

  it("streaming retains consumed events up to the retention limit", () => {
    const s = advance(initialBrokerState("stream", ["C1", "C2"], 6), 30);
    expect(retainedOffsets(s)).toHaveLength(6);
    expect(s.head).toBe(s.nextOffset - 6);
    for (const c of s.consumers) expect(c.offset).toBeGreaterThan(s.head);
  });

  it("streaming consumers can replay from the earliest retained event", () => {
    let s = advance(initialBrokerState("stream"), 12);
    s = brokerReducer(s, { type: "replay", id: "C1" });
    expect(consumer(s, "C1").offset).toBe(s.head);
    expect(consumer(s, "C2").offset).toBeGreaterThan(s.head);
  });

  it("ignores replay in pub/sub, where consumed events are gone", () => {
    const s = advance(initialBrokerState("pubsub"), 12);
    expect(brokerReducer(s, { type: "replay", id: "C1" })).toBe(s);
  });

  it("drops already-consumed events when switching to pub/sub", () => {
    let s = advance(initialBrokerState("stream"), 12);
    expect(retainedOffsets(s).length).toBeGreaterThan(2);
    s = brokerReducer(s, { type: "setMode", mode: "pubsub" });
    expect(s.head).toBe(Math.min(...s.consumers.map((c) => c.offset)));
  });

  it("moves a consumer that fell out of the retention window forward", () => {
    let s = brokerReducer(initialBrokerState("stream", ["C1", "C2"], 4), {
      type: "togglePause",
      id: "C2",
    });
    s = advance(s, 20);
    expect(consumer(s, "C2").offset).toBe(s.head);
  });

  it("reset keeps the mode and consumers", () => {
    let s = advance(initialBrokerState("stream"), 5);
    s = brokerReducer(s, { type: "reset" });
    expect(s).toEqual(initialBrokerState("stream"));
  });
});
