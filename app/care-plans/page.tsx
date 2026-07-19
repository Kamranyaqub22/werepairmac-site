import type { Metadata } from 'next';
import Link from 'next/link';
import CarePlans from '@/components/CarePlans';
import TrustBadges from '@/components/TrustBadges';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { ShieldCheckIcon, BoltIcon, ClockIcon, CurrencyPoundIcon, PhoneIcon, ComputerDesktopIcon, ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Mac & Computer Care Plans | Annual Support | We Repair Mac London',
  description:
    'Affordable annual care plans for your Mac, laptop or PC — monitoring, antivirus, backups, remote support and discounted repairs across London. From £99/year.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/care-plans' },
  openGraph: {
    title: 'Mac & Computer Care Plans | We Repair Mac London',
    description: 'Annual care plans — monitoring, antivirus, backups, remote support & discounted repairs. From £99/year.',
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
  { q: 'What is a care plan?', a: 'A low-cost annual subscription that keeps your Mac, laptop or PC monitored, protected and backed up — plus remote support and discounts on any repairs you do need. Think of it as an ongoing service plan for your computer.' },
  { q: 'Which devices can I add?', a: 'Each plan covers one device (Mac, laptop or PC). Got several? Just add a plan per device — get in touch and we can bundle them for households or home offices.' },
  { q: 'Do I have to sign a long contract?', a: 'Plans are billed as a single annual payment, not a rolling contract. You are free to simply not renew when the year is up — no notice period required.' },
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
            Look after your tech — for less than a coffee a week
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Monitoring, antivirus, backups, remote support and discounted repairs — all in one simple annual plan for your Mac, laptop or PC.
          </p>
          <a href="tel:07378349222" className="btn-accent py-3.5 px-8 text-base inline-flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" /> Questions? Call 07378 349222
          </a>
        </div>
      </section>

      <TrustBadges />

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="section-heading">Choose your plan</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">One simple annual payment — no rolling monthly billing.</p>
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

      {/* Explainer prose */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What a computer care plan actually does for you</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              Most serious computer disasters — a failed hard drive that takes your photos with it, ransomware that locks your files, a security update left unapplied for two years — are entirely preventable. A care plan shifts you from reacting to problems after they happen to quietly preventing them in the background. Rather than paying only when something breaks, you get ongoing maintenance for your Mac, laptop or PC as a single, predictable annual payment.
            </p>
            <h3 className="text-lg font-bold text-gray-900 !mb-2">Prevention, protection and peace of mind</h3>
            <p>
              Depending on the plan you choose, we monitor your device&apos;s disk health and free space, keep security patches and antivirus up to date, and check that your backups are actually running — because a backup you assume is working is the one that lets you down. When something does need a human, members get priority booking, discounted labour with no callout minimum, and remote support included. It is the difference between owning a computer and having someone quietly looking after it.
            </p>
            <h3 className="text-lg font-bold text-gray-900 !mb-2">Who care plans suit best</h3>
            <p>
              Care plans make the most sense for people who rely on their computer and would rather not think about it: freelancers and home-office workers who cannot afford downtime, families who want an older relative&apos;s Mac kept safe from scams, and small businesses that need their handful of machines maintained without a full IT department. Plans are billed once a year with no rolling contract and no notice period — if it stops being useful, you simply do not renew. And if you only need a single fix rather than ongoing cover, remote support is always there as a one-off.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
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
