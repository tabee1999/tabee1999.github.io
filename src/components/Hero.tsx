import { person, site, stats } from "../content";
import { CopyEmailButton } from "./CopyEmail";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * The hero's signature piece: her highlights written as a passing Playwright run.
 * Each line ticks in once on load (static for reduced motion and without JS it still shows).
 */
function TestRun() {
  const step = 200;
  const first = 350;
  return (
    <div className="rounded-2xl bg-pine text-pine-text shadow-[0_24px_48px_-20px_rgb(8_54_44/0.55)]" data-testid="test-run">
      <p className="border-b border-white/10 px-5 py-3 font-mono text-[0.8rem] text-pine-dim" aria-hidden="true">
        <span className="text-pine-tick">$</span> npx playwright test
      </p>
      <ul aria-label="Highlights" className="space-y-3 px-5 py-4">
        {stats.map((s, i) => (
          <li key={s.label} className="run-line flex gap-3" style={{ animationDelay: `${first + i * step}ms` }}>
            <span className="mt-[0.1rem] font-mono text-[0.95rem] leading-6 font-bold text-pine-tick" aria-hidden="true">
              ✓
            </span>
            <span className="leading-snug">
              <span className="block font-semibold text-white">
                {s.prefix ?? ""}
                {s.value}
                {s.suffix ?? ""} {lowerFirst(s.label)}
              </span>
              <span className="block text-sm text-pine-dim">{s.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 px-5 py-3">
        <p className="run-line font-mono text-[0.8rem] font-bold text-pine-tick" style={{ animationDelay: `${first + stats.length * step}ms` }} aria-hidden="true">
          {stats.length} passed
        </p>
        <a
          href={site.qualityReportPath}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-pine-tick/60 underline-offset-4 hover:decoration-pine-tick"
          data-testid="hero-report"
        >
          Open the live test report
        </a>
      </div>
    </div>
  );
}

/** The facts recruiters check first, in one place near the top. */
function QuickFacts() {
  const facts = [
    { label: "Roles", value: person.targetRoles.join(", ") },
    { label: "Experience", value: "5+ years, now Senior QA Engineer at Epicmetry" },
    { label: "Based in", value: person.location },
    { label: "Work authorisation", value: person.workAuthorisation },
    { label: "Open to", value: person.openTo },
    { label: "Employment", value: person.employment },
    { label: "Languages", value: person.languages },
    { label: "Time zones", value: person.timezones.map((t) => `${t.label} ${t.offset}`).join("; ") },
  ];
  return (
    <section aria-labelledby="facts-title" className="wrap mt-16 md:mt-20">
      <h2 id="facts-title" className="sr-only">
        Quick facts
      </h2>
      <dl className="grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4" data-testid="quick-facts">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-sm font-semibold text-mute">{f.label}</dt>
            <dd className="mt-1 leading-snug text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const iconLink =
  "grid size-11 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-mute transition-colors hover:border-accent-600 hover:text-accent-800";

export function Hero() {
  const [first, ...rest] = person.name.split(" ");
  return (
    <section id="top" aria-labelledby="hero-title" className="pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="wrap grid items-start gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="lg:pt-8">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent-700">
            <span className="size-2 rounded-full bg-accent-500" aria-hidden="true" />
            {person.available}
          </p>

          <h1 id="hero-title" className="mt-5">
            <span className="block text-[clamp(3.75rem,10vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-ink">
              <span className="block">{first}</span> <span className="block">{rest.join(" ")}</span>
            </span>{" "}
            <span className="mt-5 block text-[clamp(1.375rem,2.6vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em] text-accent-700">{person.role}</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute md:text-xl md:leading-relaxed">{person.heroLead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={person.cv} download className="btn btn-primary" data-testid="cta-cv">
              <Icon name="download" className="size-4" /> Download CV
            </a>
            <a href={`mailto:${person.email}`} className="btn btn-ghost" data-testid="cta-email">
              <Icon name="mail" className="size-4" /> Email me
            </a>
            <span className="flex items-center gap-2 sm:ml-1">
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" className={iconLink}>
                <LinkedInIcon className="size-[1.1rem]" />
              </a>
              <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" className={iconLink}>
                <GitHubIcon className="size-[1.1rem]" />
              </a>
              <CopyEmailButton className={iconLink} />
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[25rem] sm:max-w-[26rem] lg:mr-0 lg:ml-auto lg:max-w-[24rem]">
          <picture>
            <source srcSet={`/${person.photo}.webp`} type="image/webp" />
            <img
              src={`/${person.photo}.jpg`}
              alt={person.photoAlt}
              width={480}
              height={720}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full rounded-[1.75rem] bg-accent-100 object-cover object-top"
            />
          </picture>
          <div className="relative mx-3 -mt-24 sm:mx-6 lg:mx-0 lg:-mt-32 lg:-ml-28 lg:w-[21.5rem]">
            <TestRun />
          </div>
        </div>
      </div>

      <QuickFacts />
    </section>
  );
}
