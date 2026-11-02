// ─────────────────────────────────────────────────────────────────────────────
// All the words on the site live in this file.
// Edit text here, then run `npm run build`. You never need to touch the templates.
//
// Anything in [square brackets] is a placeholder. It shows up highlighted on the
// site so you can spot it, and `npm run placeholders` lists every one left.
// Links that are still placeholders render as plain text, not broken links.
//
// Empty lists hide their section (e.g. set `writing: []` or `testimonials: []`).
// ─────────────────────────────────────────────────────────────────────────────

export default {
  site: {
    // Your live address, without a trailing slash. Used for canonical URL, sitemap and link previews.
    url: "https://tabee1999.github.io",
    title: "Tabeeda Shakir — Senior QA Engineer | Test Automation",
    description:
      "Senior QA Engineer with 5+ years across SaaS, travel, logistics, e-commerce and fintech. Test automation with Playwright, RestAssured (Java) and CI.",
    // The GitHub repo that holds this website (linked from the footer and the projects section).
    repoUrl: "https://github.com/tabee1999/tabee1999.github.io",
    // Where CI publishes the Playwright HTML report (relative to the site root).
    qualityReportPath: "report/",
    // Formspree: create a form at formspree.io and paste its endpoint here.
    formEndpoint: "https://formspree.io/f/[your-form-id]",
    // Privacy-friendly analytics. Put your domain here to turn Plausible on, e.g. "tabeeda.dev".
    plausibleDomain: "",
    // Test titles shown in the hero. They match real tests in /tests (a test checks this).
    heroRun: [
      "home › shows name, role and open-to-work badge",
      "navigation › every section link scrolls to its section",
      "navigation › has no broken internal links",
      "contact › rejects an invalid email address",
      "contact › sends the message and confirms",
      "a11y › home page has no axe violations",
      "responsive › no horizontal scroll at 360px",
    ],
  },

  person: {
    name: "Tabeeda Shakir",
    role: "Senior QA Engineer",
    roleDetail: "Test automation with Playwright, Java and RestAssured",
    statement:
      "I build API and UI test automation that helps teams release faster with fewer production bugs.",
    location: "Limassol, Cyprus. Open to relocating within the EU or GCC",
    // Shown with your local time in the header area. Use an IANA time zone name.
    city: "Limassol, Cyprus",
    timezone: "Asia/Nicosia",
    openTo: "Open to new roles",
    // Optional photo, e.g. "images/tabeeda.webp" (put the file in /public/images). Leave "" for no photo.
    photo: "",
    photoAlt: "Tabeeda Shakir",
    email: "tabeeda1@gmail.com",
    linkedin: "https://www.linkedin.com/in/tabeeda-shakirshah101010",
    github: "https://github.com/tabee1999",
    // Your CV lives at public/cv/Tabeeda-Shakir-CV.pdf. Replace the file to update it.
    cv: "cv/Tabeeda-Shakir-CV.pdf",
  },

  impact: [
    { value: "5+", label: "years in software QA" },
    { value: "300+", label: "automated tests running in CI" },
    { value: "< 1 day", label: "full regression, down from 2–3 days" },
    { value: "3+", label: "releases a month with my go/no-go input" },
  ],

  about: [
    "I've spent 5+ years owning quality from test strategy to release sign-off, across SaaS, travel, logistics, e-commerce and fintech products, including as the only QA engineer at a startup. Today I lead QA for three products at Epicmetry, a Dubai-based company: Tawla.ae, Modon Express and Alrais Travel.",
    "My strongest work is automation that teams rely on: Playwright for UI, RestAssured with TestNG for APIs, and Postman/Newman collections, running in GitHub Actions or Jenkins. I pair it with manual, exploratory and cross-browser testing, plus JMeter performance tests and OWASP ZAP security scans before releases.",
    "I get involved early: turning requirements into test scenarios, bringing shift-left testing into sprints, leading bug triage and giving go/no-go input on releases. I've worked remotely and hybrid with teams in the UAE and Pakistan, so I write things down and keep handoffs clear.",
  ],

  // "What I do": icon is one of automation, api, devices, gauge, database, flag.
  services: [
    {
      icon: "automation",
      title: "Test automation",
      text: "UI suites in Playwright and API suites in RestAssured with TestNG, running in GitHub Actions or Jenkins on every change.",
    },
    {
      icon: "api",
      title: "API testing",
      text: "Functional, negative and data checks on REST APIs with RestAssured, Postman and Newman.",
    },
    {
      icon: "devices",
      title: "Web and mobile testing",
      text: "iOS, Android and web apps, with cross-browser, responsive and exploratory testing.",
    },
    {
      icon: "gauge",
      title: "Performance and security",
      text: "JMeter load tests and OWASP ZAP security scans before releases.",
    },
    {
      icon: "database",
      title: "Data and backend checks",
      text: "SQL queries that confirm data stays correct across services, not only on screen.",
    },
    {
      icon: "flag",
      title: "Test strategy and releases",
      text: "Test plans, regression scope, bug triage and a clear go/no-go call for each release.",
    },
  ],

  // Products I've tested. Edit the domain or platforms if anything is off.
  products: [
    { name: "Tawla.ae", company: "Epicmetry", domain: "E-commerce", platforms: ["Web", "Mobile", "API"] },
    { name: "Modon Express", company: "Epicmetry", domain: "Logistics", platforms: ["Web", "Mobile", "API"] },
    { name: "Alrais Travel", company: "Epicmetry", domain: "Travel", platforms: ["Web", "Mobile", "API"] },
    { name: "Visa processing platform", company: "Propellus.co", domain: "Travel tech", platforms: ["Web", "Mobile", "API"] },
    { name: "Trading CRM and CMS", company: "Maleyat Group", domain: "Fintech", platforms: ["Web", "MetaTrader 5"] },
    { name: "B2B marketplace and logistics apps", company: "Dastgyr", domain: "E-commerce", platforms: ["iOS", "Android", "Web"] },
  ],

  // How I work: a short, ordered process.
  process: [
    { title: "Understand the risk", text: "Turn requirements into test scenarios and agree where a failure would hurt most." },
    { title: "Automate what matters", text: "API tests for fast, precise feedback and UI tests for key user journeys, all running in CI." },
    { title: "Explore what scripts miss", text: "Exploratory, cross-browser and responsive testing, plus performance and security checks." },
    { title: "Release with confidence", text: "Triage bugs with developers and product, then give a clear go/no-go call." },
  ],

  caseStudies: [
    {
      slug: "regression-automation-three-products",
      area: "Test automation",
      title: "Regression automation for three SaaS products",
      summary:
        "300+ Playwright, RestAssured and Postman/Newman tests in GitHub Actions cut full regression from 2–3 days to under a day.",
      tags: ["Playwright", "RestAssured", "Postman / Newman", "GitHub Actions", "TestRail"],
      context: {
        product:
          "Three SaaS products (Tawla.ae, Modon Express and Alrais Travel) across e-commerce, logistics and travel, on web, mobile and API",
        team: "Agile product teams. [Add team size, e.g. X developers and Y product managers]",
        role: "QA lead: test strategy, automation, bug triage and release readiness",
      },
      challenge:
        "Full regression across the three products took 2–3 days, which held up every release. [Add what made it slow or risky, e.g. mostly manual checks, or three products sharing one QA lead.]",
      approach: [
        {
          decision: "Automated regression at three layers: Playwright for UI, RestAssured for APIs, and Postman/Newman collections",
          why: "[Why this split, e.g. API tests run faster and fail more precisely, so UI tests only cover what users actually do]",
        },
        {
          decision: "Ran every suite in GitHub Actions CI",
          why: "[Why, e.g. regressions show up on each change instead of at the end of a sprint]",
        },
        {
          decision: "Tracked 700+ functional, API and UI test cases in TestRail",
          why: "[Why, e.g. one place to see coverage and results across all three products]",
        },
        {
          decision: "Added JMeter performance tests and OWASP ZAP security scans before releases",
          why: "To protect platform stability before each release goes out.",
        },
      ],
      outcome: {
        metrics: [
          { value: "< 1 day", label: "full regression, down from 2–3 days" },
          { value: "300+", label: "automated tests in CI" },
          { value: "3+", label: "releases a month with my go/no-go input" },
        ],
        summary: "[What changed for the team, in one or two sentences.]",
      },
      lessons: "[What you'd do differently next time.]",
    },
    {
      slug: "qa-from-scratch-at-a-startup",
      area: "Building QA at a startup",
      title: "Sole QA engineer at a visa-processing startup",
      summary:
        "Set up API and UI automation and shift-left testing on my own, cutting manual regression effort by about 50%.",
      tags: ["RestAssured", "TestNG", "Playwright", "SQL", "JMeter"],
      context: {
        product: "Early-stage startup automating visa processing for travel agents and online travel agencies, on web and mobile",
        team: "[Team size]. I was the only QA engineer",
        role: "Sole QA engineer, owning testing from planning to release",
      },
      challenge:
        "There was no UI automation yet, and one QA engineer had to cover web and mobile visa workflows end to end. [Add the main risk, e.g. regressions slipping into releases.]",
      approach: [
        {
          decision: "Automated the critical backend API tests first, with RestAssured and TestNG",
          why: "[Why API first, e.g. most visa logic lives in the backend, and API tests are quicker to write and keep stable]",
        },
        {
          decision: "Built the first Playwright UI automation suite",
          why: "[Why, e.g. to cover the user flows the API tests can't see]",
        },
        {
          decision: "Introduced shift-left testing",
          why: "To catch defects earlier in each sprint instead of at release time.",
        },
        {
          decision: "Checked data integrity across visa transactions with SQL, and load-tested the busiest APIs with JMeter",
          why: "[Why, e.g. a wrong status or a slow API on a visa application is a real cost for the agent]",
        },
      ],
      outcome: {
        metrics: [
          { value: "~50%", label: "less manual regression effort" },
          { value: "500+", label: "test cases across web and mobile" },
          { value: "[X]", label: "[critical bugs caught before release]" },
        ],
        summary: "[What changed for the team.]",
      },
      lessons: "[What you'd do differently next time.]",
    },
    {
      slug: "b2b-marketplace-and-logistics-apps",
      area: "Mobile and web at scale",
      title: "QA across a B2B marketplace and its logistics apps",
      summary:
        "Owned QA across six marketplace and logistics apps and moved regression into nightly Jenkins builds, cutting manual verification by about 50% per sprint.",
      tags: ["RestAssured", "Jenkins", "JMeter", "TestRail", "SQL"],
      context: {
        product:
          "High-transaction B2B marketplace connecting retailers with suppliers: retailer, seller and warehouse-picker apps, plus 3 logistics apps for pickup, transit and delivery",
        team: "[Team size and setup]",
        role: "QA owner for the marketplace apps and QA lead for the logistics apps",
      },
      challenge:
        "Every order passed through several apps on iOS, Android and web, from retailer to warehouse to delivery. [Add what was breaking or slow before you started.]",
      approach: [
        {
          decision: "Designed 800+ validation scenarios across iOS, Android and web",
          why: "[Why, e.g. a bug in one app could block the whole order flow]",
        },
        {
          decision: "Automated API tests with RestAssured and ran them in nightly Jenkins regression builds",
          why: "[Why, e.g. the team sees breakages every morning instead of at release time]",
        },
        {
          decision: "Load-tested the backend with JMeter",
          why: "To validate backend performance under real marketplace traffic.",
        },
        {
          decision: "Validated backend data with SQL across seller, retailer and logistics modules",
          why: "To confirm data stayed consistent between the apps, not only on screen.",
        },
      ],
      outcome: {
        metrics: [
          { value: "~50%", label: "less manual verification per sprint" },
          { value: "800+", label: "validation scenarios before release" },
          { value: "6", label: "marketplace and logistics apps covered" },
        ],
        summary: "[What changed for the team.]",
      },
      lessons: "[What you'd do differently next time.]",
    },
  ],

  projects: [
    {
      name: "[restassured-api-framework]",
      url: "https://github.com/tabee1999/[restassured-api-framework]",
      purpose: "[One line: what it tests and why it exists]",
      tags: ["Java", "RestAssured", "TestNG", "[Allure]"],
      demonstrates: [
        "[Reusable request and response specs]",
        "[Data-driven tests]",
        "[JSON schema validation]",
        "[Parallel runs in CI]",
      ],
      reportUrl: "[link to the published test report]",
      ciWorkflow: "ci.yml",
    },
    {
      name: "[playwright-e2e-suite]",
      url: "https://github.com/tabee1999/[playwright-e2e-suite]",
      purpose: "[One line: what it tests and why it exists]",
      tags: ["Playwright", "JavaScript", "GitHub Actions"],
      demonstrates: [
        "[Page Object Model with fixtures]",
        "[Web-first assertions instead of fixed waits]",
        "[Trace and screenshot on failure]",
        "[Cross-browser projects]",
      ],
      reportUrl: "[link to the published Playwright report]",
      ciWorkflow: "ci.yml",
    },
    {
      name: "This portfolio",
      url: "SITE_REPO", // uses site.repoUrl
      purpose: "This website and the Playwright suite that tests it on every push.",
      tags: ["Playwright", "axe-core", "Lighthouse CI", "GitHub Actions"],
      demonstrates: [
        "Contact form tests with mocked network responses",
        "Accessibility checks with axe on every page",
        "Mobile, dark mode and broken-link checks",
        "HTML report published with each deploy",
      ],
      reportUrl: "SITE_REPORT", // uses site.qualityReportPath
      ciWorkflow: "ci.yml",
      visual: "browser",
    },
    {
      name: "Wasty",
      url: "",
      purpose: "Final year project: a smart waste collection system built as an Android app.",
      tags: ["Java", "Android", "Firebase", "Google Maps API"],
      demonstrates: [],
      reportUrl: "",
      ciWorkflow: "",
      visual: "phone",
    },
  ],

  snippet: {
    caption:
      "[Replace with a real snippet from one of your repos.] Polling with an upper limit instead of a fixed sleep:",
    language: "java",
    code: `// Payments are processed asynchronously. A fixed Thread.sleep() was
// either too slow or flaky in CI, so we poll the order status with a
// hard 15-second limit and fail with a clear message if it never settles.
await()
    .atMost(Duration.ofSeconds(15))
    .pollInterval(Duration.ofMillis(500))
    .untilAsserted(() ->
        given().spec(authSpec)
        .when().get("/orders/{id}", orderId)
        .then().statusCode(200)
            .body("status", equalTo("PAID")));`,
  },

  workSamples: [
    {
      kind: "test-plan",
      title: "Test plan",
      subject: "[Public app you tested, e.g. a booking or checkout flow]",
      description:
        "Scope and out-of-scope, risks and priorities, entry and exit criteria, test data and environments.",
      url: "[link to PDF or Notion page]",
    },
    {
      kind: "bug-report",
      title: "Bug report",
      subject: "[Public app you tested]",
      description:
        "Clear title, steps to reproduce, expected and actual results, environment, evidence and severity reasoning.",
      url: "[link to PDF or Notion page]",
    },
    {
      kind: "charter",
      title: "Exploratory testing charter",
      subject: "[Public app you tested]",
      description:
        "A time-boxed mission with session notes: what I covered, bugs found and open questions.",
      url: "[link to PDF or Notion page]",
    },
    {
      kind: "rtm",
      title: "Traceability matrix",
      subject: "[Public app you tested]",
      description: "Requirements mapped to test cases, automation status and latest results.",
      url: "[link to Google Sheet]",
    },
  ],

  skills: [
    { group: "Automation", items: ["Playwright (JavaScript)", "RestAssured (Java)", "TestNG", "Postman / Newman", "Gherkin (BDD)"] },
    { group: "Languages and data", items: ["Java", "JavaScript", "SQL"] },
    { group: "CI/CD and tools", items: ["GitHub Actions", "Jenkins", "Git", "TestRail", "Jira"] },
    { group: "Performance and security", items: ["JMeter", "OWASP ZAP", "Chrome DevTools"] },
    { group: "Testing", items: ["API", "Web", "Mobile (iOS, Android)", "Cross-browser and responsive", "Exploratory"] },
    {
      group: "Practices",
      items: ["Test strategy and planning", "Shift-left testing", "Release readiness (go/no-go)", "Defect triage and root cause analysis", "Agile / Scrum"],
    },
  ],

  // Shown under Skills, and recognised by the job-description match tool.
  learning: ["Python for test automation", "Selenium WebDriver"],

  experience: [
    {
      company: "Epicmetry",
      role: "Senior QA Engineer",
      period: "Jun 2025 – present",
      location: "Remote, Dubai, UAE",
      bullets: [
        "Lead QA for three SaaS products (Tawla.ae, Modon Express and Alrais Travel) across web, mobile and API.",
        "Automated regression with 300+ Playwright, RestAssured and Postman/Newman tests in GitHub Actions, cutting full regression from 2–3 days to under a day.",
        "Lead bug triage and give go/no-go input on 3+ releases a month; run JMeter performance tests and OWASP ZAP scans before releases.",
      ],
    },
    {
      company: "Propellus.co",
      role: "Quality Assurance Engineer",
      period: "Jun 2024 – May 2025",
      location: "Hybrid, Pakistan",
      bullets: [
        "Sole QA engineer at an early-stage visa-processing startup, maintaining 500+ test cases across web and mobile.",
        "Automated critical backend API tests with RestAssured and TestNG, cutting manual regression effort by about 50%.",
        "Built the first Playwright UI suite and introduced shift-left testing to catch defects earlier in each sprint.",
      ],
    },
    {
      company: "Maleyat Group",
      role: "Software Quality Assurance Specialist",
      period: "Jan 2024 – Jun 2024",
      location: "Remote, UAE",
      bullets: [
        "Led regression and backend validation on CRM/CMS trading platforms with 120+ test cases, catching MetaTrader 5 issues before production.",
        "Wrote and maintained 350+ functional and BDD (Gherkin) scenarios for dashboards, onboarding and trading logic.",
      ],
    },
    {
      company: "Dastgyr",
      role: "Software Quality Assurance Engineer",
      period: "Dec 2021 – Jan 2024",
      location: "Hybrid, Karachi, Pakistan",
      bullets: [
        "Owned QA for a high-transaction B2B marketplace (retailer, seller and warehouse apps) and led QA for 3 logistics apps.",
        "Designed and ran 800+ validation scenarios across iOS, Android and web before release.",
        "Added RestAssured API tests to nightly Jenkins regression builds, cutting manual verification by about 50% per sprint.",
      ],
    },
    {
      company: "Squarera (A DataPillar Company)",
      role: "SQA & UI/UX Designer",
      period: "Jan 2021 – Sep 2021",
      location: "Karachi, Pakistan",
      bullets: [
        "Owned QA for 2 SaaS MVP launches, finding critical bugs before release.",
        "Wrote and ran 50+ UI test cases and worked with designers on 3 key modules to reduce layout bugs.",
      ],
    },
  ],

  // Add certifications here: { name, issuer, year, url }. Empty = not shown.
  certifications: [],

  education: [
    {
      degree: "Bachelor of Computer Science",
      school: "PAF-Karachi Institute of Economics and Technology (PAF-KIET), Karachi",
      year: "2018 – 2022",
    },
  ],

  // Short quotes from developers, managers or PMs: { quote, name, role }.
  // Empty = section hidden. LinkedIn recommendations are a good source.
  testimonials: [],

  // Articles or LinkedIn posts: { title, url, venue, year }. Empty = section hidden.
  writing: [],

  contact: {
    heading: "Let's work together",
    intro:
      "I'm open to Senior QA, SDET and QA Automation roles: remote, hybrid or on-site, and to relocating within the EU or GCC. Full-time or long-term contract, with English-speaking teams.",
  },
};
