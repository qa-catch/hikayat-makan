import { describe, expect, it, vi } from "vitest";
import { clientErrorResponse } from "./client-errors";
import type { Logger } from "./logger";
import { createRateLimiter } from "./rate-limit";

function setup(limit = 20) {
  const logger: Logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const limiter = createRateLimiter(limit, 60_000);
  const post = (body: BodyInit, headers: Record<string, string> = {}) =>
    clientErrorResponse(
      new Request("http://localhost/api/v1/client-errors", {
        method: "POST",
        headers: { "content-type": "application/json", "x-real-ip": "1.2.3.4", ...headers },
        body,
      }),
      { limiter, logger },
    );
  return { logger, post };
}

describe("clientErrorResponse", () => {
  it("journalise l'erreur sans requête ni fragment d'URL, réponse 204 vide", async () => {
    const { logger, post } = setup();
    const res = await post(
      JSON.stringify({ message: "boom", url: "https://x.test/ar?token=abc#frag" }),
    );
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        module: "client",
        context: expect.objectContaining({ url: "https://x.test/ar" }),
      }),
    );
  });

  it.each([
    ["JSON invalide", "{", 400],
    ["message absent", JSON.stringify({ stack: "s" }), 400],
    ["message trop long", JSON.stringify({ message: "x".repeat(501) }), 400],
    ["corps trop gros", JSON.stringify({ message: "m", stack: "x".repeat(9_000) }), 413],
  ])("refuse : %s", async (_nom, body, status) => {
    const { logger, post } = setup();
    expect((await post(body)).status).toBe(status);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("refuse un type de contenu autre que JSON", async () => {
    const { post } = setup();
    expect((await post("{}", { "content-type": "text/plain" })).status).toBe(415);
  });

  it("limite le débit par client avec Retry-After", async () => {
    const { logger, post } = setup(1);
    const body = JSON.stringify({ message: "m" });
    expect((await post(body)).status).toBe(204);
    const limited = await post(body);
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect((await post(body, { "x-real-ip": "5.6.7.8" })).status).toBe(204);
  });
});
