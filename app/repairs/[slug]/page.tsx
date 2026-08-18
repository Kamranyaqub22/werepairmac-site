import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllCaseStudies,
  getCaseStudy,
  getRelatedCaseStudies,
  caseStudyDescription,
  caseStudyLocation,
  caseStudyService,
  formatCaseStudyDate,
  VISIT_TYPE_LABEL,
} from '@/lib/caseStudies';
import { serviceLower } from '@/lib/services';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { ArrowRightIcon, PhoneIcon, CheckIcon } from '@/components/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllCaseStudies().map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) return { title: 'Not Found' };

  const url = `https://www.werepairmac.co.uk/repairs/${caseStudy.slug}`;

  return {
    title: caseStudy.metaTitle ?? caseStudy.title,
    description: caseStudyDescription(caseStudy),
    alternates: { canonical: url },
    openGraph: {
      title: caseStudy.title,
      description: caseStudyDescription(caseStudy),
      url,
      images: caseStudy.photos.map((photo) => ({ url: photo.src })),
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) notFound();

  const location = caseStudyLocation(caseStudy);
  const service = caseStudyService(caseStudy);
  const related = getRelatedCaseStudies(caseStudy, 3);
  const [cover, ...morePhotos] = caseStudy.photos;
  const url = `https://www.werepairmac.co.uk/repairs/${caseStudy.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudyDescription(caseStudy),
    image: caseStudy.photos.map((photo) =>
      photo.src.startsWith('http') ? photo.src : `https://www.werepairmac.co.uk${photo.src}`
    ),
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy.updatedAt ?? caseStudy.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: [
      {
        '@type': 'Organization',
        name: 'We Repair Mac',
        url: 'https://www.werepairmac.co.uk',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'We Repair Mac',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.werepairmac.co.uk/logo.png',
      },
    },
    // The town the job actually happened in. This is the honest place to carry
    // the location signal — not a keyword-stuffed alt attribute.
    ...(location
      ? {
          contentLocation: {
            '@type': 'Place',
            name: location.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: location.name,
              ...(location.postcode ? { postalCode: location.postcode } : {}),
              addressCountry: 'GB',
            },
          },
        }
      : {}),
  };

  const facts: { label: string; value: string }[] = [
    { label: 'Device', value: caseStudy.device },
    ...(location ? [{ label: 'Location', value: location.name }] : []),
    { label: 'Where we worked', value: VISIT_TYPE_LABEL[caseStudy.visitType] },
    { label: 'Turnaround', value: caseStudy.turnaround },
    ...(caseStudy.partsUsed?.length
      ? [{ label: 'Parts fitted', value: caseStudy.partsUsed.join(', ') }]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Real Repairs', url: 'https://www.werepairmac.co.uk/repairs' },
          { name: caseStudy.title, url },
        ]}
      />

      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={cover.src}
            alt=""
            aria-hidden="true"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/repairs"
            className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors mb-6"
          >
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
            Back to real repairs
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100 mb-4">
            {location && <span className="tag bg-white/10 text-white">{location.name}</span>}
            <span>{formatCaseStudyDate(caseStudy.publishedAt)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            {caseStudy.title}
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{caseStudy.excerpt}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Facts first: this is what a reader scanning for "is this my problem?" needs. */}
          <dl className="grid sm:grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 mb-10">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-white p-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  {fact.label}
                </dt>
                <dd className="text-base font-semibold text-gray-900">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <figure className="mb-12">
            <div className="relative h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
            {cover.caption && (
              <figcaption className="mt-3 text-sm text-gray-500 text-center">
                {cover.caption}
              </figcaption>
            )}
          </figure>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The call</h2>
              <p className="text-base text-gray-600 leading-relaxed">{caseStudy.theCall}</p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Reported fault:</span>{' '}
                {caseStudy.fault}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What we found</h2>
              <ul className="space-y-3">
                {caseStudy.diagnosis.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>

            {morePhotos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">During the repair</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {morePhotos.map((photo) => (
                    <figure key={photo.src}>
                      <div className="relative h-56 rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 440px"
                        />
                      </div>
                      {photo.caption && (
                        <figcaption className="mt-2 text-sm text-gray-500">
                          {photo.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What we did</h2>
              <ol className="space-y-4">
                {caseStudy.theRepair.map((step, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-600">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The result</h2>
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <p className="text-base text-gray-600 leading-relaxed">{caseStudy.outcome}</p>
                </div>
              </div>
            </section>
          </div>

          {service && (
            <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Same fault on your Mac?</h2>
                  <p className="text-gray-500 leading-relaxed">
                    We come to your home or office
                    {location ? ` in ${location.name}` : ' anywhere in Greater London'} for{' '}
                    {serviceLower(service)}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:07378349222" className="btn-accent">
                    <PhoneIcon className="w-4 h-4" />
                    Call 07378 349222
                  </a>
                  <Link href={`/${service.slug}`} className="btn-outline">
                    View service page
                  </Link>
                </div>
              </div>
            </div>
          )}

          {location && (
            <p className="mt-6 text-sm text-gray-500">
              More about what we do in this area:{' '}
              <Link href={`/mac-repair-${location.slug}`} className="text-brand font-semibold hover:underline">
                Mac repair in {location.name}
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-14 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="section-heading">Other repairs we have done</h2>
              <Link href="/repairs" className="text-sm font-semibold text-brand hover:underline">
                View all repairs
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => {
                const itemLocation = caseStudyLocation(item);
                return (
                  <article key={item.slug} className="card p-0 overflow-hidden">
                    <Link href={`/repairs/${item.slug}`} className="block relative h-48">
                      <Image
                        src={item.photos[0].src}
                        alt={item.photos[0].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                    <div className="p-6">
                      <div className="text-xs text-gray-400 mb-3">
                        {itemLocation ? `${itemLocation.name} · ` : ''}
                        {formatCaseStudyDate(item.publishedAt)}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-snug mb-3">
                        <Link
                          href={`/repairs/${item.slug}`}
                          className="hover:text-brand transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.excerpt}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
