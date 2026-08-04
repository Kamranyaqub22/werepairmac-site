import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';
import { serviceLocationSlugs, getServiceLocation } from '@/lib/serviceLocations';
import { contentDate } from '@/lib/contentDates';

// `changeFrequency` is deliberately omitted throughout: Google has confirmed it
// does not use the field, and stating a frequency we do not honour is the same
// class of noise as a lastmod that always says "today".

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.werepairmac.co.uk';

  // Static pages carry their own dates because their copy is edited directly
  // rather than generated from a data file.
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: contentDate('2026-07-22'), priority: 1.0 },
    { url: `${base}/about`, lastModified: contentDate(), priority: 0.7 },
    { url: `${base}/why-choose-us`, lastModified: contentDate(), priority: 0.8 },
    { url: `${base}/blog`, lastModified: contentDate(), priority: 0.8 },
    { url: `${base}/faqs`, lastModified: contentDate(), priority: 0.7 },
    { url: `${base}/contact`, lastModified: contentDate('2026-07-19'), priority: 0.8 },
    { url: `${base}/areas-we-cover`, lastModified: contentDate('2026-07-19'), priority: 0.8 },
    { url: `${base}/quote`, lastModified: contentDate(), priority: 0.8 },
    // The callout/home-visit landing page. High priority: it targets the one
    // term class where the service is genuinely differentiated.
    { url: `${base}/mac-repair-home-visit-london`, lastModified: contentDate('2026-08-04'), priority: 0.9 },
    { url: `${base}/remote-support`, lastModified: contentDate(), priority: 0.8 },
    { url: `${base}/care-plans`, lastModified: contentDate(), priority: 0.7 },
    { url: `${base}/privacy`, lastModified: contentDate('2026-07-19'), priority: 0.3 },
    { url: `${base}/cookies`, lastModified: contentDate('2026-07-19'), priority: 0.3 },
    // NOTE: /review is intentionally excluded — it is noindex (see app/review/page.tsx),
    // so listing it in the sitemap would send Google a conflicting signal.
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/${s.slug}`,
    lastModified: contentDate(s.updatedAt),
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${base}/mac-repair-${l.slug}`,
    lastModified: contentDate(l.updatedAt),
    priority: 0.8,
  }));

  // A combo page is composed from a town and a service, so it is only as fresh
  // as the more recently edited of the two.
  const serviceLocationPages: MetadataRoute.Sitemap = serviceLocationSlugs().map((slug) => {
    const sl = getServiceLocation(slug);
    const dates = [
      contentDate(sl?.location.updatedAt),
      contentDate(sl?.service.updatedAt),
    ];
    return {
      url: `${base}/${slug}`,
      lastModified: new Date(Math.max(...dates.map((d) => d.getTime()))),
      priority: 0.75,
    };
  });

  const blogPosts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...locationPages, ...serviceLocationPages, ...blogPosts];
}
