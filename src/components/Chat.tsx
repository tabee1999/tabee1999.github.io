import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { person, site } from "../content";
import { answer, suggestions, type ChatAction } from "../lib/assistant";
import { Icon } from "./Icon";

type Message = { id: number; role: "user" | "assistant"; text: string; actions?: ChatAction[]; note?: string };

const MAX_LENGTH = 500;
const welcome: Message = {
  id: 0,
  role: "assistant",
  text: `Hi! I'm Tabeeda's assistant. Ask me about her experience, skills, projects or availability.`,
};

/** The AI chat address: site.chatEndpoint, or one a test sets on window. */
function chatEndpoint() {
  const fromTest = typeof window !== "undefined" ? (window as unknown as { __chatEndpoint?: string }).__chatEndpoint : undefined;
  return fromTest || site.chatEndpoint;
}

/** Turns emails and web addresses in a reply into links. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+\w)/g).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-brand-200 underline underline-offset-2">
          {part}
        </a>
      );
    }
    if (/@/.test(part) && /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-brand-200 underline underline-offset-2">
          {part}
        </a>
      );
    }
    return part;
  });
}

/** Strips the markdown an AI model sometimes adds, since replies show as plain text. */
const plain = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .trim();

async function askAi(endpoint: string, history: Message[]) {
  const messages = history
    .filter((m) => m.id !== 0)
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.text }));
  while (messages.length && messages[0].role !== "user") messages.shift();

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
    if (res.ok && typeof data.reply === "string" && data.reply.trim()) return { reply: plain(data.reply) };
    return { error: res.status === 429 ? "busy" : "unavailable" };
  } catch {
    return { error: "unavailable" };
  } finally {
    window.clearTimeout(timer);
  }
}

export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ai, setAi] = useState(false);
  const launcher = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => setAi(!!chatEndpoint()), []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, thinking]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  const ask = async (question: string) => {
    const q = question.trim().slice(0, MAX_LENGTH);
    if (!q || thinking) return;
    const userMessage: Message = { id: nextId.current++, role: "user", text: q };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setThinking(true);

    const endpoint = chatEndpoint();
    let reply: Message;
    if (endpoint) {
      const result = await askAi(endpoint, history);
      if ("reply" in result && result.reply) {
        reply = { id: nextId.current++, role: "assistant", text: result.reply };
      } else {
        const fallback = answer(q);
        reply = {
          id: nextId.current++,
          role: "assistant",
          text: fallback.text,
          actions: fallback.actions,
          note: result.error === "busy" ? "Lots of questions right now, so here's a quick answer from her CV." : "The AI assistant isn't available right now, so here's a quick answer from her CV.",
        };
      }
    } else {
      await new Promise((r) => window.setTimeout(r, 350));
      const a = answer(q);
      reply = { id: nextId.current++, role: "assistant", text: a.text, actions: a.actions };
    }
    setMessages((m) => [...m, reply]);
    setThinking(false);
    inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  const showSuggestions = !thinking && messages.length === 1;

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={open ? "chat-panel" : undefined}
        className="no-print group fixed right-4 bottom-4 z-40 flex h-14 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-4 font-semibold text-white shadow-xl shadow-brand-700/40 transition hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6 sm:px-5"
        data-testid="chat-launcher"
      >
        {!open && <span className="chat-ping absolute inset-0 rounded-full" aria-hidden="true" />}
        <Icon name={open ? "close" : "chat"} className="relative size-6" />
        <span className="sr-only sm:not-sr-only sm:relative">{open ? "Close chat" : "Ask about me"}</span>
      </button>

      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="panel-in fixed inset-x-3 top-20 bottom-3 z-50 flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-night-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(36rem,calc(100dvh-8rem))] sm:w-[24rem]"
          data-testid="chat-panel"
        >
          <div className="flex items-center gap-3 border-b border-line bg-white/[0.03] px-4 py-3">
            <span className="relative shrink-0">
              <picture>
                <source srcSet={`/${person.avatar}.webp`} type="image/webp" />
                <img src={`/${person.avatar}.jpg`} alt="" width={40} height={40} className="size-10 rounded-full object-cover ring-2 ring-brand-400/50" />
              </picture>
              <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-ok ring-2 ring-night-900" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="chat-title" className="truncate text-base font-bold text-ink">
                Ask about Tabeeda
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-mute" data-testid="chat-mode">
                {ai ? (
                  <>
                    <Icon name="sparkles" className="size-3.5 text-brand-300" /> AI assistant · answers from her CV
                  </>
                ) : (
                  "Quick answers from her CV"
                )}
              </p>
            </div>
            <button type="button" onClick={close} className="grid size-10 cursor-pointer place-items-center rounded-full text-mute transition hover:bg-white/5 hover:text-ink" aria-label="Close chat">
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-log">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-brand-500 to-brand-700 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line text-white">
                    <span className="sr-only">You: </span>
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="swap-in block max-w-[92%]" data-testid={m.id === 0 ? undefined : "chat-answer"}>
                  {m.note && <p className="mb-1.5 text-xs text-mute">{m.note}</p>}
                  <div className="rounded-2xl rounded-bl-md border border-line bg-white/[0.05] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line text-ink">
                    <span className="sr-only">Assistant: </span>
                    {linkify(m.text)}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <a
                          key={a.href + a.label}
                          href={a.href}
                          className="chip !text-xs font-semibold hover:border-brand-400/60 hover:bg-brand-500/15 hover:text-white"
                          {...(a.kind === "download" ? { download: "" } : {})}
                          {...(a.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          onClick={() => {
                            if (a.kind === "internal" && window.matchMedia("(max-width: 639px)").matches) setOpen(false);
                          }}
                        >
                          {a.label}
                          {a.kind === "external" && <Icon name="arrowUpRight" className="size-3" />}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {thinking && (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-white/[0.05] px-4 py-3" data-testid="chat-typing">
                <span className="sr-only">Assistant is typing</span>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot size-1.5 rounded-full bg-brand-300" style={{ animationDelay: `${i * 150}ms` }} aria-hidden="true" />
                ))}
              </div>
            )}

            {showSuggestions && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-semibold text-mute">Try asking</p>
                <ul className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => void ask(s)} className="chip cursor-pointer text-left !text-xs hover:border-brand-400/60 hover:bg-brand-500/15 hover:text-white active:scale-95">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-night-950/40 p-3">
            <div className="flex items-center gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_LENGTH}
                autoComplete="off"
                placeholder="Ask a question…"
                className="min-w-0 flex-1 rounded-full border border-line bg-night-950/70 px-4 py-3 text-sm text-ink placeholder:text-mute/70 focus:border-brand-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send question"
              >
                <Icon name="send" className="size-4.5" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[0.7rem] leading-snug text-mute">
              {ai ? "Powered by Claude. Answers may be imperfect, so check the CV for details. Please don't share personal information." : "Answers come from her CV and this site. For anything else, email her."}
            </p>
          </form>
        </div>
      )}
    </>
  );
}
