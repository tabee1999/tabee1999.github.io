import { learning, skillAliases, skillGroups } from "../content";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when `term` appears in `text` as a whole word (so "java" doesn't match "javascript"). */
export function mentions(text: string, term: string) {
  return new RegExp(`(^|[^a-z0-9+#])${escape(term.toLowerCase())}([^a-z0-9+#]|$)`).test(text.toLowerCase());
}

/** The words a job ad or question might use for each skill. */
export const termsFor = (skill: string) => skillAliases[skill] ?? [skill];

/** Skills from the CV that a piece of text mentions, plus anything she's currently learning. */
export function matchJob(description: string) {
  const text = description.toLowerCase();
  const matched: string[] = [];
  for (const group of skillGroups) {
    for (const item of group.items) {
      if (termsFor(item).some((t) => mentions(text, t))) matched.push(item);
    }
  }
  const learningHits = learning.filter((l) => mentions(text, l.split(" ")[0]));
  return { matched, learningHits };
}
