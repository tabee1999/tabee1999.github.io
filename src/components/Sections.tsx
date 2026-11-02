import { useState } from "react";
import { about, education, faqs, learning, person, process, services, site } from "../content";
import { Reveal, trackSpotlight } from "../lib/motion";
import { Icon } from "./Icon";
import { Section } from "./Layout";

// ── About ─────────────────────────────────────────────────────────────────

export function About() {
  return (
    <Section id="about" eyebrow="About me" title="Quality from the first requirement to the release call">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-8">
        <Reveal className="glass spotlight p-6 md:p-8" onPointerMove={trackSpotlight}>
          <div className="flex items-center gap-4">
            <picture>
              <source srcSet={`/${person.avatar}.webp`} type="image/webp" />
              <img
                src={`/${person.avatar}.jpg`}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="size-20 rounded-2xl object-cover ring-2 ring-brand-400/50"
              />
            </picture>
            <div>
              <p className="text-xl font-bold text-ink">{person.name}</p>
              <p className="text-mute">{person.role}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ok">
                <span className="size-2 rounded-full bg-ok" aria-hidden="true" /> {person.available}
              </p>
            </div>
          </div>
          <h3 className="mt-6 border-t border-line pt-6 text-sm font-semibold tracking-wide text-ink uppercase">How I work</h3>
          <ol className="mt-4 space-y-4">
            {process.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-mono text-xs font-bold text-white">
                  {i + 1}
                </span>
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
              Get in touch <Icon name="arrowRight" className="arrow size-4" />
            </a>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal className="space-y-5 text-lg leading-relaxed text-mute" delay={80}>
            {about.paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? "text-xl leading-relaxed text-ink" : undefined}>
                {p}
              </p>
            ))}
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal className="glass p-5" delay={140}>
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-200">
                <Icon name="layers" className="size-4" /> Education
              </p>
              <p className="mt-2 font-semibold text-ink">{education.degree}</p>
              <p className="text-sm text-mute">
                {education.school}, {education.years}
              </p>
            </Reveal>
            <Reveal className="glass p-5" delay={200}>
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-200">
                <Icon name="rocket" className="size-4" /> Currently learning
              </p>
              <p className="mt-2 font-semibold text-ink">{learning.join(", ")}</p>
              <p className="text-sm text-mute">To widen my automation toolkit beyond Java and JavaScript.</p>
            </Reveal>
            <Reveal className="glass spotlight p-5 sm:col-span-2" delay={260} onPointerMove={trackSpotlight}>
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-200">
                <Icon name="chart" className="size-4" /> This site is tested like a product
              </p>
              <p className="mt-2 text-ink">
                230+ automated tests in Chrome, Firefox and mobile Chrome run on every change: navigation, the contact form, the chat, accessibility (WCAG 2.2 AA) and SEO.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={site.qualityReportPath} className="btn btn-primary btn-sm" data-testid="allure-link">
                  See the Allure report <Icon name="arrowRight" className="arrow size-4" />
                </a>
                <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  Read the test code <Icon name="arrowUpRight" className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
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
      eyebrow="Expertise"
      title="Automated, manual and AI-first QA"
      lead="Five years of hands-on testing across web, mobile and APIs. I pick the right mix for each product instead of automating everything."
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expertiseOrder.map((title) => services.find((s) => s.title === title)!).map((s, i) => (
          <Reveal as="li" key={s.title} delay={(i % 3) * 90} className="glass spotlight group flex flex-col p-6 md:p-7" onPointerMove={trackSpotlight}>
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400/30 to-brand-700/30 text-brand-200 ring-1 ring-brand-300/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon name={s.icon} className="size-6" />
              </span>
              {i < 3 && <span className="chip !text-xs">Core strength</span>}
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-mute">{s.text}</p>
            <ul className="mt-5 hidden space-y-2 border-t border-line pt-5 text-sm sm:block">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-ink">
                  <Icon name="check" className="size-4 text-ok" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Quick answers for recruiters">
      <div className="max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 60} className={`glass overflow-hidden transition-colors ${isOpen ? "border-brand-400/40" : ""}`}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink md:px-6 md:py-5 md:text-lg"
                >
                  {f.q}
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-brand-500/20 text-brand-200" : "text-mute"
                    }`}
                  >
                    <Icon name="chevronDown" className="size-4" />
                  </span>
                </button>
              </h3>
              <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="expander" data-open={isOpen} inert={!isOpen}>
                <div>
                  <p className="px-5 pb-5 leading-relaxed text-mute md:px-6">{f.a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
