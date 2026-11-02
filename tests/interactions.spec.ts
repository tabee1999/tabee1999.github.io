import { test, expect } from "@playwright/test";
import { content } from "./helpers";

const { projects, caseStudies, experience, faqs, person } = content;

test.describe("projects", () => {
  test("filters projects by type of testing", async ({ page }) => {
    await page.goto("/#projects");
    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(projects.length);

    const aiFirst = page.getByRole("button", { name: /^AI-first/ });
    await aiFirst.click();
    await expect(aiFirst).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(projects.filter((p) => p.categories.includes("AI-first")).length);
    await expect(cards.first()).toContainText("AI visa processing platform");

    await page.getByRole("button", { name: /^Mobile/ }).click();
    await expect(cards).toHaveCount(projects.filter((p) => p.categories.includes("Mobile")).length);

    await page.getByRole("button", { name: /^All/ }).click();
    await expect(cards).toHaveCount(projects.length);
  });

  test("opens project details in a dialog and closes it with Escape", async ({ page }) => {
    await page.goto("/#projects");
    const opener = page.getByRole("button", { name: "View details for Al Rais Travel" });
    await opener.click();

    const dialog = page.getByRole("dialog", { name: "Al Rais Travel" });
    await expect(dialog).toBeVisible();
    for (const h of projects[0].highlights) await expect(dialog.getByText(h)).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Read the case study" })).toHaveAttribute("href", `/case-studies/${caseStudies[0].slug}/`);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("the close button also closes the dialog", async ({ page }) => {
    await page.goto("/#projects");
    await page.getByRole("button", { name: "View details for Fleetify" }).click();
    await page.getByRole("button", { name: "Close project details" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("case studies", () => {
  test("tabs switch with a click and with the arrow keys", async ({ page, isMobile }) => {
    await page.goto("/#case-studies");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(caseStudies.length);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText(caseStudies[1].summary);

    if (!isMobile) {
      await page.keyboard.press("ArrowRight");
      await expect(tabs.nth(2)).toBeFocused();
      await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Home");
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    }

    await page.getByRole("tabpanel").getByRole("link", { name: "Read the full case study" }).click();
    const open = isMobile ? caseStudies[1] : caseStudies[0];
    await expect(page).toHaveURL(new RegExp(`/case-studies/${open.slug}/$`));
  });
});

test.describe("experience", () => {
  test("roles expand and collapse, one at a time or all together", async ({ page }) => {
    await page.goto("/#experience");
    const first = page.getByRole("button", { name: new RegExp(experience[0].role) }).first();
    const second = page.locator("#job-1");

    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(experience[0].bullets[0])).toBeVisible();
    await expect(second).toHaveAttribute("aria-expanded", "false");

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(experience[1].bullets[0])).toBeVisible();

    await page.getByTestId("expand-all").click();
    for (let i = 0; i < experience.length; i++) await expect(page.locator(`#job-${i}`)).toHaveAttribute("aria-expanded", "true");
    await page.getByTestId("expand-all").click();
    for (let i = 0; i < experience.length; i++) await expect(page.locator(`#job-${i}`)).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("skills", () => {
  test("job match finds the skills a job ad asks for", async ({ page }) => {
    await page.goto("/#skills");
    await page
      .getByLabel("Job description")
      .fill("Senior QA Engineer: Playwright, REST Assured API testing, CI/CD with GitHub Actions, Jira, SQL and some Python. JavaScript a plus.");
    await page.getByRole("button", { name: "Check my fit" }).click();

    const result = page.getByTestId("job-result");
    for (const skill of ["Playwright", "RestAssured", "GitHub Actions", "Jira", "SQL", "JavaScript"]) {
      await expect(result.getByText(skill, { exact: true })).toBeVisible();
    }
    // "Java" must not match just because the ad says "JavaScript".
    await expect(result.getByText("Java", { exact: true })).toHaveCount(0);
    await expect(result).toContainText("Currently learning: Python");
  });

  test("job match asks for more text when the box is nearly empty", async ({ page }) => {
    await page.goto("/#skills");
    await page.getByLabel("Job description").fill("QA");
    await page.getByRole("button", { name: "Check my fit" }).click();
    await expect(page.getByText("Paste at least a few lines")).toBeVisible();
    await expect(page.getByLabel("Job description")).toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("FAQ", () => {
  test("answers open and close", async ({ page }) => {
    await page.goto("/#faq");
    const q = page.getByRole("button", { name: faqs[1].q });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(faqs[1].a)).toBeVisible();
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("copy email", () => {
  test("copies the email address and confirms", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions can only be granted in Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");
    await page.locator("#contact").getByTestId("copy-email").click();
    await expect(page.getByTestId("toast")).toHaveText("Email address copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(person.email);
  });
});
