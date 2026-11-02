# Tabeeda Shakir — QA portfolio

Personal portfolio for a Senior QA Engineer, built to be **tested like a product**: every push runs a Playwright suite (desktop Chrome, desktop Firefox, mobile Chrome), axe accessibility checks and Lighthouse, then publishes the site and its latest test report to GitHub Pages.

- **No framework, no runtime dependencies.** `node build.mjs` turns `content.js` into plain HTML, one CSS file and one small script. Nothing to keep updated, fast on any connection, hostable anywhere.
- **All text lives in `content.js`.** Edit words, projects and case studies there; the templates never need touching.
- **Unfinished content stays hidden.** Anything in `[square brackets]` is left out of the public build, so the site always looks finished. `npm run draft` shows the same site with every placeholder highlighted, and `npm run placeholders` lists what's left.

## What visitors can do

- **Check my fit:** a recruiter pastes a job description and the matching skills light up, with an honest list of tools I'm learning or don't use yet. Runs entirely in the browser.
- **Switch light or dark theme** (follows the system until they choose; the choice is remembered).
- **Copy my email** in one click, with a confirmation.
- **See where they are:** the nav highlights the section on screen, and case studies have an "On this page" panel with the key result.
- **Get back to the top** on long pages, and **print** a clean one-column copy.

## Folder structure

```
tabeeda-portfolio/
├─ content.js                 ← all site text: edit this
├─ build.mjs                  ← static build: content.js + src/ → dist/
├─ src/
│  ├─ render.mjs              ← HTML templates (home, case study, 404)
│  ├─ styles.css              ← design tokens, light/dark themes, layout
│  └─ main.js                 ← menu, theme switch, job match, copy email, form validation
├─ public/                    ← copied as-is: favicon, link-preview image, CV
│  ├─ favicon.svg
│  ├─ apple-touch-icon.png
│  ├─ og-image.png            ← 1200×630 image used in LinkedIn/WhatsApp previews
│  └─ cv/Tabeeda-Shakir-CV.pdf   ← placeholder: replace with your CV
├─ scripts/serve.mjs          ← tiny static server for preview and tests
├─ tests/
│  ├─ helpers.ts
│  ├─ home.spec.ts            ← hero, SEO metadata, CV download, sections
│  ├─ navigation.spec.ts      ← anchors, broken links, case study pages, 404
│  ├─ contact.spec.ts         ← form validation, success and failure (mocked)
│  ├─ responsive.spec.ts      ← 360px layout, mobile menu, tap targets, dark mode
│  ├─ accessibility.spec.ts   ← axe (WCAG 2.2 AA) on every page, skip link
│  └─ interactions.spec.ts    ← job match, theme switch, copy email, active nav, back to top
├─ playwright.config.ts
├─ lighthouserc.json
├─ .github/workflows/ci.yml   ← test → Lighthouse → deploy to GitHub Pages
├─ PLACEHOLDERS.md            ← checklist of what to fill in
└─ package.json
```

## Run it locally

Needs Node 20 or newer.

```bash
npm install                      # Playwright, axe and Lighthouse CI (dev only)
npx playwright install chromium firefox

npm run preview                  # public build at http://localhost:4321
npm run draft                    # same, with placeholders highlighted for editing
npm test                         # full suite (starts the server for you)
npm run test:chrome              # faster: desktop + mobile Chrome only
npm run report                   # open the HTML report of the last run
npm run placeholders             # list every [placeholder] left in content.js
npm run lighthouse               # Lighthouse scores for the live home and a case study page
```

After the first `npm install`, commit the generated `package-lock.json`. CI then uses `npm ci` for repeatable installs.

## Edit the content

1. Open `content.js` and replace the `[bracketed]` text. `PLACEHOLDERS.md` has the full checklist.
2. Replace `public/cv/Tabeeda-Shakir-CV.pdf` with your CV (same file name).
3. Optional photo: add `public/images/tabeeda.webp` (square, at least 192×192) and set `person.photo: "images/tabeeda.webp"`.
4. Empty lists hide their section: `testimonials: []` or `writing: []`.
5. Use `npm run draft` while editing to see what's still missing. The public build hides unfinished items: a project with a placeholder name, a work sample without a link, a decision's missing reason.
6. Optional: `npm run build:strict` fails if any placeholder is left, if you want CI to enforce a finished site.

## Test strategy

The suite treats the portfolio as a small product with real users: recruiters skimming on a phone, and hiring managers reading in detail.

| Risk | How it's covered |
| --- | --- |
| A recruiter can't see who I am or how to reach me | `home` checks the name, role, open-to-work badge and calls to action |
| Shared links look broken on LinkedIn | `home` checks title, description, Open Graph image and the JSON-LD Person schema |
| Dead links or missing pages | `navigation` requests every internal link on every page and confirms each `#anchor` exists |
| Unsafe external links | every external link must open in a new tab with `rel="noopener"` |
| Contact form loses messages | `contact` covers empty fields, invalid email, success and server failure |
| Layout breaks on small phones | `responsive` fails if any page scrolls sideways at 360px; checks the menu and 44px tap targets |
| Dark mode is unreadable | `theme` confirms colors switch with the system setting; axe also runs in dark mode |
| Accessibility regressions | `a11y` runs axe with WCAG 2.0/2.1/2.2 A and AA rules on every page and on the form's error state |
| The hero advertises tests that don't exist | `home` checks every test name shown in the hero matches a real test in this folder |
| The job match gives wrong answers | `job match` checks real matches, gaps, and that "JavaScript" doesn't count as "Java" |
| Interactive features break | `interactions` covers the theme switch (and that it's remembered), copy email, active nav, back to top and the case study menu |

Design decisions:

- **The network is mocked for the form.** Tests intercept Formspree requests with `page.route`, so they're fast, free, and work before the form is connected. Both the success and the failure path are covered.
- **External links are checked for safety, not liveness, by default.** Sites like LinkedIn block automated requests, which would make the suite flaky. Run `CHECK_EXTERNAL_LINKS=1 npm test` to include live checks.
- **Reduced motion in tests.** The config sets `reducedMotion: "reduce"`, which turns off the hero animation and smooth scrolling so assertions never race an animation. This also exercises the reduced-motion styles.
- **Soft assertions for sweeps.** Link and layout checks use `expect.soft`, so one run reports every broken link instead of stopping at the first.
- **One retry in CI, with a trace.** A test that only passes on retry is reported as flaky, not hidden, and the retry records a trace for debugging.
- **Content-driven tests.** Tests import `content.js`, so adding a case study automatically adds its page, link and accessibility checks.

## Deploy

### GitHub Pages (set up in the workflow)

1. Push this folder to a new GitHub repository.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow runs the tests, then deploys `dist/` with the Playwright report at `/report/`.
4. Set `site.url` in `content.js` to the address GitHub shows (e.g. `https://your-username.github.io/portfolio`) and `site.repoUrl` to the repo.

The site uses relative links, so it works both at a domain root and under a `/repo/` path. For a custom domain, add it under **Settings → Pages** and update `site.url`.

The deploy waits for the Playwright tests. Lighthouse then audits the live site, so it measures the real domain, HTTPS and CDN. If you change `site.url`, update the URLs in `lighthouserc.json` too.

### Netlify or Vercel

Import the repo and use build command `node build.mjs` with output folder `dist`. The quality report link then needs its own step to publish `playwright-report/`, or point `site.qualityReportPath` somewhere else.

## Contact form (Formspree)

1. Create a free form at [formspree.io](https://formspree.io).
2. Paste its endpoint (`https://formspree.io/f/xxxxxxx`) into `site.formEndpoint` in `content.js`.
3. Send yourself a test message from the live site.

The form validates in the browser, shows clear errors next to each field, includes a spam honeypot and keeps the visitor's message if sending fails.

## Analytics

Set `site.plausibleDomain` to your domain to load [Plausible](https://plausible.io) (privacy-friendly, no cookie banner needed). Leave it empty for no analytics.
