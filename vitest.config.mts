import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    // Tests d'intégration (base requise) : `pnpm test:int`.
    exclude: [...configDefaults.exclude, "src/**/*.int.test.ts"],
  },
});
