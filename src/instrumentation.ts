import type { Instrumentation } from "next";

// Appelé une fois au démarrage du serveur. Le code Node.js est isolé : il n'existe pas en Edge.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { checkEnv } = await import("./instrumentation-node");
    checkEnv();
  }
}

// Erreurs serveur hors route handlers (rendu, actions) ; les route handlers sont couverts par withRequestId.
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { logRequestError } = await import("./instrumentation-node");
  logRequestError(error, request, context);
};
