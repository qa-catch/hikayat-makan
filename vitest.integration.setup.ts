import { execSync } from "node:child_process";
import pg from "pg";

// Repart d'une base vide puis applique les migrations, comme sur une base neuve.
export default async function setup(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url || !new URL(url).pathname.endsWith("_test")) {
    throw new Error("TEST_DATABASE_URL doit viser une base dont le nom finit par _test.");
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
  } finally {
    await client.end();
  }
  execSync("pnpm exec prisma migrate deploy", { stdio: "inherit", env: process.env });
}
