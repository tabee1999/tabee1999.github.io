import { test, expect } from "@playwright/test";
import { allPages, luminance } from "./helpers";

test.describe("responsive", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("no horizontal scroll at 360px", async ({ page }) => {
    for (const path of allPages) {
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect.soft(scrollWidth, `${path} is wider than the screen`).toBeLessThanOrEqual(clientWidth);
    }
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");
    const button = page.locator(".menu-btn");
    const nav = page.getByRole("navigation", { name: "Main" });

    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Projects" })).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("buttons are large enough to tap", async ({ page }) => {
    await page.goto("/");
    for (const target of await page.locator(".btn:visible, .menu-btn:visible").all()) {
      const box = await target.boundingBox();
      expect.soft(box?.height ?? 0, await target.innerText()).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("theme", () => {
  test("follows the dark color scheme", async ({ page }) => {
    const colors = () =>
      page.evaluate(() => {
        const body = getComputedStyle(document.body);
        return {
          bg: body.backgroundColor,
          fg: body.color,
          scheme: getComputedStyle(document.documentElement).colorScheme,
        };
      });

    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const light = await colors();

    await page.emulateMedia({ colorScheme: "dark" });
    const dark = await colors();

    expect(dark.bg).not.toBe(light.bg);
    expect(luminance(dark.bg)).toBeLessThan(luminance(light.bg));
    expect(luminance(dark.fg)).toBeGreaterThan(luminance(dark.bg));
    expect(dark.scheme).toBe("dark");
  });
});
