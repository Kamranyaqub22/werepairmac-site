import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The publishing console. Password-gated, but there is no reason for it
      // to be crawled or to appear in a search result at all.
      disallow: ['/admin'],
    },
    sitemap: 'https://www.werepairmac.co.uk/sitemap.xml',
  };
}
