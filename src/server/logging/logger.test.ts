import { describe, expect, it, vi } from "vitest";
import { createLogger } from "./logger";
import { runWithRequestId } from "./request-context";

function capture() {
  const lines: string[] = [];
  const sink = (line: string) => void lines.push(line);
  const logger = createLogger({ info: sink, warn: sink, error: sink });
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

  it("passe chaque niveau à sa méthode console (niveau lu par Vercel)", () => {
    const sinks = { info: [] as string[], warn: [] as string[], error: [] as string[] };
    const logger = createLogger({
      info: (line) => void sinks.info.push(line),
      warn: (line) => void sinks.warn.push(line),
      error: (line) => void sinks.error.push(line),
    });
    logger.info({ module: "m", action: "a", message: "i" });
    logger.warn({ module: "m", action: "a", message: "w" });
    logger.error({ module: "m", action: "a", message: "e" });
    const levels = (lines: string[]) =>
      lines.map((l) => (JSON.parse(l) as { level: string }).level);
    expect(levels(sinks.info)).toEqual(["INFO"]);
    expect(levels(sinks.warn)).toEqual(["WARN"]);
    expect(levels(sinks.error)).toEqual(["ERROR"]);
    expect(sinks.error[0]).not.toMatch(/\n$/);
  });

  it("écrit par défaut via console.error pour une erreur", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    createLogger().error({ module: "m", action: "a", message: "e" });
    expect(spy).toHaveBeenCalledOnce();
    expect(JSON.parse(spy.mock.calls[0]![0] as string)).toMatchObject({ level: "ERROR" });
    spy.mockRestore();
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
