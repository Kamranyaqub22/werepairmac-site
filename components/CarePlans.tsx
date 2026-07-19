import Link from 'next/link';
import { carePlans, businessPlan } from '@/lib/carePlans';
import { CheckIcon, ArrowRightIcon, PhoneIcon } from '@/components/Icons';

export default function CarePlans() {
  return (
    <div>
      {/* Tier cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {carePlans.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              tier.highlight ? 'border-brand ring-2 ring-brand/20 shadow-lg' : 'border-gray-200 bg-white'
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4 leading-snug">{tier.tagline}</p>

            <div className="mb-1">
              <span className="text-4xl font-extrabold text-brand">£{tier.annual}</span>
              <span className="text-sm text-gray-500 font-medium">/year</span>
            </div>
            <p className="text-xs text-gray-400 mb-5 h-4">
              £{(tier.annual / 12).toFixed(2)}/mo equivalent
            </p>

            <ul className="space-y-2.5 mb-6 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className={`justify-center py-3 ${tier.highlight ? 'btn-primary' : 'btn-outline'}`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>

      {/* Business plan — contact card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{businessPlan.name}</h3>
          <p className="text-sm text-gray-500 mt-1 mb-3">{businessPlan.tagline}</p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {businessPlan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center md:text-right md:w-56 flex-shrink-0">
          <div className="text-sm text-gray-500">from</div>
          <div className="text-3xl font-extrabold text-brand mb-3">
            £{businessPlan.from}<span className="text-sm font-medium text-gray-500">/device/mo</span>
          </div>
          <Link href="/contact" className="btn-primary justify-center w-full py-3">
            Get a quote <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Paid annually by Direct Debit or bank transfer · no auto-renewal without your confirmation ·{' '}
        <a href="tel:07378349222" className="text-brand font-medium inline-flex items-center gap-1">
          <PhoneIcon className="w-3.5 h-3.5" /> 07378 349222
        </a>
      </p>
    </div>
  );
}
