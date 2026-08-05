/**
 * SEO regression audit — run against the BUILT output, not the source.
 *
 *   npm run build && npm run seo:audit
 *
 * Every check here exists because the thing it checks for actually went wrong on
 * this site at least once. The point is that a change either passes these or it
 * gets explained, so nobody has to re-derive the same findings by hand.
 *
 * FAIL = ship-blocking. WARN = known backlog, tracked but not urgent.
 * Exit code is 1 if there is any FAIL, so this can gate a deploy.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const APP = '.next/server/app';
const SITE = 'https://www.werepairmac.co.uk';
// The root layout appends " | We Repair Mac" (16 chars) via title.template.
const MAX_TITLE = 60;
const MAX_DESC = 155;
const MIN_DESC = 70;
// Body words with <script> stripped — the RSC payload in the built HTML is JSON,
// not prose, and counting it inflates every page roughly fivefold. Measured
// ranges: combos 1,123-1,532, town hubs 1,058-1,418, service pages 797-1,378.
// 1,000 flags the pages still on a bare template without flagging healthy ones.
const MIN_CONTENT_WORDS = 1000;
// Pages that are legitimately short: legal, utility and conversion pages.
const THIN_OK = new Set([
  '_not-found', 'cookies', 'privacy', 'review', 'quote', 'contact', 'about',
  'remote-support', 'blog', 'faqs', 'care-plans', 'why-choose-us', 'index',
  'areas-we-cover',
]);
// Internal-link floors. These are the numbers lib/locations.ts and
// lib/serviceLocations.ts claim to guarantee; the render used to silently
// truncate below them, which is why they are asserted here.
const MIN_TOWN_INBOUND = 8;
const MIN_SPOKE_INBOUND = 4;

if (!existsSync(APP)) {
  console.error(`No build found at ${APP}. Run: npm run build`);
  process.exit(1);
}

const fails = [];
const warns = [];
const fail = (check, detail) => fails.push({ check, detail });
const warn = (check, detail) => warns.push({ check, detail });

// ─── Load the built pages ────────────────────────────────────────────────────

function collect(dir, prefix = '') {
  const out = new Map();
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      for (const [k, v] of collect(full, `${prefix}${entry}/`)) out.set(k, v);
    } else if (entry.endsWith('.html')) {
      out.set(prefix + entry.slice(0, -5), readFileSync(full, 'utf8'));
    }
  }
  return out;
}

const pages = collect(APP);
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
// Entities must be decoded before measuring length: "&amp;" is one character in
// a SERP but five in the source, and counting the raw form invents overruns.
const decode = (s) =>
  s === undefined
    ? s
    : s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;|&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&#x2F;/g, '/');
const tag = (html, re) => decode((html.match(re) || [])[1]);
const headings = (html) =>
  [...html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) =>
    m[2].replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '').trim(),
  );

// ─── 1. Titles, descriptions, canonicals, H1 ─────────────────────────────────

for (const [slug, html] of pages) {
  if (slug === '_not-found') continue;

  const title = tag(html, /<title>([\s\S]*?)<\/title>/);
  if (!title) fail('title-missing', slug);
  else if (title.length > MAX_TITLE)
    fail('title-too-long', `${slug} — ${title.length} chars: "${title}"`);

  const desc = tag(html, /name="description" content="([^"]*)"/);
  if (!desc) fail('description-missing', slug);
  else {
    if (desc.length > MAX_DESC)
      fail('description-too-long', `${slug} — ${desc.length} chars`);
    if (desc.length < MIN_DESC)
      warn('description-short', `${slug} — ${desc.length} chars`);
  }

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail('h1-count', `${slug} has ${h1s} h1 elements`);

  const canon = tag(html, /rel="canonical" href="([^"]*)"/);
  if (!canon) fail('canonical-missing', slug);
  else {
    const expected = slug === 'index' ? SITE : `${SITE}/${slug}`;
    if (canon.replace(/\/$/, '') !== expected.replace(/\/$/, ''))
      fail('canonical-mismatch', `${slug} → ${canon}`);
  }
}

// ─── 2. Templated descriptions that should have been overridden ──────────────
//
// firstThatFits() falls back to a shared template when the composed description
// exceeds MAX_DESC. The fallback is silent, so a metaHook that is a few chars too
// long looks like it worked while shipping the generic copy.

const FALLBACK_MARKERS = [
  'Professional Mac, PC, laptop and gaming repair in',
  'at your home or office. We fix',
];
for (const [slug, html] of pages) {
  if (!/^(mac-repair-|macbook-repair-|laptop-repair-|console-repair-|data-recovery-)/.test(slug)) continue;
  const desc = tag(html, /name="description" content="([^"]*)"/) || '';
  for (const marker of FALLBACK_MARKERS) {
    if (desc.includes(marker))
      warn('description-fell-back-to-template', `${slug} — no usable metaHook`);
  }
}

// ─── 3. Brand names mangled by lowercasing ───────────────────────────────────
//
// shortTitle.toLowerCase() produced "What macbook repair costs" on live pages.
// serviceLower() fixes it; this stops it coming back.

const BRANDS = /\b(macbook|imac|ipad|iphone|macos|ps4|ps5|playstation|xbox|nintendo|thinkpad)\b/;
for (const [slug, html] of pages) {
  for (const h of headings(html)) {
    const m = h.match(BRANDS);
    if (m) fail('brand-name-lowercased', `${slug} — "${h}" (${m[1]})`);
  }
}

// ─── 4. Sitemap honesty ──────────────────────────────────────────────────────

const sitemapFile = path.join(APP, 'sitemap.xml.body');
if (!existsSync(sitemapFile)) {
  fail('sitemap-missing', sitemapFile);
} else {
  const xml = readFileSync(sitemapFile, 'utf8');
  const entries = [...xml.matchAll(/<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map(
    (m) => ({ loc: m[1], lastmod: m[2] }),
  );
  if (!entries.length) fail('sitemap-empty', 'no <loc> entries');

  const today = new Date().toISOString().slice(0, 10);
  const dated = entries.filter((e) => e.lastmod);
  for (const e of entries) {
    if (!e.lastmod) fail('sitemap-no-lastmod', e.loc);
    else if (e.lastmod.slice(0, 10) > today)
      fail('sitemap-future-lastmod', `${e.loc} → ${e.lastmod}`);
  }

  // The original bug: `new Date()` on every URL, so all 230+ claimed to change
  // on every deploy and Google discounted the signal entirely.
  const sameAsToday = dated.filter((e) => e.lastmod.slice(0, 10) === today).length;
  if (dated.length > 20 && sameAsToday / dated.length > 0.95)
    fail(
      'sitemap-lastmod-all-today',
      `${sameAsToday}/${dated.length} URLs claim to have changed today — is that true?`,
    );

  // Every sitemap URL must correspond to a real built page.
  for (const e of entries) {
    const slug = e.loc.replace(`${SITE}`, '').replace(/^\//, '') || 'index';
    if (!pages.has(slug)) fail('sitemap-url-not-built', e.loc);
  }

  // A noindex page in the sitemap is a contradictory signal.
  for (const e of entries) {
    const slug = e.loc.replace(`${SITE}`, '').replace(/^\//, '') || 'index';
    const html = pages.get(slug);
    if (html && /name="robots"[^>]*content="[^"]*noindex/.test(html))
      fail('sitemap-contains-noindex', e.loc);
  }
}

// ─── 5. Internal link floors and orphans ─────────────────────────────────────

const inbound = new Map([...pages.keys()].map((s) => [s, 0]));
for (const [slug, html] of pages) {
  const linked = new Set(
    [...html.matchAll(/href="\/([a-z0-9][a-z0-9/-]*)"/g)].map((m) => m[1].replace(/\/$/, '')),
  );
  for (const target of linked) {
    if (target !== slug && inbound.has(target)) inbound.set(target, inbound.get(target) + 1);
  }
}

for (const [slug, count] of inbound) {
  if (slug === '_not-found' || slug === 'index') continue;
  // A noindex page having no inbound links is the intended state, not an orphan.
  const isNoindex = /name="robots"[^>]*content="[^"]*noindex/.test(pages.get(slug) || '');
  if (count === 0 && !isNoindex) fail('orphan-page', `${slug} has no internal inbound links`);
  else if (/^mac-repair-/.test(slug) && count < MIN_TOWN_INBOUND)
    fail('town-inbound-below-floor', `${slug} — ${count} < ${MIN_TOWN_INBOUND}`);
  else if (/^(macbook-repair|laptop-repair|console-repair|data-recovery)-/.test(slug) && count < MIN_SPOKE_INBOUND)
    fail('spoke-inbound-below-floor', `${slug} — ${count} < ${MIN_SPOKE_INBOUND}`);
}

// ─── 6. Thin pages ───────────────────────────────────────────────────────────

for (const [slug, html] of pages) {
  if (THIN_OK.has(slug) || slug.startsWith('blog/')) continue;
  const w = text(html).split(' ').length;
  if (w < MIN_CONTENT_WORDS) warn('thin-page', `${slug} — ${w} rendered words`);
}

// ─── 7. Duplicate body copy between service pages ────────────────────────────
//
// macbook-repair-london and laptop-repair-london once shared 19% of their
// eight-word sequences and two byte-identical sentences.

const DUP_FAIL = 8;
const DUP_WARN = 5;
const src = readFileSync('lib/services.ts', 'utf8');
const authored = new Map();
for (const block of src.split(/\n {2}\{\n {4}slug: '/).slice(1)) {
  const slug = block.slice(0, block.indexOf("'"));
  let region = '';
  for (const key of ['whatToExpect:', 'faqs:']) {
    const i = block.indexOf(key);
    if (i >= 0) region += block.slice(i, block.indexOf('\n    ],', i));
  }
  const strings = [...region.matchAll(/'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\'/g, "'"))
    .filter((s) => s.split(' ').length > 4);
  if (strings.length) authored.set(slug, strings.join(' '));
}

const shingles = (t, n = 8) => {
  const w = t.toLowerCase().match(/[a-z0-9£]+/g) || [];
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
};
const shingled = new Map([...authored].map(([k, v]) => [k, shingles(v)]));
const slugs = [...shingled.keys()];
for (let i = 0; i < slugs.length; i++) {
  for (let j = i + 1; j < slugs.length; j++) {
    const a = shingled.get(slugs[i]);
    const b = shingled.get(slugs[j]);
    let shared = 0;
    for (const s of a) if (b.has(s)) shared++;
    const pct = (100 * shared) / Math.min(a.size, b.size);
    const detail = `${slugs[i]} ↔ ${slugs[j]} — ${pct.toFixed(1)}% of 8-word sequences`;
    if (pct >= DUP_FAIL) fail('duplicate-body-copy', detail);
    else if (pct >= DUP_WARN) warn('similar-body-copy', detail);
  }
}

// ─── 8. next/image without sizes ─────────────────────────────────────────────
//
// A `fill` image with no `sizes` makes Next serve the largest candidate.

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next' || e.startsWith('.')) continue;
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx$/.test(e)) out.push(full);
  }
  return out;
}
for (const file of [...walk('app'), ...walk('components')]) {
  const content = readFileSync(file, 'utf8');
  for (const m of content.matchAll(/<Image\b[\s\S]*?\/>/g)) {
    if (/\bfill\b/.test(m[0]) && !/\bsizes=/.test(m[0])) {
      const line = content.slice(0, m.index).split('\n').length;
      warn('image-fill-without-sizes', `${file}:${line}`);
    }
  }
}

// ─── 8. Content uniqueness — the guardrail that stops the next combo episode ──
//
// The 116 service×location pages were not a careless mistake: each was ~1,300
// words and individually plausible. What nobody measured was how much of that
// text already existed elsewhere on the site. At 8-9% unique, Google indexed 3
// of them and 29 earned literally zero impressions in three months.
//
// Judgement applied 116 times still compounds into a problem when nothing gates
// page creation, so the rule is enforced here rather than remembered.
//
// Method: 8-word shingles, and a shingle is "distinctive" if it appears on no
// more than 2 pages. Uniqueness is the share of a page's shingles that are
// distinctive. Measured on this site: static 55%, blog 44%, service 44%,
// town hubs 30%, combos 8.6%.
//
// Existing pages are grandfathered via the baseline file, because retrofitting
// a floor onto 87 known-weak pages would just mean the audit is permanently red
// and everyone learns to ignore it. New pages must clear NEW_PAGE_FLOOR. To
// accept a new page below it, add it to the baseline deliberately — the point
// is that it takes a decision, not an accident.
const SHINGLE = 8;
const NEW_PAGE_FLOOR = 0.25;
const BASELINE_FILE = 'scripts/uniqueness-baseline.json';

const shinglesOf = (body) => {
  const w = body.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i++) set.add(w.slice(i, i + SHINGLE).join(' '));
  return set;
};

const shingleSets = new Map();
for (const [slug, html] of pages) shingleSets.set(slug, shinglesOf(text(html)));

const docFreq = new Map();
for (const set of shingleSets.values())
  for (const sh of set) docFreq.set(sh, (docFreq.get(sh) || 0) + 1);

const uniqueness = new Map();
for (const [slug, set] of shingleSets) {
  if (!set.size) continue;
  let distinctive = 0;
  for (const sh of set) if (docFreq.get(sh) <= 2) distinctive++;
  uniqueness.set(slug, distinctive / set.size);
}

const baseline = existsSync(BASELINE_FILE)
  ? new Set(JSON.parse(readFileSync(BASELINE_FILE, 'utf8')).grandfathered)
  : new Set();

for (const [slug, score] of uniqueness) {
  if (THIN_OK.has(slug)) continue;
  const pct = (score * 100).toFixed(1);
  if (!baseline.has(slug)) {
    // New page. This is the gate.
    if (score < NEW_PAGE_FLOOR)
      fail(
        'new-page-too-derivative',
        `${slug} — ${pct}% unique, floor is ${NEW_PAGE_FLOOR * 100}%. ` +
          `Most of this page already exists elsewhere on the site. Rewrite it, fold it ` +
          `into an existing page, or add it to ${BASELINE_FILE} if you have decided it earns its URL.`,
      );
  } else if (score < 0.15) {
    warn('low-uniqueness', `${slug} — ${pct}% unique (grandfathered)`);
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────

const group = (list) => {
  const by = new Map();
  for (const { check, detail } of list) {
    if (!by.has(check)) by.set(check, []);
    by.get(check).push(detail);
  }
  return by;
};

const render = (label, list) => {
  if (!list.length) return;
  console.log(`\n${label} (${list.length})`);
  for (const [check, details] of group(list)) {
    console.log(`  ${check} — ${details.length}`);
    for (const d of details.slice(0, 8)) console.log(`      ${d}`);
    if (details.length > 8) console.log(`      … and ${details.length - 8} more`);
  }
};

console.log(`SEO audit — ${pages.size} built pages`);
render('FAIL', fails);
render('WARN', warns);

if (!fails.length && !warns.length) console.log('\nAll checks passed.');
else if (!fails.length) console.log(`\nNo failures. ${warns.length} warning(s) — backlog, not blocking.`);
else console.log(`\n${fails.length} failure(s). Fix or explain before deploying.`);

process.exit(fails.length ? 1 : 0);
