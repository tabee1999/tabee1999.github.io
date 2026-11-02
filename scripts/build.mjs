#!/usr/bin/env node
// Production build: React + TypeScript + Tailwind CSS v4 → static, pre-rendered pages in dist/.
//
//   1. esbuild bundles the browser app (src/client.tsx) and a Node pre-renderer (src/prerender.tsx)
//   2. Tailwind CSS v4 compiles src/styles.css with the class names found in src/
//   3. every route is rendered to real HTML (good for SEO and AI search), then hydrated by React
//   4. sitemap.xml, robots.txt and llms.txt are generated from the same content
//
// Usage: node scripts/build.mjs

import { build as esbuild, transform } from "esbuild";
import { compile } from "tailwindcss";
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const TMP = join(ROOT, ".build");
const require = createRequire(join(ROOT, "package.json"));

const t0 = Date.now();
rmSync(DIST, { recursive: true, force: true });
rmSync(TMP, { recursive: true, force: true });
mkdirSync(join(DIST, "assets"), { recursive: true });
mkdirSync(TMP, { recursive: true });

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 10);

// ── 1. JavaScript ──────────────────────────────────────────────────────────
const common = {
  bundle: true,
  jsx: "automatic",
  sourcemap: false,
  logLevel: "warning",
  define: { "process.env.NODE_ENV": '"production"' },
  absWorkingDir: ROOT,
};

const client = await esbuild({
  ...common,
  entryPoints: ["src/client.tsx"],
  format: "esm",
  target: ["es2020"],
  minify: true,
  write: false,
  platform: "browser",
});
const appJs = client.outputFiles[0].text;
const jsName = `app.${hash(appJs)}.js`;
writeFileSync(join(DIST, "assets", jsName), appJs);

await esbuild({
  ...common,
  entryPoints: ["src/prerender.tsx"],
  format: "esm",
  platform: "node",
  target: ["node20"],
  outfile: join(TMP, "prerender.mjs"),
  packages: "bundle",
  // React's server renderer is CommonJS and requires Node built-ins
  banner: { js: 'import { createRequire as __cr } from "node:module"; const require = __cr(import.meta.url);' },
});

// ── 2. CSS (Tailwind v4) ──────────────────────────────────────────────────
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const sources = walk(join(ROOT, "src")).filter((f) => /\.(tsx?|css)$/.test(f));
const candidates = new Set();
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  // Whole class strings (keeps arbitrary values like text-[clamp(2rem,5vw,3rem)] intact),
  // plus finer pieces for classes that sit next to JSX or template syntax.
  const tokens = [...text.split(/[\s"'`]+/), ...text.split(/[\s"'`{}()<>,;]+/)];
  for (const token of tokens) {
    if (token && /[a-z]/.test(token) && token.length < 160) candidates.add(token.replace(/^\$\{|\}$/g, ""));
  }
}

const tailwindDir = dirname(require.resolve("tailwindcss/package.json"));
const loadStylesheet = async (id, base) => {
  const path = id === "tailwindcss" ? join(tailwindDir, "index.css") : id.startsWith("tailwindcss/") ? join(tailwindDir, id.slice(12)) : resolve(base, id);
  return { path, base: dirname(path), content: readFileSync(path, "utf8") };
};
const inputCss = readFileSync(join(ROOT, "src/styles.css"), "utf8");
const compiler = await compile(inputCss, { base: join(ROOT, "src"), loadStylesheet });
const rawCss = compiler.build([...candidates]);
const { code: css } = await transform(rawCss, { loader: "css", minify: true, target: ["chrome100", "safari15", "firefox100"] });
const cssName = `app.${hash(css)}.css`;
writeFileSync(join(DIST, "assets", cssName), css);

// ── 3. Static assets ──────────────────────────────────────────────────────
cpSync(join(ROOT, "public"), DIST, { recursive: true });

// ── 4. Pre-render pages ───────────────────────────────────────────────────
const { renderRoutes, siteFiles } = await import(pathToFileURL(join(TMP, "prerender.mjs")).href);
const pages = renderRoutes({ css: cssName, js: jsName, buildYear: new Date().getFullYear() });
for (const page of pages) {
  const file = join(DIST, page.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page.html);
}
for (const [name, body] of Object.entries(siteFiles(new Date().toISOString().slice(0, 10)))) {
  writeFileSync(join(DIST, name), body);
}

rmSync(TMP, { recursive: true, force: true });
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(`✓ Built ${pages.length} pages in ${Date.now() - t0} ms  (js ${kb(appJs.length)}, css ${kb(css.length)})`);
