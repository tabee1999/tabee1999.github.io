import type { Page } from "@playwright/test";
import content from "../content.js";

export { content };

export const caseStudyPaths = content.caseStudies.map((cs) => `/case-studies/${cs.slug}/`);
export const allPages = ["/", ...caseStudyPaths];

/** On small screens the main nav sits behind a menu button. Opens it if needed. */
export async function openMenuIfCollapsed(page: Page) {
  const button = page.locator(".menu-btn");
  if ((await button.isVisible()) && (await button.getAttribute("aria-expanded")) !== "true") {
    await button.click();
  }
}

/** Relative luminance (WCAG) of a CSS rgb()/rgba() string. */
export function luminance(rgb: string) {
  const [r, g, b] = (rgb.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
