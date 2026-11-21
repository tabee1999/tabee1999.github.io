import { useRef, type CSSProperties, type RefObject } from "react";
import { experience, pages, person, process, projects, caseStudies, site, testCount } from "../content";
import { seg, segment, span, useScrollProgress } from "../lib/scroll";
import { Icon } from "./Icon";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// ── The test run (plays as you scroll) ────────────────────────────────────

/** Real tests from this site's suite (tests/*.spec.ts), in the order they "run". */
const run = [
  { file: "home.spec.ts", name: "introduces Tabeeda with her role and calls to action", url: "/", check: "toContainText()", box: [6, 18, 58, 13] },
  { file: "navigation.spec.ts", name: "every internal link points to a page that exists", url: "/experience/", check: "200 OK", box: [52, 4, 42, 8] },
  { file: "contact.spec.ts", name: "shows an error for each empty required field", url: "/contact/", check: "aria-invalid", box: [6, 50, 40, 11] },
  { file: "chat.spec.ts", name: "is honest about skills that aren't on her CV", url: "/", check: "toContainText()", box: [56, 50, 38, 11] },
  { file: "accessibility.spec.ts", name: "/skills/ has no WCAG 2.2 AA violations", url: "/skills/", check: "0 violations", box: [4, 66, 92, 28] },
  { file: "seo.spec.ts", name: "/projects/ has a title, description and canonical", url: "/projects/", check: "toHaveTitle()", box: [6, 18, 58, 13] },
  { file: "responsive.spec.ts", name: "no sideways scrolling at 360px", url: "/about/", check: "no overflow", box: [2, 2, 96, 96] },
  { file: "animations.spec.ts", name: "the test run plays as you scroll", url: "/", check: "toBeInViewport()", box: [6, 66, 28, 28] },
] as const;

const START = 0.1;
const END = 0.86;
/** The point in the scroll where test i passes. */
const passAt = (i: number) => START + ((END - START) * (i + 1)) / run.length;
const runningFrom = (i: number) => (i === 0 ? START - 0.04 : passAt(i - 1));

export function TestRunShow() {
  const ref = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const total = parseInt(testCount, 10);

  useScrollProgress(ref, { kind: "pin" }, (p) => {
    if (!count.current) return;
    const n = Math.round(segment(p, START, END) * total);
    count.current.textContent = n >= total ? testCount : String(n);
  });

  return (
    <section ref={ref} id="test-run" aria-labelledby="test-run-title" className="scrolly" style={{ "--pin": "240vh" } as Vars}>
      <div className="scrolly-stage">
        <div className="wrap py-8 md:py-12">
          <div className="max-w-2xl">
            <h2 id="test-run-title" className="section-title">
              Don't take my word for it. Watch the tests run.
            </h2>
            <p className="mt-4 hidden text-mute sm:block md:text-lg">
              This site is tested like a product: {testCount} Playwright tests check every page in Chrome, Firefox and mobile Chrome on every change.
            </p>
          </div>

          <div
            className="mt-8 origin-top overflow-hidden rounded-2xl bg-pine text-pine-text shadow-[0_30px_60px_-30px_rgb(8_54_44/0.6)] md:mt-10"
            style={{ transform: `scale(calc(0.93 + 0.07 * ${seg(0, START)}))` }}
            data-testid="test-run-panel"
          >
            <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="p-5 font-mono text-[0.75rem] leading-5 md:p-7 md:text-[0.82rem] md:leading-6">
                <p className="text-pine-dim" aria-hidden="true">
                  <span className="text-pine-tick">$</span> npx playwright test
                </p>
                <ul aria-label="Test run" className="mt-4 space-y-2.5">
                  {run.map((t, i) => {
                    const done = seg(passAt(i) - 0.025, passAt(i));
                    return (
                      <li key={t.name} className="flex gap-3">
                        <span className="relative mt-px w-4 shrink-0 font-bold" aria-hidden="true">
                          <span className="absolute inset-0 text-pine-dim" style={{ opacity: `calc(1 - ${done})` }}>
                            ○
                          </span>
                          <span className="absolute inset-0 text-pine-tick" style={{ opacity: done }}>
                            ✓
                          </span>
                        </span>
                        <span style={{ opacity: `calc(0.42 + 0.58 * ${done})` }}>
                          <span className="hidden text-pine-dim sm:inline">{t.file} › </span>
                          <span className="text-white">{t.name}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <div className="h-full origin-left rounded-full bg-pine-tick" style={{ transform: `scaleX(${seg(START, END)})` }} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="font-bold text-pine-tick">
                    <span ref={count}>{testCount}</span> passed
                  </p>
                  <a
                    href={`/${site.qualityReportPath}`}
                    className="inline-flex min-h-11 items-center font-sans text-sm font-semibold text-white underline decoration-pine-tick/60 underline-offset-4 hover:decoration-pine-tick"
                  >
                    Open the full test report
                  </a>
                </div>
              </div>

              <BrowserMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A schematic browser that "follows" each test: address, element under test and assertion. */
function BrowserMock() {
  const blocks = [
    [4, 4, 30, 6],
    [52, 4, 42, 6],
    [6, 19, 56, 10],
    [6, 34, 80, 3],
    [6, 40, 70, 3],
    [6, 51, 38, 8],
    [56, 51, 36, 8],
    [6, 67, 27, 26],
    [37, 67, 27, 26],
    [68, 67, 27, 26],
  ];
  const showFor = (i: number) => (i === run.length - 1 ? seg(runningFrom(i), runningFrom(i) + 0.02) : span(runningFrom(i), runningFrom(i) + 0.02, passAt(i), passAt(i) + 0.02));

  return (
    <div className="hidden border-l border-white/10 p-6 md:block" aria-hidden="true">
      <div className="overflow-hidden rounded-xl bg-paper text-ink">
        <div className="border-b border-line bg-surface px-3 py-2">
          <div className="relative h-6 rounded-md bg-paper font-mono text-[0.68rem] text-mute">
            {run.map((t, i) => (
              <span key={t.name} className="absolute inset-0 truncate px-3 leading-6" style={{ opacity: showFor(i) }}>
                tabee1999.github.io{t.url}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3]">
          {blocks.map(([x, y, w, h], i) => (
            <span key={i} className="absolute rounded-md bg-line/80" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
          ))}
          {run.map((t, i) => {
            const [x, y, w, h] = t.box;
            return (
              <span key={t.name} style={{ opacity: showFor(i) }}>
                <span
                  className="absolute rounded-md border-2 border-accent-500 bg-accent-500/10"
                  style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
                />
                <span
                  className="absolute rounded-md bg-accent-700 px-2 py-0.5 font-mono text-[0.62rem] whitespace-nowrap text-white"
                  style={{ left: `${Math.min(x, 70)}%`, top: `calc(${y + h}% + 4px)` }}
                >
                  {t.check}
                </span>
                <svg
                  className="absolute size-4 drop-shadow"
                  viewBox="0 0 16 16"
                  style={{ left: `calc(${x + w * 0.7}% )`, top: `calc(${y + h * 0.6}%)` }}
                >
                  <path d="M2 1l11 7-5 1-2 5z" fill="#0f2e2a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── How I work: a phone being tested ─────────────────────────────────────

const STEP = 1 / process.length;
/** How "on" step i is: fades in as its quarter of the scroll starts and out as it ends. */
const stepOn = (i: number) => {
  const a = i * STEP;
  const b = (i + 1) * STEP;
  if (i === 0) return `calc(1 - ${seg(b - 0.015, b + 0.015)})`;
  if (i === process.length - 1) return seg(a - 0.015, a + 0.015);
  return span(a - 0.015, a + 0.015, b - 0.015, b + 0.015);
};

export function HowIWork() {
  const ref = useRef<HTMLElement>(null);
  const route = useRef<SVGPathElement>(null);
  const driver = useRef<SVGGElement>(null);

  useScrollProgress(ref, { kind: "pin" }, (p) => {
    const path = route.current;
    if (!path || !driver.current) return;
    const at = path.getPointAtLength(path.getTotalLength() * segment(p, 0.02, 0.95));
    driver.current.setAttribute("transform", `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);
  });

  return (
    <section
      ref={ref}
      id="how-i-work"
      aria-labelledby="how-title"
      className="scrolly overflow-x-clip border-y border-line bg-surface"
      style={{ "--pin": "320vh" } as Vars}
    >
      <div className="scrolly-stage">
        <div className="wrap grid items-center gap-6 py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="how-title" className="section-title">
              How I work
            </h2>
            <p className="mt-4 hidden max-w-md text-mute sm:block md:text-lg">The same four steps on every release. Scroll to watch them on a delivery app.</p>
            <ol className="steps mt-5 space-y-6 sm:mt-8 lg:mt-10">
              {process.map((s, i) => (
                <li key={s.title} className="step relative pl-6" style={{ "--w": stepOn(i) } as Vars}>
                  <span className="absolute top-1 bottom-1 left-0 w-[3px] overflow-hidden rounded-full bg-line" aria-hidden="true">
                    <span className="block h-full origin-top rounded-full bg-accent-600" style={{ transform: `scaleY(${seg(i * STEP, (i + 1) * STEP)})` }} />
                  </span>
                  <h3 className="text-lg font-bold text-ink md:text-xl">
                    <span className="text-accent-700 tabular-nums">{i + 1}.</span> {s.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-mute">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <Phone route={route} driver={driver} />
        </div>
      </div>
    </section>
  );
}

/** Appears between a and a + 0.03, then is replaced (fades out) between f and f + 0.03. */
const marker = (a: number, f: number) => span(a, a + 0.03, f, f + 0.03);

const bugs = [
  { label: "GPS jump", x: 63, y: 36, at: 0.33, fix: 0.55 },
  { label: "Text cut off", x: 74, y: 10.5, at: 0.39, fix: 0.61 },
  { label: "Double order", x: 50, y: 88, at: 0.45, fix: 0.67 },
];

const chips = [
  { label: "API tests passing", side: "left", y: 24, at: 0.55 },
  { label: "UI tests passing", side: "right", y: 46, at: 0.61 },
  { label: "CI green", side: "left", y: 68, at: 0.67 },
] as const;

function Phone({ route, driver }: { route: RefObject<SVGPathElement | null>; driver: RefObject<SVGGElement | null> }) {
  const tilt = `calc(1 - ${seg(0, 0.22)})`;
  const release = seg(0.78, 0.98);
  return (
    <div className="relative mx-auto grid place-items-center py-4 [perspective:1400px]" aria-hidden="true" data-testid="phone">
      <div
        className="phone"
        style={{
          transform: `rotateY(calc(-28deg * ${tilt} + 14deg * ${release})) rotateX(calc(14deg * ${tilt})) rotateZ(calc(-5deg * ${tilt} + 2deg * ${release}))`,
        }}
      >
        <div className="phone-screen">
          {/* Status bar and dynamic island */}
          <div className="flex items-center justify-between px-[8%] pt-[4.5%] text-[0.85em] font-semibold text-ink">
            <span>9:41</span>
            <span className="h-[1.6em] w-[30%] rounded-full bg-ink" />
            <span className="tracking-tight">5G</span>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-[7%] pt-[6%]">
            <div>
              <p className="text-[0.85em] text-mute">Today's route</p>
              <p className="text-[1.45em] leading-tight font-bold text-ink">12 stops</p>
            </div>
            <span className="rounded-full bg-accent-50 px-[0.8em] py-[0.3em] text-[0.85em] font-semibold text-accent-700">On time</span>
          </div>

          {/* Map */}
          <div className="relative mx-[5%] mt-[5%] aspect-[4/3.4] overflow-hidden rounded-[1.2em] bg-accent-50">
            <svg viewBox="0 0 200 170" className="absolute inset-0 size-full">
              <g stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none">
                <path d="M-10 40 H210 M-10 110 H210 M40 -10 V180 M120 -10 V180 M170 -10 V180" />
                <path d="M-10 160 L90 70 L210 20" />
              </g>
              <path
                ref={route}
                d="M22 150 C 40 140 50 116 66 108 S 108 104 120 84 S 132 50 152 44 S 176 30 184 20"
                fill="none"
                stroke="#5fc29f"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="0.015 0.02"
                pathLength="1"
                opacity="0.35"
              />
              <path
                d="M22 150 C 40 140 50 116 66 108 S 108 104 120 84 S 132 50 152 44 S 176 30 184 20"
                fill="none"
                stroke="#0d7559"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                style={{ strokeDashoffset: `calc(1 - ${seg(0.02, 0.95)})` }}
              />
              <circle cx="184" cy="20" r="7" fill="#0b5f4a" />
              <circle cx="184" cy="20" r="3" fill="#fff" />
              <g ref={driver} transform="translate(184 20)">
                <circle r="10" fill="#138d6c" opacity="0.25" />
                <circle r="5.5" fill="#0b5f4a" stroke="#fff" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Order card */}
          <div className="absolute inset-x-[5%] bottom-[4%] rounded-[1.1em] bg-surface p-[5%] shadow-[0_6px_20px_-8px_rgb(8_54_44/0.35)]">
            <p className="text-[0.85em] text-mute">Order #2417</p>
            <p className="text-[1.1em] font-bold text-ink">3 items, cash on delivery</p>
            <div className="mt-[6%] rounded-[0.8em] bg-accent-700 py-[0.75em] text-center text-[0.95em] font-semibold text-white">Confirm delivery</div>
          </div>

          {/* 1. Risk areas */}
          <div style={{ opacity: span(0.05, 0.09, 0.23, 0.27) }}>
            <div className="absolute inset-x-[3%] top-[23%] h-[37%] rounded-[1.3em] border-2 border-dashed border-accent-500">
              <span className="absolute -top-[0.9em] left-[6%] rounded-full bg-accent-700 px-[0.7em] py-[0.15em] text-[0.8em] font-semibold text-white">Risk: location</span>
            </div>
            <div className="absolute inset-x-[3%] bottom-[2.5%] h-[20%] rounded-[1.3em] border-2 border-dashed border-accent-500">
              <span className="absolute -top-[0.9em] left-[6%] rounded-full bg-accent-700 px-[0.7em] py-[0.15em] text-[0.8em] font-semibold text-white">Risk: payment</span>
            </div>
          </div>

          {/* 2. Scan line */}
          <div
            className="absolute inset-x-0 h-[2px] bg-accent-400 shadow-[0_0_14px_4px_rgb(46_168_131/0.55)]"
            style={{ top: `calc(${seg(0.27, 0.48)} * 100%)`, opacity: span(0.26, 0.28, 0.47, 0.5) }}
          />

          {/* 2–3. Bugs found, then fixed */}
          {bugs.map((b) => (
            <div key={b.label} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ opacity: marker(b.at, b.fix), transform: `translate(-50%, -50%) scale(calc(0.6 + 0.4 * ${seg(b.at, b.at + 0.03)}))` }}>
                <span className="flex items-center gap-[0.35em] rounded-full bg-rose-700 py-[0.25em] pr-[0.7em] pl-[0.3em] text-[0.8em] font-semibold whitespace-nowrap text-white shadow-md">
                  <span className="grid size-[1.4em] place-items-center rounded-full bg-white text-rose-700">!</span>
                  <span>{b.label}</span>
                </span>
              </div>
              <div
                className="absolute"
                style={{ opacity: seg(b.fix, b.fix + 0.03), transform: `translate(-50%, -50%) scale(calc(0.6 + 0.4 * ${seg(b.fix, b.fix + 0.03)}))` }}
              >
                <span className="grid size-[1.9em] place-items-center rounded-full bg-accent-600 font-bold text-white shadow-md">✓</span>
              </div>
            </div>
          ))}

          {/* 4. Release */}
          <div
            className="absolute inset-x-[5%] top-[10%] flex items-center gap-[0.6em] rounded-[1em] bg-ink px-[0.9em] py-[0.8em] text-[0.95em] font-semibold text-white shadow-lg"
            style={{ opacity: seg(0.8, 0.85), transform: `translateY(calc((1 - ${seg(0.8, 0.85)}) * -1.5em))` }}
          >
            <span className="grid size-[1.6em] shrink-0 place-items-center rounded-full bg-pine-tick text-ink">✓</span>
            All checks passed. Ready to release.
          </div>

          {/* Glass reflection that slides as the phone turns */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.32)_47%,transparent_60%)] bg-[length:260%_100%]"
            style={{ backgroundPosition: `calc(100% - ${seg(0, 1)} * 100%) 0` }}
          />
        </div>
      </div>

      {/* 3. Automation results float out of the phone */}
      {chips.map((c) => (
        <span
          key={c.label}
          className={`absolute flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold whitespace-nowrap text-ink shadow-[0_10px_24px_-12px_rgb(8_54_44/0.45)] sm:text-sm ${
            c.side === "left" ? "left-[-24%] lg:left-[-38%]" : "right-[-24%] lg:right-[-38%]"
          }`}
          style={{
            top: `${c.y}%`,
            opacity: seg(c.at, c.at + 0.04),
            transform: `translateX(calc((1 - ${seg(c.at, c.at + 0.04)}) * ${c.side === "left" ? 2.5 : -2.5}rem))`,
          }}
        >
          <span className="grid size-5 place-items-center rounded-full bg-accent-600 text-[0.7rem] text-white">✓</span>
          {c.label}
        </span>
      ))}

      {/* 4. Released stamp */}
      <span
        className="absolute top-[4%] right-[-22%] rounded-xl border-2 border-accent-600 bg-surface px-3 py-1.5 text-sm font-bold whitespace-nowrap text-accent-700 shadow-md lg:right-[-36%]"
        style={{ opacity: seg(0.86, 0.92), transform: `rotate(-8deg) scale(calc(1.35 - 0.35 * ${seg(0.86, 0.92)}))` }}
      >
        Released v2.4
      </span>

      {/* Floor shadow */}
      <span className="absolute bottom-0 left-1/2 h-6 w-[55%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />
    </div>
  );
}

// ── Explore and hire ──────────────────────────────────────────────────────

export function Explore() {
  const cards = [
    { page: pages.experience, text: `${experience.length} roles since 2021, now ${experience[0].role} at ${experience[0].company}.`, icon: "layers" },
    { page: pages.projects, text: `${projects.length} products tested and ${caseStudies.length} case studies on how I solved real QA problems.`, icon: "rocket" },
    { page: pages.skills, text: "Automation, API, mobile and AI-first QA. Paste a job description to check my fit.", icon: "automation" },
    { page: pages.about, text: "My story, my education and the teams I've shipped products with.", icon: "sparkles" },
  ];
  return (
    <section id="explore" aria-labelledby="explore-title" className="py-16 md:py-24">
      <div className="wrap">
        <h2 id="explore-title" className="section-title">
          Explore my work
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <li key={c.page.path}>
              <a
                href={c.page.path}
                className="card group flex h-full items-start gap-4 p-6 transition-colors hover:border-accent-400 focus-visible:border-accent-600 md:p-7"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-700">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span>
                  <span className="block text-xl font-bold text-ink group-hover:text-accent-800">{c.page.label}</span>
                  <span className="mt-1 block leading-relaxed text-mute">{c.text}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-6 rounded-[1.25rem] bg-pine p-7 text-pine-text md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-2xl font-bold tracking-[-0.015em] text-white md:text-3xl">Hiring a QA engineer?</p>
            <p className="mt-2 max-w-xl text-pine-dim">
              {person.available}. {person.openTo}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={pages.contact.path} className="btn bg-pine-tick text-ink hover:bg-white">
              Contact me
            </a>
            <a href={`/${person.cv}`} download className="btn border-white/30 text-white hover:border-white">
              <Icon name="download" className="size-4" /> Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
