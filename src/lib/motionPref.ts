// "Pause animations" setting. WCAG 2.2.2 asks for a way to stop content that moves on its own
// for more than 5 seconds (the tool strip, the rotating words, the floating cards). The choice
// is remembered in this browser; people with "reduce motion" turned on never see animation.

import { useSyncExternalStore } from "react";

const KEY = "motion-paused";
const listeners = new Set<() => void>();
let paused = false;

function apply(value: boolean) {
  paused = value;
  document.documentElement.classList.toggle("motion-paused", value);
  listeners.forEach((l) => l());
}

export function setMotionPaused(value: boolean) {
  apply(value);
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    // storage blocked (private mode): the setting just won't be remembered
  }
}

/** Restores the visitor's choice before React hydrates. */
export function initMotionPref() {
  try {
    if (localStorage.getItem(KEY) === "1") apply(true);
  } catch {
    // ignore
  }
}

export function useMotionPaused() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => paused,
    () => false,
  );
}
