import Link from 'next/link';
import { getServicePricing } from '@/lib/servicePricing';
import { LABOUR_RATE, formatRange } from '@/lib/quotes';
import { serviceLower, type Service } from '@/lib/services';

/**
 * Server-rendered price guide for a service page.
 *
 * Deliberately a server component: the whole point is that these figures end up
 * in the HTML. If this ever needs interactivity, extract the interactive part
 * rather than adding 'use client' here.
 *
 * Renders nothing when we hold no honest figures for the service — see
 * lib/servicePricing.ts.
 */
export default function ServicePriceGuide({ service }: { service: Service }) {
  const pricing = getServicePricing(service.slug);
  if (!pricing) return null;

  const showDevice = new Set(pricing.faults.map((f) => f.deviceLabel)).size > 1;

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* serviceLower, not toLowerCase: naive lowercasing gives "macbook" and "ps5". */}
        <h2 className="section-heading">What {serviceLower(service)} usually costs</h2>
        <p className="text-gray-600 mt-2 mb-6 leading-relaxed">{pricing.intro}</p>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {pricing.faults.map((fault, i) => (
            <div
              key={`${fault.deviceLabel}-${fault.id}`}
              className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 sm:px-5 py-4 ${
                i % 2 ? 'bg-gray-50/60' : 'bg-white'
              }`}
            >
              <div className="min-w-0">
                <span className="font-semibold text-gray-900">{fault.label}</span>
                {showDevice && (
                  <span className="text-gray-400 text-sm"> · {fault.deviceLabel}</span>
                )}
                {fault.note && (
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{fault.note}</p>
                )}
                {fault.remoteFixable && (
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                    Often fixable remotely the same day, with no visit needed.
                  </p>
                )}
              </div>
              <div className="font-bold text-brand whitespace-nowrap">{formatRange(fault)}</div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          All-in figures covering labour at £{LABOUR_RATE}/hour (one-hour minimum) plus the parts
          a typical job needs. They are a guide, not a quote: the exact price is confirmed with
          you on site before anything is opened, and under our no fix, no fee guarantee you pay
          nothing if we cannot put it right.{' '}
          <Link href="/quote" className="text-brand font-semibold hover:underline">
            Get a closer estimate for your fault
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
