# Tabeeda Shakir — Senior QA Engineer portfolio

Live at **https://tabee1999.github.io**

A portfolio built and tested like a product: React + TypeScript + Tailwind CSS, pre-rendered to static HTML for search engines, and checked on every push by a Playwright suite (desktop Chrome, desktop Firefox, mobile Chrome), axe accessibility scans and Lighthouse.

Every deploy publishes the results with the site:

- **[Allure report](https://tabee1999.github.io/allure/)**: tests grouped by feature and severity, with trends that build up across deploys
- **[Playwright report](https://tabee1999.github.io/report/)**: the raw run, with traces for any retried test

## What's on the site

- **Hero** with photo, availability, CV download, quick links and the facts recruiters check first (roles, work authorisation, time zones, languages)
- **Test-run card:** the key numbers from the CV (5+ years, 300+ automated tests, regression in under a day, 700+ test cases) shown as a passing Playwright run, linking to the live Allure report
- **Services:** AI-first QA, manual and exploratory QA, test automation, API testing, web and mobile, performance and security
- **Projects** with filters (Automation, Manual, AI-first, API, Mobile, Performance) and a details dialog for each
- **Interactive case studies:** keyboard-accessible tabs on the projects page, plus a full page for each
- **Experience timeline** with expandable roles, **skills**, and a **"Check my fit"** tool where recruiters paste a job ad and see matching skills
- **Contact form** with validation (opens a ready-to-send email until a form service is connected), copy-email button, LinkedIn, GitHub and CV
- **FAQ** written for recruiters and for AI search engines
- **Chat assistant** ("Ask about me") on every page: answers recruiter questions about experience, skills, projects, availability and contact. It works today with answers built from `src/content.ts`, and switches to Claude AI once the chat worker is set up ([chat-worker/README.md](chat-worker/README.md))

## Pages

Each page has its own address, title, description, breadcrumbs and structured data, so search engines can index and rank them separately:

| Page | Address | What's on it |
| --- | --- | --- |
| Home | `/` | Hero, the test run, featured projects, how I work, AI tools, links to everything else |
| About | `/about/` | Story, education, languages, team photos |
| Experience | `/experience/` | Every role, with the GPS trail |
| Projects | `/projects/` | Projects with filters, case studies |
| Each project | `/projects/<slug>/` | What I tested and delivered, my role, the related case study (titled for searches like “QA for a travel booking platform”) |
| Skills | `/skills/` | Expertise, tools, the job-match checker |
| Contact | `/contact/` | Contact form, the bug-to-shield animation, FAQ |

Old one-page links such as `/#experience` or `/#contact` redirect to the new pages.

## Design and scroll animations

Light mint-grey paper, deep pine text and an emerald accent, set in Schibsted Grotesk. Four scroll-driven animations, all built in code (no video files):

- **Test run** (home): the dark test card grows and a Playwright run plays as you scroll, test by test, with a browser following along.
- **How I work** (home): a phone with a delivery app turns into view; risks are marked, a scan finds bugs, the bugs turn into ticks and the release ships.
- **GPS trail** (experience): a route draws itself down the job history and a pin lights up at each job.
- **Bug to shield** (contact): a bug made of particles rebuilds itself as a shield with a tick.

They share one small engine (`src/lib/scroll.ts`): one passive scroll listener writes each section's progress to a CSS variable, so most motion is plain CSS. People who prefer reduced motion, and browsers without JavaScript, see every animation's finished state with no pinned scrolling. `tests/animations.spec.ts` scrolls through each one and checks what's on screen.

## Speed

Built to load fast on cheap phones and slow connections:

- **About 25–40 kB of JavaScript per page** (gzipped), down from 108 kB. The browser runs the React components on [Preact](https://preactjs.com/) through `preact/compat` (about 4 kB instead of React's ~55 kB), while pre-rendering at build time still uses React. Set `RUNTIME=react` to build the browser code with React instead.
- **Code split per page.** Each kind of page (`src/pages/`) gets its own small entry script; shared code sits in cached chunks that are preloaded in the `<head>`. The chat window and its answer engine download only when someone hovers or opens the chat button.
- **Fonts served from the site** (`public/fonts/`, Latin subset, variable weight, 72 kB for both), so no extra connection to a font service before text shows.
- **The hero background rests.** It repaints only the dots near the scan line or pointer, at up to 30 frames a second, plays three sweeps and stops until the pointer moves. It stays still with reduced motion, data saver or a low-memory phone.
- `tests/performance.spec.ts` holds the budgets: 50 kB of JavaScript on the home page, 40 kB elsewhere, 20 kB of CSS, nothing loaded from other servers.

## SEO and AI search

- every page is pre-rendered HTML with a unique title, description, canonical URL, Open Graph and Twitter cards
- structured data (schema.org): `Person`, `ProfilePage`, `WebSite`, `FAQPage`, and `Article` + `BreadcrumbList` on case studies
- `sitemap.xml`, `robots.txt` that welcomes search and AI crawlers (Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, ClaudeBot and others) and `llms.txt`, a plain-text profile for AI assistants
- all generated from `src/content.ts`, so they never drift from what the page says

## Monitoring, security and stats

- **Daily live-site monitor** (`.github/workflows/monitor.yml`): smoke tests against https://tabee1999.github.io and a check that every external link still works and hasn't been hacked with spam. GitHub emails you if it fails.
- **CodeQL** code scanning on every push and weekly; results under the repository's Security tab.
- **Dependabot** opens weekly update pull requests for npm packages and GitHub Actions; each runs the full test suite.
- **Content Security Policy** on every page: only the site's own scripts (inline ones are hash-pinned), Google Fonts and configured services.
- **Visitor stats (optional):** set `site.goatcounterCode` to a free [GoatCounter](https://www.goatcounter.com) code to see visits by country, referrer, device and page, plus clicks on the CV, email, LinkedIn, chat and Allure report. No cookies and no personal data. Share the site as `https://tabee1999.github.io/?ref=company-name` in each application to see which company opened it.

## Project structure

```
├─ src/
│  ├─ content.ts              ← all site text: edit this
│  ├─ App.tsx                 ← the frame every page shares (header, footer, chat)
│  ├─ pages/                  ← what each kind of page shows; one script per page kind
│  ├─ components/             ← Hero, Projects, CaseStudies, Experience, Skills, Contact…
│  ├─ lib/scroll.ts           ← scroll animation engine (progress → CSS variable)
│  ├─ lib/hooks.ts            ← scroll progress bar, local time
│  ├─ styles.css              ← Tailwind v4 theme: colours, fonts, buttons, cards
│  ├─ client.tsx              ← boot(): hydrates the pre-rendered HTML in the browser
│  └─ prerender.tsx           ← renders every page + SEO tags, sitemap, robots.txt, llms.txt
├─ public/                    ← photo, CV, favicon, link-preview image (copied as-is)
├─ scripts/build.mjs          ← esbuild + Tailwind → dist/
├─ scripts/serve.mjs          ← tiny static server for preview and tests
├─ src/lib/assistant.ts       ← the chat's built-in answers (no server needed)
├─ chat-worker/               ← Cloudflare Worker for AI chat answers (Claude), with unit tests
├─ tests/                     ← Playwright: home, navigation, interactions, contact, chat, animations, responsive, accessibility, SEO, performance, visual
├─ tests/__screenshots__/     ← approved screenshots for the visual checks (made in CI)
├─ playwright.config.ts
├─ lighthouserc.json          ← Lighthouse budgets for the live site
├─ .github/workflows/ci.yml   ← test → deploy to GitHub Pages → Lighthouse
└─ .github/workflows/visual-baselines.yml ← re-take the approved screenshots after a design change
```

## Run it locally

Needs Node 20 or newer.

```bash
npm install
npx playwright install chromium firefox

npm run dev            # build and serve at http://localhost:4321
npm test               # full suite (builds and starts the server for you)
npm run test:chrome    # faster: desktop + mobile Chrome only
npm run test:worker    # unit tests for the AI chat worker
npm run report         # open the HTML report of the last run
npm run test:allure    # run the suite and open it as an Allure report
```

## Editing

- **Text, projects, case studies, skills:** `src/content.ts`
- **Photo:** `public/images/tabeeda-shakir-senior-qa-engineer.{webp,jpg}` (480×720)
- **CV:** replace `public/cv/Tabeeda-Shakir-CV.pdf` (keep the file name)
- **Contact form straight to your inbox:** create a free form at [formspree.io](https://formspree.io), then paste its endpoint into `site.formEndpoint`
- **AI chat:** follow [chat-worker/README.md](chat-worker/README.md), then paste the worker address into `site.chatEndpoint`
- **Search Console / Bing:** paste the verification codes into `site.googleSiteVerification` and `site.bingSiteVerification`

## Test strategy

| Risk | Covered by |
| --- | --- |
| A recruiter can't reach me or download the CV | CV link returns a real PDF; email, LinkedIn and GitHub links; contact form validation and the email it opens |
| Broken links or pages | every internal link on every page is requested; anchors exist; 404 page works |
| Layout breaks on a phone | no sideways scrolling at 360, 768, 1024 and 1440px; mobile menu; 44px tap targets |
| Interactive parts stop working | project filters and project pages, case study tabs (mouse and keyboard), experience accordion, FAQ, job match, copy email |
| The chat says something wrong or goes off topic | built-in answers checked against the CV; AI mode tested with a mocked service (reply, history, outage fallback, rate limit); worker unit tests for origin checks, input limits, rate limiting, hidden errors and the on-topic system prompt |
| Not usable with a keyboard or screen reader | axe (WCAG 2.2 AA) on every page and in open states; skip link; visible focus; heading order |
| Not found in Google or AI search | titles, descriptions, canonicals, social cards, JSON-LD, robots.txt, sitemap, llms.txt; content present before JavaScript runs |
| Slow or poorly built | JavaScript and CSS budgets per page; no third-party requests; the hero animation rests; Lighthouse on the live site after each deploy |
| A layout or style change slips through unnoticed | visual regression: key screens compared with approved screenshots at 0 pixels of difference (desktop and mobile Chrome, on Linux CI). After a deliberate design change, run **Actions → Visual baselines** to approve the new look |
