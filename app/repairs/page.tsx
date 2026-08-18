import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getAllCaseStudies,
  hasCaseStudies,
  caseStudyLocation,
  formatCaseStudyDate,
  VISIT_TYPE_LABEL,
} from '@/lib/caseStudies';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { ArrowRightIcon, PhoneIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Real Repairs',
  description:
    'Real Mac and laptop repairs across South West London — the fault, what we found, the parts fitted and the result, photographed on the day.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/repairs' },
};

export const revalidate = 86400;

export default function RepairsIndexPage() {
  // Nothing to show until real jobs are written up; better a 404 than an empty
  // index page competing with the rest of the site.
  if (!hasCaseStudies()) notFound();

  const caseStudies = getAllCaseStudies();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Real Repairs', url: 'https://www.werepairmac.co.uk/repairs' },
        ]}
      />

      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="tag bg-white/10 text-white">Real Repairs</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4">
            Jobs we have actually done
          </h1>
          <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">
            Every repair below is a real call-out to a home or office in our area, written up
            from the engineer&apos;s notes and photographed on the day. The fault, what we found,
            what we fitted, and how long it took.
          </p>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy) => {
              const location = caseStudyLocation(caseStudy);
              const cover = caseStudy.photos[0];

              return (
                <article key={caseStudy.slug} className="card p-0 overflow-hidden">
                  <Link href={`/repairs/${caseStudy.slug}`} className="block relative h-52">
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                      {location && (
                        <span className="font-semibold text-brand">{location.name}</span>
                      )}
                      <span>{formatCaseStudyDate(caseStudy.publishedAt)}</span>
                    </div>
                    <h2 className="font-bold text-xl text-gray-900 leading-snug mb-3">
                      <Link
                        href={`/repairs/${caseStudy.slug}`}
                        className="hover:text-brand transition-colors"
                      >
                        {caseStudy.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {caseStudy.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                      <span className="tag">{caseStudy.device}</span>
                      <span className="tag">{VISIT_TYPE_LABEL[caseStudy.visitType]}</span>
                    </div>
                    <Link
                      href={`/repairs/${caseStudy.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all"
                    >
                      Read the repair
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-3">Got the same problem?</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            We come to your home or office, quote before we start, and there is nothing to pay
            if we cannot fix it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:07378349222" className="btn-accent">
              <PhoneIcon className="w-4 h-4" />
              Call 07378 349222
            </a>
            <Link href="/quote" className="btn-outline">
              Get a quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
