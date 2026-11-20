import { useState } from "react";
import { skillGroups } from "../content";
import { gapsIn, matchJob } from "../lib/match";
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
  const [result, setResult] = useState<(ReturnType<typeof matchJob> & { gaps: ReturnType<typeof gapsIn> }) | null>(null);
  const [error, setError] = useState("");

  return (
    <div className="mt-14 rounded-[1.25rem] border border-accent-200 bg-accent-50 p-6 md:p-8" data-testid="job-match">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-bold tracking-[-0.015em] text-ink">Check my fit for your role</h3>
          <p className="mt-2 text-mute">Paste a job description to see which skills it asks for are on my CV, and which aren't yet. Nothing is sent anywhere: it runs in your browser.</p>
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
              setResult({ ...matchJob(text), gaps: gapsIn(text) });
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
              className="w-full resize-y rounded-xl border border-field bg-surface px-4 py-3 text-ink placeholder:text-mute/80 focus:border-accent-600 focus:outline-none aria-[invalid=true]:border-rose-700"
            />
            {error && (
              <p id="job-error" className="text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primary btn-sm" data-track="job-match">
                Check my fit
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
              {result.matched.length + result.gaps.length > 0 ? (
                <>
                  <p className="text-ink" data-testid="job-summary">
                    <span className="text-4xl font-extrabold tracking-[-0.02em] text-accent-700">{result.matched.length}</span>
                    <span className="text-2xl font-bold text-mute"> / {result.matched.length + result.gaps.length + result.learningHits.length}</span>
                    <span className="mt-1 block">skills and tools in this job ad that are on my CV</span>
                  </p>
                  {result.matched.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="On my CV">
                      {result.matched.map((m) => (
                        <li key={m} className="chip !border-accent-200 !bg-surface">
                          <Icon name="check" className="size-3.5 text-ok" /> {m}
                        </li>
                      ))}
                    </ul>
                  )}
                  {result.gaps.length > 0 && (
                    <div className="mt-5" data-testid="job-gaps">
                      <p className="text-sm font-semibold text-ink">Not on my CV yet</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-mute">
                        {result.gaps.map((g) => (
                          <li key={g.tool} className="flex gap-2">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                            <span>
                              <span className="font-semibold text-ink">{g.tool}</span>
                              {g.closest ? ` · closest experience: ${g.closest}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-ink">I couldn't spot any of my listed skills in that text. Send me the role anyway and I'll tell you honestly where I fit.</p>
              )}
              {result.learningHits.length > 0 && (
                <p className="mt-4 text-sm text-mute">
                  <Icon name="rocket" className="mr-1 inline size-4 text-accent-600" /> Currently learning: {result.learningHits.join(", ")}.
                </p>
              )}
              <a href="#contact" className="btn btn-ghost btn-sm mt-5">
                Talk to me about this role
              </a>
            </div>
          ) : (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-accent-300 p-6 text-center text-mute">
              <p>
                <Icon name="clipboard" className="mx-auto mb-3 size-8 text-accent-500" />
                Your match will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <Section id="skills" title="Tools and practices I use every day" lead="From careful manual testing to AI-assisted automation in CI.">
      <ul className="border-t border-line">
        {skillGroups.map((g) => (
          <li key={g.group} className="grid gap-4 border-b border-line py-6 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8">
            <h3 className="flex items-center gap-3 font-bold text-ink md:text-lg">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-50 text-accent-700">
                <Icon name={groupIcon[g.group] ?? "check"} className="size-4.5" />
              </span>
              {g.group}
            </h3>
            <ul className="flex flex-wrap content-start gap-2">
              {g.items.map((s) => (
                <li key={s} className="chip !bg-surface !px-3 !py-1 !text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <JobMatch />
    </Section>
  );
}
