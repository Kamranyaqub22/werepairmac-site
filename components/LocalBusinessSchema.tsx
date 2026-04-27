interface LocalBusinessSchemaProps {
  page?: string;
  service?: string;
  location?: string;
}

import { FALLBACK_RATING, FALLBACK_TOTAL, fetchGoogleReviews } from '@/lib/googleReviews';

export default async function LocalBusinessSchema({ service, location }: LocalBusinessSchemaProps) {
  const reviews = await fetchGoogleReviews();
  const ratingValue = reviews?.rating ?? FALLBACK_RATING;
  const reviewCount = reviews?.total ?? FALLBACK_TOTAL;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ComputerRepairService'],
    '@id': 'https://www.werepairmac.co.uk/#business',
    name: 'We Repair Mac',
    url: 'https://www.werepairmac.co.uk',
    telephone: '+447378349222',
    email: 'info@werepairmac.co.uk',
    description: service
      ? `Professional ${service} service across ${location || 'Greater London'}. Same-day home and office visits. No fix, no fee.`
      : 'Professional Mac, laptop, PC and PlayStation repair across Greater London. Same-day home and office visits. No fix, no fee guaranteed.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount: String(reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Repair Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'MacBook Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laptop Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Recovery' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PlayStation Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Virus Removal' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water Damage Repair' } },
      ],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '18, Vincent House, Burlington Road',
      addressLocality: location || 'New Malden',
      addressRegion: 'London',
      postalCode: 'KT3 4NX',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.404,
      longitude: -0.257,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 51.5074,
        longitude: -0.1278,
      },
      geoRadius: '40000',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '££',
    image: 'https://www.werepairmac.co.uk/logo.png',
    sameAs: [
      'https://www.facebook.com/werepairmac',
      'https://www.instagram.com/werepairmac',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
