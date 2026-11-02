import { test, expect, type Page } from "@playwright/test";

// The form posts to Formspree. Tests never hit the real service: every request is
// intercepted, so the suite is fast, free and works before the form is connected.
const FORM_ENDPOINT = "https://formspree.io/**";

async function fillForm(page: Page, { name = "Sam Recruiter", email = "sam@company.com", message = "We have a remote Senior QA role that fits your experience." } = {}) {
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Message", { exact: true }).fill(message);
}

test.describe("contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("shows an error for each empty required field", async ({ page }) => {
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("#cf-name-error")).toHaveText("Enter your name.");
    await expect(page.locator("#cf-email-error")).toHaveText("Enter your email address.");
    await expect(page.locator("#cf-message-error")).toHaveText("Enter a message.");
    await expect(page.getByLabel("Name", { exact: true })).toHaveAttribute("aria-invalid", "true");
    // Focus moves to the first field that needs fixing.
    await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  });

  test("rejects an invalid email address", async ({ page }) => {
    let requests = 0;
    await page.route(FORM_ENDPOINT, (route) => {
      requests++;
      return route.abort();
    });

    await fillForm(page, { email: "sam@company" });
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("#cf-email-error")).toHaveText(/valid email address/);
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
    expect(requests).toBe(0);
  });

  test("sends the message and confirms", async ({ page }) => {
    let body = "";
    await page.route(FORM_ENDPOINT, async (route) => {
      body = route.request().postData() ?? "";
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await fillForm(page);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toHaveText(/Message sent/);
    expect(body).toContain("sam@company.com");
    expect(body).toContain("remote Senior QA role");
    // The form resets so the same message isn't sent twice.
    await expect(page.getByLabel("Message", { exact: true })).toHaveValue("");
  });

  test("explains what to do when sending fails", async ({ page }) => {
    await page.route(FORM_ENDPOINT, (route) => route.fulfill({ status: 500, body: "Server error" }));

    await fillForm(page);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toHaveText(/wasn't sent.*try again/);
    // The visitor's message is kept so they can retry.
    await expect(page.getByLabel("Message", { exact: true })).not.toHaveValue("");
    await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
  });
});
