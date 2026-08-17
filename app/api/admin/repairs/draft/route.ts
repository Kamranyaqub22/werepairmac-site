import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { draftRepair, RepairDraftError, type DraftPhoto } from '@/lib/repairDraft';

export const runtime = 'nodejs';
// Opus 5 thinks before answering and reads several images; the platform default
// would cut a normal draft off partway.
export const maxDuration = 300;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
const MAX_PHOTOS = 6;
const MAX_BYTES = 8 * 1024 * 1024;

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
        { error: `${file.name} is over 8MB — shrink it first.` },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    photos.push({
      data: buffer.toString('base64'),
      mediaType: file.type as DraftPhoto['mediaType'],
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
