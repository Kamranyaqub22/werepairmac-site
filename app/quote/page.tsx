import type { Metadata } from 'next';
import QuoteBooking from '@/components/QuoteBooking';
import TrustBadges from '@/components/TrustBadges';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { PhoneIcon, ShieldCheckIcon, CurrencyPoundIcon, TruckIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Get a Quote & Book a Repair | We Repair Mac London',
  description:
    'Get an instant price estimate for your Mac, laptop, PC or console repair, then request a home visit across Greater London. No fix, no fee. Call 0737 834 9222.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/quote' },
  openGraph: {
    title: 'Get a Quote & Book a Repair | We Repair Mac London',
    description: 'Instant repair estimate + request a home visit anywhere in Greater London. No fix, no fee.',
    url: 'https://www.werepairmac.co.uk/quote',
  },
};

const POINTS = [
  { Icon: CurrencyPoundIcon, text: 'Honest price ranges upfront' },
  { Icon: TruckIcon, text: 'We come to you — no shop visit' },
  { Icon: ShieldCheckIcon, text: 'No fix, no fee · 90-day warranty' },
];

export default function QuotePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Get a Quote', url: 'https://www.werepairmac.co.uk/quote' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Instant Estimate · London
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Get a price, then book your repair
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Choose your device and fault for a realistic price range, then request a home visit at a time that suits you. We&apos;ll confirm by phone or WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {POINTS.map(({ Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 text-sm text-blue-100">
                <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" /> {text}
              </span>
            ))}
          </div>
          <a href="tel:07378349222" className="btn-accent py-3.5 px-8 text-base inline-flex items-center gap-2 mt-8">
            <PhoneIcon className="w-4 h-4" /> Or call 0737 834 9222
          </a>
        </div>
      </section>

      <TrustBadges />

      {/* Estimator + booking */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <QuoteBooking />
        </div>
      </section>
    </>
  );
}
