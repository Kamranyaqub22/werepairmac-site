import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/adminAuth';
import { labelPhotos, PhotoLabelError } from '@/lib/photoLabel';
import type { DraftPhoto } from '@/lib/repairDraft';

export const runtime = 'nodejs';
// 60s is the Hobby-plan ceiling; see the note in the repairs draft route.
export const maxDuration = 60;

const MAX_PHOTOS = 6;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
/**
 * Width of the copies sent to the model, as in the repairs draft route. "What
 * device is this and what is being shown" is answerable at 1024px, and image
 * tokens scale with resolution.
 */
const MODEL_IMAGE_WIDTH = 1024;

/**
 * Suggests a name for each photo. Never writes anything — the operator edits
 * the suggestions and the upload route does the committing.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form.' }, { status: 400 });
  }

  const uploads = form.getAll('photos').filter((f): f is File => f instanceof File);
  if (!uploads.length) {
    return NextResponse.json({ error: 'No photos were attached.' }, { status: 400 });
  }
  if (uploads.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `Up to ${MAX_PHOTOS} photos at a time.` }, { status: 400 });
  }
  if (uploads.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json({ error: 'Those photos are too large to name.' }, { status: 400 });
  }

  const photos: DraftPhoto[] = [];
  for (const file of uploads) {
    try {
      const shrunk = await sharp(Buffer.from(await file.arrayBuffer()))
        .resize({ width: MODEL_IMAGE_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      photos.push({ data: shrunk.toString('base64'), mediaType: 'image/jpeg' });
    } catch {
      return NextResponse.json(
        { error: `"${file.name}" could not be read as an image.` },
        { status: 400 }
      );
    }
  }

  try {
    return NextResponse.json({ labels: await labelPhotos(photos) });
  } catch (err) {
    // Naming is a convenience, so a failure here must not block the upload. The
    // page treats any error as "leave the boxes empty and let me type".
    const message =
      err instanceof PhotoLabelError ? err.message : 'The photos could not be named.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
