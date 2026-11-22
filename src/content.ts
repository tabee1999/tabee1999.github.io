// All the words on the site live here. Edit this file, run `npm run build`, and every page,
// the SEO metadata, sitemap and llms.txt update together.

export type Project = {
  slug: string;
  name: string;
  company: string;
  domain: string;
  summary: string;
  highlights: string[];
  tags: string[];
  categories: Category[];
  platforms: string[];
  /** Public website of the product or company, if there is one to link to. */
  url?: string;
  /** Shown as a small drawn preview on the card. */
  visual: "travel" | "payments" | "fleet" | "visa" | "trading" | "marketplace" | "assistant";
  /** The project page's h1: what was tested, in the words someone would search for. */
  headline: string;
  /** The project page's <title> (about 60 characters). */
  seoTitle: string;
  /** The case study that tells the longer story, if there is one. */
  caseStudy?: string;
};

/** Each project has its own page at /projects/<slug>/. */
export const projectPath = (slug: string) => `/projects/${slug}/`;

export type Category = "Automation" | "Manual" | "AI-first" | "API" | "Mobile" | "Performance";

export type CaseStudy = {
  slug: string;
  area: string;
  title: string;
  summary: string;
  tags: string[];
  context: { product: string; team?: string; role: string };
  challenge: string;
  approach: { decision: string; why?: string }[];
  metrics: { value: string; label: string }[];
  outcome?: string;
  lessons?: string;
};

/**
 * The suite's headline number: tests per run across Chrome, Firefox and mobile Chrome, as
 * Playwright reports it. Check with `npx playwright test --list` (354 when last updated).
 */
export const testCount = "350+";

export const site = {
  url: "https://tabeedashakir.github.io",
  // Link-preview image for LinkedIn, WhatsApp, Slack and email (1200 × 630). Rename the file when it
  // changes, so those apps fetch the new one instead of showing their cached copy.
  ogImage: "og-tabeeda-shakir-senior-qa-engineer.jpg",
  repoUrl: "https://github.com/tabeedashakir/tabeedashakir.github.io",
  // Test results published with every deploy: an Allure dashboard and the raw Playwright report.
  qualityReportPath: "allure/",
  playwrightReportPath: "report/",
  // Formspree endpoint, e.g. "https://formspree.io/f/abcdwxyz". While empty, the form opens the
  // visitor's email app with the message filled in, so it still works.
  formEndpoint: "",
  // Address of the AI chat worker (see chat-worker/README.md), e.g.
  // "https://tabeeda-chat.your-name.workers.dev". While empty, the chat answers from this file.
  chatEndpoint: "",
  // GoatCounter site code for visitor stats (free, no cookies): for "tabeeda.goatcounter.com"
  // enter "tabeeda". While empty, no analytics script loads at all.
  goatcounterCode: "",
  // Paste the codes from Google Search Console and Bing Webmaster Tools (meta-tag method).
  googleSiteVerification: "",
  bingSiteVerification: "",
  title: "Tabeeda Shakir — Senior QA Engineer, SDET & QA Automation (Playwright, RestAssured)",
  description:
    "Tabeeda Shakir, Senior QA Engineer: 5+ years of test automation (Playwright, Selenium, RestAssured, Java), API, mobile and AI-first QA. Open to SDET and QA roles.",
};

export const person = {
  name: "Tabeeda Shakir",
  alternateName: "Tabeeda Shakir Shah",
  firstName: "Tabeeda",
  initials: "TS",
  role: "Senior QA Engineer",
  targetRoles: ["Senior QA Engineer", "SDET", "QA Automation Engineer"],
  intro:
    "Tabeeda Shakir is a Senior QA Engineer with 5+ years in test automation, manual and AI-first testing, open to Senior QA, SDET and QA Automation roles. She owns quality from test strategy to release sign-off for web, mobile and API products.",
  heroLead:
    "I own quality from test plan to go/no-go: Playwright and Selenium UI automation, RestAssured API tests in Java, and careful manual testing for web, mobile and API products.",
  quote: "Quality is not an act, it's a mindset.",
  location: "Pakistan and Cyprus",
  countries: ["PK", "CY"],
  timezones: [
    { label: "Pakistan", tz: "Asia/Karachi", offset: "UTC+5" },
    { label: "Cyprus", tz: "Asia/Nicosia", offset: "UTC+2, UTC+3 in summer" },
  ],
  workAuthorisation: "Authorised to work in Pakistan and Cyprus, and remotely from anywhere",
  openTo: "Remote, hybrid or on-site roles, and relocation within the EU or the GCC",
  employment: "Full-time or long-term contract",
  languages: "English (professional), Urdu, Turkish (beginner)",
  available: "Open to new roles",
  email: "tabeeda1@gmail.com",
  linkedin: "https://www.linkedin.com/in/tabeeda-shakirshah101010",
  github: "https://github.com/tabeedashakir",
  cv: "cv/Tabeeda-Shakir-CV.pdf",
  photo: "images/tabeeda-shakir-senior-qa-engineer",
  avatar: "images/tabeeda-shakir-avatar",
  photoAlt: "Tabeeda Shakir, Senior QA Engineer, standing at a harbour at sunset",
};

export const stats = [
  { value: 5, suffix: "+", label: "Years in QA", detail: "manual, automation and AI-first" },
  { value: 300, suffix: "+", label: "Automated tests", detail: "running in CI on every change" },
  { value: 1, prefix: "< ", suffix: " day", label: "Full regression", detail: "down from 2–3 days" },
  { value: 700, suffix: "+", label: "Test cases", detail: "designed and run at Epicmetry" },
];

export const about = {
  paragraphs: [
    "I'm a Senior QA Engineer with 5+ years in software testing across SaaS, travel, logistics, e-commerce and fintech, including time as the only QA engineer at a startup. Today I lead QA for travel, logistics, fleet and restaurant products at Epicmetry, a Dubai-based product consultancy.",
    "I combine careful manual and exploratory testing with automation that teams rely on: Playwright and Selenium for UI, RestAssured (Java) and Postman for APIs, all running in CI with GitHub Actions, Jenkins or Azure DevOps. I work AI-first: AI helps me write and debug test code and find edge cases faster, and I review everything it suggests.",
    "I get involved early, write bug reports developers like to receive, and give clear go/no-go calls on releases.",
  ],
};

export const services = [
  {
    icon: "sparkles",
    title: "AI-first QA",
    text: "AI is part of my daily workflow. I use Claude, ChatGPT, Claude Code, OpenAI Codex and GitHub Copilot to draft and debug Playwright and RestAssured code, explain unfamiliar errors and APIs, and suggest edge cases I might have missed, then I review and run everything before it's merged. I also test AI features, like the chat assistant on this site, for honesty, accuracy and safety.",
    points: ["AI pair-programming for test code", "AI-suggested edge cases, human-reviewed", "Testing AI and LLM features"],
  },
  {
    icon: "clipboard",
    title: "Manual and exploratory QA",
    text: "Structured test cases and exploratory sessions that find the bugs scripts miss, with clear, reproducible bug reports in Jira.",
    points: ["Test case design", "Exploratory and regression", "UAT and release testing"],
  },
  {
    icon: "automation",
    title: "Test automation",
    text: "UI suites in Playwright and Selenium, API suites in RestAssured (Java) with TestNG, running in CI/CD pipelines on GitHub Actions, Jenkins or Azure DevOps, with results published as Allure reports.",
    points: ["Playwright and Selenium", "RestAssured, Java and TestNG", "GitHub Actions, Jenkins, Azure DevOps"],
  },
  {
    icon: "api",
    title: "API testing",
    text: "Functional, negative and data checks on REST APIs with RestAssured, Postman and Newman, plus SQL to confirm the data behind them.",
    points: ["RestAssured and Postman", "Contract and schema checks", "SQL validation"],
  },
  {
    icon: "devices",
    title: "Web and mobile testing",
    text: "iOS, Android and web apps, with Appium automation on real devices in BrowserStack and LambdaTest, and cross-browser, responsive and accessibility (WCAG) checks.",
    points: ["iOS and Android", "Cross-browser", "WCAG checks"],
  },
  {
    icon: "gauge",
    title: "Performance and security",
    text: "JMeter load tests, OWASP ZAP security scans and OWASP Mobile Top 10 checks before releases, with results the team can act on.",
    points: ["JMeter load tests", "OWASP ZAP scans", "Release readiness"],
  },
];

export const projects: Project[] = [
  {
    slug: "al-rais-travel",
    name: "Al Rais Travel",
    company: "Epicmetry",
    domain: "Travel",
    summary: "Flight and hotel booking platform for the GCC and MENA. I made sure search, booking and payment work reliably across currencies and devices.",
    highlights: ["GDS and NDC flight content", "Multi-currency booking and payment", "WCAG accessibility checks"],
    tags: ["GDS / NDC", "Multi-currency", "WCAG"],
    categories: ["Manual", "Automation", "API"],
    platforms: ["Web", "Mobile", "API"],
    url: "https://www.alrais.com/",
    visual: "travel",
    headline: "QA for a flight and hotel booking platform",
    seoTitle: "QA for a Travel Booking Platform: Al Rais Travel — Tabeeda Shakir",
    caseStudy: "regression-automation-three-products",
  },
  {
    slug: "modon-express",
    name: "Modon Express",
    company: "Epicmetry",
    domain: "Logistics and delivery (GCC)",
    summary: "Buyer and seller portals with secure payments. I tested checkout, KYC and payment flows end to end.",
    highlights: ["Payments with Tabby, cards and Google Pay", "KYC onboarding flows", "Work tracked in Azure DevOps"],
    tags: ["Payments", "KYC", "Azure DevOps"],
    categories: ["Manual", "Automation", "API"],
    platforms: ["Web", "Mobile", "API"],
    visual: "payments",
    headline: "QA for buyer and seller portals with secure payments",
    seoTitle: "Payments and KYC Testing: Modon Express — Tabeeda Shakir",
    caseStudy: "regression-automation-three-products",
  },
  {
    slug: "fleetify",
    name: "Fleetify",
    company: "Epicmetry",
    domain: "Fleet management (GCC)",
    summary: "Fleet management app used in the GCC. I covered login and role flows, core fleet workflows and performance under load.",
    highlights: ["Login and permission flows", "Core fleet workflows", "Performance testing"],
    tags: ["Login flows", "Performance", "Regression"],
    categories: ["Manual", "Performance", "Automation"],
    platforms: ["Web", "Mobile"],
    visual: "fleet",
    headline: "QA for a fleet management app in the GCC",
    seoTitle: "Fleet Management App Testing: Fleetify — Tabeeda Shakir",
  },
  {
    slug: "visa-platform",
    name: "AI visa processing platform",
    company: "Propellus",
    domain: "Travel tech",
    summary: "AI-powered visa processing for travel agents and online travel agencies. As the only QA engineer I owned testing from planning to release.",
    highlights: ["500+ test cases across web and mobile", "RestAssured API suite and the first Playwright UI suite", "SQL checks on visa transactions"],
    tags: ["AI product", "RestAssured", "Playwright"],
    categories: ["AI-first", "Automation", "API", "Manual"],
    platforms: ["Web", "Mobile", "API"],
    url: "https://propellus.ai/",
    visual: "visa",
    headline: "QA for an AI visa processing platform",
    seoTitle: "QA for an AI Visa Processing Platform — Tabeeda Shakir",
    caseStudy: "qa-from-scratch-at-a-startup",
  },
  {
    slug: "trading-platforms",
    name: "Forex, gold and crypto platforms",
    company: "Maleyat Group (now Naqdi)",
    domain: "Fintech",
    summary: "CRM and CMS platforms for forex, gold and crypto trading. I led regression and backend validation, catching MetaTrader 5 issues before production.",
    highlights: ["120+ regression test cases", "350+ BDD (Gherkin) scenarios", "MetaTrader 5 validation"],
    tags: ["Fintech", "BDD", "MT5"],
    categories: ["Manual", "API"],
    platforms: ["Web", "MetaTrader 5"],
    url: "https://naqdi.com/",
    visual: "trading",
    headline: "QA for forex, gold and crypto trading platforms",
    seoTitle: "Fintech QA: Forex and Crypto Trading (MT5) — Tabeeda Shakir",
  },
  {
    slug: "b2b-marketplace",
    name: "B2B marketplace and logistics apps",
    company: "Dastgyr",
    domain: "E-commerce",
    summary: "High-transaction marketplace with retailer, seller and warehouse apps, plus 3 logistics apps for pickup, transit and delivery.",
    highlights: ["800+ validation scenarios on iOS, Android and web", "Selenium UI and RestAssured API tests in Java, run nightly in Jenkins", "JMeter load tests"],
    tags: ["Mobile", "Selenium", "Jenkins"],
    categories: ["Mobile", "Automation", "Performance", "Manual"],
    platforms: ["iOS", "Android", "Web"],
    url: "https://app.dastgyr.com/",
    visual: "marketplace",
    headline: "QA for a B2B marketplace and its logistics apps",
    seoTitle: "B2B Marketplace and Logistics App Testing — Tabeeda Shakir",
    caseStudy: "b2b-marketplace-and-logistics-apps",
  },
  {
    slug: "portfolio-ai-assistant",
    name: "AI chat assistant",
    company: "This portfolio",
    domain: "AI and LLM features",
    summary: "A recruiter-facing assistant that answers from my CV, with an optional Claude mode. I tested it like a product: honesty, prompt injection, outages and rate limits.",
    highlights: ["Answers only from my CV and never invents experience", "Prompt-injection, off-topic and salary questions tested", "AI service mocked in Playwright; API key server unit-tested"],
    tags: ["LLM testing", "Prompt injection", "Playwright"],
    categories: ["AI-first", "Automation", "API"],
    platforms: ["Web", "API"],
    visual: "assistant",
    headline: "Testing an AI chat assistant (LLM QA)",
    seoTitle: "LLM Testing: QA for an AI Chat Assistant — Tabeeda Shakir",
    caseStudy: "testing-an-ai-chat-assistant",
  },
];

export const categories: Category[] = ["Automation", "Manual", "AI-first", "API", "Mobile", "Performance"];

export const caseStudies: CaseStudy[] = [
  {
    slug: "regression-automation-three-products",
    area: "Test automation",
    title: "Regression automation for three SaaS products",
    summary: "300+ Playwright, RestAssured and Postman/Newman tests in GitHub Actions cut full regression from 2–3 days to under a day.",
    tags: ["Playwright", "RestAssured", "Postman / Newman", "GitHub Actions", "TestRail"],
    context: {
      product: "Three SaaS products at Epicmetry (Al Rais Travel, Modon Express and Tawla) on web, mobile and API",
      team: "Agile product teams",
      role: "QA lead: test strategy, automation, bug triage and release readiness",
    },
    challenge: "Full regression across the three products took 2–3 days, which held up every release.",
    approach: [
      { decision: "Automated regression at three layers: Playwright for UI, RestAssured for APIs, and Postman/Newman collections" },
      { decision: "Ran every suite in GitHub Actions CI on each change" },
      { decision: "Designed and tracked 700+ functional, API and UI test cases in TestRail" },
      { decision: "Added JMeter performance tests and OWASP ZAP security scans before releases", why: "To protect platform stability before each release goes out." },
    ],
    metrics: [
      { value: "< 1 day", label: "full regression, down from 2–3 days" },
      { value: "300+", label: "automated tests in CI" },
      { value: "3+", label: "releases a month with my go/no-go input" },
    ],
  },
  {
    slug: "qa-from-scratch-at-a-startup",
    area: "Building QA at a startup",
    title: "Sole QA engineer at an AI visa-processing startup",
    summary: "Set up API and UI automation and shift-left testing on my own, cutting manual regression effort by about 50%.",
    tags: ["RestAssured", "TestNG", "Playwright", "SQL", "JMeter"],
    context: {
      product: "Early-stage startup automating visa processing for travel agents and online travel agencies, on web and mobile",
      role: "Sole QA engineer, owning testing from planning to release",
    },
    challenge: "There was no UI automation yet, and one QA engineer had to cover web and mobile visa workflows end to end.",
    approach: [
      { decision: "Automated the critical backend API tests first, with RestAssured and TestNG" },
      { decision: "Built the first Playwright UI automation suite" },
      { decision: "Introduced shift-left testing", why: "To catch defects earlier in each sprint instead of at release time." },
      { decision: "Checked data integrity across visa transactions with SQL, and load-tested the busiest APIs with JMeter" },
    ],
    metrics: [
      { value: "~50%", label: "less manual regression effort" },
      { value: "500+", label: "test cases across web and mobile" },
    ],
  },
  {
    slug: "b2b-marketplace-and-logistics-apps",
    area: "Mobile and web at scale",
    title: "QA across a B2B marketplace and its logistics apps",
    summary: "Owned QA across six marketplace and logistics apps and moved regression into nightly Jenkins builds, cutting manual verification by about 50% per sprint.",
    tags: ["Selenium", "RestAssured", "Java", "Jenkins", "JMeter", "SQL"],
    context: {
      product: "High-transaction B2B marketplace connecting retailers with suppliers: retailer, seller and warehouse-picker apps, plus 3 logistics apps for pickup, transit and delivery",
      role: "QA owner for the marketplace apps and QA lead for the logistics apps",
    },
    challenge: "Every order passed through several apps on iOS, Android and web, from retailer to warehouse to delivery.",
    approach: [
      { decision: "Designed 800+ validation scenarios across iOS, Android and web" },
      { decision: "Automated UI tests with Selenium WebDriver and API tests with RestAssured in Java, and ran them in nightly Jenkins regression builds" },
      { decision: "Load-tested the backend with JMeter", why: "To validate backend performance under real marketplace traffic." },
      { decision: "Validated backend data with SQL across seller, retailer and logistics modules", why: "To confirm data stayed consistent between the apps, not only on screen." },
    ],
    metrics: [
      { value: "~50%", label: "less manual verification per sprint" },
      { value: "800+", label: "validation scenarios before release" },
      { value: "6", label: "marketplace and logistics apps covered" },
    ],
  },
  {
    slug: "testing-an-ai-chat-assistant",
    area: "AI-first QA",
    title: "Testing an AI chat assistant before recruiters use it",
    summary: "Built this site's chat assistant with AI pair-programming and tested it like a product: no invented experience, safe with prompt injection, useful when AI is down.",
    tags: ["LLM testing", "Playwright", "Node test runner", "Cloudflare Workers", "Claude API"],
    context: {
      product: "The \"Ask about me\" assistant on this portfolio: built-in answers from my CV, plus an optional Claude mode behind a small Cloudflare Worker that keeps the API key secret",
      role: "Owner and QA: defined what the assistant may say, designed the test strategy, and used AI as a coding partner to build it",
    },
    challenge: "An assistant that talks to recruiters must never invent experience, leak its API key, drift off topic or break when the AI service fails. One made-up skill in front of a hiring manager would cost more than having no chatbot at all.",
    approach: [
      { decision: "Made the CV the single source of truth: built-in answers and the AI both read from the same content", why: "So the chat, the website and the CV can't disagree." },
      { decision: "Tested the awkward questions first: tools not on my CV, salary, visas, personal questions and prompt injection", why: "These are the questions that expose an assistant that guesses." },
      { decision: "Mocked the AI service in Playwright to test replies, conversation history, outages and rate limits", why: "Fast, free and repeatable tests, without calling a paid API on every run." },
      { decision: "Unit-tested the server that holds the API key: allowed websites, input limits, rate limiting and hidden error details" },
      { decision: "Published every test run as an Allure report on this site, grouped by feature and severity, with trends across deploys", why: "So anyone, including recruiters, can check the results instead of taking my word for it." },
      { decision: "Used AI throughout the build, for drafting code, explaining errors and suggesting edge cases, and reviewed every change in CI before it went live", why: "AI makes me faster; review and tests keep it trustworthy." },
    ],
    metrics: [
      { value: "20+", label: "automated tests for the chat and its AI server" },
      { value: "3", label: "browsers on every push: Chrome, Firefox and mobile" },
      { value: "0", label: "API keys in the website code" },
    ],
    lessons: "AI is a great pair-programmer for test code, but its output still needs a tester's eye, which is exactly the standard I apply when testing AI features themselves.",
  },
];

export type Job = {
  company: string;
  /** Company website, linked from the experience timeline. */
  url?: string;
  /** One line on what the company does, for recruiters who don't know it. */
  about?: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    company: "Epicmetry",
    url: "https://www.epicmetry.com/",
    about: "Dubai-based product consultancy and software house, founded in 2023, building AI-powered web and mobile products.",
    role: "Senior QA Engineer",
    period: "Jun 2025 – present",
    location: "Remote · Dubai, UAE",
    summary: "QA lead for travel, logistics, fleet and restaurant products across web, mobile and API.",
    bullets: [
      "Lead QA for Al Rais Travel (travel booking), Modon Express (logistics and delivery), Fleetify (fleet management) and Tawla (restaurant management) across web, mobile and API.",
      "Automated regression with 300+ Playwright (TypeScript), RestAssured and Postman/Newman tests in GitHub Actions, cutting full regression from 2–3 days to under a day.",
      "Automated mobile tests for the Android and iOS apps with Appium, Java and TestNG, running on real devices in BrowserStack and LambdaTest.",
      "Designed and ran 700+ functional, API and UI test cases, tracked in TestRail, and tested REST and SOAP APIs with Postman and SoapUI.",
      "Lead bug triage and give go/no-go input on 3+ releases a month; run JMeter performance tests, OWASP ZAP scans and OWASP Mobile Top 10 checks before releases.",
      "Use AI-driven testing (Claude Code, OpenAI Codex and Playwright MCP) to draft, fix and maintain test scripts, and review every change before it's merged.",
    ],
    tags: ["Playwright", "Appium", "RestAssured", "BrowserStack", "LambdaTest", "SoapUI", "GitHub Actions"],
  },
  {
    company: "Propellus",
    url: "https://propellus.ai/",
    about: "Singapore-based travel-tech startup, founded in 2023, building AI infrastructure for visa processing used by travel agents and OTAs.",
    role: "QA Engineer",
    period: "Jun 2024 – May 2025",
    location: "Hybrid · Pakistan",
    summary: "Sole QA engineer at an AI visa-processing startup.",
    bullets: [
      "Owned testing from planning to release, maintaining 500+ test cases across web and mobile visa workflows.",
      "Automated critical backend API tests with RestAssured and TestNG, cutting manual regression effort by about 50%.",
      "Built the first Playwright UI suite and introduced shift-left testing to catch defects earlier in each sprint.",
      "Validated data integrity with SQL and load-tested high-traffic APIs with JMeter.",
    ],
    tags: ["RestAssured", "TestNG", "Playwright", "SQL", "JMeter"],
  },
  {
    company: "Maleyat Group (now Naqdi)",
    url: "https://naqdi.com/",
    about: "Dubai-based online broker for forex, indices, crypto and precious metals.",
    role: "SQA Specialist",
    period: "Jan 2024 – Jun 2024",
    location: "Remote · UAE",
    summary: "Forex, gold and crypto trading platforms (MetaTrader 5).",
    bullets: [
      "Led regression and backend validation on CRM/CMS trading platforms with 120+ test cases, catching MetaTrader 5 issues before production.",
      "Wrote and maintained 350+ functional and BDD (Gherkin) scenarios for dashboards, onboarding and trading logic.",
      "Worked with UI/UX teams to align 3 modules and reduce user-reported layout issues.",
    ],
    tags: ["BDD", "Gherkin", "Regression", "MT5"],
  },
  {
    company: "Dastgyr",
    url: "https://app.dastgyr.com/",
    about: "B2B e-commerce marketplace connecting retailers and suppliers, headquartered in London with operations in Pakistan and Kenya.",
    role: "QA Engineer",
    period: "Jan 2021 – Jan 2024",
    location: "Hybrid · Karachi, Pakistan",
    summary: "B2B e-commerce marketplace and logistics apps.",
    bullets: [
      "Owned QA for a high-transaction B2B marketplace (retailer, seller and warehouse apps) and led QA for 3 logistics apps.",
      "Designed and ran 800+ validation scenarios across iOS, Android and web before release.",
      "Automated UI tests with Selenium WebDriver and API tests with RestAssured in Java, running in nightly Jenkins regression builds and cutting manual verification by about 50% per sprint.",
      "Validated backend data integrity with SQL and tracked results in TestRail.",
    ],
    tags: ["Mobile", "Selenium", "RestAssured", "Java", "Jenkins"],
  },
];

/**
 * "Teams I've worked with" gallery. Files live in public/images/team as <file>-960.webp,
 * <file>-1600.webp and <file>-1600.jpg; width and height are the large version's size.
 */
export const teamPhotos = [
  {
    file: "team-company",
    width: 1600,
    height: 1066,
    caption: "A company get-together with the whole team",
    alt: "Large group photo of around 60 colleagues outside a restaurant after a company get-together",
  },
  {
    file: "team-booth",
    width: 1200,
    height: 1600,
    caption: "Team day out",
    alt: "Group of colleagues posing together in a neon-lit photo booth at an event",
  },
  {
    file: "team-women",
    width: 1600,
    height: 1066,
    caption: "With the women of the team",
    alt: "Group photo of the women on the team outside a restaurant",
  },
  {
    file: "team-evening",
    width: 1600,
    height: 900,
    caption: "An evening with the team",
    alt: "Colleagues sitting together in the evening at an outdoor spot lit with fairy lights",
  },
];

export const education = {
  degree: "Bachelor of Computer Science",
  school: "PAF-Karachi Institute of Economics and Technology (PAF-KIET)",
  years: "2018 – 2022",
  note: "Final year project: Wasty, a smart waste collection Android app (Java, Firebase, Google Maps API).",
};

/** The AI tools she uses every day, shown on the home page and the skills page. */
/**
 * The AI tools on the home page, each with one line on what she actually does with it. Keep this
 * list to tools she can give a real example of in an interview.
 */
export const aiTools: { group: string; tools: { name: string; icon: string; use: string }[] }[] = [
  {
    group: "Assistants",
    tools: [
      { name: "Claude", icon: "chat", use: "Turn user stories into first-draft test cases and edge cases, then review them before they go into TestRail." },
      { name: "ChatGPT", icon: "sparkles", use: "Make realistic test data, like sample passport and visa records for OCR testing at Propellus." },
    ],
  },
  {
    group: "Coding agents",
    tools: [
      { name: "Claude Code", icon: "code", use: `Built and tested this portfolio with it: ${testCount} Playwright tests running in GitHub Actions.` },
      { name: "OpenAI Codex", icon: "code", use: "Fix failing Playwright tests and clean up RestAssured API tests." },
      { name: "GitHub Copilot", icon: "sparkles", use: "Autocomplete while writing Playwright and RestAssured tests in VS Code." },
    ],
  },
  {
    group: "AI inside my testing tools",
    tools: [
      { name: "Playwright MCP", icon: "automation", use: "Let an AI agent click through a flow in a real browser, then turn it into a Playwright test." },
      { name: "Postman Postbot", icon: "api", use: "Draft response checks for Postman collections that then run with Newman in CI." },
      { name: "Applitools Eyes", icon: "eye", use: "Compare screens with approved baselines to catch layout shifts after UI changes." },
    ],
  },
];

export const skillGroups = [
  {
    group: "AI-first QA",
    items: ["AI-assisted test design", "Prompt-based test generation", "LLM and chatbot testing", "AI test data generation", ...aiTools.flatMap((g) => g.tools.map((t) => t.name))],
  },
  { group: "Manual QA", items: ["Manual testing", "Test case design", "Exploratory testing", "Regression and smoke", "UAT", "Cross-browser and responsive", "Bug reporting and triage"] },
  { group: "Automation", items: ["Playwright", "Selenium", "Appium", "RestAssured", "TestNG", "JUnit", "Postman", "Newman", "SoapUI", "Gherkin (BDD)", "Allure Report"] },
  { group: "Languages and data", items: ["Java", "JavaScript", "TypeScript", "SQL"] },
  { group: "CI/CD and tools", items: ["GitHub Actions", "Jenkins", "Azure DevOps", "CI/CD pipelines", "Git", "GitHub", "BrowserStack", "LambdaTest", "Jira", "TestRail", "Confluence", "Figma"] },
  { group: "Performance and security", items: ["JMeter", "OWASP ZAP", "OWASP Mobile Top 10", "Chrome DevTools"] },
  { group: "Practices", items: ["Test strategy", "Agile / Scrum", "Shift-left testing", "Release readiness (go/no-go)", "Root cause analysis", "WCAG accessibility"] },
];

/** Words a job ad might use for a skill, used by the job-match tool. */
export const skillAliases: Record<string, string[]> = {
  "AI-assisted test design": ["ai", "artificial intelligence", "ai-assisted", "ai tools", "generative ai", "genai"],
  "Prompt-based test generation": ["prompt", "prompt engineering"],
  "LLM and chatbot testing": ["llm", "llms", "chatbot", "machine learning"],
  "AI test data generation": ["test data"],
  Claude: ["claude", "anthropic"],
  ChatGPT: ["chatgpt", "openai", "gpt"],
  "Claude Code": ["claude code"],
  "OpenAI Codex": ["codex", "openai codex"],
  "GitHub Copilot": ["copilot", "github copilot"],
  "Playwright MCP": ["mcp", "playwright mcp", "model context protocol"],
  "Postman Postbot": ["postbot"],
  "Applitools Eyes": ["applitools", "visual ai", "visual testing"],
  "Manual testing": ["manual", "manual testing", "functional testing"],
  "Test case design": ["test cases", "test case", "test design"],
  "Exploratory testing": ["exploratory"],
  "Regression and smoke": ["regression", "smoke", "sanity"],
  UAT: ["uat", "user acceptance"],
  "Cross-browser and responsive": ["cross-browser", "cross browser", "responsive"],
  "Bug reporting and triage": ["bug", "bugs", "defect", "defects", "triage"],
  Playwright: ["playwright"],
  "Allure Report": ["allure", "allure report", "test reporting"],
  Selenium: ["selenium", "webdriver"],
  Appium: ["appium", "mobile automation", "mobile test automation"],
  SoapUI: ["soapui", "soap ui", "soap"],
  TypeScript: ["typescript"],
  BrowserStack: ["browserstack"],
  LambdaTest: ["lambdatest", "lambda test"],
  "OWASP Mobile Top 10": ["owasp mobile", "mobile security", "masvs", "mastg"],
  RestAssured: ["restassured", "rest assured", "rest-assured", "api testing", "api automation"],
  Postman: ["postman"],
  Newman: ["newman"],
  "Gherkin (BDD)": ["gherkin", "bdd", "cucumber"],
  JavaScript: ["javascript", "node.js", "nodejs"],
  SQL: ["sql", "mysql", "postgresql", "postgres", "database"],
  "GitHub Actions": ["github actions"],
  "CI/CD pipelines": ["ci/cd", "ci / cd", "ci-cd", "continuous integration", "continuous delivery", "pipeline", "pipelines"],
  GitHub: ["github"],
  "Azure DevOps": ["azure devops", "ado", "azure pipelines"],
  JMeter: ["jmeter", "load testing", "performance testing"],
  "OWASP ZAP": ["owasp", "zap", "security testing"],
  "Chrome DevTools": ["devtools", "dev tools"],
  "Test strategy": ["test strategy", "test plan", "test planning"],
  "Agile / Scrum": ["agile", "scrum", "kanban"],
  "Shift-left testing": ["shift-left", "shift left"],
  "Release readiness (go/no-go)": ["release", "go/no-go"],
  "Root cause analysis": ["root cause", "rca"],
  "WCAG accessibility": ["wcag", "accessibility", "a11y"],
};

export const learning: string[] = ["Python for test automation"];

export const process = [
  { title: "Understand the risk", text: "Turn requirements into test scenarios and agree where a failure would hurt most." },
  { title: "Test smart", text: "Manual and exploratory testing for new features, with AI helping to design cases and data faster." },
  { title: "Automate what matters", text: "API tests for fast feedback and UI tests for key journeys, all running in CI." },
  { title: "Release with confidence", text: "Triage bugs with developers and product, then give a clear go/no-go call." },
];

export const faqs = [
  {
    q: "Who is Tabeeda Shakir?",
    a: "Tabeeda Shakir is a Senior QA Engineer with 5+ years of experience in manual, automated and AI-first software testing. She currently leads QA at Epicmetry for travel, logistics and fleet management products.",
  },
  {
    q: "What does Tabeeda specialise in?",
    a: "Test automation with Playwright and Selenium, API testing with RestAssured (Java) and Postman, manual and exploratory testing, and AI-first QA: using AI to work faster and testing AI-powered features.",
  },
  {
    q: "Which tools does she use?",
    a: "Playwright, Selenium, Appium, RestAssured, TestNG, Postman, Newman and SoapUI, Java, JavaScript, TypeScript and SQL, BrowserStack and LambdaTest for real devices, JMeter, OWASP ZAP and OWASP Mobile Top 10, with GitHub Actions, Jenkins or Azure DevOps for CI/CD, Git and GitHub for version control, and Jira and TestRail for test management.",
  },
  {
    q: "What roles is Tabeeda open to?",
    a: "Senior QA Engineer, SDET and QA Automation Engineer roles, full-time or long-term contract. She works remote, hybrid or on-site, and is open to relocating within the EU or the GCC.",
  },
  {
    q: "Where is she based, and can she work remotely?",
    a: "She is based in Pakistan and Cyprus, is authorised to work in both, and works remotely from anywhere. Her time zones, Pakistan (UTC+5) and Cyprus (UTC+2, UTC+3 in summer), overlap with the Gulf and European working day.",
  },
  {
    q: "How does she use AI in testing?",
    a: "Every day, with Claude, ChatGPT, Claude Code, OpenAI Codex and GitHub Copilot: as a coding partner for Playwright and RestAssured test code, to explain errors and unfamiliar APIs, and to suggest edge cases. She also uses AI inside her testing tools (Playwright MCP, Postman Postbot and Applitools Eyes). She reviews and runs everything before it is merged, and she tests AI features too, like the chat assistant on this site.",
  },
  {
    q: "How can I contact Tabeeda?",
    a: "Email tabeeda1@gmail.com, connect on LinkedIn, or use the contact form on this page. Her CV is available to download as a PDF.",
  },
];

/** The site's pages. Each has its own address, title and description for search engines. */
export type PageKey = "home" | "about" | "experience" | "projects" | "skills" | "contact";

export const pages: Record<PageKey, { path: string; label: string; title: string; description: string }> = {
  home: { path: "/", label: "Home", title: site.title, description: site.description },
  about: {
    path: "/about/",
    label: "About",
    title: "About Tabeeda Shakir — Senior QA Engineer in Pakistan and Cyprus",
    description:
      "Tabeeda Shakir is a Senior QA Engineer with 5+ years of manual, automated and AI-first testing. Her story, education and the teams she has shipped with.",
  },
  experience: {
    path: "/experience/",
    label: "Experience",
    title: "QA Experience — Tabeeda Shakir, Senior QA Engineer and SDET",
    description:
      "5+ years of QA at Epicmetry, Propellus, Maleyat Group (Naqdi) and Dastgyr: Playwright, Selenium and RestAssured automation, API, mobile and manual testing.",
  },
  projects: {
    path: "/projects/",
    label: "Projects",
    title: "QA Projects and Case Studies — Tabeeda Shakir",
    description:
      "Travel, logistics, fleet, fintech and AI products tested by Tabeeda Shakir, with case studies on regression automation, API testing and AI-first QA.",
  },
  skills: {
    path: "/skills/",
    label: "Skills",
    title: "QA Skills: Playwright, Appium, Selenium, RestAssured, API Testing — Tabeeda Shakir",
    description:
      "Test automation, AI-first QA, manual, API, mobile, performance and security testing. Paste a job description to see how Tabeeda's skills match your role.",
  },
  contact: {
    path: "/contact/",
    label: "Contact",
    title: "Contact Tabeeda Shakir — Hire a Senior QA Engineer or SDET",
    description:
      "Contact Tabeeda Shakir about Senior QA, SDET or QA Automation roles: remote, hybrid or on-site, with relocation in the EU or the GCC. Email, LinkedIn or form.",
  },
};

/** Main menu. "Contact me" has its own button in the header. */
export const nav: { key: PageKey; label: string; path: string }[] = (["about", "experience", "projects", "skills"] as const).map((key) => ({
  key,
  label: pages[key].label,
  path: pages[key].path,
}));

/** Where each part of the site lives. Also redirects old one-page links such as /#contact. */
export const sectionPaths: Record<string, string> = {
  about: "/about/",
  teams: "/about/#teams",
  experience: "/experience/",
  projects: "/projects/",
  "case-studies": "/projects/#case-studies",
  services: "/skills/",
  skills: "/skills/#skills",
  "job-match": "/skills/#job-match",
  faq: "/contact/#faq",
  contact: "/contact/",
};
