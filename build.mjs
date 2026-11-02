#!/usr/bin/env node
// Zero-dependency static site build: content.js + src/ → dist/
//
//   node build.mjs                       build the public site into dist/ (unfinished [placeholders] are left out)
//   node build.mjs --draft               build with placeholders highlighted, for editing
//   node build.mjs --list-placeholders   list every [placeholder] left in content.js
//   node build.mjs --strict              fail the build if any placeholder is left
//
// No framework and no runtime dependencies: the site is plain HTML, one CSS file
// and one small script, which keeps it fast and easy to host anywhere.

import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import content from "./content.js";
import { renderHome, renderCaseStudy, renderSimple, isPlaceholder, setDraft } from "./src/render.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const args = new Set(process.argv.slice(2));

function findPlaceholders(value, path = "content") {
  if (typeof value === "string") return isPlaceholder(value) ? [{ path, value }] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, `${path}.${k}`));
  return [];
}

const placeholders = findPlaceholders(content);

if (args.has("--list-placeholders")) {
  if (!placeholders.length) console.log("No placeholders left. 🎉");
  for (const p of placeholders) console.log(`${p.path}\n  ${p.value}\n`);
  console.log(`${placeholders.length} placeholder(s) left in content.js`);
  process.exit(0);
}

setDraft(args.has("--draft"));

function write(rel, html) {
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// Static files
cpSync(join(ROOT, "public"), DIST, { recursive: true });
cpSync(join(ROOT, "src/styles.css"), join(DIST, "styles.css"));
cpSync(join(ROOT, "src/main.js"), join(DIST, "main.js"));

// Pages
write("index.html", renderHome(content));
content.caseStudies.forEach((cs, i) => write(`case-studies/${cs.slug}/index.html`, renderCaseStudy(content, cs, i)));

// The 404 page can be served at any depth, so it uses absolute paths from the site root.
// For a GitHub Pages project site (https://user.github.io/repo) that root is "/repo/".
const basePath = isPlaceholder(content.site.url) ? "/" : new URL(content.site.url + "/").pathname;
write(
  "404.html",
  renderSimple(content, {
    title: `Page not found | ${content.person.name}`,
    heading: "This page doesn't exist",
    text: "The link may be out of date. Everything on this site is reachable from the home page.",
    path: "404.html",
    root: basePath,
  }),
);

// CI replaces this folder with the real Playwright HTML report on each deploy.
if (!existsSync(join(DIST, content.site.qualityReportPath, "index.html"))) {
  write(
    `${content.site.qualityReportPath}index.html`,
    renderSimple(content, {
      title: `Quality report | ${content.person.name}`,
      heading: "Quality report",
      text: "The latest Playwright test report is published here by CI after every successful run on the main branch.",
      path: content.site.qualityReportPath,
      root: "../",
    }),
  );
}

// SEO files
const url = content.site.url;
const pages = ["", ...content.caseStudies.map((cs) => `case-studies/${cs.slug}/`)];
const today = new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${url}/${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`,
);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);

console.log(`✓ Built ${pages.length} pages into dist/${args.has("--draft") ? " (draft: placeholders highlighted)" : ""}`);
if (placeholders.length) {
  console.warn(
    args.has("--draft")
      ? `⚠ ${placeholders.length} placeholder(s) highlighted on the page.`
      : `⚠ ${placeholders.length} placeholder(s) left out of the public build. Run "npm run draft" to see them highlighted.`,
  );
  if (args.has("--strict")) {
    console.error("✗ --strict: fill in every placeholder before deploying.");
    process.exit(1);
  }
}
