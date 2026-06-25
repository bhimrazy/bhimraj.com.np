/**
 * Tiny structured console logger.
 *
 * Usage — define the prefix once, then reuse the handle everywhere:
 *
 *   const log = createLogger("[github]");
 *   log.info("stars fetched", { count: 42 });
 *   log.warn("request failed", { status: 429 }, error);
 *
 * Every line is prefixed and emitted as `(message, context)` so logs stay
 * greppable and machine-parseable.
 */

/** Structured fields attached to a log line (kept primitive so it serializes cleanly). */
type LogContext = Record<string, boolean | number | string | undefined>;

type Logger = {
  error: (event: string, context?: LogContext, error?: unknown) => void;
  info: (event: string, context?: LogContext) => void;
  warn: (event: string, context?: LogContext, error?: unknown) => void;
  /** Returns a child logger whose prefix is appended to this one's. */
  withPrefix: (prefix: string) => Logger;
};

/** Reduce an unknown thrown value to a loggable message (or nothing). */
function serializeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

/**
 * Creates a logger that prepends `prefix` to every event. Pass a label like
 * `"[github]"` so the source is obvious at a glance.
 */
export function createLogger(prefix = ""): Logger {
  const formatEvent = (event: string) =>
    [prefix, event].filter(Boolean).join(" ");

  return {
    error(event, context = {}, error) {
      console.error(formatEvent(event), {
        ...context,
        error: serializeError(error),
      });
    },
    info(event, context = {}) {
      console.info(formatEvent(event), context);
    },
    warn(event, context = {}, error) {
      console.warn(formatEvent(event), {
        ...context,
        error: serializeError(error),
      });
    },
    withPrefix(nextPrefix) {
      return createLogger(formatEvent(nextPrefix));
    },
  };
}

/** Unprefixed default logger for quick, one-off use. */
export const logger = createLogger();

export type { LogContext, Logger };
