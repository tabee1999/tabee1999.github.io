// A small, dependency-free motion layer: scroll reveals, count-ups and pointer effects.
// Everything respects prefers-reduced-motion, and content is always visible in the
// pre-rendered HTML (for search engines, no-JS visitors and print).

import { createElement, useEffect, useRef, useState, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from "react";
import { useMotionPaused } from "./motionPref";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when an element starts below the visible area, so it's worth animating in. */
function startsBelowFold(el: Element) {
  return el.getBoundingClientRect().top > window.innerHeight * 0.92;
}

/**
 * Calls `cb` once, the first time `el` scrolls into view. Also fires if the page jumps
 * past the element (an anchor link or a fast fling), so nothing is left hidden above.
 */
function onceInView(el: Element, cb: () => void, rootMargin = "0px", threshold = 0) {
  let done = false;
  let raf = 0;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    cb();
  };
  const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && fire(), { rootMargin, threshold });
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) fire();
    });
  };
  function cleanup() {
    io.disconnect();
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
  }
  io.observe(el);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    done = true;
    cleanup();
  };
}

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

/** Fades and slides children up the first time they scroll into view. */
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"rest" | "pending" | "in">("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !("IntersectionObserver" in window) || !startsBelowFold(el)) return;
    setState("pending");
    return onceInView(el, () => setState("in"), "0px 0px -8% 0px");
  }, []);

  const motionClass = state === "pending" ? "reveal-pending" : state === "in" ? "reveal-in" : "";
  const style = delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined;
  return createElement(as, { ref, className: [className, motionClass].filter(Boolean).join(" ") || undefined, style, ...rest }, children);
}

/** Counts a number up from 0 when it scrolls into view. Renders the final value on the server. */
export function CountUp({ value, prefix = "", suffix = "", duration = 1400 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !("IntersectionObserver" in window)) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(value * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    setShown(0);
    const stop = onceInView(el, run, "0px", 0.6);
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  // Screen readers get the final number once, not every frame of the animation.
  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {prefix}
        {shown.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-US")}
        {suffix}
      </span>
    </span>
  );
}

/** Pointer handler that moves the .spotlight glow to follow the cursor. */
export function trackSpotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Moves an element slightly as the page scrolls, for depth. */
export function useParallax<T extends HTMLElement>(strength = 0.08) {
  const ref = useRef<T | null>(null);
  const paused = useMotionPaused();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (paused || reducedMotion()) {
      el.style.transform = "";
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${Math.round(window.scrollY * strength)}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength, paused]);
  return ref;
}

/** Cycles through words on a timer (paused for reduced motion). */
export function useRotatingIndex(length: number, interval = 2400) {
  const [index, setIndex] = useState(0);
  const paused = useMotionPaused();
  useEffect(() => {
    if (paused || reducedMotion() || length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), interval);
    return () => window.clearInterval(id);
  }, [length, interval, paused]);
  return index;
}
