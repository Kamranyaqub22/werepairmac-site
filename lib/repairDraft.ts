import Anthropic from '@anthropic-ai/sdk';
import { locations } from '@/lib/locations';
import { services } from '@/lib/services';
import type { CaseStudy } from '@/lib/caseStudies';

/**
 * Turns a photographed job plus a one-line note into a case-study draft.
 *
 * The single rule this file exists to enforce: **the model may only write what
 * it can source.** Its sources are (a) what is visibly true in the photographs
 * and (b) what the engineer typed. Anything else — a cycle count, a diagnostic
 * step, a part number, a turnaround — is a gap it must ask about, never a
 * detail it may fill in.
 *
 * That matters more here than in ordinary copy: these pages are a record of
 * work done on a real customer's machine, published under the business's name.
 * A plausible invented diagnosis is worse than a blank field, because nobody
 * downstream can tell the two apart.
 */

export interface DraftPhoto {
  /** Raw base64, no data: prefix. */
  data: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}

/** What the model returns: the case study minus everything we control ourselves. */
export interface RepairDraft {
  slug: string;
  title: string;
  metaTitle: string;
  excerpt: string;
  locationSlug: string;
  serviceSlug: string;
  device: string;
  fault: string;
  visitType: CaseStudy['visitType'];
  turnaround: string;
  partsUsed: string[];
  theCall: string;
  diagnosis: string[];
  theRepair: string[];
  outcome: string;
  /** One per uploaded photo, in upload order. */
  photoCaptions: { alt: string; caption: string }[];
  /** Fields it could not source. Empty means it had everything it needed. */
  gaps: { field: string; question: string }[];
}

const LOCATION_SLUGS = locations.map((l) => l.slug);
const SERVICE_SLUGS = services.map((s) => s.slug);

const SYSTEM_PROMPT = `You write repair case studies for We Repair Mac, a mobile Mac and laptop repair business based in New Malden that visits customers at home and at their offices across Greater London.

## Your sources, and the hard limit on them

You have exactly two sources of fact:
1. The photographs attached to the message — what is genuinely visible in them.
2. The engineer's note — what they actually typed.

You may not write a technical claim that does not come from one of those two. This is the whole job. Specifically, never invent: battery cycle counts, diagnostic readings, voltages, part numbers, model years not stated or visible, prices, timings, or steps in a diagnosis that the engineer did not describe and the photos do not show.

When you lack something, put it in \`gaps\` as a short, concrete question. A short draft with three gaps is a success. A complete-looking draft containing one invented detail is a failure, because the reader cannot tell which sentence was sourced and which was filled in.

Write \`diagnosis\` and \`theRepair\` steps ONLY where you have real evidence. If the note says "swollen battery, replaced on site" and a photo shows lifted cells, then "the battery had swollen enough to lift the trackpad — visible in the photo" is sourced, and "cycle count was over 1,000" is not. If you have only one genuine diagnosis step, return one.

## Reading the photographs

Describe what you can actually see. Swelling, corrosion, liquid staining, a cracked panel, a lifted trackpad, a disassembled bottom case, a part on the bench — these are real evidence and you should use them. Do not guess a model from a silhouette. If a photo is just a closed laptop on a table, say so in the alt text and take no diagnosis from it.

## Attribution and privacy

Refer to the customer only by town: "a customer in New Malden", "an office in Kingston". Never invent a name, a street, a business, or a reason for the visit. If a photo shows personal data, a serial number, or an identifiable location, raise it as a gap so the engineer can swap the photo.

## Voice

Plain, confident trade English, first person plural ("we"). No marketing language, no adjectives doing work the facts should do. The reader is someone with the same fault searching for help — they want to recognise their problem and see that it was fixed.

Keep it tight: the whole piece should read in about a minute. Two to five diagnosis steps, two to six repair steps, each one sentence.

## Fields

- \`title\`: natural headline, includes the device and the fault. No town needed.
- \`metaTitle\`: 44 characters or fewer. The layout appends " | We Repair Mac".
- \`excerpt\`: one or two sentences; used as the meta description and card summary.
- \`slug\`: kebab-case, fault + model + town, e.g. "macbook-pro-battery-replacement-new-malden".
- \`locationSlug\`: the town, from the allowed list. If the note names a town not on the list, choose the nearest listed one and raise a gap saying so.
- \`serviceSlug\`: the closest matching service page, from the allowed list.
- \`visitType\`: "on-site" if finished at the customer's; "workshop" if collected and returned; "on-site-then-workshop" if diagnosed there and finished at the bench. If the note doesn't say, raise a gap and use your best reading of the photos.
- \`theCall\`: how the job came in and what the customer reported, in two or three sentences. Town only, never a name or a street.
- \`turnaround\`: as the engineer described it. If unstated, leave it empty and raise a gap. Do not estimate.
- \`partsUsed\`: only parts actually named or clearly visible. Empty array is fine.
- \`outcome\`: what the customer got back, and the 90-day warranty and no-fix-no-fee position, which always apply.
- \`photoCaptions\`: one entry per photo, in the order given. \`alt\` describes what is visible, plainly — it is alt text for a real image, not a keyword slot. \`caption\` is a short line shown under the photo, or empty if the image speaks for itself.`;

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string', description: 'kebab-case: fault + model + town' },
    title: { type: 'string' },
    metaTitle: { type: 'string', description: '44 characters or fewer' },
    excerpt: { type: 'string' },
    locationSlug: { type: 'string', enum: LOCATION_SLUGS },
    serviceSlug: { type: 'string', enum: SERVICE_SLUGS },
    device: { type: 'string', description: 'As specific as the evidence allows' },
    fault: { type: 'string', description: "The symptom in the customer's words" },
    visitType: {
      type: 'string',
      enum: ['on-site', 'workshop', 'on-site-then-workshop'],
    },
    turnaround: { type: 'string', description: 'Empty string if not stated' },
    partsUsed: { type: 'array', items: { type: 'string' } },
    theCall: {
      type: 'string',
      description: 'What the customer reported when they got in touch. Town-level detail only.',
    },
    diagnosis: { type: 'array', items: { type: 'string' } },
    theRepair: { type: 'array', items: { type: 'string' } },
    outcome: { type: 'string' },
    photoCaptions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          alt: { type: 'string' },
          caption: { type: 'string' },
        },
        required: ['alt', 'caption'],
        additionalProperties: false,
      },
    },
    gaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          question: { type: 'string' },
        },
        required: ['field', 'question'],
        additionalProperties: false,
      },
    },
  },
  required: [
    'slug',
    'title',
    'metaTitle',
    'excerpt',
    'locationSlug',
    'serviceSlug',
    'device',
    'fault',
    'visitType',
    'turnaround',
    'partsUsed',
    'theCall',
    'diagnosis',
    'theRepair',
    'outcome',
    'photoCaptions',
    'gaps',
  ],
  additionalProperties: false,
} as const;

export class RepairDraftError extends Error {}

export async function draftRepair(
  note: string,
  photos: DraftPhoto[]
): Promise<RepairDraft> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new RepairDraftError(
      'ANTHROPIC_API_KEY is not set, so drafts cannot be generated.'
    );
  }
  if (photos.length === 0) {
    throw new RepairDraftError('At least one photograph is required.');
  }

  const client = new Anthropic();

  const response = await client.beta.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    // A safety classifier can decline a request; without a fallback the
    // owner's publish flow would just stop. This re-runs a declined request on
    // Anthropic's recommended substitute inside the same call.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM_PROMPT,
    output_config: { format: { type: 'json_schema', schema: DRAFT_SCHEMA } },
    messages: [
      {
        role: 'user',
        content: [
          ...photos.map((photo, i) => ([
            {
              type: 'text' as const,
              text: `Photo ${i + 1} of ${photos.length}:`,
            },
            {
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: photo.mediaType,
                data: photo.data,
              },
            },
          ])).flat(),
          {
            type: 'text' as const,
            text: `The engineer's note about this job:\n\n${note}\n\nWrite the case study from the photographs above and this note. Raise a gap for anything you cannot source from one of them.`,
          },
        ],
      },
    ],
  } as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);

  if (response.stop_reason === 'refusal') {
    throw new RepairDraftError(
      'The drafting model declined this request. Try rephrasing the note, or write the entry by hand.'
    );
  }

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') {
    throw new RepairDraftError('The drafting model returned no usable output.');
  }

  let parsed: RepairDraft;
  try {
    parsed = JSON.parse(text.text) as RepairDraft;
  } catch {
    throw new RepairDraftError('The drafting model returned malformed JSON.');
  }

  // The schema guarantees shape, not sanity. One photo must map to one caption
  // or the gallery renders mismatched alt text.
  if (parsed.photoCaptions.length !== photos.length) {
    parsed.photoCaptions = photos.map(
      (_, i) => parsed.photoCaptions[i] ?? { alt: 'Repair in progress', caption: '' }
    );
  }

  return parsed;
}
