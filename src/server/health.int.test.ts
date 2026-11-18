import { afterAll, describe, expect, it } from "vitest";
import { GET } from "@/app/api/v1/health/route";
import { createPrismaClient, prisma } from "./db/client";
import { healthResponse } from "./health";

// Port 1 : rien n'y écoute, la connexion est refusée comme pour une base coupée.
const down = createPrismaClient("postgresql://hikayat:x@127.0.0.1:1/hikayat_test");

afterAll(() => Promise.all([prisma.$disconnect(), down.$disconnect()]));

describe("GET /api/v1/health", () => {
  it("renvoie 200 quand la base répond", async () => {
    const res = await GET(new Request("http://localhost/api/v1/health"));
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("renvoie 503 quand la base est coupée", async () => {
    const res = await healthResponse(down);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ status: "unavailable" });
  });
});

describe("migrations", () => {
  it("s'appliquent sur une base vide", async () => {
    const rows = await prisma.$queryRaw<{ migration_name: string }[]>`
      SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL`;
    expect(rows.map((r) => r.migration_name)).toContainEqual(expect.stringMatching(/_init$/));
  });
});
