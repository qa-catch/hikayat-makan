import { logger } from "./logger";
import { runWithRequestId } from "./request-context";

type Handler<A extends unknown[]> = (request: Request, ...args: A) => Response | Promise<Response>;

// Enveloppe d'un route handler : un `requestId` par requête (jamais repris du client, qui peut le
// forger), renvoyé dans `x-request-id`. Toute exception est journalisée, la réponse 500 reste neutre.
export function withRequestId<A extends unknown[]>(handler: Handler<A>): Handler<A> {
  return (request, ...args) => {
    const requestId = crypto.randomUUID();
    return runWithRequestId(requestId, async () => {
      let response: Response;
      try {
        response = await handler(request, ...args);
      } catch (error) {
        logger.error({
          module: "http",
          action: "unhandled-error",
          message: "Exception non gérée dans un route handler",
          context: { method: request.method, path: new URL(request.url).pathname, error },
        });
        response = Response.json({ error: "internal_error", requestId }, { status: 500 });
      }
      // Les en-têtes d'une réponse issue de `fetch` ou `Response.redirect` sont immuables.
      const headers = new Headers(response.headers);
      headers.set("x-request-id", requestId);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    });
  };
}
