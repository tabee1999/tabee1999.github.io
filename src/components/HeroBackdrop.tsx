import { useEffect, useRef } from "react";
import { motionAllowed } from "../lib/scroll";

/**
 * The hero's background: a field of test points. A scan beam sweeps down it; a few points
 * turn red just before it arrives (bugs), and the beam turns them green with a ripple
 * (fixed). Points near the pointer light up.
 *
 * Kept light for cheap phones: the grid is drawn once to a hidden canvas and each frame only
 * repaints the points near the beam or the pointer, at up to 30 frames a second. It plays three
 * sweeps and then rests (moving the pointer or scrolling back wakes it), and only while the hero
 * is on screen and the tab is visible. With reduced motion, data saver or a low-memory device
 * it's drawn once, still.
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
    const SWEEPS = 3;
    const FRAME = 1000 / 30;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowEnd = (nav.deviceMemory ?? 8) < 4 || !!nav.connection?.saveData;
    const animate = motionAllowed() && !lowEnd;
    const grid = document.createElement("canvas");
    const gctx = grid.getContext("2d")!;
    let w = 0;
    let h = 0;
    let dots: { x: number; y: number }[] = [];
    let cols = 0;
    let bugs: { i: number; fixedAt: number }[] = [];
    let cycle = -1;
    let raf = 0;
    let visible = true;
    let last = 0;
    let t0 = performance.now();
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
      cols = Math.max(1, Math.ceil((w - GAP / 2) / GAP));
      // The resting grid, drawn once and copied onto the screen every frame.
      grid.width = canvas.width;
      grid.height = canvas.height;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.fillStyle = "rgba(19,141,108,0.24)";
      gctx.beginPath();
      for (const d of dots) {
        gctx.moveTo(d.x + 1.15, d.y);
        gctx.arc(d.x, d.y, 1.15, 0, Math.PI * 2);
      }
      gctx.fill();
      cycle = -1;
      if (!animate || !raf) draw(t0 + PERIOD * 0.999, !animate);
    };

    const pickBugs = () => {
      bugs = [];
      const candidates = dots.filter((d) => d.x > w * 0.45 && d.y > h * 0.12 && d.y < h * 0.88);
      for (let k = 0; k < BUGS && candidates.length; k++) {
        const d = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
        bugs.push({ i: dots.indexOf(d), fixedAt: 0 });
      }
    };

    function dot(x: number, y: number, r: number, color: string) {
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();
    }

    /** One frame. `still` draws the finished state: no beam, every bug already fixed. */
    function draw(now: number, still = false) {
      const t = now - t0;
      const c = Math.floor(t / PERIOD);
      if (c !== cycle) {
        cycle = c;
        pickBugs();
      }
      const beam = still ? h + 1e4 : ((t % PERIOD) / PERIOD) * (h + 240) - 120;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.drawImage(grid, 0, 0);
      const dpr = canvas!.width / (w || 1);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The beam: a soft band with a bright leading edge, and the points it passes light up.
      if (!still) {
        const g = ctx!.createLinearGradient(0, beam - 110, 0, beam + 2);
        g.addColorStop(0, "rgba(46,168,131,0)");
        g.addColorStop(1, "rgba(46,168,131,0.14)");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, beam - 110, w, 112);
        ctx!.fillStyle = "rgba(19,141,108,0.35)";
        ctx!.fillRect(0, beam, w, 1);

        const firstRow = Math.max(0, Math.floor((beam - 55 - GAP / 2) / GAP));
        const lastRow = Math.min(Math.ceil(dots.length / cols), Math.ceil((beam + 55 - GAP / 2) / GAP));
        for (let row = firstRow; row <= lastRow; row++) {
          for (let col = 0; col < cols; col++) {
            const d = dots[row * cols + col];
            if (!d) continue;
            const near = Math.max(0, 1 - Math.abs(d.y - beam) / 55);
            if (near > 0) dot(d.x, d.y, 1.15 + near * 0.8, `rgba(19,141,108,${(0.24 + near * 0.45).toFixed(3)})`);
          }
        }

        // Points near the pointer glow.
        if (pointer.x > -1e3) {
          for (const d of dots) {
            if (Math.abs(d.x - pointer.x) > 150 || Math.abs(d.y - pointer.y) > 150) continue;
            const md = Math.hypot(d.x - pointer.x, d.y - pointer.y);
            if (md >= 150) continue;
            const k = 1 - md / 150;
            dot(d.x, d.y, 1.15 + k * 0.9, `rgba(19,141,108,${Math.min(0.24 + k * 0.5, 0.85).toFixed(3)})`);
          }
        }
      }

      for (const bug of bugs) {
        const d = dots[bug.i];
        if (!d) continue;
        const passed = beam >= d.y;
        if (passed && !bug.fixedAt) bug.fixedAt = t;
        if (!passed) {
          dot(d.x, d.y, 3.2, "rgba(224,86,111,0.9)");
          ctx!.strokeStyle = "rgba(224,86,111,0.35)";
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, 7, 0, Math.PI * 2);
          ctx!.stroke();
          continue;
        }
        const age = t - bug.fixedAt;
        if (!still && age < 900) {
          const k = age / 900;
          ctx!.strokeStyle = `rgba(19,141,108,${0.6 * (1 - k)})`;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, 4 + k * 22, 0, Math.PI * 2);
          ctx!.stroke();
        }
        dot(d.x, d.y, 3, "rgba(13,117,89,0.95)");
      }
    }

    let restAt = performance.now() + PERIOD * SWEEPS;
    const loop = (now: number) => {
      if (now >= restAt) {
        // Rest after a few sweeps: one still frame, then no more work until something wakes it.
        draw(now, true);
        raf = 0;
        return;
      }
      if (now - last >= FRAME) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (animate && visible && !document.hidden && !raf) raf = requestAnimationFrame(loop);
    };
    /** Plays a few more sweeps, starting a fresh one if it was resting. */
    const wake = () => {
      if (!animate) return;
      const now = performance.now();
      if (!raf && now >= restAt) t0 = now;
      restAt = Math.max(restAt, now + PERIOD * SWEEPS);
      start();
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
      if (visible) wake();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      wake();
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
