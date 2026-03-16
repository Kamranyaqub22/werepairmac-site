import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustBadges from '@/components/TrustBadges';
import ServiceGrid from '@/components/ServiceGrid';
import FAQAccordion from '@/components/FAQAccordion';
import GoogleReviews from '@/components/GoogleReviews';
import { locations } from '@/lib/locations';
import { PhoneIcon, CheckIcon, ArrowRightIcon, ShieldCheckIcon, ClockIcon, TruckIcon, WrenchIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Mobile Mac & Laptop Repair London | We Come To You | No Fix No Fee',
  description:
    'London\'s mobile Mac and laptop repair service. We come to your home or office — no shop visit needed. Same-day callout across Greater London. No fix, no fee. Call 0737 834 9222.',
  alternates: { canonical: 'https://werepairmac.co.uk' },
};

const homeFaqs = [
  {
    q: 'How quickly can you come to me?',
    a: 'We offer same-day callouts across Greater London. Book before 2pm and we can typically visit the same day. Evening and weekend appointments are also available at no extra charge.',
  },
  {
    q: 'What does "No Fix, No Fee" mean?',
    a: 'If we cannot repair your device, you pay nothing at all — no diagnostic fee, no callout charge, nothing. You only pay when your repair is complete and you are satisfied.',
  },
  {
    q: 'Do you repair all MacBook models?',
    a: 'Yes. We repair all MacBook Pro and MacBook Air models including M1, M2, M3 chips, as well as older Intel models. We also repair iMac, Mac Mini and Mac Pro.',
  },
  {
    q: 'Do I need to bring my device to a shop?',
    a: 'No — we come to you. Our engineers visit your home or office anywhere in Greater London. Most repairs are completed on-site in front of you within the hour.',
  },
  {
    q: 'How much does a MacBook repair cost?',
    a: 'Cost depends on the fault and model. We always quote before starting any work — no surprises. Typical jobs such as screen replacement, battery change or virus removal start from £60.',
  },
  {
    q: 'Do you offer a warranty on repairs?',
    a: 'Yes. All repairs come with a 90-day parts and labour warranty. If the same fault reoccurs, we fix it at no extra charge.',
  },
];

export default function HomePage() {
  const featuredLocations = locations.slice(0, 24);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-brand overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1800&auto=format&fit=crop&q=60"
            alt=""
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <p className="text-accent-light font-semibold text-sm uppercase tracking-wider mb-3">
                Mobile Repair Service &mdash; All of Greater London
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Mac repair that comes<br className="hidden sm:block" /> to <span className="text-accent-light">your door.</span>
              </h1>
              <p className="text-white/75 text-lg mb-3 leading-relaxed max-w-md">
                Skip the shop. Our engineer travels to your home or office, diagnoses and fixes your Mac or laptop <strong className="text-white">on-site in front of you</strong> &mdash; usually in under an hour.
              </p>
              <p className="text-white/55 text-sm mb-8 max-w-md">
                Unlike repair shops that ask you to drop off and wait days, we come to you &mdash; same day, 7 days a week, no callout charge.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <a href="tel:07378349222" className="btn-accent px-7 py-3.5 text-base">
                  <PhoneIcon className="w-4 h-4" />
                  Call 0737 834 9222
                </a>
                <a
                  href="https://wa.me/447378349222?text=Hi%2C%20I%20need%20help%20with%20a%20Mac%20or%20laptop%20repair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold rounded-lg px-6 py-3.5 text-base transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <Link href="/contact" className="btn-ghost-white py-3.5 px-6 text-base">
                  Request a Callback
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-w-sm">
                {['No shop visit needed', 'Fixed at your home', 'Same-day available', 'No Fix, No Fee'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckIcon className="w-4 h-4 text-accent-light flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: photo */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&auto=format&fit=crop&q=80"
                  alt="Modern MacBook Pro repair — We Repair Mac London"
                  width={600}
                  height={480}
                  className="object-cover w-full h-[420px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <TrustBadges />

      {/* ── SERVICES ── */}
      <ServiceGrid />

      {/* ── WHY CHOOSE US ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Photo */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=900&auto=format&fit=crop&q=80"
                alt="Professional laptop repair engineer at work"
                width={640}
                height={500}
                className="object-cover w-full h-[420px]"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">No Fix, No Fee</div>
                    <div className="text-xs text-gray-500">You only pay when the repair is done and you are happy.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <h2 className="section-heading mb-5">
                We come to you &mdash; no shop visit, ever.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Most Mac repair services require you to drop your device at a shop, wait days, and pay for courier collection. We do things differently.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our engineer comes directly to your home or office anywhere in Greater London, diagnoses the problem on-site, and fixes most devices within the hour &mdash; while you watch.
              </p>

              <div className="space-y-5">
                {[
                  { Icon: TruckIcon, title: 'No shop visit — ever', desc: 'Other repair services make you drop off your device. We come to your home or office. No courier, no waiting, no risk of damage in transit.' },
                  { Icon: ClockIcon, title: 'Same-day callout available', desc: 'Book before 2pm and we can usually visit the same day. Evenings and weekend slots also available at no extra charge.' },
                  { Icon: WrenchIcon, title: 'Fixed in front of you', desc: 'We diagnose and repair on-site while you watch. You can see exactly what we are doing and ask questions throughout.' },
                  { Icon: ShieldCheckIcon, title: '90-day warranty included', desc: 'Every repair is backed by a 90-day parts and labour warranty. If the same fault returns, we fix it free.' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{title}</div>
                      <div className="text-sm text-gray-500 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a href="tel:07378349222" className="btn-primary py-3 px-7">
                  <PhoneIcon className="w-4 h-4" />
                  Call 0737 834 9222
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="section-heading">How it works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0" />
            {[
              { num: '01', title: 'Call or email us', desc: 'Tell us your device, fault and postcode. We give you a fixed quote on the spot — no hidden fees.' },
              { num: '02', title: 'Choose your time', desc: 'Pick same day, next day, evening or weekend. We fit around your schedule, not the other way round.' },
              { num: '03', title: 'We come to you', desc: 'An engineer arrives at your door — home, office or anywhere convenient. No need to go anywhere.' },
              { num: '04', title: 'Fixed while you watch', desc: 'Most repairs completed on-site in under an hour. 90-day warranty on every job.' },
            ].map((step) => (
              <div key={step.num} className="relative z-10 text-center">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs mx-auto mb-4 shadow-sm">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <GoogleReviews />

      {/* ── AREAS WE COVER ── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-heading mb-4">We cover all of Greater London</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Based in New Malden (KT3), we travel across every London borough — from Kingston and Wimbledon through to Croydon, Chelsea, Brixton, and beyond. No callout charge to any area.
              </p>
              <a href="tel:07378349222" className="btn-primary py-3 px-7">
                <PhoneIcon className="w-4 h-4" />
                Check your area
              </a>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {featuredLocations.map((l) => (
                <Link
                  key={l.slug}
                  href={`/mac-repair-${l.slug}`}
                  className="text-center text-xs font-medium text-gray-600 bg-gray-50 hover:bg-brand hover:text-white rounded-lg px-2 py-2.5 border border-gray-100 hover:border-brand transition-all duration-150"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-heading">Frequently asked questions</h2>
          </div>
          <FAQAccordion items={homeFaqs} />
          <p className="text-center text-sm text-gray-400 mt-8">
            More questions?{' '}
            <Link href="/faqs" className="text-brand font-medium hover:underline">See all FAQs</Link>{' '}
            or{' '}
            <a href="tel:07378349222" className="text-brand font-medium hover:underline">call us directly</a>.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative bg-brand py-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=40"
            alt=""
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Book your same-day callout
          </h2>
          <p className="text-white/70 text-base mb-8">
            Call now and we can usually visit today. No shop, no drop-off, no waiting.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:07378349222" className="btn-accent text-base px-8 py-4">
              <PhoneIcon className="w-5 h-5" />
              0737 834 9222
            </a>
            <a href="mailto:info@werepairmac.co.uk" className="btn-ghost-white py-4 px-7 text-base">
              Email for a Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
