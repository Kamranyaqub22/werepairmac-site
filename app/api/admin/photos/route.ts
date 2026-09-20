import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/adminAuth';
import {
  commitFiles,
  fetchRepoDirectory,
  PublishError,
  type PublishFile,
} from '@/lib/githubPublish';

export const runtime = 'nodejs';
// Same ceiling as the repair publisher — 60s is the Hobby-plan limit.
export const maxDuration = 60;

/**
 * The photo library: upload bench photos once, use them in posts later.
 *
 * Photos land in photo-library/ as a commit rather than in a bucket, for the
 * same reason the case studies do — this site has no persistent store and a
 * serverless filesystem does not survive the request. Git is the store that
 * already exists, and it makes every addition diffable and revertible.
 *
 * These are originals, not published assets. Nothing here is rendered by the
 * site; a photo is copied into public/images/ at the size and name a post needs
 * when it is actually used, so the same original can be reused later.
 */

const LIBRARY_PATH = 'photo-library';
const MAX_PHOTOS = 6;
/** Vercel rejects a request body over 4.5MB before any of this code runs. */
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
/** Matches MAX_UPLOAD_EDGE in lib/browserImage — the browser has already done this. */
const MAX_EDGE = 1800;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/** GET — what is already in the library. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const files = await fetchRepoDirectory(LIBRARY_PATH);
    const photos = files
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ photos });
  } catch (err) {
    const message = err instanceof PublishError ? err.message : 'Could not read the photo library.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/** POST — add photos to the library. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form.' }, { status: 400 });
  }

  const photos = form.getAll('photos').filter((p): p is File => p instanceof File);
  if (!photos.length) {
    return NextResponse.json({ error: 'No photos were attached.' }, { status: 400 });
  }
  if (photos.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Up to ${MAX_PHOTOS} photos at a time.` },
      { status: 400 }
    );
  }

  const total = photos.reduce((sum, p) => sum + p.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: 'Those photos come to more than 4MB in total. Send fewer at a time.' },
      { status: 400 }
    );
  }

  // One description per photo, in the same order, naming the file. Falls back to
  // the original filename so an unlabelled upload still lands somewhere sane.
  const labels = form.getAll('labels').map((l) => String(l));

  // Read the library first so a second upload of the same description does not
  // silently overwrite the first — the whole point is to accumulate originals.
  let taken: Set<string>;
  try {
    taken = new Set((await fetchRepoDirectory(LIBRARY_PATH)).map((f) => f.name.toLowerCase()));
  } catch (err) {
    const message = err instanceof PublishError ? err.message : 'Could not read the photo library.';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const files: PublishFile[] = [];
  const named: string[] = [];

  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i];
    let jpeg: Buffer;
    try {
      // The browser has already resized and converted to JPEG. Re-encoding here
      // is the backstop for anything posted directly to this endpoint, and
      // normalises quality across both paths.
      jpeg = await sharp(Buffer.from(await photo.arrayBuffer()))
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } catch {
      return NextResponse.json(
        { error: `"${photo.name}" could not be read as an image.` },
        { status: 400 }
      );
    }

    const base =
      slugify(labels[i] ?? '') || slugify(photo.name.replace(/\.[^.]+$/, '')) || 'photo';

    // Suffix only on collision, so the first upload of a name stays clean.
    let name = `${base}.jpg`;
    let n = 2;
    while (taken.has(name.toLowerCase())) {
      name = `${base}-${n}.jpg`;
      n += 1;
    }
    taken.add(name.toLowerCase());

    files.push({
      path: `${LIBRARY_PATH}/${name}`,
      content: jpeg.toString('base64'),
      encoding: 'base64',
    });
    named.push(name);
  }

  try {
    const { commitUrl } = await commitFiles(
      files,
      `Photo library: add ${files.length} photo${files.length === 1 ? '' : 's'}`
    );
    return NextResponse.json({ ok: true, added: named, commitUrl });
  } catch (err) {
    const message = err instanceof PublishError ? err.message : 'The upload could not be committed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
