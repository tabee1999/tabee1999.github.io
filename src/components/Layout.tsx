import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { nav, person, site } from "../content";
import { useScrolled, useScrollProgressBar, useScrollSpy } from "../lib/hooks";
import { Clocks } from "./Clocks";
import { MotionToggle } from "./MotionToggle";
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
        className={`no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-night-800/95 px-5 py-3 text-sm font-semibold text-ink shadow-2xl backdrop-blur transition-all duration-300 ${
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

export function Logo({ root }: { root: string }) {
  return (
    <a href={root === "" ? "#top" : root} className="group flex items-center gap-3 rounded-xl">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-base font-extrabold tracking-tight text-white shadow-lg shadow-brand-700/40 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        {person.initials}
      </span>
      <span className="leading-tight">
        <span className="block text-[0.95rem] font-bold text-ink">{person.name}</span>
        <span className="block text-xs text-mute">{person.role}</span>
      </span>
    </a>
  );
}

const navIds = nav.map((n) => n.id);
const noIds: string[] = [];

export function Header({ root }: { root: string }) {
  const scrolled = useScrolled();
  const progressBar = useScrollProgressBar<HTMLDivElement>();
  const active = useScrollSpy(root === "" ? navIds : noIds);
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

  const href = (id: string) => `${root}#${id}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open ? "border-b border-line bg-night-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div
        ref={progressBar}
        className="no-print absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-400"
        aria-hidden="true"
        data-testid="scroll-progress"
      />
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Logo root={root} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={href(n.id)}
                  data-section={n.id}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-ink ${
                    active === n.id ? "text-ink" : "text-mute"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-400 transition-transform duration-300 ${
                      active === n.id ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={href("contact")} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Let's connect <Icon name="arrowRight" className="arrow size-4" />
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
            {nav.map((n, i) => (
              <li key={n.id} className={open ? "animate-rise" : ""} style={{ animationDelay: `${i * 40}ms` }}>
                <a
                  href={href(n.id)}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-semibold text-ink hover:bg-white/5"
                >
                  {n.label}
                  <Icon name="arrowRight" className="size-4 text-brand-300" />
                </a>
              </li>
            ))}
          </ul>
          <a href={href("contact")} onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">
            Let's connect <Icon name="arrowRight" className="arrow size-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────

export function Footer({ root, year }: { root: string; year: number }) {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo root={root} />
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Senior QA Engineer, SDET and QA Automation: manual, automated and AI-first testing. Based in Pakistan and Cyprus, working remotely from anywhere.
          </p>
          <p className="flex items-center gap-2 text-sm text-mute">
            <Icon name="clock" className="size-4 shrink-0 text-brand-300" />
            <Clocks />
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-semibold text-ink">Explore</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`${root}#${n.id}`} className="text-mute transition-colors hover:text-ink">
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
              <a href={`${root}${person.cv}`} download className="inline-flex items-center gap-2 text-mute hover:text-ink">
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
            <a href={`${root}${site.qualityReportPath}`} className="underline decoration-brand-400/50 underline-offset-4 hover:text-ink" data-testid="quality-report">
              Allure report
            </a>
            <MotionToggle />
            <a href={`${root}${site.playwrightReportPath}`} className="underline decoration-brand-400/50 underline-offset-4 hover:text-ink">
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
      href="#top"
      aria-label="Back to top"
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      }}
      className={`no-print fixed right-5 bottom-[5.25rem] z-40 grid size-12 sm:right-6 sm:bottom-[5.75rem] place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-xl shadow-brand-700/40 transition-all duration-300 hover:scale-110 active:scale-95 ${
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="size-5" />
    </a>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
  action,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    // The negative scroll margin cancels part of the top padding, so menu links land the
    // heading just under the fixed header instead of leaving a large empty gap.
    <section id={id} aria-labelledby={`${id}-title`} className={`-scroll-mt-10 py-16 md:-scroll-mt-14 md:py-24 ${className}`}>
      <div className="wrap">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={`${id}-title`} className="section-title">
              {title}
            </h2>
            {lead && <p className="text-base leading-relaxed text-mute md:text-lg">{lead}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
