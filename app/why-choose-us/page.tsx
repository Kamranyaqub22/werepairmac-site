import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import GoogleReviews from '@/components/GoogleReviews';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import {
  PhoneIcon, MailIcon, CheckIcon, XIcon, TruckIcon, ClockIcon,
  ShieldCheckIcon, CurrencyPoundIcon, WrenchIcon, StarIcon, MapPinIcon,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Why Choose Us | London Mac & Laptop Repair You Can Trust',
  description:
    'Why London chooses We Repair Mac: we come to you, fix most devices on-site within the hour, No Fix No Fee, a 90-day warranty and a real Apple-experienced engineer at your door. Serving Greater London since 2015.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/why-choose-us' },
};

const REASONS = [
  {
    Icon: TruckIcon,
    title: 'We come to you',
    desc: 'No dropping your device at a shop and waiting days. Our engineer travels to your home or office anywhere in Greater London, 7 days a week, with no callout charge.',
  },
  {
    Icon: ClockIcon,
    title: 'Fixed on the spot, usually within the hour',
    desc: 'Most repairs are completed on-site while you watch. Book before 2pm and we aim to be with you the same day. No week-long waits for a bench slot.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'No Fix, No Fee',
    desc: 'If we cannot repair your device, you pay absolutely nothing — no diagnostic fee, no callout charge. You only pay once the repair is done and you are happy.',
  },
  {
    Icon: WrenchIcon,
    title: '90-day warranty on every repair',
    desc: 'Every repair is backed by a 90-day parts and labour warranty. If the same fault returns within 90 days, we come back and fix it free.',
  },
  {
    Icon: CurrencyPoundIcon,
    title: 'Honest, upfront pricing',
    desc: 'We quote for labour and parts before we start, in plain English. The price we give you is the price you pay — no hidden extras and no surprises.',
  },
  {
    Icon: StarIcon,
    title: 'A real, experienced engineer',
    desc: 'You deal with an Apple-experienced technician, not a faceless drop-off counter. Our founder alone has over 14 years fixing Macs, laptops, PCs and consoles.',
  },
];

const COMPARISON = [
  { point: 'Comes to your home or office', us: true, shop: false },
  { point: 'Most repairs done same day, on-site', us: true, shop: false },
  { point: 'You watch the repair happen', us: true, shop: false },
  { point: 'No callout or diagnostic charge', us: true, shop: false },
  { point: 'No Fix, No Fee guarantee', us: true, shop: false },
  { point: '90-day parts & labour warranty', us: true, shop: false },
  { point: 'Available 7 days a week, evenings included', us: true, shop: false },
];

export default function WhyChooseUsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Why Choose Us', url: 'https://www.werepairmac.co.uk/why-choose-us' },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/technician-macbook-hero-unsplash.jpg"
            alt="Engineer repairing a MacBook at a customer's home"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent/80 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Trusted across Greater London since 2015
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Why Choose We Repair Mac</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            London&apos;s mobile Mac, laptop, PC and console repair service. A real engineer comes to your door, fixes it in front of you, and you only pay when it&apos;s done.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a href="tel:07378349222" className="btn-accent py-4 px-8 inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 07378 349222
            </a>
            <Link href="/quote" className="btn-ghost-white py-4 px-6">Get a Free Quote</Link>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Reasons grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="section-heading">Six reasons London calls us first</h2>
            <p className="text-gray-500 mt-3 text-[15px] leading-relaxed">
              We built We Repair Mac to be the faster, more transparent alternative to carrying your device to a shop and paying Apple Store prices for a repair that takes an hour on the bench.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map(({ Icon, title, desc }) => (
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

      {/* Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center mb-10">We Repair Mac vs the high-street repair shop</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <span className="text-sm font-semibold text-gray-500">What matters</span>
              <span className="text-xs font-bold text-brand text-center w-20">We Repair Mac</span>
              <span className="text-xs font-semibold text-gray-400 text-center w-20">Typical shop</span>
            </div>
            {COMPARISON.map((row) => (
              <div key={row.point} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{row.point}</span>
                <span className="w-20 flex justify-center">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                </span>
                <span className="w-20 flex justify-center">
                  {row.shop
                    ? <CheckIcon className="w-5 h-5 text-green-600" />
                    : <XIcon className="w-5 h-5 text-gray-300" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / who you're dealing with */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <Image
              src="/images/engineer-working-macbook-unsplash.jpg"
              alt="We Repair Mac engineer working on a laptop"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">A repair service you can actually trust</h2>
            <div className="text-gray-600 leading-relaxed space-y-4 text-[15px]">
              <p>
                We know handing over a £1,000+ device to someone in your own home is a big deal. That is exactly why we do the repair in front of you, explain what is wrong in plain English, and never ask for payment until you are satisfied.
              </p>
              <p>
                We Repair Mac has operated across Greater London since 2015, based in <strong className="text-gray-800">New Malden, KT3</strong>. Our engineers are Apple-experienced technicians who have fixed every conceivable fault — from liquid-damaged logic boards to failed SSDs, cracked screens to ransomware infections.
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <MapPinIcon className="w-4 h-4 text-brand flex-shrink-0" />
                Serving every London borough, 7 days a week.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Apple-experienced technicians', '90-day warranty', 'No Fix, No Fee', 'No callout charge'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <CheckIcon className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Google reviews — social proof */}
      <GoogleReviews />

      {/* CTA */}
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/macbook-pro-unsplash.jpg"
            alt="MacBook"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready when you are</h2>
          <p className="text-blue-100 mb-6">Same-day repairs across Greater London. No fix, no fee.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:07378349222" className="btn-accent py-4 px-8 inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 07378 349222
            </a>
            <a href="mailto:info@werepairmac.co.uk" className="btn-ghost-white py-4 px-6 inline-flex items-center gap-2">
              <MailIcon className="w-4 h-4" /> info@werepairmac.co.uk
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
