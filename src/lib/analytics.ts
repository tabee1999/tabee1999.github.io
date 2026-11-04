// Counts a few meaningful clicks (CV downloads, emails, LinkedIn, the chat, the Allure report)
// as GoatCounter events. Does nothing unless site.goatcounterCode is set: no cookies, no
// personal data, nothing sent anywhere else.

type GoatCounter = { count?: (vars: { path: string; title?: string; event?: boolean }) => void };

export function track(event: string) {
  const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter;
  if (gc && typeof gc.count === "function") gc.count({ path: event, title: event, event: true });
}

/** Works out an event name for a clicked link or button, or null if it isn't worth counting. */
export function eventFor(el: Element): string | null {
  const tagged = el.closest<HTMLElement>("[data-track]");
  if (tagged?.dataset.track) return tagged.dataset.track;

  const link = el.closest<HTMLAnchorElement>("a[href]");
  if (!link) return null;
  const href = link.getAttribute("href") ?? "";
  if (link.hasAttribute("download") || href.endsWith(".pdf")) return "cv-download";
  if (href.startsWith("mailto:")) return "email-click";
  if (href.includes("linkedin.com")) return "linkedin-click";
  if (href.includes("github.com")) return "github-click";
  if (/(^|\/)allure\/?$/.test(href)) return "allure-report";
  if (/(^|\/)report\/?$/.test(href)) return "playwright-report";
  if (href.includes("/case-studies/")) return `case-study-${href.split("/case-studies/")[1].replace(/\/$/, "")}`;
  if (/^https?:\/\//.test(href) && !href.startsWith(location.origin)) return `outbound-${new URL(href).hostname.replace(/^www\./, "")}`;
  return null;
}

export function trackClicks() {
  document.addEventListener(
    "click",
    (e) => {
      const name = e.target instanceof Element ? eventFor(e.target) : null;
      if (name) track(name);
    },
    { capture: true, passive: true },
  );
}
