import { test, expect } from "@playwright/test";
import { allureLabels, content, watchErrors } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "Home page", "critical"));

const { person, stats, projects, experience, services, pages, caseStudies } = content;

test.describe("home page", () => {
  test("introduces Tabeeda with her role and calls to action", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");

    await expect(page).toHaveTitle(/Tabeeda Shakir/);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(person.name);
    await expect(h1).toContainText(person.role);
    await expect(page.getByText(person.available).first()).toBeVisible();

    await expect(page.getByTestId("cta-cv")).toHaveAttribute("download", "");
    await expect(page.getByTestId("cta-email")).toHaveAttribute("href", `mailto:${person.email}`);
    await expect(page.getByRole("img", { name: person.photoAlt })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("answers a recruiter's first questions in the quick facts", async ({ page }) => {
    await page.goto("/");
    const facts = page.getByTestId("quick-facts");
    await expect(facts).toBeVisible();
    for (const text of ["SDET", "QA Automation Engineer", person.location, person.workAuthorisation, person.openTo, person.employment, "English (professional)", "UTC+5"]) {
      await expect(facts).toContainText(text);
    }
    // No claim of "5+ years" of AI-first QA.
    await expect(page.locator("#top")).not.toContainText("5+ years in AI-first QA");
  });

  test("shows the key numbers from the CV as a passing test run", async ({ page }) => {
    await page.goto("/");
    const highlights = page.getByRole("list", { name: "Highlights" });
    await expect(highlights.getByRole("listitem")).toHaveCount(stats.length);
    for (const s of stats) {
      await expect(highlights).toContainText(s.label, { ignoreCase: true });
      await expect(highlights).toContainText(`${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`);
    }
    await expect(page.getByTestId("hero-report")).toHaveAttribute("href", "/allure/");
  });

  test("links to every other page from the explore section", async ({ page }) => {
    await page.goto("/");
    const explore = page.locator("#explore");
    for (const key of ["experience", "projects", "skills", "about"] as const) {
      await expect(explore.getByRole("link", { name: new RegExp(`^${pages[key].label}`) })).toHaveAttribute("href", pages[key].path);
    }
    await expect(explore.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "/contact/");
  });

  test("shows how she works in four steps", async ({ page }) => {
    await page.goto("/");
    const steps = page.locator("#how-i-work").getByRole("listitem");
    await expect(steps).toHaveCount(content.process.length);
    for (const s of content.process) await expect(page.locator("#how-i-work")).toContainText(s.title);
  });
});

test.describe("other pages", () => {
  test("the skills page lists AI-first QA and manual QA among the services", async ({ page }) => {
    await page.goto("/skills/");
    const section = page.locator("#services");
    for (const s of services) await expect(section.getByRole("heading", { name: s.title, exact: true })).toBeVisible();
    await expect(section.getByRole("heading", { name: "AI-first QA", exact: true })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Manual and exploratory QA", exact: true })).toBeVisible();
  });

  test("the projects page shows every project and case study", async ({ page }) => {
    await page.goto("/projects/");
    await expect(page.getByTestId("project-card")).toHaveCount(projects.length);
    await expect(page.getByRole("tab")).toHaveCount(caseStudies.length);
  });

  test("the experience page shows every role", async ({ page }) => {
    await page.goto("/experience/");
    for (const job of experience) {
      await expect(page.locator("#experience").getByText(job.company, { exact: false }).first()).toBeVisible();
    }
  });

  test("the CV download is a real PDF", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.getByTestId("cta-cv").getAttribute("href");
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect((await res.body()).subarray(0, 4).toString()).toBe("%PDF");
  });

  test("every image and stylesheet on the page loads", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (r) => {
      if (r.url().startsWith("http://localhost") && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto("/", { waitUntil: "load" });
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    expect(failed).toEqual([]);
    const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy").map((i) => i.src));
    expect(broken).toEqual([]);
  });
});
