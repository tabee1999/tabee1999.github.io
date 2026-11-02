import { test, expect, type Page } from "@playwright/test";
import { content } from "./helpers";

const { person, site } = content;

async function fillForm(page: Page, { name = "Sam Recruiter", email = "sam@company.com", message = "We have a remote Senior QA role that fits your experience." } = {}) {
  await page.getByLabel("Your name", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Message", { exact: true }).fill(message);
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    // Capture the email the form would open, instead of launching a mail app.
    await page.addInitScript(() => {
      (window as unknown as { __openMail: (h: string) => void; __mail: string }).__openMail = (h) => {
        (window as unknown as { __mail: string }).__mail = h;
      };
    });
    await page.goto("/#contact");
  });

  test("shows an error for each empty required field", async ({ page }) => {
    await page.getByTestId("contact-submit").click();

    await expect(page.locator("#contact-name-error")).toHaveText(/enter your name/);
    await expect(page.locator("#contact-email-error")).toHaveText(/enter your email address/);
    await expect(page.locator("#contact-message-error")).toHaveText(/at least 20 characters/);
    await expect(page.getByLabel("Your name", { exact: true })).toHaveAttribute("aria-invalid", "true");
    // Focus moves to the first field that needs fixing.
    await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  });

  test("rejects an invalid email address", async ({ page }) => {
    await fillForm(page, { email: "sam@company" });
    await page.getByTestId("contact-submit").click();

    await expect(page.locator("#contact-email-error")).toHaveText(/valid email address/);
    await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
    await expect(page.getByTestId("contact-result")).toHaveCount(0);
  });

  test("errors clear as soon as the field is fixed", async ({ page }) => {
    await page.getByTestId("contact-submit").click();
    await expect(page.locator("#contact-name-error")).toBeVisible();
    await page.getByLabel("Your name", { exact: true }).fill("Sam");
    await expect(page.locator("#contact-name-error")).toHaveCount(0);
  });

  test("a valid message opens a ready-to-send email (until a form service is connected)", async ({ page }) => {
    test.skip(!!site.formEndpoint, "The form posts to a form service instead");
    await page.getByText("Contract or freelance").click();
    await fillForm(page);
    await page.getByTestId("contact-submit").click();

    const result = page.getByTestId("contact-result");
    await expect(result).toContainText("Your email is ready to send");
    const mail = await page.evaluate(() => (window as unknown as { __mail: string }).__mail);
    expect(mail).toMatch(new RegExp(`^mailto:${person.email}\\?subject=`));
    const decoded = decodeURIComponent(mail);
    expect(decoded).toContain("Contract or freelance: message from Sam Recruiter");
    expect(decoded).toContain("remote Senior QA role");
    expect(decoded).toContain("sam@company.com");
    await expect(page.getByTestId("mailto-link")).toHaveAttribute("href", mail);

    await page.getByRole("button", { name: "Write another message" }).click();
    await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  });

  test("sends to the form service when one is connected", async ({ page }) => {
    test.skip(!site.formEndpoint, "No form service connected yet");
    let body = "";
    await page.route(site.formEndpoint, async (route) => {
      body = route.request().postData() ?? "";
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await fillForm(page);
    await page.getByTestId("contact-submit").click();
    await expect(page.getByTestId("contact-result")).toContainText("Thanks");
    expect(body).toContain("sam@company.com");
  });

  test("bots that fill the hidden field are ignored", async ({ page }) => {
    await fillForm(page);
    await page.locator("#contact-website").evaluate((el: HTMLInputElement) => (el.value = "spam.example"));
    await page.getByTestId("contact-submit").click();
    await expect(page.getByTestId("contact-result")).toHaveCount(0);
  });
});
