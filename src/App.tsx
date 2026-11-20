import { caseStudies } from "./content";
import { CaseStudies, CaseStudyPage } from "./components/CaseStudies";
import { Chat } from "./components/Chat";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { BackToTop, Footer, Header, ToastProvider } from "./components/Layout";
import { Projects } from "./components/Projects";
import { About, Faq, Services } from "./components/Sections";
import { Skills } from "./components/Skills";
import { Teams } from "./components/Teams";

export type PageData = { route: "home" } | { route: "case-study"; slug: string } | { route: "404" };

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
          <a href="/#projects" className="btn btn-ghost">
            See my projects
          </a>
        </div>
      </div>
    </section>
  );
}

export function App({ page, year }: { page: PageData; year: number }) {
  const root = page.route === "home" ? "" : "/";
  const study = page.route === "case-study" ? caseStudies.find((c) => c.slug === page.slug) : undefined;

  return (
    <ToastProvider>
      <Header root={root} />
      <main id="main" tabIndex={-1} className="outline-none">
        {page.route === "home" && (
          <>
            <Hero />
            <About />
            <Experience />
            <Teams />
            <Projects />
            <CaseStudies />
            <Services />
            <Skills />
            <Faq />
            <Contact />
          </>
        )}
        {study && <CaseStudyPage study={study} />}
        {page.route === "404" && <NotFound />}
      </main>
      <Footer root={root} year={year} />
      <BackToTop />
      <Chat />
    </ToastProvider>
  );
}
