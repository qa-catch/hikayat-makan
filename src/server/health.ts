import type { PrismaClient } from "./db/generated/client";

// Aucun détail d'erreur dans la réponse : l'endpoint est public.
export async function healthResponse(db: Pick<PrismaClient, "$queryRaw">): Promise<Response> {
  let ok = true;
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    ok = false;
  }
  return Response.json(
    { status: ok ? "ok" : "unavailable" },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
