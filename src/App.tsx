import { caseStudies } from "./content";
import { CaseStudies, CaseStudyPage } from "./components/CaseStudies";
import { Chat } from "./components/Chat";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Icon } from "./components/Icon";
import { BackToTop, Footer, Header, ToastProvider } from "./components/Layout";
import { Projects } from "./components/Projects";
import { About, Faq, Services } from "./components/Sections";
import { Skills } from "./components/Skills";

export type PageData = { route: "home" } | { route: "case-study"; slug: string } | { route: "404" };

function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] place-items-center pt-28 pb-16 text-center" aria-labelledby="nf-title">
      <div className="max-w-lg">
        <p className="text-gradient animate-rise text-8xl font-extrabold tracking-tight">404</p>
        <h1 id="nf-title" className="animate-rise mt-4 text-3xl font-bold" style={{ animationDelay: "80ms" }}>
          This page didn't pass QA
        </h1>
        <p className="animate-rise mt-3 text-lg text-mute" style={{ animationDelay: "160ms" }}>
          The link may be old or mistyped. Here's where you can go instead.
        </p>
        <div className="animate-rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "240ms" }}>
          <a href="/" className="btn btn-primary">
            Go to the home page <Icon name="arrowRight" className="arrow size-4" />
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
