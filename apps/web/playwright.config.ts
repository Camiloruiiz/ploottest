import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const forceDemo = process.env.PLOOTTEST_FORCE_DEMO === "1";
const workers = process.env.PLOOTTEST_SERIAL === "1" ? 1 : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers,
  snapshotPathTemplate: "{testDir}/../regressions/{testFilePath}/{arg}-{projectName}-{platform}{ext}",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `${forceDemo ? "PLOOTTEST_FORCE_DEMO=1 " : ""}pnpm exec next dev --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
