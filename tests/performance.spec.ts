import { gzipSync } from "node:zlib";
import { test, expect } from "@playwright/test";
import { allPages, allureLabels } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Performance", "normal"));

// Budgets that keep the site quick on cheap phones and slow connections. Sizes are gzipped,
// which is how GitHub Pages sends them.
const KB = 1024;
const budget = { homeJs: 50 * KB, pageJs: 40 * KB, css: 20 * KB };

test.describe("page weight", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Sizes don't depend on the browser");

  test("every page stays within its JavaScript budget", async ({ page, request }) => {
    const over: string[] = [];
    for (const path of allPages) {
      const scripts = new Set<string>();
      page.on("request", (r) => {
        if (r.resourceType() === "script" && r.url().includes("/assets/")) scripts.add(r.url());
      });
      await page.goto(path, { waitUntil: "load" });
      page.removeAllListeners("request");
      let total = 0;
      for (const url of scripts) total += gzipSync(await (await request.get(url)).body()).length;
      const limit = path === "/" ? budget.homeJs : budget.pageJs;
      if (total > limit) over.push(`${path}: ${(total / KB).toFixed(1)} kB (budget ${limit / KB} kB)`);
    }
    expect(over).toEqual([]);
  });

  test("the chat code downloads only when someone reaches for the chat", async ({ page }) => {
    const loaded: string[] = [];
    page.on("request", (r) => {
      if (r.resourceType() === "script") loaded.push(r.url());
    });
    await page.goto("/about/", { waitUntil: "load" });
    const before = loaded.length;
    await page.getByTestId("chat-launcher").click();
    await expect(page.getByRole("dialog", { name: "Ask about Tabeeda" })).toBeVisible();
    expect(loaded.length).toBeGreaterThan(before);
  });

  test("fonts come from this site, with nothing loaded from other servers", async ({ page }) => {
    const urls: string[] = [];
    page.on("request", (r) => urls.push(r.url()));
    await page.goto("/", { waitUntil: "load" });
    const origin = new URL(page.url()).origin;
    expect(urls.filter((u) => !u.startsWith(origin) && !u.startsWith("data:"))).toEqual([]);
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""));
    });
    expect(fonts).toContain("Schibsted Grotesk");
  });

  test("the stylesheet stays small", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const href = html.match(/href="(\/assets\/[^"]+\.css)"/)![1];
    expect(gzipSync(await (await request.get(href)).body()).length).toBeLessThan(budget.css);
  });
});
