import { getService, type Service } from '@/lib/services';
import { getLocation, type Location, type LocationFAQ } from '@/lib/locations';

// ─── Service × Location landing pages ────────────────────────────────────────
//
// These pages target the long-tail "{service} {town}" queries (e.g. "console
// repair walton on thames") that neither the London-wide service pages nor the
// general "mac-repair-{town}" hub pages own.
//
// They are deliberately limited to a small CORE_CATCHMENT of towns near our
// New Malden base: those are the only places where real proximity + local
// relevance can actually rank us. Each page composes genuinely-unique content —
// the service's own copy (unique per service) + the town's hand-written
// local copy (unique per town) + a rotated combination intro — so the set is
// not a doorway-page template with two names swapped in.

export interface ServiceFamily {
  // URL prefix for the combo slug, e.g. "console-repair" → /console-repair-kingston
  base: string;
  // Human keyword label used in copy/metadata, e.g. "Console Repair"
  label: string;
  // Mid-sentence form of the label. Defined explicitly rather than via
  // .toLowerCase() so brand terms keep their casing ("MacBook", "PC").
  labelLower: string;
  // The canonical London-wide service this family maps to (source of unique copy)
  serviceSlug: string;
}

export const SERVICE_FAMILIES: ServiceFamily[] = [
  { base: 'macbook-repair', label: 'MacBook Repair', labelLower: 'MacBook repair', serviceSlug: 'macbook-repair-london' },
  { base: 'laptop-repair', label: 'Laptop & PC Repair', labelLower: 'laptop & PC repair', serviceSlug: 'laptop-repair-london' },
  { base: 'console-repair', label: 'Console Repair', labelLower: 'console repair', serviceSlug: 'gaming-console-repair-london' },
  { base: 'data-recovery', label: 'Data Recovery', labelLower: 'data recovery', serviceSlug: 'data-recovery-london' },
];

// Core catchment: the towns near our New Malden (KT3) base where proximity is
// real and we can genuinely rank. Ordered closest-first. Expanding coverage is
// just a matter of adding town slugs here (they must exist in lib/locations.ts).
export const CORE_CATCHMENT: string[] = [
  // Ring 1 — immediate catchment (Kingston / SW-London / Sutton border)
  'new-malden',
  'kingston-upon-thames',
  'surbiton',
  'tolworth',
  'worcester-park',
  'raynes-park',
  'wimbledon',
  'chessington',
  'morden',
  'cheam',
  'sutton',
  'ewell',
  'stoneleigh',
  'epsom',
  'teddington',
  // Ring 2 — wider Surrey / SW-London belt (Elmbridge, Richmond, Wandsworth,
  // Sutton & Mole Valley) — still comfortably reachable from New Malden.
  'walton-on-thames',
  'esher',
  'weybridge',
  'cobham',
  'richmond',
  'twickenham',
  'putney',
  'mitcham',
  'carshalton',
  'wallington',
  'leatherhead',
  'banstead',
  'claygate',
  'tadworth',
];

export interface ServiceLocation {
  family: ServiceFamily;
  service: Service;
  location: Location;
}

const familyByBase = new Map(SERVICE_FAMILIES.map((f) => [f.base, f]));

/**
 * Resolve a combo slug like "console-repair-kingston-upon-thames" into its
 * family + service + location. Returns undefined for anything that isn't a
 * valid family-base + core-catchment-town pairing.
 *
 * NOTE: the page router must try exact service matches FIRST, so a real service
 * slug such as "macbook-repair-london" is never treated as a combo (there is no
 * "london" location in the catchment, so it wouldn't match here anyway).
 */
export function getServiceLocation(slug: string): ServiceLocation | undefined {
  for (const family of SERVICE_FAMILIES) {
    const prefix = `${family.base}-`;
    if (!slug.startsWith(prefix)) continue;
    const townSlug = slug.slice(prefix.length);
    if (!CORE_CATCHMENT.includes(townSlug)) continue;
    const location = getLocation(townSlug);
    const service = getService(family.serviceSlug);
    if (location && service) return { family, service, location };
  }
  return undefined;
}

/** All combo slugs, for generateStaticParams and the sitemap. */
export function serviceLocationSlugs(): string[] {
  const slugs: string[] = [];
  for (const family of SERVICE_FAMILIES) {
    for (const townSlug of CORE_CATCHMENT) {
      if (getLocation(townSlug)) slugs.push(`${family.base}-${townSlug}`);
    }
  }
  return slugs;
}

/** The combo slugs for a single town (used by the town hub's "popular repairs"). */
export function serviceLocationsForTown(townSlug: string): { slug: string; label: string }[] {
  if (!CORE_CATCHMENT.includes(townSlug)) return [];
  return SERVICE_FAMILIES.map((f) => ({ slug: `${f.base}-${townSlug}`, label: f.label }));
}

/** The combo pages for a single service, across every catchment town. Used by
 *  the parent service page to link down to its spokes (empty for services that
 *  aren't one of the four families). */
export function serviceLocationsForService(serviceSlug: string): { slug: string; townName: string }[] {
  const family = SERVICE_FAMILIES.find((f) => f.serviceSlug === serviceSlug);
  if (!family) return [];
  return CORE_CATCHMENT.flatMap((townSlug) => {
    const loc = getLocation(townSlug);
    return loc ? [{ slug: `${family.base}-${townSlug}`, townName: loc.name }] : [];
  });
}

export function isCoreCatchment(townSlug: string): boolean {
  return CORE_CATCHMENT.includes(townSlug);
}

// ─── Content composition ─────────────────────────────────────────────────────

// Deterministic per-slug index so a given combo always renders the same variant
// across builds (same technique as LOCATION_FAQ_VARIANTS in lib/locations.ts).
function hashIndex(slug: string, mod: number): number {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return sum % mod;
}

// Hand-written overrides for priority combos, keyed by "{base}:{townSlug}".
// When present, these replace the generated intro so the highest-value pages
// (core town × strongest service) can be deepened over time without touching
// the rest. Mirrors the optional-localIntro pattern in lib/locations.ts.
// Each value is the hero intro paragraphs, grounded in that town's real local
// character rather than a template. Add more entries here to deepen more pages.
const INTRO_OVERRIDES: Record<string, string[]> = {
  'macbook-repair:new-malden': [
    `New Malden is home — our base is on Burlington Road, so a MacBook that won't boot or a cracked screen gets one of the fastest responses we offer anywhere. There's no travel time to absorb, which means we can often be at your door in New Malden, Motspur Park or Old Malden within the hour, and slot you in the same day even when the diary is full.`,
    `We see the full range here: long-owned iMacs and MacBooks on their second or third battery in the 1930s semis around Beverley Park, student machines with cracked screens and snapped hinges from the families near Coombe, and work-critical Macs from the independent businesses along the High Street. Whatever it is, we fix it in front of you where we can — no callout charge, a fixed quote first, and nothing to pay if we can't sort it.`,
  ],
  'laptop-repair:kingston-upon-thames': [
    `Kingston is five minutes up the road from our New Malden base, so there's no need to carry a dead laptop into town or queue near the Bentall Centre. We come to your flat in Norbiton, your office by the Rose Theatre, or your room in halls, and most laptop faults — cracked screens, failed boots, dying batteries — are fixed on the spot in under an hour.`,
    `With Kingston University on the doorstep, cracked screens are the single most common job we get here, and we carry the common MacBook Air, Pro and Windows-laptop panels to match. For the town-centre businesses it's more varied — dead PCs, failing drives, Wi-Fi that won't reach the back office — and we treat those as urgent, because a machine down is a day lost. Same-day if you call before 2pm, no callout charge, no fix no fee.`,
  ],
  'data-recovery:wimbledon': [
    `Wimbledon is one of our strongest work-from-home patches, and data recovery is where being local really counts. When an external drive or a MacBook stops mounting, the worst thing you can do is keep powering it on — so rather than posting it away, we come to you around the Village, South Wimbledon or the Common and assess it in front of you, the same day where we can.`,
    `A lot of SW19 recoveries start the same way: a Time Machine backup that quietly stopped running months ago and was only discovered at the worst possible moment, or a drive full of a consultant's client work that won't open. We recover what's recoverable, tell you honestly when a specialist clean-room is the only option, and set up a backup that actually runs before we leave. No callout charge, and no fee at all if the data can't be recovered.`,
  ],
  'console-repair:walton-on-thames': [
    `Walton-on-Thames is firmly on our patch, so a PS5 that won't output to the TV or an Xbox that keeps overheating doesn't mean boxing it up and posting it off. We come to the house — along the riverside, off the high street, or out toward Hersham — and diagnose it in front of you, usually the same day, with no callout charge for the visit.`,
    `Walton's mix of families and home workers keeps us busy with the practical console faults: HDMI ports that have taken a knock, fans clogged and shutting the machine down mid-game, and controllers that have started drifting. On-site jobs like fan cleans and controller fixes are often done within the hour; board-level work such as an HDMI port replacement goes to our workshop on proper micro-soldering equipment and comes back fully tested — always quoted first. Every repair carries our 90-day warranty and our no fix, no fee promise.`,
  ],
  'macbook-repair:surbiton': [
    `Surbiton is minutes from our New Malden base, which is exactly why the classic KT6 call-out — "it was fine yesterday and now it won't turn on", the night before a work trip — is one we can usually answer the same day. A failed boot, a dead battery or a drive on its way out is often fixable on the spot, at your kitchen table, without the machine ever leaving the house.`,
    `This is a commuter town, so evening MacBook appointments are more popular here than almost anywhere we cover, and they cost no more than a weekday slot. Beyond the emergencies, Surbiton is steady upgrade territory — an SSD and a little more memory into a five- or six-year-old Mac that's otherwise perfectly good, the cheapest way to make a slow machine fast again. We'll tell you when that's the honest fix rather than sell you a repair you don't need. We cover Surbiton, Berrylands and Hook on the same basis, with no callout charge.`,
  ],
  'macbook-repair:epsom': [
    `Epsom is best known for the Derby, but day to day it's full of home workers and small offices for whom a MacBook down means a lost working day. We come to you — a home office near the racecourse, a business off the High Street, or a house on the streets climbing toward the Downs — and fix most Macs on the spot, with the price agreed before we touch anything.`,
    `The work here is mostly about keeping good machines going: battery swaps, SSD and memory upgrades, and clean-ups on Macs that have slowed under years of use, alongside the cracked screens and worn batteries on family and student MacBooks. We carry the common parts to finish in a single visit, and there's no callout charge to Epsom, Ewell or the neighbouring villages — with our 90-day warranty and no fix, no fee on every job.`,
  ],
  'macbook-repair:walton-on-thames': [
    `Walton-on-Thames runs on a mix of families and people working from home, and for the home workers a dead MacBook is a lost day — so rather than have you carry it into a shop, we come to the house, along the riverside, off the high street or out toward Hersham, and fix most Macs in front of you the same day.`,
    `It's the practical jobs that keep us busy here: cracked screens and worn batteries, a Mac that's slowed and really only needs an SSD and a clean install, and the occasional urgent won't-boot the morning of something important. We carry the common parts so most finish in one visit, deal with kitchen-counter liquid spills fast, and set up a backup before we leave if there isn't one. No callout charge, and nothing to pay if we can't fix it.`,
  ],
};

// Three structurally-different intro shapes so the combo pages are not
// byte-identical to one another. Each still leans on the town's genuinely-unique
// hand-written copy (rendered separately on the page) for its real local value.
const INTRO_VARIANTS: ((sl: ServiceLocation) => string[])[] = [
  ({ family, location }) => [
    `When something goes wrong you shouldn't have to unplug everything and queue at a shop counter. We bring ${family.labelLower} directly to your door across ${location.name}${location.postcode ? ` (${location.postcode})` : ''} — an engineer arrives, diagnoses the fault in front of you, and in most cases fixes it on the spot the same day.`,
    `${location.name} sits within our core ${location.borough || 'local'} coverage, close to our New Malden base, so we can usually offer a same-day slot and there is never a callout charge. You get a clear, fixed quote before any work starts, and if we can't fix it you pay nothing.`,
  ],
  ({ family, location }) => [
    `Looking for ${family.labelLower} in ${location.name}? We are a mobile repair service, not a drop-off shop — our engineer comes to your home or office anywhere in ${location.name} and the surrounding ${location.borough || 'area'}, carries the common parts, and completes most jobs on-site in a single visit.`,
    `Because ${location.name}${location.postcode ? ` (${location.postcode})` : ''} is close to our New Malden workshop, response times here are among the fastest we offer. Same-day visits are usually available if you call before 2pm — evenings and weekends included — all at no extra charge, and every repair carries a 90-day warranty.`,
  ],
  ({ family, location }) => [
    `${family.label} in ${location.name}, done at your kitchen table or desk. Rather than being without your machine for days, you book a visit, we come to you in ${location.name}, and you watch the repair happen. Most faults are sorted the same day, in front of you.`,
    `We cover ${location.name} and the wider ${location.borough || 'local'} district from our nearby New Malden base — no callout fee, a fixed quote agreed upfront, and our No Fix, No Fee promise, so there is no risk in getting it looked at.`,
  ],
];

/** The combination intro paragraphs: hand-written override if present, else a
 *  deterministically-chosen generated variant. */
export function getServiceLocationIntro(sl: ServiceLocation): string[] {
  const key = `${sl.family.base}:${sl.location.slug}`;
  if (INTRO_OVERRIDES[key]) return INTRO_OVERRIDES[key];
  const slug = `${sl.family.base}-${sl.location.slug}`;
  return INTRO_VARIANTS[hashIndex(slug, INTRO_VARIANTS.length)](sl);
}

// Town-specific logistics FAQ variants, rotated per combo so the FAQPage schema
// isn't a byte-identical block across the 15 towns for the same service. The
// meaty, snippet-worthy Q&A comes from the service's own faqs (unique per
// service); these two just localise the same-day / callout logistics.
const LOGISTICS_FAQ_VARIANTS: ((sl: ServiceLocation) => LocationFAQ[])[] = [
  ({ family, location }) => [
    { q: `Do you offer same-day ${family.labelLower} in ${location.name}?`, a: `Usually yes — ${location.name} is close to our New Malden base, so bookings placed before 2pm are typically seen the same day, evenings and weekends included.` },
    { q: `Is there a callout charge to ${location.name}?`, a: `No. There is no callout charge anywhere in ${location.borough || 'our coverage area'}, including ${location.name}. You only pay for the repair itself, and nothing at all if we can't fix it.` },
  ],
  ({ family, location }) => [
    { q: `How quickly can an engineer reach ${location.name} for ${family.labelLower}?`, a: `${location.name} is one of our nearest towns to New Malden, so it gets some of our fastest response times — most same-day requests booked before 2pm are covered.` },
    { q: `Will I be charged just for you to come to ${location.name}?`, a: `No — there is no visit or callout fee in ${location.name}. We quote the repair upfront, and our No Fix, No Fee guarantee means you pay nothing if it can't be repaired.` },
  ],
  ({ family, location }) => [
    { q: `Can you come to my home in ${location.name} rather than me travelling to a shop?`, a: `Yes — that is the whole model. Our engineer travels to you in ${location.name} and carries out most ${family.labelLower} jobs on-site, the same day where possible.` },
    { q: `Does ${family.labelLower} cost more because I'm in ${location.name}?`, a: `No. Pricing is the same across ${location.borough || 'the area'} — £100/hr labour plus any parts, quoted before we start, with no location surcharge and no callout charge.` },
  ],
];

/** FAQs for a combo page: two rotated town-logistics FAQs followed by the
 *  service's own unique FAQs. */
export function getServiceLocationFaqs(sl: ServiceLocation): LocationFAQ[] {
  const slug = `${sl.family.base}-${sl.location.slug}`;
  const logistics = LOGISTICS_FAQ_VARIANTS[hashIndex(slug, LOGISTICS_FAQ_VARIANTS.length)](sl);
  const serviceFaqs = sl.service.faqs ?? [];
  return [...logistics, ...serviceFaqs];
}
