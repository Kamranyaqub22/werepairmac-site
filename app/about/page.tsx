import type { Metadata } from 'next';
import Image from 'next/image';
import TrustBadges from '@/components/TrustBadges';
import {
  PhoneIcon, MailIcon, CurrencyPoundIcon, ClockIcon,
  WrenchIcon, ShieldCheckIcon, CheckIcon,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'About We Repair Mac | London Mac & Laptop Repair Specialists',
  description:
    'Learn about We Repair Mac - London\'s mobile Mac and laptop repair specialists. Apple-experienced engineers, serving Greater London from New Malden since 2015.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/about' },
};

export default function AboutPage() {
  const VALUES = [
    { Icon: CurrencyPoundIcon, title: 'Honest Pricing', desc: 'We quote before we start. The price we give you is the price you pay - never any hidden extras.' },
    { Icon: ClockIcon, title: 'Respect for Your Time', desc: 'We arrive on time, work efficiently, and aim to complete most repairs on-site within an hour.' },
    { Icon: WrenchIcon, title: 'Quality of Work', desc: 'We use quality parts and take pride in doing the job right first time - which is why we offer a 90-day warranty.' },
    { Icon: CheckIcon, title: 'Clear Communication', desc: 'We explain what is wrong, what we will do, and why - in plain English, not technical jargon.' },
    { Icon: ShieldCheckIcon, title: 'No Fix, No Fee', desc: 'If we cannot fix your device, you pay absolutely nothing. No diagnostic fee, no callout charge.' },
    { Icon: PhoneIcon, title: 'After-Care Support', desc: 'We are available to answer any question after your repair. Our job is not done until you are fully satisfied.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1400&auto=format&fit=crop&q=60"
            alt="Technician repairing MacBook"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent/80 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Based in New Malden · Serving Greater London
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About We Repair Mac</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            London&apos;s mobile Mac and laptop repair specialists. We come to you - no shop visits, no waiting weeks.
          </p>
        </div>
      </section>

      <TrustBadges />

      {/* Meet Your Engineer */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Engineer photo */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-brand/20">
                <Image
                  src="/profile.jpg"
                  alt="Muhammed - We Repair Mac engineer"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            {/* Bio */}
            <div>
              <span className="inline-block bg-brand/10 text-brand text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                Your Engineer
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hi, I&apos;m Muhammed</h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-[15px]">
                I&apos;ve been repairing Macs, laptops and PCs across London for years. I started We Repair Mac because I was tired of seeing customers wait weeks and pay Apple Store prices for repairs that take an hour on the bench.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6 text-[15px]">
                When you book with me, I come to your door, explain exactly what&apos;s wrong, and get it fixed in front of you. You&apos;re handing over a £1,000+ device to a stranger — I take that seriously, and I won&apos;t leave until you&apos;re happy.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Apple-experienced technician', '90-day warranty on every repair', 'No Fix, No Fee'].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <CheckIcon className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=70"
              alt="Engineer working on MacBook"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="text-gray-600 leading-relaxed space-y-4 text-[15px]">
              <p>
                We Repair Mac was founded with a simple idea: people in London should not need to carry their broken MacBook or laptop to a shop, wait days or weeks, and pay Apple Store prices. They deserved a professional, reliable repair service that comes to them.
              </p>
              <p>
                Based in <strong className="text-gray-800">New Malden, KT3</strong>, we have been carrying out Mac, laptop and PC repairs across Greater London for years. Our engineers are Apple-experienced technicians who have seen and fixed every conceivable fault - from liquid-damaged logic boards to corrupted SSDs, broken screens to ransomware infections.
              </p>
              <p>
                Most repairs are completed on-site in front of you within an hour. You only pay once you are happy with the result. If we cannot fix it, you pay nothing at all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center">Our Core Commitments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {VALUES.map(({ Icon, title, desc }) => (
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

      {/* Contact CTA */}
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1400&auto=format&fit=crop&q=60"
            alt="MacBook"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Get in Touch</h2>
          <p className="text-blue-100 mb-6">Same-day repairs across Greater London. No fix, no fee.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:07378349222" className="btn-accent py-4 px-8 inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 0737 834 9222
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
