import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("refuse au-delà de la limite puis rouvre à la fin de la fenêtre", () => {
    const limiter = createRateLimiter(2, 1_000);
    expect(limiter("a", 0).allowed).toBe(true);
    expect(limiter("a", 10).allowed).toBe(true);
    expect(limiter("a", 20)).toEqual({ allowed: false, retryAfterSec: 1 });
    expect(limiter("a", 1_000).allowed).toBe(true);
  });

  it("compte chaque clé séparément", () => {
    const limiter = createRateLimiter(1, 1_000);
    expect(limiter("a", 0).allowed).toBe(true);
    expect(limiter("b", 0).allowed).toBe(true);
    expect(limiter("a", 1).allowed).toBe(false);
  });
});
