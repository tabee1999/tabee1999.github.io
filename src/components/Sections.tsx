import { useState } from "react";
import { about, education, faqs, learning, person, services, site, testCount } from "../content";
import { Icon } from "./Icon";
import { Section } from "./Layout";

// ── About ─────────────────────────────────────────────────────────────────

export function About({ level = 2 }: { level?: 1 | 2 }) {
  return (
    <Section
      id="about"
      level={level}
      title={level === 1 ? "About Tabeeda Shakir" : "Quality from the first requirement to the release call"}
      lead={level === 1 ? "Quality from the first requirement to the release call." : undefined}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="space-y-5 text-lg leading-relaxed text-mute">
            {about.paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? "text-xl leading-relaxed text-ink" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-accent-400 pl-5 text-xl font-semibold tracking-[-0.01em] text-ink">“{person.quote}”</blockquote>

          <div className="mt-10 flex flex-col gap-4 rounded-[var(--radius-card)] border border-accent-200 bg-accent-50 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <p className="font-semibold text-ink">This site is tested like a product</p>
              <p className="mt-1 text-sm leading-relaxed text-mute">
                {testCount} automated tests in Chrome, Firefox and mobile Chrome run on every change: every page, the contact form, the chat, the scroll animations,
                accessibility (WCAG 2.2 AA) and SEO.
              </p>
            </div>
            <a href={`/${site.qualityReportPath}`} className="btn btn-primary btn-sm shrink-0" data-testid="allure-link">
              See the Allure report
            </a>
          </div>
        </div>

        <aside aria-label="Profile" className="card self-start p-6 md:p-7">
          <div className="flex items-center gap-4">
            <picture>
              <source srcSet={`/${person.avatar}.webp`} type="image/webp" />
              <img src={`/${person.avatar}.jpg`} alt="" width={400} height={400} loading="lazy" decoding="async" className="size-16 rounded-xl object-cover" />
            </picture>
            <div>
              <p className="text-lg font-bold text-ink">{person.name}</p>
              <p className="text-mute">{person.role}</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                <span className="size-2 rounded-full bg-accent-500" aria-hidden="true" /> {person.available}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-5 border-t border-line pt-6">
            <div>
              <dt className="text-sm font-semibold text-mute">Based in</dt>
              <dd className="mt-1 text-ink">{person.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-mute">Education</dt>
              <dd className="mt-1 font-semibold text-ink">{education.degree}</dd>
              <dd className="text-sm text-mute">
                {education.school}, {education.years}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-mute">Currently learning</dt>
              <dd className="mt-1 font-semibold text-ink">{learning.join(", ")}</dd>
              <dd className="text-sm text-mute">To widen my automation toolkit beyond Java and JavaScript.</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-mute">Languages</dt>
              <dd className="mt-1 text-ink">{person.languages}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`/${person.cv}`} download className="btn btn-primary btn-sm">
              <Icon name="download" className="size-4" /> Download CV
            </a>
            <a href="/#how-i-work" className="btn btn-ghost btn-sm">
              See how I work
            </a>
          </div>
        </aside>
      </div>
    </Section>
  );
}

// ── Expertise (section id "services") ─────────────────────────────────────

/** Automation first for SDET and QA Automation roles; AI-first and manual QA right after. */
const expertiseOrder = ["Test automation", "AI-first QA", "Manual and exploratory QA", "API testing", "Web and mobile testing", "Performance and security"];

export function Services({ level = 2 }: { level?: 1 | 2 }) {
  const Card = level === 1 ? "h2" : "h3";
  return (
    <Section
      id="services"
      level={level}
      title={level === 1 ? "QA skills: automated, manual and AI-first" : "Automated, manual and AI-first QA"}
      lead="Five years of hands-on testing across web, mobile and APIs. I pick the right mix for each product instead of automating everything."
    >
      <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {expertiseOrder.map((title) => services.find((s) => s.title === title)!).map((s, i) => (
          <li key={s.title} className="flex flex-col border-t-2 border-ink pt-6">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-50 text-accent-700">
                <Icon name={s.icon} className="size-5" />
              </span>
              {i < 3 && <span className="text-sm font-semibold text-accent-700">Core strength</span>}
            </div>
            <Card className="mt-5 text-xl font-bold tracking-[-0.01em] text-ink">{s.title}</Card>
            <p className="mt-2 leading-relaxed text-mute">{s.text}</p>
            <ul className="mt-5 hidden space-y-2 text-sm sm:block">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-ink">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-ok" /> {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" title="Quick answers for recruiters">
      <div className="max-w-3xl border-t border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink hover:text-accent-800 md:text-lg"
                >
                  {f.q}
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg border transition-transform duration-200 ${
                      isOpen ? "rotate-180 border-accent-600 bg-accent-50 text-accent-700" : "border-line text-mute"
                    }`}
                  >
                    <Icon name="chevronDown" className="size-4" />
                  </span>
                </button>
              </h3>
              <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="expander" data-open={isOpen} inert={!isOpen}>
                <div>
                  <p className="pr-12 pb-6 leading-relaxed text-mute">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
