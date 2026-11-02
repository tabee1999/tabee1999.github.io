import { readFile, readdir } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { content } from "./helpers";

test.describe("home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows name, role and open-to-work badge", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: content.person.name })).toBeVisible();
    await expect(page.locator(".hero .role")).toContainText(content.person.role);
    await expect(page.getByTestId("open-to-work")).toHaveText(content.person.openTo);
    await expect(page.getByRole("link", { name: "View my work" })).toHaveAttribute("href", "#case-studies");
    await expect(page.locator(".hero").getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "#contact");
  });

  test("has the title, description, link preview and Person schema", async ({ page }) => {
    await expect(page).toHaveTitle(content.site.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", content.site.description);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og-image\.png$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(content.person.name);
    expect(ld.jobTitle).toBe(content.person.role);
  });

  test("serves the link preview image, sitemap and robots.txt", async ({ request }) => {
    for (const path of ["/og-image.png", "/sitemap.xml", "/robots.txt", "/favicon.svg"]) {
      const res = await request.get(path);
      expect.soft(res.status(), path).toBe(200);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const cs of content.caseStudies) expect.soft(sitemap).toContain(`/case-studies/${cs.slug}/`);
  });

  test("downloads the CV as a PDF", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("cv-download").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const file = await readFile(await download.path());
    expect(file.subarray(0, 5).toString()).toBe("%PDF-");
  });

  test("lists every case study from content.js", async ({ page }) => {
    const section = page.locator("#case-studies");
    for (const cs of content.caseStudies) {
      await expect(section.getByRole("link", { name: cs.title })).toHaveAttribute("href", `case-studies/${cs.slug}/`);
    }
  });

  test("hides optional sections that have no content", async ({ page }) => {
    await expect(page.locator("#writing")).toHaveCount(content.writing.length ? 1 : 0);
    await expect(page.locator("#testimonials")).toHaveCount(content.testimonials.length ? 1 : 0);
  });

  test("only shows real tests in the hero test run", async () => {
    // The hero lists test titles as "describe › test". Make sure each one exists in this suite,
    // so the page never advertises a check that isn't actually run.
    const dir = new URL(".", import.meta.url);
    const files = (await readdir(dir)).filter((f) => f.endsWith(".spec.ts"));
    const sources = await Promise.all(files.map((f) => readFile(new URL(f, dir), "utf8")));
    for (const line of content.site.heroRun) {
      const [suite, title] = line.split(" › ");
      const found = sources.some((src) => src.includes(`test.describe("${suite}"`) && src.includes(`test("${title}"`));
      expect.soft(found, `"${line}" should match a real test`).toBe(true);
    }
  });
});
