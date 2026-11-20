import { useState } from "react";
import { about, education, faqs, learning, person, process, services, site } from "../content";
import { Icon } from "./Icon";
import { Section } from "./Layout";

// ── About ─────────────────────────────────────────────────────────────────

export function About() {
  return (
    <Section id="about" title="Quality from the first requirement to the release call">
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

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
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
          </dl>

          <div className="mt-8 flex flex-col gap-4 rounded-[var(--radius-card)] border border-accent-200 bg-accent-50 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <p className="font-semibold text-ink">This site is tested like a product</p>
              <p className="mt-1 text-sm leading-relaxed text-mute">
                230+ automated tests in Chrome, Firefox and mobile Chrome run on every change: navigation, the contact form, the chat, accessibility (WCAG 2.2 AA) and SEO.
              </p>
            </div>
            <a href={site.qualityReportPath} className="btn btn-primary btn-sm shrink-0" data-testid="allure-link">
              See the Allure report
            </a>
          </div>
        </div>

        <aside aria-labelledby="how-title" className="card self-start p-6 md:p-7">
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
          <h3 id="how-title" className="mt-6 border-t border-line pt-6 text-lg font-bold text-ink">
            How I work
          </h3>
          <ol className="mt-4 space-y-4">
            {process.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent-50 text-sm font-bold text-accent-700 tabular-nums">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-ink">{step.title}</span>
                  <span className="block text-sm leading-relaxed text-mute">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={person.cv} download className="btn btn-primary btn-sm">
              <Icon name="download" className="size-4" /> Download CV
            </a>
            <a href="#contact" className="btn btn-ghost btn-sm">
              Get in touch
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

export function Services() {
  return (
    <Section
      id="services"
      title="Automated, manual and AI-first QA"
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
            <h3 className="mt-5 text-xl font-bold tracking-[-0.01em] text-ink">{s.title}</h3>
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
