import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { person, site } from "../content";
import { Clocks } from "./Clocks";
import { Reveal } from "../lib/motion";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";
import { CopyEmailButton } from "./Hero";

type Fields = { name: string; email: string; company: string; topic: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const topics = ["Full-time role", "Contract or freelance", "Something else"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!f.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL.test(f.email.trim())) e.email = "Please enter a valid email address, like name@company.com.";
  if (f.message.trim().length < 20) e.message = "Please write a message of at least 20 characters.";
  else if (f.message.length > 3000) e.message = "Please keep your message under 3,000 characters.";
  return e;
}

function mailtoHref(f: Fields) {
  const subject = `${f.topic}: message from ${f.name.trim()}${f.company.trim() ? ` (${f.company.trim()})` : ""}`;
  const body = `${f.message.trim()}\n\n${f.name.trim()}\n${f.email.trim()}${f.company.trim() ? `\n${f.company.trim()}` : ""}`;
  return `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-mute">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-300">
          <Icon name="close" className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border bg-night-950/60 px-4 py-3 text-ink placeholder:text-mute/60 transition-colors focus:border-brand-400 focus:outline-none aria-[invalid=true]:border-rose-400/70";

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", company: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "failed">("idle");
  const [mailto, setMailto] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: validate({ ...fields, [key]: value })[key] }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("website") as HTMLInputElement | null)?.value) return; // spam bot
    const found = validate(fields);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }

    const showResult = () => window.setTimeout(() => resultRef.current?.focus(), 50);

    if (!site.formEndpoint) {
      const href = mailtoHref(fields);
      setMailto(href);
      setStatus("mailto");
      showResult();
      // Tests swap in window.__openMail to check the email without opening a mail app.
      const openMail = (window as unknown as { __openMail?: (href: string) => void }).__openMail;
      if (openMail) openMail(href);
      else window.location.href = href;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, _subject: `${fields.topic}: message from ${fields.name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setMailto(mailtoHref(fields));
      setStatus("failed");
    }
    showResult();
  };

  const reset = () => {
    setFields({ name: "", email: "", company: "", topic: topics[0], message: "" });
    setStatus("idle");
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>("#contact-name")?.focus(), 50);
  };

  const done = status === "sent" || status === "mailto" || status === "failed";

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 py-16 md:py-24">
      <div className="wrap">
        <div className="glass relative overflow-hidden p-6 md:p-10 lg:p-12">
          <div className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-brand-600/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-indigo-600/25 blur-3xl" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
            <Reveal>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title" className="mt-2 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
                Let's work <span className="text-gradient">together</span>
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">
                Hiring a QA engineer, or need someone to take quality off your plate? Send me a message about the role or project.
              </p>

              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3 pr-2">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-200">
                    <Icon name="mail" className="size-5" />
                  </span>
                  <a href={`mailto:${person.email}`} className="min-w-0 flex-1 truncate font-semibold text-ink hover:text-brand-200" data-testid="contact-email">
                    {person.email}
                  </a>
                  <CopyEmailButton className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-mute transition hover:bg-white/5 hover:text-ink" />
                </li>
                <li>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3 transition hover:border-brand-400/50"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-200">
                      <LinkedInIcon className="size-5" />
                    </span>
                    <span className="flex-1 font-semibold text-ink">Connect on LinkedIn</span>
                    <Icon name="arrowUpRight" className="mr-2 size-4 text-mute transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li className="grid grid-cols-2 gap-3">
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3 font-semibold text-ink transition hover:border-brand-400/50"
                  >
                    <GitHubIcon className="size-5 text-brand-200" /> GitHub
                  </a>
                  <a
                    href={person.cv}
                    download
                    className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-3 font-semibold text-ink transition hover:border-brand-400/50"
                    data-testid="contact-cv"
                  >
                    <Icon name="download" className="size-5 text-brand-200" /> CV (PDF)
                  </a>
                </li>
              </ul>

              <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
                <span>
                  {person.available}: {person.targetRoles.join(", ")}. {person.openTo}. Local time: <Clocks />.
                </span>
              </p>
            </Reveal>

            <Reveal delay={120}>
              {done ? (
                <div
                  ref={resultRef}
                  tabIndex={-1}
                  className="panel-in flex h-full flex-col justify-center rounded-2xl border border-line bg-night-950/40 p-6 md:p-8"
                  data-testid="contact-result"
                  role="status"
                >
                  <span className={`grid size-14 place-items-center rounded-full ${status === "failed" ? "bg-rose-400/15 text-rose-300" : "bg-ok/15 text-ok"}`}>
                    <Icon name={status === "failed" ? "close" : "check"} className="size-7" />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold text-ink">
                    {status === "sent" ? "Thanks, your message is on its way" : status === "mailto" ? "Your email is ready to send" : "That didn't send"}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mute">
                    {status === "sent"
                      ? "I'll get back to you by email."
                      : status === "mailto"
                        ? "Your email app should have opened with the message filled in. Press send there and it reaches me directly."
                        : "Something went wrong on the way. You can send the same message from your email app instead."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {mailto && status !== "sent" && (
                      <a href={mailto} className="btn btn-primary btn-sm" data-testid="mailto-link">
                        <Icon name="mail" className="size-4" /> Open in email app
                      </a>
                    )}
                    <button type="button" onClick={reset} className="btn btn-ghost btn-sm">
                      Write another message
                    </button>
                  </div>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="contact-note" data-testid="contact-form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="contact-name" label="Your name" error={errors.name}>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        required
                        value={fields.name}
                        onChange={set("name")}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={`${inputClass} border-line`}
                      />
                    </Field>
                    <Field id="contact-email" label="Email" error={errors.email}>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        value={fields.email}
                        onChange={set("email")}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={`${inputClass} border-line`}
                      />
                    </Field>
                  </div>
                  <Field id="contact-company" label="Company" optional>
                    <input
                      id="contact-company"
                      name="company"
                      autoComplete="organization"
                      value={fields.company}
                      onChange={set("company")}
                      className={`${inputClass} border-line`}
                    />
                  </Field>

                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-ink">What's it about?</legend>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <label key={t} className="cursor-pointer">
                          <input type="radio" name="topic" value={t} checked={fields.topic === t} onChange={set("topic")} className="peer sr-only" />
                          <span className="chip !px-4 !py-2 !text-sm font-semibold peer-checked:!border-brand-400 peer-checked:!bg-brand-500/25 peer-checked:!text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-300 hover:border-brand-400/60">
                            {t}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field id="contact-message" label="Message" error={errors.message}>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={fields.message}
                      onChange={set("message")}
                      placeholder="Tell me about the role, the product and your team…"
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={`${inputClass} resize-y border-line`}
                    />
                  </Field>

                  {/* Honeypot: hidden from people, filled in by bots */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p id="contact-note" className="text-sm text-mute">
                      {site.formEndpoint ? "Your message goes straight to my inbox." : "Sends from your own email app, so you get a copy."}
                    </p>
                    <button type="submit" className="btn btn-primary" disabled={status === "sending"} data-testid="contact-submit">
                      {status === "sending" ? "Sending…" : "Send message"}
                      <Icon name="send" className="arrow size-4" />
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
