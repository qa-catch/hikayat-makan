import pino, { type DestinationStream } from "pino";
import { maskString, maskValue } from "./mask";
import { getRequestId } from "./request-context";

export type LogEntry = {
  module: string;
  action: string;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
};

export type Logger = {
  info(entry: LogEntry): void;
  warn(entry: LogEntry): void;
  error(entry: LogEntry): void;
};

// JSON sur la sortie standard, sans transport (donc sans thread) : champs du § 14.
// Seul ce wrapper est exporté : tout passe par le masquage.
export function createLogger(destination?: DestinationStream): Logger {
  const base = pino(
    {
      base: undefined,
      messageKey: "message",
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      formatters: { level: (label) => ({ level: label.toUpperCase() }) },
    },
    destination,
  );

  const write = (level: "info" | "warn" | "error", entry: LogEntry): void => {
    const requestId = entry.requestId ?? getRequestId();
    base[level](
      {
        module: entry.module,
        action: entry.action,
        ...(entry.context && { context: maskValue(entry.context) }),
        ...(entry.userId && { userId: entry.userId }),
        ...(requestId && { requestId }),
      },
      maskString(entry.message),
    );
  };

  return {
    info: (entry) => write("info", entry),
    warn: (entry) => write("warn", entry),
    error: (entry) => write("error", entry),
  };
}

export const logger = createLogger();
