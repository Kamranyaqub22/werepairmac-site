import Link from 'next/link';
import Image from 'next/image';
import {
  formatCaseStudyDate,
  caseStudyLocation,
  VISIT_TYPE_LABEL,
  type CaseStudy,
} from '@/lib/caseStudies';
import { ArrowRightIcon } from '@/components/Icons';

/**
 * Links from a town or service page to real repairs we did there.
 *
 * These links matter more than an ordinary related-content block. The case
 * studies are new pages on a low-authority domain, reachable only from /repairs
 * and each other, while the town and service pages already have crawl history —
 * so this is the path by which the new pages get found and inherit some
 * standing.
 *
 * It runs the other way too: a combo page that can point at a real job in that
 * town carries something none of its 115 siblings do, which is the kind of
 * unique content the thin ones have been short of.
 *
 * `intro` is passed in rather than templated here so each page type frames the
 * block in its own words — see the note on RelatedAdvice.
 */
export default function RelatedRepairs({
  caseStudies,
  heading = 'Real repairs we have done',
  intro,
}: {
  caseStudies: CaseStudy[];
  heading?: string;
  intro: string;
}) {
  if (!caseStudies.length) return null;

  return (
    <section className="py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-heading text-center">{heading}</h2>
        <p className="text-center text-gray-500 mt-2 mb-10 max-w-2xl mx-auto">{intro}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => {
            const location = caseStudyLocation(caseStudy);
            const cover = caseStudy.photos[0];

            return (
              <article key={caseStudy.slug} className="card p-0 overflow-hidden">
                <Link href={`/repairs/${caseStudy.slug}`} className="block relative h-40">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </Link>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                    {location && (
                      <span className="font-semibold text-brand">{location.name}</span>
                    )}
                    <span>{formatCaseStudyDate(caseStudy.publishedAt)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug mb-2">
                    <Link
                      href={`/repairs/${caseStudy.slug}`}
                      className="hover:text-brand transition-colors"
                    >
                      {caseStudy.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {caseStudy.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="tag text-xs">{caseStudy.device}</span>
                    <span className="tag text-xs">{VISIT_TYPE_LABEL[caseStudy.visitType]}</span>
                  </div>
                  <Link
                    href={`/repairs/${caseStudy.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all"
                  >
                    Read the repair <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
