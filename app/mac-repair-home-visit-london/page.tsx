import type { Metadata } from 'next';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { LABOUR_RATE } from '@/lib/quotes';
import { locations } from '@/lib/locations';
import {
  CheckIcon, PhoneIcon, TruckIcon, ShieldCheckIcon, ClockIcon, ArrowRightIcon, MapPinIcon,
} from '@/components/Icons';

// The decision-layer page for the callout term class — "mac repair home visit
// london", "mobile mac repair", "apple mac call out", "on-site computer repair".
//
// This is the one thing the business does that its competitors mostly do not,
// and until now it was expressed only in the homepage title and scattered body
// copy, with no page to rank. Deliberately NOT a `services` entry: the service
// template is organised around a fault list ("common X faults we fix"), and the
// subject here is the delivery model rather than a fault.

const WHATSAPP = 'https://wa.me/447378349222?text=Hi%2C%20I%27d%20like%20to%20book%20a%20home%20visit';

export const metadata: Metadata = {
  // Root layout appends " | We Repair Mac" (16), so keep this base ≤ 44.
  title: 'Mac Repair Home Visit London | Same Day',
  description:
    'Mac, laptop and PC repair at your home or office across London. An engineer comes to you, most repairs done on the spot, no callout charge. No fix, no fee.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/mac-repair-home-visit-london' },
  openGraph: {
    title: 'Mac Repair Home Visit London | We Repair Mac',
    description:
      'An engineer comes to your home or office anywhere in Greater London. Most repairs done on the spot, no callout charge, no fix no fee.',
    url: 'https://www.werepairmac.co.uk/mac-repair-home-visit-london',
    type: 'website',
    images: ['/images/engineer-working-macbook-unsplash.jpg'],
  },
};

const faqs = [
  {
    q: 'Do you really come to my home, or do I have to post the device or drop it off?',
    a: 'We come to you. An engineer travels to your home or office anywhere in Greater London, and for most jobs the repair happens there in front of you and the machine never leaves your sight. There is no shop to visit and nothing to post. The exception is board-level work — microscope soldering on a logic board or an HDMI port — which needs proper rework equipment and goes to our workshop. Roughly seven in ten jobs are finished on the spot; we tell you which yours is when we quote, not after.',
  },
  {
    q: 'Is there a callout charge or a minimum spend?',
    a: `No callout charge, anywhere in our coverage area, and no charge for the diagnosis. You pay for labour at £${LABOUR_RATE} per hour with a one-hour minimum, plus any parts, and both figures are agreed with you before anything is opened. If we cannot fix it there is nothing at all to pay — no diagnostic fee, no travel fee, no "we came out" charge. Evenings and weekends cost the same as a weekday slot.`,
  },
  {
    q: 'How quickly can someone get to me?',
    a: 'Same-day is usually workable if you call before 2pm, and we cover Greater London seven days a week. How fast we reach you depends on where you are relative to our New Malden base — the Surrey and south-west London towns are typically quicker than the far side of the city. Rather than promise everyone an hour, we will tell you honestly on the phone what is realistic for your postcode today.',
  },
  {
    q: 'What can actually be fixed at my house?',
    a: 'More than most people expect. Screen replacements, batteries, keyboards, charging ports, memory and SSD upgrades, data recovery from a healthy drive, virus and macOS problems, networking and printer setup are all routine on-site work, and we carry the common parts so most are single-visit jobs. What genuinely needs a workshop is board-level soldering and severe liquid damage where a board must be cleaned and inspected under magnification. Anything software-related may not need a visit at all — we can often do it remotely the same day.',
  },
  {
    q: 'Why would I choose a home visit over a repair shop?',
    a: 'Three practical reasons. Your machine never leaves your sight, which matters when it holds your work, your accounts or your photographs. You are not without it for a week — most jobs are done in an hour rather than left on a bench behind a counter. And you can watch the work and ask questions as it happens, which tends to produce a more honest conversation about what is actually wrong than a phone call from a shop two days later. It also suits anyone who simply cannot get to a high street during working hours.',
  },
  {
    q: 'Do you visit businesses as well as homes?',
    a: 'Yes, and a good share of our work is small offices, studios and home-based businesses across London. We can work around your hours rather than ours, including early, late and weekend visits at no extra cost, which usually matters more to a business than the price does. If several machines need attention we will look at them in one visit rather than billing separate call-outs.',
  },
];

const STEPS = [
  { icon: PhoneIcon, title: 'Tell us what it is doing', desc: 'A short call or WhatsApp message. We will often narrow the fault down before anyone travels, and say honestly if it can be done remotely instead.' },
  { icon: ClockIcon, title: 'Pick a time that suits you', desc: 'Same day if you call before 2pm. Evenings and weekends cost exactly the same as a weekday slot.' },
  { icon: TruckIcon, title: 'The engineer comes to you', desc: 'Home or office, anywhere in Greater London. No callout charge, and the diagnosis is free before any price is agreed.' },
  { icon: CheckIcon, title: 'Fixed in front of you', desc: 'Most repairs are finished on the spot while you watch. You pay when it works — and nothing at all if it cannot be fixed.' },
];

const ON_SITE = [
  'Screen replacements', 'Battery replacements', 'Keyboards and trackpads',
  'Charging ports', 'SSD and memory upgrades', 'Virus and macOS problems',
  'Data recovery from a healthy drive', 'Wi-Fi and networking', 'Printer setup',
];

const WORKSHOP = [
  'Logic board and micro-soldering work',
  'Console HDMI port replacement',
  'Severe liquid damage needing board cleaning',
  'Data recovery from a physically failed drive',
];

export default function HomeVisitPage() {
  // A representative spread of the coverage area rather than all 86 towns — a
  // wall of links here would be nav boilerplate, and /areas-we-cover already
  // exists for the full list.
  const featured = ['kingston-upon-thames', 'wimbledon', 'richmond', 'chelsea', 'clapham', 'croydon', 'ealing', 'islington', 'canary-wharf', 'bromley', 'twickenham', 'sutton']
    .map((slug) => locations.find((l) => l.slug === slug))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Home Visit Repair', url: 'https://www.werepairmac.co.uk/mac-repair-home-visit-london' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Home &amp; Office Visits · All Greater London
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Mac Repair at Your Home in London
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            An engineer comes to your door, diagnoses the fault for free and fixes most problems
            on the spot while you watch. No shop to visit, nothing to post, no callout charge.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a href="tel:07378349222" className="btn-primary inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call 07378 349222
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-ghost-white inline-flex items-center gap-2">
              Book on WhatsApp <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Why a visit beats a shop */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">Why have the repair come to you</h2>
          <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
            <p>
              The ordinary way to get a Mac fixed is to carry it into a shop, hand it over a
              counter and wait somewhere between three days and a fortnight for a phone call.
              You lose the machine for the duration, you have no idea what happened to it while
              it was out of your hands, and the diagnosis arrives second-hand down a phone line.
              For a device that holds your work, your email and your photographs, that is a lot
              to give up for a repair that often takes under an hour of actual work.
            </p>
            <p>
              A home visit inverts all three. The engineer comes to your kitchen table or your
              desk, the diagnosis happens in front of you, and the great majority of jobs are
              finished in the same visit — so the Mac is back in use the same afternoon rather
              than the following week. You can watch what is being done and ask about it as it
              happens, which tends to produce a far more honest conversation than a call two
              days later. And the machine never leaves your sight, which for anyone holding
              client work, accounts or irreplaceable photographs is the part that matters most.
            </p>
            <p>
              It also removes the practical obstacle that stops people getting things fixed at
              all: you do not have to be free during shop hours, in the right part of London,
              carrying a desktop or an iMac down the road. We work evenings and weekends at the
              same rate as any weekday slot, and there is no callout charge for coming to you.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-heading text-center">How a call-out works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-300">0{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On-site vs workshop — the honest split */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading">What we can do at your door — and what we cannot</h2>
          <p className="text-gray-600 mt-2 mb-8 leading-relaxed">
            Most repairs are genuinely finished in your home. A few honestly are not, and we
            would rather tell you which is which before a visit than discover it on your table.
            Around seven in ten jobs are completed on the spot.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-brand" /> Done at your home or office
              </h3>
              <ul className="space-y-2.5">
                {ON_SITE.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-gray-400" /> Collected for the workshop
              </h3>
              <ul className="space-y-2.5">
                {WORKSHOP.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <ArrowRightIcon className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                These need a microscope and proper rework equipment. We collect the machine,
                quote before starting and return it tested — see{' '}
                <Link href="/macbook-logic-board-repair-london" className="text-brand font-semibold hover:underline">
                  logic board repair
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">What a home visit costs</h2>
          <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
            <p>
              There is <strong className="text-gray-900">no callout charge</strong> anywhere in
              our coverage area, and the diagnosis is free. You pay labour at{' '}
              <strong className="text-gray-900">£{LABOUR_RATE} per hour</strong> with a one-hour
              minimum, plus the cost of any parts — and you get both numbers before anything is
              opened. Evening and weekend visits cost exactly the same as a weekday slot.
            </p>
            <p>
              If we cannot fix it, you pay nothing at all: no diagnostic fee, no travel charge,
              nothing for the visit. That is the whole of our no fix, no fee guarantee, and it
              is why we would rather tell you on the phone that a job is not worth doing than
              drive across London to bill you an hour for saying so.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/quote" className="btn-primary inline-flex items-center gap-2">
              Get an estimate for your fault <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/remote-support" className="btn-outline inline-flex items-center gap-2">
              Or fix it remotely today
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading">Where we visit</h2>
          <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
            We cover all of Greater London and a good part of Surrey from our New Malden base.
            Same-day is usually workable if you call before 2pm, though how quickly we reach you
            depends on your side of the city — we will tell you honestly on the phone.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {featured.map((l) => (
              <Link
                key={l.slug}
                href={`/mac-repair-${l.slug}`}
                className="inline-flex items-center gap-1.5 text-sm bg-gray-50 hover:bg-brand hover:text-white transition-colors border border-gray-200 rounded-full px-3.5 py-1.5"
              >
                <MapPinIcon className="w-3.5 h-3.5" /> {l.name}
              </Link>
            ))}
          </div>
          <Link href="/areas-we-cover" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline mt-5">
            See all {locations.length} areas we cover <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Home visit repair — FAQs</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />

      {/* CTA */}
      <section className="py-14 bg-brand text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheckIcon className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book a visit today</h2>
          <p className="text-white/80 mb-7 leading-relaxed">
            Tell us what the machine is doing and we will tell you honestly whether it needs a
            visit, a workshop repair, or nothing more than a remote session this afternoon.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:07378349222" className="btn-white inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 07378 349222
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-ghost-white inline-flex items-center gap-2">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
