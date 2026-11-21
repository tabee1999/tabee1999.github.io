import { useEffect, useRef } from "react";
import { motionAllowed } from "../lib/scroll";

/**
 * The hero's background: a field of test points. A scan beam sweeps down it; a few points
 * turn red just before it arrives (bugs), and the beam turns them green with a ripple
 * (fixed). Points near the pointer light up. Runs only while the hero is on screen and the
 * tab is visible; with reduced motion it's drawn once, still.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const GAP = 26;
    const PERIOD = 6500;
    const BUGS = 4;
    const animate = motionAllowed();
    let w = 0;
    let h = 0;
    let dots: { x: number; y: number }[] = [];
    let bugs: { i: number; fixedAt: number }[] = [];
    let cycle = -1;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const pointer = { x: -1e4, y: -1e4 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y });
      cycle = -1;
      if (!animate) draw(t0 + PERIOD * 0.999);
    };

    const pickBugs = () => {
      bugs = [];
      const candidates = dots.filter((d) => d.x > w * 0.45 && d.y > h * 0.12 && d.y < h * 0.88);
      for (let k = 0; k < BUGS && candidates.length; k++) {
        const d = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
        bugs.push({ i: dots.indexOf(d), fixedAt: 0 });
      }
    };

    function draw(now: number) {
      const t = now - t0;
      const c = Math.floor(t / PERIOD);
      if (c !== cycle) {
        cycle = c;
        pickBugs();
      }
      const beam = ((t % PERIOD) / PERIOD) * (h + 240) - 120;
      ctx!.clearRect(0, 0, w, h);

      // The beam: a soft band with a bright leading edge.
      if (animate) {
        const g = ctx!.createLinearGradient(0, beam - 110, 0, beam + 2);
        g.addColorStop(0, "rgba(46,168,131,0)");
        g.addColorStop(1, "rgba(46,168,131,0.14)");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, beam - 110, w, 112);
        ctx!.fillStyle = "rgba(19,141,108,0.35)";
        ctx!.fillRect(0, beam, w, 1);
      }

      const bugIndex = new Map(bugs.map((b) => [b.i, b]));
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let alpha = 0.24;
        let r = 1.15;
        let dx = 0;
        let dy = 0;
        if (animate) {
          const near = Math.max(0, 1 - Math.abs(d.y - beam) / 55);
          alpha += near * 0.45;
          r += near * 0.8;
          const md = Math.hypot(d.x - pointer.x, d.y - pointer.y);
          if (md < 150) {
            const k = 1 - md / 150;
            alpha += k * 0.5;
            r += k * 0.9;
            dx = ((d.x - pointer.x) / (md || 1)) * k * 7;
            dy = ((d.y - pointer.y) / (md || 1)) * k * 7;
          }
        }
        const bug = bugIndex.get(i);
        if (bug) {
          const passed = beam >= d.y;
          if (passed && !bug.fixedAt) bug.fixedAt = t;
          if (!passed) {
            ctx!.fillStyle = "rgba(224,86,111,0.9)";
            ctx!.beginPath();
            ctx!.arc(d.x, d.y, 3.2, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.strokeStyle = "rgba(224,86,111,0.35)";
            ctx!.beginPath();
            ctx!.arc(d.x, d.y, 7, 0, Math.PI * 2);
            ctx!.stroke();
            continue;
          }
          const age = t - bug.fixedAt;
          if (age < 900) {
            const k = age / 900;
            ctx!.strokeStyle = `rgba(19,141,108,${0.6 * (1 - k)})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.arc(d.x, d.y, 4 + k * 22, 0, Math.PI * 2);
            ctx!.stroke();
          }
          ctx!.fillStyle = "rgba(13,117,89,0.95)";
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, 3, 0, Math.PI * 2);
          ctx!.fill();
          continue;
        }
        ctx!.fillStyle = `rgba(19,141,108,${Math.min(alpha, 0.85).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(d.x + dx, d.y + dy, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (animate && visible && !document.hidden && !raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-grid pointer-events-none absolute inset-0 size-full" aria-hidden="true" data-testid="hero-grid" />;
}
