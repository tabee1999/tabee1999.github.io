import { hydrateRoot } from "react-dom/client";
import { App, type PageData } from "./App";
import { sectionPaths } from "./content";
import { trackClicks } from "./lib/analytics";

declare global {
  interface Window {
    __PAGE__?: { page: PageData; year: number };
  }
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
}
