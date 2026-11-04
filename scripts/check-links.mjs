#!/usr/bin/env node
// Checks every external link on the live site: is it still up, and has the linked page been
// hacked with gambling or spam content (it happens to small company sites)?
//   node scripts/check-links.mjs [--site https://tabee1999.github.io] [--list]
// Exits with 1 if a link is broken or looks compromised, so the daily monitor flags it.

import { appendFileSync } from "node:fs";

const args = process.argv.slice(2);
const site = (args.includes("--site") ? args[args.indexOf("--site") + 1] : "https://tabee1999.github.io").replace(/\/$/, "");
const listOnly = args.includes("--list");
const UA = "Mozilla/5.0 (compatible; TabeedaPortfolioLinkCheck/1.0; +https://tabee1999.github.io)";

// Signs that a page has been injected with spam. Kept strict to avoid false alarms.
const SPAM = /\b(casino|slot gacor|togel|judi online|sportsbook|online betting|poker online|bandar)\b/i;
// Sites that block automated checks but are fine when a person opens them.
const BLOCKS_BOTS = [/linkedin\.com/];

async function get(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,*/*" }, redirect: "follow", signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

const sitemap = await (await get(`${site}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => `${site}${new URL(m[1]).pathname}`);

const links = new Set();
for (const page of pages) {
  const html = await (await get(page)).text();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (!url.startsWith(site)) links.add(url);
  }
}

// Links that only appear in pop-ups (project details) are listed in llms.txt too.
const llms = await (await get(`${site}/llms.txt`)).text();
for (const m of llms.matchAll(/https?:\/\/[^\s)]+/g)) {
  const url = m[0].replace(/[.,]$/, "");
  if (!url.startsWith(site) && !url.startsWith("https://tabee1999.github.io")) links.add(url);
}

if (listOnly) {
  console.log([...links].sort().join("\n"));
  process.exit(0);
}

const rows = [];
let failed = 0;
for (const url of [...links].sort()) {
  let status = "";
  let problem = "";
  try {
    const res = await get(url);
    status = String(res.status);
    const botBlocked = BLOCKS_BOTS.some((re) => re.test(url)) && [403, 429, 999].includes(res.status);
    if (res.status >= 400 && !botBlocked) problem = "broken";
    else if ((res.headers.get("content-type") ?? "").includes("text/html")) {
      const spam = (await res.text()).match(SPAM);
      if (spam) problem = `spam content found ("${spam[0]}")`;
    }
    if (botBlocked) status += " (blocks bots, OK)";
  } catch (err) {
    status = "error";
    problem = err.name === "AbortError" ? "timed out" : "unreachable";
  }
  if (problem) failed++;
  rows.push({ url, status, result: problem || "ok" });
  console.log(`${problem ? "✗" : "✓"} ${status.padEnd(22)} ${url}${problem ? `  ← ${problem}` : ""}`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const table = rows.map((r) => `| ${r.result === "ok" ? "✅" : "❌"} | ${r.url} | ${r.status} | ${r.result} |`).join("\n");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## External links (${rows.length})\n\n| | Link | Status | Result |\n|---|---|---|---|\n${table}\n`);
}

console.log(`\n${rows.length} external links checked, ${failed} problem${failed === 1 ? "" : "s"}.`);
process.exit(failed ? 1 : 0);
