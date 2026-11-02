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
  /** Shown as a small drawn preview on the card. */
  visual: "travel" | "payments" | "fleet" | "visa" | "trading" | "marketplace";
};

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

export const site = {
  url: "https://tabee1999.github.io",
  repoUrl: "https://github.com/tabee1999/tabee1999.github.io",
  qualityReportPath: "report/",
  // Formspree endpoint, e.g. "https://formspree.io/f/abcdwxyz". While empty, the form opens the
  // visitor's email app with the message filled in, so it still works.
  formEndpoint: "",
  // Address of the AI chat worker (see chat-worker/README.md), e.g.
  // "https://tabeeda-chat.your-name.workers.dev". While empty, the chat answers from this file.
  chatEndpoint: "",
  // Paste the codes from Google Search Console and Bing Webmaster Tools (meta-tag method).
  googleSiteVerification: "",
  bingSiteVerification: "",
  title: "Tabeeda Shakir — Senior QA Engineer (Manual, Automation and AI-first QA)",
  description:
    "Tabeeda Shakir is a Senior QA Engineer with 5+ years in manual, automated and AI-first testing with Playwright, Java, RestAssured and SQL. Open to remote roles.",
};

export const person = {
  name: "Tabeeda Shakir",
  alternateName: "Tabeeda Shakir Shah",
  firstName: "Tabeeda",
  initials: "TS",
  role: "Senior QA Engineer",
  tagline: "Test · Improve · Deliver",
  rotating: ["AI-first QA", "Manual QA", "Test automation", "API testing"],
  intro:
    "Tabeeda Shakir is a Senior QA Engineer with 5+ years of experience in manual, automated and AI-first testing. She owns quality from test strategy to release sign-off for web, mobile and API products.",
  heroLead:
    "I help teams ship with confidence through manual, automated and AI-first testing: clear test strategy, fast regression and bugs caught before your users find them.",
  quote: "Quality is not an act, it's a mindset.",
  location: "Pakistan (previously Cyprus)",
  country: "PK",
  timezone: "Asia/Karachi",
  timezoneLabel: "Pakistan",
  openTo: "Remote roles and relocation to Cyprus, Dubai or the EU",
  languages: "English, Urdu, Turkish (beginner)",
  available: "Open to new roles",
  email: "tabeeda1@gmail.com",
  linkedin: "https://www.linkedin.com/in/tabeeda-shakirshah101010",
  github: "https://github.com/tabee1999",
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
    "I'm a Senior QA Engineer with 5+ years in software testing across SaaS, travel, logistics, e-commerce and fintech, including time as the only QA engineer at a startup. Today I lead QA for travel, logistics and fleet products at Epicmetry, a Dubai-based company.",
    "I combine careful manual and exploratory testing with automation that teams rely on: Playwright for UI, RestAssured and Postman for APIs, all running in CI. I work AI-first, using AI tools to design tests faster and to test AI-powered features properly.",
    "I get involved early, write bug reports developers like to receive, and give clear go/no-go calls on releases.",
  ],
};

export const services = [
  {
    icon: "sparkles",
    title: "AI-first QA",
    text: "I use AI to design test cases, generate test data and draft Playwright and API tests faster, then review every result. I also test AI-powered features for accuracy, consistency and safety.",
    points: ["AI-assisted test design", "LLM and chatbot testing", "Prompt-based test generation"],
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
    text: "UI suites in Playwright and Selenium, API suites in RestAssured with TestNG, running in GitHub Actions, Azure DevOps or Jenkins.",
    points: ["Playwright and Selenium", "Page objects and fixtures", "CI pipelines"],
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
    text: "iOS, Android and web apps, with cross-browser, responsive and accessibility (WCAG) checks.",
    points: ["iOS and Android", "Cross-browser", "WCAG checks"],
  },
  {
    icon: "gauge",
    title: "Performance and security",
    text: "JMeter load tests and OWASP ZAP security scans before releases, with results the team can act on.",
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
    visual: "travel",
  },
  {
    slug: "modon-express",
    name: "Modon Express",
    company: "Epicmetry",
    domain: "Logistics and e-commerce",
    summary: "Buyer and seller portals with secure payments. I tested checkout, KYC and payment flows end to end.",
    highlights: ["Payments with Tabby, cards and Google Pay", "KYC onboarding flows", "Work tracked in Azure DevOps"],
    tags: ["Payments", "KYC", "Azure DevOps"],
    categories: ["Manual", "Automation", "API"],
    platforms: ["Web", "Mobile", "API"],
    visual: "payments",
  },
  {
    slug: "fleetify",
    name: "Fleetify",
    company: "Epicmetry",
    domain: "Fleet management",
    summary: "Fleet management platform. I covered login and role flows, core fleet workflows and performance under load.",
    highlights: ["Login and permission flows", "Core fleet workflows", "Performance testing"],
    tags: ["Login flows", "Performance", "Regression"],
    categories: ["Manual", "Performance", "Automation"],
    platforms: ["Web", "Mobile"],
    visual: "fleet",
  },
  {
    slug: "visa-platform",
    name: "AI visa processing platform",
    company: "Propellus.co",
    domain: "Travel tech",
    summary: "AI-powered visa processing for travel agents and online travel agencies. As the only QA engineer I owned testing from planning to release.",
    highlights: ["500+ test cases across web and mobile", "RestAssured API suite and the first Playwright UI suite", "SQL checks on visa transactions"],
    tags: ["AI product", "RestAssured", "Playwright"],
    categories: ["AI-first", "Automation", "API", "Manual"],
    platforms: ["Web", "Mobile", "API"],
    visual: "visa",
  },
  {
    slug: "trading-platforms",
    name: "Forex, gold and crypto platforms",
    company: "Maleyat Group",
    domain: "Fintech",
    summary: "CRM and CMS trading platforms. I led regression and backend validation, catching MetaTrader 5 issues before production.",
    highlights: ["120+ regression test cases", "350+ BDD (Gherkin) scenarios", "MetaTrader 5 validation"],
    tags: ["Fintech", "BDD", "MT5"],
    categories: ["Manual", "API"],
    platforms: ["Web", "MetaTrader 5"],
    visual: "trading",
  },
  {
    slug: "b2b-marketplace",
    name: "B2B marketplace and logistics apps",
    company: "Dastgyr",
    domain: "E-commerce",
    summary: "High-transaction marketplace with retailer, seller and warehouse apps, plus 3 logistics apps for pickup, transit and delivery.",
    highlights: ["800+ validation scenarios on iOS, Android and web", "Nightly Jenkins regression with RestAssured", "JMeter load tests"],
    tags: ["Mobile", "Jenkins", "JMeter"],
    categories: ["Mobile", "Automation", "Performance", "Manual"],
    platforms: ["iOS", "Android", "Web"],
    visual: "marketplace",
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
      product: "Three SaaS products across travel, logistics and fleet management, on web, mobile and API",
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
    tags: ["RestAssured", "Jenkins", "JMeter", "TestRail", "SQL"],
    context: {
      product: "High-transaction B2B marketplace connecting retailers with suppliers: retailer, seller and warehouse-picker apps, plus 3 logistics apps for pickup, transit and delivery",
      role: "QA owner for the marketplace apps and QA lead for the logistics apps",
    },
    challenge: "Every order passed through several apps on iOS, Android and web, from retailer to warehouse to delivery.",
    approach: [
      { decision: "Designed 800+ validation scenarios across iOS, Android and web" },
      { decision: "Automated API tests with RestAssured and ran them in nightly Jenkins regression builds" },
      { decision: "Load-tested the backend with JMeter", why: "To validate backend performance under real marketplace traffic." },
      { decision: "Validated backend data with SQL across seller, retailer and logistics modules", why: "To confirm data stayed consistent between the apps, not only on screen." },
    ],
    metrics: [
      { value: "~50%", label: "less manual verification per sprint" },
      { value: "800+", label: "validation scenarios before release" },
      { value: "6", label: "marketplace and logistics apps covered" },
    ],
  },
];

export const experience = [
  {
    company: "Epicmetry",
    role: "Senior QA Engineer",
    period: "Jun 2025 – present",
    location: "Remote · Dubai, UAE",
    summary: "QA lead for travel, logistics and fleet products across web, mobile and API.",
    bullets: [
      "Lead QA for Al Rais Travel, Modon Express, Fleetify and Tawla.ae across web, mobile and API.",
      "Automated regression with 300+ Playwright, RestAssured and Postman/Newman tests in GitHub Actions, cutting full regression from 2–3 days to under a day.",
      "Designed and ran 700+ functional, API and UI test cases, tracked in TestRail.",
      "Lead bug triage and give go/no-go input on 3+ releases a month; run JMeter performance tests and OWASP ZAP scans before releases.",
    ],
    tags: ["Playwright", "RestAssured", "Postman", "GitHub Actions", "TestRail"],
  },
  {
    company: "Propellus.co",
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
    company: "Maleyat Group",
    role: "SQA Specialist",
    period: "Jan 2024 – Jun 2024",
    location: "Remote · UAE",
    summary: "Forex, gold and crypto trading platforms.",
    bullets: [
      "Led regression and backend validation on CRM/CMS trading platforms with 120+ test cases, catching MetaTrader 5 issues before production.",
      "Wrote and maintained 350+ functional and BDD (Gherkin) scenarios for dashboards, onboarding and trading logic.",
      "Worked with UI/UX teams to align 3 modules and reduce user-reported layout issues.",
    ],
    tags: ["BDD", "Gherkin", "Regression", "MT5"],
  },
  {
    company: "Dastgyr",
    role: "QA Engineer",
    period: "Dec 2021 – Jan 2024",
    location: "Hybrid · Karachi, Pakistan",
    summary: "B2B e-commerce marketplace and logistics apps.",
    bullets: [
      "Owned QA for a high-transaction B2B marketplace (retailer, seller and warehouse apps) and led QA for 3 logistics apps.",
      "Designed and ran 800+ validation scenarios across iOS, Android and web before release.",
      "Added RestAssured API tests to nightly Jenkins regression builds, cutting manual verification by about 50% per sprint.",
      "Validated backend data integrity with SQL and tracked results in TestRail.",
    ],
    tags: ["Mobile", "RestAssured", "Jenkins", "SQL"],
  },
  {
    company: "Squarera (A DataPillar Company)",
    role: "SQA & UI/UX Designer",
    period: "Jan 2021 – Sep 2021",
    location: "Karachi, Pakistan",
    summary: "QA and UI/UX for SaaS MVP launches.",
    bullets: [
      "Owned QA for 2 SaaS MVP launches, finding critical bugs before release.",
      "Wrote and ran 50+ UI test cases and worked with designers on 3 key modules to reduce layout bugs.",
    ],
    tags: ["Manual QA", "UI testing", "Figma"],
  },
];

export const education = {
  degree: "Bachelor of Computer Science",
  school: "PAF-Karachi Institute of Economics and Technology (PAF-KIET)",
  years: "2018 – 2022",
  note: "Final year project: Wasty, a smart waste collection Android app (Java, Firebase, Google Maps API).",
};

export const skillGroups = [
  { group: "AI-first QA", items: ["AI-assisted test design", "Prompt-based test generation", "LLM and chatbot testing", "AI test data generation", "GitHub Copilot", "ChatGPT and Claude"] },
  { group: "Manual QA", items: ["Manual testing", "Test case design", "Exploratory testing", "Regression and smoke", "UAT", "Cross-browser and responsive", "Bug reporting and triage"] },
  { group: "Automation", items: ["Playwright", "Selenium", "RestAssured", "TestNG", "JUnit", "Postman", "Newman", "Gherkin (BDD)"] },
  { group: "Languages and data", items: ["Java", "JavaScript", "SQL"] },
  { group: "CI/CD and tools", items: ["GitHub Actions", "Azure DevOps", "Jenkins", "Git", "Jira", "TestRail", "Confluence", "Figma"] },
  { group: "Performance and security", items: ["JMeter", "OWASP ZAP", "Chrome DevTools"] },
  { group: "Practices", items: ["Test strategy", "Agile / Scrum", "Shift-left testing", "Release readiness (go/no-go)", "Root cause analysis", "WCAG accessibility"] },
];

/** Words a job ad might use for a skill, used by the job-match tool. */
export const skillAliases: Record<string, string[]> = {
  "AI-assisted test design": ["ai", "artificial intelligence", "ai-assisted", "ai tools", "generative ai", "genai"],
  "Prompt-based test generation": ["prompt", "prompt engineering"],
  "LLM and chatbot testing": ["llm", "llms", "chatbot", "machine learning"],
  "AI test data generation": ["test data"],
  "GitHub Copilot": ["copilot"],
  "ChatGPT and Claude": ["chatgpt", "claude", "openai"],
  "Manual testing": ["manual", "manual testing", "functional testing"],
  "Test case design": ["test cases", "test case", "test design"],
  "Exploratory testing": ["exploratory"],
  "Regression and smoke": ["regression", "smoke", "sanity"],
  UAT: ["uat", "user acceptance"],
  "Cross-browser and responsive": ["cross-browser", "cross browser", "responsive", "browserstack"],
  "Bug reporting and triage": ["bug", "bugs", "defect", "defects", "triage"],
  Playwright: ["playwright"],
  Selenium: ["selenium", "webdriver"],
  RestAssured: ["restassured", "rest assured", "rest-assured", "api testing", "api automation"],
  Postman: ["postman"],
  Newman: ["newman"],
  "Gherkin (BDD)": ["gherkin", "bdd", "cucumber"],
  JavaScript: ["javascript", "typescript", "node.js", "nodejs"],
  SQL: ["sql", "mysql", "postgresql", "postgres", "database"],
  "GitHub Actions": ["github actions", "ci/cd", "ci / cd", "continuous integration"],
  "Azure DevOps": ["azure devops", "ado"],
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
    a: "Manual and exploratory testing, test automation with Playwright and Selenium, API testing with RestAssured and Postman, and AI-first QA: using AI to design tests faster and testing AI-powered features.",
  },
  {
    q: "Which tools does she use?",
    a: "Playwright, Selenium, RestAssured, TestNG, Postman and Newman, Java, JavaScript and SQL, JMeter and OWASP ZAP, with GitHub Actions, Azure DevOps or Jenkins for CI, and Jira and TestRail for test management.",
  },
  {
    q: "Where is she based, and is she open to remote work?",
    a: "She is based in Pakistan, previously Cyprus, and is open to remote roles and to relocating to Cyprus, Dubai or the EU.",
  },
  {
    q: "How can I contact Tabeeda?",
    a: "Email tabeeda1@gmail.com, connect on LinkedIn, or use the contact form on this page. Her CV is available to download as a PDF.",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "case-studies", label: "Case studies" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
