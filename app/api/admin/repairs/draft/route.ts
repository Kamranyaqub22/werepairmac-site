import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/adminAuth';
import { draftRepair, RepairDraftError, type DraftPhoto } from '@/lib/repairDraft';

export const runtime = 'nodejs';
// 60s is the ceiling on Vercel's Hobby plan. Asking for more does not raise it
// — the value is clamped and the function is still killed at 60s, returning an
// HTML timeout page rather than JSON. Stating the real limit here keeps this
// file honest about the budget the work below has to fit inside.
export const maxDuration = 60;

// The Claude vision API accepts exactly these. HEIC is absent deliberately —
// it is not supported there, so the browser converts to JPEG before upload
// (see prepareImage in app/admin/repairs/page.tsx).
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
const MAX_PHOTOS = 6;
const MAX_BYTES = 4 * 1024 * 1024;
// Vercel rejects a serverless request body over 4.5MB before any of this runs,
// so the meaningful limit is the total, not the per-file size. The client sends
// downscaled JPEGs a few hundred KB each; this is the backstop.
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
/**
 * Width of the copies sent to the model — deliberately smaller than the 1800px
 * we publish.
 *
 * Image tokens scale with resolution, and prefill time scales with tokens. The
 * questions being asked of these photos ("is that battery swollen", "is there
 * corrosion on the board") are answerable at 1024px, so the extra detail buys
 * nothing here and costs seconds we do not have inside a 60s function.
 */
const MODEL_IMAGE_WIDTH = 1024;

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form.' }, { status: 400 });
  }

  const note = String(form.get('note') ?? '').trim();
  if (!note) {
    return NextResponse.json(
      { error: 'Add a line about the job — the photos alone cannot say what you did.' },
      { status: 400 }
    );
  }

  const uploads = form.getAll('photos').filter((f): f is File => f instanceof File);
  if (uploads.length === 0) {
    return NextResponse.json({ error: 'Add at least one photo.' }, { status: 400 });
  }
  if (uploads.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Up to ${MAX_PHOTOS} photos per repair.` },
      { status: 400 }
    );
  }

  const total = uploads.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: 'Those photos are too large in total. Try fewer at once.' },
      { status: 413 }
    );
  }

  const photos: DraftPhoto[] = [];
  for (const file of uploads) {
    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: `${file.name}: only JPEG, PNG, WebP or GIF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `${file.name} is too large.` },
        { status: 400 }
      );
    }
    const shrunk = await sharp(Buffer.from(await file.arrayBuffer()))
      .resize({ width: MODEL_IMAGE_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    photos.push({
      data: shrunk.toString('base64'),
      mediaType: 'image/jpeg',
    });
  }

  try {
    const draft = await draftRepair(note, photos);
    return NextResponse.json({ draft });
  } catch (err) {
    if (err instanceof RepairDraftError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error('[admin/repairs/draft]', err);
    return NextResponse.json(
      { error: 'Drafting failed. Check the server logs.' },
      { status: 500 }
    );
  }
}
