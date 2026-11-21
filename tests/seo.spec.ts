import { test, expect } from "@playwright/test";
import { allureLabels, allPages, content } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "SEO and AI search", "normal"));

const { site, person, caseStudies, faqs, stats, pages, services, experience } = content;

type Node = { "@type": string; [key: string]: unknown };
async function jsonLd(page: import("@playwright/test").Page): Promise<Node[]> {
  const blocks = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((e) => e.textContent ?? ""));
  return blocks.flatMap((b) => (JSON.parse(b)["@graph"] as Node[]) ?? []);
}

test.describe("SEO", () => {
  for (const path of allPages) {
    test(`${path} has a title, description and canonical`, async ({ page }) => {
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
  });

  test("every page has its own title and description", async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of allPages) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add((await page.locator('meta[name="description"]').getAttribute("content"))!);
    }
    expect(titles.size).toBe(allPages.length);
    expect(descriptions.size).toBe(allPages.length);
  });

  test("inner pages carry breadcrumbs and their own page type for search engines", async ({ page }) => {
    const types: Record<string, string> = { "/about/": "AboutPage", "/experience/": "WebPage", "/projects/": "CollectionPage", "/skills/": "WebPage", "/contact/": "ContactPage" };
    for (const [path, type] of Object.entries(types)) {
      await page.goto(path);
      const graph = await jsonLd(page);
      expect(graph.find((n) => n["@type"] === type), path).toBeTruthy();
      expect(graph.find((n) => n["@type"] === "BreadcrumbList"), path).toBeTruthy();
      expect(graph.find((n) => n["@type"] === "Person")?.name, path).toBe(person.name);
    }
  });

  test("the contact page answers recruiters' questions as an FAQ", async ({ page }) => {
    await page.goto("/contact/");
    const faq = (await jsonLd(page)).find((n) => n["@type"] === "FAQPage")!;
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
    const get = async (path: string) => (await (await request.get(path)).text()).replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/<!-- -->/g, "");
    const home = await get("/");
    const h1 = (home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>/g, "");
    expect(h1).toBe(`${person.name} ${person.role}`);
    const expected: Record<string, string[]> = {
      "/": [...stats.map((s) => s.detail), ...content.process.map((p) => p.title)],
      "/experience/": experience.flatMap((e) => [e.role, e.bullets[0]]),
      "/skills/": services.map((s) => s.title),
      "/contact/": [...faqs.map((f) => f.q), ...faqs.map((f) => f.a)],
    };
    for (const [path, texts] of Object.entries(expected)) {
      const html = path === "/" ? home : await get(path);
      expect(texts.filter((t) => !html.includes(t)), path).toEqual([]);
    }
  });

  test("pages send a strict Content Security Policy that the site itself obeys", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (m) => {
      if (/Content Security Policy/i.test(m.text())) violations.push(m.text());
    });
    await page.goto("/");
    const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    // Use the page: open the chat and a project so lazy parts load too.
    await page.getByTestId("chat-launcher").click();
    await page.getByRole("button", { name: "What is AI-first QA?" }).click();
    await expect(page.getByTestId("chat-answer")).toHaveCount(1);
    expect(violations).toEqual([]);
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
    for (const p of Object.values(pages)) expect(text).toContain(`(${site.url}${p.path})`);
  });
});
