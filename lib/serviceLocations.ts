import { getService, type Service } from '@/lib/services';
import { getLocation, getNearbyLocations, type Location, type LocationFAQ } from '@/lib/locations';
import { pickVariant } from '@/lib/hash';
import retiredCombos from '@/lib/retired-combos.json';

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
  // A natural-prose summary of this family's real common faults, drawn from the
  // mapped service's commonIssues. Woven into the combo intros, focus copy and a
  // service×town FAQ so each service reads differently in the same town — content
  // that exists on neither the London service page nor the town hub.
  typicalFaults: string;
  // Very short fault summary (~40 chars) for meta descriptions, where
  // `typicalFaults` is far too long to fit inside 155 characters.
  metaFaults: string;
  // Alternative phrasings for the three repeated H2 slots on the combo template.
  // Each town picks one set deterministically (see comboHeadings), so the 29
  // pages in a family no longer share a single heading skeleton — which is what
  // made 116 genuinely-different pages read as one template to a crawler.
  headingVariants: {
    issues: readonly string[];
    whatToExpect: readonly string[];
    calledOutFor: readonly string[];
  };
}

export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    base: 'macbook-repair',
    label: 'MacBook Repair',
    labelLower: 'MacBook repair',
    serviceSlug: 'macbook-repair-london',
    typicalFaults: "a MacBook that won't turn on, liquid damage, a worn-out battery or a cracked screen",
    metaFaults: 'screens, batteries and liquid damage',
    headingVariants: {
      issues: [
        'MacBook faults we fix most often',
        'The MacBook problems we see week to week',
        'Common MacBook faults, and what causes them',
        'What usually goes wrong with a MacBook',
      ],
      whatToExpect: [
        'What a MacBook repair visit in {town} looks like',
        'How a MacBook call-out in {town} actually runs',
        'What happens when we arrive in {town}',
        'From first call to working MacBook in {town}',
      ],
      calledOutFor: [
        'The MacBook jobs we get called to around {town}',
        'What {town} MacBook owners call us about',
        'Typical MacBook call-outs in {town}',
        'The MacBook repairs {town} sends us',
      ],
    },
  },
  {
    base: 'laptop-repair',
    label: 'Laptop & PC Repair',
    labelLower: 'laptop & PC repair',
    serviceSlug: 'laptop-repair-london',
    typicalFaults: "cracked screens, laptops that won't power on, keyboard spills and failing hard drives",
    metaFaults: 'cracked screens, spills and dead laptops',
    headingVariants: {
      issues: [
        'Laptop and PC faults we fix most often',
        'The laptop problems we see week to week',
        'Common laptop and PC faults, and their causes',
        'What usually goes wrong with a laptop',
      ],
      whatToExpect: [
        'What a laptop repair visit in {town} looks like',
        'How a laptop call-out in {town} actually runs',
        'What happens when we arrive in {town}',
        'From first call to working laptop in {town}',
      ],
      calledOutFor: [
        'The laptop jobs we get called to around {town}',
        'What {town} laptop owners call us about',
        'Typical laptop call-outs in {town}',
        'The laptop repairs {town} sends us',
      ],
    },
  },
  {
    base: 'console-repair',
    label: 'Console Repair',
    labelLower: 'console repair',
    serviceSlug: 'gaming-console-repair-london',
    typicalFaults: "HDMI ports with no picture, overheating shutdowns, charging-port faults and drifting controllers",
    metaFaults: 'HDMI ports, overheating and charging faults',
    headingVariants: {
      issues: [
        'Console faults we fix most often',
        'The console problems we see week to week',
        'Common console faults, and what causes them',
        'What usually goes wrong with a console',
      ],
      whatToExpect: [
        'What a console repair visit in {town} looks like',
        'How a console call-out in {town} actually runs',
        'What happens when we arrive in {town}',
        'From first call to working console in {town}',
      ],
      calledOutFor: [
        'The console jobs we get called to around {town}',
        'What {town} gamers call us about',
        'Typical console call-outs in {town}',
        'The console repairs {town} sends us',
      ],
    },
  },
  {
    base: 'data-recovery',
    label: 'Data Recovery',
    labelLower: 'data recovery',
    serviceSlug: 'data-recovery-london',
    typicalFaults: "drives that won't mount, accidentally deleted files, failed SSDs and clicking hard drives",
    metaFaults: 'drives that will not mount and lost files',
    headingVariants: {
      issues: [
        'Data loss we recover from most often',
        'The drive failures we see week to week',
        'Common causes of lost data, and what they mean',
        'How drives usually fail',
      ],
      whatToExpect: [
        'What a data recovery job in {town} involves',
        'How a recovery attempt for {town} actually runs',
        'What happens when we collect the drive in {town}',
        'From first call to recovered files in {town}',
      ],
      calledOutFor: [
        'The recovery jobs we get called to around {town}',
        'What {town} customers call us about',
        'Typical recovery call-outs in {town}',
        'The data losses {town} sends us',
      ],
    },
  },
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

export interface ComboHeadings {
  issues: string;
  whatToExpect: string;
  calledOutFor: string;
}

// Spoke-to-spoke link budget across the core catchment. Guaranteeing out-degree
// alone is not enough: a town can link out to four neighbours and still be
// linked back by almost nobody, which is how the edge-of-catchment combos ended
// up on 6 inlinks while central ones had 15. MIN_CORE_INBOUND is the floor that
// actually matters.
const CORE_OUT_TARGET = 5;
const MIN_CORE_INBOUND = 4;
const CORE_OUT_CAP = 7;

let coreGraph: Map<string, Location[]> | null = null;

/**
 * Balanced cross-link graph over the core-catchment towns.
 *
 * Mirrors buildNearbyGraph in lib/locations.ts: geography first, then a pass
 * that lifts every town to the inbound floor using whichever hosts have spare
 * capacity. Deterministic — ties break on slug.
 */
function buildCoreGraph(): Map<string, Location[]> {
  if (coreGraph) return coreGraph;

  const towns = CORE_CATCHMENT.map((s) => getLocation(s)).filter(
    (l): l is Location => Boolean(l),
  );
  const lists = new Map<string, Location[]>();
  const inbound = new Map<string, number>(towns.map((t) => [t.slug, 0]));

  // Pass 1 — nearest catchment neighbours.
  for (const town of towns) {
    const near = getNearbyLocations(town.slug, 100)
      .filter((l) => l.slug !== town.slug && CORE_CATCHMENT.includes(l.slug))
      .slice(0, CORE_OUT_TARGET);
    lists.set(town.slug, near);
    for (const n of near) inbound.set(n.slug, (inbound.get(n.slug) ?? 0) + 1);
  }

  // Pass 2 — lift everyone to the inbound floor.
  const byNeed = [...towns].sort(
    (a, b) => (inbound.get(a.slug) ?? 0) - (inbound.get(b.slug) ?? 0) || a.slug.localeCompare(b.slug),
  );

  for (const target of byNeed) {
    while ((inbound.get(target.slug) ?? 0) < MIN_CORE_INBOUND) {
      const host = towns
        .filter((h) => {
          const list = lists.get(h.slug)!;
          return h.slug !== target.slug && list.length < CORE_OUT_CAP && !list.includes(target);
        })
        .sort(
          (a, b) => lists.get(a.slug)!.length - lists.get(b.slug)!.length || a.slug.localeCompare(b.slug),
        )[0];

      if (!host) break;
      lists.get(host.slug)!.push(target);
      inbound.set(target.slug, (inbound.get(target.slug) ?? 0) + 1);
    }
  }

  coreGraph = lists;
  return coreGraph;
}

/**
 * Core-catchment towns to link to from a combo page's "same service in nearby
 * areas" block.
 *
 * The default limit is CORE_OUT_CAP, not CORE_OUT_TARGET: buildCoreGraph appends
 * the inbound-balancing links *after* the first five, so slicing to five here
 * would silently discard exactly the links that pass 2 added — which is what
 * left Stoneleigh, Teddington and Twickenham on two inbound spoke links each
 * despite a declared floor of four. The graph already caps out-degree at
 * CORE_OUT_CAP, so this returns the whole list rather than a truncation of it.
 */
export function nearbyCoreTowns(townSlug: string, count = CORE_OUT_CAP): Location[] {
  return (buildCoreGraph().get(townSlug) ?? []).slice(0, count);
}

/**
 * Deterministic H2 set for a combo page.
 *
 * The variant is chosen from the town slug, so a page's headings never change
 * between builds. Each slot is salted separately, so the three choices are
 * independent — 4^3 = 64 possible skeletons per family rather than 4.
 */
export function comboHeadings(sl: ServiceLocation): ComboHeadings {
  const { headingVariants } = sl.family;
  const key = sl.location.slug;
  const town = (h: string) => h.replace(/\{town\}/g, sl.location.name);
  return {
    issues: town(pickVariant(`${key}:issues`, headingVariants.issues)),
    whatToExpect: town(pickVariant(`${key}:expect`, headingVariants.whatToExpect)),
    calledOutFor: town(pickVariant(`${key}:calledout`, headingVariants.calledOutFor)),
  };
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
/**
 * Combo pages withdrawn after the Search Console review of 2026-08-05.
 *
 * Every slug here returned **zero impressions over three months** — not a poor
 * position, not a low click-through, nothing at all. They are redirected to
 * their town hub in next.config.mjs.
 *
 * Only the genuinely dead ones are listed. 87 of the 116 combos did earn
 * impressions, and an earlier read of the Page Indexing report — which reported
 * 113 as unindexed — turned out to be stale: a page cannot draw impressions
 * without being indexed. Those 87 stay. The lesson is in the asymmetry: a page
 * with traffic gets the benefit of the doubt, a page with none does not.
 */
export const RETIRED_COMBOS: ReadonlySet<string> = new Set(retiredCombos.retired);

/** The town hub a retired combo redirects to. */
export function retiredComboTarget(slug: string): string | undefined {
  if (!RETIRED_COMBOS.has(slug)) return undefined;
  const family = SERVICE_FAMILIES.find((f) => slug.startsWith(`${f.base}-`));
  return family ? `/mac-repair-${slug.slice(family.base.length + 1)}` : undefined;
}

export function getServiceLocation(slug: string): ServiceLocation | undefined {
  if (RETIRED_COMBOS.has(slug)) return undefined;
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
      const slug = `${family.base}-${townSlug}`;
      if (getLocation(townSlug) && !RETIRED_COMBOS.has(slug)) slugs.push(slug);
    }
  }
  return slugs;
}

/** The combo slugs for a single town (used by the town hub's "popular repairs"). */
export function serviceLocationsForTown(townSlug: string): { slug: string; label: string }[] {
  if (!CORE_CATCHMENT.includes(townSlug)) return [];
  // Retired combos are filtered here too, so a town hub never links to a URL
  // that now 301s straight back to itself.
  return SERVICE_FAMILIES
    .map((f) => ({ slug: `${f.base}-${townSlug}`, label: f.label }))
    .filter((x) => !RETIRED_COMBOS.has(x.slug));
}

/** The combo pages for a single service, across every catchment town. Used by
 *  the parent service page to link down to its spokes (empty for services that
 *  aren't one of the four families). */
export function serviceLocationsForService(serviceSlug: string): { slug: string; townName: string }[] {
  const family = SERVICE_FAMILIES.find((f) => f.serviceSlug === serviceSlug);
  if (!family) return [];
  return CORE_CATCHMENT.flatMap((townSlug) => {
    const loc = getLocation(townSlug);
    const slug = `${family.base}-${townSlug}`;
    return loc && !RETIRED_COMBOS.has(slug) ? [{ slug, townName: loc.name }] : [];
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

// Six structurally-different intro shapes so the combo pages are not
// near-identical to one another. Each weaves in the family's real typical faults
// (service axis) and the town's name/borough/postcode (location axis), so the
// same service reads differently town-to-town and the four services read
// differently within a town. Deeper hand-written value comes from the town's own
// copy (localRepairs etc.) rendered separately on the page.
const INTRO_VARIANTS: ((sl: ServiceLocation) => string[])[] = [
  ({ family, location }) => [
    `When something goes wrong you shouldn't have to unplug everything and queue at a shop counter. We bring ${family.labelLower} directly to your door across ${location.name}${location.postcode ? ` (${location.postcode})` : ''} — an engineer arrives, diagnoses the fault in front of you, and in most cases fixes it the same day. Around here that usually means ${family.typicalFaults}.`,
    `${location.name} sits within our core ${location.borough || 'local'} coverage, close to our New Malden base, so we can usually offer a same-day slot and there is never a callout charge. You get a clear, fixed quote before any work starts, and if we can't fix it you pay nothing.`,
  ],
  ({ family, location }) => [
    `Looking for ${family.labelLower} in ${location.name}? We are a mobile repair service, not a drop-off shop — our engineer comes to your home or office anywhere in ${location.name} and the surrounding ${location.borough || 'area'}, carries the common parts, and completes most jobs on-site in a single visit. The faults we see most here are ${family.typicalFaults}.`,
    `Because ${location.name}${location.postcode ? ` (${location.postcode})` : ''} is close to our New Malden workshop, response times here are among the fastest we offer. Same-day visits are usually available if you call before 2pm — evenings and weekends included — all at no extra charge, and every repair carries a 90-day warranty.`,
  ],
  ({ family, location }) => [
    `${family.label} in ${location.name}, done at your kitchen table or desk. Rather than being without your machine for days, you book a visit, we come to you in ${location.name}, and you watch the repair happen. Typical jobs here run to ${family.typicalFaults} — most sorted the same day, in front of you.`,
    `We cover ${location.name} and the wider ${location.borough || 'local'} district from our nearby New Malden base — no callout fee, a fixed quote agreed upfront, and our No Fix, No Fee promise, so there is no risk in getting it looked at.`,
  ],
  ({ family, location }) => [
    `A dead or damaged device in ${location.name} doesn't have to mean a trip into town. We handle ${family.typicalFaults} on-site, coming to you anywhere in ${location.name}${location.borough ? ` and the rest of ${location.borough}` : ''}, usually the same day you call.`,
    `Our base in New Malden is only a short hop from ${location.name}, so you get quick response times, no callout charge, and a fixed price agreed before we start. Every ${family.labelLower} job is covered by our 90-day parts-and-labour warranty.`,
  ],
  ({ family, location }) => [
    `If you need ${family.labelLower} in ${location.name}, we come to you — home or office — and get it sorted while you watch. ${location.name} is one of the towns nearest our New Malden base, which is why ${family.typicalFaults} are all jobs we can often turn around the same day.`,
    `There is no callout charge to ${location.name}${location.postcode ? ` (${location.postcode})` : ''}, no drop-off, and no fee at all if we can't fix it. We quote before any work begins, so the price we agree is the price you pay.`,
  ],
  ({ family, location }) => [
    `We are the mobile alternative to a ${location.name} repair shop: instead of leaving your device on a counter for a week, you get an engineer at your door, a diagnosis in front of you, and most ${family.labelLower} jobs — ${family.typicalFaults} — finished on the spot.`,
    `${location.name} falls inside our core catchment near New Malden, so same-day slots are usually there if you book before 2pm, and evenings and weekends cost no more. No callout charge, a fixed upfront quote, and our No Fix, No Fee guarantee on every visit.`,
  ],
];

/** A short, service-framed lead-in for the town's local-repairs section. Pairs
 *  the family's real typical faults with the town — a sentence that appears on
 *  neither the London service page nor the town hub. */
export function getServiceLocationFocus(sl: ServiceLocation): string {
  const { family, location } = sl;
  return `Across ${location.name}, the ${family.labelLower} calls we get most often involve ${family.typicalFaults} — though we are called out for plenty more besides.`;
}

// Per-town intros for every core-catchment town. Each is hand-written and
// grounded in that town's real hand-written localIntro copy (its genuine
// neighbourhoods, stations, landmarks and character) with the service family's
// label + typical faults slotted in — so all four services in a town share the
// town's real local detail but read differently, and each town differs from the
// next. No invented local facts: every place-name here also appears in the
// town's localIntro/localRepairs in lib/locations.ts. Extend INTRO_OVERRIDES
// above to deepen a specific service×town further.
const TOWN_INTRO: Record<string, (sl: ServiceLocation) => string[]> = {
  'new-malden': ({ family }) => [
    `New Malden is our home turf — our base is right here, so a ${family.labelLower} call in New Malden, Motspur Park or Old Malden gets one of the fastest responses we offer anywhere, often within the hour. We diagnose it in front of you, at your desk or kitchen table, and the jobs we see most run to ${family.typicalFaults}.`,
    `Being local genuinely helps: we know the streets around Beverley Park, the KT3 addresses that are really Motspur Park or Old Malden, and how to slot you in the same day even when the diary is full. No callout charge, a fixed quote first, and nothing to pay if we can't fix it.`,
  ],
  'kingston-upon-thames': ({ family }) => [
    `We cover all of Kingston upon Thames — the riverside offices and the Bentall Centre area, the residential streets around Norbiton and Kingston Hill, and the university crowd — with a mobile ${family.labelLower} service that comes to you. With Kingston University on the doorstep, ${family.typicalFaults} are among the jobs we see most, and we can usually visit the same day rather than have you carry the machine into town.`,
    `We are five minutes up the road in New Malden, so coming to your flat in Norbiton or your office near the Rose Theatre costs nothing extra and is quick to arrange. Fixed quote before we start, no callout charge, and our No Fix, No Fee guarantee on every visit.`,
  ],
  'surbiton': ({ family }) => [
    `Surbiton's Art Deco station and riverside streets are full of London commuters, and a broken machine the night before a work trip is one of our most common call-outs here. We bring ${family.labelLower} to your door across Surbiton, Berrylands and Hook — ${family.typicalFaults} are all jobs we take on in front of you.`,
    `We are just up the road in New Malden, so visits are quick to arrange and often same-day, and evening appointments — more popular in KT6 than almost anywhere we cover — cost no more than a weekday slot. No callout charge, a fixed quote first, and no fix, no fee.`,
  ],
  'tolworth': ({ family }) => [
    `Tolworth is really two jobs in one — the offices along the A3 and the residential streets off the Broadway — so our ${family.labelLower} call-outs range from small-business machines to home laptops that won't start. Whatever it is, ${family.typicalFaults} included, we come to you and work on it in front of you.`,
    `It is part of our core Kingston-area patch, minutes from our New Malden base, so there is almost no travel time to absorb and we can usually slot you in the same day even when we are busy. No callout charge, a price agreed upfront, and no fix, no fee.`,
  ],
  'worcester-park': ({ family }) => [
    `Worcester Park sits almost on our doorstep, and it is a commuter town at heart — the station runs straight into Waterloo — so a lot of our KT4 ${family.labelLower} calls are people whose home machine has to work for the evening or the weekend. We come to your door rather than have you lose a day carrying it into Kingston or Sutton, taking on ${family.typicalFaults} on the spot where we can.`,
    `Being this close to base, same-day visits are the norm here rather than the exception. We quote before we start, there is no callout charge, and you pay nothing if we can't fix it.`,
  ],
  'raynes-park': ({ family }) => [
    `Raynes Park mixes Victorian terraces with new-build flats around the station, so we see everything here from vintage iMacs to brand-new gaming laptops. We cover Raynes Park and neighbouring West Barnes on the same visit, bringing ${family.labelLower} — ${family.typicalFaults} — to your door.`,
    `It sits right between our New Malden base and Wimbledon, so we are often passing through anyway and can be flexible on timing; a call before 2pm usually means same-day. No callout charge, a fixed quote first, and no fix, no fee.`,
  ],
  'wimbledon': ({ family }) => [
    `From Wimbledon Village down to South Wimbledon and Wimbledon Park, we come to your home or office rather than asking you to queue at a shop. This is one of our strongest work-from-home patches — a lot of SW19 machines are someone's livelihood — so when ${family.typicalFaults} strike, a machine down for days in a shop isn't an option. We handle ${family.labelLower} on-site around the Common where we can.`,
    `We are minutes away in New Malden, so same-day visits are usually easy if you call before 2pm. A fixed quote agreed upfront, no callout charge, and nothing to pay if we can't fix it.`,
  ],
  'chessington': ({ family }) => [
    `Chessington is best known for the theme park, but for us it is a settled family suburb just off the A3 — from North Chessington and the streets around Hook down to Chessington South. Most of our KT9 ${family.labelLower} call-outs are family or teenagers' machines that have taken a knock, and ${family.typicalFaults} are all in a day's work; we come to your door rather than have anyone carry a computer into Kingston.`,
    `Being minutes from our New Malden base via the Kingston bypass, it is one of the quicker areas we reach, with same-day visits the norm. No callout charge, a fixed quote first, and no fix, no fee.`,
  ],
  'morden': ({ family }) => [
    `Morden sits at the southern end of the Northern line, so it is a commuter town at heart — and a lot of our call-outs are people who need the home machine working for the evening or the weekend. We bring ${family.labelLower} to your door around Morden Hall Park, the town centre and the streets off Morden Road, and handle ${family.typicalFaults} on the spot where we can.`,
    `Morden is one of the closest areas to our New Malden base, so response times here are among our quickest and same-day is usually easy if you call before 2pm. No callout charge, a fixed quote before we start, and nothing to pay if we can't fix it.`,
  ],
  'cheam': ({ family }) => [
    `Cheam Village and North Cheam are among the quieter, more residential calls we get — often families whose children's laptops have taken a knock, or a machine that has simply slowed with age. We bring ${family.labelLower} to your door in Cheam, taking on ${family.typicalFaults} in front of you.`,
    `It is settled, family-heavy territory in the Sutton borough, and we cover it with the same no callout charge and 90-day warranty as everywhere else — a fixed price agreed before we start, and no fee at all if we can't fix it.`,
  ],
  'sutton': ({ family }) => [
    `Sutton is really two jobs for us: the busy high street and the offices around the town centre, where a dead machine stops trading, and the large residential belt around them. Either way we come to you — many of our ${family.labelLower} call-outs here are small businesses that can't afford a week without a laptop — and we take on ${family.typicalFaults} the same day where we can.`,
    `We visit homes and workplaces across Sutton with no callout charge either way, quote before we start, and charge nothing if we can't fix it.`,
  ],
  'ewell': ({ family }) => [
    `Ewell Village, with Bourne Hall and Nonsuch Park close by, is one of the quieter corners of our patch — mostly local families whose machine has slowed down or taken a knock. We bring ${family.labelLower} to your door rather than have you drive a fragile computer into Epsom or Kingston, and take on ${family.typicalFaults} in front of you.`,
    `There is no callout charge either way, a fixed quote before we start, and our No Fix, No Fee guarantee on every job.`,
  ],
  'stoneleigh': ({ family }) => [
    `Stoneleigh is a proper 1930s commuter suburb — mock-Tudor semis around the station and the parade of shops on The Broadway — sitting neatly between Worcester Park and Ewell, minutes from our New Malden base. Most of our call-outs are settled households whose machine has to work for the evening or the weekend, so the urgent "it won't start and I need it in the morning" ${family.labelLower} job is common. ${family.typicalFaults} are all things we take on at your door.`,
    `We quote before we start, there is no callout charge, and same-day is usually realistic if you call before 2pm.`,
  ],
  'epsom': ({ family }) => [
    `Best known for the Derby at Epsom Downs, Epsom itself is full of home workers and small offices for whom a machine down means a lost working day. We cover the town centre and station area, the streets climbing toward the Downs, and the villages beyond — coming to wherever the machine is with ${family.labelLower} for ${family.typicalFaults}.`,
    `We can usually reach you the same day if you call before 2pm. There is no callout charge to Epsom or the surrounding villages, a fixed quote first, and no fix, no fee on every job.`,
  ],
  'teddington': ({ family }) => [
    `Teddington's riverside streets and the studios nearby mean a real mix of home and creative-industry machines — often working tools stuffed with projects and running near capacity. When one goes down mid-job, "leave it a week" isn't an answer, so we come to your home studio or desk for ${family.labelLower}, ${family.typicalFaults} included.`,
    `We cover Teddington and Hampton Wick together, usually on the same trip, so getting an engineer to your door rarely takes long. A fixed quote before we start, no callout charge, and no fix, no fee.`,
  ],
  'walton-on-thames': ({ family }) => [
    `Walton-on-Thames runs on a mix of families and home workers, and for the home workers a broken machine is a lost working day — so we come to the house, along the riverside, off the high street or out toward Hersham, for ${family.labelLower}. ${family.typicalFaults} are the jobs we see most, handled in front of you.`,
    `We cover Walton, Hersham and the surrounding streets on the same basis, with no callout charge for the visit, a fixed quote first, and nothing to pay if we can't fix it.`,
  ],
  'esher': ({ family }) => [
    `Esher is one of Surrey's more affluent towns, and a good share of our call-outs are home workers around the High Street and out toward Sandown Park who would rather not hand an expensive machine across a shop counter. Our engineer comes to you, works in front of you, and takes on ${family.labelLower} — ${family.typicalFaults} — on the spot where possible.`,
    `We look after a lot of Esher home offices, where the machine is a working tool and a few days without it costs something. We quote a fixed price before we start, with no callout charge and our No Fix, No Fee guarantee.`,
  ],
  'weybridge': ({ family }) => [
    `Weybridge — Brooklands, Oatlands and one of Surrey's more affluent addresses — often means high-value machines people would rather not leave with a shop for a week. So we come to the house for ${family.labelLower}, work in front of you, and hand the machine straight back; ${family.typicalFaults} are all jobs we take on at your address.`,
    `We cover Weybridge, Oatlands and the surrounding Elmbridge streets on the same basis, with the price agreed before we start and no callout charge.`,
  ],
  'cobham': ({ family }) => [
    `Cobham is one of Surrey's most affluent villages — home to Chelsea FC's training ground and plenty of professionals working from home — and the machines here are often high-value and work-critical. We come to the house or office for ${family.labelLower}, keep the device in your sight the whole time, and take on ${family.typicalFaults} in front of you.`,
    `We cover Cobham, Stoke d'Abernon and the surrounding streets with the same discretion we offer in Chelsea itself — a fixed price agreed before we start, and no callout charge.`,
  ],
  'richmond': ({ family }) => [
    `Richmond is the most Mac-heavy area we cover — full of media and creative professionals editing, designing and producing, often on machines stuffed with project files and running at the limit of their storage. When one goes down mid-project, "leave it a week" isn't an answer, so we bring ${family.labelLower} to your home studio or office; ${family.typicalFaults} are the jobs we are called out for most.`,
    `We cover Richmond, Kew and St Margarets with a fully mobile service — a fixed quote first, no callout charge, and our No Fix, No Fee guarantee.`,
  ],
  'twickenham': ({ family }) => [
    `Away from the rugby stadium, Twickenham is riverside streets, family houses and a strong thread of creative work thanks to the studios nearby — so the machines here are often working tools running near capacity. We bring ${family.labelLower} to your home office or studio, ${family.typicalFaults} included, and plan around big fixtures so a booked visit isn't caught in matchday traffic.`,
    `We cover Twickenham and St Margarets together, coming to your door with a fixed quote first, no callout charge, and no fix, no fee.`,
  ],
  'putney': ({ family }) => [
    `Putney's riverside streets running up from the bridge, and the roads off Lower Richmond Road, are full of people who work from home at least part of the week — so a broken machine here usually means a lost working day. We come to you for ${family.labelLower}, covering Putney and Roehampton together, and take on ${family.typicalFaults} in front of you.`,
    `There is no callout charge either way, a fixed quote before we start, and nothing to pay if we can't fix it.`,
  ],
  'mitcham': ({ family }) => [
    `Mitcham is one of the busier, more mixed parts of our patch — the Cricket Green and the Common at its heart, the tram threading through to Mitcham Junction, and trade units out toward Willow Lane and Beddington. That makes for varied ${family.labelLower} call-outs: a family laptop in a terrace off London Road in the morning, a trade unit's office PC in the afternoon. ${family.typicalFaults} are all in a day's work.`,
    `We are a short hop beyond Morden, itself minutes from our New Malden base, so Mitcham is quick to reach and same-day is realistic more often than not. No callout charge, a fixed quote first, and no fix, no fee.`,
  ],
  'carshalton': ({ family }) => [
    `Carshalton is one of the leafier corners of our patch — the ponds and conservation area around the Village, the quieter avenues of Carshalton Beeches, the more mixed streets toward the Wrythe — and a good share of our SM5 calls are settled households with a machine that has been in the family for years and quietly slowed. We come to your door for ${family.labelLower} rather than have you drive a fragile machine into Sutton, ${family.typicalFaults} included.`,
    `There is no callout charge either way, a fixed quote before we start, and no fix, no fee on every job.`,
  ],
  'wallington': ({ family }) => [
    `Wallington is a proper commuter town — the station runs into London Bridge and Victoria — and a broken home laptop the night before a work day is one of our most common SM6 ${family.labelLower} call-outs. We come to you around Woodcote Road, the station and the residential streets, and take on ${family.typicalFaults} in front of you.`,
    `We are a short run up from our New Malden base, so visits are quick to arrange and often same-day, and evening appointments — popular here — cost no more. No callout charge, a fixed quote first, and no fix, no fee.`,
  ],
  'leatherhead': ({ family }) => [
    `Leatherhead sits right on the edge of the Surrey Hills, and while it is a smaller town than some on our list, we cover it with the same service — most call-outs are family laptops and older desktops due a service, and ${family.typicalFaults} are the jobs we see most. We come to the door for ${family.labelLower} rather than ask anyone to travel.`,
    `We cover Leatherhead, Fetcham and the surrounding streets on the same basis — same-day where we can, no callout charge, and no fix, no fee.`,
  ],
  'banstead': ({ family }) => [
    `Banstead's village feel and the open space of Banstead Downs make it one of our quieter, more residential call-outs — mostly family laptops and the odd ageing desktop. Much of the ${family.labelLower} work here is the practical stuff — ${family.typicalFaults} — that we can usually turn around in a single visit at home.`,
    `We cover Banstead, the surrounding streets and neighbouring Nork on the same fixed-price, no-callout-charge basis as the rest of Surrey, with no fix, no fee on every job.`,
  ],
  'claygate': ({ family }) => [
    `Claygate is a village in every sense — a green, a Parade of independent shops, and a station that empties toward Waterloo each morning — and most of our call-outs are professionals and home workers who would rather not hand an expensive machine across a shop counter. Our engineer comes to you for ${family.labelLower}, works in front of you, and takes on ${family.typicalFaults} on the spot where possible.`,
    `We cover Claygate and the surrounding Elmbridge streets toward Esher, Hinchley Wood and Oxshott on the same basis, with the price agreed before we start and no callout charge.`,
  ],
  'tadworth': ({ family }) => [
    `Tadworth sits up on the North Downs, a semi-rural village between Walton-on-the-Hill, Kingswood and Banstead — one of our quieter, more residential patches of larger houses, families and home workers who value a repair that comes to the door. Our engineer visits the house or home office for ${family.labelLower} and takes on ${family.typicalFaults} in front of you.`,
    `We cover Tadworth and the neighbouring Downs villages on the same fixed-price, no-callout-charge basis as the rest of Surrey, with our No Fix, No Fee guarantee.`,
  ],
};

/** The combination intro paragraphs, in order of preference: a hand-tuned
 *  service×town override, then the town's own grounded intro, then a generic
 *  deterministically-chosen variant (a safety net for any future catchment town
 *  added without a TOWN_INTRO entry). */
export function getServiceLocationIntro(sl: ServiceLocation): string[] {
  const key = `${sl.family.base}:${sl.location.slug}`;
  if (INTRO_OVERRIDES[key]) return INTRO_OVERRIDES[key];
  const townIntro = TOWN_INTRO[sl.location.slug];
  if (townIntro) return townIntro(sl);
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
    { q: `Does ${family.labelLower} cost more because I'm in ${location.name}?`, a: `No. Pricing is the same across ${location.borough || 'the area'} — £120/hr labour plus any parts, quoted before we start, with no location surcharge and no callout charge.` },
  ],
  ({ family, location }) => [
    { q: `Do I need to book ${family.labelLower} in ${location.name} in advance?`, a: `Not far ahead — ${location.name} is close to our New Malden base, so same-day is usually possible if you call before 2pm, and we keep evening and weekend slots open at no extra cost.` },
    { q: `What areas around ${location.name} do you also cover?`, a: `We cover ${location.name} and the wider ${location.borough || 'local'} area on the same terms — same-day where possible, no callout charge, and no fix, no fee.` },
  ],
  ({ family, location }) => [
    { q: `Can you fix my device at home in ${location.name} the same day?`, a: `Usually yes. ${location.name} is one of our nearest towns, so most same-day requests booked before 2pm are covered, and most ${family.labelLower} jobs are finished on-site in a single visit.` },
    { q: `Is ${family.labelLower} in ${location.name} guaranteed?`, a: `Every repair carries a 90-day parts-and-labour warranty, and our No Fix, No Fee guarantee means you pay nothing if we can't fix it — with no callout charge to ${location.name} either way.` },
  ],
];

/** FAQs for a combo page: a service×town focus FAQ, then two rotated
 *  town-logistics FAQs, then the service's own unique FAQs. The focus FAQ is
 *  unique to the intersection, so no two combos share an identical FAQ set. */
export function getServiceLocationFaqs(sl: ServiceLocation): LocationFAQ[] {
  const slug = `${sl.family.base}-${sl.location.slug}`;
  const logistics = LOGISTICS_FAQ_VARIANTS[hashIndex(slug, LOGISTICS_FAQ_VARIANTS.length)](sl);
  const focusFaq: LocationFAQ = {
    q: `What kind of ${sl.family.labelLower} do you do in ${sl.location.name}?`,
    a: `In ${sl.location.name} we handle ${sl.family.typicalFaults}, plus everything else covered on our ${sl.family.label} service. Straightforward jobs are usually completed on-site the same day; board-level work goes to our nearby workshop and comes back fully tested — always quoted first.`,
  };
  const serviceFaqs = sl.service.faqs ?? [];
  return [focusFaq, ...logistics, ...serviceFaqs];
}
