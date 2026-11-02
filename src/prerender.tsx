// Runs at build time in Node: renders every route to static HTML with full SEO metadata,
// then React hydrates it in the browser. Also generates sitemap.xml, robots.txt and llms.txt.

import { renderToString } from "react-dom/server";
import { App, type PageData } from "./App";
import { caseStudies, education, experience, faqs, person, projects, services, site, skillGroups, stats } from "./content";

type Assets = { css: string; js: string; buildYear: number };
type Meta = { title: string; description: string; path: string; type: "profile" | "article" | "website"; noindex?: boolean; jsonLd?: object };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
const abs = (path: string) => `${site.url}${path}`;
const ogImage = abs("/og-image.jpg");

// ── Structured data (schema.org) ──────────────────────────────────────────

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

const knowsAbout = [
  "Software quality assurance",
  "Software testing",
  "Manual testing",
  "Exploratory testing",
  "Test automation",
  "AI-first QA",
  "AI-assisted testing",
  "API testing",
  "Mobile app testing",
  "Performance testing",
  "Security testing",
  "Accessibility testing (WCAG)",
  ...skillGroups.flatMap((g) => g.items).filter((s) => ["Playwright", "Selenium", "RestAssured", "TestNG", "Postman", "Java", "SQL", "JMeter", "OWASP ZAP", "GitHub Actions", "Azure DevOps", "Jenkins", "Jira", "TestRail"].includes(s)),
];

const personLd = {
  "@type": "Person",
  "@id": personId,
  name: person.name,
  alternateName: person.alternateName,
  givenName: person.firstName,
  familyName: "Shakir",
  jobTitle: person.role,
  description: person.intro,
  url: `${site.url}/`,
  image: { "@type": "ImageObject", url: abs(`/${person.photo}.jpg`), width: 480, height: 720, caption: person.photoAlt },
  email: `mailto:${person.email}`,
  sameAs: [person.linkedin, person.github],
  address: person.countries.map((c) => ({ "@type": "PostalAddress", addressCountry: c })),
  seeks: { "@type": "Demand", description: `${person.targetRoles.join(", ")} roles. ${person.employment}. ${person.openTo}.` },
  worksFor: { "@type": "Organization", name: experience[0].company, url: experience[0].url, description: experience[0].about },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  hasOccupation: {
    "@type": "Occupation",
    name: person.role,
    occupationalCategory: "15-1253.00 Software Quality Assurance Analysts and Testers",
    skills: skillGroups.flatMap((g) => g.items).join(", "),
  },
  knowsAbout,
  knowsLanguage: ["English", "Urdu", "Turkish"],
};

const websiteLd = {
  "@type": "WebSite",
  "@id": websiteId,
  url: `${site.url}/`,
  name: `${person.name} — ${person.role}`,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": personId },
};

// ── Pages ─────────────────────────────────────────────────────────────────

function homeMeta(): Meta {
  return {
    title: site.title,
    description: site.description,
    path: "/",
    type: "profile",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        personLd,
        websiteLd,
        {
          "@type": "ProfilePage",
          "@id": `${site.url}/#profile`,
          url: `${site.url}/`,
          name: site.title,
          description: site.description,
          isPartOf: { "@id": websiteId },
          mainEntity: { "@id": personId },
          about: { "@id": personId },
          inLanguage: "en",
          dateModified: new Date().toISOString().slice(0, 10),
        },
        {
          "@type": "FAQPage",
          "@id": `${site.url}/#faq`,
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
        {
          "@type": "ItemList",
          "@id": `${site.url}/#case-studies`,
          name: "QA case studies",
          itemListElement: caseStudies.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/case-studies/${c.slug}/`), name: c.title })),
        },
      ],
    },
  };
}

function caseMeta(slug: string): Meta {
  const c = caseStudies.find((x) => x.slug === slug)!;
  const path = `/case-studies/${c.slug}/`;
  return {
    title: `${c.title} — QA case study by ${person.name}`,
    description: c.summary,
    path,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        personLd,
        websiteLd,
        {
          "@type": "Article",
          "@id": `${abs(path)}#article`,
          headline: c.title,
          description: c.summary,
          url: abs(path),
          image: ogImage,
          author: { "@id": personId },
          publisher: { "@id": personId },
          isPartOf: { "@id": websiteId },
          about: c.tags,
          keywords: [c.area, ...c.tags, "QA case study", "software testing"].join(", "),
          inLanguage: "en",
          mainEntityOfPage: abs(path),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
            { "@type": "ListItem", position: 2, name: "Case studies", item: `${site.url}/#case-studies` },
            { "@type": "ListItem", position: 3, name: c.title, item: abs(path) },
          ],
        },
      ],
    },
  };
}

function document(meta: Meta, body: string, page: PageData, assets: Assets) {
  const url = abs(meta.path);
  const preloadPhoto = page.route === "home" ? `<link rel="preload" as="image" href="/${person.photo}.webp" type="image/webp" fetchpriority="high">` : "";
  const verify = [
    site.googleSiteVerification && `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">`,
    site.bingSiteVerification && `<meta name="msvalidate.01" content="${esc(site.bingSiteVerification)}">`,
  ]
    .filter(Boolean)
    .join("");

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
${meta.noindex ? "" : `<link rel="canonical" href="${url}">`}
<meta name="author" content="${esc(person.name)}">
<meta name="theme-color" content="#07061a">
<meta name="color-scheme" content="dark">
<meta name="format-detection" content="telephone=no">
${verify}
<meta property="og:type" content="${meta.type}">
<meta property="og:site_name" content="${esc(person.name)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(`${person.name}, ${person.role}`)}">
<meta property="og:locale" content="en_US">
${meta.type === "profile" ? `<meta property="profile:first_name" content="${esc(person.firstName)}"><meta property="profile:last_name" content="Shakir">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(meta.title)}">
<meta name="twitter:description" content="${esc(meta.description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${preloadPhoto}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/${assets.css}">
<link rel="modulepreload" href="/assets/${assets.js}">
${meta.jsonLd ? `<script type="application/ld+json">${json(meta.jsonLd)}</script>` : ""}
</head>
<body>
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-3 focus:font-semibold focus:text-white">Skip to content</a>
<div id="root">${body}</div>
<script>window.__PAGE__=${json({ page, year: assets.buildYear })}</script>
<script type="module" src="/assets/${assets.js}"></script>
</body>
</html>
`
    .replace(/\n{2,}/g, "\n");
}

export function renderRoutes(assets: Assets) {
  const routes: { file: string; page: PageData; meta: Meta }[] = [
    { file: "index.html", page: { route: "home" }, meta: homeMeta() },
    ...caseStudies.map((c) => ({ file: `case-studies/${c.slug}/index.html`, page: { route: "case-study", slug: c.slug } as PageData, meta: caseMeta(c.slug) })),
    {
      file: "404.html",
      page: { route: "404" },
      meta: { title: `Page not found — ${person.name}`, description: "This page doesn't exist.", path: "/404.html", type: "website", noindex: true },
    },
  ];
  return routes.map(({ file, page, meta }) => ({
    file,
    html: document(meta, renderToString(<App page={page} year={assets.buildYear} />), page, assets),
  }));
}

// ── Crawler files ─────────────────────────────────────────────────────────

const crawlers = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "Google-Extended",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "DuckAssistBot",
  "CCBot",
];

function llmsTxt() {
  const lines = [
    `# ${person.name} — ${person.role}`,
    "",
    `> ${person.intro}`,
    "",
    `${person.name} (also written ${person.alternateName}) is based in ${person.location} (time zones: ${person.timezones.map((t) => `${t.label} ${t.offset}`).join("; ")}).`,
    "",
    "## Work preferences",
    `- Target roles: ${person.targetRoles.join(", ")}`,
    `- Employment: ${person.employment}`,
    `- Work authorisation: ${person.workAuthorisation}`,
    `- Open to: ${person.openTo}`,
    `- Languages: ${person.languages}`,
    `- Availability: ${person.available}`,
    "",
    "## Key facts",
    ...stats.map((s) => `- ${s.prefix ?? ""}${s.value}${s.suffix ?? ""} ${s.label.charAt(0).toLowerCase() + s.label.slice(1)} (${s.detail})`),
    `- Current role: ${experience[0].role} at ${experience[0].company} (${experience[0].period})`,
    `- Education: ${education.degree}, ${education.school} (${education.years})`,
    "",
    "## Expertise",
    ...services.map((s) => `- ${s.title}: ${s.text}`),
    "",
    "## Experience",
    ...experience.map((e) => `- ${e.role}, ${e.company} (${e.period}, ${e.location}): ${e.summary}${e.about ? ` About the company: ${e.about}` : ""}${e.url ? ` ${e.url}` : ""}`),
    "",
    "## Projects",
    ...projects.map((p) => `- ${p.name} (${p.company}, ${p.domain}): ${p.summary}`),
    "",
    "## Case studies",
    ...caseStudies.map((c) => `- [${c.title}](${abs(`/case-studies/${c.slug}/`)}): ${c.summary}`),
    "",
    "## Skills",
    ...skillGroups.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
    "## Contact",
    `- Email: ${person.email}`,
    `- LinkedIn: ${person.linkedin}`,
    `- GitHub: ${person.github}`,
    `- CV (PDF): ${abs(`/${person.cv}`)}`,
    `- Portfolio: ${site.url}/`,
    "",
  ];
  return lines.join("\n");
}

export function siteFiles(isoDate: string): Record<string, string> {
  const urls = [{ loc: `${site.url}/`, priority: "1.0" }, ...caseStudies.map((c) => ({ loc: abs(`/case-studies/${c.slug}/`), priority: "0.8" }))];
  return {
    "robots.txt": [
      ...crawlers.flatMap((c) => [`User-agent: ${c}`, "Allow: /", ""]),
      "User-agent: *",
      "Allow: /",
      "Disallow: /report/",
      "",
      `Sitemap: ${site.url}/sitemap.xml`,
      "",
    ].join("\n"),
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u, i) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${isoDate}</lastmod>
    <priority>${u.priority}</priority>${
      i === 0
        ? `
    <image:image><image:loc>${abs(`/${person.photo}.jpg`)}</image:loc></image:image>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>
`,
    "llms.txt": llmsTxt(),
    "site.webmanifest": JSON.stringify(
      {
        name: `${person.name} — ${person.role}`,
        short_name: person.name,
        start_url: "/",
        display: "browser",
        background_color: "#07061a",
        theme_color: "#07061a",
        icons: [
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
      },
      null,
      2,
    ),
  };
}
