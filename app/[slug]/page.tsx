import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getService, services } from '@/lib/services';
import { getLocation, getNearbyLocations, getLocationFaqs, locations } from '@/lib/locations';
import { getBlogPostsForService, formatBlogDate } from '@/lib/blog';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrustBadges from '@/components/TrustBadges';
import LocationMap from '@/components/LocationMap';
import {
  PhoneIcon, MapPinIcon, CheckIcon,
  ShieldCheckIcon, ClockIcon, TruckIcon, WrenchIcon,
  CurrencyPoundIcon, BoltIcon, ArrowRightIcon,
} from '@/components/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const serviceSlugs = services.map((s) => ({ slug: s.slug }));
  const locationSlugs = locations.map((l) => ({ slug: `mac-repair-${l.slug}` }));
  return [...serviceSlugs, ...locationSlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const service = getService(slug);
  if (service) {
    return {
      title: service.metaTitle,
      description: service.metaDescription,
      alternates: { canonical: `https://www.werepairmac.co.uk/${slug}` },
      openGraph: {
        title: service.metaTitle,
        description: service.metaDescription,
        url: `https://www.werepairmac.co.uk/${slug}`,
      },
    };
  }

  // Location page
  const locationSlug = slug.replace(/^mac-repair-/, '');
  const location = getLocation(locationSlug);
  if (location) {
    return {
      title: `Mac & Laptop Repair ${location.name}`,
      description: `Professional Mac, MacBook and laptop repair in ${location.name} (${location.postcode}). Same-day home visits, no fix no fee. Call 0737 834 9222.`,
      alternates: { canonical: `https://www.werepairmac.co.uk/mac-repair-${location.slug}` },
    };
  }

  return { title: 'Not Found' };
}

// ─── Service Page ───────────────────────────────────────────────────────────

function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
  if (!service) return null;

  const faqs = [
    { q: `How quickly can you come for ${service.shortTitle} in London?`, a: 'We offer same-day callouts across Greater London. Book before 2pm and we can usually visit on the same day. Evening and weekend slots are also available.' },
    { q: 'Do I need to bring my device to a shop?', a: 'No - we come to you. Our engineers visit your home or office anywhere in Greater London. Most repairs are completed on-site in front of you.' },
    { q: `What does ${service.shortTitle} cost?`, a: 'Our labour rate is £100 per hour (minimum 1 hour), plus the cost of any parts required. We provide a clear upfront quote covering both labour and parts before we start any work — no surprises, no hidden fees.' },
    { q: 'Is there a warranty on the repair?', a: 'Yes. All repairs carry a 90-day parts and labour warranty. If the same fault recurs, we fix it free of charge.' },
    { q: 'What if you cannot fix it?', a: 'If we cannot fix your device, you pay nothing. No diagnostic fee, no callout charge - that is our No Fix, No Fee guarantee.' },
  ];

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 4);
  const relatedPosts = getBlogPostsForService(slug, 3);

  const WHY_US = [
    { Icon: TruckIcon, title: 'We Come to You', desc: 'No need to visit a shop. We travel across all Greater London to your home or office. No extra charge for travel.' },
    { Icon: BoltIcon, title: 'Same-Day Repairs', desc: 'Most repairs are completed on-site within an hour. Book before 2pm and we will do our best to visit the same day.' },
    { Icon: ShieldCheckIcon, title: 'Genuine Parts & Warranty', desc: 'We use quality replacement parts and back every repair with a 90-day parts and labour warranty.' },
    { Icon: CurrencyPoundIcon, title: 'Fixed Price Quotes', desc: 'We quote before we start. No surprise bills, no hidden charges - only pay when you are satisfied.' },
    { Icon: WrenchIcon, title: 'Experienced Engineers', desc: 'Our engineers are Apple-experienced technicians with years of Mac and laptop repair expertise.' },
    { Icon: ClockIcon, title: 'No Fix, No Fee', desc: 'If we cannot fix your device, you pay absolutely nothing. That is our guarantee to every customer.' },
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.werepairmac.co.uk' },
        { name: service.shortTitle, url: `https://www.werepairmac.co.uk/${slug}` },
      ]} />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.shortTitle}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              Mobile Repair Service · London
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{service.title}</h1>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">{service.longDescription}</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:07378349222" className="btn-accent py-4 px-8 text-base inline-flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" /> Call 0737 834 9222
              </a>
              <Link href="/quote" className="btn-ghost-white py-4 px-6 inline-flex items-center gap-2">
                Get a Quote &amp; Book <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {['No Fix, No Fee', 'Same Day Visit', '90-Day Warranty'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-sm text-blue-100">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" /> {badge}
                </span>
              ))}
            </div>
          </div>
          {/* Issues card */}
          <div className="hidden md:block">
            <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
              <h2 className="font-bold text-lg mb-4 text-white">Common Issues We Fix</h2>
              <ul className="space-y-2.5">
                {service.commonIssues.map((issue) => (
                  <li key={issue} className="flex items-center gap-2.5 text-sm text-blue-100">
                    <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Pricing */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="section-heading">How our pricing works</h2>
            <p className="text-gray-500 mt-2">Agreed upfront before we touch your device. No surprises.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <div className="grid md:grid-cols-3 gap-6 items-center text-center">
              <div>
                <div className="text-4xl font-extrabold text-brand">£100</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">per hour labour</div>
                <div className="text-xs text-gray-400 mt-1">minimum 1 hour · no hidden extras</div>
              </div>
              <div className="text-3xl text-gray-300 font-light text-center hidden md:block">+</div>
              <div>
                <div className="text-4xl font-extrabold text-brand">Parts</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">quoted separately</div>
                <div className="text-xs text-gray-400 mt-1">agreed before any work starts</div>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-6 pt-6 grid sm:grid-cols-3 gap-4 text-center">
              {[
                { label: 'No fix → you pay £0', sub: 'No diagnostic fee, no callout charge if we cannot repair' },
                { label: 'No callout charge', sub: 'We travel anywhere in Greater London at no extra cost' },
                { label: '90-day warranty', sub: 'Parts and labour covered if the same fault returns' },
              ].map(({ label, sub }) => (
                <div key={label}>
                  <div className="font-bold text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Software-only repairs with no parts are just the hourly labour charge. For screen replacements, batteries and board work, we confirm the parts cost with you before starting.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center">Why Choose We Repair Mac?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {WHY_US.map(({ Icon, title, desc }) => (
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

      {/* Mobile common issues */}
      <section className="py-10 bg-gray-50 md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Common Issues We Fix</h2>
          <ul className="space-y-3">
            {service.commonIssues.map((issue) => (
              <li key={issue} className="flex items-center gap-2.5 text-gray-700">
                <CheckIcon className="w-4 h-4 text-brand flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">{service.shortTitle} FAQs</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />

      {/* Related repair advice */}
      {relatedPosts.length > 0 && (
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="section-heading text-center">Related Repair Advice</h2>
            <p className="text-center text-gray-500 mt-2 mb-10 max-w-2xl mx-auto">
              Practical guides from our engineers covering {service.shortTitle.toLowerCase()}.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <article key={post.slug} className="card p-0 overflow-hidden">
                  <Link href={`/blog/${post.slug}`} className="block relative h-40">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </Link>
                  <div className="p-5">
                    <div className="text-xs text-gray-400 mb-2">{formatBlogDate(post.publishedAt)}</div>
                    <h3 className="font-bold text-gray-900 leading-snug mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all">
                      Read more <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Other Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.map((s) => (
              <Link href={`/${s.slug}`} key={s.slug} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-36">
                  <Image
                    src={s.image}
                    alt={s.shortTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-brand-dark/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors">{s.shortTitle}</div>
                  <div className="text-blue-200 text-xs mt-0.5 flex items-center gap-1">
                    Learn more <ArrowRightIcon className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.shortTitle}
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Book Your {service.shortTitle} Today</h2>
          <p className="text-blue-100 mb-6">Same-day visits across Greater London. No fix, no fee. No callout charge.</p>
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

// ─── Location Page ───────────────────────────────────────────────────────────

function LocationPage({ locationSlug }: { locationSlug: string }) {
  const location = getLocation(locationSlug);
  if (!location) return null;

  const nearby = getNearbyLocations(locationSlug);
  const faqs = getLocationFaqs(location);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.werepairmac.co.uk' },
        { name: 'Areas We Cover', url: 'https://www.werepairmac.co.uk/areas-we-cover' },
        { name: `Mac Repair ${location.name}`, url: `https://www.werepairmac.co.uk/mac-repair-${locationSlug}` },
      ]} />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/mac-repair-location-hero-unsplash.jpg"
            alt={`Mac repair ${location.name}`}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <MapPinIcon className="w-3.5 h-3.5 text-orange-400" /> {location.name} &middot; {location.postcode} &middot; {location.borough}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Mac &amp; Laptop Repair<br />
              <span className="text-orange-400">{location.name}</span>
            </h1>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              Professional Mac, MacBook and laptop repair in {location.name} ({location.postcode}). Our engineers come directly to your home or office - same-day service with no callout charge.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:07378349222" className="btn-accent py-4 px-8 text-base inline-flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" /> Call 0737 834 9222
              </a>
              <Link href="/quote" className="btn-ghost-white py-4 px-6 inline-flex items-center gap-2">
                Get a Quote &amp; Book <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {['No Fix, No Fee', 'No Callout Charge', 'Same-Day Visits', '90-Day Warranty'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-sm text-blue-100">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Services in this area */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center">Repair Services in {location.name}</h2>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            All our expertise, delivered to your door in {location.name}.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <Link href={`/${s.slug}`} key={s.slug} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={s.image}
                    alt={s.shortTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 to-brand-dark/10" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <h3 className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors">{s.shortTitle}</h3>
                  <p className="text-blue-200 text-xs mt-0.5 flex items-center gap-1">
                    Book now <ArrowRightIcon className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About the area */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Mac Repair in {location.name} - What to Expect</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
            {location.localIntro && <p>{location.localIntro}</p>}
            <p>
              We Repair Mac provides a fully mobile repair service across {location.description} in the {location.borough || 'London'} area ({location.postcode}). Rather than asking you to travel to a workshop, our engineer comes directly to your address - whether that is your home, your office, or another convenient location.
            </p>
            <p>
              Our {location.name} customers benefit from the same high standard of repair as our London-wide service: Apple-experienced technicians, quality replacement parts, and a genuine No Fix, No Fee guarantee. Most MacBook screen replacements, battery swaps, and software repairs are completed within an hour on-site.
            </p>
            <p>
              For more complex repairs such as liquid damage, logic board issues, or advanced data recovery, we may need to bring the device to our workshop - but we will always discuss this with you and keep you updated throughout.
            </p>
          </div>
          <div className="mt-8">
            <LocationMap name={location.name} postcode={location.postcode} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Mac Repair {location.name} - FAQs</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />

      {/* Nearby areas we also cover */}
      {nearby.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2 text-center">Areas near {location.name} we also cover</h2>
            <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto text-sm">
              Our engineer travels across {location.borough || 'Greater London'} and beyond. If you are close to {location.name}, we can almost certainly come to you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/mac-repair-${n.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-brand hover:text-brand text-gray-700 text-sm font-medium rounded-full px-4 py-2 transition-colors"
                >
                  <MapPinIcon className="w-3.5 h-3.5 text-orange-400" />
                  Mac Repair {n.name}
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/areas-we-cover" className="text-sm font-semibold text-brand hover:underline">
                View all areas we cover →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/laptop-repair-hero-unsplash.jpg"
            alt="Laptop repair"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Book a Repair in {location.name}</h2>
          <p className="text-blue-100 mb-6">Same-day visits, no callout charge, no fix no fee.</p>
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

// ─── Page Router ─────────────────────────────────────────────────────────────

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;

  // Check service
  if (getService(slug)) {
    return <ServicePage slug={slug} />;
  }

  // Check location
  const locationSlug = slug.replace(/^mac-repair-/, '');
  if (getLocation(locationSlug)) {
    return <LocationPage locationSlug={locationSlug} />;
  }

  notFound();
}
