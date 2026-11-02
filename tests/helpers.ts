import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";
import * as content from "../src/content";

export { content };

export const caseStudyPaths = content.caseStudies.map((cs) => `/case-studies/${cs.slug}/`);
export const allPages = ["/", ...caseStudyPaths];

/** On small screens the main nav sits behind a menu button. Opens it if needed. */
export async function openMenuIfCollapsed(page: Page) {
  const button = page.locator('button[aria-controls="mobile-menu"]');
  if ((await button.isVisible()) && (await button.getAttribute("aria-expanded")) !== "true") {
    await button.click();
  }
}

/** Visible navigation (desktop bar or mobile menu). */
export function navLink(page: Page, label: string, isMobile: boolean) {
  const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" });
  return nav.getByRole("link", { name: label, exact: true });
}

// WCAG 2.0, 2.1 and 2.2 at levels A and AA.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  // Short, readable summary in the test report instead of a huge JSON dump.
  return results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
  }));
}

/**
 * Groups tests in the Allure report: Portfolio website → feature → story (the describe block),
 * with a severity. Does nothing unless the Allure reporter is on (ALLURE=1).
 */
export async function allureLabels(testInfo: TestInfo, feature: string, severity: "blocker" | "critical" | "normal" | "minor" = "normal") {
  if (!process.env.ALLURE) return;
  const allure = await import("allure-js-commons");
  const path = testInfo.titlePath;
  await allure.epic("Portfolio website");
  await allure.feature(feature);
  await allure.story(path.length > 2 ? path[path.length - 2] : feature);
  await allure.severity(severity);
  await allure.owner("Tabeeda Shakir");
}

/** Collects uncaught errors and console errors (network failures to third parties are ignored). */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  return errors;
}
