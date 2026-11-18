import pino from "pino";
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

type Level = "info" | "warn" | "error";
type LogSinks = Record<Level, (line: string) => void>;

// Vercel déduit le niveau d'une ligne de la méthode `console.*` appelée, pas du flux ni du champ
// `level` (vercel.com/kb/guide/add-structured-application-logs-to-vercel-functions) : une écriture
// directe sur stderr reste « Info ». Chaque niveau passe donc par sa méthode console.
const consoleSinks: LogSinks = {
  info: (line) => console.log(line),
  warn: (line) => console.warn(line),
  error: (line) => console.error(line),
};

// JSON sans transport (donc sans thread) : champs du § 14. Seul ce wrapper est exporté : tout passe
// par le masquage.
export function createLogger(sinks: LogSinks = consoleSinks): Logger {
  const toSink = (level: Level) => ({
    level,
    // pino termine chaque ligne par « \n », que console ajoute déjà.
    stream: { write: (chunk: string) => sinks[level](chunk.trimEnd()) },
  });
  const base = pino(
    {
      base: undefined,
      messageKey: "message",
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      formatters: { level: (label) => ({ level: label.toUpperCase() }) },
    },
    // `dedupe` : chaque ligne part seulement vers le flux de plus haut niveau qui l'accepte.
    pino.multistream([toSink("info"), toSink("warn"), toSink("error")], { dedupe: true }),
  );

  const write = (level: Level, entry: LogEntry): void => {
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
