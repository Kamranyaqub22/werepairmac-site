import type { Metadata } from 'next';
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import FAQAccordion from '@/components/FAQAccordion';
import FAQSchema from '@/components/FAQSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { remoteFixables, remoteSteps, REMOTE_SESSION_PRICE } from '@/lib/carePlans';
import { CheckIcon, PhoneIcon, BoltIcon, ShieldCheckIcon, ArrowRightIcon, ComputerDesktopIcon } from '@/components/Icons';

const WHATSAPP = 'https://wa.me/447378349222?text=Hi%2C%20I%27d%20like%20a%20remote%20support%20session';

export const metadata: Metadata = {
  title: 'Remote Computer Support London | Fixed Today from £49 | We Repair Mac',
  description:
    'Get your Mac, laptop or PC fixed remotely today — virus removal, slow speeds, software, email and setup. Secure screen-share, no visit needed. From £49. Call 0737 834 9222.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/remote-support' },
  openGraph: {
    title: 'Remote Computer Support London | From £49 | We Repair Mac',
    description: 'Mac, laptop & PC problems fixed remotely today over a secure screen-share. No visit needed. From £49.',
    url: 'https://www.werepairmac.co.uk/remote-support',
  },
};

const faqs = [
  { q: 'How does remote support work?', a: 'We connect to your computer over a secure, one-time screen-sharing session (with your permission), fix the problem while you watch, then disconnect. Nothing stays installed on your machine afterwards.' },
  { q: 'Is it safe to let you connect?', a: 'Yes. You grant a single session’s access using trusted software, you can see everything we do on your screen, and access ends the moment we disconnect. We never ask for banking passwords.' },
  { q: 'What can’t be fixed remotely?', a: 'Anything physical — cracked screens, batteries, liquid damage, charging ports or dead machines that won’t power on. For those we come to you across Greater London. Remote support is for software, setup and speed issues.' },
  { q: 'How much does it cost?', a: `A standard remote session is £${REMOTE_SESSION_PRICE}, agreed upfront before we start. Larger jobs are quoted first. Care Plan members get remote support included.` },
  { q: 'How do I pay?', a: 'By bank transfer once the work is done — no card needed. Care Plan members pay nothing for included sessions.' },
];

export default function RemoteSupportPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.werepairmac.co.uk' },
          { name: 'Remote Support', url: 'https://www.werepairmac.co.uk/remote-support' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Remote Support · Fixed Today
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Get fixed remotely — today, from £{REMOTE_SESSION_PRICE}
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Software playing up? No need to wait for a visit. We connect over a secure screen-share and fix it live while you watch — most sessions done in under an hour.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:07378349222" className="btn-accent py-3.5 px-8 text-base inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call to start now
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-ghost-white py-3.5 px-6 text-base">
              Start on WhatsApp <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* What we fix remotely */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-heading">What we can fix remotely</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">If it’s software, setup or speed, we can almost certainly sort it without leaving your desk.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {remoteFixables.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <CheckIcon className="w-4 h-4 text-brand flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Physical faults (screens, batteries, liquid damage, no power) need a visit — <Link href="/quote" className="text-brand font-medium">get a quote for an on-site repair</Link>.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="section-heading text-center">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {remoteSteps.map((step, i) => (
              <div key={step.title} className="card">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + trust strip */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Standard remote session</div>
            <div className="text-5xl font-extrabold text-brand mb-2">£{REMOTE_SESSION_PRICE}</div>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">Agreed upfront before we start. Larger jobs quoted first. Pay by bank transfer on completion.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
              <span className="inline-flex items-center gap-1.5"><BoltIcon className="w-4 h-4 text-brand" /> Usually same day</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-brand" /> Secure & watched by you</span>
              <span className="inline-flex items-center gap-1.5"><ComputerDesktopIcon className="w-4 h-4 text-brand" /> Nothing left installed</span>
            </div>
            <a href="tel:07378349222" className="btn-primary py-3.5 px-8 text-base inline-flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Call 0737 834 9222
            </a>
          </div>

          {/* Care plan cross-sell */}
          <div className="mt-6 rounded-2xl bg-brand/5 border border-brand/15 p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Need help often? Get it included.</h3>
              <p className="text-sm text-gray-600 mt-1">Care Plan members get remote support included plus monitoring, antivirus and discounted repairs — from £9.99/mo.</p>
            </div>
            <Link href="/care-plans" className="btn-outline py-3 px-6 whitespace-nowrap">
              See care plans <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-heading text-center">Remote support FAQs</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
      <FAQSchema items={faqs} />
    </>
  );
}
