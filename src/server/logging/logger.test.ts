import { describe, expect, it } from "vitest";
import { createLogger } from "./logger";
import { runWithRequestId } from "./request-context";

function capture() {
  const lines: string[] = [];
  const sink = { write: (chunk: string) => void lines.push(chunk) };
  const logger = createLogger({ out: sink, err: sink });
  return { logger, parsed: () => lines.map((l) => JSON.parse(l) as Record<string, unknown>) };
}

describe("logger", () => {
  it("écrit une ligne JSON avec les champs du § 14", () => {
    const { logger, parsed } = capture();
    logger.warn({ module: "auth", action: "login", message: "échec", userId: "u1" });
    const [line] = parsed();
    expect(line).toMatchObject({
      level: "WARN",
      module: "auth",
      action: "login",
      message: "échec",
      userId: "u1",
    });
    expect(new Date(line!.timestamp as string).toISOString()).toBe(line!.timestamp);
    expect(line).not.toHaveProperty("pid");
    expect(line).not.toHaveProperty("hostname");
  });

  it.each(["info", "warn", "error"] as const)("niveau %s en majuscules", (level) => {
    const { logger, parsed } = capture();
    logger[level]({ module: "m", action: "a", message: "x" });
    expect(parsed()[0]!.level).toBe(level.toUpperCase());
  });

  it("envoie info sur stdout, warn et error sur stderr (niveau lu par Vercel)", () => {
    const out: string[] = [];
    const err: string[] = [];
    const logger = createLogger({
      out: { write: (chunk: string) => void out.push(chunk) },
      err: { write: (chunk: string) => void err.push(chunk) },
    });
    logger.info({ module: "m", action: "a", message: "i" });
    logger.warn({ module: "m", action: "a", message: "w" });
    logger.error({ module: "m", action: "a", message: "e" });
    const levels = (lines: string[]) =>
      lines.map((l) => (JSON.parse(l) as { level: string }).level);
    expect(levels(out)).toEqual(["INFO"]);
    expect(levels(err)).toEqual(["WARN", "ERROR"]);
  });

  it("ajoute le requestId du contexte de requête", () => {
    const { logger, parsed } = capture();
    runWithRequestId("req-1", () => logger.info({ module: "m", action: "a", message: "x" }));
    logger.info({ module: "m", action: "a", message: "hors requête" });
    expect(parsed()[0]!.requestId).toBe("req-1");
    expect(parsed()[1]).not.toHaveProperty("requestId");
  });

  it("masque secrets et données personnelles dans le contexte et le message", () => {
    const { logger, parsed } = capture();
    logger.error({
      module: "db",
      action: "connect",
      message: "échec postgresql://u:s3cret@h/db pour jean@example.com",
      context: { password: "hunter2", error: new Error("jeton Bearer abc123") },
    });
    const raw = JSON.stringify(parsed());
    for (const leaked of ["s3cret", "jean@example.com", "hunter2", "abc123"]) {
      expect(raw).not.toContain(leaked);
    }
  });
});
