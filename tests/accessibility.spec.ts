import { test, expect } from "@playwright/test";
import { allureLabels, axeViolations, content } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Accessibility (WCAG 2.2 AA)", "critical"));

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  test("home page", async ({ page }) => {
    await page.goto("/");
    expect(await axeViolations(page)).toEqual([]);
  });

  for (const cs of content.caseStudies) {
    test(`case study: ${cs.title}`, async ({ page }) => {
      await page.goto(`/case-studies/${cs.slug}/`);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("404 page", async ({ page }) => {
    await page.goto("/missing-page");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("with the project dialog open", async ({ page }) => {
    await page.goto("/#projects");
    await page.getByRole("button", { name: "View details for Modon Express" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("with a team photo open full size", async ({ page }) => {
    await page.goto("/#teams");
    await page.getByTestId("team-gallery").getByRole("button").first().click();
    await expect(page.getByTestId("team-lightbox")).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("with contact form errors showing", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByTestId("contact-submit").click();
    await expect(page.locator("#contact-name-error")).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("with the mobile menu open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("keyboard", () => {
  test("skip link moves focus past the header", async ({ page, isMobile }) => {
    test.skip(isMobile, "No Tab key on touch devices");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(true);
  });

  test("every interactive element shows a visible focus style", async ({ page, isMobile }) => {
    test.skip(isMobile, "No Tab key on touch devices");
    await page.goto("/");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const style = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const s = getComputedStyle(el);
        return { tag: el.tagName, outline: s.outlineStyle, width: parseFloat(s.outlineWidth) };
      });
      expect(style.outline, `${style.tag} #${i}`).not.toBe("none");
      expect(style.width).toBeGreaterThan(0);
    }
  });

  test("one h1 per page, and headings don't skip levels", async ({ page }) => {
    for (const path of ["/", `/case-studies/${content.caseStudies[0].slug}/`]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      const levels = await page.$$eval("main h1, main h2, main h3, main h4", (hs) => hs.map((h) => Number(h.tagName[1])));
      for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `${path} heading ${i}`).toBeLessThanOrEqual(1);
    }
  });
});
