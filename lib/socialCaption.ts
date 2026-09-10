import Anthropic from '@anthropic-ai/sdk';
import type { Topic } from '@/lib/socialTopics';

export class CaptionError extends Error {}

export interface Caption {
  /** The post body, ready to publish. Includes no link — that is appended separately. */
  text: string;
  /** Hashtags, without the leading #. Kept apart so they can be dropped wholesale. */
  hashtags: string[];
  /** A prompt for an image generator, when no real photograph suits the topic. */
  imagePrompt: string;
  /** Anything the model could not source from the topic and refused to invent. */
  gaps: string[];
}

const CAPTION_SCHEMA = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    hashtags: { type: 'array', items: { type: 'string' }, maxItems: 5 },
    imagePrompt: { type: 'string' },
    gaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['text', 'hashtags', 'imagePrompt', 'gaps'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You write Facebook posts for We Repair Mac, a mobile Mac, laptop, PC and games console repair service covering Greater London and north Surrey. An engineer drives to the customer's home or office. Around 70% of jobs are finished on the spot; the rest go back to the workshop. No fix, no fee. The number is 07378 349222.

You are writing as the engineer who does the work — one person, not a marketing department.

HOW TO WRITE

- 40 to 80 words. Facebook truncates past roughly 250 characters, so the first sentence has to carry the post on its own.
- Plain British English. "Aluminium", "diagnose", "kerb". No Americanisms.
- Lead with the concrete thing: the fault, the symptom, the part. Never lead with the company name or a greeting.
- Write like someone describing a job to a neighbour. Short sentences. No hype, no "Are you struggling with...", no "Look no further", no "we're excited to".
- One clear next step at the end, usually the phone number or a nudge to message.
- Never promise a price, a timescale or an outcome that is not in the source material below.
- Never invent a customer, a quote, a location or a job that is not in the material.
- No emoji spam. At most one, and only when it genuinely helps. Usually none.
- Do not write "click the link" — Facebook suppresses posts that beg for clicks.

HASHTAGS

Three at most. Local and specific beats broad: #MacRepairLondon over #Technology. Lowercase-friendly camel case, no leading #.

IMAGE PROMPT

Also write a prompt for an image generator, in case no real photograph is available. Describe a plain, realistic photograph — a workbench, a device, a hand tool, natural light. Never people's faces, never text or logos in the image, never a glossy product render. If the topic is a real repair, describe what that repair actually looks like on a bench. Keep it under 60 words.

GAPS

If the material does not tell you something you would need in order to write honestly, do not fill it in. List it in gaps instead. An empty gaps array is fine and normal.`;

export async function writeCaption(topic: Topic): Promise<Caption> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new CaptionError('ANTHROPIC_API_KEY is not set, so captions cannot be written.');
  }

  const client = new Anthropic();

  let response;
  try {
    response = await client.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      // Matches the repair drafter: a declined request should fall back rather
      // than break the one flow the owner uses to publish.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: 'json_schema', schema: CAPTION_SCHEMA },
        // Writing 60 words from supplied material is a style task, not a
        // reasoning one, and this has to land well inside the function budget.
        effort: 'low',
      },
      messages: [
        {
          role: 'user',
          content: `Write one Facebook post about this.

Kind: ${topic.kind === 'repair' ? 'a real repair we carried out' : topic.kind === 'advice' ? 'a repair-advice article we published' : 'a service we offer'}
Subject: ${topic.subject}
Material: ${topic.detail}

Everything you write must be sourced from the material above. The post links to ${topic.url}, so do not repeat the URL in the text.`,
        },
      ],
    } as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);
  } catch (err) {
    throw new CaptionError(
      err instanceof Error ? `The caption model failed: ${err.message}` : 'The caption model failed.'
    );
  }

  if (response.stop_reason === 'refusal') {
    throw new CaptionError(
      'The model declined to write this one. Pick a different topic, or write the caption by hand.'
    );
  }

  const block = response.content.find((c) => c.type === 'text');
  if (!block || block.type !== 'text') {
    throw new CaptionError('The caption model returned nothing usable.');
  }

  let parsed: Caption;
  try {
    parsed = JSON.parse(block.text) as Caption;
  } catch {
    throw new CaptionError('The caption model returned malformed JSON.');
  }

  if (!parsed.text?.trim()) {
    throw new CaptionError('The caption came back empty.');
  }

  return {
    text: parsed.text.trim(),
    hashtags: (parsed.hashtags ?? []).map((h) => h.replace(/^#/, '').trim()).filter(Boolean),
    imagePrompt: parsed.imagePrompt?.trim() ?? '',
    gaps: parsed.gaps ?? [],
  };
}

/** Assembles the caption, hashtags and link into the string that gets posted. */
export function composePostText(caption: Caption, url: string): string {
  const tags = caption.hashtags.length ? `\n\n${caption.hashtags.map((h) => `#${h}`).join(' ')}` : '';
  return `${caption.text}\n\n${url}${tags}`;
}
