import type { ComponentType } from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { sectionPaths } from "./content";
import { trackClicks } from "./lib/analytics";
import { routeSlug, type PageData } from "./pages";

declare global {
  interface Window {
    __PAGE__?: { page: PageData; year: number };
  }
}

/** Fades sections in the first time they scroll into view (styles in styles.css, motion only). */
function revealOnScroll() {
  const html = document.documentElement;
  if (!html.classList.contains("motion") || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-shown", "");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
    // Already on screen: show it straight away so it never blinks.
    if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-shown", "");
    else io.observe(el);
  }
  html.classList.add("reveal-ready");
}

/**
 * Starts a page in the browser. Each kind of page has its own small entry script (made by
 * scripts/build.mjs) that calls this with that page's component.
 */
export function boot(Page: ComponentType<{ slug?: string }>) {
  const data = window.__PAGE__ ?? { page: { route: "home" } as PageData, year: new Date().getFullYear() };

  // The site used to be one long page. Old links such as /#experience or /#contact (in CVs,
  // emails or search results) now go to the page that section moved to.
  const moved = data.page.route === "home" ? sectionPaths[decodeURIComponent(location.hash.slice(1))] : undefined;
  if (moved) {
    location.replace(moved);
    return;
  }

  const root = document.getElementById("root");
  if (root)
    hydrateRoot(
      root,
      <App page={data.page} year={data.year}>
        <Page slug={routeSlug(data.page)} />
      </App>,
    );
  trackClicks();
  revealOnScroll();
}
