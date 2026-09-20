import Anthropic from '@anthropic-ai/sdk';
import type { DraftPhoto } from '@/lib/repairDraft';

/**
 * Names photos for the library from the photos themselves.
 *
 * The filename is the only thing that makes a photo findable a year later, and
 * typing six of them by hand is exactly the chore that gets skipped — the first
 * test upload went in as "logo.jpg" because the description was left blank. So
 * the model proposes a name and the operator corrects it, rather than starting
 * from an empty box.
 *
 * Suggestions only. They land in editable fields and nothing is uploaded until
 * the operator presses the button.
 */

export class PhotoLabelError extends Error {}

const LABEL_SCHEMA = {
  type: 'object',
  properties: {
    labels: {
      type: 'array',
      items: {
        type: 'string',
        description:
          'Three to six lowercase words naming the device and what the photo shows.',
      },
    },
  },
  required: ['labels'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You name photographs for the internal photo library of a London computer repair business. The photos are bench and on-site shots of repairs in progress.

For each photo, write three to six lowercase words that would let someone find it again among hundreds. Name the device and what the photo actually shows.

Good: "macbook pro swollen battery removed", "ps5 heatsink thick dust", "imac screen adhesive strips", "laptop board corrosion after spill"

Rules:
- Describe only what is visible. Never guess the model number, the year, the customer or the fault if the photo does not show it.
- When you cannot identify the device, say what you can see: "silver laptop opened on bench", "circuit board close up".
- No punctuation, no file extensions, no dates, no words like "photo" or "image".
- Return exactly one label per photo, in the order the photos were given.`;

/**
 * @param photos Images already downscaled for the model by the caller.
 * @returns One label per photo, in order.
 */
export async function labelPhotos(photos: DraftPhoto[]): Promise<string[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new PhotoLabelError('ANTHROPIC_API_KEY is not set, so photos cannot be named.');
  }
  if (photos.length === 0) return [];

  const client = new Anthropic();

  const response = await client.beta.messages.create({
    model: 'claude-opus-5',
    // A handful of short strings. The cap is a backstop, not a budget.
    max_tokens: 1000,
    // As in lib/repairDraft — a safety classifier declining a request should
    // not take the console down with it.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: 'json_schema', schema: LABEL_SCHEMA },
      // Naming what is in a photograph is recognition, not reasoning, and the
      // whole request shares a 60s function with the upload. `medium` in
      // repairDraft buys judgement this task does not need.
      effort: 'low',
    },
    messages: [
      {
        role: 'user',
        content: [
          ...photos
            .map((photo, i) => [
              { type: 'text' as const, text: `Photo ${i + 1} of ${photos.length}:` },
              {
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: photo.mediaType,
                  data: photo.data,
                },
              },
            ])
            .flat(),
          {
            type: 'text' as const,
            text: `Name all ${photos.length} photo${photos.length === 1 ? '' : 's'} above, in order.`,
          },
        ],
      },
    ],
  } as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);

  if (response.stop_reason === 'refusal') {
    throw new PhotoLabelError('The naming request was declined.');
  }

  const block = response.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new PhotoLabelError('No names came back.');
  }

  let parsed: { labels?: unknown };
  try {
    parsed = JSON.parse(block.text);
  } catch {
    throw new PhotoLabelError('The names came back in a form we could not read.');
  }

  const labels = Array.isArray(parsed.labels)
    ? parsed.labels.map((l) => (typeof l === 'string' ? l.trim() : ''))
    : [];

  // Pad or trim to match the photos exactly, so the page can zip them to the
  // inputs by index without checking. A missing one is an empty box, which is
  // where this started.
  return photos.map((_, i) => labels[i] ?? '');
}
