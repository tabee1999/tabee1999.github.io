import { useEffect, useRef, useState } from "react";
import { caseStudies, categories, projects, type Category, type Project } from "../content";
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
const ink = "#0a4a3b";
const stroke = "#138d6c";
const soft = "#5fc29f";
const bar = "#9db8b1";
const box = { fill: "#ffffff", stroke: "#98d9c0" };

function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl bg-accent-50" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgb(11 95 74 / 0.13) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <svg viewBox="0 0 320 144" className="absolute inset-0 size-full" fill="none">
        {kind === "travel" && (
          <>
            <path d="M40 112 C 110 20, 210 20, 280 100" stroke={stroke} strokeWidth="2" strokeDasharray="5 7" />
            <circle cx="40" cy="112" r="6" fill={soft} />
            <circle cx="280" cy="100" r="6" fill={stroke} />
            <rect x="196" y="20" width="96" height="30" rx="8" {...box} />
            <text x="208" y="40" fill={ink} fontSize="11" fontFamily="monospace">DXB → LHR</text>
          </>
        )}
        {kind === "payments" && (
          <>
            <rect x="40" y="30" width="130" height="82" rx="12" fill="url(#cardGrad)" />
            <rect x="54" y="46" width="22" height="16" rx="3" fill="#f5d77a" />
            <rect x="54" y="88" width="80" height="6" rx="3" fill="#fff" opacity="0.6" />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(196 ${34 + i * 28})`}>
                <rect width="96" height="20" rx="10" {...box} />
                <circle cx="12" cy="10" r="5" fill={stroke} />
                <rect x="24" y="7" width={52 - i * 8} height="6" rx="3" fill={bar} />
              </g>
            ))}
            <defs>
              <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#138d6c" />
                <stop offset="1" stopColor="#0a4a3b" />
              </linearGradient>
            </defs>
          </>
        )}
        {kind === "fleet" && (
          <>
            <path d="M30 110 L 90 70 L 150 92 L 220 40 L 290 60" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
            {[
              [30, 110],
              [90, 70],
              [150, 92],
              [220, 40],
              [290, 60],
            ].map(([x, y]) => (
              <circle key={`${x}`} cx={x} cy={y} r="5" fill="#ffffff" stroke={stroke} strokeWidth="2" />
            ))}
            <rect x="196" y="92" width="96" height="30" rx="8" {...box} />
            <text x="208" y="112" fill={ink} fontSize="11" fontFamily="monospace">load test ✓</text>
          </>
        )}
        {kind === "visa" && (
          <>
            <rect x="44" y="22" width="84" height="104" rx="10" {...box} />
            <circle cx="86" cy="62" r="18" stroke={stroke} strokeWidth="2" />
            <rect x="62" y="96" width="48" height="6" rx="3" fill={bar} />
            <rect x="156" y="32" width="128" height="22" rx="11" fill="#c8ebdd" />
            <text x="168" y="47" fill={ink} fontSize="11" fontFamily="monospace">AI check ✓</text>
            <rect x="156" y="66" width="104" height="8" rx="4" fill={bar} opacity="0.8" />
            <rect x="156" y="84" width="84" height="8" rx="4" fill={bar} opacity="0.6" />
            <rect x="156" y="102" width="116" height="8" rx="4" fill={bar} opacity="0.45" />
          </>
        )}
        {kind === "trading" && (
          <>
            {[
              [50, 60, 40, stroke],
              [80, 50, 36, stroke],
              [110, 70, 30, "#d9485f"],
              [140, 46, 44, stroke],
              [170, 40, 30, stroke],
              [200, 58, 34, "#d9485f"],
              [230, 34, 42, stroke],
              [260, 28, 34, stroke],
            ].map(([x, y, h, c]) => (
              <g key={`${x}`}>
                <line x1={x as number} x2={x as number} y1={(y as number) - 10} y2={(y as number) + (h as number) + 10} stroke={c as string} strokeWidth="1.5" />
                <rect x={(x as number) - 7} y={y as number} width="14" height={h as number} rx="2" fill={c as string} opacity="0.85" />
              </g>
            ))}
            <path d="M40 120 C 100 110, 160 104, 290 70" stroke={ink} strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
          </>
        )}
        {kind === "assistant" && (
          <>
            <rect x="40" y="24" width="150" height="34" rx="14" {...box} />
            <rect x="54" y="38" width="96" height="6" rx="3" fill={bar} />
            <rect x="130" y="70" width="150" height="34" rx="14" fill="#0b5f4a" />
            <rect x="146" y="84" width="104" height="6" rx="3" fill="#fff" opacity="0.75" />
            <rect x="196" y="20" width="84" height="22" rx="11" fill="#c8ebdd" />
            <text x="208" y="35" fill={ink} fontSize="10" fontFamily="monospace">honest ✓</text>
            <circle cx="62" cy="118" r="4" fill={soft} />
            <circle cx="76" cy="118" r="4" fill={soft} opacity="0.7" />
            <circle cx="90" cy="118" r="4" fill={soft} opacity="0.4" />
          </>
        )}
        {kind === "marketplace" && (
          <>
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${40 + col * 84} ${22 + row * 54})`}>
                  <rect width="70" height="44" rx="8" {...box} />
                  <rect x="8" y="8" width="20" height="20" rx="5" fill={row === 0 ? stroke : soft} />
                  <rect x="34" y="12" width="28" height="5" rx="2.5" fill={bar} />
                  <rect x="34" y="22" width="18" height="5" rx="2.5" fill={bar} opacity="0.6" />
                </g>
              )),
            )}
          </>
        )}
      </svg>
      <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-lg border border-accent-200 bg-surface text-accent-700">
        <Icon name={visualIcon[kind]} className="size-4.5" />
      </span>
    </div>
  );
}

function ProjectDialog({ project, onClose, level }: { project: Project | null; onClose: () => void; level: 1 | 2 }) {
  const Title = level === 1 ? "h2" : "h3";
  const Sub = level === 1 ? "h3" : "h4";
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
      className="project-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.25rem] border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/60"
      data-testid="project-dialog"
    >
      {project && (
        <div className="panel-in p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent-700">
                {project.company}<span className="font-normal text-mute">, {project.domain}</span>
              </p>
              <Title id="project-dialog-title" className="mt-1 text-2xl font-bold tracking-[-0.01em]">
                {project.name}
              </Title>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm aspect-square !px-0" aria-label="Close project details">
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <div className="mt-5">
            <ProjectVisual kind={project.visual} />
          </div>
          <p className="mt-5 leading-relaxed text-mute">{project.summary}</p>
          <Sub className="mt-6 font-bold text-ink">What I delivered</Sub>
          <ul className="mt-3 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-50 text-ok">
                  <Icon name="check" className="size-3.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-mute">Platforms</dt>
              <dd className="mt-1">{project.platforms.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-mute">Testing</dt>
              <dd className="mt-1">{project.categories.join(", ")}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            {study && (
              <a href={`/case-studies/${study.slug}/`} className="btn btn-primary btn-sm">
                Read the case study
              </a>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                Visit {new URL(project.url).hostname.replace(/^(www|app)\./, "")}
                <Icon name="arrowUpRight" className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <a href="/contact/" onClick={onClose} className="btn btn-ghost btn-sm">
              Discuss a similar project
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Projects({ level = 2 }: { level?: 1 | 2 }) {
  const Card = level === 1 ? "h2" : "h3";
  const [filter, setFilter] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
  const count = (c: Category) => projects.filter((p) => p.categories.includes(c)).length;

  return (
    <Section
      id="projects"
      level={level}
      title={level === 1 ? "QA projects: products I've helped ship" : "Products I've helped ship"}
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
              className={`chip min-h-11 cursor-pointer !px-4 !text-sm font-semibold ${
                active ? "!border-accent-700 !bg-accent-700 !text-white" : "!bg-surface hover:!border-accent-600"
              }`}
            >
              {c}
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-paper text-mute"}`}>
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
        {shown.map((p) => (
          <li key={`${filter}-${p.slug}`} className={filter === "All" ? "" : "panel-in"}>
            <div className="card group relative flex h-full flex-col p-3 transition-colors hover:border-accent-400 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-600" data-testid="project-card">
              <ProjectVisual kind={p.visual} />
              <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
                <p className="text-sm font-semibold text-accent-700">
                  {p.company}<span className="font-normal text-mute">, {p.domain}</span>
                </p>
                <Card className="mt-1 text-xl font-bold tracking-[-0.01em] text-ink">{p.name}</Card>
                <p className="mt-2 flex-1 leading-relaxed text-mute">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Focus areas">
                  {p.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-5 inline-flex min-h-11 w-fit cursor-pointer items-center font-semibold text-accent-700 underline decoration-accent-300 underline-offset-4 after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] group-hover:decoration-accent-700 focus-visible:outline-none"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setSelected(p);
                  }}
                  aria-haspopup="dialog"
                  data-track={`project-${p.slug}`}
                >
                  View details <span className="sr-only">for {p.name}</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ProjectDialog
        level={level}
        project={selected}
        onClose={() => {
          setSelected(null);
          opener.current?.focus();
        }}
      />
    </Section>
  );
}
