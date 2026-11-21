import type { ReactNode } from "react";
import type { PageKey } from "./content";
import { Chat } from "./components/Chat";
import { BackToTop, Footer, Header, ToastProvider } from "./components/Layout";
import type { PageData } from "./pages";

export type { PageData } from "./pages";

/**
 * The frame every page shares. The page's own content comes in as `children` (from src/pages),
 * so each page's script only carries the components that page uses. Every page has one h1.
 */
export function App({ page, year, children }: { page: PageData; year: number; children?: ReactNode }) {
  const current: PageKey | null = page.route === "case-study" || page.route === "project" ? "projects" : page.route === "404" ? null : page.route;

  return (
    <ToastProvider>
      <Header current={current} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer current={current} year={year} />
      <BackToTop />
      <Chat />
    </ToastProvider>
  );
}
