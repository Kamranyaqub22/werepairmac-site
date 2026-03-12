import type { Metadata } from 'next';
import Image from 'next/image';
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ShieldCheckIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Contact We Repair Mac | Book a Repair in London',
  description:
    'Contact We Repair Mac — call 0737 834 9222 or email info@werepairmac.co.uk to book a same-day Mac or laptop repair across Greater London. No fix, no fee.',
  alternates: { canonical: 'https://werepairmac.co.uk/contact' },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&auto=format&fit=crop&q=60"
            alt="Contact We Repair Mac"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-blue-100 text-lg">
            Call or email to book a repair. We respond within 30 minutes during working hours.
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
                    0737 834 9222
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Mon–Fri 8am–8pm · Sat–Sun 9am–6pm</p>
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
                  <p className="text-sm text-gray-500 mt-1">We come to you — no need to visit us</p>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  <ShieldCheckIcon className="w-5 h-5 text-brand" /> Our Guarantees
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  {['No Fix, No Fee', 'No Callout Charge', 'Same-Day Visits Available', '90-Day Warranty on All Repairs', 'Fixed Quotes — No Hidden Charges'].map((g) => (
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
              <form
                action="mailto:info@werepairmac.co.uk"
                method="get"
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Smith"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="07700 900000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device &amp; Fault *</label>
                  <input
                    type="text"
                    name="device"
                    required
                    placeholder="e.g. MacBook Pro 2021 — cracked screen"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Area / Postcode *</label>
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="e.g. Kingston, KT1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                  <textarea
                    name="body"
                    rows={4}
                    placeholder="Any other information about the fault..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  Send Request →
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Or call directly: <a href="tel:07378349222" className="text-brand font-semibold">0737 834 9222</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
