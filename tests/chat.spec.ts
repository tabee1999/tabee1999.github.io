import { test, expect, type Page } from "@playwright/test";
import { allureLabels, axeViolations, content } from "./helpers";

test.beforeEach(async ({}, testInfo) => allureLabels(testInfo, "AI chat assistant", "normal"));

const { person } = content;

async function openChat(page: Page) {
  await page.getByTestId("chat-launcher").click();
  await expect(page.getByRole("dialog", { name: "Ask about Tabeeda" })).toBeVisible();
}

async function ask(page: Page, question: string) {
  await page.getByLabel("Your question").fill(question);
  await page.getByRole("button", { name: "Send question" }).click();
  return page.getByTestId("chat-answer").last();
}

test.describe("chat (built-in answers)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens from the button, focuses the input and closes with Escape", async ({ page }) => {
    await openChat(page);
    await expect(page.getByLabel("Your question")).toBeFocused();
    await expect(page.getByTestId("chat-mode")).toHaveText("Quick answers from her CV");
    await expect(page.getByRole("button", { name: "Send question" })).toBeDisabled();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Ask about Tabeeda" })).toBeHidden();
    await expect(page.getByTestId("chat-launcher")).toBeFocused();
  });

  test("a suggested question gets an answer with evidence from the CV", async ({ page }) => {
    await openChat(page);
    await page.getByRole("button", { name: "Does she know Playwright?" }).click();
    const reply = page.getByTestId("chat-answer").last();
    await expect(reply).toContainText("hands-on experience with Playwright");
    await expect(reply).toContainText("Epicmetry");
    await expect(reply.getByRole("link", { name: "Download CV" })).toHaveAttribute("download", "");
  });

  test("answers typed questions about availability, skills and contact", async ({ page }) => {
    await openChat(page);
    await expect(await ask(page, "Is she open to remote work?")).toContainText("open to remote, hybrid or on-site roles");
    await expect(await ask(page, "Does she know Cypress?")).toContainText("Cypress isn't on her CV");
    const contact = await ask(page, "How can I contact her?");
    await expect(contact).toContainText(person.email);
    await expect(contact.getByRole("link", { name: "Email Tabeeda" })).toHaveAttribute("href", `mailto:${person.email}`);
    await expect(page.getByTestId("chat-answer")).toHaveCount(3);
  });

  test("answers work authorisation, start date and leadership questions", async ({ page }) => {
    await openChat(page);
    await expect(await ask(page, "Does she have the right to work in the EU?")).toContainText("authorised to work in Pakistan and Cyprus");
    await expect(await ask(page, "When can she start?")).toContainText("notice period and earliest start date");
    await expect(await ask(page, "Can she lead a QA team?")).toContainText("Yes, she leads QA");
  });

  test("backs up a skill with where she used it", async ({ page }) => {
    await openChat(page);
    const reply = await ask(page, "Does she know Selenium?");
    await expect(reply).toContainText("hands-on experience with Selenium");
    await expect(reply).toContainText("Dastgyr");
  });

  test("stays on topic for personal or unrelated questions", async ({ page }) => {
    await openChat(page);
    await expect(await ask(page, "How old is she?")).toContainText("only answer questions about Tabeeda's professional profile");
    await expect(await ask(page, "What's the weather like?")).toContainText("I'm not sure about that one");
  });

  test("has no accessibility violations while open", async ({ page }) => {
    await openChat(page);
    await page.getByRole("button", { name: "What is AI-first QA?" }).click();
    await expect(page.getByTestId("chat-answer")).toHaveCount(1);
    expect(await axeViolations(page)).toEqual([]);
  });

  test("fits on a phone screen", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openChat(page);
    const box = (await page.getByTestId("chat-panel").boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    expect(box.y + box.height).toBeLessThanOrEqual(740);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});

test.describe("chat (AI mode, with the AI service mocked)", () => {
  const endpoint = "https://chat.example.test/";
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" };

  /** Mocks the chat worker: answers the CORS preflight, then hands POSTs to `reply`. */
  async function mockWorker(page: Page, reply: (body: { messages: { role: string; content: string }[] }) => { status?: number; json: unknown }) {
    await page.route(endpoint, async (route) => {
      if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
      const { status = 200, json } = reply(route.request().postDataJSON());
      return route.fulfill({ status, headers: cors, json });
    });
  }

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((url) => {
      (window as unknown as { __chatEndpoint: string }).__chatEndpoint = url;
    }, endpoint);
    await page.goto("/");
  });

  test("sends the conversation to the AI service and shows its reply", async ({ page }) => {
    let sent: { messages: { role: string; content: string }[] } | null = null;
    await mockWorker(page, (body) => {
      sent = body;
      return { json: { reply: "**She** has 5+ years in QA, most recently at Epicmetry." } };
    });

    await openChat(page);
    await expect(page.getByTestId("chat-mode")).toContainText("AI assistant");
    const reply = await ask(page, "How experienced is she?");
    await expect(reply).toContainText("She has 5+ years in QA, most recently at Epicmetry.");
    await expect(reply).not.toContainText("**");
    // The greeting stays on the page; only the real conversation is sent.
    expect(sent!.messages).toEqual([{ role: "user", content: "How experienced is she?" }]);

    await page.unroute(endpoint);
    await mockWorker(page, (body) => {
      sent = body;
      return { json: { reply: "Yes, Playwright and Selenium." } };
    });
    await expect(await ask(page, "Does she automate UI tests?")).toContainText("Yes, Playwright and Selenium.");
    expect(sent!.messages.map((m) => m.role)).toEqual(["user", "assistant", "user"]);
  });

  test("falls back to built-in answers when the AI service is down", async ({ page }) => {
    await mockWorker(page, () => ({ status: 502, json: { error: "unavailable" } }));
    await openChat(page);
    const reply = await ask(page, "Is she open to remote work?");
    await expect(reply).toContainText("The AI assistant isn't available right now");
    await expect(reply).toContainText("open to remote, hybrid or on-site roles");
  });

  test("explains when too many questions were sent", async ({ page }) => {
    await mockWorker(page, () => ({ status: 429, json: { error: "Too many messages" } }));
    await openChat(page);
    const reply = await ask(page, "What is AI-first QA?");
    await expect(reply).toContainText("Lots of questions right now");
    await expect(reply).toContainText("In her words");
  });
});
