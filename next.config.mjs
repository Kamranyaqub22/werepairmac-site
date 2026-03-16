/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/blank-5', destination: '/contact', permanent: true },
      { source: '/blank', destination: '/', permanent: true },
      { source: '/hardware-repair', destination: '/macbook-repair-london', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/about-1', destination: '/about', permanent: true },
      { source: '/about-2', destination: '/about', permanent: true },
      { source: '/contact-1', destination: '/contact', permanent: true },
      { source: '/contact-2', destination: '/contact', permanent: true },
      { source: '/faq', destination: '/faqs', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/blank-:slug', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
