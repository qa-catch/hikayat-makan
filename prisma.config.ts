import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 ne charge plus `.env`. Les variables déjà définies (CI) restent prioritaires.
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // La CLI (migrations) exige une connexion directe, sans pooler PgBouncer : en production,
    // DATABASE_URL_UNPOOLED (injectée par Neon). L'application garde DATABASE_URL (avec pooler).
    // `prisma generate` n'a pas besoin de base : pas d'échec si l'URL manque (validée au démarrage : src/server/env.ts).
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
