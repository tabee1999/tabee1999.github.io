import { useEffect, useRef } from "react";
import { person, site, stats, testCount } from "../content";
import { motionAllowed } from "../lib/scroll";
import { CopyEmailButton } from "./CopyEmail";
import { HeroBackdrop } from "./HeroBackdrop";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * The hero's signature piece: her highlights written as a passing Playwright run.
 * Each line ticks in once on load (static for reduced motion and without JS it still shows).
 */
function TestRun() {
  const step = 200;
  const first = 350;
  return (
    <div className="rounded-2xl bg-pine text-pine-text shadow-[0_24px_48px_-20px_rgb(8_54_44/0.55)]" data-testid="test-run">
      <p className="border-b border-white/10 px-5 py-3 font-mono text-[0.8rem] text-pine-dim" aria-hidden="true">
        <span className="text-pine-tick">$</span> npx playwright test
      </p>
      <ul aria-label="Highlights" className="space-y-3 px-5 py-4">
        {stats.map((s, i) => (
          <li key={s.label} className="run-line flex gap-3" style={{ animationDelay: `${first + i * step}ms` }}>
            <span className="mt-[0.1rem] font-mono text-[0.95rem] leading-6 font-bold text-pine-tick" aria-hidden="true">
              ✓
            </span>
            <span className="leading-snug">
              <span className="block font-semibold text-white">
                {s.prefix ?? ""}
                {s.value}
                {s.suffix ?? ""} {lowerFirst(s.label)}
              </span>
              <span className="block text-sm text-pine-dim">{s.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 px-5 py-3">
        <p className="run-line font-mono text-[0.8rem] font-bold text-pine-tick" style={{ animationDelay: `${first + stats.length * step}ms` }} aria-hidden="true">
          {stats.length} passed
        </p>
        <a
          href={`/${site.qualityReportPath}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-pine-tick/60 underline-offset-4 hover:decoration-pine-tick"
          data-testid="hero-report"
        >
          Open the live test report
        </a>
      </div>
    </div>
  );
}

/** The facts recruiters check first, in one place near the top. */
function QuickFacts() {
  // On phones only the four facts recruiters filter on show here; the rest are on the
  // contact page and in the FAQ, so the hero stays short.
  const facts = [
    { label: "Roles", value: person.targetRoles.join(", ") },
    { label: "Experience", value: "5+ years, now Senior QA Engineer at Epicmetry", desktopOnly: true },
    { label: "Based in", value: person.location },
    { label: "Work authorisation", value: person.workAuthorisation },
    { label: "Open to", value: person.openTo },
    { label: "Employment", value: person.employment, desktopOnly: true },
    { label: "Languages", value: person.languages, desktopOnly: true },
    { label: "Time zones", value: person.timezones.map((t) => `${t.label} ${t.offset}`).join("; "), desktopOnly: true },
  ];
  return (
    <section aria-labelledby="facts-title" className="wrap relative mt-8 md:mt-10">
      <h2 id="facts-title" className="sr-only">
        Quick facts
      </h2>
      <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-4" data-testid="quick-facts">
        {facts.map((f) => (
          <div key={f.label} className={f.desktopOnly ? "hidden sm:block" : undefined}>
            <dt className="text-sm font-semibold text-mute">{f.label}</dt>
            <dd className="mt-1 leading-snug text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The core stack, first thing recruiters scan for (and the keywords they search). */
const heroTools = ["Playwright", "Selenium", "RestAssured", "Java", "Postman", "API testing", "GitHub Actions", "Jenkins", "JMeter", "SQL", "Jira", "AI-first QA"];

const iconLink =
  "grid size-11 cursor-pointer place-items-center rounded-xl border border-line bg-surface/80 text-mute backdrop-blur-sm transition-colors hover:border-accent-600 hover:text-accent-800";

/**
 * The photo, framed like a visual-regression check: viewfinder corners, a scan line that
 * passes over it, and the results. It tilts towards the pointer.
 */
function PhotoScan() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="photo-tilt relative" data-testid="photo-scan">
      {/* Viewfinder corners */}
      {["top-0 left-0 border-t-2 border-l-2 rounded-tl-xl", "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl"].map((c) => (
        <span key={c} className={`absolute z-10 size-9 border-accent-500 ${c} -m-3`} aria-hidden="true" />
      ))}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-accent-100">
        <picture>
          <source srcSet={`/${person.photo}.webp`} type="image/webp" />
          <img
            src={`/${person.photo}.jpg`}
            alt={person.photoAlt}
            width={480}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/5] w-full object-cover object-top"
          />
        </picture>
        <span className="photo-scan" aria-hidden="true" />
      </div>
      <span className="hero-chip absolute top-[9%] -right-3 sm:-right-8" style={{ animationDelay: "1.5s" }} aria-hidden="true">
        <span className="hero-chip-tick">✓</span> Visual check: 0 px diff
      </span>
      <span className="hero-chip absolute top-[30%] -left-3 sm:-left-10" style={{ animationDelay: "1.9s" }} aria-hidden="true">
        <span className="hero-chip-tick">✓</span> WCAG 2.2 AA: 0 issues
      </span>
    </div>
  );
}

/** The service lines and the companies and products she has tested, as a slow ticker. */
function TestedFor() {
  const names = ["Epicmetry", "Al Rais Travel", "Modon Express", "Fleetify", "Tawla", "Propellus", "Naqdi", "Dastgyr"];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {names.map((n) => (
        <li key={n} className="flex items-center gap-10 pr-10 text-xl font-bold tracking-[-0.01em] whitespace-nowrap text-mute md:text-2xl">
          {n}
          <span className="size-1.5 rotate-45 bg-accent-400" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-labelledby="tested-title" className="relative mt-12 border-y border-line bg-surface/60 py-5 md:mt-14">
      <div className="wrap">
        <h2 id="tested-title" className="text-sm font-semibold text-mute">
          Companies and products I've tested
        </h2>
      </div>
      <div className="marquee mt-4 flex overflow-hidden" data-testid="tested-for">
        <div className="marquee-track flex">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  const [first, ...rest] = person.name.split(" ");
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pb-4 md:pb-6">
      <div className="relative pt-28 md:pt-32">
      <div
        className="pointer-events-none absolute top-[48%] left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(95_194_159/0.30),transparent_62%)] lg:top-[-6%] lg:right-[-8%] lg:left-auto lg:size-[46rem] lg:translate-x-0"
        aria-hidden="true"
      />
      <HeroBackdrop />
      <div className="wrap relative grid items-start gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="lg:pt-6">
          <div className="hero-in flex flex-wrap items-center gap-2" style={{ animationDelay: "0ms" }}>
            <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-accent-200 bg-surface/80 px-4 text-sm font-semibold text-accent-700 backdrop-blur-sm">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="live-dot absolute inset-0 rounded-full bg-accent-500" />
                <span className="relative size-2 rounded-full bg-accent-500" />
              </span>
              {person.available}
            </p>
            <a
              href={`/${site.qualityReportPath}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:border-accent-600"
            >
              <span className="text-accent-600" aria-hidden="true">
                ✓
              </span>
              {testCount} tests passing
            </a>
          </div>

          <h1 id="hero-title" className="mt-6">
            <span className="block text-[clamp(3.6rem,9vw,6.25rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-ink">
              <span className="word-mask">
                <span className="word" style={{ animationDelay: "120ms" }}>
                  {first}
                </span>
              </span>{" "}
              <span className="word-mask">
                <span className="word" style={{ animationDelay: "240ms" }}>
                  {rest.join(" ")}
                </span>
              </span>
            </span>{" "}
            <span className="mt-5 block text-[clamp(1.375rem,2.6vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em] text-accent-700">
              <span className="type-in">{person.role}</span>
            </span>
          </h1>

          <p className="hero-in mt-5 max-w-xl text-lg leading-relaxed text-mute md:text-xl md:leading-relaxed" style={{ animationDelay: "650ms" }}>
            {person.heroLead}
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "800ms" }}>
            <a href={`/${person.cv}`} download className="btn btn-primary btn-glow" data-testid="cta-cv">
              <Icon name="download" className="size-4" /> Download CV
            </a>
            <a href={`mailto:${person.email}`} className="btn btn-ghost" data-testid="cta-email">
              <Icon name="mail" className="size-4" /> Email me
            </a>
            <span className="flex items-center gap-2 sm:ml-1">
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" className={iconLink}>
                <LinkedInIcon className="size-[1.1rem]" />
              </a>
              <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" className={iconLink}>
                <GitHubIcon className="size-[1.1rem]" />
              </a>
              <CopyEmailButton className={iconLink} />
            </span>
          </div>

          <div className="hero-in mt-10 max-w-xl border-t border-line pt-6" style={{ animationDelay: "950ms" }}>
            <h2 className="text-sm font-semibold text-mute">Tools I test with every day</h2>
            <ul className="mt-3 flex flex-wrap gap-2" data-testid="hero-tools">
              {heroTools.map((t) => (
                <li key={t} className="chip !bg-surface/80 !px-3 !py-1 !text-sm font-semibold backdrop-blur-sm">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[24rem] sm:max-w-[25rem] lg:mr-0 lg:ml-auto lg:max-w-[23rem]">
          <PhotoScan />
          <div className="relative z-10 mx-3 -mt-24 sm:mx-6 lg:mx-0 lg:-mt-32 lg:-ml-28 lg:w-[21.5rem]">
            <TestRun />
          </div>
        </div>
      </div>
      </div>

      <TestedFor />
      <QuickFacts />
    </section>
  );
}
