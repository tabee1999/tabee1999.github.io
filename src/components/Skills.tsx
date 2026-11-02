import { useState } from "react";
import { skillGroups } from "../content";
import { matchJob } from "../lib/match";
import { Reveal, trackSpotlight } from "../lib/motion";
import { Icon } from "./Icon";
import { Section } from "./Layout";

const groupIcon: Record<string, string> = {
  "AI-first QA": "sparkles",
  "Manual QA": "clipboard",
  Automation: "automation",
  "Languages and data": "api",
  "CI/CD and tools": "layers",
  "Performance and security": "gauge",
  Practices: "chart",
};

function JobMatch() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof matchJob> | null>(null);
  const [error, setError] = useState("");

  return (
    <Reveal className="glass relative mt-10 overflow-hidden p-6 md:p-8" data-testid="job-match">
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-brand-600/25 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">
            <Icon name="sparkles" className="size-4" /> For recruiters
          </p>
          <h3 className="mt-2 text-2xl font-bold text-ink">Check my fit for your role</h3>
          <p className="mt-2 text-mute">Paste a job description and see which of the skills it asks for I already use. Nothing is sent anywhere: it runs in your browser.</p>
          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim().length < 20) {
                setError("Paste at least a few lines of the job description.");
                setResult(null);
                return;
              }
              setError("");
              setResult(matchJob(text));
            }}
            noValidate
          >
            <label htmlFor="job-text" className="sr-only">
              Job description
            </label>
            <textarea
              id="job-text"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. We're looking for a QA Engineer with Playwright, API testing and CI/CD experience…"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "job-error" : undefined}
              className="w-full resize-y rounded-xl border border-line bg-night-950/60 px-4 py-3 text-ink placeholder:text-mute/70 focus:border-brand-400 focus:outline-none"
            />
            {error && (
              <p id="job-error" className="text-sm text-rose-300">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primary btn-sm">
                Check my fit <Icon name="arrowRight" className="arrow size-4" />
              </button>
              {(text || result) && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setText("");
                    setResult(null);
                    setError("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        <div aria-live="polite" className="min-h-[10rem]" data-testid="job-result">
          {result ? (
            <div className="panel-in">
              {result.matched.length > 0 ? (
                <>
                  <p className="text-4xl font-extrabold text-ink">
                    <span className="text-gradient">{result.matched.length}</span>
                  </p>
                  <p className="mt-1 text-ink">
                    {result.matched.length === 1 ? "skill" : "skills"} from this job ad that I use in my work
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {result.matched.map((m, i) => (
                      <li key={m} className="chip animate-rise !border-ok/40 !text-ink" style={{ animationDelay: `${i * 40}ms` }}>
                        <Icon name="check" className="size-3.5 text-ok" /> {m}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-ink">I couldn't spot any of my listed skills in that text. Send me the role anyway and I'll tell you honestly where I fit.</p>
              )}
              {result.learningHits.length > 0 && (
                <p className="mt-4 text-sm text-mute">
                  <Icon name="rocket" className="mr-1 inline size-4 text-brand-300" /> Currently learning: {result.learningHits.join(", ")}.
                </p>
              )}
              <a href="#contact" className="btn btn-ghost btn-sm mt-5">
                Talk to me about this role <Icon name="arrowRight" className="arrow size-4" />
              </a>
            </div>
          ) : (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-line p-6 text-center text-mute">
              <p>
                <Icon name="clipboard" className="mx-auto mb-3 size-8 text-brand-300" />
                Your match will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Tools and practices I use every day" lead="From careful manual testing to AI-assisted automation in CI.">
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal
            as="li"
            key={g.group}
            delay={(i % 3) * 80}
            className={`glass spotlight p-6 ${i === 0 || i === skillGroups.length - 1 ? "lg:col-span-2" : ""}`}
            onPointerMove={trackSpotlight}
          >
            <h3 className="flex items-center gap-3 text-lg font-bold text-ink">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-500/15 text-brand-200">
                <Icon name={groupIcon[g.group] ?? "check"} className="size-4.5" />
              </span>
              {g.group}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="chip hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/15 hover:text-white">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
      <JobMatch />
    </Section>
  );
}
