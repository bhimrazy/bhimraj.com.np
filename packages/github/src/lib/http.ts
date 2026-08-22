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
        // GitHub answers a tripped secondary rate limit with 403, not 429 —
        // the sync fans several fetchers out at once and does hit it. Retrying
        // a genuine permission 403 costs two backed-off attempts and still
        // ends in the same failure, so treat the whole status as retryable.
        retryable:
          res.status === 403 ||
          res.status === 408 ||
          res.status === 429 ||
          res.status >= 500,
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
