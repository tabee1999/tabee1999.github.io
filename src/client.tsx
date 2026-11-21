import { hydrateRoot } from "react-dom/client";
import { App, type PageData } from "./App";
import { sectionPaths } from "./content";
import { trackClicks } from "./lib/analytics";

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

const data = window.__PAGE__ ?? { page: { route: "home" } as PageData, year: new Date().getFullYear() };

// The site used to be one long page. Old links such as /#experience or /#contact (in CVs,
// emails or search results) now go to the page that section moved to.
const moved = data.page.route === "home" ? sectionPaths[decodeURIComponent(location.hash.slice(1))] : undefined;

if (moved) {
  location.replace(moved);
} else {
  const root = document.getElementById("root");
  if (root) hydrateRoot(root, <App page={data.page} year={data.year} />);
  trackClicks();
  revealOnScroll();
}
