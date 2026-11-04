import { setMotionPaused, useMotionPaused } from "../lib/motionPref";
import { Icon } from "./Icon";

/** Pauses or resumes the site's continuous animations. Hidden when the OS asks for reduced motion. */
export function MotionToggle({ className = "" }: { className?: string }) {
  const paused = useMotionPaused();
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-mute transition-colors hover:border-brand-400/60 hover:text-ink motion-reduce:hidden ${className}`}
      data-testid="motion-toggle"
    >
      <Icon name={paused ? "play" : "pause"} className="size-3.5" />
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
