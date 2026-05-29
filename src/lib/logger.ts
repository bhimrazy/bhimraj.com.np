type LogContext = Record<string, boolean | number | string | undefined>;
type Logger = {
  error: (event: string, context?: LogContext, error?: unknown) => void;
  info: (event: string, context?: LogContext) => void;
  warn: (event: string, context?: LogContext, error?: unknown) => void;
  withPrefix: (prefix: string) => Logger;
};

function serializeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

function createLogger(prefix = ""): Logger {
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

export const logger = createLogger();

export type { LogContext };
