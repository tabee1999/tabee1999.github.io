import { useRef, useState, type KeyboardEvent } from "react";
import { caseStudies, person, type CaseStudy } from "../content";
import { Reveal, trackSpotlight } from "../lib/motion";
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
      eyebrow="Case studies"
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
                className={`glass group flex min-w-[16rem] cursor-pointer items-start gap-4 p-5 text-left transition-all duration-300 lg:min-w-0 ${
                  selected ? "!border-brand-400/60 bg-brand-500/10 shadow-lg shadow-brand-900/40" : "opacity-80 hover:opacity-100"
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors ${
                    selected ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white" : "bg-white/5 text-brand-200"
                  }`}
                >
                  <Icon name={caseIcon[i] ?? "chart"} className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-brand-300 uppercase">{cs.area}</span>
                  <span className="mt-1 block font-semibold text-ink">{cs.title}</span>
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
            className="glass spotlight p-6 md:p-8"
            onPointerMove={trackSpotlight}
          >
            {i === active && (
              <div key={c.slug} className="panel-in">
                <p className="text-sm font-semibold text-brand-300">{c.area}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink md:text-3xl">{c.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-mute">{c.summary}</p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Results">
                  {c.metrics.map((m) => (
                    <li key={m.label} className="rounded-xl border border-line bg-white/[0.03] p-4">
                      <p className="text-gradient text-2xl font-extrabold">{m.value}</p>
                      <p className="mt-1 text-sm text-mute">{m.label}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-ink uppercase">The challenge</h4>
                    <p className="mt-2 leading-relaxed text-mute">{c.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-ink uppercase">What I did</h4>
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
                      <li key={t} className="chip !text-xs">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a href={`/case-studies/${c.slug}/`} className="btn btn-primary btn-sm" data-testid="case-link">
                    Read the full case study <Icon name="arrowRight" className="arrow size-4" />
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
        <nav aria-label="Breadcrumb" className="animate-rise text-sm text-mute">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-ink">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/#case-studies" className="hover:text-ink">
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
          <p className="animate-rise eyebrow" style={{ animationDelay: "60ms" }}>
            Case study · {study.area}
          </p>
          <h1 id="case-title" className="animate-rise mt-3 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.08] font-extrabold tracking-[-0.03em]" style={{ animationDelay: "120ms" }}>
            {study.title}
          </h1>
          <p className="animate-rise mt-5 text-xl leading-relaxed text-mute" style={{ animationDelay: "180ms" }}>
            {study.summary}
          </p>
          <p className="animate-rise mt-5 text-sm text-mute" style={{ animationDelay: "220ms" }}>
            By <a href="/#about" className="font-semibold text-ink underline decoration-brand-400/50 underline-offset-4">{person.name}</a>, {person.role}
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Results">
          {study.metrics.map((m, i) => (
            <Reveal as="li" key={m.label} delay={i * 90} className="glass spotlight p-5" onPointerMove={trackSpotlight}>
              <p className="text-gradient text-3xl font-extrabold">{m.value}</p>
              <p className="mt-1 text-mute">{m.label}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal as="section" aria-labelledby="context-title" className="glass mt-10 p-6 md:p-8">
          <h2 id="context-title" className="text-2xl font-bold">
            Context
          </h2>
          <dl className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-mute uppercase">Product</dt>
              <dd className="mt-1 text-ink">{study.context.product}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-mute uppercase">My role</dt>
              <dd className="mt-1 text-ink">{study.context.role}</dd>
            </div>
            {study.context.team && (
              <div>
                <dt className="text-xs font-semibold tracking-wide text-mute uppercase">Team</dt>
                <dd className="mt-1 text-ink">{study.context.team}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold tracking-wide text-mute uppercase">Tools</dt>
              <dd className="mt-1 text-ink">{study.tags.join(", ")}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal as="section" aria-labelledby="challenge-title" className="mt-12">
          <h2 id="challenge-title" className="text-2xl font-bold">
            The challenge
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-mute">{study.challenge}</p>
        </Reveal>

        <section aria-labelledby="approach-title" className="mt-12">
          <Reveal>
            <h2 id="approach-title" className="text-2xl font-bold">
              What I did
            </h2>
          </Reveal>
          <ol className="relative mt-6 space-y-4 border-l border-line pl-8">
            {study.approach.map((a, i) => (
              <Reveal as="li" key={a.decision} delay={i * 80} className="relative">
                <span className="absolute top-4 -left-[2.85rem] grid size-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-mono text-xs font-bold text-white ring-4 ring-night-950">
                  {i + 1}
                </span>
                <div className="glass p-5">
                  <p className="font-semibold text-ink">{a.decision}</p>
                  {a.why && <p className="mt-1.5 text-mute">{a.why}</p>}
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {study.outcome && (
          <Reveal as="section" aria-labelledby="outcome-title" className="mt-12">
            <h2 id="outcome-title" className="text-2xl font-bold">
              Outcome
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-mute">{study.outcome}</p>
          </Reveal>
        )}

        {study.lessons && (
          <Reveal as="section" aria-labelledby="lessons-title" className="mt-12">
            <h2 id="lessons-title" className="text-2xl font-bold">
              What I learned
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-mute">{study.lessons}</p>
          </Reveal>
        )}

        <Reveal className="mt-14 grid gap-4 md:grid-cols-2">
          <a href={`/case-studies/${next.slug}/`} className="glass spotlight group block p-6" onPointerMove={trackSpotlight}>
            <p className="text-sm text-mute">Next case study</p>
            <p className="mt-1 flex items-center justify-between gap-3 text-lg font-bold text-ink">
              {next.title}
              <Icon name="arrowRight" className="size-5 shrink-0 text-brand-300 transition-transform group-hover:translate-x-1" />
            </p>
          </a>
          <div className="glass relative overflow-hidden p-6">
            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-brand-600/30 blur-2xl" aria-hidden="true" />
            <p className="relative text-lg font-bold text-ink">Need this kind of QA on your team?</p>
            <div className="relative mt-4 flex flex-wrap gap-3">
              <a href="/#contact" className="btn btn-primary btn-sm">
                Let's talk <Icon name="arrowRight" className="arrow size-4" />
              </a>
              <a href={`/${person.cv}`} download className="btn btn-ghost btn-sm">
                <Icon name="download" className="size-4" /> CV
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
