import { useEffect, useRef } from "react";
import { seg, segment, useScrollProgress } from "../lib/scroll";

type Pt = { x: number; y: number };

/** Drawn in a 200 × 200 box. The bug is a beetle seen from above; the shield carries a tick. */
const bugPaths = [
  "M100 70 C 125 70 138 92 138 118 C 138 146 122 166 100 166 C 78 166 62 146 62 118 C 62 92 75 70 100 70 Z",
  "M84 56 A16 16 0 1 0 116 56 A16 16 0 1 0 84 56",
  "M100 74 L100 162",
  "M64 100 L42 88 L32 92",
  "M62 120 L38 120 L28 128",
  "M66 142 L46 154 L40 166",
  "M136 100 L158 88 L168 92",
  "M138 120 L162 120 L172 128",
  "M134 142 L154 154 L160 166",
  "M92 42 L80 24 L72 22",
  "M108 42 L120 24 L128 22",
];
const shieldPath = "M100 22 L160 44 L160 102 C160 140 134 166 100 180 C66 166 40 140 40 102 L40 44 Z";
const tickPath = "M72 102 L92 122 L130 82";

const COUNT = 150;
const ROSE = "#f47a8f";
const TEAL = "#5fd3a6";

/** Evenly spaced points along a set of paths, shared out by length. */
function sample(paths: SVGPathElement[], n: number): Pt[] {
  const lengths = paths.map((p) => p.getTotalLength());
  const total = lengths.reduce((a, b) => a + b, 0);
  const pts: Pt[] = [];
  paths.forEach((path, i) => {
    const k = i === paths.length - 1 ? n - pts.length : Math.max(2, Math.round((n * lengths[i]) / total));
    for (let j = 0; j < k; j++) {
      const p = path.getPointAtLength((lengths[i] * (j + 0.5)) / k);
      pts.push({ x: p.x, y: p.y });
    }
  });
  // Sorting both shapes by angle around the centre makes each particle travel to a nearby spot.
  const angle = (p: Pt) => Math.atan2(p.y - 105, p.x - 100);
  return pts.slice(0, n).sort((a, b) => angle(a) - angle(b));
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Contact page: a bug dissolves into particles that rebuild as a shield as you scroll. */
export function ShieldBand() {
  const band = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const dots = useRef<SVGGElement>(null);
  const from = useRef<SVGGElement>(null);
  const to = useRef<SVGGElement>(null);
  const state = useRef<{ a: Pt[]; b: Pt[]; els: SVGCircleElement[] } | null>(null);
  const progress = useRef(1);

  const draw = (p: number) => {
    progress.current = p;
    // The labels beside the drawing follow the same progress.
    band.current?.style.setProperty("--p", p.toFixed(4));
    const s = state.current;
    if (!s) return;
    for (let i = 0; i < s.els.length; i++) {
      const delay = ((i * 7) % 23) / 23 * 0.3;
      const t = segment(p, delay, delay + 0.62);
      const e = ease(t);
      const a = s.a[i];
      const b = s.b[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const swirl = Math.sin(e * Math.PI) * 26 * (i % 2 ? 1 : -1);
      const el = s.els[i];
      el.setAttribute("cx", (a.x + dx * e + (-dy / len) * swirl).toFixed(1));
      el.setAttribute("cy", (a.y + dy * e + (dx / len) * swirl).toFixed(1));
      const fill = t > 0.5 ? TEAL : ROSE;
      if (el.getAttribute("fill") !== fill) el.setAttribute("fill", fill);
    }
  };

  useEffect(() => {
    if (!from.current || !to.current || !dots.current) return;
    const a = sample(Array.from(from.current.querySelectorAll("path")), COUNT);
    const b = sample(Array.from(to.current.querySelectorAll("path")), COUNT);
    const ns = "http://www.w3.org/2000/svg";
    const els = a.map(() => {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("r", "2.3");
      dots.current!.appendChild(c);
      return c;
    });
    state.current = { a, b, els };
    draw(progress.current);
    return () => els.forEach((c) => c.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measured on the drawing itself, so the bug is fully on screen before it starts to change.
  useScrollProgress(ref, { kind: "view", from: 0.62, to: 0.12 }, draw);

  const labels = [
    { text: "Bug found", at: 0 },
    { text: "Fixed", at: 0.5 },
    { text: "Covered by a test", at: 0.86 },
  ];

  return (
    <section aria-labelledby="shield-title" className="py-6 md:py-10">
      <div className="wrap">
        <div ref={band} className="grid items-center gap-8 overflow-hidden rounded-[1.75rem] bg-pine p-7 text-pine-text md:grid-cols-2 md:p-12" data-testid="shield">
          <div>
            <h2 id="shield-title" className="text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-bold tracking-[-0.025em] text-white">
              Every bug I catch is one your users never meet.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-pine-dim">I find it early, get it fixed fast, and add a test so it can't come back.</p>
            <ol className="mt-7 flex flex-wrap gap-2" aria-label="From bug to release">
              {labels.map((l) => (
                <li
                  key={l.text}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm font-semibold"
                  style={{ opacity: `calc(0.4 + 0.6 * ${seg(l.at, l.at + 0.05)})`, color: l.at === 0 ? ROSE : TEAL }}
                >
                  {l.text}
                </li>
              ))}
            </ol>
          </div>
          <div ref={ref} className="mx-auto w-full max-w-[20rem]">
          <svg viewBox="0 0 200 200" className="w-full" aria-hidden="true">
            <g ref={from} visibility="hidden">
              {bugPaths.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g ref={to} visibility="hidden">
              <path d={shieldPath} />
              <path d={tickPath} />
            </g>
            <path d={shieldPath} fill={TEAL} style={{ opacity: `calc(0.12 * ${seg(0.8, 1)})` }} />
            <path
              d={shieldPath}
              fill="none"
              stroke={TEAL}
              strokeWidth="3"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: `calc(1 - ${seg(0.78, 1)})` }}
            />
            <path
              d={tickPath}
              fill="none"
              stroke={TEAL}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: `calc(1 - ${seg(0.88, 1)})` }}
            />
            <g ref={dots} style={{ opacity: `calc(1 - 0.55 * ${seg(0.9, 1)})` }} />
          </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
