// Allure Report 3 settings for the portfolio's test results.
// CI generates the report into dist/allure and publishes it with the site at /allure/.
// Locally: ALLURE=1 npx playwright test && npx allure generate ./allure-results && npx allure open
import { defineConfig } from "allure";
import { env } from "node:process";

export default defineConfig({
  name: "Tabeeda Shakir · Portfolio quality report",
  output: env.ALLURE_OUTPUT || "./allure-report",
  // Trends and flaky-test detection across deploys. CI fetches the previous file from the live site.
  historyPath: "./allure-history.jsonl",
  plugins: {
    awesome: {
      options: {
        reportName: "Tabeeda Shakir · Portfolio quality report",
        reportLanguage: "en",
        groupBy: ["epic", "feature", "story"],
      },
    },
  },
});
