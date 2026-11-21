import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test, expect, type Page } from "@playwright/test";
import { allureLabels, content } from "./helpers";

// Visual regression: key screens are compared pixel by pixel with approved screenshots
// (tests/__screenshots__). This is what backs the "Visual check: 0 px diff" badge on the
// home page photo: any change that moves, recolours or clips something fails the build.
//
// The approved screenshots come from GitHub's Linux runners, because fonts and anti-aliasing
// differ slightly between operating systems. So these tests run in CI (or with VISUAL=1 on
// Linux), in Chrome on desktop and mobile. To approve a deliberate design change, run the
// "Visual baselines" workflow in GitHub Actions; it commits the new screenshots.

test.beforeEach(async ({ browserName }, testInfo) => {
  await allureLabels(testInfo, "Visual regression", "critical");
  test.skip(!process.env.CI && !process.env.VISUAL, "Visual checks run on Linux CI (set VISUAL=1 to run them here)");
  test.skip(!!process.env.BASE_URL, "Not run against the live site");
  test.skip(browserName !== "chromium", "Baselines are kept for Chrome (desktop and mobile)");
});

// Screenshots only match the browser build they were taken with: after a Playwright upgrade,
// re-run the "Visual baselines" workflow.
const versionFile = join(process.cwd(), "tests", "__screenshots__", "playwright-version.txt");
const approvedWith = existsSync(versionFile) ? readFileSync(versionFile, "utf8").trim() : "";
const runningWith: string = createRequire(import.meta.url)("@playwright/test/package.json").version;

/** Skips (with a reason) until the baseline exists, so a new check never approves itself. */
function needsBaseline(name: string) {
  const path = test.info().snapshotPath(name);
  if (process.env.UPDATE_BASELINES === "1") return;
  test.skip(!existsSync(path), `No approved screenshot yet for ${name}: run the "Visual baselines" workflow`);
  test.skip(approvedWith !== runningWith, `Screenshots were approved with Playwright ${approvedWith}, this is ${runningWith}: run the "Visual baselines" workflow`);
}

/** Things that legitimately change between runs: the random bugs on the hero grid and the clocks. */
const changing = (page: Page) => [page.getByTestId("hero-grid"), page.getByTestId("local-time")];

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  // Every eagerly loaded image decoded, so nothing pops in mid-screenshot. (Lazy images below
  // the fold never load until scrolled to, so waiting for them would hang.)
  await page.evaluate(() =>
    Promise.all([...document.images].filter((img) => img.loading !== "lazy").map((img) => (img.complete ? null : img.decode().catch(() => null)))),
  );
}

test.describe("visual regression", () => {
  test("home page, first screen", async ({ page }) => {
    needsBaseline("home-first-screen.png");
    await open(page, "/");
    await expect(page).toHaveScreenshot("home-first-screen.png", { mask: changing(page) });
  });

  test("hero photo with its checks", async ({ page }) => {
    needsBaseline("hero-photo.png");
    await open(page, "/");
    await expect(page.getByTestId("photo-scan")).toHaveScreenshot("hero-photo.png");
  });

  test("projects grid", async ({ page }) => {
    needsBaseline("projects-grid.png");
    await open(page, "/projects/");
    await expect(page.getByTestId("project-grid")).toHaveScreenshot("projects-grid.png");
  });

  test("a project page, first screen", async ({ page }) => {
    needsBaseline("project-page.png");
    await open(page, content.projectPath(content.projects[0].slug));
    await expect(page).toHaveScreenshot("project-page.png", { mask: changing(page) });
  });

  test("contact form", async ({ page }) => {
    needsBaseline("contact-form.png");
    await open(page, "/contact/");
    await expect(page.locator("form").first()).toHaveScreenshot("contact-form.png");
  });

  test("404 page", async ({ page }) => {
    needsBaseline("not-found.png");
    await open(page, "/missing-page");
    await expect(page).toHaveScreenshot("not-found.png", { mask: changing(page) });
  });
});
