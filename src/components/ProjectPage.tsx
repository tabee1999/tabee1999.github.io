import { caseStudies, experience, person, projectPath, projects, type Project } from "../content";
import { Icon } from "./Icon";
import { Breadcrumb } from "./Layout";
import { ProjectVisual } from "./Projects";

/** One project's own page (/projects/<slug>/): what was tested, my role, and the longer story. */
export function ProjectPage({ project }: { project: Project }) {
  const job = experience.find((j) => j.company === project.company);
  const study = caseStudies.find((c) => c.slug === project.caseStudy);
  const others = projects.filter((p) => p.slug !== project.slug);
  const host = project.url ? new URL(project.url).hostname.replace(/^(www|app)\./, "") : "";

  return (
    <article className="pt-28 pb-12 md:pt-32 md:pb-16" aria-labelledby="project-title" data-testid="project-page">
      <div className="wrap">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects/" }, { label: project.name }]} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <header className="hero-in">
            <p className="text-sm font-semibold text-accent-700">
              {project.name}
              <span className="font-normal text-mute">, {project.company}</span>
            </p>
            <h1 id="project-title" className="mt-3 text-[clamp(2.1rem,4.6vw,3.25rem)] leading-[1.06] font-extrabold tracking-[-0.035em]">
              {project.headline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-mute md:text-xl">{project.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
              {project.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm mt-7">
                Visit {host}
                <Icon name="arrowUpRight" className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </header>

          <div className="card p-3">
            <ProjectVisual kind={project.visual} />
            <dl className="grid gap-4 px-3 pt-5 pb-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-mute">Platforms</dt>
                <dd className="mt-1 text-ink">{project.platforms.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-mute">Testing</dt>
                <dd className="mt-1 text-ink">{project.categories.join(", ")}</dd>
              </div>
              {job && (
                <>
                  <div>
                    <dt className="text-sm font-semibold text-mute">My role</dt>
                    <dd className="mt-1 text-ink">{job.role}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-mute">When</dt>
                    <dd className="mt-1 text-ink">{job.period}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <section aria-labelledby="delivered-title">
            <h2 id="delivered-title" className="text-2xl font-bold">
              What I delivered
            </h2>
            <ul className="mt-5 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-lg text-ink">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent-50 text-ok">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {job && (
            <section aria-labelledby="company-title">
              <h2 id="company-title" className="text-2xl font-bold">
                About {job.company}
              </h2>
              {job.about && <p className="mt-4 leading-relaxed text-mute">{job.about}</p>}
              <p className="mt-3 leading-relaxed text-mute">
                {job.role}, {job.period} ({job.location.replace(" · ", ", ")}). {job.summary}
              </p>
              <a href="/experience/" className="link mt-4 inline-block font-semibold">
                See my full experience
              </a>
            </section>
          )}
        </div>

        {study && (
          <section aria-labelledby="story-title" className="mt-12 rounded-[1.25rem] bg-pine p-6 text-pine-text md:p-10">
            <p className="text-sm font-semibold text-pine-tick">Case study: {study.area}</p>
            <h2 id="story-title" className="mt-2 text-2xl font-bold tracking-[-0.015em] text-white md:text-3xl">
              {study.title}
            </h2>
            <p className="mt-3 max-w-2xl text-pine-dim">{study.summary}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Results">
              {study.metrics.map((m) => (
                <li key={m.label} className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-2xl font-extrabold text-pine-tick">{m.value}</p>
                  <p className="mt-1 text-sm text-pine-dim">{m.label}</p>
                </li>
              ))}
            </ul>
            <a href={`/case-studies/${study.slug}/`} className="btn mt-7 bg-pine-tick text-ink hover:bg-white">
              Read the case study
            </a>
          </section>
        )}

        <section aria-labelledby="more-title" className="mt-14">
          <h2 id="more-title" className="text-2xl font-bold">
            More QA projects
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <a href={projectPath(p.slug)} className="card group block h-full p-5 transition-colors hover:border-accent-400">
                  <span className="block text-sm text-mute">
                    {p.company}, {p.domain}
                  </span>
                  <span className="mt-1 block font-bold text-ink group-hover:text-accent-800">{p.headline}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-5 rounded-[var(--radius-card)] bg-accent-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="text-lg font-bold text-ink">Need this kind of QA on your team?</p>
          <div className="flex flex-wrap gap-3">
            <a href="/contact/" className="btn btn-primary btn-sm">
              Contact me
            </a>
            <a href={`/${person.cv}`} download className="btn btn-ghost btn-sm">
              <Icon name="download" className="size-4" /> Download CV
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
