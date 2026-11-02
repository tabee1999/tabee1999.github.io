import { learning, skillAliases, skillGroups } from "../content";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when `term` appears in `text` as a whole word (so "java" doesn't match "javascript"). */
export function mentions(text: string, term: string) {
  return new RegExp(`(^|[^a-z0-9+#])${escape(term.toLowerCase())}([^a-z0-9+#]|$)`).test(text.toLowerCase());
}

/** The words a job ad or question might use for each skill. */
export const termsFor = (skill: string) => skillAliases[skill] ?? [skill];

/** Skills from the CV that a piece of text mentions, plus anything she's currently learning. */
export function matchJob(description: string) {
  const text = description.toLowerCase();
  const matched: string[] = [];
  for (const group of skillGroups) {
    for (const item of group.items) {
      if (termsFor(item).some((t) => mentions(text, t))) matched.push(item);
    }
  }
  const learningHits = learning.filter((l) => mentions(text, l.split(" ")[0]));
  return { matched, learningHits };
}

/** Common QA tools that aren't on the CV, with the closest thing she has used. */
export const notOnCv: Record<string, string> = {
  cypress: "Playwright",
  webdriverio: "Playwright and Selenium",
  testcafe: "Playwright",
  katalon: "Playwright and Selenium",
  "robot framework": "Playwright and Selenium",
  appium: "manual and exploratory testing of iOS and Android apps",
  k6: "JMeter",
  gatling: "JMeter",
  locust: "JMeter",
  loadrunner: "JMeter",
  pytest: "TestNG and JUnit",
  karate: "RestAssured and Postman",
  soapui: "Postman and RestAssured",
  insomnia: "Postman",
  "c#": "Java and JavaScript",
  ".net": "Java",
  ruby: "Java and JavaScript",
  golang: "Java and JavaScript",
  gitlab: "GitHub Actions, Azure DevOps and Jenkins",
  circleci: "GitHub Actions, Azure DevOps and Jenkins",
  zephyr: "TestRail",
  xray: "TestRail",
  graphql: "REST API testing with RestAssured and Postman",
  pact: "contract and schema checks in her API tests",
  typescript: "JavaScript",
  mongodb: "SQL",
  docker: "",
  kubernetes: "",
  aws: "",
};
const display: Record<string, string> = { typescript: "TypeScript", gitlab: "GitLab", circleci: "CircleCI", pytest: "pytest", k6: "k6", "c#": "C#", ".net": ".NET", aws: "AWS", graphql: "GraphQL", mongodb: "MongoDB", soapui: "SoapUI", testcafe: "TestCafe", webdriverio: "WebdriverIO" };
/** How to write a tool's name, e.g. "k6", "GraphQL", "Cypress". */
export const nameOf = (t: string) => display[t] ?? t.replace(/\b\w/g, (c) => c.toUpperCase());

/** Tools a job ad mentions that aren't on her CV, with the closest experience she has. */
export function gapsIn(text: string) {
  return Object.keys(notOnCv)
    .filter((t) => mentions(text, t))
    .map((t) => ({ tool: nameOf(t), closest: notOnCv[t] }));
}
