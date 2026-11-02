import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";
import { content } from "./helpers";

// WCAG 2.0, 2.1 and 2.2 at levels A and AA.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  // Short, readable summary in the test report instead of a huge JSON dump.
  return results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
  }));
}

test.describe("a11y", () => {
  test("home page has no axe violations", async ({ page }) => {
    await page.goto("/");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("home page has no axe violations in dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expect(await axeViolations(page)).toEqual([]);
  });

  for (const cs of content.caseStudies) {
    test(`case study "${cs.title}" has no axe violations`, async ({ page }) => {
      await page.goto(`/case-studies/${cs.slug}/`);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("contact form errors have no axe violations", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("#cf-name-error")).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("skip link moves keyboard focus past the header", async ({ page, browserName, isMobile }) => {
    test.skip(isMobile, "No Tab key on touch devices");
    test.skip(browserName === "webkit", "Safari only tabs to links with a system setting turned on");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    await page.keyboard.press("Tab");
    // The next stop is inside the main content, not the header nav.
    expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(true);
  });
});
