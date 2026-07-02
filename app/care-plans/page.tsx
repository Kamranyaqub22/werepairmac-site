import type { Metadata } from 'next';
import Link from 'next/link';
import CarePlans from '@/components/CarePlans';
import TrustBadges from '@/components/TrustBadges';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { ShieldCheckIcon, BoltIcon, ClockIcon, CurrencyPoundIcon, PhoneIcon, ComputerDesktopIcon, ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Mac & Computer Care Plans | Monthly Support | We Repair Mac London',
  description:
    'Affordable monthly and yearly care plans for your Mac, laptop or PC — monitoring, antivirus, backups, remote support and discounted repairs across London. From £6.99/mo.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/care-plans' },
  openGraph: {
    title: 'Mac & Computer Care Plans | We Repair Mac London',
    description: 'Monthly & yearly care plans — monitoring, antivirus, backups, remote support & discounted repairs. From £6.99/mo.',
    url: 'https://www.werepairmac.co.uk/care-plans',
  },
};

const WHY = [
  { Icon: BoltIcon, title: 'Stop problems before they start', desc: 'Monitoring and automatic updates catch issues early — often before you even notice them.' },
  { Icon: ComputerDesktopIcon, title: 'Remote support included', desc: 'Most software problems fixed live over a secure screen-share, no visit needed.' },
  { Icon: CurrencyPoundIcon, title: 'Members save on every repair', desc: 'Discounted labour, no callout minimum, and priority booking whenever you need us.' },
  { Icon: ShieldCheckIcon, title: 'Protected & backed up', desc: 'Enterprise antivirus plus backup monitoring keep your device and files safe.' },
];

const faqs = [
  { q: 'What is a care plan?', a: 'A low-cost monthly or yearly subscription that keeps your Mac, laptop or PC monitored, protected and backed up — plus remote support and discounts on any repairs you do need. Think of it as an ongoing service plan for your computer.' },
  { q: 'Which devices can I add?', a: 'Each plan covers one device (Mac, laptop or PC). Got several? Just add a plan per device — get in touch and we can bundle them for households or home offices.' },
  { q: 'Do I have to sign a long contract?', a: 'No. Monthly plans are rolling and you can cancel anytime. Annual plans give you two months free and can be paid in one go.' },
  { q: 'How do payments work?', a: 'We set plans up by Direct Debit or bank transfer — no card needed. You’ll always know exactly what you pay and when.' },
  { q: 'What does “free labour on out-of-warranty repairs” mean?', a: 'On the Complete plan, if your device develops a fault after the manufacturer warranty has ended, you pay only for parts — our labour is included. A fair-use policy applies to prevent abuse.' },
  { q: 'What if I just need a one-off fix?', a: 'No problem — you don’t need a plan. Book a same-day home visit, or get many software issues fixed remotely from £49. Care plans simply save regular users money over time.' },
];

export default function CarePlansPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Care Plans', url: 'https://www.werepairmac.co.uk/care-plans' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Care Plans · London
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Look after your tech — for the price of a coffee a month
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Monitoring, antivirus, backups, remote support and discounted repairs — all in one simple plan for your Mac, laptop or PC. Cancel anytime.
          </p>
          <a href="tel:07378349222" className="btn-accent py-3.5 px-8 text-base inline-flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" /> Questions? Call 0737 834 9222
          </a>
        </div>
      </section>

      <TrustBadges />

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="section-heading">Choose your plan</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Switch between monthly and annual — annual gives you two months free.</p>
          </div>
          <CarePlans />
        </div>
      </section>

      {/* Why */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-heading text-center">Why join a care plan?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {WHY.map(({ Icon, title, desc }) => (
              <div key={title} className="card">
                <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell remote support */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-brand/5 border border-brand/15 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <ComputerDesktopIcon className="w-12 h-12 text-brand flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Just need a one-off fix?</h3>
              <p className="text-sm text-gray-600 mt-1">Many software problems can be fixed remotely today from £49 — no plan, no visit needed.</p>
            </div>
            <Link href="/remote-support" className="btn-primary py-3 px-6 whitespace-nowrap">
              Remote support <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Care plan FAQs</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />
    </>
  );
}
