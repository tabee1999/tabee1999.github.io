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
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-accent-700 underline underline-offset-2">
          {part}
        </a>
      );
    }
    if (/@/.test(part) && /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="font-semibold text-accent-700 underline underline-offset-2">
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

export type ChatPanelProps = {
  open: boolean;
  /** Close and return focus to the chat button. */
  onClose: () => void;
  /** Close without moving focus (the visitor is following a link). */
  onDismiss: () => void;
};

/**
 * The chat window and its answers. Loaded only when someone opens (or hovers) the chat
 * button, so pages don't carry this code up front. Stays mounted once loaded, so the
 * conversation survives closing and reopening.
 */
export function ChatPanel({ open, onClose, onDismiss }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ai, setAi] = useState(false);
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

  const close = onClose;

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
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="panel-in fixed inset-x-3 top-20 bottom-3 z-50 flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_24px_60px_-20px_rgb(8_54_44/0.45)] sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(36rem,calc(100dvh-8rem))] sm:w-[24rem]"
          data-testid="chat-panel"
        >
          <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3">
            <span className="relative shrink-0">
              <picture>
                <source srcSet={`/${person.avatar}.webp`} type="image/webp" />
                <img src={`/${person.avatar}.jpg`} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
              </picture>
              <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-accent-500 ring-2 ring-paper" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="chat-title" className="truncate text-base font-bold text-ink">
                Ask about Tabeeda
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-mute" data-testid="chat-mode">
                {ai ? (
                  <>
                    <Icon name="sparkles" className="size-3.5 text-accent-600" /> AI assistant, answers from her CV
                  </>
                ) : (
                  "Quick answers from her CV"
                )}
              </p>
            </div>
            <button type="button" onClick={close} className="grid size-11 cursor-pointer place-items-center rounded-lg text-mute transition-colors hover:bg-accent-50 hover:text-ink" aria-label="Close chat">
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-log">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent-700 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line text-white">
                    <span className="sr-only">You: </span>
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="panel-in block max-w-[92%]" data-testid={m.id === 0 ? undefined : "chat-answer"}>
                  {m.note && <p className="mb-1.5 text-xs text-mute">{m.note}</p>}
                  <div className="rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line text-ink">
                    <span className="sr-only">Assistant: </span>
                    {linkify(m.text)}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <a
                          key={a.href + a.label}
                          href={a.href}
                          className="chip min-h-9 !bg-surface !text-xs font-semibold text-accent-800 hover:!border-accent-600"
                          {...(a.kind === "download" ? { download: "" } : {})}
                          {...(a.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          onClick={() => {
                            if (a.kind === "internal" && window.matchMedia("(max-width: 639px)").matches) onDismiss();
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
              <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-paper px-4 py-3" data-testid="chat-typing">
                <span className="sr-only">Assistant is typing</span>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot size-1.5 rounded-full bg-accent-600" style={{ animationDelay: `${i * 150}ms` }} aria-hidden="true" />
                ))}
              </div>
            )}

            {showSuggestions && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-semibold text-mute">Try asking</p>
                <ul className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button type="button" data-track="chat-question" onClick={() => void ask(s)} className="chip min-h-9 cursor-pointer !bg-surface text-left !text-xs hover:!border-accent-600 hover:text-accent-800">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-surface p-3">
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
                className="min-w-0 flex-1 rounded-xl border border-field bg-surface px-4 py-3 text-sm text-ink placeholder:text-mute/80 focus:border-accent-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl bg-accent-700 text-white transition-colors hover:bg-accent-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send question"
                data-track="chat-question"
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
