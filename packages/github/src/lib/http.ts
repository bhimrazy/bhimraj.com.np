import { Effect } from "effect";
import type { z } from "zod";

const DEFAULT_TIMEOUT_MS = 5000;

export class HttpError extends Error {
  readonly retryable: boolean;
  readonly status?: number;

  constructor(
    message: string,
    options: { retryable?: boolean; status?: number } = {},
  ) {
    super(message);
    this.name = "HttpError";
    this.retryable = options.retryable ?? false;
    this.status = options.status;
  }
}

export function isRetryableHttpError(error: HttpError) {
  return error.retryable;
}

function toHttpError(error: unknown) {
  return error instanceof HttpError
    ? error
    : new HttpError("Request failed", { retryable: true });
}

export function fetchEffect(
  url: URL | string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  return Effect.tryPromise({
    try: async () => {
      const res = await fetch(url, init);
      if (res.ok) return res;

      throw new HttpError(`Request returned ${res.status}`, {
        retryable:
          res.status === 408 || res.status === 429 || res.status >= 500,
        status: res.status,
      });
    },
    catch: toHttpError,
  }).pipe(
    Effect.timeoutFail({
      duration: `${timeoutMs} millis`,
      onTimeout: () => new HttpError("Request timed out"),
    }),
  );
}

export function jsonEffect<T>(
  res: Response,
  schema: z.ZodType<T>,
): Effect.Effect<T, HttpError> {
  return Effect.tryPromise({
    try: async () => {
      const json = await res.json();
      const parsed = schema.safeParse(json);
      if (parsed.success) return parsed.data;

      throw new HttpError("Invalid response");
    },
    catch: toHttpError,
  });
}
