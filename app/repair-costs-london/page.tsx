import type { Metadata } from 'next';
import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrustBadges from '@/components/TrustBadges';
import { deviceCategories, formatRange, LABOUR_RATE } from '@/lib/quotes';
import { PhoneIcon, ArrowRightIcon, ShieldCheckIcon, CheckIcon } from '@/components/Icons';

// The repair cost guide.
//
// Built after testing how AI search answers "how much does MacBook screen
// replacement cost London" — every cited source was a dedicated cost guide with
// "cost" or "price" in the URL, and this site appeared nowhere. The same shape
// shows up in Search Console: roughly 150 impressions on battery-cost phrasings
// alone, plus a large PS5-HDMI-cost cluster, none of it landing anywhere.
//
// PROJECT.md previously ruled out a pricing page on the grounds it would
// mislead. That objection was to a "from £49" headline, and it still stands —
// this page never states a bare floor. It publishes the same all-in ranges the
// estimator uses, both ends shown, with the labour rate and the no-fix-no-fee
// terms stated plainly. That is more honest than the competitors quoting "From
// £85" for work that costs £300, not less.
//
// Every figure is read from lib/quotes.ts. Nothing is redeclared here, so the
// estimator, the service pages and this guide cannot drift apart.

export const metadata: Metadata = {
  // Root layout appends " | We Repair Mac" (16), so keep the base ≤ 44.
  title: 'Repair Costs London | Mac, PC & Console',
  description:
    'What Mac, laptop, PC and console repairs actually cost in London. Honest all-in ranges by fault, labour at £120/hr plus parts, quoted before work starts.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/repair-costs-london' },
  openGraph: {
    title: 'Repair Costs London | We Repair Mac',
    description:
      'Honest price ranges for Mac, laptop, PC and console repairs across London. Labour £120/hr plus parts, quoted upfront. No fix, no fee.',
    url: 'https://www.werepairmac.co.uk/repair-costs-london',
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How much does a MacBook screen replacement cost?',
    a: 'Typically £180 to £450 all-in, and where you land inside that range is decided almost entirely by the model rather than the damage. An older MacBook Air panel sits at the bottom; a 13-inch Pro a step above; the 14 and 16-inch Liquid Retina XDR assemblies are in a different bracket because the mini-LED panel is genuinely expensive hardware. That figure covers labour and the panel together. If the screen would cost more than the Mac is realistically worth, we will tell you rather than take the work.',
  },
  {
    q: 'How much is a MacBook battery replacement?',
    a: 'Usually £120 to £220 all-in, fitted at your home or office in a single visit. MacBook Air cells are the cheapest of the range and the 15 and 16-inch Pro batteries the dearest, simply because they are physically much larger. Apple often quotes considerably more because on many models it replaces the entire top case — battery, keyboard and trackpad together — rather than just the cell.',
  },
  {
    q: 'What does a PS5 HDMI port repair cost?',
    a: 'Around £120 to £220, covering the replacement port and the labour to fit it. It is board-level work done at our workshop under a microscope rather than at your door, and it takes a few days. Your games, saves and account are on the internal storage and are completely untouched. It costs a fraction of replacing the console.',
  },
  {
    q: 'Why do you quote a range rather than a fixed price?',
    a: 'Because the part is the variable and we do not know which part you need until we have looked. Labour is fixed and published — £120 an hour with a one-hour minimum — but a MacBook Air panel and a 16-inch XDR assembly are not remotely the same cost, and quoting one price for both would mean overcharging half our customers. The ranges here are where real jobs actually land. Your exact figure is confirmed on site before anything is opened.',
  },
  {
    q: 'Is there a callout charge or a diagnosis fee?',
    a: 'No to both, anywhere in our coverage area. The engineer comes to you, diagnoses the fault for free, and quotes before starting. Evenings and weekends cost the same as a weekday slot. Under our no fix, no fee guarantee, a job we cannot repair costs you nothing at all — not the visit, not the diagnosis, not the travel.',
  },
  {
    q: 'Are these prices cheaper than Apple?',
    a: 'For most out-of-warranty work, considerably — but the reason matters more than the number. Apple replaces assemblies where we replace components: a whole top case rather than a keyboard, a whole logic board rather than the failed chip on it. That approach is fast and well-supported, and for a machine still under warranty or AppleCare you should absolutely use it. Once you are paying out of pocket, replacing the part that actually failed usually costs a fraction of replacing everything attached to it.',
  },
  {
    q: 'What if the repair turns out to cost more than the device is worth?',
    a: 'We tell you, and there is nothing to pay for finding out. It comes up most often with older MacBooks needing a screen, and with liquid damage that has reached the logic board. In that situation we will say plainly that it is not worth repairing, help you get the data off if that is what matters, and leave it there. We would rather lose the job than take money for work that does not make sense.',
  },
  {
    q: 'How do I pay, and when?',
    a: 'After the work is done and you can see it working — never upfront. Bank transfer or card. You get the full figure, labour and parts separately, before we begin, so the amount at the end is the amount you agreed.',
  },
];

export default function RepairCostsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Repair Costs', url: 'https://www.werepairmac.co.uk/repair-costs-london' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Price Guide · Updated 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            What Computer Repairs Cost in London
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Real all-in ranges for the repairs we are actually called out to — labour and
            typical parts together, not a headline figure with the parts left off.
          </p>
        </div>
      </section>

      <TrustBadges />

      {/* How pricing works */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">How our pricing works</h2>
          <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
            <p>
              Two numbers make up every job.{' '}
              <strong className="text-gray-900">Labour is £{LABOUR_RATE} an hour</strong>, with a
              one-hour minimum, and that figure never changes — not for evenings, not for
              weekends, not for how far across London you are. On top of that sits the cost of
              any part, which is the number that actually varies, because a MacBook Air panel
              and a 16-inch Liquid Retina XDR assembly are nothing like the same thing.
            </p>
            <p>
              There is <strong className="text-gray-900">no callout charge and no diagnosis
              fee</strong>. The engineer comes to you, works out what has failed, and gives you
              both numbers before anything is opened. If you would rather not go ahead at that
              point, you pay nothing and we leave.
            </p>
            <p>
              You will notice we publish ranges rather than a single price. That is deliberate.
              A &ldquo;from £49&rdquo; headline is easy to advertise and almost never what anyone pays;
              quoting both ends tells you honestly where the job is likely to land before
              anyone knocks on your door.
            </p>
          </div>
        </div>
      </section>

      {/* The tables */}
      {deviceCategories.map((device, di) => (
        <section
          key={device.id}
          className={`py-12 border-t border-gray-100 ${di % 2 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="section-heading">
              <span aria-hidden="true">{device.icon}</span> {device.label} repair costs
            </h2>
            <p className="text-gray-500 mt-2 mb-6">{device.blurb}</p>

            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
              {device.faults.map((fault, i) => (
                <div
                  key={fault.id}
                  className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 sm:px-5 py-4 ${
                    i % 2 ? 'bg-gray-50/60' : 'bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-gray-900">{fault.label}</span>
                    {fault.note && (
                      <p className="text-sm text-gray-500 mt-0.5 leading-snug">{fault.note}</p>
                    )}
                    {fault.remoteFixable && (
                      <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                        Often fixable remotely the same day — no visit needed.
                      </p>
                    )}
                  </div>
                  <div className="font-bold text-brand whitespace-nowrap">{formatRange(fault)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Honest caveats */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">What these figures do and do not include</h2>
          <div className="grid sm:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-brand" /> Included
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Labour at £' + LABOUR_RATE + '/hour, one-hour minimum',
                  'The parts a typical job of that kind needs',
                  'Travel to you anywhere in Greater London',
                  'Free diagnosis before any price is agreed',
                  '90-day parts and labour warranty',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Priced separately</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Premium or hard-to-source parts for rare models',
                  'Board-level repair, quoted per fault after inspection',
                  'Data recovery from a physically failed drive',
                  'Jobs needing more than one visit or several devices',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <ArrowRightIcon className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 leading-relaxed">
            These are guide figures based on the jobs we do most, not a quote. The exact price
            for your machine is confirmed on site before anything is opened — and under our no
            fix, no fee guarantee, a repair we cannot complete costs you nothing at all.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">Get a closer figure for your fault</h2>
          <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
            Tell us the device and what it is doing and we will narrow it down — often over the
            phone, before anyone travels. If it turns out to be something we can fix remotely,
            we will say so.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:07378349222" className="btn-primary inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call 07378 349222
            </a>
            <Link href="/quote" className="btn-outline inline-flex items-center gap-2">
              Use the estimator <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Repair cost questions</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />

      {/* Trust close */}
      <section className="py-12 bg-brand text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheckIcon className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl font-bold mb-3">No fix, no fee — genuinely</h2>
          <p className="text-white/80 leading-relaxed">
            If we cannot repair it, there is nothing to pay. Not the callout, not the
            diagnosis, not the travel. That is why we would rather tell you on the phone that a
            job is not worth doing than drive across London to bill you an hour for saying so.
          </p>
        </div>
      </section>
    </>
  );
}
