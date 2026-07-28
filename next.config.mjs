/** @type {import('next').NextConfig} */
const nextConfig = {
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
