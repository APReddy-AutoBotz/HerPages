import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    environment: "node",
  globals: false,
  pool: "forks",
  isolate: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/__tests__/**", "src/**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@herpages/contracts": "../contracts/src/index.ts",
      "@herpages/vault-port": "../vault-port/src/index.ts",
    },
  },
});
