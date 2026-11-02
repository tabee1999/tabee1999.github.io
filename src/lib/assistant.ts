// The chat's built-in answers. Works with no server and no API key: it reads the question,
// works out what it's about and answers from src/content.ts, so it never says anything the
// site doesn't. When site.chatEndpoint is set, Claude answers instead and this is the fallback.

import { caseStudies, education, experience, person, process, projects, services, skillGroups, stats } from "../content";
import { matchJob, mentions, nameOf, notOnCv, termsFor } from "./match";

export type ChatAction = { label: string; href: string; kind: "download" | "external" | "internal" | "mail" };
export type Answer = { text: string; actions?: ChatAction[]; topic: string };

export const suggestions = [
  "What's her experience?",
  "Does she know Playwright?",
  "Is she open to remote work?",
  "What is AI-first QA?",
  "How can I contact her?",
];

const cv: ChatAction = { label: "Download CV", href: `/${person.cv}`, kind: "download" };
const email: ChatAction = { label: "Email Tabeeda", href: `mailto:${person.email}`, kind: "mail" };
const linkedin: ChatAction = { label: "LinkedIn", href: person.linkedin, kind: "external" };
const section = (id: string, label: string): ChatAction => ({ label, href: `/#${id}`, kind: "internal" });

const listOf = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");
const statLine = (s: (typeof stats)[number]) => `${s.prefix ?? ""}${s.value}${s.suffix ?? ""} ${lowerFirst(s.label)} (${s.detail})`;
/** Site copy is written in Tabeeda's voice; the assistant quotes it rather than rewording it. */
const inHerWords = (text: string) => `In her words: “${text}”`;

// ── Skills ────────────────────────────────────────────────────────────────

/** Tools, as opposed to broad practices: these get a direct "yes, she uses it" answer. */
const toolGroups = ["Automation", "Languages and data", "CI/CD and tools", "Performance and security"];
const tools = new Set([...skillGroups.filter((g) => toolGroups.includes(g.group)).flatMap((g) => g.items), "GitHub Copilot", "ChatGPT and Claude"]);

/** Broad phrases that also map to a tool; on their own they get a topic answer, not a tool answer. */
const generic = new Set(["api testing", "api automation", "load testing", "performance testing", "security testing", "ci/cd", "ci / cd", "ci-cd", "continuous integration", "continuous delivery", "pipeline", "pipelines", "database", "test data", "release"]);
const namesTool = (q: string, skill: string) => termsFor(skill).some((t) => !generic.has(t) && mentions(q, t));


const askingAboutSkill = (q: string) =>
  /\b(know|knows|use|uses|used|using|experience (with|in)|experienced|familiar|worked with|work with|skilled|proficient|can she|does she|has she|tool|tools)\b/.test(q) ||
  q.split(/\s+/).length <= 3;

/** Where on the CV a skill shows up, e.g. "Epicmetry: Automated regression with 300+ Playwright…" */
function evidence(skills: string[]) {
  const found: string[] = [];
  for (const job of experience) {
    for (const bullet of job.bullets) {
      if (found.length >= 2) return found;
      if (skills.some((s) => termsFor(s).some((t) => mentions(bullet, t)))) found.push(`${job.company}: ${bullet}`);
    }
  }
  return found;
}

function skillAnswer(q: string): Answer | null {
  const { matched, learningHits } = matchJob(q);
  const known = matched.filter((m) => tools.has(m) && namesTool(q, m));
  const unknown = Object.keys(notOnCv).filter((t) => mentions(q, t));
  if (!known.length && !unknown.length && !learningHits.length) return null;

  const parts: string[] = [];
  if (known.length) {
    parts.push(`Yes. Tabeeda has hands-on experience with ${listOf(known)} in her QA work.`);
    const seen = evidence(known);
    if (seen.length) parts.push(bullets(seen));
  }
  for (const l of learningHits) parts.push(`She's currently learning ${l}.`);
  for (const t of unknown) {
    const near = notOnCv[t];
    parts.push(`${nameOf(t)} isn't on her CV${near ? `. The closest experience she has is ${near}` : ""}. Worth asking her directly.`);
  }
  return { topic: "skill", text: parts.join("\n\n"), actions: [section("skills", "See all skills"), cv] };
}

// ── Companies and projects ────────────────────────────────────────────────

/** What people might call each project in a question. */
const projectNames: Record<string, string[]> = {
  "al-rais-travel": ["al rais", "alrais"],
  "modon-express": ["modon"],
  fleetify: ["fleetify"],
  "visa-platform": ["visa platform", "visa processing"],
  "trading-platforms": ["forex", "trading", "crypto", "metatrader", "mt5"],
  "b2b-marketplace": ["marketplace", "b2b", "logistics apps"],
  "portfolio-ai-assistant": ["chat assistant", "this chatbot", "this chat"],
};

function entityAnswer(q: string): Answer | null {
  const otherNames: Record<string, string[]> = { Epicmetry: ["tawla"], "Maleyat Group (now Naqdi)": ["naqdi"] };
  const job = experience.find((j) => mentions(q, j.company.split(/[\s(]/)[0].replace(/\.co$/i, "")) || (otherNames[j.company] ?? []).some((n) => mentions(q, n)));
  if (job) {
    const current = job.period.includes("present");
    return {
      topic: "company",
      text: `${current ? "She is" : "She was"} ${job.role} at ${job.company} (${job.period}, ${job.location}). ${job.about ? `${job.about} ` : ""}${job.summary}\n\n${bullets(job.bullets.slice(0, 3))}`,
      actions: [section("experience", "See experience"), ...(job.url ? [{ label: `${job.company.split(" (")[0]} website`, href: job.url, kind: "external" as const }] : [])],
    };
  }
  const project = projects.find((p) => (projectNames[p.slug] ?? []).some((n) => mentions(q, n)));
  if (project) {
    return {
      topic: "project",
      text: `${project.name} (${project.company}, ${lowerFirst(project.domain)}). ${inHerWords(project.summary)}\n\n${bullets(project.highlights)}`,
      actions: [section("projects", "See projects")],
    };
  }
  return null;
}

// ── Topics ────────────────────────────────────────────────────────────────

type Topic = { id: string; words: string[]; answer: (q: string) => Omit<Answer, "topic"> };

const svc = (title: string) => services.find((s) => s.title === title)!;
const serviceAnswer = (title: string, extra = "") => {
  const s = svc(title);
  return { text: `${inHerWords(s.text)}${extra}\n\n${bullets(s.points)}`, actions: [section("services", "See services"), cv] };
};

const topics: Topic[] = [
  {
    id: "greeting",
    words: ["hi", "hello", "hey", "salam", "assalam", "good morning", "good afternoon", "good evening"],
    answer: () => ({ text: "Hi! I can tell you about Tabeeda's experience, skills, projects and availability. What would you like to know?" }),
  },
  {
    id: "thanks",
    words: ["thanks", "thank you", "thx", "cheers", "bye", "goodbye"],
    answer: () => ({ text: "You're welcome! If you'd like to talk to Tabeeda directly, email her.", actions: [email, cv] }),
  },
  {
    id: "personal",
    words: ["age", "how old", "married", "husband", "boyfriend", "religion", "family", "kids", "children", "instagram", "tiktok"],
    answer: () => ({ text: "I can only answer questions about Tabeeda's professional profile: her experience, skills, projects and availability." }),
  },
  {
    id: "salary",
    words: ["salary", "compensation", "pay", "rate", "rates", "expected salary", "ctc", "package", "hourly"],
    answer: () => ({ text: "Compensation is best discussed with Tabeeda directly. Send her a short email with the role and the range.", actions: [email] }),
  },
  {
    id: "visa",
    words: ["visa", "work permit", "permit", "sponsorship", "sponsor", "citizenship", "passport", "nationality", "right to work", "work authorisation", "work authorization", "authorised", "authorized", "eligible", "eligibility", "legally"],
    answer: () => ({
      text: `She's ${lowerFirst(person.workAuthorisation)}. For on-site roles in other countries she's open to relocating within the EU or the GCC, so ask her about the details for your location.`,
      actions: [email],
    }),
  },
  {
    id: "contact",
    words: ["contact", "email", "mail", "reach", "linkedin", "call", "phone", "number", "whatsapp", "message", "talk", "connect", "interview", "meet", "schedule"],
    answer: (q) => ({
      text: `${/\b(phone|call|number|whatsapp)\b/.test(q) ? "Her phone number isn't shared on the site. " : ""}You can email Tabeeda at ${person.email}, connect on LinkedIn, or use the contact form at the bottom of the page.`,
      actions: [email, linkedin, section("contact", "Contact form")],
    }),
  },
  {
    id: "cv",
    words: ["cv", "resume", "résumé", "curriculum vitae", "download", "pdf"],
    answer: () => ({ text: "Here's her CV as a PDF, with her experience, skills and education.", actions: [cv] }),
  },
  {
    id: "why",
    words: ["why", "strengths", "strength", "good fit", "stand out", "unique", "should we hire", "should i hire", "what makes", "best at"],
    answer: () => ({
      text: `Tabeeda owns quality end to end, from test strategy to the release go/no-go call, and pairs careful manual testing with automation and AI.\n\n${bullets(stats.map(statLine))}`,
      actions: [section("case-studies", "Read case studies"), cv],
    }),
  },
  {
    id: "current",
    words: ["now", "current", "currently", "present", "today", "works at", "work now", "working now"],
    answer: () => {
      const job = experience[0];
      return { text: `She's currently ${job.role} at ${job.company} (${job.period}, ${job.location}). ${job.summary}\n\n${bullets(job.bullets.slice(0, 3))}`, actions: [section("experience", "See experience")] };
    },
  },
  {
    id: "leadership",
    words: ["lead", "leads", "leader", "leadership", "manage", "manager", "management", "team lead", "qa lead", "own", "owns", "ownership"],
    answer: () => ({
      text: `Yes, she leads QA.\n\n${bullets([
        "Epicmetry: QA lead for travel, logistics and fleet products. She owns test strategy, leads bug triage and gives go/no-go input on 3+ releases a month.",
        "Dastgyr: owned QA for the B2B marketplace apps and led QA for 3 logistics apps.",
        "Propellus: the sole QA engineer, owning testing from planning to release.",
      ])}`,
      actions: [section("experience", "See experience"), cv],
    }),
  },
  {
    id: "start",
    words: ["when can she start", "start", "start date", "starting", "notice", "notice period", "earliest", "join", "joining", "available from"],
    answer: () => ({
      text: `She's open to new roles now (${lowerFirst(person.employment)}). For her notice period and earliest start date, the quickest way is a short email.`,
      actions: [email, cv],
    }),
  },
  {
    id: "location",
    words: ["where", "based", "location", "located", "live", "lives", "country", "city", "remote", "relocate", "relocation", "relocating", "onsite", "on-site", "hybrid", "timezone", "time zone", "cyprus", "dubai", "uae", "europe", "eu", "pakistan", "move"],
    answer: () => ({
      text: `She's based in ${person.location} and works on ${person.timezones.map((t) => `${t.label} time (${t.offset})`).join(" or ")}. She's ${lowerFirst(person.workAuthorisation)}. She's open to ${lowerFirst(person.openTo)}.`,
      actions: [email],
    }),
  },
  {
    id: "availability",
    words: ["available", "availability", "hire", "hiring", "open", "looking", "opportunity", "opportunities", "role", "roles", "position", "job", "freelance", "contract", "full-time", "full time"],
    answer: () => ({
      text: `Yes, she's open to ${listOf(person.targetRoles)} roles (${lowerFirst(person.employment)}). She's open to ${lowerFirst(person.openTo)}. For start dates or notice period, the quickest way is a short email.`,
      actions: [email, cv],
    }),
  },
  {
    id: "experience",
    words: ["experience", "years", "worked", "companies", "company", "career", "work history", "previous", "background", "roles", "seniority", "senior"],
    answer: () => ({
      text: `She has 5+ years in QA. Right now she's ${experience[0].role} at ${experience[0].company} (${experience[0].period}). Before that:\n\n${bullets(experience.slice(1).map((e) => `${e.role}, ${e.company} (${e.period})`))}`,
      actions: [section("experience", "See experience"), cv],
    }),
  },
  {
    id: "about",
    words: ["who", "about", "tell me", "summary", "introduce", "profile", "overview"],
    answer: () => ({ text: `${person.intro}\n\n${bullets(stats.map(statLine))}`, actions: [section("about", "About Tabeeda"), cv] }),
  },
  {
    id: "education",
    words: ["education", "degree", "university", "uni", "studied", "study", "graduate", "graduated", "bachelor", "bachelors", "college", "kiet", "qualification", "qualifications"],
    answer: () => ({ text: `${education.degree}, ${education.school} (${education.years}). ${education.note}` }),
  },
  {
    id: "certification",
    words: ["certification", "certifications", "certified", "certificate", "istqb"],
    answer: () => ({ text: "No certifications are listed on her CV. Her experience comes from 5+ years of hands-on QA work, summarised in the case studies.", actions: [section("case-studies", "Read case studies")] }),
  },
  {
    id: "languages",
    words: ["language", "languages", "speak", "speaks", "english", "urdu", "turkish", "fluent", "fluency"],
    answer: (q) =>
      /\b(programming|coding|code)\b/.test(q)
        ? { text: "She writes tests in Java and JavaScript, and uses SQL to check the data behind the screens." }
        : { text: "She speaks English at a professional working level, plus Urdu and some Turkish (beginner)." },
  },
  {
    id: "ai",
    words: ["ai", "ai-first", "ai first", "llm", "llms", "genai", "artificial intelligence", "machine learning", "prompt", "prompts", "chatbot"],
    answer: () => serviceAnswer("AI-first QA"),
  },
  {
    id: "manual",
    words: ["manual", "exploratory", "test case", "test cases", "uat", "regression", "smoke", "bug report", "bug reports", "bugs"],
    answer: () => serviceAnswer("Manual and exploratory QA"),
  },
  {
    id: "automation",
    words: ["automation", "automate", "automated", "framework", "frameworks", "scripts", "ci", "ci/cd", "pipeline", "pipelines", "sdet", "qa automation", "automation engineer", "coding", "code"],
    answer: () => serviceAnswer("Test automation", " Her suites have reached 300+ automated tests in CI, cutting full regression from 2–3 days to under a day."),
  },
  {
    id: "api",
    words: ["api", "apis", "rest", "backend", "back-end", "endpoints"],
    answer: () => serviceAnswer("API testing"),
  },
  {
    id: "mobile",
    words: ["mobile", "ios", "android", "app", "apps", "cross-browser", "browser", "browsers", "responsive", "accessibility", "wcag"],
    answer: () => serviceAnswer("Web and mobile testing"),
  },
  {
    id: "performance",
    words: ["performance", "load", "stress", "security", "penetration", "speed"],
    answer: () => serviceAnswer("Performance and security"),
  },
  {
    id: "projects",
    words: ["project", "projects", "product", "products", "portfolio", "clients", "client", "built", "shipped", "domains", "industries", "industry"],
    answer: () => ({
      text: `She has tested products in travel, payments, fleet management, AI and fintech:\n\n${bullets(projects.map((p) => `${p.name} (${p.company})`))}`,
      actions: [section("projects", "See projects")],
    }),
  },
  {
    id: "case-studies",
    words: ["case study", "case studies", "example", "examples", "achievement", "achievements", "impact", "results", "accomplishment", "proud", "biggest", "success"],
    answer: () => ({
      text: `Three examples, each with the context, the decisions and the results:\n\n${bullets(caseStudies.map((c) => `${c.title}: ${c.summary}`))}`,
      actions: caseStudies.map((c) => ({ label: c.area, href: `/case-studies/${c.slug}/`, kind: "internal" as const })),
    }),
  },
  {
    id: "skills",
    words: ["skills", "skill", "tools", "tool", "stack", "tech stack", "technologies", "technology", "expertise", "specialise", "specialize", "specialty"],
    answer: () => ({ text: bullets(skillGroups.map((g) => `${g.group}: ${g.items.slice(0, 5).join(", ")}`)), actions: [section("skills", "See all skills")] }),
  },
  {
    id: "process",
    words: ["process", "approach", "methodology", "strategy", "workflow", "how does she work", "how she works", "shift-left", "shift left"],
    answer: () => ({ text: process.map((p, i) => `${i + 1}. ${p.title}: ${p.text}`).join("\n") }),
  },
];

const fallback: Answer = {
  topic: "fallback",
  text: "I'm not sure about that one. I can answer questions about Tabeeda's experience, skills, projects, availability and how to reach her. For anything else, email her directly.",
  actions: [email],
};

/** Answers a recruiter's question from the site's content. */
export function answer(question: string): Answer {
  const q = question.toLowerCase().replace(/[’`]/g, "'").trim();
  if (!q) return fallback;

  if (askingAboutSkill(q)) {
    const skill = skillAnswer(q);
    if (skill) return skill;
  }
  const entity = entityAnswer(q);
  if (entity) return entity;

  let best: { topic: Topic; score: number } | null = null;
  for (const topic of topics) {
    const score = topic.words.reduce((sum, w) => sum + (mentions(q, w) ? (w.includes(" ") ? 2 : 1) : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  if (best) return { topic: best.topic.id, ...best.topic.answer(q) };

  return skillAnswer(q) ?? fallback;
}
