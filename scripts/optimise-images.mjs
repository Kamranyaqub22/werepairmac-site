/**
 * Re-encode oversized source JPEGs in public/images.
 *
 * Next's image pipeline resizes on request, but it can only work from what we
 * ship: several heroes were committed as 300-460 kB, 4000px-wide originals, and
 * they sit on the location and combo templates — the pages we most want indexed.
 * Capping the stored width and using mozjpeg cuts the bytes without touching the
 * rendered result, since nothing displays them above MAX_WIDTH.
 *
 * Re-running is safe and does nothing. "Within budget" cannot be judged on file
 * size alone — a 200 kB photo at 2000px is already as small as it usefully gets,
 * but it still trips the size threshold, and re-encoding it would shave a
 * kilobyte while quietly losing a generation of JPEG quality. So a file is only
 * rewritten when the re-encode saves at least MIN_GAIN of its size.
 *
 *   node scripts/optimise-images.mjs          # report only
 *   node scripts/optimise-images.mjs --write  # rewrite in place
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/images', 'public/images/blog'];
const MAX_WIDTH = 2000;
const QUALITY = 78;
const REPORT_OVER = 100 * 1024;
// Minimum share of the original size a re-encode must save to be worth doing.
const MIN_GAIN = 0.1;

const write = process.argv.includes('--write');
const kb = (n) => `${Math.round(n / 1024)} kB`;

let before = 0;
let after = 0;
let touched = 0;

for (const root of ROOTS) {
  let entries;
  try {
    entries = await readdir(root);
  } catch {
    continue;
  }

  for (const name of entries) {
    if (!/\.jpe?g$/i.test(name)) continue;

    const file = path.join(root, name);
    const { size } = await stat(file);
    const meta = await sharp(file).metadata();

    const oversized = size > REPORT_OVER || (meta.width ?? 0) > MAX_WIDTH;
    if (!oversized) continue;

    const buf = await sharp(file)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    // Only rewrite for a real saving — never for a kilobyte and a quality loss.
    if (buf.length > size * (1 - MIN_GAIN)) {
      console.log(`  skip   ${name} (${kb(size)}, already optimised)`);
      continue;
    }

    before += size;
    after += buf.length;
    touched += 1;
    console.log(
      `  ${write ? 'write ' : 'would '} ${name}  ${kb(size)} -> ${kb(buf.length)}  ` +
        `(${meta.width}x${meta.height})`,
    );
    if (write) await writeFile(file, buf);
  }
}

if (touched === 0) {
  console.log('\nNothing to do — every image is already within budget.');
} else {
  console.log(
    `\n${touched} image(s): ${kb(before)} -> ${kb(after)} ` +
      `(saved ${kb(before - after)}, ${Math.round((1 - after / before) * 100)}%)`,
  );
  if (!write) console.log('Dry run. Re-run with --write to apply.');
}
