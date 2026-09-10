import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export class SocialImageError extends Error {}

/**
 * Facebook downscales anything larger and crops hard in the feed. 1200x1200
 * square survives both the timeline and the mobile app without letterboxing,
 * which the 1.91:1 link-preview ratio does not.
 */
const OUTPUT_EDGE = 1200;
const OUTPUT_QUALITY = 82;

export interface PhotoOption {
  /** Web path, e.g. /images/repairs/foo-1.jpg */
  src: string;
  /** Where it came from, for grouping in the picker. */
  group: 'This topic' | 'Real repairs' | 'Article images';
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function listDir(rel: string): Promise<string[]> {
  try {
    const entries = await readdir(path.join(PUBLIC_DIR, rel));
    return entries.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => `${rel}/${f}`);
  } catch {
    return [];
  }
}

/**
 * Every real photograph available to a post, the topic's own first.
 *
 * Deliberately excludes the stock Unsplash files in public/images: they are
 * fine as page furniture but a stock desk shot posted as though it were our
 * work is the exact thing that makes a trade page look automated.
 */
export async function realPhotoOptions(topicPhotos: string[]): Promise<PhotoOption[]> {
  const [repairs, blog] = await Promise.all([listDir('/images/repairs'), listDir('/images/blog')]);

  const seen = new Set<string>();
  const out: PhotoOption[] = [];

  const push = (src: string, group: PhotoOption['group']) => {
    if (seen.has(src)) return;
    seen.add(src);
    out.push({ src, group });
  };

  for (const src of topicPhotos) push(src, 'This topic');
  for (const src of repairs) push(src, 'Real repairs');
  for (const src of blog) push(src, 'Article images');

  return out;
}

/** Loads a real photo off disk and squares it up for the feed. */
export async function loadRealPhoto(src: string): Promise<string> {
  // The picker is the only caller, but the value round-trips through the
  // browser, so treat it as untrusted: confine it to the two folders we offer.
  if (!/^\/images\/(repairs|blog)\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(src)) {
    throw new SocialImageError(`"${src}" is not a photo this tool can post.`);
  }

  let raw: Buffer;
  try {
    raw = await readFile(path.join(PUBLIC_DIR, src));
  } catch {
    throw new SocialImageError(`Could not read ${src}.`);
  }

  return squareUp(raw);
}

/**
 * Fits the image into a square without cropping the subject out.
 *
 * `contain` rather than `cover` on purpose: these are bench photographs where
 * the fault is often at one edge — the corroded corner of a board, a swollen
 * cell at the bottom of a battery — and a centre crop is exactly what removes
 * the thing the picture is there to show. The same reasoning as the case-study
 * hero on the site.
 */
async function squareUp(input: Buffer): Promise<string> {
  const out = await sharp(input)
    .rotate() // honour EXIF orientation; phone shots arrive sideways otherwise
    .resize(OUTPUT_EDGE, OUTPUT_EDGE, {
      fit: 'contain',
      background: { r: 17, g: 24, b: 28 },
    })
    .jpeg({ quality: OUTPUT_QUALITY })
    .toBuffer();

  return out.toString('base64');
}

/* ------------------------------------------------------------------ */
/* AI generation                                                       */
/* ------------------------------------------------------------------ */

/**
 * Generated images are opt-in and off by default.
 *
 * Anthropic does not generate images, so this needs a separate provider and a
 * separate key. Left unset, the admin screen simply does not offer the option
 * rather than failing at the point of use.
 */
export function isGenerationConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const IMAGE_MODEL = process.env.SOCIAL_IMAGE_MODEL || 'gpt-image-1';

/**
 * Generates an image from the caption model's prompt.
 *
 * Called through plain fetch rather than a client library: it is one endpoint,
 * and a second SDK in the bundle for one call is not worth the weight.
 */
export async function generateImage(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new SocialImageError(
      'OPENAI_API_KEY is not set, so images cannot be generated. Add it, or pick a real photo instead.'
    );
  }
  if (!prompt.trim()) {
    throw new SocialImageError('There is no image prompt to generate from.');
  }

  // Steering appended here rather than in the caption model's prompt so it
  // applies even when the owner has edited the prompt by hand.
  const guarded = `${prompt.trim()}

Photographic, natural light, shallow depth of field. A real workbench, not a studio. No text, no logos, no watermarks, no readable branding. No human faces.`;

  let res: Response;
  try {
    res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: guarded,
        n: 1,
        size: '1024x1024',
      }),
    });
  } catch (err) {
    throw new SocialImageError(
      err instanceof Error ? `Could not reach the image API: ${err.message}` : 'Could not reach the image API.'
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    if (res.status === 401) {
      throw new SocialImageError('The image API rejected OPENAI_API_KEY.');
    }
    if (res.status === 429) {
      throw new SocialImageError('The image API is rate limiting or out of credit. Try a real photo instead.');
    }
    throw new SocialImageError(`Image generation failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const body = (await res.json()) as { data?: { b64_json?: string; url?: string }[] };
  const first = body.data?.[0];

  if (first?.b64_json) return squareUp(Buffer.from(first.b64_json, 'base64'));

  // Some models return a URL instead of inline base64.
  if (first?.url) {
    const img = await fetch(first.url);
    if (!img.ok) throw new SocialImageError('The generated image could not be downloaded.');
    return squareUp(Buffer.from(await img.arrayBuffer()));
  }

  throw new SocialImageError('The image API returned no image.');
}
