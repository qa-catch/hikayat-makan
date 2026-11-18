import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // Tests d'intégration (base requise) : `pnpm test:int`.
    exclude: [...configDefaults.exclude, "src/**/*.int.test.ts"],
  },
});
