import { useRef, useState, type ComponentType } from "react";
import type { ChatPanelProps } from "./ChatPanel";
import { Icon } from "./Icon";

let panelModule: Promise<typeof import("./ChatPanel")> | undefined;

/**
 * The "Ask about me" button on every page. The chat window itself (and its answer engine)
 * downloads the first time someone hovers, focuses or opens the button.
 */
export function Chat() {
  const [open, setOpen] = useState(false);
  const [Panel, setPanel] = useState<ComponentType<ChatPanelProps> | null>(null);
  const launcher = useRef<HTMLButtonElement | null>(null);

  const load = () => {
    panelModule ??= import("./ChatPanel");
    void panelModule.then((m) => setPanel(() => m.ChatPanel));
  };

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={() => {
          if (open) close();
          else {
            setOpen(true);
            load();
          }
        }}
        onPointerEnter={load}
        onFocus={load}
        aria-expanded={open}
        aria-controls={open ? "chat-panel" : undefined}
        className="no-print fixed right-4 bottom-4 z-40 flex h-14 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent-700 px-4 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(8_54_44/0.7)] transition-colors hover:bg-accent-800 sm:right-6 sm:bottom-6 sm:px-5"
        data-testid="chat-launcher"
        data-track={open ? undefined : "chat-open"}
      >
        <Icon name={open ? "close" : "chat"} className="relative size-6" />
        <span className="sr-only sm:not-sr-only sm:relative">{open ? "Close chat" : "Ask about me"}</span>
      </button>

      {Panel && <Panel open={open} onClose={close} onDismiss={() => setOpen(false)} />}
    </>
  );
}
