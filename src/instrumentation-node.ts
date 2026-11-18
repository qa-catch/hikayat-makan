import { getEnv } from "./server/env";
import { logger } from "./server/logging/logger";

// Configuration incomplète : on arrête le processus (sinon Next.js reste debout et répond 500 à tout).
export function checkEnv(): void {
  try {
    getEnv();
  } catch (error) {
    logger.error({
      module: "config",
      action: "check-env",
      message: error instanceof Error ? error.message : "Configuration invalide",
    });
    process.exit(1);
  }
}

export function logRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routeType: string; routePath: string },
): void {
  // `digest` relie le log au message générique affiché par Next.js ; pas de requestId ici (voir T6).
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;
  logger.error({
    module: "http",
    action: "request-error",
    message: "Erreur serveur non gérée",
    context: {
      method: request.method,
      path: request.path.replace(/[?#][\s\S]*$/, ""),
      routeType: context.routeType,
      routePath: context.routePath,
      digest,
      error,
    },
  });
}
