import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";
import { getRequestId } from "./request-context";
import { withRequestId } from "./with-request-id";

const request = new Request("http://localhost/api/v1/x?secret=1");

afterEach(() => vi.restoreAllMocks());

describe("withRequestId", () => {
  it("expose un requestId au handler et dans x-request-id", async () => {
    let seen: string | undefined;
    const res = await withRequestId(() => {
      seen = getRequestId();
      return new Response("ok");
    })(request);
    expect(seen).toMatch(/^[0-9a-f-]{36}$/);
    expect(res.headers.get("x-request-id")).toBe(seen);
    expect(await res.text()).toBe("ok");
  });

  it("ignore un x-request-id fourni par le client", async () => {
    const res = await withRequestId(() => new Response(null))(
      new Request(request, { headers: { "x-request-id": "forgé" } }),
    );
    expect(res.headers.get("x-request-id")).not.toBe("forgé");
  });

  it("journalise une exception avec le requestId et répond 500 sans détail", async () => {
    const error = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const res = await withRequestId(() => {
      throw new Error("détail interne");
    })(request);
    const body = (await res.json()) as { error: string; requestId: string };
    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "internal_error", requestId: res.headers.get("x-request-id") });
    expect(JSON.stringify(body)).not.toContain("détail interne");
    expect(error).toHaveBeenCalledOnce();
    expect(JSON.stringify(error.mock.calls[0])).not.toContain("secret=1");
  });
});
