import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How We Repair Mac collects, uses and protects your personal data under UK GDPR. Contact, booking, analytics and your data rights explained.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
          <p>
            This policy explains how <strong>We Repair Mac</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects and uses your personal information when you use our website
            or book a repair. We are the data controller for the information you
            provide, and we handle it in line with UK GDPR and the Data
            Protection Act 2018.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Who we are</h2>
          <p>
            We Repair Mac, 18 Vincent House, Burlington Road, New Malden, KT3 4NX.
            You can reach us on{' '}
            <a href="tel:07378349222" className="text-brand font-semibold">07378 349222</a>{' '}
            or{' '}
            <a href="mailto:info@werepairmac.co.uk" className="text-brand font-semibold">info@werepairmac.co.uk</a>.
          </p>

          <h2 className="text-xl font-bold text-gray-900">What we collect</h2>
          <ul>
            <li><strong>Contact &amp; booking details</strong> — your name, phone number, email, address/postcode and a description of your device fault, when you use our quote or contact form, WhatsApp, phone or email.</li>
            <li><strong>Usage data</strong> — if you accept analytics cookies, Google Analytics collects anonymised information about how you use the site (pages viewed, approximate location, device type).</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">How we use it</h2>
          <ul>
            <li>To respond to your enquiry, provide a quote and arrange a repair visit.</li>
            <li>To carry out the repair and provide warranty support afterwards.</li>
            <li>To understand and improve how the website performs (only with your consent).</li>
          </ul>
          <p>
            Our lawful bases are <strong>your consent</strong> (analytics cookies) and
            our <strong>legitimate interest / performance of a contract</strong>
            (responding to enquiries and carrying out repairs you request).
          </p>

          <h2 className="text-xl font-bold text-gray-900">Who we share it with</h2>
          <p>
            We do not sell your data. We use a small number of trusted service
            providers to run the site and business: our email provider (to
            receive and reply to enquiries), Google Analytics (website usage, only
            if you consent) and WhatsApp (if you choose to message us there). Each
            processes data on our behalf under their own privacy terms.
          </p>

          <h2 className="text-xl font-bold text-gray-900">How long we keep it</h2>
          <p>
            We keep enquiry and repair records only as long as needed to provide
            the service, honour the 90-day warranty and meet our legal and
            accounting obligations, then delete them.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Your rights</h2>
          <p>
            Under UK GDPR you can ask us to access, correct or delete your
            personal data, or object to how we use it. To exercise any of these
            rights, email{' '}
            <a href="mailto:info@werepairmac.co.uk" className="text-brand font-semibold">info@werepairmac.co.uk</a>.
            You also have the right to complain to the Information Commissioner&apos;s
            Office (ICO) at ico.org.uk.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Cookies</h2>
          <p>
            For details of the cookies we use and how to control them, see our{' '}
            <Link href="/cookies" className="text-brand font-semibold">Cookie Policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
