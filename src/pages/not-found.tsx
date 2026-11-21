export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] place-items-center pt-28 pb-16" aria-labelledby="nf-title">
      <div className="w-full max-w-xl">
        <p className="font-mono text-sm font-bold text-rose-700" aria-hidden="true">
          ✕ 1 failed
        </p>
        <h1 id="nf-title" className="mt-3 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          This page didn't pass QA
        </h1>
        <p className="mt-4 text-lg text-mute">The link may be old or mistyped (error 404). Here's where you can go instead.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">
            Go to the home page
          </a>
          <a href="/projects/" className="btn btn-ghost">
            See my projects
          </a>
        </div>
      </div>
    </section>
  );
}
