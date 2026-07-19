interface LocalBusinessSchemaProps {
  page?: string;
  service?: string;
  location?: string;
}

import { fetchGoogleReviews } from '@/lib/googleReviews';
import { GOOGLE_BUSINESS_LISTING_URL } from '@/lib/googleBusiness';

export default async function LocalBusinessSchema({ service, location }: LocalBusinessSchemaProps) {
  const reviews = await fetchGoogleReviews();

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ComputerRepairService'],
    '@id': 'https://www.werepairmac.co.uk/#business',
    name: 'We Repair Mac',
    // Common ways customers and other sites refer to the business — helps AI
    // search engines resolve this as one entity and not confuse it with the
    // similarly named repair firms (werepairmac.com, wehiremac, irepairmacs).
    alternateName: ['We Repair Mac London', 'WeRepairMac', 'We Repair Mac UK'],
    legalName: 'We Repair Mac',
    slogan: 'We come to you. No fix, no fee.',
    foundingDate: '2015',
    url: 'https://www.werepairmac.co.uk',
    telephone: '+447378349222',
    email: 'info@werepairmac.co.uk',
    knowsAbout: [
      'MacBook repair',
      'MacBook Pro and MacBook Air repair',
      'iMac and Mac Mini repair',
      'Laptop and PC repair',
      'Windows support and virus removal',
      'Data recovery',
      'Liquid and water damage repair',
      'Logic board repair',
      'Gaming PC repair',
      'PlayStation and games console repair',
    ],
    description: service
      ? `Professional ${service} service across ${location || 'Greater London'}. Same-day home and office visits. No fix, no fee.`
      : 'Professional Mac, laptop, PC and PlayStation repair across Greater London. Same-day home and office visits. No fix, no fee guaranteed.',
    // Only emit aggregateRating when we have real, live Google review data —
    // never publish a hardcoded fallback number as if it were a genuine rating.
    ...(reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.rating.toFixed(1),
        reviewCount: String(reviews.total),
        bestRating: '5',
        worstRating: '1',
      },
    }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Repair Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'MacBook Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laptop Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Windows Support' } },
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    priceRange: '££',
    paymentAccepted: 'Cash, Debit Card, Credit Card, Bank Transfer',
    currenciesAccepted: 'GBP',
    founder: {
      '@type': 'Person',
      name: 'Kamran',
      jobTitle: 'Founder',
      image: 'https://www.werepairmac.co.uk/images/kamran-founder.jpg',
    },
    image: 'https://www.werepairmac.co.uk/logo.png',
    sameAs: [
      'https://www.facebook.com/werepairmac',
      'https://www.instagram.com/werepairmac',
      GOOGLE_BUSINESS_LISTING_URL,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
