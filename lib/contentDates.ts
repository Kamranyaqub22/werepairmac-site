/**
 * Content freshness for the XML sitemap.
 *
 * The sitemap previously stamped `lastModified: new Date()` on every URL, so all
 * 230+ pages claimed to change on every deploy. Google explicitly discounts (and
 * eventually ignores) `lastmod` when it does not correlate with real changes, so
 * that was actively costing us the recrawl signal we most want on the pages we
 * are improving.
 *
 * The rule now: a date must mean something.
 *
 * - `SITE_CONTENT_DATE` is the last time page copy changed site-wide. Bump it
 *   when a change touches most pages (a template heading, a shared description
 *   format). It is the fallback for records with no date of their own.
 * - Individual Location / Service / BlogBlueprint records carry an optional
 *   `updatedAt`. Set it when you edit that one record's copy; leave it alone
 *   otherwise. That is what makes a single town's page look genuinely fresher
 *   than its neighbours.
 */

/**
 * Last site-wide content change.
 *
 * 2026-07-28 — combo and blog section headings rewritten per page, town and
 * combo meta descriptions recomposed from per-town hooks. That change altered
 * rendered copy on every service, town, combo and blog URL, so a shared date is
 * accurate here rather than a placeholder.
 */
export const SITE_CONTENT_DATE = '2026-07-28';

/** Resolve a record's own date, falling back to the site-wide one. */
export function contentDate(updatedAt?: string): Date {
  return new Date(updatedAt ?? SITE_CONTENT_DATE);
}
