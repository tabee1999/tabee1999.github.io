import { useEffect, useRef, useState, type RefObject } from "react";
import { experience } from "../content";
import { refreshScroll, useScrollProgress } from "../lib/scroll";
import { Icon } from "./Icon";
import { Section } from "./Layout";

/** x position of the trail in its 32px-wide column, and the sampling step along it. */
const X = 16;
const STEP = 4;

/**
 * A GPS trail down the job history, like the live driver tracking I tested at Dastgyr:
 * it draws itself as you read, and a pin lights up at each job it reaches.
 */
function Trail({ box }: { box: RefObject<HTMLDivElement | null> }) {
  const svg = useRef<SVGSVGElement>(null);
  const road = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const pins = useRef<(SVGCircleElement | null)[]>([]);
  const geo = useRef<{ total: number; ys: number[]; samples: number[] } | null>(null);
  const progress = useRef(1);

  const draw = (p: number) => {
    progress.current = p;
    const g = geo.current;
    const el = box.current;
    if (!g || !el || !line.current || !head.current) return;
    const headY = p * el.offsetHeight;
    let len = g.total;
    for (let k = 0; k < g.samples.length; k++) {
      if (g.samples[k] >= headY) {
        len = k * STEP;
        break;
      }
    }
    len = Math.min(len, g.total);
    line.current.style.strokeDashoffset = String(g.total - len);
    const at = line.current.getPointAtLength(len);
    head.current.setAttribute("transform", `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);
    g.ys.forEach((y, i) => pins.current[i]?.setAttribute("data-reached", String(y <= at.y + 1)));
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const build = () => {
      const ol = el.querySelector("ol");
      if (!ol || !svg.current || !road.current || !line.current) return;
      const ys = Array.from(ol.children).map((li) => (li as HTMLElement).offsetTop + 36);
      let d = `M ${X} 0`;
      let prev = 0;
      ys.forEach((y, i) => {
        const dx = i % 2 === 0 ? 9 : -9;
        const gap = y - prev;
        d += ` C ${X + dx} ${(prev + gap * 0.35).toFixed(1)}, ${X - dx} ${(prev + gap * 0.65).toFixed(1)}, ${X} ${y}`;
        prev = y;
      });
      road.current.setAttribute("d", d);
      line.current.setAttribute("d", d);
      const total = line.current.getTotalLength();
      line.current.style.strokeDasharray = String(total);
      const samples: number[] = [];
      for (let len = 0; len <= total; len += STEP) samples.push(line.current.getPointAtLength(len).y);
      const h = el.offsetHeight;
      svg.current.setAttribute("height", String(h));
      svg.current.setAttribute("viewBox", `0 0 32 ${h}`);
      ys.forEach((y, i) => pins.current[i]?.setAttribute("cy", String(y)));
      geo.current = { total, ys, samples };
      draw(progress.current);
      refreshScroll();
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box]);

  useScrollProgress(box, { kind: "track", anchor: 0.62 }, draw);

  return (
    <svg ref={svg} className="pointer-events-none absolute top-0 left-0 w-8 overflow-visible" width="32" height="0" aria-hidden="true" data-testid="trail">
      <path ref={road} fill="none" stroke="var(--color-line)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      <path ref={line} fill="none" stroke="var(--color-accent-500)" strokeWidth="3" strokeLinecap="round" />
      {experience.map((job, i) => (
        <circle
          key={job.company}
          ref={(c) => {
            pins.current[i] = c;
          }}
          className="trail-pin"
          cx={X}
          cy="0"
          r="6.5"
          strokeWidth="2"
          data-reached="false"
        />
      ))}
      <g ref={head}>
        <circle r="13" fill="var(--color-accent-500)" opacity="0.18" />
        <circle r="6.5" fill="var(--color-accent-700)" stroke="#fff" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function Experience({ level = 2 }: { level?: 1 | 2 }) {
  const box = useRef<HTMLDivElement>(null);
  const JobHeading = level === 1 ? "h2" : "h3";
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
      level={level}
      title="5+ years of QA across SaaS, travel, logistics and fintech"
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
      <div ref={box} className="relative pl-10 md:pl-14">
        <Trail box={box} />
      <ol className="border-t border-line">
        {experience.map((job, i) => {
          const isOpen = open.has(i);
          return (
            <li key={job.company} className="border-b border-line">
              <JobHeading>
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
              </JobHeading>
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
      </div>
    </Section>
  );
}
