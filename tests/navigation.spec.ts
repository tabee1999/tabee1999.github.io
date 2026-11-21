import { test, expect } from "@playwright/test";
import { allureLabels, allPages, content, navLink, openMenuIfCollapsed, sitePages, watchErrors } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Navigation and links", "critical"));

const { nav, pages, sectionPaths } = content;

test.describe("navigation", () => {
  for (const item of nav) {
    test(`"${item.label}" in the menu opens the ${item.label} page`, async ({ page, isMobile }) => {
      const errors = watchErrors(page);
      await page.goto("/");
      await openMenuIfCollapsed(page);
      await navLink(page, item.label, isMobile).click();
      await expect(page).toHaveURL(new RegExp(`${item.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page).toHaveTitle(pages[item.key].title);
      await openMenuIfCollapsed(page);
      await expect(navLink(page, item.label, isMobile)).toHaveAttribute("aria-current", "page");
      expect(errors).toEqual([]);
    });
  }

  test('"Contact me" in the header opens the contact page', async ({ page, isMobile }) => {
    await page.goto("/");
    await openMenuIfCollapsed(page);
    const nav = isMobile ? page.getByRole("navigation", { name: "Mobile" }) : page.getByRole("banner");
    await nav.getByRole("link", { name: "Contact me" }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's work together");
  });

  for (const path of sitePages.filter((p) => p !== "/")) {
    test(`${path} has a breadcrumb back home`, async ({ page }) => {
      await page.goto(path);
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      await expect(crumbs.locator('[aria-current="page"]')).toHaveCount(1);
    });
  }

  test("old one-page links such as /#contact go to the page that section moved to", async ({ page }) => {
    for (const [id, path] of Object.entries(sectionPaths)) {
      await page.goto(`/#${id}`);
      await expect(page, `/#${id}`).toHaveURL(new RegExp(`${path.replace(/[/#]/g, "\\$&")}$`));
      const hash = new URL(page.url()).hash;
      if (hash) await expect(page.locator(hash), `/#${id}`).toHaveCount(1);
    }
  });

  test("every internal link points to a page that exists", async ({ page, request }) => {
    const checked = new Set<string>();
    for (const path of allPages) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
      for (const href of hrefs) {
        const url = new URL(href);
        if (url.origin !== new URL(page.url()).origin) continue;
        // Test reports are generated in CI and published with the site, so they don't exist locally.
        if (url.pathname.startsWith("/report") || url.pathname.startsWith("/allure")) continue;
        const key = url.pathname + url.hash;
        if (checked.has(key)) continue;
        checked.add(key);
        const res = await request.get(url.pathname);
        expect(res.status(), `${url.pathname} (linked from ${path})`).toBe(200);
        if (url.hash.length > 1 && url.hash !== "#main") {
          const html = await res.text();
          expect(html, `${key} (linked from ${path})`).toContain(`id="${url.hash.slice(1)}"`);
        }
      }
    }
  });

  test("links to other sites open safely in a new tab", async ({ page }) => {
    for (const path of ["/", "/experience/", "/contact/"]) {
      await page.goto(path);
      const external = page.locator('a[href^="http"]:not([href^="http://localhost"])');
      expect(await external.count()).toBeGreaterThan(2);
      for (const link of await external.all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
    }
  });

  for (const cs of content.caseStudies) {
    test(`case study page "${cs.title}" loads with a breadcrumb back to projects`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(`/case-studies/${cs.slug}/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(cs.title);
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      await expect(crumbs.getByRole("link", { name: "Case studies" })).toHaveAttribute("href", "/projects/#case-studies");
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
    await page.goto("/experience/");
    const button = page.getByRole("link", { name: "Back to top" });
    await expect(button).toBeHidden();
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });
});
