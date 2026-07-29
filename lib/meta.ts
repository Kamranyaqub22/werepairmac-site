/** Google truncates meta descriptions around this length. */
export const MAX_META_DESCRIPTION = 155;

/**
 * Longest a page's own title may be.
 *
 * Google truncates titles around 60 characters, and the root layout appends
 * " | We Repair Mac" (16 chars) via `title.template`, so a page gets 44. Titles
 * built from a town name overflow silently at the long end — "Laptop & PC Repair
 * Kingston upon Thames (KT1)" is 45 — so compose them with `firstThatFits`
 * against this, richest form first.
 */
export const MAX_TITLE_BASE = 44;

/**
 * Pick the first candidate that fits within `max`, richest first.
 *
 * Composed descriptions (town name + local hook + fault list) vary in length by
 * 40+ characters depending on the town, so a single template either truncates
 * for the long names or wastes space on the short ones. Listing candidates from
 * most to least detailed keeps every page inside the limit while giving the
 * short-named towns the fuller description.
 *
 * Falls back to the last (shortest) candidate if nothing fits, so this can never
 * return undefined.
 */
export function firstThatFits(candidates: string[], max = MAX_META_DESCRIPTION): string {
  return candidates.find((c) => c.length <= max) ?? candidates[candidates.length - 1];
}
