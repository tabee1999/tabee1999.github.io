// Scroll-driven animation engine. Each animated section gets a progress value from 0 to 1 as
// you scroll, written to the CSS variable --p (so most motion is plain CSS) and passed to an
// optional callback for the parts drawn in script (the trail and the particles).
//
// One passive scroll listener and one requestAnimationFrame per frame serve every section.
// When the visitor prefers reduced motion (no "motion" class on <html>) everything shows its
// finished state and nothing moves. Without JavaScript the CSS default (--p: 1) does the same.

import { useEffect, type RefObject } from "react";

export type ScrollMode =
  /** A tall section with a sticky stage: 0 when its top reaches the top of the screen, 1 when its bottom does. */
  | { kind: "pin" }
  /** Plays while the element's top travels from `from` to `to` (fractions of the screen height). */
  | { kind: "view"; from: number; to: number }
  /** How much of the element a line at `anchor` (fraction of the screen height) has passed. */
  | { kind: "track"; anchor: number };

type Sub = { el: HTMLElement; mode: ScrollMode; onProgress?: (p: number, el: HTMLElement) => void; last: number };

const subs = new Set<Sub>();
let frame = 0;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export const motionAllowed = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion");

function progressOf(s: Sub, vh: number) {
  const r = s.el.getBoundingClientRect();
  if (s.mode.kind === "pin") {
    const range = r.height - vh;
    return range > 0 ? clamp01(-r.top / range) : r.top <= 0 ? 1 : 0;
  }
  if (s.mode.kind === "track") return r.height > 0 ? clamp01((vh * s.mode.anchor - r.top) / r.height) : 0;
  const { from, to } = s.mode;
  return clamp01((vh * from - r.top) / (vh * (from - to)));
}

function update(force = false) {
  frame = 0;
  const vh = window.innerHeight;
  for (const s of subs) {
    const p = progressOf(s, vh);
    if (!force && Math.abs(p - s.last) < 0.0005) continue;
    s.last = p;
    s.el.style.setProperty("--p", p.toFixed(4));
    s.onProgress?.(p, s.el);
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(() => update());
};
const scheduleForced = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => update(true));
};

/**
 * Drives `ref`'s --p from the scroll position. `onProgress` runs on every change (and once at
 * the start); keep it cheap and write to the DOM directly rather than to React state.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: ScrollMode, onProgress?: (p: number, el: HTMLElement) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) {
      el.style.setProperty("--p", "1");
      onProgress?.(1, el);
      return;
    }
    const sub: Sub = { el, mode, onProgress, last: -1 };
    subs.add(sub);
    if (subs.size === 1) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", scheduleForced);
    }
    scheduleForced();
    return () => {
      subs.delete(sub);
      if (subs.size === 0) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", scheduleForced);
      }
    };
    // The mode and callback are fixed for the life of each section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

/** Re-measure every section now (after layout changes such as an accordion opening). */
export const refreshScroll = () => {
  if (subs.size) scheduleForced();
};

/** 0 before `a`, 1 after `b`, linear between: the scripted twin of the CSS `seg()` pattern. */
export const segment = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const n = (x: number) => +x.toFixed(4);

/** CSS for "0 before a, 1 after b" from the section's --p (1 when nothing is driving it). */
export const seg = (a: number, b: number) => `clamp(0, (var(--p, 1) - ${n(a)}) / ${n(b - a)}, 1)`;

/** CSS that rises from 0 to 1 between a and b, then falls back to 0 between c and d. */
export const span = (a: number, b: number, c: number, d: number) => `min(${seg(a, b)}, 1 - ${seg(c, d)})`;
