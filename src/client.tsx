import { hydrateRoot } from "react-dom/client";
import { App, type PageData } from "./App";
import { trackClicks } from "./lib/analytics";
import { initMotionPref } from "./lib/motionPref";

declare global {
  interface Window {
    __PAGE__?: { page: PageData; year: number };
  }
}

const data = window.__PAGE__ ?? { page: { route: "home" } as PageData, year: new Date().getFullYear() };
initMotionPref();
const root = document.getElementById("root");
if (root) hydrateRoot(root, <App page={data.page} year={data.year} />);
trackClicks();
