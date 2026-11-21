import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { nav, pages, person, sectionPaths, site, type PageKey } from "../content";
import { useScrolled, useScrollProgressBar } from "../lib/hooks";
import { Clocks } from "./Clocks";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";

// ── Toast ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<(message: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    setMessage(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 2800);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
          message ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        data-testid="toast"
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

// ── Header ────────────────────────────────────────────────────────────────

export function Logo({ current }: { current: PageKey | null }) {
  return (
    <a href={current === "home" ? "#top" : "/"} className="group flex items-center gap-3 rounded-xl">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-[0.7rem] bg-accent-700 text-[0.95rem] font-bold tracking-tight text-white transition-colors group-hover:bg-accent-800">
        {person.initials}
      </span>
      <span className="leading-tight">
        <span className="block text-[0.95rem] font-bold text-ink">{person.name}</span>
        <span className="block text-xs text-mute">{person.role}</span>
      </span>
    </a>
  );
}

/** `current` is the page being shown; case studies count as Projects. */
export function Header({ current }: { current: PageKey | null }) {
  const scrolled = useScrolled();
  const progressBar = useScrollProgressBar<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled || open ? "border-b border-line bg-paper/95 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div
        ref={progressBar}
        className="no-print absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent-500"
        aria-hidden="true"
        data-testid="scroll-progress"
      />
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Logo current={current} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.key}>
                <a
                  href={n.path}
                  aria-current={current === n.key ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:text-ink ${
                    current === n.key ? "text-ink" : "text-mute"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-600 transition-transform duration-200 ${
                      current === n.key ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={pages.contact.path}
            aria-current={current === "contact" ? "page" : undefined}
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            Contact me
          </a>
          <button
            ref={menuButton}
            type="button"
            className="btn btn-ghost btn-sm aspect-square !px-0 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-line transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="wrap py-4">
          <ul className="grid gap-1">
            {nav.map((n) => (
              <li key={n.key}>
                <a
                  href={n.path}
                  aria-current={current === n.key ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center rounded-xl px-3 py-3.5 text-lg font-semibold hover:bg-accent-50 ${current === n.key ? "bg-accent-50 text-accent-800" : "text-ink"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={pages.contact.path} onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">
            Contact me
          </a>
        </nav>
      </div>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────

const footerLinks = [
  { label: "Home", href: "/" },
  ...nav.map((n) => ({ label: n.label, href: n.path })),
  { label: "Case studies", href: sectionPaths["case-studies"] },
  { label: "Contact", href: pages.contact.path },
];

export function Footer({ current, year }: { current: PageKey | null; year: number }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo current={current} />
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Senior QA Engineer, SDET and QA Automation: manual, automated and AI-first testing. Based in Pakistan and Cyprus, working remotely from anywhere.
          </p>
          <p className="flex items-center gap-2 text-sm text-mute">
            <Icon name="clock" className="size-4 shrink-0 text-accent-600" />
            <Clocks />
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-semibold text-ink">Explore</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((n) => (
              <li key={n.label}>
                <a href={n.href} className="text-mute transition-colors hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Connect</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 text-mute hover:text-ink">
                <Icon name="mail" className="size-4" /> {person.email}
              </a>
            </li>
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-mute hover:text-ink">
                <LinkedInIcon className="size-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-mute hover:text-ink">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </li>
            <li>
              <a href={`/${person.cv}`} download className="inline-flex items-center gap-2 text-mute hover:text-ink">
                <Icon name="download" className="size-4" /> Download CV
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        {/* Extra space at the bottom so the chat button never covers these links */}
        <div className="wrap flex flex-col gap-3 pt-6 pb-24 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {person.name}. Built with React, TypeScript and Tailwind CSS.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" className="size-3.5 text-ok" /> Tested with Playwright, axe and Allure
            </span>
            <a href={`/${site.qualityReportPath}`} className="underline decoration-accent-300 underline-offset-4 hover:text-ink" data-testid="quality-report">
              Allure report
            </a>
            <a href={`/${site.playwrightReportPath}`} className="underline decoration-accent-300 underline-offset-4 hover:text-ink">
              Playwright report
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Back to top ───────────────────────────────────────────────────────────

export function BackToTop() {
  const visible = useScrolled(900);
  return (
    <a
      href="#main"
      aria-label="Back to top"
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      }}
      className={`no-print fixed right-5 bottom-[5.25rem] z-40 grid size-12 place-items-center rounded-xl border border-field bg-surface text-ink shadow-md transition-all duration-200 hover:border-accent-600 hover:text-accent-800 sm:right-6 sm:bottom-[5.75rem] ${
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="size-5" />
    </a>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────

const pageOfSection: Record<string, PageKey> = { about: "about", experience: "experience", projects: "projects", services: "skills", contact: "contact" };
const labelFor = (id: string) => pages[pageOfSection[id] ?? "home"].label;

/** Breadcrumb trail shown above a page's main heading. */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-mute">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-field">
                /
              </span>
            )}
            {c.href ? (
              <a href={c.href} className="underline decoration-accent-300 underline-offset-4 hover:text-ink">
                {c.label}
              </a>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * A titled section. `level={1}` makes it the page's main section: its title becomes the h1,
 * a breadcrumb sits above it and it leaves room for the fixed header.
 */
export function Section({
  id,
  title,
  lead,
  children,
  className = "",
  action,
  level = 2,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const pad = level === 1 ? "pt-28 pb-16 md:pt-36 md:pb-24" : "-scroll-mt-10 py-16 md:-scroll-mt-14 md:py-24";
  return (
    // The negative scroll margin cancels part of the top padding, so links to a section land
    // its heading just under the fixed header instead of leaving a large empty gap.
    <section id={id} aria-labelledby={`${id}-title`} className={`${pad} ${className}`}>
      <div className="wrap">
        {level === 1 && (
          <div className="hero-in">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: labelFor(id) }]} />
          </div>
        )}
        <div className={`mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between ${level === 1 ? "hero-in" : ""}`} data-reveal="">
          <div className="max-w-3xl">
            <Heading id={`${id}-title`} className={level === 1 ? "text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.04em]" : "section-title"}>
              {title}
            </Heading>
            {lead && <p className="mt-4 text-base leading-relaxed text-mute md:text-lg">{lead}</p>}
          </div>
          {action}
        </div>
        <div data-reveal="" className={level === 1 ? "hero-in" : undefined} style={{ "--reveal-delay": "120ms", animationDelay: "120ms" } as CSSProperties}>
          {children}
        </div>
      </div>
    </section>
  );
}
