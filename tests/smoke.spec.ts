import { test, expect } from "@playwright/test";
import { allureLabels, content, watchErrors } from "./helpers";

// Quick health checks. They run on every push, and every day against the live site
// (BASE_URL=https://tabee1999.github.io npx playwright test --grep @smoke).
const LIVE = !!process.env.BASE_URL;
const { person, caseStudies } = content;

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Live site health", "blocker"));

test.describe("smoke", { tag: "@smoke" }, () => {
  test("home page loads without errors", async ({ page }) => {
    const errors = watchErrors(page);
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(person.name);
    await expect(page.getByTestId("quick-facts")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("every page in the sitemap loads", async ({ page, request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(paths.length).toBe(1 + caseStudies.length);
    for (const path of paths) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("the CV downloads as a PDF", async ({ request }) => {
    const res = await request.get(`/${person.cv}`);
    expect(res.status()).toBe(200);
    expect((await res.body()).subarray(0, 4).toString()).toBe("%PDF");
  });

  test("search and AI crawler files are served", async ({ request }) => {
    for (const file of ["robots.txt", "sitemap.xml", "llms.txt", "google518d6bc8a1697e7c.html"]) {
      expect((await request.get(`/${file}`)).status(), file).toBe(200);
    }
  });

  test("the chat answers a question", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("chat-launcher").click();
    await page.getByRole("button", { name: "How can I contact her?" }).click();
    await expect(page.getByTestId("chat-answer").last()).toContainText(person.email);
  });

  test("the published test reports are online", async ({ request }) => {
    test.skip(!LIVE, "Reports are only published with the live site");
    for (const path of ["/allure/", "/report/"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});
