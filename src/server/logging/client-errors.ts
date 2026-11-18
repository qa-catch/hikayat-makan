import { z } from "zod";
import type { Logger } from "./logger";
import type { RateLimiter } from "./rate-limit";

const MAX_BODY_BYTES = 8 * 1024;

const payloadSchema = z.object({
  message: z.string().min(1).max(500),
  stack: z.string().max(4_000).optional(),
  url: z.string().max(500).optional(),
});

const noContent = (status: number, headers?: HeadersInit): Response =>
  new Response(null, { status, headers });

// Derrière le proxy de l'hébergeur ces en-têtes sont posés par lui ; en accès direct ils sont
// falsifiables et la limite devient contournable. À revoir au choix de l'hébergeur (T9).
function clientKey(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "inconnu"
  );
}

// Lit le corps en s'arrêtant dès que la limite est dépassée (Content-Length peut manquer ou mentir).
async function readLimited(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}

// Sans requête ni fragment : ils peuvent porter un jeton ou une donnée personnelle.
function stripQuery(url: string): string {
  return url.replace(/[?#][\s\S]*$/, "");
}

// Réponse toujours vide : rien de la saisie n'est renvoyé.
export async function clientErrorResponse(
  request: Request,
  deps: { limiter: RateLimiter; logger: Logger },
): Promise<Response> {
  const { allowed, retryAfterSec } = deps.limiter(clientKey(request));
  if (!allowed) return noContent(429, { "Retry-After": String(retryAfterSec) });

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return noContent(415);
  }
  const body = await readLimited(request);
  if (body === null) return noContent(413);

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return noContent(400);
  }
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) return noContent(400);

  const { message, stack, url } = parsed.data;
  deps.logger.error({
    module: "client",
    action: "client-error",
    message: "Erreur JavaScript côté client",
    context: { clientMessage: message, stack, url: url && stripQuery(url) },
  });
  return noContent(204);
}
