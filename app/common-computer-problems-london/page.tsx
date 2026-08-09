import type { Metadata } from 'next';
import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrustBadges from '@/components/TrustBadges';
import CommonIssueCard from '@/components/CommonIssueCard';
import { ISSUE_AREAS, allIssues } from '@/lib/commonIssues';
import { LABOUR_RATE } from '@/lib/quotes';
import { PhoneIcon, ArrowRightIcon, ShieldCheckIcon, CheckIcon } from '@/components/Icons';

// The fault-finder hub.
//
// Built after noticing that a symptom search — "printer says offline" — returns
// computer-repair companies rather than manufacturers, and this site appears
// nowhere for any of it. The symptom query pool across Mac, Windows, printers
// and Wi-Fi is several times the size of the repair-service pool, and the site
// currently answers none of it outside /blog.
//
// Two deliberate constraints:
//
//  1. One hub, not one page per symptom. Thirty-four short "printer offline"
//     pages would rebuild exactly the thin-page problem that put 116 combo
//     pages into "crawled, not indexed" — and would cannibalise the blog posts
//     that already rank for these terms. This page links to those posts rather
//     than restating them.
//
//  2. Symptoms in plain English, not error codes. Error-code pages are probably
//     what ranks for a lot of this, but each one needs a verified-correct fix,
//     and inventing them would make the page worse than not existing.
//
// Content lives in lib/commonIssues.ts. Prices are looked up from lib/quotes.ts,
// so nothing here can drift from the estimator or the cost guide.

// Counted rather than written out, so adding a fault cannot leave the
// description quietly claiming a number that is no longer true.
const ISSUE_COUNT = allIssues().length;

export const metadata: Metadata = {
  // Root layout appends " | We Repair Mac" (16), so keep the base <= 44.
  title: 'Common Computer Problems & Fixes',
  description: `What your Mac, PC, printer or Wi-Fi fault usually turns out to be, and the safe checks worth trying before you call anyone. ${ISSUE_COUNT} faults, explained honestly.`,
  alternates: { canonical: 'https://www.werepairmac.co.uk/common-computer-problems-london' },
  openGraph: {
    title: 'Common Computer Problems & Fixes | We Repair Mac',
    description:
      'Mac, Windows, printer and Wi-Fi faults explained: what each one usually turns out to be, and the safe checks worth trying before you pay anyone.',
    url: 'https://www.werepairmac.co.uk/common-computer-problems-london',
    type: 'website',
  },
};

const faqs = [
  {
    q: 'Can I fix these problems myself?',
    a: 'A good number of them, yes — and the self-help steps under each fault are there for exactly that. A printer stuck offline, a Mac that will not start because of a failed cable, a Windows machine slowed by its own startup list: all of those are regularly sorted in ten minutes by the person who owns them. We would rather tell you that than charge you £120 to press the same buttons. What we have deliberately left out is anything involving opening a machine, because that is where a cheap problem becomes an expensive one.',
  },
  {
    q: 'How do I know whether it is hardware or software?',
    a: 'Usually by whether the fault survives a change of context. A laptop that shows nothing on its own screen but a perfect picture on an external monitor has a hardware display fault. A machine that crashes in one specific application and nowhere else is software. A printer that prints its own test page from the front panel but nothing from your computer is a connection problem, not a broken printer. Each fault above says which test separates the two, because that test is what decides whether you need a part or an hour.',
  },
  {
    q: 'Which of these can be fixed without a visit?',
    a: 'Anything that lives in software — virus and adware removal, slow performance, Windows update failures, print queues, email and account setup — can often be done over a secure remote session the same day. Anything physical cannot: screens, batteries, ports, liquid damage and dead machines all need someone in the room. Each fault is labelled with where the work realistically happens, so you know before you call.',
  },
  {
    q: 'What does it cost if I do need someone out?',
    a: `Labour is £${LABOUR_RATE} an hour with a one-hour minimum, plus parts where a job needs them. Printer and network work is labour-only and usually finished inside that hour. There is no callout charge and no diagnosis fee anywhere in Greater London, evenings and weekends included, and under our no fix, no fee guarantee a job we cannot complete costs you nothing at all.`,
  },
  {
    q: 'Is it worth repairing, or should I just replace it?',
    a: 'It depends far more on what the machine is worth than on what has failed. A screen on a £1,400 laptop is straightforward arithmetic; the same screen on a four-year-old £300 machine that is also slowing down frequently is not. We will show you the numbers and say plainly when replacement is the sensible answer — and if it is, we can move your files, programs and licences across to the new machine instead. We would rather lose the job than take money for work that does not make sense.',
  },
  {
    q: 'My fault is not listed here. Can you still help?',
    a: 'Almost certainly. These are the faults we are called out for most often, not the limit of what we work on. Ring and describe what it is doing — a good proportion of calls are narrowed down on the phone before anyone travels, and if it turns out to be something you can fix in five minutes we will tell you that instead of booking a visit.',
  },
];

export default function CommonProblemsPage() {

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          {
            name: 'Common Problems',
            url: 'https://www.werepairmac.co.uk/common-computer-problems-london',
          },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Fault Finder · {ISSUE_COUNT} Problems
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Common Computer Problems, and What Actually Fixes Them
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Mac, Windows, printer and Wi-Fi faults, written the way an engineer would explain
            them on the doorstep — what each one usually turns out to be, and what is worth
            trying yourself before you pay anyone.
          </p>
        </div>
      </section>

      <TrustBadges />

      {/* How to use it — the honest framing */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">Try the free answer first</h2>
          <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
            <p>
              Every fault below opens with what it{' '}
              <strong className="text-gray-900">usually</strong> turns out to be, then a short
              list of things you can safely check yourself. Those lists are genuine. A
              meaningful share of the calls we take are solved in five minutes by the person
              holding the machine, and we would rather you found that out here than paid an
              hour&rsquo;s labour to watch us do it.
            </p>
            <p>
              What you will not find in them is anything that involves opening a case, prising
              off a keycap, removing a battery or reinstalling an operating system. That is not
              caution for its own sake — those are the steps where a £120 job turns into a £400
              one, and the failed attempt is usually more expensive than the original fault.
            </p>
            <p>
              Each fault also says{' '}
              <strong className="text-gray-900">where the work realistically happens</strong> —
              at your door, remotely with no visit at all, or back at our workshop for
              board-level repair — and roughly what it costs, so you know what you are looking
              at before anyone picks up a phone. Where the checks do not solve it, each fault
              points at the service page that sets out what we do about it.
            </p>
          </div>

          {/* Jump nav */}
          <nav aria-label="Jump to a category" className="mt-8 flex flex-wrap gap-2">
            {ISSUE_AREAS.map((area) => (
              <a
                key={area.id}
                href={`#${area.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors"
              >
                <span aria-hidden="true">{area.icon}</span>
                {area.navLabel}
                <span className="text-gray-400 font-normal">{area.issues.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* The four fault areas */}
      {ISSUE_AREAS.map((area, ai) => (
        <section
          key={area.id}
          id={area.id}
          className={`py-12 border-t border-gray-100 scroll-mt-20 ${ai % 2 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="section-heading">
              <span aria-hidden="true">{area.icon}</span> {area.label}
            </h2>
            <p className="text-gray-600 mt-2 mb-6 leading-relaxed">{area.intro}</p>

            <div className="space-y-3">
              {area.issues.map((issue) => (
                // hideServiceLink: the bridge sentence in the card body already
                // links the service page, so the footer chip would be a second
                // link to the same URL from the same card.
                <CommonIssueCard key={issue.id} issue={issue} hideServiceLink />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* When it is worth calling — the honest close */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">When it is worth calling someone out</h2>
          <div className="grid sm:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-accent" /> Call sooner rather than later
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Liquid has gone into it — corrosion spreads for days',
                  'A drive is clicking, or files have started disappearing',
                  'The case or trackpad is bulging — that is a swollen battery',
                  'Someone talked you into giving them remote access',
                  'It shuts down under load, repeatedly',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <ArrowRightIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-brand" /> Try the checks above first
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'A printer showing offline that was working yesterday',
                  'Wi-Fi that is fine in one room and poor in another',
                  'A machine that is slow but otherwise working normally',
                  'Something that broke immediately after an update',
                  'A device that will not turn on with an untested charger',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 leading-relaxed">
            If you are not sure which column yours belongs in, ring and describe the symptom.
            Working that out over the phone costs nothing and takes a couple of minutes, and it
            is a better use of both our time than a visit that did not need to happen.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading">Still stuck? We come to you</h2>
          <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
            Same-day visits across Greater London, evenings and weekends at the same rate. No
            callout charge, no diagnosis fee, and nothing to pay if we cannot fix it. Software
            problems can often be sorted remotely today without anyone travelling at all.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:07378349222" className="btn-primary inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call 07378 349222
            </a>
            <Link href="/remote-support" className="btn-outline inline-flex items-center gap-2">
              Fix it remotely today <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/repair-costs-london" className="btn-outline inline-flex items-center gap-2">
              See repair costs <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Questions about fixing it yourself</h2>
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
          <h2 className="text-2xl font-bold mb-3">We will tell you when not to bother</h2>
          <p className="text-white/80 leading-relaxed">
            Half the advice on this page is how to avoid paying us. That is deliberate. The jobs
            worth doing are the ones you genuinely cannot do yourself, and being straight about
            which is which is the whole reason people call us back.
          </p>
        </div>
      </section>
    </>
  );
}
