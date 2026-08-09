import Link from 'next/link';
import { formatRange, LABOUR_RATE } from '@/lib/quotes';
import {
  issuePrice,
  FIX_LOCATION_LABEL,
  LABOUR_ONLY_NOTE,
  type CommonIssue,
} from '@/lib/commonIssues';
import { services, serviceLower } from '@/lib/services';
import { CheckIcon, ArrowRightIcon } from '@/components/Icons';

/**
 * One symptom, expanded.
 *
 * `variant` splits the content by search intent, and it is load-bearing rather
 * than cosmetic. Rendering the whole entry in both places would put a verbatim
 * ~9,000-word block on two URLs — the hub and one service page — competing for
 * the same query with the same answer. On a domain with very few backlinks the
 * likely loser is the hub, which lands in "crawled, not indexed" exactly as 116
 * combo pages did before they were retired.
 *
 *   'hub'     — the informational half. "How do I fix this myself?"
 *               Cause + safe checks, then a bridge to the service page.
 *   'service' — the commercial half. "Who fixes this and what does it cost?"
 *               Cause + what we actually do + price.
 *
 * `likelyCause` is deliberately in both: it is the diagnosis, it is short, and
 * neither page makes sense without it.
 *
 * Native <details>, not a JS accordion — the body is in the server HTML either
 * way, so nothing is hidden from a crawler, but 34 open cards is unreadable.
 */
export default function CommonIssueCard({
  issue,
  variant = 'hub',
  open = false,
  /** Hide the "see the full service page" link when we are already on it. */
  hideServiceLink = false,
}: {
  issue: CommonIssue;
  variant?: 'hub' | 'service';
  open?: boolean;
  hideServiceLink?: boolean;
}) {
  const price = issuePrice(issue);
  const service = services.find((s) => s.slug === issue.serviceSlug);

  return (
    <details
      id={issue.id}
      open={open}
      className="group rounded-xl border border-gray-200 bg-white overflow-hidden scroll-mt-24"
    >
      <summary className="flex items-start justify-between gap-4 px-4 sm:px-5 py-4 cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden hover:bg-gray-50">
        <div className="min-w-0">
          {/* h3 so the hub reads h1 > h2 (area) > h3 (symptom) to a crawler. */}
          <h3 className="font-semibold text-gray-900 leading-snug">{issue.symptom}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm">
            <span className="text-brand font-semibold">
              {price ? formatRange(price) : `£${LABOUR_RATE}/hr labour`}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{FIX_LOCATION_LABEL[issue.where]}</span>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="flex-shrink-0 mt-1 text-gray-400 transition-transform group-open:rotate-45 text-xl leading-none"
        >
          +
        </span>
      </summary>

      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100">
        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mt-4 mb-2">
          What it usually turns out to be
        </h4>
        <p className="text-gray-600 leading-relaxed">{issue.likelyCause}</p>

        {variant === 'hub' ? (
          <>
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mt-5 mb-2">
              What you can safely try first
            </h4>
            <ul className="space-y-2">
              {issue.selfHelp.map((step) => (
                <li key={step} className="flex gap-2.5 text-gray-600 leading-relaxed">
                  <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-1.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            {service && (
              <p className="text-gray-600 leading-relaxed mt-4">
                If none of that shifts it, this is{' '}
                <Link href={`/${service.slug}`} className="text-brand font-semibold hover:underline">
                  {serviceLower(service)}
                </Link>{' '}
                — {FIX_LOCATION_LABEL[issue.where].toLowerCase()}, and that page sets out exactly
                what we do about it.
              </p>
            )}
          </>
        ) : (
          <>
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mt-5 mb-2">
              What we do about it
            </h4>
            <p className="text-gray-600 leading-relaxed">{issue.whatWeDo}</p>
            <p className="text-gray-600 leading-relaxed mt-4">
              There are a few things worth checking yourself before booking anything —{' '}
              <Link
                href={`/common-computer-problems-london#${issue.id}`}
                className="text-brand font-semibold hover:underline"
              >
                the safe checks for this fault
              </Link>{' '}
              are on our fault finder, and they solve it often enough to be worth five minutes.
            </p>
          </>
        )}

        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          {price
            ? 'A guide range, not a quote — the exact figure is confirmed on site before anything is opened, and you pay nothing if we cannot fix it.'
            : `${LABOUR_ONLY_NOTE}. Quoted before we start, and nothing to pay if we cannot put it right.`}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm font-semibold">
          {!hideServiceLink && service && (
            <Link href={`/${service.slug}`} className="text-brand hover:underline inline-flex items-center gap-1">
              {service.shortTitle} <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
          {issue.blogSlug && (
            <Link href={`/blog/${issue.blogSlug}`} className="text-brand hover:underline inline-flex items-center gap-1">
              Read the full guide <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
          <a href="tel:07378349222" className="text-accent hover:underline">
            Call 07378 349222
          </a>
        </div>
      </div>
    </details>
  );
}
