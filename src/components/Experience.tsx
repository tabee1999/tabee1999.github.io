import { useState } from "react";
import { experience } from "../content";
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
      title="5+ years across SaaS, travel, logistics and fintech"
      action={
        <button
          type="button"
          className="btn btn-ghost btn-sm self-start md:self-auto"
          onClick={() => setOpen(allOpen ? new Set() : new Set(experience.map((_, i) => i)))}
          data-testid="expand-all"
        >
          <Icon name="chevronDown" className={`size-4 transition-transform duration-200 ${allOpen ? "rotate-180" : ""}`} />
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      }
    >
      <ol className="border-t border-line">
        {experience.map((job, i) => {
          const isOpen = open.has(i);
          return (
            <li key={job.company} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  id={`job-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`job-panel-${i}`}
                  onClick={() => toggle(i)}
                  className="group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 pt-6 pb-3 text-left md:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-x-8"
                >
                  <span className="col-span-2 flex items-center gap-2 text-sm font-semibold text-mute tabular-nums md:col-span-1 md:pt-1.5">
                    {i === 0 && <span className="size-2 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />}
                    {job.period}
                  </span>
                  <span>
                    <span className="block text-xl font-bold tracking-[-0.01em] text-ink group-hover:text-accent-800 md:text-[1.375rem]">{job.role}</span>
                    <span className="mt-0.5 block font-semibold text-accent-700">
                      {job.company}
                      <span className="font-normal text-mute">, {job.location}</span>
                    </span>
                  </span>
                  <span
                    className={`grid size-9 place-items-center self-start rounded-lg border transition-transform duration-200 md:mt-0.5 ${
                      isOpen ? "rotate-180 border-accent-600 bg-accent-50 text-accent-700" : "border-line text-mute"
                    }`}
                  >
                    <Icon name="chevronDown" className="size-4" />
                  </span>
                </button>
              </h3>
              <div className="md:ml-[13rem]">
                <p className="pb-6 leading-relaxed text-mute md:max-w-3xl">{job.summary}</p>
                <div id={`job-panel-${i}`} role="region" aria-labelledby={`job-${i}`} className="expander" data-open={isOpen} inert={!isOpen}>
                  <div>
                    <div className="pb-8 md:max-w-3xl">
                      {(job.about || job.url) && (
                        <p className="mb-5 text-sm leading-relaxed text-mute">
                          {job.about}{" "}
                          {job.url && (
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 whitespace-nowrap">
                              {new URL(job.url).hostname.replace(/^www\./, "")}
                              <Icon name="arrowUpRight" className="size-3.5" />
                              <span className="sr-only">(opens in a new tab)</span>
                            </a>
                          )}
                        </p>
                      )}
                      <ul className="space-y-3">
                        {job.bullets.map((b) => (
                          <li key={b} className="flex gap-3 leading-relaxed text-ink">
                            <span className="mt-[0.7rem] h-0.5 w-3 shrink-0 rounded-full bg-accent-400" aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
                        {job.tags.map((t) => (
                          <li key={t} className="chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
