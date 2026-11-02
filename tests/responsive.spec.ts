import { test, expect } from "@playwright/test";
import { allureLabels, allPages } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Responsive layout", "normal"));

const widths = [360, 768, 1024, 1440];

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no sideways scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of allPages) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("the mobile menu opens, links work and Escape closes it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await expect(button).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();

    await button.click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Skills" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#skills")).toBeInViewport();
  });

  test("the desktop menu is shown on large screens", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });

  test("tap targets in the hero are at least 44px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const targets = page.locator("#top a, #top button");
    for (const el of await targets.all()) {
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      expect(Math.round(box!.height), await el.evaluate((e) => e.outerHTML.slice(0, 80))).toBeGreaterThanOrEqual(44);
    }
  });

  test("images have alt text and fixed dimensions (no layout shift)", async ({ page }) => {
    await page.goto("/");
    for (const img of await page.locator("img").all()) {
      expect(await img.getAttribute("alt")).not.toBeNull();
      expect(await img.getAttribute("width")).toBeTruthy();
      expect(await img.getAttribute("height")).toBeTruthy();
    }
  });
});
