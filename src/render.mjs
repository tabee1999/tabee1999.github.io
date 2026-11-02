// HTML templates. Pure functions: content in, HTML string out.
// You shouldn't need to edit this file to change any text — use content.js.
//
// Two modes:
//   public (default)  anything still in [brackets] is left out, so the live site looks finished
//   draft (--draft)   placeholders are highlighted and unfinished links show, for editing

let DRAFT = false;
export const setDraft = (on) => {
  DRAFT = !!on;
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const isPlaceholder = (s) => typeof s === "string" && /\[[^\]]*\]/.test(s);
const isPending = (url) => !url || isPlaceholder(url);
const isExternal = (url) => /^https?:\/\//.test(url);

// Removes [placeholders] from a sentence: "Agile teams. [Add team size]" → "Agile teams."
const strip = (s) =>
  String(s ?? "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/^[\s.,;:]+/, "")
    .trim();

// Is there anything to show for this text in the current mode?
const has = (s) => (DRAFT ? !!String(s ?? "").trim() : /[\p{L}\p{N}]/u.test(strip(s)));

// Visible text: highlight placeholders in draft mode, leave them out on the public site.
const keepRanges = (html) => html.replace(/(\d)–(\d)/g, "$1\u2060–\u2060$2"); // don't break "2–3" across lines
const t = (s) =>
  keepRanges(DRAFT ? esc(s).replace(/\[([^\]]*)\]/g, '<span class="ph">[$1]</span>') : esc(strip(s)));

// A link; while its URL is a placeholder it shows as plain text (draft) or not at all (public).
function link(href, label, { cls = "", attrs = "" } = {}) {
  if (isPending(href)) {
    return DRAFT
      ? `<span class="pending${cls ? " " + cls : ""}" title="Link not added yet — set it in content.js">${label}</span>`
      : "";
  }
  const ext = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a${cls ? ` class="${cls}"` : ""} href="${esc(href)}"${ext}${attrs ? " " + attrs : ""}>${label}</a>`;
}

const NAV_LABELS = {
  services: "What I do",
  "case-studies": "Case studies",
  projects: "Projects",
  samples: "Work samples",
  skills: "Skills",
  experience: "Experience",
  testimonials: "Testimonials",
  about: "About",
  contact: "Contact",
};

// ── Layout ──────────────────────────────────────────────────────────────────

function head(c, { title, description, path, root }) {
  const { site, person } = c;
  const canonical = `${site.url}/${path}`;
  const og = `${site.url}/og-image.png`;
  const sameAs = [person.linkedin, person.github].filter((u) => !isPending(u));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: site.description,
    ...(isPending(site.url) ? {} : { url: site.url }),
    ...(isPending(person.email) ? {} : { email: `mailto:${person.email}` }),
    worksFor: { "@type": "Organization", name: c.experience[0]?.company },
    alumniOf: { "@type": "CollegeOrUniversity", name: c.education[0]?.school },
    knowsAbout: c.skills.flatMap((g) => g.items).filter((s) => !isPlaceholder(s)),
    ...(sameAs.length ? { sameAs } : {}),
  };
  const analytics = site.plausibleDomain
    ? `<script defer data-domain="${esc(site.plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`
    : `<!-- Analytics: set site.plausibleDomain in content.js to enable Plausible -->`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(person.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(person.name)}, ${esc(person.role)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(og)}">
<meta name="theme-color" content="#f5f7f4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#101614" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="${root}styles.css">
<script>document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
${analytics}
</head>`;
}

function header(c, root, onHome, navIds) {
  const href = (id) => (onHome ? `#${id}` : `${root}#${id}`);
  const cv = isPending(c.person.cv)
    ? ""
    : `<a class="btn btn-small btn-primary header-cv" href="${root}${esc(c.person.cv)}" download>Download CV</a>`;
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${onHome ? "#top" : root}"><span class="brand-mark" aria-hidden="true">✓</span>${esc(c.person.name)}</a>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navIds.map((id) => `<li><a href="${href(id)}" data-section="${id}">${NAV_LABELS[id]}</a></li>`).join("")}</ul>
    </nav>
    <div class="header-actions">
      <button class="theme-btn" type="button" aria-label="Switch to dark theme" title="Switch theme">
        <svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" fill="currentColor"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>
      </button>
      ${cv}
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-icon" aria-hidden="true"></span><span class="menu-label">Menu</span>
      </button>
    </div>
  </div>
</header>`;
}

function footer(c, root) {
  const year = new Date().getFullYear();
  const report = c.site.qualityReportPath ? `${root}${c.site.qualityReportPath}` : "";
  return `<footer class="site-footer">
  <div class="wrap footer-inner">
    <p>© ${year} ${esc(c.person.name)}</p>
    <p class="footer-tested">
      <span><span class="check" aria-hidden="true">✓</span> This site is tested with Playwright.</span>
      ${link(report, "Quality report", { cls: "footer-link", attrs: 'data-testid="quality-report"' })}
      ${link(c.site.repoUrl, "Source code", { cls: "footer-link" })}
    </p>
  </div>
</footer>`;
}

function page(c, { title, description, path, root, onHome, body, navIds }) {
  return `${head(c, { title, description, path, root })}
<body>
${header(c, root, onHome, navIds)}
<main id="main">
${body}
</main>
${footer(c, root)}
<a class="to-top" href="#" aria-label="Back to top"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
<div class="toast" aria-live="polite" aria-atomic="true"></div>
<script src="${root}main.js" defer></script>
</body>
</html>
`;
}

// Section with a left rail (heading + one-line note) and a content column.
function section(id, heading, note, inner) {
  return `<section class="section" id="${id}" aria-labelledby="${id}-title">
  <div class="wrap section-grid">
    <div class="rail">
      <h2 id="${id}-title">${heading}</h2>
      ${note ? `<p class="rail-note">${note}</p>` : ""}
    </div>
    <div class="section-body">
${inner}
    </div>
  </div>
</section>`;
}

const tags = (list) => {
  const items = list.filter(has);
  return items.length ? `<ul class="tags" aria-label="Tools">${items.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "";
};

// ── Home sections ───────────────────────────────────────────────────────────

function hero(c) {
  const { person, site } = c;
  const photo = person.photo
    ? `<img class="hero-photo" src="${esc(person.photo)}" alt="${esc(person.photoAlt)}" width="96" height="96">`
    : "";
  const SHOW_ON_PHONE = 4;
  const lines = site.heroRun
    .map(
      (title, i) =>
        `<span class="run-line${i >= SHOW_ON_PHONE ? " run-extra" : ""}" style="--i:${i}"><span class="run-mark" aria-hidden="true">✓</span> ${esc(title)}</span>`,
    )
    .join("\n");
  const more = site.heroRun.length - SHOW_ON_PHONE;
  const [now, ...before] = c.experience.map((e) => strip(e.company).replace(/\s*\(.*\)$/, "")).filter(Boolean);
  const history = now
    ? `<p class="hero-history">Now at <strong>${esc(now)}</strong>${before.length ? `. Before: ${esc(before.join(", "))}` : ""}</p>`
    : "";
  return `<section class="hero" id="top" aria-labelledby="hero-name">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      ${photo}
      <p class="badge" data-testid="open-to-work"><span class="badge-dot" aria-hidden="true"></span>${esc(person.openTo)}</p>
      <h1 id="hero-name">${esc(person.name)}</h1>
      <p class="role">${esc(person.role)}<span class="role-detail">${esc(person.roleDetail)}</span></p>
      <p class="statement">${t(person.statement)}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#case-studies">View my work</a>
        <a class="btn btn-secondary" href="#contact">Contact me</a>
      </div>
      <p class="hero-meta">
        ${link(person.cv, "Download CV (PDF)", { cls: "text-link", attrs: 'download data-testid="cv-download"' })}
        ${has(person.location) ? `<span class="hero-location">${t(person.location)}</span>` : ""}
      </p>
      ${history}
    </div>
    <figure class="run" aria-labelledby="run-caption">
      <div class="run-window">
        <div class="run-head"><span>tabeeda-portfolio</span><span class="run-status"><span class="run-status-dot" aria-hidden="true"></span>Runs on every push</span></div>
        <pre class="run-body"><code><span class="run-cmd"><span class="run-prompt" aria-hidden="true">$</span> npx playwright test</span>
${lines}${more > 0 ? `\n<span class="run-more">+ ${more} more checks</span>` : ""}
<span class="run-sum">Deploys only when every check passes</span></code></pre>
      </div>
      <figcaption id="run-caption">Real tests from this website's suite. ${link(site.qualityReportPath, "See the latest report", { cls: "run-link" })}</figcaption>
    </figure>
  </div>
</section>`;
}

function impact(c) {
  const items = c.impact.filter((s) => has(s.value));
  if (!items.length) return "";
  return `<section class="impact" aria-label="Highlights">
  <div class="wrap">
    <ul class="impact-row" data-count="${items.length}">
      ${items.map((s) => `<li><span class="impact-value">${t(s.value)}</span><span class="impact-label">${t(s.label)}</span></li>`).join("\n      ")}
    </ul>
  </div>
</section>`;
}

const ICONS = {
  automation: '<path d="M8 6.5v11l9-5.5z" fill="currentColor"/><path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20 4v4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  api: '<path d="M8.5 4.5c-2 0-2.5 1-2.5 2.5v2.5c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5V17c0 1.5.5 2.5 2.5 2.5M15.5 4.5c2 0 2.5 1 2.5 2.5v2.5c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5V17c0 1.5-.5 2.5-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  devices: '<rect x="2.5" y="4.5" width="13" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 18.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="15.5" y="9" width="6" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 16l4-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1.6" fill="currentColor"/>',
  database: '<ellipse cx="12" cy="6" rx="7" ry="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  flag: '<path d="M5 21V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 4.5h11l-2 3.5 2 3.5H5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
};
const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${ICONS[name] ?? ICONS.flag}</svg>`;

function services(c) {
  const items = (c.services ?? []).filter((x) => has(x.title));
  if (!items.length) return "";
  return section(
    "services",
    "What I do",
    "The kinds of testing teams bring me in for.",
    `<ul class="service-grid">${items
      .map(
        (x) => `<li class="service">
          <span class="service-icon">${icon(x.icon)}</span>
          <h3>${t(x.title)}</h3>
          <p>${t(x.text)}</p>
        </li>`,
      )
      .join("\n")}</ul>`,
  );
}

function products(c) {
  const items = (c.products ?? []).filter((x) => has(x.name));
  if (!items.length) return "";
  return section(
    "products",
    "Products I've tested",
    "Across e-commerce, logistics, travel and fintech.",
    `<ul class="product-grid">${items
      .map(
        (x) => `<li class="product">
          <span class="product-mark" aria-hidden="true">${esc(strip(x.name).charAt(0))}</span>
          <div class="product-text">
            <p class="product-domain">${t(x.domain)}</p>
            <h3>${t(x.name)}</h3>
            <p class="product-company">${t(x.company)}</p>
            <ul class="platforms" aria-label="Platforms">${x.platforms.filter(has).map((pl) => `<li>${t(pl)}</li>`).join("")}</ul>
          </div>
        </li>`,
      )
      .join("\n")}</ul>`,
  );
}

function howIWork(c) {
  const steps = (c.process ?? []).filter((x) => has(x.title));
  if (!steps.length) return "";
  return section(
    "process",
    "How I work",
    "From the first requirement to the release call.",
    `<ol class="process">${steps
      .map(
        (x, i) => `<li class="step">
          <span class="step-num" aria-hidden="true">${i + 1}</span>
          <h3>${t(x.title)}</h3>
          <p>${t(x.text)}</p>
        </li>`,
      )
      .join("\n")}</ol>`,
  );
}

// Small drawn previews for project cards.
function projectVisual(kind) {
  if (kind === "browser") {
    const rows = ["home", "navigation", "contact", "a11y"]
      .map((n, i) => `<span class="pv-row"><b>✓</b><i style="--w:${[62, 78, 54, 70][i]}%"></i></span>`)
      .join("");
    return `<div class="pv pv-browser" aria-hidden="true"><span class="pv-bar"><i></i></span>${rows}<span class="pv-pass">All checks passed</span></div>`;
  }
  if (kind === "phone") {
    return `<div class="pv pv-phone" aria-hidden="true"><span class="pv-screen"><span class="pv-road a"></span><span class="pv-road b"></span><span class="pv-pin"></span><span class="pv-card"><i></i><i></i></span></span></div>`;
  }
  return "";
}

function caseStudies(c) {
  const cards = c.caseStudies
    .map((cs) => {
      const m = cs.outcome.metrics.find((x) => has(x.value) && has(x.label));
      const metric = m
        ? `<div class="cs-metric"><span class="cs-metric-value">${t(m.value)}</span><span class="cs-metric-label">${t(m.label)}</span></div>`
        : "";
      return `<li>
        <article class="cs-card${metric ? " has-metric" : ""}">
          <div class="cs-main">
            <p class="cs-area">${esc(cs.area)}</p>
            <h3><a class="cs-link" href="case-studies/${cs.slug}/">${t(cs.title)}</a></h3>
            ${has(cs.summary) ? `<p class="cs-summary">${t(cs.summary)}</p>` : ""}
            <div class="cs-foot">${tags(cs.tags)}<span class="cs-read" aria-hidden="true">Read case study</span></div>
          </div>
          ${metric}
        </article>
      </li>`;
    })
    .join("\n");
  return section(
    "case-studies",
    "Case studies",
    "The problem, what I did and what changed.",
    `<ul class="cs-list">${cards}</ul>`,
  );
}

function highlightJava(code) {
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|\b(given|when|then|await|new|return|import|public|void|class|final|static)\b|\b(\d+)\b/g;
  let out = "";
  let last = 0;
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index));
    const [full, comment, str, kw, num] = m;
    const cls = comment ? "tok-c" : str ? "tok-s" : kw ? "tok-k" : num ? "tok-n" : "";
    out += `<span class="${cls}">${esc(full)}</span>`;
    last = m.index + full.length;
  }
  return out + esc(code.slice(last));
}

function projects(c) {
  const resolve = (u) =>
    u === "SITE_REPO" ? c.site.repoUrl : u === "SITE_REPORT" ? c.site.qualityReportPath : u;
  const visible = c.projects.filter((p) => DRAFT || !isPlaceholder(p.name));
  const rows = visible
    .map((p) => {
      const url = resolve(p.url);
      const report = resolve(p.reportUrl);
      const repoPath = has(url) && (DRAFT || !isPending(url)) ? `<p class="repo-path">${t(String(url).replace(/^https?:\/\//, ""))}</p>` : "";
      const ci =
        !isPending(url) && /github\.com/.test(url) && p.ciWorkflow
          ? `<a class="ci-badge" href="${esc(url)}/actions" target="_blank" rel="noopener noreferrer"><img src="${esc(url)}/actions/workflows/${esc(p.ciWorkflow)}/badge.svg" alt="CI status for ${esc(p.name)}" width="120" height="20" loading="lazy"></a>`
          : DRAFT
            ? `<span class="pending" title="Appears once the repo URL is set in content.js">CI status</span>`
            : "";
      const links = [link(url, "Repository", { cls: "text-link" }), link(report, "Test report", { cls: "text-link" }), ci].filter(Boolean);
      const checks = p.demonstrates.filter(has);
      return `<li class="project${p.visual ? " has-visual" : ""}">
        ${p.visual ? projectVisual(p.visual) : ""}
        <div class="project-info">
        <div class="project-head">
          <h3>${t(p.name)}</h3>
          ${repoPath}
        </div>
        ${has(p.purpose) ? `<p class="project-purpose">${t(p.purpose)}</p>` : ""}
        ${tags(p.tags)}
        ${checks.length ? `<ul class="checks" aria-label="What it demonstrates">${checks.map((d) => `<li>${t(d)}</li>`).join("")}</ul>` : ""}
        ${links.length ? `<p class="project-links">${links.join(" ")}</p>` : ""}
        </div>
      </li>`;
    })
    .join("\n");
  const s = c.snippet;
  // The snippet is an example until its caption placeholder is replaced, so it only shows in draft mode until then.
  const snippet =
    s && (DRAFT || !isPlaceholder(s.caption))
      ? `<figure class="snippet">
        <figcaption>${t(s.caption)}</figcaption>
        <div class="code-scroll" tabindex="0" role="region" aria-label="Code example"><pre><code class="lang-${esc(s.language)}">${s.language === "java" ? highlightJava(s.code) : esc(s.code)}</code></pre></div>
      </figure>`
      : "";
  if (!rows && !snippet) return "";
  return section(
    "projects",
    "Projects",
    "Things I've built and tested, with code and reports where they're public.",
    `${rows ? `<ul class="project-list">${rows}</ul>` : ""}\n${snippet}`,
  );
}

// Small illustrated previews, drawn in HTML so they stay sharp and theme-aware.
function sampleThumb(kind) {
  const L = (w, cls = "") => `<i class="tl${cls ? " " + cls : ""}" style="--w:${w}%"></i>`;
  switch (kind) {
    case "test-plan":
      return `<div class="thumb thumb-plan" aria-hidden="true"><b>Scope</b>${L(90)}${L(70)}<b>Out of scope</b>${L(60)}<b>Exit criteria</b>${L(80)}${L(55)}</div>`;
    case "bug-report":
      return `<div class="thumb thumb-bug" aria-hidden="true"><span class="sev">Major</span>${L(68, "strong")}<b>Steps</b>${L(70)}${L(64)}<b>Expected / actual</b>${L(78)}</div>`;
    case "charter":
      return `<div class="thumb thumb-charter" aria-hidden="true"><span class="timebox">60 min</span><b>Mission</b>${L(88)}${L(50)}<b>Notes</b>${L(72)}${L(66)}</div>`;
    case "rtm":
      return `<div class="thumb thumb-rtm" aria-hidden="true">${["REQ", "TC", "Auto", "Result"].map((h) => `<b>${h}</b>`).join("")}${Array.from({ length: 3 }, () => `<i></i><i></i><i class="ok">✓</i><i class="ok">✓</i>`).join("")}</div>`;
    default:
      return "";
  }
}

function workSamples(c) {
  const visible = c.workSamples.filter((w) => DRAFT || !isPending(w.url));
  if (!visible.length) return "";
  const cards = visible
    .map(
      (w) => `<li class="sample">
        ${sampleThumb(w.kind)}
        <div class="sample-text">
          <h3>${esc(w.title)}</h3>
          ${has(w.subject) ? `<p class="sample-subject">${t(w.subject)}</p>` : ""}
          <p>${t(w.description)}</p>
          ${link(w.url, `View ${esc(w.title.toLowerCase())}`, { cls: "text-link" })}
        </div>
      </li>`,
    )
    .join("\n");
  return section("samples", "QA work samples", "How I plan, explore and report, shown on public apps.", `<ul class="sample-grid">${cards}</ul>`);
}

// Words a job description might use for each skill, used by the match tool.
const SKILL_ALIASES = {
  restassured: ["rest assured", "rest-assured"],
  "postman / newman": ["postman", "newman"],
  "gherkin (bdd)": ["gherkin", "bdd", "cucumber"],
  javascript: ["javascript", "node.js", "nodejs"],
  sql: ["sql", "mysql", "postgresql", "postgres", "database testing"],
  "owasp zap": ["owasp", "zap", "security testing"],
  "chrome devtools": ["devtools", "dev tools"],
  api: ["api", "apis", "rest", "restful", "web services"],
  "mobile (ios, android)": ["mobile", "ios", "android"],
  "cross-browser and responsive": ["cross-browser", "cross browser", "responsive"],
  "test strategy and planning": ["test strategy", "test plan", "test plans", "test planning"],
  "shift-left testing": ["shift-left", "shift left"],
  "release readiness (go/no-go)": ["release readiness", "go/no-go", "release management"],
  "defect triage and root cause analysis": ["triage", "root cause", "defect management", "bug tracking"],
  "agile / scrum": ["agile", "scrum"],
  "github actions": ["github actions", "ci/cd", "ci / cd", "continuous integration"],
};

export function skillKeys(label) {
  const base = strip(label).toLowerCase();
  const name = base.replace(/\s*\(.*\)\s*/g, "").trim();
  const keys = new Set([name, ...(SKILL_ALIASES[base] ?? SKILL_ALIASES[name] ?? [])]);
  return [...keys].filter(Boolean);
}

function skills(c) {
  const groups = c.skills
    .map((g) => {
      const items = g.items.filter(has);
      return items.length
        ? `<div class="skill-group">
        <h3>${esc(g.group)}</h3>
        <ul>${items.map((i) => `<li data-keys="${esc(skillKeys(i).join("|"))}">${t(i)}</li>`).join("")}</ul>
      </div>`
        : "";
    })
    .join("\n");
  const learning = (c.learning ?? []).filter(has);
  // "Python for test automation" → "python", "Selenium WebDriver" → "selenium"
  const learningKeys = learning.map((l) => strip(l).toLowerCase().split(/\s+/)[0]);
  const fit = `<div class="fit" data-learning="${esc(learningKeys.join("|"))}" data-learning-labels="${esc(learning.map(strip).join("|"))}">
        <div class="fit-intro">
          <h3>Check my fit for your role</h3>
          <p>Paste a job description and the matching skills light up below. It runs in your browser; nothing is sent anywhere.</p>
        </div>
        <label class="visually-hidden" for="fit-input">Job description</label>
        <textarea id="fit-input" rows="4" placeholder="Paste a job description here"></textarea>
        <div class="fit-actions">
          <button class="btn btn-small btn-secondary" type="button" data-fit-sample>Try a sample job ad</button>
          <button class="btn btn-small btn-ghost" type="button" data-fit-clear hidden>Clear</button>
        </div>
        <div class="fit-result" id="fit-result" aria-live="polite"></div>
      </div>`;
  return section(
    "skills",
    "Skills",
    "Tools and practices I use day to day and can demo live.",
    `${fit}
      <div class="skill-grid">${groups}</div>
      ${learning.length ? `<p class="skills-learning"><span>Currently learning</span> ${learning.map(t).join(", ")}</p>` : ""}`,
  );
}

function experience(c) {
  const items = c.experience
    .filter((e) => has(e.company))
    .map((e) => {
      const current = /present/i.test(e.period);
      const bullets = e.bullets.filter(has);
      return `<li class="job${current ? " is-current" : ""}">
        <p class="job-period">${t(e.period)}</p>
        <div class="job-body">
          <h3>${t(e.role)} <span class="job-company">at ${t(e.company)}</span></h3>
          <p class="job-location">${t(e.location)}${current ? ' <span class="now">Current role</span>' : ""}</p>
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>` : ""}
        </div>
      </li>`;
    })
    .join("\n");
  const certs = c.certifications
    .filter((x) => has(x.name))
    .map(
      (x) =>
        `<li><span class="cred-name">${t(x.name)}</span><span class="cred-meta">${[x.issuer, x.year].filter(has).map(t).join(", ")}</span>${link(x.url, "Verify", { cls: "text-link" })}</li>`,
    )
    .join("");
  const edu = c.education
    .map((x) => `<li><span class="cred-name">${t(x.degree)}</span><span class="cred-meta">${[x.school, x.year].filter(has).map(t).join(", ")}</span></li>`)
    .join("");
  return section(
    "experience",
    "Experience",
    "Most recent first.",
    `<ol class="timeline">${items}</ol>
      <div class="creds">
        ${certs ? `<div><h3>Certifications</h3><ul class="cred-list">${certs}</ul></div>` : ""}
        <div><h3>Education</h3><ul class="cred-list">${edu}</ul></div>
      </div>`,
  );
}

function testimonials(c) {
  const visible = (c.testimonials ?? []).filter((q) => has(q.quote));
  if (!visible.length) return "";
  const quotes = visible
    .map(
      (q) => `<figure class="quote">
        <blockquote><p>${t(q.quote)}</p></blockquote>
        <figcaption><span class="quote-name">${t(q.name)}</span> <span class="quote-role">${t(q.role)}</span></figcaption>
      </figure>`,
    )
    .join("\n");
  return section("testimonials", "What colleagues say", "", `<div class="quote-grid">${quotes}</div>`);
}

function writing(c) {
  const visible = (c.writing ?? []).filter((w) => has(w.title) && (DRAFT || !isPending(w.url)));
  if (!visible.length) return "";
  const items = visible
    .map((w) => `<li>${link(w.url, t(w.title), { cls: "text-link" })} <span class="cred-meta">${t(w.venue)}${w.year ? ", " + t(w.year) : ""}</span></li>`)
    .join("");
  return section("writing", "Writing", "Articles and posts about testing.", `<ul class="writing-list">${items}</ul>`);
}

function about(c) {
  const paras = c.about.filter(has);
  if (!paras.length) return "";
  return section("about", "About", "", `<div class="prose">${paras.map((p) => `<p>${t(p)}</p>`).join("\n")}</div>`);
}

function contact(c) {
  const p = c.person;
  const rows = [
    ["Email", isPending(p.email) ? (DRAFT ? `<span class="pending">${t(p.email)}</span>` : "") : `<span class="email-row"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a><button class="copy-btn" type="button" data-copy="${esc(p.email)}">Copy</button></span>`],
    ["LinkedIn", link(p.linkedin, "View profile")],
    ["GitHub", link(p.github, "View repositories")],
    ["CV", link(p.cv, "Download PDF", { attrs: "download" })],
  ].filter(([, v]) => v);
  return section(
    "contact",
    esc(c.contact.heading),
    "",
    `<p class="contact-intro">${t(c.contact.intro)}</p>
      <div class="contact-grid">
        <dl class="contact-direct">
          ${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("\n          ")}
        </dl>
        <form class="contact-form" action="${esc(c.site.formEndpoint)}" method="POST" novalidate data-email="${isPending(p.email) ? "" : esc(p.email)}">
          <div class="field">
            <label for="cf-name">Name</label>
            <input id="cf-name" name="name" type="text" autocomplete="name" required aria-describedby="cf-name-error">
            <p class="field-error" id="cf-name-error" hidden></p>
          </div>
          <div class="field">
            <label for="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="cf-email-error">
            <p class="field-error" id="cf-email-error" hidden></p>
          </div>
          <div class="field">
            <label for="cf-message">Message</label>
            <textarea id="cf-message" name="message" rows="5" required aria-describedby="cf-message-error"></textarea>
            <p class="field-error" id="cf-message-error" hidden></p>
          </div>
          <div class="hp" aria-hidden="true"><label for="cf-gotcha">Leave this empty</label><input id="cf-gotcha" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>
          <button class="btn btn-primary" type="submit">Send message</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>`,
  );
}

// Content sections in page order, without any that are empty in the current mode.
function homeSections(c) {
  return [
    ["services", services(c)],
    ["case-studies", caseStudies(c)],
    ["products", products(c)],
    ["process", howIWork(c)],
    ["projects", projects(c)],
    ["samples", workSamples(c)],
    ["skills", skills(c)],
    ["experience", experience(c)],
    ["testimonials", testimonials(c)],
    ["writing", writing(c)],
    ["about", about(c)],
    ["contact", contact(c)],
  ].filter(([, html]) => html);
}

const NAV_ORDER = ["services", "case-studies", "projects", "skills", "experience", "contact"];
const navFor = (c) => {
  const present = new Set(homeSections(c).map(([id]) => id));
  return NAV_ORDER.filter((id) => present.has(id));
};

export function renderHome(c) {
  const sections = homeSections(c).map(([id, html], i) => {
    // Alternate background bands for rhythm; the contact section is always the dark closing band.
    const cls = id === "contact" ? "section section-contact" : i % 2 === 0 ? "section section-alt" : "section";
    return html.replace('class="section"', `class="${cls}"`);
  });
  const body = [hero(c), impact(c), ...sections].filter(Boolean).join("\n");
  return page(c, { title: c.site.title, description: c.site.description, path: "", root: "", onHome: true, body, navIds: navFor(c) });
}

// ── Case study page ────────────────────────────────────────────────────────

export function renderCaseStudy(c, cs, i) {
  const root = "../../";
  const next = c.caseStudies[(i + 1) % c.caseStudies.length];
  const ctx = [
    ["Product", cs.context.product],
    ["Team", cs.context.team],
    ["My role", cs.context.role],
  ].filter(([, v]) => has(v));
  const decisions = cs.approach.filter((a) => has(a.decision));
  const metrics = cs.outcome.metrics.filter((m) => has(m.value) && has(m.label));
  const toc = [
    ["challenge", "Challenge", has(cs.challenge)],
    ["approach", "Approach", decisions.length > 0],
    ["outcome", "Outcome", metrics.length > 0 || has(cs.outcome.summary)],
    ["lessons", "What I'd do differently", has(cs.lessons)],
  ].filter(([, , show]) => show);
  const key = metrics[0];
  const panel = `<div class="cs-aside">
      ${key ? `<div class="cs-key"><span class="cs-key-label">Key result</span><span class="cs-metric-value">${t(key.value)}</span><span class="cs-metric-label">${t(key.label)}</span></div>` : ""}
      <nav class="cs-toc" aria-label="On this page">
        <p>On this page</p>
        <ul>${toc.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ul>
      </nav>
      <a class="btn btn-primary btn-small" href="${root}#contact">Contact me</a>
    </div>`;
  const body = `<article class="cs-page">
  <header class="cs-hero">
    <div class="wrap cs-hero-inner">
      <p><a class="back-link" href="${root}#case-studies">Back to all case studies</a></p>
      <p class="cs-area">${esc(cs.area)}</p>
      <h1>${t(cs.title)}</h1>
      ${has(cs.summary) ? `<p class="cs-lede">${t(cs.summary)}</p>` : ""}
      ${tags(cs.tags)}
    </div>
  </header>
  <div class="wrap cs-layout">
  <div class="cs-body">
    ${ctx.length ? `<dl class="cs-context" data-count="${ctx.length}">${ctx.map(([k, v]) => `<div><dt>${k}</dt><dd>${t(v)}</dd></div>`).join("")}</dl>` : ""}
    ${has(cs.challenge) ? `<section class="cs-section" aria-labelledby="challenge">
      <h2 id="challenge">Challenge</h2>
      <p>${t(cs.challenge)}</p>
    </section>` : ""}
    ${decisions.length ? `<section class="cs-section" aria-labelledby="approach">
      <h2 id="approach">Approach</h2>
      <p class="cs-hint">The decisions that mattered${decisions.some((a) => has(a.why)) ? ", and why I made them" : ""}.</p>
      <ul class="decisions">${decisions
        .map((a) => `<li><p class="decision">${t(a.decision)}</p>${has(a.why) ? `<p class="why">${t(a.why)}</p>` : ""}</li>`)
        .join("")}</ul>
    </section>` : ""}
    ${metrics.length || has(cs.outcome.summary) ? `<section class="cs-section" aria-labelledby="outcome">
      <h2 id="outcome">Outcome</h2>
      ${metrics.length ? `<ul class="outcome-row">${metrics.map((m) => `<li><span class="impact-value">${t(m.value)}</span><span class="impact-label">${t(m.label)}</span></li>`).join("")}</ul>` : ""}
      ${has(cs.outcome.summary) ? `<p>${t(cs.outcome.summary)}</p>` : ""}
    </section>` : ""}
    ${has(cs.lessons) ? `<section class="cs-section" aria-labelledby="lessons">
      <h2 id="lessons">What I'd do differently</h2>
      <p>${t(cs.lessons)}</p>
    </section>` : ""}
    <nav class="cs-next" aria-label="More case studies">
      <p>Next case study</p>
      <a href="${root}case-studies/${next.slug}/">${t(next.title)}</a>
    </nav>
    <div class="cs-cta">
      <p>Hiring for a QA role? I'd like to hear about it.</p>
      <a class="btn btn-primary" href="${root}#contact">Contact me</a>
    </div>
  </div>
  ${panel}
  </div>
</article>`;
  return page(c, {
    title: `${strip(cs.title)} — Case study | ${c.person.name}`,
    description: strip(cs.summary).slice(0, 155) || c.site.description,
    path: `case-studies/${cs.slug}/`,
    root,
    onHome: false,
    body,
    navIds: navFor(c),
  });
}

// ── Utility pages ──────────────────────────────────────────────────────────

export function renderSimple(c, { title, heading, text, path, root }) {
  const body = `<section class="simple-page"><div class="wrap">
  <h1>${esc(heading)}</h1>
  <p>${text}</p>
  <p><a class="btn btn-secondary" href="${root}">Go to the home page</a></p>
</div></section>`;
  return page(c, { title, description: c.site.description, path, root, onHome: false, body, navIds: navFor(c) });
}
