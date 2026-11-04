import { useEffect, useRef, useState } from "react";

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/**
 * Scales an element horizontally with how far the page has scrolled (0–1). Writes the style
 * directly instead of through React state, so scrolling doesn't re-render the header.
 */
export function useScrollProgressBar<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/** The id of the section currently in the middle of the screen. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Local times in several time zones, e.g. ["18:42", "16:42"]. Empty on the server. */
export function useLocalTimes(timeZones: string[]) {
  const key = timeZones.join("|");
  const [times, setTimes] = useState<string[]>(() => timeZones.map(() => ""));
  useEffect(() => {
    const zones = key.split("|");
    const format = () =>
      setTimes(
        zones.map((timeZone) => {
          try {
            return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date());
          } catch {
            return "";
          }
        }),
      );
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, [key]);
  return times;
}
