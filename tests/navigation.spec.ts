import { test, expect } from "@playwright/test";
import { allPages, content, openMenuIfCollapsed } from "./helpers";

test.describe("navigation", () => {
  test("every section link scrolls to its section", async ({ page }) => {
    await page.goto("/");
    // Located by id, not role: on phones the nav is collapsed (hidden) until the menu opens.
    const nav = page.locator("#site-nav");
    const hrefs = await nav.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThanOrEqual(5);

    for (const href of hrefs) {
      await openMenuIfCollapsed(page);
      await nav.locator(`a[href="${href}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator(href)).toBeInViewport();
    }
  });

  test("has no broken internal links", async ({ page, request }) => {
    for (const path of allPages) {
      await page.goto(path);
      const origin = new URL(page.url()).origin;
      const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));

      for (const href of new Set(hrefs)) {
        const url = new URL(href);
        if (url.origin !== origin) continue; // external links: see the next test

        const res = await request.get(url.pathname + url.search);
        expect.soft(res.status(), `${href} (linked from ${path})`).toBe(200);

        if (url.hash.length > 1) {
          const id = decodeURIComponent(url.hash.slice(1));
          const html = await res.text();
          expect.soft(html, `#${id} should exist on ${url.pathname} (linked from ${path})`).toContain(`id="${id}"`);
        }
      }
    }
  });

  test("opens external links safely in a new tab", async ({ page, request }) => {
    for (const path of allPages) {
      await page.goto(path);
      const external = page.locator('a[href^="http"]');
      for (const link of await external.all()) {
        const href = (await link.getAttribute("href")) ?? "";
        if (href.startsWith(new URL(page.url()).origin)) continue;
        await expect.soft(link, href).toHaveAttribute("target", "_blank");
        await expect.soft(link, href).toHaveAttribute("rel", /noopener/);

        // Live checks against other sites are opt-in: LinkedIn and others often block bots,
        // which would make the suite flaky. Run with CHECK_EXTERNAL_LINKS=1 to include them.
        if (process.env.CHECK_EXTERNAL_LINKS) {
          const res = await request.get(href, { maxRedirects: 5, failOnStatusCode: false });
          expect.soft(res.status(), href).toBeLessThan(400);
        }
      }
    }
  });

  for (const cs of content.caseStudies) {
    test(`opens the "${cs.title}" case study and returns home`, async ({ page }) => {
      await page.goto("/");
      await page.locator("#case-studies").getByRole("link", { name: cs.title }).click();

      await expect(page).toHaveURL(new RegExp(`/case-studies/${cs.slug}/$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(cs.title);
      // Core sections every case study needs. ("What I'd do differently" shows once it's written.)
      for (const heading of ["Challenge", "Approach", "Outcome"]) {
        await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
      }

      await page.getByRole("link", { name: "Back to all case studies" }).click();
      await expect(page).toHaveURL(/#case-studies$/);
      await expect(page.locator("#case-studies")).toBeInViewport();
    });
  }

  test("shows a helpful page for unknown addresses", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist");
    await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
  });
});
