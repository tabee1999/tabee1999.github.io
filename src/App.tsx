import type { ReactNode } from "react";
import { caseStudies, type PageKey } from "./content";
import { CaseStudies, CaseStudyPage } from "./components/CaseStudies";
import { Chat } from "./components/Chat";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Explore, HowIWork, TestRunShow } from "./components/Home";
import { BackToTop, Footer, Header, ToastProvider } from "./components/Layout";
import { Projects } from "./components/Projects";
import { About, Faq, Services } from "./components/Sections";
import { ShieldBand } from "./components/Shield";
import { Skills } from "./components/Skills";
import { Teams } from "./components/Teams";

export type PageData = { route: PageKey } | { route: "case-study"; slug: string } | { route: "404" };

/** What each page shows. Every page has exactly one h1. */
const pageBody: Record<PageKey, () => ReactNode> = {
  home: () => (
    <>
      <Hero />
      <TestRunShow />
      <HowIWork />
      <Explore />
    </>
  ),
  about: () => (
    <>
      <About level={1} />
      <Teams />
    </>
  ),
  experience: () => <Experience level={1} />,
  projects: () => (
    <>
      <Projects level={1} />
      <CaseStudies />
    </>
  ),
  skills: () => (
    <>
      <Services level={1} />
      <Skills />
    </>
  ),
  contact: () => (
    <>
      <Contact level={1} />
      <ShieldBand />
      <Faq />
    </>
  ),
};

function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] place-items-center pt-28 pb-16" aria-labelledby="nf-title">
      <div className="w-full max-w-xl">
        <p className="font-mono text-sm font-bold text-rose-700" aria-hidden="true">
          ✕ 1 failed
        </p>
        <h1 id="nf-title" className="mt-3 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          This page didn't pass QA
        </h1>
        <p className="mt-4 text-lg text-mute">The link may be old or mistyped (error 404). Here's where you can go instead.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">
            Go to the home page
          </a>
          <a href="/projects/" className="btn btn-ghost">
            See my projects
          </a>
        </div>
      </div>
    </section>
  );
}

export function App({ page, year }: { page: PageData; year: number }) {
  const study = page.route === "case-study" ? caseStudies.find((c) => c.slug === page.slug) : undefined;
  const current: PageKey | null = page.route === "case-study" ? "projects" : page.route === "404" ? null : page.route;
  const Body = page.route in pageBody ? pageBody[page.route as PageKey] : null;

  return (
    <ToastProvider>
      <Header current={current} />
      <main id="main" tabIndex={-1} className="outline-none">
        {Body?.()}
        {study && <CaseStudyPage study={study} />}
        {page.route === "404" && <NotFound />}
      </main>
      <Footer current={current} year={year} />
      <BackToTop />
      <Chat />
    </ToastProvider>
  );
}
