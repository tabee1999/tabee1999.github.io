import { test, expect } from "@playwright/test";
import { allureLabels, allPages, content, navLink, openMenuIfCollapsed, watchErrors } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Navigation and links", "critical"));

test.describe("navigation", () => {
  for (const item of content.nav) {
    test(`"${item.label}" in the menu scrolls to its section`, async ({ page, isMobile }) => {
      await page.goto("/");
      await openMenuIfCollapsed(page);
      await navLink(page, item.label, isMobile).click();
      await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
      await expect(page.locator(`#${item.id}`)).toBeInViewport();
    });
  }

  test("menu links land the section heading just below the header, not halfway down", async ({ page, isMobile }) => {
    await page.goto("/");
    await openMenuIfCollapsed(page);
    await navLink(page, "Experience", isMobile).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect.poll(() => page.locator("#experience-title").evaluate((h) => Math.round(h.getBoundingClientRect().top))).toBeLessThan(200);
    const top = await page.locator("#experience-title").evaluate((h) => h.getBoundingClientRect().top);
    expect(top).toBeGreaterThan(72); // not hidden under the fixed header
  });

  test("highlights the section you're reading", async ({ page, isMobile }) => {
    test.skip(isMobile, "The desktop menu shows the active section");
    await page.goto("/#experience");
    await expect(navLink(page, "Experience", false)).toHaveAttribute("aria-current", "true");
  });

  test("every internal link points to a page that exists", async ({ page, request }) => {
    const checked = new Set<string>();
    for (const path of allPages) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
      for (const href of hrefs) {
        const url = new URL(href);
        if (url.origin !== new URL(page.url()).origin) continue;
        const target = url.pathname;
        // Test reports are generated in CI and published with the site, so they don't exist locally.
        if (target.startsWith("/report") || target.startsWith("/allure") || checked.has(target)) continue;
        checked.add(target);
        const res = await request.get(target);
        expect(res.status(), `${target} (linked from ${path})`).toBe(200);
        if (url.hash.length > 1 && target === "/") {
          await page.goto(`/${url.hash}`);
          await expect(page.locator(url.hash), `${url.hash} (linked from ${path})`).toHaveCount(1);
        }
      }
    }
  });

  test("links to other sites open safely in a new tab", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[href^="http"]:not([href^="http://localhost"])');
    expect(await external.count()).toBeGreaterThan(3);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  for (const cs of content.caseStudies) {
    test(`case study page "${cs.title}" loads with a breadcrumb back home`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(`/case-studies/${cs.slug}/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(cs.title);
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      for (const m of cs.metrics) await expect(page.getByText(m.label, { exact: true })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("an unknown address shows a helpful 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("didn't pass QA");
    await page.getByRole("link", { name: "Go to the home page" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the back-to-top button appears after scrolling and returns to the top", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("link", { name: "Back to top" });
    await expect(button).toBeHidden();
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });
});
