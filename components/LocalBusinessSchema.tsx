interface LocalBusinessSchemaProps {
  page?: string;
  service?: string;
  location?: string;
}

export default function LocalBusinessSchema({ service, location }: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://werepairmac.co.uk/#business',
    name: 'We Repair Mac',
    url: 'https://werepairmac.co.uk',
    telephone: '+447378349222',
    email: 'info@werepairmac.co.uk',
    description: service
      ? `Professional ${service} service across ${location || 'Greater London'}. Same-day home and office visits. No fix, no fee.`
      : 'Professional Mac, laptop and PC repair across Greater London. Same-day home and office visits. No fix, no fee guaranteed.',
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
    image: 'https://werepairmac.co.uk/logo.png',
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
