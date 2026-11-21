import { test, expect, type Page } from "@playwright/test";
import { allureLabels, content } from "./helpers";

// The scroll animations. These run with motion allowed (the rest of the suite uses
// reduced motion), scroll through each animated section and check what's on screen.

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Scroll animations", "normal"));

/** Scrolls so that a pinned section is `progress` (0–1) of the way through. */
async function scrollPinned(page: Page, selector: string, progress: number) {
  await page.evaluate(
    ([sel, p]) => {
      const el = document.querySelector(sel as string) as HTMLElement;
      const top = window.scrollY + el.getBoundingClientRect().top;
      window.scrollTo(0, top + (p as number) * (el.offsetHeight - window.innerHeight));
    },
    [selector, progress],
  );
}

const progressOf = (page: Page, selector: string) => page.locator(selector).evaluate((el) => parseFloat((el as HTMLElement).style.getPropertyValue("--p") || "NaN"));
const opacity = (page: Page, text: string) => page.getByText(text, { exact: true }).evaluate((el) => {
  let o = 1;
  for (let n: HTMLElement | null = el as HTMLElement; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
  return o;
});

test.describe("animations", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero's test grid scans for bugs", async ({ page }) => {
    await page.goto("/");
    const grid = page.getByTestId("hero-grid");
    const frame = () => grid.evaluate((c) => (c as HTMLCanvasElement).toDataURL());
    const first = await frame();
    await page.waitForTimeout(400);
    expect(await frame()).not.toBe(first);
    await expect(page.getByTestId("tested-for")).toContainText("Fleetify");
  });

  test("the test run plays as you scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    const count = page.getByTestId("run-count");
    await expect.poll(() => progressOf(page, "#test-run")).toBe(0);
    await expect(count).toHaveText("0");

    await scrollPinned(page, "#test-run", 0.5);
    await expect.poll(() => progressOf(page, "#test-run")).toBeCloseTo(0.5, 1);
    const halfway = parseInt((await count.textContent()) ?? "", 10);
    expect(halfway).toBeGreaterThan(80);
    expect(halfway).toBeLessThan(300);

    await scrollPinned(page, "#test-run", 1);
    await expect(count).toHaveText(content.testCount);
    await expect(page.getByTestId("test-run-panel")).toBeInViewport();
  });

  test("the phone shows bugs being found, then fixed and released", async ({ page }) => {
    await page.goto("/");
    await scrollPinned(page, "#how-i-work", 0.5);
    await expect.poll(() => opacity(page, "GPS jump")).toBeGreaterThan(0.9);
    await expect.poll(() => opacity(page, "Released v2.4")).toBeLessThan(0.1);

    await scrollPinned(page, "#how-i-work", 1);
    await expect.poll(() => opacity(page, "GPS jump")).toBeLessThan(0.1);
    await expect.poll(() => opacity(page, "Released v2.4")).toBeGreaterThan(0.9);
    await expect(page.locator("#how-i-work").getByRole("heading", { name: /Release with confidence/ })).toBeInViewport();
  });

  test("the GPS trail reaches each job as you read down the page", async ({ page }) => {
    await page.goto("/experience/");
    const pins = page.getByTestId("trail").locator("circle.trail-pin");
    await expect(pins).toHaveCount(content.experience.length);
    await expect(pins.last()).toHaveAttribute("data-reached", "false");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    for (const pin of await pins.all()) await expect(pin).toHaveAttribute("data-reached", "true");
  });

  test("the bug turns into a shield on the contact page", async ({ page }) => {
    await page.goto("/contact/");
    const dots = page.getByTestId("shield").locator("svg g circle");
    await expect(dots).toHaveCount(150);
    await expect.poll(() => dots.first().getAttribute("fill")).toBe("#f47a8f");
    await page.getByRole("heading", { name: "Quick answers for recruiters" }).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect.poll(() => dots.first().getAttribute("fill")).toBe("#5fd3a6");
  });
});

test.describe("animations with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("show their finished state and never pin the page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bmotion\b/);
    const vh = page.viewportSize()!.height;
    for (const id of ["#test-run", "#how-i-work"]) {
      expect(await page.locator(id).evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(vh * 1.9);
    }
    await expect(page.getByTestId("run-count")).toHaveText(content.testCount);
    await expect.poll(() => opacity(page, "Released v2.4")).toBeGreaterThan(0.9);
    // The hero grid is drawn once and stays still.
    const grid = page.getByTestId("hero-grid");
    const first = await grid.evaluate((c) => (c as HTMLCanvasElement).toDataURL());
    await page.waitForTimeout(400);
    expect(await grid.evaluate((c) => (c as HTMLCanvasElement).toDataURL())).toBe(first);
  });
});
