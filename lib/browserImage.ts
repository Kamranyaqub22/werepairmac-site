/**
 * Browser-side image preparation and response reading, shared by the admin
 * consoles.
 *
 * Extracted from app/admin/repairs when the photo library added a second
 * uploader. The HEIC and EXIF handling below took real debugging to get right
 * and is the last thing that should exist in two copies drifting apart.
 */

/**
 * Cap on the image's LONG edge, whichever way round it is.
 *
 * Capping width instead is the obvious-looking mistake: a portrait photo is
 * narrow, so a width cap barely scales it down. A 3024x4032 phone shot capped
 * to 1800 wide comes out 1800x2400 — 4.3 megapixels, nearly double a landscape
 * shot capped the same way, and big enough that the "converted" file is still
 * about a megabyte. Bench photos of a laptop are usually portrait, so that was
 * the common case, not the edge case.
 */
export const MAX_UPLOAD_EDGE = 1800;

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Read an API response without assuming it is JSON.
 *
 * Not every response to these endpoints comes from our own code: a function
 * timeout, a body-size rejection or a bot-protection challenge all return HTML
 * from Vercel's edge. Calling `.json()` on those throws a parser error — in
 * Safari, "The string did not match the expected pattern" — which tells the
 * operator nothing about what actually went wrong and hides the status code
 * that would.
 */
export async function readJson(res: Response): Promise<Record<string, unknown>> {
  const body = await res.text();

  try {
    return JSON.parse(body) as Record<string, unknown>;
  } catch {
    if (res.status === 504 || /timeout|FUNCTION_INVOCATION_TIMEOUT/i.test(body)) {
      throw new Error(
        'The server took too long and gave up (60s limit). Try again with fewer photos.'
      );
    }
    if (res.status === 413) {
      throw new Error('Those photos were too large for the server to accept.');
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error('Your session expired, or the request was blocked. Reload and sign in again.');
    }
    throw new Error(
      `The server returned ${res.status} rather than a result. ${body.slice(0, 120).replace(/<[^>]*>/g, ' ').trim()}`
    );
  }
}

/**
 * Does this look like an iPhone photo Chrome cannot decode?
 *
 * Checked on name as well as type because Chrome frequently reports an empty
 * `type` for a .heic picked from disk — it does not recognise the format, so it
 * has no MIME to report, which is the same reason it cannot display it.
 */
function looksLikeHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

/**
 * Decode a HEIC to a JPEG blob using libheif compiled to the browser.
 *
 * Only reached when the browser's own decoder has already failed, and imported
 * dynamically so the ~2.9MB decoder is a separate chunk fetched on demand
 * rather than shipped to every visitor. Safari decodes HEIC natively and never
 * downloads this at all.
 */
async function decodeHeic(file: File): Promise<File> {
  const { heicTo } = await import('heic-to');
  const blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 });
  const name = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
}

/** Load a file into a decoded <img>, or reject if the browser cannot read it. */
async function decodeToImage(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
    return { img, url };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Decode, downscale and re-encode a photo to JPEG in the browser before it is
 * uploaded. Three separate reasons this happens client-side rather than on the
 * server:
 *
 * 1. iPhones shoot HEIC, and the Claude vision API does not accept it. Neither
 *    does sharp's prebuilt binary, which ships without an HEVC decoder — so the
 *    server genuinely cannot do this conversion. Safari decodes HEIC natively;
 *    Chrome and Firefox never have, so those fall back to decodeHeic below.
 * 2. Vercel caps a serverless request body at 4.5MB. Six untouched iPhone
 *    photos are several times that and would 413 before any of our code ran.
 * 3. It makes the upload fast on mobile data — a ~5MB original becomes a few
 *    hundred KB.
 *
 * Re-encoding through a canvas also drops EXIF, so the customer's GPS
 * coordinates never leave the phone.
 */
export async function prepareImage(file: File): Promise<File> {
  // Loaded through an <img> rather than createImageBitmap. The latter takes an
  // `imageOrientation: 'from-image'` option that Safari accepts and then
  // ignores — so a photo taken with the phone rotated came through in raw
  // sensor orientation, and the canvas step then stripped the EXIF that would
  // have let anything downstream correct it. The rotation was lost for good,
  // and only for photos that needed it, which is why most looked fine.
  //
  // Browsers apply EXIF orientation to <img> by default (`image-orientation:
  // from-image`), so naturalWidth/naturalHeight and the drawn pixels are both
  // already upright — including a JPEG that came back from the HEIC fallback,
  // since it is loaded through the same path.
  let img: HTMLImageElement;
  let url: string;

  try {
    ({ img, url } = await decodeToImage(file));
  } catch {
    // Chrome and Firefox have never shipped a HEIC decoder — HEVC licensing —
    // so an iPhone photo fails here on every browser except Safari, which gets
    // it free from macOS. Rather than sending the operator away to convert the
    // file or switch browser, fetch libheif and decode it ourselves.
    if (!looksLikeHeic(file)) {
      throw new Error(`This browser can't read "${file.name}". Try a JPEG or PNG.`);
    }

    let converted: File;
    try {
      converted = await decodeHeic(file);
    } catch {
      throw new Error(
        `"${file.name}" could not be converted. If it is a HEIC from an iPhone, open it in Photos and share it as a JPEG.`
      );
    }

    try {
      ({ img, url } = await decodeToImage(converted));
    } catch {
      throw new Error(`"${file.name}" converted but could not be read back. Try sharing it as a JPEG.`);
    }
    file = converted;
  }

  const srcWidth = img.naturalWidth;
  const srcHeight = img.naturalHeight;
  const scale = Math.min(1, MAX_UPLOAD_EDGE / Math.max(srcWidth, srcHeight));
  const width = Math.round(srcWidth * scale);
  const height = Math.round(srcHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error('Could not process the image in this browser.');
  }
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.82)
  );
  if (!blob) {
    // iOS returns null here when the canvas exceeds its area limit, which is
    // the other way a "converted" photo can come back wrong.
    throw new Error(`Could not convert "${file.name}" — try a smaller photo.`);
  }

  const name = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
}
