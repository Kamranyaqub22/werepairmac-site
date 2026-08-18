import rawCaseStudies from '@/lib/case-studies.json';
import { getLocation } from '@/lib/locations';
import { getService } from '@/lib/services';

/**
 * Real repair case studies.
 *
 * These are the only pages on the site backed by first-hand evidence: a job we
 * actually did, photographed on the day. That is the whole point of them, and
 * it is also the rule that governs this file.
 *
 * NON-NEGOTIABLE: every field below must describe a real job. Do not invent a
 * device, a fault, a diagnosis, a part or a turnaround to fill a gap, and do not
 * write an entry that has no photograph. A fabricated case study is worse than
 * no case study — it is the exact "SEO project rather than a real business"
 * signal these pages exist to disprove. If a detail is unknown, leave the
 * optional field out; the page renders fine without it.
 *
 * Volume discipline: these are hand-written, one per genuine job. They are NOT
 * a programmatic set. The site already has 116 service×location combo pages that
 * Google is slow to index; a templated run of "<fault> — <town>" case studies
 * would read as more of the same. If this file ever approaches ~20 entries,
 * stop putting town names in slugs before adding more.
 */

export interface CaseStudyPhoto {
  /** Path under /public, e.g. /images/repairs/<slug>-1.jpg */
  src: string;
  /**
   * What is actually visible in the photo, described plainly. This is alt text
   * for a real image, not a keyword slot — "Swollen battery cells lifted out of
   * the bottom case", not "MacBook battery replacement New Malden".
   */
  alt: string;
  /** Optional caption shown under the image. */
  caption?: string;
}

export interface CaseStudy {
  slug: string;
  /** On-page H1. The full, natural headline. */
  title: string;
  /** Short <title> — aim <= 44 chars, since the layout appends " | We Repair Mac". */
  metaTitle?: string;
  /** One or two sentences shown on the page and on the index card. */
  excerpt: string;
  /**
   * SERP description, <= 155 chars. Separate from `excerpt` because the two
   * have different masters: the excerpt should read well under the headline,
   * while this is truncated by Google past ~155. Older entries predate the
   * field — `caseStudyDescription()` falls back to a trimmed excerpt.
   */
  metaDescription?: string;

  /** Must match a slug in lib/locations.ts. */
  locationSlug: string;
  /** Must match a slug in lib/services.ts — drives the related-service CTA. */
  serviceSlug: string;

  /** The machine, as specifically as you can name it. "MacBook Pro 13-inch, 2017". */
  device: string;
  /** The symptom in the customer's words, one line. */
  fault: string;

  /**
   * Where the work happened. About 30% of jobs need the workshop, and saying so
   * on the pages where it was true is more credible than implying every repair
   * is finished on the kitchen table.
   */
  visitType: 'on-site' | 'workshop' | 'on-site-then-workshop';
  /** Plain-English turnaround, e.g. "Same day — about 90 minutes on site". */
  turnaround: string;
  /** Parts fitted, if any. Omit for software-only or diagnostic jobs. */
  partsUsed?: string[];

  /** At least one. An entry with no photo should not be published. */
  photos: CaseStudyPhoto[];

  /** What the customer reported when they called. Town-level detail only — no names. */
  theCall: string;
  /** What was checked, and what it ruled in or out. One bullet per step. */
  diagnosis: string[];
  /** What was actually done, in order. */
  theRepair: string[];
  /** The result, handover, and warranty position. */
  outcome: string;

  /** ISO date the page went live. */
  publishedAt: string;
  /** ISO date of the last substantive edit; falls back to publishedAt. */
  updatedAt?: string;
}

const VISIT_TYPES: CaseStudy['visitType'][] = [
  'on-site',
  'workshop',
  'on-site-then-workshop',
];

/**
 * Entries live in lib/case-studies.json rather than in this file so the admin
 * publish flow can append one by writing JSON, instead of splicing TypeScript
 * source it would have to parse and re-emit correctly.
 *
 * The tradeoff is that the JSON is outside the type system, and it is written
 * by a drafting model rather than typed by hand — so it is validated here at
 * load. An entry that is malformed, points at a town or service that does not
 * exist, or carries no photograph is dropped with a build-time warning rather
 * than rendering a broken page. Dropping is the right failure: a case study
 * nobody can read is better than one that 500s or claims a fake location.
 */
function isValidCaseStudy(value: unknown): value is CaseStudy {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Partial<CaseStudy>;

  const hasStrings = (['slug', 'title', 'excerpt', 'device', 'fault', 'turnaround', 'theCall', 'outcome', 'publishedAt'] as const)
    .every((key) => typeof c[key] === 'string' && (c[key] as string).length > 0);
  if (!hasStrings) return false;

  if (!VISIT_TYPES.includes(c.visitType as CaseStudy['visitType'])) return false;
  if (!Array.isArray(c.diagnosis) || c.diagnosis.length === 0) return false;
  if (!Array.isArray(c.theRepair) || c.theRepair.length === 0) return false;

  // A case study with no photograph is not a case study — the photo is the
  // evidence the page exists to present.
  if (!Array.isArray(c.photos) || c.photos.length === 0) return false;
  if (!c.photos.every((p) => p && typeof p.src === 'string' && typeof p.alt === 'string')) {
    return false;
  }

  // Cross-references must resolve, or the page renders a town/service that
  // isn't ours.
  if (typeof c.locationSlug !== 'string' || !getLocation(c.locationSlug)) return false;
  if (typeof c.serviceSlug !== 'string' || !getService(c.serviceSlug)) return false;

  return true;
}

export const caseStudies: CaseStudy[] = (rawCaseStudies as unknown[]).filter(
  (entry, i) => {
    if (isValidCaseStudy(entry)) return true;
    const slug =
      typeof entry === 'object' && entry !== null && 'slug' in entry
        ? String((entry as { slug: unknown }).slug)
        : `index ${i}`;
    console.warn(
      `[caseStudies] Dropping invalid entry "${slug}" from lib/case-studies.json — ` +
        'check visitType, photos, locationSlug and serviceSlug.'
    );
    return false;
  }
) as CaseStudy[];

/** Newest first. */
export function getAllCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Case studies from a given town, for cross-linking off the area page. */
export function getCaseStudiesForLocation(locationSlug: string): CaseStudy[] {
  return getAllCaseStudies().filter((c) => c.locationSlug === locationSlug);
}

/** Case studies for a given service, for cross-linking off the service page. */
export function getCaseStudiesForService(serviceSlug: string): CaseStudy[] {
  return getAllCaseStudies().filter((c) => c.serviceSlug === serviceSlug);
}

/**
 * Related picks for the foot of a case study: same service first, then same
 * town, then anything else, never itself.
 */
export function getRelatedCaseStudies(current: CaseStudy, limit = 3): CaseStudy[] {
  const others = getAllCaseStudies().filter((c) => c.slug !== current.slug);
  const score = (c: CaseStudy) =>
    (c.serviceSlug === current.serviceSlug ? 2 : 0) +
    (c.locationSlug === current.locationSlug ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/**
 * Whether the section has anything in it. Gates the nav link, the sitemap
 * entries and the cross-links, so an empty /repairs never ships as a thin page.
 */
export function hasCaseStudies(): boolean {
  return caseStudies.length > 0;
}

export function caseStudyLocation(caseStudy: CaseStudy) {
  return getLocation(caseStudy.locationSlug);
}

export function caseStudyService(caseStudy: CaseStudy) {
  return getService(caseStudy.serviceSlug);
}

/** Human label for the visit type, used in the page's fact table. */
export const VISIT_TYPE_LABEL: Record<CaseStudy['visitType'], string> = {
  'on-site': 'Fixed on site',
  workshop: 'Collected and returned',
  'on-site-then-workshop': 'Diagnosed on site, finished in the workshop',
};

/** Longest description Google will render before truncating. */
const MAX_DESCRIPTION = 155;

/**
 * The description for a case study's <meta>, guaranteed to fit.
 *
 * Falls back to the excerpt trimmed at a word boundary, so an entry published
 * before `metaDescription` existed still gets a clean description rather than
 * one Google cuts mid-word.
 */
export function caseStudyDescription(caseStudy: CaseStudy): string {
  const preferred = caseStudy.metaDescription?.trim();
  if (preferred && preferred.length <= MAX_DESCRIPTION) return preferred;

  const source = preferred || caseStudy.excerpt.trim();
  if (source.length <= MAX_DESCRIPTION) return source;

  const cut = source.slice(0, MAX_DESCRIPTION - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

export function formatCaseStudyDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
