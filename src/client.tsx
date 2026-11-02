import { hydrateRoot } from "react-dom/client";
import { App, type PageData } from "./App";

declare global {
  interface Window {
    __PAGE__?: { page: PageData; year: number };
  }
}

const data = window.__PAGE__ ?? { page: { route: "home" } as PageData, year: new Date().getFullYear() };
const root = document.getElementById("root");
if (root) hydrateRoot(root, <App page={data.page} year={data.year} />);
