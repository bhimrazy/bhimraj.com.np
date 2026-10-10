/**
 * Deterministic model of the post's two messaging styles.
 * - pubsub: an event is deleted once every subscriber has read it.
 * - stream: events are retained; consumers keep their own offset and can replay.
 */

export type Mode = "pubsub" | "stream";

export interface Consumer {
  id: string;
  paused: boolean;
  offset: number;
}

interface Delivery {
  consumerId: string;
  offset: number;
}

export interface BrokerState {
  mode: Mode;
  tick: number;
  /** Offset the next published event gets. */
  nextOffset: number;
  /** Earliest event the broker still holds. */
  head: number;
  retention: number;
  consumers: Consumer[];
  /** What happened on the last tick (drives the animation). */
  published: number | null;
  delivered: Delivery[];
}

export type BrokerAction =
  | { type: "tick" }
  | { type: "setMode"; mode: Mode }
  | { type: "togglePause"; id: string }
  | { type: "replay"; id: string };

/** Publish ticks (~0.6 events/tick vs 1 read/tick), so a lagging consumer catches up. */
const PUBLISH_PATTERN = [1, 0, 1, 1, 0, 1, 0, 1, 0, 1] as const;

export function initialBrokerState(
  mode: Mode = "pubsub",
  consumerIds: readonly string[] = ["C1", "C2"],
  retention = 10,
): BrokerState {
  return {
    mode,
    tick: 0,
    nextOffset: 0,
    head: 0,
    retention,
    consumers: consumerIds.map((id) => ({ id, paused: false, offset: 0 })),
    published: null,
    delivered: [],
  };
}

/** Events a consumer still has to read. */
export function lag(state: BrokerState, consumer: Consumer) {
  return state.nextOffset - consumer.offset;
}

/** Offsets currently held by the broker, oldest first. */
export function retainedOffsets(state: BrokerState) {
  const out: number[] = [];
  for (let o = state.head; o < state.nextOffset; o++) out.push(o);
  return out;
}

function trim(state: BrokerState): BrokerState {
  // Pub/sub deletes what every subscriber has consumed; a stream keeps `retention`.
  const keepFrom =
    state.mode === "pubsub"
      ? Math.min(state.nextOffset, ...state.consumers.map((c) => c.offset))
      : state.nextOffset - state.retention;
  const head = Math.max(state.head, keepFrom);
  // A consumer that fell behind the retention window skips ahead.
  const consumers = state.consumers.map((c) =>
    c.offset < head ? { ...c, offset: head } : c,
  );
  return { ...state, head, consumers };
}

export function brokerReducer(
  state: BrokerState,
  action: BrokerAction,
): BrokerState {
  switch (action.type) {
    case "tick": {
      const delivered: Delivery[] = [];
      const consumers = state.consumers.map((c) => {
        if (c.paused || c.offset >= state.nextOffset) return c;
        delivered.push({ consumerId: c.id, offset: c.offset });
        return { ...c, offset: c.offset + 1 };
      });
      const publishes =
        PUBLISH_PATTERN[state.tick % PUBLISH_PATTERN.length] === 1;
      return trim({
        ...state,
        tick: state.tick + 1,
        consumers,
        nextOffset: state.nextOffset + (publishes ? 1 : 0),
        published: publishes ? state.nextOffset : null,
        delivered,
      });
    }
    case "setMode":
      if (action.mode === state.mode) return state;
      return trim({
        ...state,
        mode: action.mode,
        published: null,
        delivered: [],
      });
    case "togglePause":
      return {
        ...state,
        published: null,
        delivered: [],
        consumers: state.consumers.map((c) =>
          c.id === action.id ? { ...c, paused: !c.paused } : c,
        ),
      };
    case "replay":
      // Only a retained log can be replayed.
      if (state.mode !== "stream") return state;
      return {
        ...state,
        published: null,
        delivered: [],
        consumers: state.consumers.map((c) =>
          c.id === action.id ? { ...c, offset: state.head } : c,
        ),
      };
  }
}

/** Run `n` ticks from a state (used for the server-rendered first frame). */
export function advance(state: BrokerState, n: number) {
  let s = state;
  for (let i = 0; i < n; i++) s = brokerReducer(s, { type: "tick" });
  return s;
}
