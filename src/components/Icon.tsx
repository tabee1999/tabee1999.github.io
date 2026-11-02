// Line icons drawn on a 24px grid. Decorative by default (aria-hidden).

const paths: Record<string, string> = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M9 7h8v8",
  arrowUp: "M12 19V5M5.5 11.5L12 5l6.5 6.5",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  mapPin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  briefcase: "M4 8h16v11H4zM9 8V5.5h6V8M4 13h16",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  sparkles: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5.5 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z",
  clipboard: "M8 5h8v3H8zM6.5 6.5H5v14h14v-14h-1.5M8.5 13l2.5 2.5 4.5-5",
  automation: "M8.5 7.5v9l7-4.5zM20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4",
  api: "M8.5 4.5c-2 0-2.5 1-2.5 2.5v2.5c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5V17c0 1.5.5 2.5 2.5 2.5M15.5 4.5c2 0 2.5 1 2.5 2.5v2.5c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5V17c0 1.5-.5 2.5-2.5 2.5",
  devices: "M3 5h12v9H3zM6.5 18h5M16 9h5v11h-5z",
  gauge: "M4 16a8 8 0 1 1 16 0M12 16l4-5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  copy: "M9 9h11v11H9zM15 9V4H4v11h5",
  chevronDown: "M6 9l6 6 6-6",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  send: "M4 12l16-8-6 16-3-7z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  chart: "M4 20V4M4 20h16M8 16l3.5-4 3 2.5L19 9",
  bug: "M9 6.5a3 3 0 0 1 6 0M7.5 9h9v5.5a4.5 4.5 0 0 1-9 0zM12 9v10M4 11h3.5M16.5 11H20M4.5 17l3-1.5M19.5 17l-3-1.5",
  rocket: "M5 19c0-3 1.5-4.5 3-5M14 4c3.5 0 6 2.5 6 6-1.5 3-5 6.5-8 8l-6-6c1.5-3 5-6.5 8-8zM14.5 9.5h.01M8.5 15.5l-3 1.5",
  plane: "M3 13l18-7-5 14-4-5-6-1zM12 15l-1 5",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  passport: "M6 3h12v18H6zM12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 17.5h6",
  candles: "M7 4v16M17 4v16M5 8h4v7H5zM15 6h4v6h-4zM11 10v8M10 12h2v4h-2z",
  store: "M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 2 3s3-1.3 3-3c0 1.7 1.3 3 3 3s2-1.3 2-3M10 20v-5h4v5",
  quote: "M9 7c-3 1-4.5 3.2-4.5 6.5V17H9v-4H6.8C7 10.8 8 9.6 10 9zM19 7c-3 1-4.5 3.2-4.5 6.5V17H19v-4h-2.2c.2-2.2 1.2-3.4 3.2-4z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", label }: { name: IconName | string; className?: string; label?: string }) {
  const d = paths[name] ?? paths.check;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

export function LinkedInIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
    </svg>
  );
}

export function GitHubIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}
