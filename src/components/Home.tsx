import { useRef, type CSSProperties, type RefObject } from "react";
import { experience, pages, person, process, projects, caseStudies } from "../content";
import { seg, segment, span, useScrollProgress } from "../lib/scroll";
import { Icon } from "./Icon";
import { ProjectVisual } from "./Projects";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

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
      style={{ "--runway": "190vh" } as Vars}
    >
      <div className="scrolly-stage">
        <div className="wrap grid items-center gap-6 py-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
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
      <div className="scrolly-runway" aria-hidden="true" />
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

// ── Featured projects ─────────────────────────────────────────────────────

const featured = ["al-rais-travel", "visa-platform", "trading-platforms"];

export function FeaturedProjects() {
  const picks = featured.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);
  return (
    <section id="featured" aria-labelledby="featured-title" className="pt-14 pb-6 md:pt-20 md:pb-8">
      <div className="wrap">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal="">
          <div className="max-w-2xl">
            <h2 id="featured-title" className="section-title">
              QA work across travel, AI and fintech
            </h2>
            <p className="mt-4 text-mute md:text-lg">
              Test automation, API testing and manual QA for products used by travellers, drivers, traders and visa applicants across the GCC and beyond.
            </p>
          </div>
          <a href={pages.projects.path} className="btn btn-ghost btn-sm self-start md:self-auto">
            See all {projects.length} projects
          </a>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {picks.map((p, i) => (
            <li key={p.slug} data-reveal="" style={{ "--reveal-delay": `${i * 110}ms` } as Vars}>
              <a href={pages.projects.path} className="card group flex h-full flex-col p-3 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent-400 hover:shadow-[0_18px_40px_-24px_rgb(8_54_44/0.45)]">
                <ProjectVisual kind={p.visual} />
                <span className="flex flex-1 flex-col px-3 pt-5 pb-3">
                  <span className="text-sm font-semibold text-accent-700">
                    {p.company}
                    <span className="font-normal text-mute">, {p.domain}</span>
                  </span>
                  <span className="mt-1 text-xl font-bold tracking-[-0.01em] text-ink group-hover:text-accent-800">{p.name}</span>
                  <span className="mt-2 leading-relaxed text-mute">{p.summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
    <section id="explore" aria-labelledby="explore-title" className="py-12 md:py-16">
      <div className="wrap">
        <h2 id="explore-title" className="section-title" data-reveal="">
          Explore my work
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <li key={c.page.path} data-reveal="" style={{ "--reveal-delay": `${i * 90}ms` } as Vars}>
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

        <div className="mt-14 flex flex-col gap-6 rounded-[1.25rem] bg-pine p-7 text-pine-text md:flex-row md:items-center md:justify-between md:p-10" data-reveal="">
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
