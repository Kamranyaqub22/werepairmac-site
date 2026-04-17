import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import HeroSlider from '@/components/HeroSlider';
import TrustBadges from '@/components/TrustBadges';
import ServiceGrid from '@/components/ServiceGrid';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import GoogleReviews from '@/components/GoogleReviews';
import { NINTENDO_SWITCH_IMAGE, XBOX_CONSOLE_IMAGE } from '@/lib/consoleImages';
import { locations } from '@/lib/locations';
import { getLatestBlogPosts, formatBlogDate } from '@/lib/blog';
import { PhoneIcon, ShieldCheckIcon, ClockIcon, TruckIcon, WrenchIcon, ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Mobile Mac, Laptop & PlayStation Repair London | We Come To You | No Fix No Fee',
  description:
    'London\'s mobile Mac, laptop and PlayStation repair service. We come to your home or office - no shop visit needed. Same-day callout across Greater London. No fix, no fee. Call 0737 834 9222.',
  alternates: { canonical: 'https://werepairmac.co.uk' },
};

const homeFaqs = [
  {
    q: 'How quickly can you come to me?',
    a: 'We offer same-day callouts across Greater London. Book before 2pm and we can typically visit the same day. Evening and weekend appointments are also available at no extra charge.',
  },
  {
    q: 'What does "No Fix, No Fee" mean?',
    a: 'If we cannot repair your device, you pay nothing at all - no diagnostic fee, no callout charge, nothing. You only pay when your repair is complete and you are satisfied.',
  },
  {
    q: 'Do you repair all MacBook models?',
    a: 'Yes. We repair all MacBook Pro and MacBook Air models including M1, M2, M3 chips, as well as older Intel models. We also repair iMac, Mac Mini and Mac Pro.',
  },
  {
    q: 'Do I need to bring my device to a shop?',
    a: 'No - we come to you. Our engineers visit your home or office anywhere in Greater London. Most repairs are completed on-site in front of you within the hour.',
  },
  {
    q: 'How much does a MacBook repair cost?',
    a: 'Our labour rate is £100 per hour (minimum 1 hour), plus parts where needed. We always provide a clear, upfront quote before touching your device — covering both labour and any parts — so you know exactly what you will pay. Simple software repairs with no parts are just the hourly labour charge.',
  },
  {
    q: 'Do you offer a warranty on repairs?',
    a: 'Yes. All repairs come with a 90-day parts and labour warranty. If the same fault reoccurs, we fix it at no extra charge.',
  },
];

export default function HomePage() {
  const featuredLocations = locations.slice(0, 24);
  const latestPosts = getLatestBlogPosts(3);

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider />

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
                src="/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg"
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
                We come to you - no shop visit, ever.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Most Mac repair services require you to drop your device at a shop, wait days, and pay for courier collection. We do things differently.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our engineer comes directly to your home or office anywhere in Greater London, diagnoses the problem on-site, and fixes most devices within the hour - while you watch.
              </p>

              <div className="space-y-5">
                {[
                  { Icon: TruckIcon, title: 'No shop visit - ever', desc: 'Other repair services make you drop off your device. We come to your home or office. No courier, no waiting, no risk of damage in transit.' },
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
              { num: '01', title: 'Call or email us', desc: 'Tell us your device, fault and postcode. We give you a fixed quote on the spot - no hidden fees.' },
              { num: '02', title: 'Choose your time', desc: 'Pick same day, next day, evening or weekend. We fit around your schedule, not the other way round.' },
              { num: '03', title: 'We come to you', desc: 'An engineer arrives at your door - home, office or anywhere convenient. No need to go anywhere.' },
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

      {/* ── MEET YOUR ENGINEER ── */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-brand/5 rounded-2xl p-6 sm:p-8 border border-brand/10">
            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0 shadow-md">
              M
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs text-brand font-semibold uppercase tracking-wider mb-1">Your Engineer</div>
              <p className="text-gray-900 font-bold text-base mb-1">Hi, I&apos;m Muhammed</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                I bring over 12 years of specialized hardware experience to your door, having successfully repaired more than 4,500 Apple and Windows devices across Greater London with a 99.8% first-visit success rate. I diagnose the exact logic board or component fault in front of you, and won&apos;t leave until you&apos;re completely satisfied. You&apos;re trusting me with a £1,000+ device — I take that seriously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GAMING CONSOLES ── */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-10 items-center">
            <div>
              <span className="tag mb-4">Gaming Console Repairs</span>
              <h2 className="section-heading mb-4">Xbox, PlayStation and Nintendo Switch repairs at your door</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                We already cover PS5 and PS4 repairs, and now the site has a dedicated gaming console repair section for Xbox and Nintendo Switch faults too. If your console is overheating, showing no display, not charging, or refusing to read games, we can diagnose it at your home or office anywhere in Greater London.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  'HDMI port and no-signal faults',
                  'Overheating and loud fan noise',
                  'Charging, USB-C and power issues',
                  'Storage, update and boot problems',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                      <WrenchIcon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/gaming-console-repair-london" className="btn-primary">
                  Console repair service
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link href="/playstation-repair-london" className="btn-outline">
                  PS5 & PS4 repairs
                </Link>
              </div>
            </div>
            <div className="bg-brand-dark rounded-2xl p-7 sm:p-8 text-white shadow-lg">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={XBOX_CONSOLE_IMAGE}
                    alt="Xbox controller for console repair"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={NINTENDO_SWITCH_IMAGE}
                    alt="Nintendo Switch for console repair"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-5">Popular console faults we handle</h3>
              <div className="space-y-4">
                {[
                  ['PlayStation', 'PS5 HDMI ports, overheating, disc drive faults, controller issues'],
                  ['Xbox', 'Series X/S no display, overheating, storage and power faults'],
                  ['Nintendo Switch', 'USB-C charging issues, dock faults, game-reader problems'],
                ].map(([label, desc]) => (
                  <div key={label} className="border border-white/10 rounded-xl p-4 bg-white/5">
                    <div className="font-semibold mb-1">{label}</div>
                    <div className="text-sm text-blue-100 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
              <a href="tel:07378349222" className="btn-accent mt-6">
                <PhoneIcon className="w-4 h-4" />
                Call for a console repair
              </a>
            </div>
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
                Based in New Malden (KT3), we travel across every London borough - from Kingston and Wimbledon through to Croydon, Chelsea, Brixton, and beyond. No callout charge to any area.
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

      {/* ── BLOG ── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div className="max-w-2xl">
              <h2 className="section-heading mb-3">Fresh repair advice, published automatically</h2>
              <p className="text-gray-500 text-base leading-relaxed">
                The blog now publishes a new article every 2 days, covering common Mac, laptop, PC, and console faults with practical advice before you book a visit.
              </p>
            </div>
            <Link href="/blog" className="btn-outline">
              Visit the blog
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <article key={post.slug} className="card p-0 overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block relative h-52">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="font-semibold text-brand">{post.category}</span>
                    <span>{formatBlogDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 leading-snug mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">
                    Read article
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative bg-brand py-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/samsung-memory-QTW80j6ZK4c-unsplash.jpg"
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

      {/* FAQ structured data for rich results */}
      <FAQSchema items={homeFaqs} />
    </>
  );
}
