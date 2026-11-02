import { test, expect } from "@playwright/test";
import { allureLabels, allPages, content } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "SEO and AI search", "normal"));

const { site, person, caseStudies, faqs } = content;

type Node = { "@type": string; [key: string]: unknown };
async function jsonLd(page: import("@playwright/test").Page): Promise<Node[]> {
  const blocks = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((e) => e.textContent ?? ""));
  return blocks.flatMap((b) => (JSON.parse(b)["@graph"] as Node[]) ?? []);
}

test.describe("SEO", () => {
  for (const path of allPages) {
    test(`${path} has a title, description, canonical and social cards`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title).toContain(person.name);
      expect(title.length).toBeLessThanOrEqual(90);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description!.length).toBeGreaterThan(70);
      expect(description!.length).toBeLessThanOrEqual(170);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site.url}${path}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${site.url}/og-image.jpg`);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  }

  test("home page describes Tabeeda as a Person for search and AI engines", async ({ page }) => {
    await page.goto("/");
    const graph = await jsonLd(page);
    const p = graph.find((n) => n["@type"] === "Person")!;
    expect(p.name).toBe(person.name);
    expect(p.jobTitle).toBe(person.role);
    expect(p.sameAs).toEqual(expect.arrayContaining([person.linkedin, person.github]));
    expect(p.knowsAbout).toEqual(expect.arrayContaining(["Manual testing", "AI-first QA", "Playwright"]));

    expect(graph.find((n) => n["@type"] === "ProfilePage")).toBeTruthy();
    const faq = graph.find((n) => n["@type"] === "FAQPage")!;
    expect((faq.mainEntity as unknown[]).length).toBe(faqs.length);
  });

  test("case study pages are marked up as articles with breadcrumbs", async ({ page }) => {
    await page.goto(`/case-studies/${caseStudies[0].slug}/`);
    const graph = await jsonLd(page);
    expect(graph.find((n) => n["@type"] === "Article")?.headline).toBe(caseStudies[0].title);
    expect(graph.find((n) => n["@type"] === "BreadcrumbList")).toBeTruthy();
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  });

  test("the main content is in the HTML before JavaScript runs", async ({ request }) => {
    const html = (await (await request.get("/")).text()).replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/<!-- -->/g, "");
    const expected = [`Hi, I'm ${person.name}`, "AI-first QA", "Manual and exploratory QA", ...faqs.map((f) => f.q), ...faqs.map((f) => f.a)];
    const missing = expected.filter((text) => !html.includes(text));
    expect(missing).toEqual([]);
  });

  test("the 404 page is not indexed", async ({ page }) => {
    await page.goto("/nothing-here");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test("robots.txt welcomes search and AI crawlers and points to the sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot"]) expect(robots).toContain(`User-agent: ${bot}`);
    expect(robots).toContain(`Sitemap: ${site.url}/sitemap.xml`);
    expect(robots).not.toMatch(/Disallow: \/\s*$/m);
  });

  test("sitemap lists every page", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const path of allPages) expect(xml).toContain(`<loc>${site.url}${path}</loc>`);
    expect(xml).not.toContain("404");
  });

  test("llms.txt summarises the profile for AI assistants", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(new RegExp(`^# ${person.name}`));
    expect(text).toContain(person.email);
    for (const cs of caseStudies) expect(text).toContain(`${site.url}/case-studies/${cs.slug}/`);
  });
});
