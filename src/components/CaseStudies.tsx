import { useRef, useState, type KeyboardEvent } from "react";
import { caseStudies, person, type CaseStudy } from "../content";
import { Icon } from "./Icon";
import { Section } from "./Layout";

const caseIcon = ["automation", "rocket", "devices", "sparkles"];

// ── Home page section: tabs ───────────────────────────────────────────────

export function CaseStudies() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = caseStudies.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const c = caseStudies[active];

  return (
    <Section
      id="case-studies"
      title="How I solved real QA problems"
      lead="The context, the decisions and the results. Pick a case study, or open the full write-up."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
        <div role="tablist" aria-label="Case studies" className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {caseStudies.map((cs, i) => {
            const selected = i === active;
            return (
              <button
                key={cs.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`case-tab-${i}`}
                aria-selected={selected}
                aria-controls={`case-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={`group flex min-w-[16rem] cursor-pointer items-start gap-4 rounded-[var(--radius-card)] border p-4 text-left transition-colors lg:min-w-0 ${
                  selected ? "border-accent-600 bg-surface shadow-[0_8px_24px_-16px_rgb(8_54_44/0.45)]" : "border-line bg-transparent hover:border-accent-400 hover:bg-surface"
                }`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${
                    selected ? "bg-accent-700 text-white" : "bg-accent-50 text-accent-700"
                  }`}
                >
                  <Icon name={caseIcon[i] ?? "chart"} className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-accent-700">{cs.area}</span>
                  <span className="mt-0.5 block leading-snug font-semibold text-ink">{cs.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {caseStudies.map((cs, i) => (
          <div
            key={cs.slug}
            role="tabpanel"
            id={`case-panel-${i}`}
            aria-labelledby={`case-tab-${i}`}
            hidden={i !== active}
            tabIndex={0}
            className="card p-6 md:p-8"
          >
            {i === active && (
              <div key={c.slug} className="panel-in">
                <p className="text-sm font-semibold text-accent-700">{c.area}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-[-0.015em] text-ink md:text-3xl">{c.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-mute">{c.summary}</p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Results">
                  {c.metrics.map((m) => (
                    <li key={m.label} className="rounded-xl bg-accent-50 p-4">
                      <p className="text-2xl font-extrabold tracking-[-0.02em] text-accent-700">{m.value}</p>
                      <p className="mt-1 text-sm text-mute">{m.label}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-bold text-ink">The challenge</h4>
                    <p className="mt-2 leading-relaxed text-mute">{c.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">What I did</h4>
                    <ul className="mt-2 space-y-2">
                      {c.approach.slice(0, 3).map((a) => (
                        <li key={a.decision} className="flex gap-2.5 text-mute">
                          <Icon name="check" className="mt-1 size-4 shrink-0 text-ok" />
                          {a.decision}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                  <ul className="flex flex-wrap gap-2" aria-label="Tools">
                    {c.tags.slice(0, 4).map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a href={`/case-studies/${c.slug}/`} className="btn btn-primary btn-sm" data-testid="case-link">
                    Read the full case study
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Full case study page ──────────────────────────────────────────────────

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article className="pt-28 pb-10 md:pt-36" aria-labelledby="case-title">
      <div className="wrap max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-mute">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-ink">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/projects/#case-studies" className="hover:text-ink">
                Case studies
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {study.area}
            </li>
          </ol>
        </nav>

        <header className="mt-8">
          <p className="text-sm font-semibold text-accent-700">{study.area}</p>
          <h1 id="case-title" className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] font-extrabold tracking-[-0.035em]">
            {study.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-mute">{study.summary}</p>
          <p className="mt-5 text-sm text-mute">
            By <a href="/about/" className="link">{person.name}</a>, {person.role}
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Results">
          {study.metrics.map((m) => (
            <li key={m.label} className="rounded-[var(--radius-card)] bg-accent-50 p-5">
              <p className="text-3xl font-extrabold tracking-[-0.02em] text-accent-700">{m.value}</p>
              <p className="mt-1 text-mute">{m.label}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="context-title" className="card mt-10 p-6 md:p-8">
          <h2 id="context-title" className="text-2xl font-bold">
            Context
          </h2>
          <dl className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-mute">Product</dt>
              <dd className="mt-1 text-ink">{study.context.product}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-mute">My role</dt>
              <dd className="mt-1 text-ink">{study.context.role}</dd>
            </div>
            {study.context.team && (
              <div>
                <dt className="text-sm font-semibold text-mute">Team</dt>
                <dd className="mt-1 text-ink">{study.context.team}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-semibold text-mute">Tools</dt>
              <dd className="mt-1 text-ink">{study.tags.join(", ")}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="challenge-title" className="mt-12">
          <h2 id="challenge-title" className="text-2xl font-bold">
            The challenge
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-mute">{study.challenge}</p>
        </section>

        <section aria-labelledby="approach-title" className="mt-12">
          <h2 id="approach-title" className="text-2xl font-bold">
            What I did
          </h2>
          <ol className="mt-6 border-t border-line">
            {study.approach.map((a, i) => (
              <li key={a.decision} className="flex gap-4 border-b border-line py-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-50 text-sm font-bold text-accent-700 tabular-nums">{i + 1}</span>
                <div>
                  <p className="font-semibold text-ink">{a.decision}</p>
                  {a.why && <p className="mt-1.5 text-mute">{a.why}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {study.outcome && (
          <section aria-labelledby="outcome-title" className="mt-12">
            <h2 id="outcome-title" className="text-2xl font-bold">
              Outcome
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-mute">{study.outcome}</p>
          </section>
        )}

        {study.lessons && (
          <section aria-labelledby="lessons-title" className="mt-12">
            <h2 id="lessons-title" className="text-2xl font-bold">
              What I learned
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-mute">{study.lessons}</p>
          </section>
        )}

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <a href={`/case-studies/${next.slug}/`} className="card group block p-6 transition-colors hover:border-accent-400">
            <p className="text-sm text-mute">Next case study</p>
            <p className="mt-1 text-lg font-bold text-ink group-hover:text-accent-800">{next.title}</p>
          </a>
          <div className="rounded-[var(--radius-card)] bg-accent-50 p-6">
            <p className="text-lg font-bold text-ink">Need this kind of QA on your team?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/contact/" className="btn btn-primary btn-sm">
                Contact me
              </a>
              <a href={`/${person.cv}`} download className="btn btn-ghost btn-sm">
                <Icon name="download" className="size-4" /> CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
