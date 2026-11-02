import { useEffect, useRef, useState } from "react";
import { caseStudies, categories, projects, type Category, type Project } from "../content";
import { Reveal, trackSpotlight } from "../lib/motion";
import { Icon } from "./Icon";
import { Section } from "./Layout";

/** Which case study tells the longer story behind each project. */
const projectCaseStudy: Record<string, string> = {
  "al-rais-travel": "regression-automation-three-products",
  "modon-express": "regression-automation-three-products",
  "portfolio-ai-assistant": "testing-an-ai-chat-assistant",
  "visa-platform": "qa-from-scratch-at-a-startup",
  "b2b-marketplace": "b2b-marketplace-and-logistics-apps",
};

const visualIcon: Record<Project["visual"], string> = {
  travel: "plane",
  payments: "card",
  fleet: "truck",
  visa: "passport",
  trading: "candles",
  marketplace: "store",
  assistant: "chat",
};

/** A small drawn preview for each project card, so the grid isn't just text. */
function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-night-700 via-night-800 to-night-900" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgb(167 139 250 / 0.25) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-brand-500/25 blur-2xl transition-transform duration-500 group-hover:scale-125" />
      <svg viewBox="0 0 320 144" className="absolute inset-0 size-full" fill="none">
        {kind === "travel" && (
          <>
            <path d="M40 112 C 110 20, 210 20, 280 100" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 7" className="draw-path" />
            <circle cx="40" cy="112" r="6" fill="#c4b5fd" />
            <circle cx="280" cy="100" r="6" fill="#8b5cf6" />
            <rect x="196" y="20" width="96" height="30" rx="8" fill="rgb(255 255 255 / 0.06)" stroke="rgb(196 181 253 / 0.3)" />
            <text x="208" y="40" fill="#ddd6fe" fontSize="11" fontFamily="monospace">DXB → LHR</text>
          </>
        )}
        {kind === "payments" && (
          <>
            <rect x="40" y="30" width="130" height="82" rx="12" fill="url(#cardGrad)" />
            <rect x="54" y="46" width="22" height="16" rx="3" fill="#fde68a" opacity="0.8" />
            <rect x="54" y="88" width="80" height="6" rx="3" fill="#fff" opacity="0.5" />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(196 ${34 + i * 28})`}>
                <rect width="96" height="20" rx="10" fill="rgb(255 255 255 / 0.06)" stroke="rgb(196 181 253 / 0.25)" />
                <circle cx="12" cy="10" r="5" fill="#4ade80" />
                <rect x="24" y="7" width={52 - i * 8} height="6" rx="3" fill="#aaa6cc" />
              </g>
            ))}
            <defs>
              <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#4338ca" />
              </linearGradient>
            </defs>
          </>
        )}
        {kind === "fleet" && (
          <>
            <path d="M30 110 L 90 70 L 150 92 L 220 40 L 290 60" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" className="draw-path" />
            {[
              [30, 110],
              [90, 70],
              [150, 92],
              [220, 40],
              [290, 60],
            ].map(([x, y]) => (
              <circle key={`${x}`} cx={x} cy={y} r="5" fill="#0c0a24" stroke="#c4b5fd" strokeWidth="2" />
            ))}
            <rect x="196" y="92" width="96" height="30" rx="8" fill="rgb(255 255 255 / 0.06)" stroke="rgb(196 181 253 / 0.3)" />
            <text x="208" y="112" fill="#4ade80" fontSize="11" fontFamily="monospace">load test ✓</text>
          </>
        )}
        {kind === "visa" && (
          <>
            <rect x="44" y="22" width="84" height="104" rx="10" fill="rgb(255 255 255 / 0.06)" stroke="rgb(196 181 253 / 0.35)" />
            <circle cx="86" cy="62" r="18" stroke="#c4b5fd" strokeWidth="2" />
            <rect x="62" y="96" width="48" height="6" rx="3" fill="#aaa6cc" />
            <rect x="156" y="32" width="128" height="22" rx="11" fill="rgb(139 92 246 / 0.25)" />
            <text x="168" y="47" fill="#ddd6fe" fontSize="11" fontFamily="monospace">AI check ✓</text>
            <rect x="156" y="66" width="104" height="8" rx="4" fill="#aaa6cc" opacity="0.5" />
            <rect x="156" y="84" width="84" height="8" rx="4" fill="#aaa6cc" opacity="0.35" />
            <rect x="156" y="102" width="116" height="8" rx="4" fill="#aaa6cc" opacity="0.25" />
          </>
        )}
        {kind === "trading" && (
          <>
            {[
              [50, 60, 40, "#4ade80"],
              [80, 50, 36, "#4ade80"],
              [110, 70, 30, "#f87171"],
              [140, 46, 44, "#4ade80"],
              [170, 40, 30, "#4ade80"],
              [200, 58, 34, "#f87171"],
              [230, 34, 42, "#4ade80"],
              [260, 28, 34, "#4ade80"],
            ].map(([x, y, h, c]) => (
              <g key={`${x}`}>
                <line x1={x as number} x2={x as number} y1={(y as number) - 10} y2={(y as number) + (h as number) + 10} stroke={c as string} strokeWidth="1.5" />
                <rect x={(x as number) - 7} y={y as number} width="14" height={h as number} rx="2" fill={c as string} opacity="0.85" />
              </g>
            ))}
            <path d="M40 120 C 100 110, 160 104, 290 70" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 6" />
          </>
        )}
        {kind === "assistant" && (
          <>
            <rect x="40" y="24" width="150" height="34" rx="14" fill="rgb(255 255 255 / 0.07)" stroke="rgb(196 181 253 / 0.3)" />
            <rect x="54" y="38" width="96" height="6" rx="3" fill="#aaa6cc" />
            <rect x="130" y="70" width="150" height="34" rx="14" fill="url(#chatGrad)" />
            <rect x="146" y="84" width="104" height="6" rx="3" fill="#fff" opacity="0.75" />
            <rect x="196" y="20" width="84" height="22" rx="11" fill="rgb(74 222 128 / 0.15)" stroke="rgb(74 222 128 / 0.5)" />
            <text x="208" y="35" fill="#4ade80" fontSize="10" fontFamily="monospace">honest ✓</text>
            <circle cx="62" cy="118" r="4" fill="#c4b5fd" className="typing-dot" />
            <circle cx="76" cy="118" r="4" fill="#c4b5fd" className="typing-dot" style={{ animationDelay: "150ms" }} />
            <circle cx="90" cy="118" r="4" fill="#c4b5fd" className="typing-dot" style={{ animationDelay: "300ms" }} />
            <defs>
              <linearGradient id="chatGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
          </>
        )}
        {kind === "marketplace" && (
          <>
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${40 + col * 84} ${22 + row * 54})`}>
                  <rect width="70" height="44" rx="8" fill="rgb(255 255 255 / 0.06)" stroke="rgb(196 181 253 / 0.25)" />
                  <rect x="8" y="8" width="20" height="20" rx="5" fill={row === 0 ? "#8b5cf6" : "#6366f1"} opacity="0.7" />
                  <rect x="34" y="12" width="28" height="5" rx="2.5" fill="#aaa6cc" />
                  <rect x="34" y="22" width="18" height="5" rx="2.5" fill="#aaa6cc" opacity="0.5" />
                </g>
              )),
            )}
          </>
        )}
      </svg>
      <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-lg bg-night-950/70 text-brand-200 ring-1 ring-line backdrop-blur">
        <Icon name={visualIcon[kind]} className="size-4.5" />
      </span>
    </div>
  );
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const study = project ? caseStudies.find((c) => c.slug === projectCaseStudy[project.slug]) : undefined;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="project-dialog-title"
      className="project-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.5rem] border border-line bg-night-900 p-0 text-ink shadow-2xl backdrop:bg-night-950/70 backdrop:backdrop-blur-sm"
      data-testid="project-dialog"
    >
      {project && (
        <div className="panel-in p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-300">
                {project.company} · {project.domain}
              </p>
              <h3 id="project-dialog-title" className="mt-1 text-2xl font-bold">
                {project.name}
              </h3>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm aspect-square !px-0" aria-label="Close project details">
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <div className="mt-5">
            <ProjectVisual kind={project.visual} />
          </div>
          <p className="mt-5 leading-relaxed text-mute">{project.summary}</p>
          <h4 className="mt-6 text-sm font-semibold tracking-wide text-ink uppercase">What I delivered</h4>
          <ul className="mt-3 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                  <Icon name="check" className="size-3.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-mute uppercase">Platforms</dt>
              <dd className="mt-1">{project.platforms.join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-mute uppercase">Testing</dt>
              <dd className="mt-1">{project.categories.join(" · ")}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            {study && (
              <a href={`/case-studies/${study.slug}/`} className="btn btn-primary btn-sm">
                Read the case study <Icon name="arrowRight" className="arrow size-4" />
              </a>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                Visit {new URL(project.url).hostname.replace(/^(www|app)\./, "")}
                <Icon name="arrowUpRight" className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <a href="#contact" onClick={onClose} className="btn btn-ghost btn-sm">
              Discuss a similar project
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
  const count = (c: Category) => projects.filter((p) => p.categories.includes(c)).length;

  return (
    <Section
      id="projects"
      eyebrow="Featured projects"
      title="Products I've helped ship"
      lead="Travel, payments, fleet, AI and fintech products tested across web, mobile and API. Select a project to see what I delivered."
    >
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by type of testing">
        {(["All", ...categories] as const).map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c)}
              className={`chip cursor-pointer !px-4 !py-2 !text-sm font-semibold hover:border-brand-400/60 active:scale-95 ${
                active ? "!border-brand-400 !bg-brand-500/25 !text-white" : ""
              }`}
            >
              {c}
              <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-white/5 text-mute"}`}>
                {c === "All" ? projects.length : count(c)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-testid="project-grid">
        {shown.map((p, i) => (
          <li key={`${filter}-${p.slug}`} className={filter === "All" ? "" : "animate-rise"} style={filter === "All" ? undefined : { animationDelay: `${i * 70}ms` }}>
            <Reveal delay={(i % 3) * 90} className="glass spotlight group flex h-full flex-col p-4" onPointerMove={trackSpotlight} data-testid="project-card">
              <ProjectVisual kind={p.visual} />
              <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
                <p className="text-sm font-semibold text-brand-300">
                  {p.company} · {p.domain}
                </p>
                <h3 className="mt-1 text-xl font-bold text-ink">{p.name}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-mute">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Focus areas">
                  {p.tags.map((t) => (
                    <li key={t} className="chip !text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-5 inline-flex w-fit cursor-pointer items-center gap-2 font-semibold text-brand-200 after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] hover:text-white"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setSelected(p);
                  }}
                  aria-haspopup="dialog"
                >
                  View details <span className="sr-only">for {p.name}</span>
                  <Icon name="arrowUpRight" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <ProjectDialog
        project={selected}
        onClose={() => {
          setSelected(null);
          opener.current?.focus();
        }}
      />
    </Section>
  );
}
