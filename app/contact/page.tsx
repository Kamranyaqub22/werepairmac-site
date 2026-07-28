import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ShieldCheckIcon } from '@/components/Icons';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Book a Repair in London',
  description:
    'Contact We Repair Mac - call 07378 349222 or email info@werepairmac.co.uk to book a same-day Mac or laptop repair across Greater London. No fix, no fee.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/contact' },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/laptop-repair-hero-unsplash.jpg"
            alt="Contact We Repair Mac"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
            quality={45}
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-blue-100 text-lg">
            Call or email to book a repair. We are available 24/7 — call or book any time.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-5">
              <div className="card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Phone</div>
                  <a href="tel:07378349222" className="text-brand font-semibold text-lg hover:underline">
                    07378 349222
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Available 24/7 — day, night, weekday or weekend</p>
                </div>
              </div>
              <div className="card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center flex-shrink-0">
                  <MailIcon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Email</div>
                  <a href="mailto:info@werepairmac.co.uk" className="text-brand font-semibold hover:underline">
                    info@werepairmac.co.uk
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Usually respond in under 30 minutes</p>
                </div>
              </div>
              <div className="card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Based At</div>
                  <p className="text-gray-600">
                    18, Vincent House<br />
                    Burlington Road<br />
                    New Malden, KT3 4NX
                  </p>
                  <p className="text-sm text-gray-500 mt-1">We come to you - no need to visit us</p>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  <ShieldCheckIcon className="w-5 h-5 text-brand" /> Our Guarantees
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  {['No Fix, No Fee', 'No Callout Charge', 'Same-Day Visits Available', '90-Day Warranty on All Repairs', 'Fixed Quotes - No Hidden Charges'].map((g) => (
                    <li key={g} className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-brand flex-shrink-0" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Request a Callback</h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-heading text-center">What happens after you call</h2>
          <p className="text-gray-500 text-center mt-3 mb-10 max-w-2xl mx-auto text-[15px] leading-relaxed">
            There is no call centre and no ticket queue. You speak to an engineer, describe
            the fault, and get an honest answer about whether it is worth repairing before
            anyone books a visit.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Tell us what it is doing',
                desc: 'The symptoms usually narrow the fault down before we arrive — whether a laptop is dead or just not charging, whether a screen is cracked or the cable behind it has failed. That tells us which parts to bring.',
              },
              {
                step: '2',
                title: 'We quote before we travel',
                desc: 'You get a labour and parts estimate on the call. If the repair is not economical, or the device is better replaced, we will say so — there is no callout charge either way.',
              },
              {
                step: '3',
                title: 'We come to you',
                desc: 'Most repairs are finished on-site while you watch, usually within the hour. Board-level work goes back to the workshop and returns fully tested, with a 90-day warranty either way.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card">
                <div className="w-8 h-8 rounded-full bg-brand text-white font-bold text-sm flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Where we travel</h2>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-4">
            We are based in New Malden and cover every London borough plus the Surrey and
            M25 border. Areas closest to KT3 — Kingston, Wimbledon, Surbiton, Worcester Park,
            Raynes Park and Sutton — are usually same-day. Further out across Greater London
            we will give you a realistic window rather than a vague morning-or-afternoon slot.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-6">
            If the problem turns out to be software rather than hardware, we can often fix it
            the same day over a secure screen-share instead, without anyone travelling at all.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/areas-we-cover" className="btn-outline py-3 px-6 inline-flex items-center gap-2">
              See all areas we cover
            </Link>
            <Link href="/remote-support" className="btn-outline py-3 px-6 inline-flex items-center gap-2">
              Remote support from £49
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
