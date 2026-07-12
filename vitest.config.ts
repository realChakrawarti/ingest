import react from "@vitejs/plugin-react";
import { preview } from "@vitest/browser-preview";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.browser.test.{ts,tsx}"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.{ts,tsx}"],
          setupFiles: ["./vitest.browser.setup.ts"],
          browser: {
            enabled: true,
            provider: preview(),
            instances: [{ browser: "chromium" }],
          },
          // Preview provider is intended for local inspection only.
          ...(isCI ? { include: [] } : {}),
        },
      },
    ],
  },
});
