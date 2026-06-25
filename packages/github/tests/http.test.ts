import { describe, expect, it } from "vitest";
import { HttpError, isRetryableHttpError } from "../src/lib/http";

describe("HttpError", () => {
  it("defaults to non-retryable with no status", () => {
    const error = new HttpError("boom");
    expect(error.name).toBe("HttpError");
    expect(error.retryable).toBe(false);
    expect(error.status).toBeUndefined();
  });

  it("carries the retryable flag and status when provided", () => {
    const error = new HttpError("warming", { retryable: true, status: 202 });
    expect(error.retryable).toBe(true);
    expect(error.status).toBe(202);
  });
});

describe("isRetryableHttpError", () => {
  it("is true only for errors flagged retryable", () => {
    expect(isRetryableHttpError(new HttpError("x", { retryable: true }))).toBe(
      true,
    );
    expect(isRetryableHttpError(new HttpError("x"))).toBe(false);
  });
});
