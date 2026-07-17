import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocationsGroupedByBorough } from '@/lib/locations';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrustBadges from '@/components/TrustBadges';
import { MapPinIcon, PhoneIcon, ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Areas We Cover | London & Surrey',
  description: 'We Repair Mac provides same-day home and office Mac, laptop and PC repair across every London borough plus the Surrey and M25 border. Find your area.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/areas-we-cover' },
};

export default function AreasWeCoverPage() {
  const groups = getLocationsGroupedByBorough();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Areas We Cover', url: 'https://www.werepairmac.co.uk/areas-we-cover' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Areas We Cover
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Mac &amp; laptop repair across every corner of London
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Same-day home and office visits across every London borough, plus the Surrey and M25 border. Find your area below.
          </p>
          <a href="tel:07378349222" className="btn-accent py-3.5 px-8 text-base inline-flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" /> Call 0737 834 9222
          </a>
        </div>
      </section>

      <TrustBadges />

      {/* Area groups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div key={group.borough}>
                <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  {group.borough}
                </h2>
                <ul className="space-y-2">
                  {group.locations.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/mac-repair-${l.slug}`}
                        className="text-sm text-gray-600 hover:text-brand transition-colors"
                      >
                        {l.name} <span className="text-gray-400">({l.postcode})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Don&apos;t see your area listed?</h2>
          <p className="text-blue-100 mb-6">
            We travel across all of Greater London and the surrounding Surrey and M25 border areas — if you&apos;re nearby, we can almost certainly come to you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:07378349222" className="btn-accent text-base px-10 py-4 inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call 0737 834 9222
            </a>
            <Link href="/quote" className="btn-ghost-white py-4 px-6 inline-flex items-center gap-2">
              Get a Quote &amp; Book <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
