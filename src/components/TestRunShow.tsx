import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { person, site, testCount } from "../content";
import { seg, segment, span, useScrollProgress } from "../lib/scroll";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
type Box = { x: number; y: number; w: number; h: number };
type Screen = "home" | "list" | "contact" | "chat" | "phone";

/**
 * Real tests from this site's suite (tests/*.spec.ts), in the order they "run". Each one
 * shows the page it checks in the mini browser, the element it checks and the assertion.
 */
const run: { file: string; name: string; url: string; screen: Screen; check: string; box: Box }[] = [
  { file: "home.spec.ts", name: "introduces Tabeeda with her role and calls to action", url: "/", screen: "home", check: "toContainText(name)", box: { x: 4, y: 19, w: 50, h: 29 } },
  { file: "navigation.spec.ts", name: "every internal link points to a page that exists", url: "/experience/", screen: "list", check: "200 OK", box: { x: 4, y: 33, w: 92, h: 11 } },
  { file: "contact.spec.ts", name: "shows an error for each empty required field", url: "/contact/", screen: "contact", check: "aria-invalid", box: { x: 4, y: 31, w: 46, h: 58 } },
  { file: "chat.spec.ts", name: "is honest about skills that aren't on her CV", url: "/", screen: "chat", check: "toContainText()", box: { x: 55, y: 60, w: 41, h: 16 } },
  { file: "accessibility.spec.ts", name: "/skills/ has no WCAG 2.2 AA violations", url: "/skills/", screen: "list", check: "axe: 0 violations", box: { x: 2, y: 13, w: 96, h: 84 } },
  { file: "seo.spec.ts", name: "/projects/ has a title, description and canonical", url: "/projects/", screen: "list", check: "toHaveTitle()", box: { x: 4, y: 17, w: 54, h: 11 } },
  { file: "responsive.spec.ts", name: "no sideways scrolling at 360px", url: "/about/", screen: "phone", check: "scrollWidth ≤ 360", box: { x: 34, y: 4, w: 32, h: 92 } },
  { file: "animations.spec.ts", name: "the test run plays as you scroll", url: "/", screen: "home", check: "toBeInViewport()", box: { x: 4, y: 70, w: 92, h: 27 } },
];

const START = 0.08;
const END = 0.88;
/** The point in the scroll where test i passes, and where it starts running. */
const passAt = (i: number) => START + ((END - START) * (i + 1)) / run.length;
const runningFrom = (i: number) => (i === 0 ? START : passAt(i - 1));
const EDGE = 0.012;
/** On screen while test i runs (the last one stays). */
const during = (i: number) =>
  i === 0
    ? `calc(1 - ${seg(passAt(0), passAt(0) + EDGE)})`
    : i === run.length - 1
      ? seg(runningFrom(i), runningFrom(i) + EDGE)
      : span(runningFrom(i), runningFrom(i) + EDGE, passAt(i), passAt(i) + EDGE);
const browsers = [
  { name: "Chrome", end: END - 0.05 },
  { name: "Firefox", end: END },
  { name: "Mobile Chrome", end: END - 0.025 },
];

const centre = (b: Box) => ({ x: b.x + b.w * 0.62, y: b.y + b.h * 0.55 });
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function TestRunShow() {
  const ref = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  const total = parseInt(testCount, 10);

  useScrollProgress(ref, { kind: "pin" }, (p) => {
    if (count.current) {
      const n = Math.round(segment(p, START, END) * total);
      count.current.textContent = n >= total ? testCount : String(n);
    }
    // The cursor glides to each test's element, then clicks it.
    const i = Math.max(0, run.findIndex((_, k) => p < passAt(k)));
    const idx = p >= END ? run.length - 1 : i;
    const t = segment(p, runningFrom(idx), passAt(idx));
    const from = centre(run[Math.max(0, idx - 1)].box);
    const to = centre(run[idx].box);
    const m = ease(segment(t, 0, 0.45));
    if (cursor.current) {
      cursor.current.style.left = `${from.x + (to.x - from.x) * m}%`;
      cursor.current.style.top = `${from.y + (to.y - from.y) * m}%`;
    }
    if (ripple.current) {
      const c = segment(t, 0.45, 0.8);
      ripple.current.style.left = `${to.x}%`;
      ripple.current.style.top = `${to.y}%`;
      ripple.current.style.opacity = String(c > 0 && c < 1 ? 1 - c : 0);
      ripple.current.style.transform = `translate(-50%, -50%) scale(${0.4 + c * 1.6})`;
    }
  });

  return (
    <section ref={ref} id="test-run" aria-labelledby="test-run-title" className="scrolly" style={{ "--runway": "100vh" } as Vars}>
      <div className="scrolly-stage">
        <div className="wrap pt-10 pb-4 md:pt-14 md:pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <h2 id="test-run-title" className="text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.08] font-bold tracking-[-0.03em]">
                Don't take my word for it. Watch the tests run.
              </h2>
              <p className="run-lead mt-3 hidden max-w-xl text-mute sm:block md:text-lg">
                This site is tested like a product. Every change runs {testCount} Playwright tests across three browsers before it goes live.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <p className="flex items-end gap-3 leading-none">
                <span ref={count} className="text-[clamp(2.6rem,5vw,4rem)] font-extrabold tracking-[-0.04em] text-accent-700 tabular-nums" data-testid="run-count">
                  {testCount}
                </span>
                <span className="pb-[0.45em] text-sm font-semibold text-mute">
                  tests
                  <br />
                  passed
                </span>
              </p>
              <ul aria-label="Browsers" className="flex flex-wrap gap-2">
                {browsers.map((b) => (
                  <li key={b.name} className="relative overflow-hidden rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
                    <span
                      className="absolute inset-0 origin-left bg-accent-50"
                      style={{ transform: `scaleX(${seg(START, b.end)})` }}
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center gap-1.5">
                      <span className="text-accent-600" style={{ opacity: seg(b.end - 0.01, b.end) }} aria-hidden="true">
                        ✓
                      </span>
                      {b.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-6 rounded-[1.35rem] bg-[linear-gradient(135deg,rgb(95_211_166/0.7),rgb(8_54_44/0.15)_35%,rgb(8_54_44/0.15)_65%,rgb(95_211_166/0.5))] p-px shadow-[0_40px_80px_-40px_rgb(8_54_44/0.7)] md:mt-8"
            style={{ transform: `scale(calc(0.94 + 0.06 * ${seg(0, START)}))` }}
            data-testid="test-run-panel"
          >
            <div className="grid overflow-hidden rounded-[1.3rem] bg-pine text-pine-text md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <Terminal />
              <MiniBrowser cursor={cursor} ripple={ripple} />
            </div>
          </div>
        </div>
      </div>
      <div className="scrolly-runway" aria-hidden="true" />
    </section>
  );
}

function Terminal() {
  return (
    <div className="relative p-5 font-mono text-[0.74rem] leading-5 md:p-6 md:text-[0.8rem]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(#5fd3a6 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        aria-hidden="true"
      />
      <p className="relative text-pine-dim" aria-hidden="true">
        <span className="text-pine-tick">$</span> npx playwright test <span className="text-white/40">--reporter=list</span>
      </p>
      <ul aria-label="Test run" className="run-list relative mt-3">
        {run.map((t, i) => {
          const done = seg(passAt(i) - 0.02, passAt(i));
          const running = span(runningFrom(i), runningFrom(i) + EDGE, passAt(i) - 0.02, passAt(i));
          return (
            <li key={t.name} className="relative -mx-2 flex gap-3 rounded-md px-2 py-[0.3rem]">
              <span className="absolute inset-0 rounded-md bg-white/[0.07]" style={{ opacity: running }} aria-hidden="true" />
              <span className="relative mt-px w-4 shrink-0 text-center font-bold" aria-hidden="true">
                <span className="absolute inset-0 text-white/30" style={{ opacity: `calc(1 - ${done} - ${running})` }}>
                  ○
                </span>
                <span className="run-spin absolute inset-0 text-pine-tick" style={{ opacity: running }}>
                  ◐
                </span>
                <span className="absolute inset-0 text-pine-tick" style={{ opacity: done }}>
                  ✓
                </span>
              </span>
              <span className="relative" style={{ opacity: `calc(0.45 + 0.55 * max(${done}, ${running}))` }}>
                <span className="hidden text-pine-dim sm:inline">{t.file} › </span>
                <span className="text-white">{t.name}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="relative mt-4 flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#2ea883,#5fd3a6)]" style={{ transform: `scaleX(${seg(START, END)})` }} />
        </div>
        <a
          href={`/${site.qualityReportPath}`}
          className="inline-flex min-h-11 shrink-0 items-center font-sans text-sm font-semibold text-white underline decoration-pine-tick/60 underline-offset-4 hover:decoration-pine-tick"
        >
          Open the full test report
        </a>
      </div>
    </div>
  );
}

/** A small, simplified copy of the site that each test "drives". */
function MiniBrowser({ cursor, ripple }: { cursor: RefObject<HTMLSpanElement | null>; ripple: RefObject<HTMLSpanElement | null> }) {
  const on = (screen: Screen) => {
    const ids = run.map((t, i) => (t.screen === screen ? i : -1)).filter((i) => i >= 0);
    return `max(${ids.map(during).join(", ")})`;
  };
  const block = (b: Box, cls = "bg-line/90") => (
    <span className={`absolute rounded-[0.3em] ${cls}`} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }} />
  );
  const screen = (name: Screen, children: ReactNode) => (
    <div className="absolute inset-0" style={{ opacity: on(name) }}>
      {children}
    </div>
  );

  return (
    <div className="hidden border-l border-white/10 p-5 md:block md:p-6" aria-hidden="true">
      <div className="overflow-hidden rounded-xl bg-paper text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
          <svg viewBox="0 0 16 16" className="size-3 shrink-0 text-accent-600" fill="currentColor">
            <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 6H6V4.5a2 2 0 1 1 4 0Z" />
          </svg>
          <div className="relative h-5 flex-1 font-mono text-[0.66rem] text-mute">
            {run.map((t, i) => (
              <span key={t.name} className="absolute inset-0 truncate leading-5" style={{ opacity: during(i) }}>
                tabee1999.github.io{t.url}
              </span>
            ))}
          </div>
        </div>

        <div className="mini-page relative aspect-[16/10] overflow-hidden text-[clamp(0.5rem,0.75vw,0.68rem)]">
          {/* Header, shared by every page */}
          <span className="absolute top-[3.5%] left-[4%] grid aspect-square w-[5.5%] place-items-center rounded-[0.35em] bg-accent-700 text-[0.8em] font-bold text-white">TS</span>
          {[40, 50, 60, 70].map((x) => block({ x, y: 6, w: 7, h: 2.2 }, "bg-mute/35"))}
          {block({ x: 82, y: 4, w: 14, h: 6 }, "bg-accent-700")}

          {screen(
            "home",
            <>
              <span className="absolute top-[15%] left-[6%] rounded-full border border-accent-200 px-[0.6em] text-[0.8em] font-semibold text-accent-700">Open to new roles</span>
              <span className="absolute top-[22%] left-[6%] text-[2.4em] leading-[0.95] font-extrabold tracking-[-0.04em]">
                Tabeeda
                <br />
                Shakir
              </span>
              <span className="absolute top-[42%] left-[6%] text-[1.05em] font-semibold text-accent-700">{person.role}</span>
              {block({ x: 6, y: 50, w: 44, h: 2.6 }, "bg-mute/25")}
              {block({ x: 6, y: 55, w: 36, h: 2.6 }, "bg-mute/25")}
              {block({ x: 6, y: 60, w: 15, h: 6.5 }, "bg-accent-700")}
              {block({ x: 23, y: 60, w: 13, h: 6.5 }, "border border-field bg-surface")}
              <img
                src={`/${person.avatar}.jpg`}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute top-[14%] right-[6%] h-[52%] w-[30%] rounded-[0.6em] object-cover object-top"
              />
              {[6, 36, 66].map((x) => block({ x, y: 72, w: 28, h: 23 }, "bg-surface border border-line"))}
            </>,
          )}

          {screen(
            "list",
            <>
              {block({ x: 6, y: 15, w: 18, h: 2 }, "bg-mute/30")}
              <span className="absolute top-[19%] left-[6%] text-[1.6em] font-extrabold tracking-[-0.03em]">5+ years of QA</span>
              {[35, 48, 61, 74, 87].map((y) => (
                <span key={y}>
                  <span className="absolute left-[6%] size-[2.2%] rounded-full bg-accent-600" style={{ top: `${y + 2}%` }} />
                  {block({ x: 11, y, w: 30, h: 3.2 }, "bg-ink/25")}
                  {block({ x: 11, y: y + 5, w: 62, h: 2.4 }, "bg-mute/20")}
                </span>
              ))}
            </>,
          )}

          {screen(
            "contact",
            <>
              <span className="absolute top-[17%] left-[6%] text-[1.6em] leading-tight font-extrabold tracking-[-0.03em]">Let's work together</span>
              {[33, 51, 69].map((y, k) => (
                <span key={y}>
                  {block({ x: 6, y, w: 42, h: k === 2 ? 10 : 8 }, "border-2 border-rose-600 bg-surface")}
                  <span className="absolute left-[6%] text-[0.78em] font-semibold text-rose-700" style={{ top: `${y + (k === 2 ? 10.5 : 8.5)}%` }}>
                    {["Please enter your name", "Please enter your email address", "Please write at least 20 characters"][k]}
                  </span>
                </span>
              ))}
              {[35, 47, 59].map((y) => block({ x: 55, y, w: 39, h: 9 }, "bg-surface border border-line"))}
            </>,
          )}

          {screen(
            "chat",
            <>
              <span className="absolute top-[25%] left-[6%] text-[2.4em] leading-[0.95] font-extrabold tracking-[-0.04em] text-ink/30">
                Tabeeda
                <br />
                Shakir
              </span>
              <div className="absolute right-[4%] bottom-[5%] h-[62%] w-[42%] overflow-hidden rounded-[0.8em] border border-line bg-surface shadow-lg">
                <div className="bg-paper px-[6%] py-[4%] text-[0.85em] font-bold">Ask about Tabeeda</div>
                <p className="mt-[6%] mr-[6%] ml-auto w-fit rounded-[0.7em] bg-accent-700 px-[0.7em] py-[0.35em] text-[0.85em] text-white">Does she know Cypress?</p>
                <p className="mt-[6%] ml-[6%] w-[82%] rounded-[0.7em] bg-paper px-[0.7em] py-[0.35em] text-[0.85em] leading-snug">
                  Cypress isn't on her CV. Her closest experience is Playwright and Selenium.
                </p>
              </div>
            </>,
          )}

          {screen(
            "phone",
            <>
              <div className="absolute top-[4%] left-[35%] h-[92%] w-[30%] overflow-hidden rounded-[1em] border-[0.35em] border-ink bg-paper">
                <span className="absolute top-[8%] left-[10%] text-[1.15em] leading-[0.95] font-extrabold tracking-[-0.03em]">
                  Tabeeda
                  <br />
                  Shakir
                </span>
                {block({ x: 10, y: 30, w: 70, h: 3 }, "bg-mute/25")}
                {block({ x: 10, y: 36, w: 55, h: 3 }, "bg-mute/25")}
                {block({ x: 10, y: 44, w: 50, h: 7 }, "bg-accent-700")}
                <img
                  src={`/${person.avatar}.jpg`}
                  alt=""
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="absolute top-[56%] left-[10%] h-[38%] w-[80%] rounded-[0.5em] object-cover object-top"
                />
              </div>
            </>,
          )}

          {/* What each test checks */}
          {run.map((t, i) => (
            <span key={t.name} style={{ opacity: during(i) }}>
              <span
                className="absolute rounded-[0.5em] border-2 border-accent-500 bg-accent-500/10 shadow-[0_0_0_4px_rgb(46_168_131/0.15)]"
                style={{ left: `${t.box.x}%`, top: `${t.box.y}%`, width: `${t.box.w}%`, height: `${t.box.h}%` }}
              />
              <span
                className="absolute rounded-[0.4em] bg-ink px-[0.6em] py-[0.2em] font-mono text-[0.82em] whitespace-nowrap text-pine-tick"
                style={{ left: `${Math.min(t.box.x, 62)}%`, top: t.box.y + t.box.h > 88 ? `calc(${t.box.y}% - 1.7em)` : `calc(${t.box.y + t.box.h}% + 0.35em)` }}
              >
                ✓ {t.check}
              </span>
            </span>
          ))}

          {/* The cursor and its click */}
          <span ref={ripple} className="absolute size-[9%] rounded-full border-2 border-accent-500 opacity-0" />
          <span ref={cursor} className="absolute z-10" style={{ left: `${centre(run[run.length - 1].box).x}%`, top: `${centre(run[run.length - 1].box).y}%` }}>
            <svg viewBox="0 0 16 16" className="size-[1.6em] drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)]">
              <path d="M2 1l11 7-5 1-2 5z" fill="#0f2e2a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
