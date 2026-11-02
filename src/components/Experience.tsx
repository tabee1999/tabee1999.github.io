import { useState } from "react";
import { experience } from "../content";
import { Reveal, trackSpotlight } from "../lib/motion";
import { Icon } from "./Icon";
import { Section } from "./Layout";

export function Experience() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const allOpen = open.size === experience.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="5+ years across SaaS, travel, logistics and fintech"
      action={
        <button
          type="button"
          className="btn btn-ghost btn-sm self-start md:self-auto"
          onClick={() => setOpen(allOpen ? new Set() : new Set(experience.map((_, i) => i)))}
          data-testid="expand-all"
        >
          <Icon name="chevronDown" className={`size-4 transition-transform duration-300 ${allOpen ? "rotate-180" : ""}`} />
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      }
    >
      <ol className="relative space-y-5 before:absolute before:top-3 before:bottom-3 before:left-[1.05rem] before:w-px before:bg-gradient-to-b before:from-brand-400 before:via-brand-600/50 before:to-transparent before:content-[''] md:before:left-[1.3rem]">
        {experience.map((job, i) => {
          const isOpen = open.has(i);
          return (
            <Reveal as="li" key={job.company} delay={i * 70} className="relative pl-12 md:pl-16">
              <span
                className={`absolute top-6 left-1.5 grid size-5 place-items-center rounded-full ring-4 ring-night-950 transition-colors md:left-2.5 ${
                  i === 0 ? "bg-ok" : isOpen ? "bg-brand-400" : "bg-night-700 ring-offset-0"
                }`}
                aria-hidden="true"
              >
                {i === 0 && <span className="animate-pulse-dot size-5 rounded-full" />}
              </span>
              <div className={`glass spotlight transition-colors ${isOpen ? "border-brand-400/40" : ""}`} onPointerMove={trackSpotlight}>
                <h3>
                  <button
                    type="button"
                    id={`job-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`job-panel-${i}`}
                    onClick={() => toggle(i)}
                    className="flex w-full cursor-pointer flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between md:p-6"
                  >
                    <span>
                      <span className="block text-lg font-bold text-ink md:text-xl">{job.role}</span>
                      <span className="mt-0.5 block text-brand-200">
                        {job.company}
                        <span className="text-mute"> · {job.location}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className={`chip !text-xs ${i === 0 ? "!border-ok/40 !text-ok" : ""}`}>{job.period}</span>
                      <span
                        className={`grid size-8 place-items-center rounded-full border border-line transition-transform duration-300 ${
                          isOpen ? "rotate-180 bg-brand-500/20 text-brand-200" : "text-mute"
                        }`}
                      >
                        <Icon name="chevronDown" className="size-4" />
                      </span>
                    </span>
                  </button>
                </h3>
                <p className="-mt-2 px-5 pb-5 text-mute md:px-6">{job.summary}</p>
                <div id={`job-panel-${i}`} role="region" aria-labelledby={`job-${i}`} className="expander" data-open={isOpen} inert={!isOpen}>
                  <div>
                    <div className="border-t border-line px-5 py-5 md:px-6">
                      <ul className="space-y-3">
                        {job.bullets.map((b) => (
                          <li key={b} className="flex gap-3 leading-relaxed text-ink/90">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
                        {job.tags.map((t) => (
                          <li key={t} className="chip !text-xs">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
