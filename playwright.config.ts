import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 4321);
const CI = !!process.env.CI;
// ALLURE=1 also writes Allure results (CI turns it on; the report is published at /allure/).
const ALLURE = !!process.env.ALLURE;
const allure: [string, Record<string, unknown>][] = ALLURE
  ? [
      [
        "allure-playwright",
        {
          resultsDir: "allure-results",
          environmentInfo: { Site: "https://tabee1999.github.io", Browsers: "Chrome, Firefox, mobile Chrome (Pixel 7)", "Node.js": process.version },
        },
      ],
    ]
  : [];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: CI,
  // One retry in CI: a test that only passes on retry is still reported as "flaky",
  // and the retry records a trace so it can be debugged.
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [["html", { open: "never" }], ["github"], ["list"], ...allure] : [["html", { open: "never" }], ["list"], ...allure],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Makes scroll reveals, count-ups and smooth scrolling instant, so assertions don't race them.
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `node scripts/build.mjs && node scripts/serve.mjs --port ${PORT} --dir dist`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
