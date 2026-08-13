import { readFileSync } from 'node:fs';

// Same JSON that lib/serviceLocations.ts reads to stop generating these pages.
// One source of truth, so a retired combo can never be un-generated but
// un-redirected (a 404) or redirected but still built (a redirect loop).
const { retired } = JSON.parse(readFileSync(new URL('./lib/retired-combos.json', import.meta.url), 'utf8'));

const FAMILY_BASES = ['macbook-repair', 'laptop-repair', 'console-repair', 'data-recovery'];

/** Each retired combo 301s to its own town hub, which still covers the service. */
const retiredComboRedirects = retired.map((slug) => {
  const base = FAMILY_BASES.find((b) => slug.startsWith(`${b}-`));
  if (!base) throw new Error(`retired-combos.json: "${slug}" matches no service family`);
  return {
    source: `/${slug}`,
    destination: `/mac-repair-${slug.slice(base.length + 1)}`,
    permanent: true,
  };
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Response headers were absent on 99.7% of URLs in the site crawl. None of
  // these affect ranking, but they are cheap and clear three standing warnings.
  //
  // Deliberately no Content-Security-Policy here: the site loads Google Maps
  // embeds, GA4, Clarity and Google review avatars, so a policy strict enough to
  // be worth having needs to be worked out against those origins and tested,
  // rather than guessed at in a header block.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Keeps the full URL off cross-origin requests without losing the
          // same-origin referrer that analytics relies on.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Stop browsers guessing content types from response bodies.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Framing is only ever same-origin here, so deny the rest (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      ...retiredComboRedirects,
      // www canonical redirect — non-www → www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'werepairmac.co.uk' }],
        destination: 'https://www.werepairmac.co.uk/:path*',
        permanent: true,
      },
      // Typo fix: the slug read "ukb-c" where it meant "usb-c". The old URL was
      // already indexed, so it redirects rather than 404s.
      {
        source: '/blog/nintendo-switch-not-charging-ukb-c-port-signs',
        destination: '/blog/nintendo-switch-not-charging-usb-c-port-signs',
        permanent: true,
      },
      // Retired blog slugs that Search Console still reports Google crawling.
      // The first was serving a live 404; the other two were dead ends burning
      // crawl budget on a site where the flagship service pages are already
      // going uncrawled. Each points at the closest surviving match on intent,
      // not at the homepage — a redirect to something unrelated is treated as a
      // soft 404 and helps nobody who lands on it.
      {
        // Renamed, same article.
        source: '/blog/macbook-pro-making-a-loud-grinding-sound-advice-from-experts',
        destination: '/blog/pc-making-loud-grinding-noise',
        permanent: true,
      },
      {
        // Windows laptop, sticking keys. The surviving keys-sticking guide is
        // MacBook-specific, so the Windows repair page is the honest match.
        source: '/blog/dell-xps-keys-heavily-sticking-for-home-workers',
        destination: '/laptop-repair-london',
        permanent: true,
      },
      {
        source: '/blog/macbook-air-running-extremely-slow-advice-from-experts',
        destination: '/blog/slow-laptop-home-office-checklist',
        permanent: true,
      },
      // Second batch of the same retired family, reported as live 404s in
      // Search Console on 2026-08-13. Same rule as above: closest surviving
      // match on intent, never the homepage.
      {
        // Dell, so the PC-oriented grinding guide — exactly as the MacBook Pro
        // grinding slug above points at the same article.
        source: '/blog/dell-xps-making-a-loud-grinding-sound-quick-fixes',
        destination: '/blog/pc-making-loud-grinding-noise',
        permanent: true,
      },
      {
        // Spill over the whole machine, so the broad "first 30 minutes"
        // article. Both surviving liquid guides are laptop-generic rather than
        // Mac-specific, so either fits a Dell; this is the closer one on intent.
        source: '/blog/dell-xps-spilled-coffee-over-it-for-students',
        destination: '/blog/water-damaged-laptop-first-steps',
        permanent: true,
      },
      {
        // Coffee over the keyboard, so the keyboard-spill article.
        source: '/blog/macbook-air-spilled-coffee-over-it-before-you-panic',
        destination: '/blog/spilled-water-on-keyboard-what-not-to-do',
        permanent: true,
      },
      // The retired auto-generated family was exactly 90 slugs (10 devices ×
      // 9 faults; see lib/generated_blogs.json before commit 6808448). Six are
      // redirected above because Search Console showed Google crawling them.
      // THE REMAINING 84 ARE MEANT TO 404. They are in no sitemap, have no
      // internal links, and no honest destination exists for most of them —
      // 10 are combos that never made sense (console "keys sticking"), the
      // whole usb-ports-not-responding fault has no surviving article, and the
      // flickering/sticking guides that did survive are Mac-only. A "Not found"
      // row in Search Console for one of these is Google confirming the intent,
      // not a defect to clear. Only add a redirect here if GSC shows a real
      // referring page or non-zero impressions for that specific slug.
      { source: '/blank-5', destination: '/contact', permanent: true },
      { source: '/blank', destination: '/', permanent: true },
      { source: '/hardware-repair', destination: '/macbook-repair-london', permanent: true },
      { source: '/laptop-repair', destination: '/laptop-repair-london', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/about-1', destination: '/about', permanent: true },
      { source: '/about-2', destination: '/about', permanent: true },
      { source: '/contact-1', destination: '/contact', permanent: true },
      { source: '/contact-2', destination: '/contact', permanent: true },
      { source: '/faq', destination: '/faqs', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/general-:slug', destination: '/', permanent: true },
      { source: '/blank-:slug', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
