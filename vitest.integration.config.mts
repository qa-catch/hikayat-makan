import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

if (existsSync(".env")) process.loadEnvFile(".env");
// Les tests et le setup ne voient que la base de test.
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? "";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["src/**/*.int.test.ts"],
    globalSetup: ["./vitest.integration.setup.ts"],
    fileParallelism: false,
  },
});
