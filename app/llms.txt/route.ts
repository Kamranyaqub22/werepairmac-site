import { services, SERVICE_CATEGORIES } from '@/lib/services';
import { locations } from '@/lib/locations';
import { LABOUR_RATE } from '@/lib/quotes';

// llms.txt, generated rather than hand-maintained.
//
// The previous static file in public/ listed 9 of 21 services and quoted the
// phone number in a format that matched neither the site nor the Google
// listing — and an AI answer we tested repeated that wrong format back. A file
// describing the business is exactly the kind of thing that goes stale
// silently, because nothing breaks when it does. Generating it from
// lib/services.ts means adding a service updates it automatically.
//
// Kept deliberately factual: capabilities, coverage, honest pricing and how to
// get in touch. No marketing adjectives — a model summarising this should end
// up with something true and checkable.

export const dynamic = 'force-static';

const PHONE_DISPLAY = '07378 349222';
const PHONE_E164 = '+447378349222';
const SITE = 'https://www.werepairmac.co.uk';

export function GET() {
  const byCategory = SERVICE_CATEGORIES.map((category) => ({
    category,
    items: services.filter((s) => s.category === category),
  })).filter((g) => g.items.length);

  const serviceLines = byCategory
    .map(
      ({ category, items }) =>
        `### ${category}\n` +
        items.map((s) => `- **${s.title}** — ${s.description} ${SITE}/${s.slug}`).join('\n'),
    )
    .join('\n\n');

  // Towns are listed by name only. 86 URLs would bury the services, and the
  // sitemap already enumerates them for anything that wants the full set.
  const townNames = locations.map((l) => l.name).join(', ');

  const body = `# We Repair Mac

> Mobile computer repair covering all of Greater London. An engineer travels to the
> customer's home or office — there is no shop to visit and nothing needs to be posted.
> We repair Macs, Windows laptops, desktop PCs and games consoles. Around 70% of jobs
> are completed on-site in a single visit; board-level work goes to our workshop.

## Key facts

- **Service model**: On-site at the customer's home or office. No shop, no postal repairs.
- **Coverage**: All of Greater London plus parts of Surrey, from a base in New Malden (KT3).
- **Callout charge**: None, anywhere in the coverage area. Diagnosis is free.
- **Pricing**: Labour is £${LABOUR_RATE} per hour with a one-hour minimum, plus parts.
  Parts are quoted separately and upfront. Both figures are agreed before any work starts.
- **No Fix, No Fee**: If the fault cannot be repaired, the customer pays nothing —
  no diagnostic fee and no travel charge.
- **Warranty**: 90 days on parts and labour.
- **Availability**: Seven days a week, including evenings and weekends at no extra cost.
  Same-day visits are usually possible when booked before 2pm.
- **Founded**: 2015.

## What is done on-site vs in the workshop

On-site, usually in one visit: screen replacements, batteries, keyboards, charging ports,
memory and SSD upgrades, data recovery from a healthy drive, virus and macOS problems,
networking and printer setup, console cleaning and thermal work.

Collected for the workshop: logic board and micro-soldering work, console HDMI port
replacement, severe liquid damage requiring board cleaning, and data recovery from a
physically failed drive. These are quoted after a free diagnosis and typically take a
few days.

Many software faults can be resolved remotely the same day over a secure screen-share,
with no visit required.

## Contact

- **Phone**: ${PHONE_DISPLAY} (${PHONE_E164})
- **WhatsApp**: ${PHONE_E164}
- **Email**: info@werepairmac.co.uk
- **Address**: 18 Vincent House, Burlington Road, New Malden, KT3 4NX
- **Booking**: By phone or WhatsApp is fastest. An online estimate form is at ${SITE}/quote

## Services

${serviceLines}

## Key pages

- **Home**: ${SITE}/
- **Repair costs**: ${SITE}/repair-costs-london
- **Common problems & fixes**: ${SITE}/common-computer-problems-london
- **Home visit / callout**: ${SITE}/mac-repair-home-visit-london
- **Remote support**: ${SITE}/remote-support
- **Get an estimate**: ${SITE}/quote
- **Areas covered**: ${SITE}/areas-we-cover
- **FAQs**: ${SITE}/faqs
- **Repair advice blog**: ${SITE}/blog
- **About**: ${SITE}/about
- **Contact**: ${SITE}/contact

## Areas covered

${townNames}.

Full URL list: ${SITE}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
