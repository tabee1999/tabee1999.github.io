import { test, expect } from "@playwright/test";
import { content } from "./helpers";

test.describe("job match", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#skills");
  });

  test("highlights skills mentioned in a job description", async ({ page }) => {
    await page.getByLabel("Job description").fill(
      "We need strong Playwright and Java skills, API testing with REST Assured, plus Selenium and Docker.",
    );

    const result = page.locator(".fit-result");
    await expect(result.locator(".fit-score")).toContainText("of my skills match this role");
    await expect(result.getByRole("list", { name: "Matching skills" })).toContainText("Playwright (JavaScript)");
    await expect(result.getByRole("list", { name: "Matching skills" })).toContainText("RestAssured (Java)");

    const pill = (name: string) => page.locator(".skill-group li", { hasText: name }).first();
    await expect(pill("Playwright (JavaScript)")).toHaveClass(/is-match/);
    await expect(pill("Java")).toHaveClass(/is-match/);
    await expect(pill("Jenkins")).not.toHaveClass(/is-match/);

    // Honest about gaps: tools I'm learning, and tools not on my list.
    await expect(result).toContainText("Learning now: Selenium WebDriver");
    await expect(result).toContainText("Not on my list yet: Docker");
  });

  test("does not mistake JavaScript for Java", async ({ page }) => {
    await page.getByLabel("Job description").fill("Frontend role using JavaScript and GitHub.");
    await expect(page.locator(".skill-group li", { hasText: /^JavaScript$/ })).toHaveClass(/is-match/);
    await expect(page.locator(".skill-group li", { hasText: /^Java$/ })).not.toHaveClass(/is-match/);
    // "GitHub" alone shouldn't count as Git or GitHub Actions.
    await expect(page.locator(".skill-group li", { hasText: /^Git$/ })).not.toHaveClass(/is-match/);
  });

  test("the sample job ad shows a working match, and Clear resets it", async ({ page }) => {
    await page.getByRole("button", { name: "Try a sample job ad" }).click();
    await expect(page.locator(".fit-score strong")).toHaveText(/^\d+$/);
    expect(await page.locator(".skill-group li.is-match").count()).toBeGreaterThan(5);

    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByLabel("Job description")).toHaveValue("");
    await expect(page.locator(".skill-group li.is-match")).toHaveCount(0);
    await expect(page.locator(".fit-result")).toBeEmpty();
  });
});

test.describe("interactions", () => {
  test("theme switch changes the theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const button = page.getByRole("button", { name: "Switch to dark theme" });

    await button.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("copies the email address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions can only be granted in Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");

    await page.locator(".section-contact").getByRole("button", { name: "Copy" }).click();
    await expect(page.locator(".toast")).toHaveText("Email address copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(content.person.email);
  });

  test("highlights the current section in the nav", async ({ page, isMobile }) => {
    test.skip(isMobile, "The nav is collapsed into the menu on phones");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(page.locator('.site-nav a[data-section="experience"]')).toHaveAttribute("aria-current", "true");
  });

  test("back-to-top button appears after scrolling and returns to the top", async ({ page }) => {
    await page.goto("/");
    const toTop = page.getByRole("link", { name: "Back to top" });
    await expect(toTop).toBeHidden();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(toTop).toBeVisible();
    await toTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  });

  test("case study pages have an on-this-page menu", async ({ page, isMobile }) => {
    test.skip(isMobile, "The side panel shows on wide screens");
    await page.setViewportSize({ width: 1280, height: 800 });
    const cs = content.caseStudies[0];
    await page.goto(`/case-studies/${cs.slug}/`);

    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc).toBeVisible();
    await toc.getByRole("link", { name: "Outcome" }).click();
    await expect(page).toHaveURL(/#outcome$/);
    await expect(page.locator("#outcome")).toBeInViewport();
  });
});
