import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // "server-only" kastar fel utanför Next:s servermiljö, så i tester används en tom modul.
      "server-only": src("test/server-only-stub.ts"),
      "@": src(""),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
