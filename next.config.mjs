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
