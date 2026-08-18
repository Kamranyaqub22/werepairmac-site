import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/adminAuth';
import { getLocation } from '@/lib/locations';
import { getService } from '@/lib/services';
import {
  commitFiles,
  fetchCaseStudiesJson,
  PublishError,
  type PublishFile,
} from '@/lib/githubPublish';
import type { CaseStudy } from '@/lib/caseStudies';
import type { RepairDraft } from '@/lib/repairDraft';

export const runtime = 'nodejs';
// See the note in the draft route — 60s is the Hobby-plan ceiling.
export const maxDuration = 60;

const MAX_PHOTOS = 6;
const MAX_BYTES = 4 * 1024 * 1024;
// See the note in the draft route: Vercel's 4.5MB body cap makes the total the
// limit that actually binds.
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
/** Wide enough for the 896px hero at 2x; anything larger only bloats the repo. */
const MAX_WIDTH = 1800;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form.' }, { status: 400 });
  }

  let draft: RepairDraft;
  try {
    draft = JSON.parse(String(form.get('draft') ?? ''));
  } catch {
    return NextResponse.json({ error: 'Draft payload was not valid JSON.' }, { status: 400 });
  }

  // Re-validate the cross-references here rather than trusting the draft: the
  // payload came back through the browser and may have been edited.
  const location = getLocation(draft.locationSlug);
  const service = getService(draft.serviceSlug);
  if (!location) {
    return NextResponse.json(
      { error: `"${draft.locationSlug}" is not one of our areas.` },
      { status: 400 }
    );
  }
  if (!service) {
    return NextResponse.json(
      { error: `"${draft.serviceSlug}" is not one of our services.` },
      { status: 400 }
    );
  }
  if (!draft.title?.trim() || !draft.excerpt?.trim()) {
    return NextResponse.json({ error: 'Title and summary are required.' }, { status: 400 });
  }
  if (!draft.diagnosis?.length || !draft.theRepair?.length) {
    return NextResponse.json(
      { error: 'A case study needs at least one finding and one repair step.' },
      { status: 400 }
    );
  }

  const uploads = form.getAll('photos').filter((f): f is File => f instanceof File);
  if (uploads.length === 0) {
    return NextResponse.json({ error: 'Add at least one photo.' }, { status: 400 });
  }
  if (uploads.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `Up to ${MAX_PHOTOS} photos.` }, { status: 400 });
  }
  if (uploads.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: 'Those photos are too large in total. Try fewer at once.' },
      { status: 413 }
    );
  }

  try {
    const existing = await fetchCaseStudiesJson();
    const taken = new Set(
      existing
        .map((e) => (typeof e === 'object' && e !== null ? (e as { slug?: unknown }).slug : null))
        .filter((s): s is string => typeof s === 'string')
    );

    let slug = slugify(draft.slug || draft.title);
    if (!slug) {
      return NextResponse.json({ error: 'Could not derive a URL from the title.' }, { status: 400 });
    }
    // Publishing the same slug twice would overwrite the earlier repair's
    // photos and give two entries the same URL.
    if (taken.has(slug)) {
      let n = 2;
      while (taken.has(`${slug}-${n}`)) n += 1;
      slug = `${slug}-${n}`;
    }

    const files: PublishFile[] = [];
    const photos: CaseStudy['photos'] = [];

    for (let i = 0; i < uploads.length; i += 1) {
      const file = uploads[i];
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `${file.name} is too large.` },
          { status: 400 }
        );
      }

      // The browser already downscaled and stripped EXIF (see prepareImage).
      // This second pass is the backstop for anything that reaches the endpoint
      // another way: it normalises to JPEG at a known width and quality, so a
      // large image can never be committed to the repo permanently.
      const optimised = await sharp(Buffer.from(await file.arrayBuffer()))
        .rotate()
        // Bounds the long edge whichever way round the photo is — a width-only
        // cap leaves a portrait shot half again as tall as intended.
        .resize({
          width: MAX_WIDTH,
          height: MAX_WIDTH,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      const path = `public/images/repairs/${slug}-${i + 1}.jpg`;
      files.push({ path, content: optimised.toString('base64'), encoding: 'base64' });

      const caption = draft.photoCaptions?.[i];
      photos.push({
        src: `/images/repairs/${slug}-${i + 1}.jpg`,
        alt: caption?.alt?.trim() || `${draft.device} repair in ${location.name}`,
        ...(caption?.caption?.trim() ? { caption: caption.caption.trim() } : {}),
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    const entry: CaseStudy = {
      slug,
      title: draft.title.trim(),
      ...(draft.metaTitle?.trim() ? { metaTitle: draft.metaTitle.trim() } : {}),
      excerpt: draft.excerpt.trim(),
      ...(draft.metaDescription?.trim()
        ? { metaDescription: draft.metaDescription.trim().slice(0, 155) }
        : {}),
      locationSlug: location.slug,
      serviceSlug: service.slug,
      device: draft.device.trim(),
      fault: draft.fault.trim(),
      visitType: draft.visitType,
      turnaround: draft.turnaround.trim(),
      ...(draft.partsUsed?.filter((p) => p.trim()).length
        ? { partsUsed: draft.partsUsed.filter((p) => p.trim()).map((p) => p.trim()) }
        : {}),
      photos,
      theCall: draft.theCall?.trim() || draft.excerpt.trim(),
      diagnosis: draft.diagnosis.filter((d) => d.trim()),
      theRepair: draft.theRepair.filter((r) => r.trim()),
      outcome: draft.outcome.trim(),
      publishedAt: today,
    };

    files.push({
      path: 'lib/case-studies.json',
      content: `${JSON.stringify([...existing, entry], null, 2)}\n`,
      encoding: 'utf-8',
    });

    const { commitUrl } = await commitFiles(
      files,
      `Add repair case study: ${entry.title}\n\nPublished from /admin/repairs.`
    );

    return NextResponse.json({
      ok: true,
      slug,
      url: `https://www.werepairmac.co.uk/repairs/${slug}`,
      commitUrl,
    });
  } catch (err) {
    if (err instanceof PublishError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error('[admin/repairs/publish]', err);
    return NextResponse.json(
      { error: 'Publishing failed. Check the server logs.' },
      { status: 500 }
    );
  }
}
