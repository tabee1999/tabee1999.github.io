import { person } from "../content";
import { useLocalTimes } from "../lib/hooks";

/** "Pakistan 18:42 · Cyprus 16:42", filled in after the page loads. */
export function Clocks({ className = "" }: { className?: string }) {
  const times = useLocalTimes(person.timezones.map((t) => t.tz));
  return (
    <span className={className} data-testid="local-time">
      {person.timezones.map((t, i) => (
        <span key={t.tz} className="whitespace-nowrap">
          {i > 0 && <span aria-hidden="true"> · </span>}
          {t.label}{" "}
          <time suppressHydrationWarning className="font-mono text-ink">
            {times[i] || t.offset.split(",")[0]}
          </time>
        </span>
      ))}
    </span>
  );
}
