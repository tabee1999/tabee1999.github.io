import { person, stats } from "../content";
import { CountUp, Reveal, trackSpotlight, useParallax, useRotatingIndex } from "../lib/motion";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";
import { useToast } from "./Layout";

const tools = [
  "Playwright",
  "Selenium",
  "RestAssured",
  "Postman",
  "TestNG",
  "Java",
  "SQL",
  "GitHub Actions",
  "Azure DevOps",
  "Jenkins",
  "JMeter",
  "OWASP ZAP",
  "Jira",
  "TestRail",
  "AI-assisted testing",
];

export function CopyEmailButton({ className = "" }: { className?: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className={className}
      data-testid="copy-email"
      aria-label={`Copy email address ${person.email}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(person.email);
          toast("Email address copied");
        } catch {
          window.location.href = `mailto:${person.email}`;
        }
      }}
    >
      <Icon name="copy" className="size-5" />
    </button>
  );
}

function RotatingWord() {
  const index = useRotatingIndex(person.rotating.length, 2600);
  const word = person.rotating[index];
  return (
    <span className="relative inline-flex min-w-[11ch] text-brand-200" aria-live="off">
      <span key={word} className="swap-in font-semibold">
        {word}
      </span>
    </span>
  );
}

function HeroPhoto() {
  const parallax = useParallax<HTMLDivElement>(-0.06);
  return (
    <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem] lg:mx-0 lg:ml-auto">
      {/* Decorative rings and glow behind the photo */}
      <div className="pointer-events-none absolute -inset-10 -z-10" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-brand-600/30 blur-3xl" />
        <svg viewBox="0 0 400 400" className="animate-spin-slow absolute inset-0 size-full opacity-60">
          <circle cx="200" cy="200" r="192" fill="none" stroke="url(#ring)" strokeWidth="1.5" strokeDasharray="4 10" />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c4b5fd" />
              <stop offset="1" stopColor="#6d28d9" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={parallax} className="relative">
        {/* Gradient arch with the photo inside */}
        <div className="hero-photo-frame relative bg-gradient-to-b from-brand-400 via-brand-600 to-indigo-700 p-[3px] shadow-2xl shadow-brand-900/50">
          <div className="hero-photo-frame relative overflow-hidden bg-night-800">
            <picture>
              <source srcSet={`/${person.photo}.webp`} type="image/webp" />
              <img
                src={`/${person.photo}.jpg`}
                alt={person.photoAlt}
                width={480}
                height={720}
                fetchPriority="high"
                decoding="async"
                className="aspect-[2/3] w-full object-cover"
              />
            </picture>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950/80 to-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* Floating chips */}
        <div className="animate-float float-card absolute top-[14%] -left-6 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl sm:-left-12" aria-hidden="true">
          <span className="grid size-8 place-items-center rounded-lg bg-ok/15 text-ok">
            <Icon name="check" className="size-4.5" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-bold text-ink">300+ tests</span>
            <span className="block text-xs text-mute">passing in CI</span>
          </span>
        </div>
        <div
          className="animate-float-slow float-card absolute top-[46%] -right-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl sm:-right-10"
          style={{ animationDelay: "1.2s" }}
          aria-hidden="true"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand-500/20 text-brand-200">
            <Icon name="sparkles" className="size-4.5" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-bold text-ink">AI-first QA</span>
            <span className="block text-xs text-mute">faster test design</span>
          </span>
        </div>
        <div
          className="animate-float float-card absolute bottom-[10%] -left-4 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl sm:flex sm:-left-14"
          style={{ animationDelay: "2.4s" }}
          aria-hidden="true"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-rose-400/15 text-rose-300">
            <Icon name="bug" className="size-4.5" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-bold text-ink">Bugs caught</span>
            <span className="block text-xs text-mute">before your users</span>
          </span>
        </div>
      </div>

      {/* Handwritten quote */}
      <figure className="relative mt-6 flex items-start justify-end gap-2 pr-2 lg:-mr-4">
        <svg viewBox="0 0 80 50" className="mt-1 h-10 w-16 shrink-0 text-brand-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M76 40C52 44 22 36 10 10" />
          <path d="M4 18L10 9l9 4" />
        </svg>
        <blockquote className="hand max-w-[15rem] -rotate-3 text-[1.65rem] leading-[1.05] text-brand-200">“{person.quote}”</blockquote>
      </figure>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-10 md:pt-36 lg:pb-16">
      {/* Background grid and glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(167 139 250 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(167 139 250 / 0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="max-w-[44rem]">
          <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.04] py-1.5 pr-4 pl-2 text-sm text-mute">
            <span className="relative flex size-2.5">
              <span className="animate-pulse-dot absolute inline-flex size-full rounded-full bg-ok" />
              <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
            </span>
            <span>
              <strong className="font-semibold text-ink">{person.available}</strong> · Remote or relocation
            </span>
          </p>

          <h1 id="hero-title" className="mt-6 font-extrabold tracking-[-0.035em]">
            <span className="animate-rise block text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] text-ink" style={{ animationDelay: "80ms" }}>
              Hi, I'm {person.name}
            </span>
            <span className="animate-rise text-gradient block pb-1 text-[clamp(2.5rem,5.4vw,3.75rem)] leading-[1.05]" style={{ animationDelay: "160ms" }}>
              {person.role}
            </span>
          </h1>

          <p className="animate-rise mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg text-mute" style={{ animationDelay: "240ms" }}>
            <span className="font-mono text-sm tracking-wide text-brand-300 uppercase">{person.tagline}</span>
            <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
            <span>
              5+ years in <RotatingWord />
            </span>
          </p>

          <p className="animate-rise mt-5 max-w-xl text-lg leading-relaxed text-mute" style={{ animationDelay: "320ms" }}>
            {person.heroLead}
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "400ms" }}>
            <a href="#projects" className="btn btn-primary" data-testid="cta-work">
              View my work <Icon name="arrowRight" className="arrow size-4" />
            </a>
            <a href={person.cv} download className="btn btn-ghost" data-testid="cta-cv">
              <Icon name="download" className="size-4" /> Download CV
            </a>
            <div className="flex items-center gap-2 sm:ml-2">
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in a new tab)"
                className="grid size-11 place-items-center rounded-full border border-line text-mute transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-ink"
              >
                <LinkedInIcon className="size-[1.1rem]" />
              </a>
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile (opens in a new tab)"
                className="grid size-11 place-items-center rounded-full border border-line text-mute transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-ink"
              >
                <GitHubIcon className="size-[1.1rem]" />
              </a>
              <CopyEmailButton className="grid size-11 cursor-pointer place-items-center rounded-full border border-line text-mute transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-ink" />
            </div>
          </div>

          <dl className="animate-rise mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ animationDelay: "480ms" }}>
            <div className="text-mute">
              <dt className="sr-only">Location</dt>
              <dd className="flex items-center gap-2">
                <Icon name="mapPin" className="size-4 text-brand-300" />
                {person.location}
              </dd>
            </div>
            <div className="text-mute">
              <dt className="sr-only">Current role</dt>
              <dd className="flex items-center gap-2">
                <Icon name="briefcase" className="size-4 text-brand-300" />
                Senior QA Engineer at Epicmetry
              </dd>
            </div>
          </dl>
        </div>

        <div className="animate-rise" style={{ animationDelay: "200ms" }}>
          <HeroPhoto />
        </div>
      </div>

      {/* Stat cards */}
      <div className="wrap mt-14 md:mt-20">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" aria-label="Highlights">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 90} className="glass spotlight p-5 md:p-6" onPointerMove={trackSpotlight}>
              <p className="text-gradient text-3xl font-extrabold tracking-tight md:text-4xl">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-semibold text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-mute">{s.detail}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Tool marquee */}
      <div className="mt-14 border-y border-line bg-white/[0.02] py-5 md:mt-20">
        <div className="marquee group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="marquee-track flex shrink-0 items-center gap-10 pr-10"
              aria-label={copy === 0 ? "Tools I use" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {tools.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap text-mute">
                  <span className="size-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

    </section>
  );
}
