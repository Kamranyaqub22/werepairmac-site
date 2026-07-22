import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies We Repair Mac uses, why we use them, and how to accept, decline or change your choice. Analytics cookies are opt-in.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/cookies' },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Cookie Policy</h1>
          <p className="text-blue-100">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
          <p>
            Cookies are small text files stored on your device when you visit a
            website. This page explains which cookies <strong>We Repair Mac</strong> uses
            and how you can control them.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Cookies we use</h2>

          <h3 className="text-lg font-bold text-gray-900">Essential</h3>
          <p>
            A single preference stored on your device (in your browser&apos;s local
            storage) remembers whether you accepted or declined analytics cookies,
            so we don&apos;t ask you again on every visit. This is required for the
            site to respect your choice and cannot be turned off.
          </p>

          <h3 className="text-lg font-bold text-gray-900">Analytics (optional, off by default)</h3>
          <p>
            If you click <strong>Accept</strong> on our cookie banner, we load
            <strong> Google Analytics 4</strong> and <strong>Microsoft Clarity</strong>,
            which set cookies to measure how visitors use the site — for example
            which pages are viewed, how people arrive, and where they click. This
            helps us improve the site. We do <strong>not</strong> load these tools,
            and no analytics cookies are set, unless you accept.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Managing your choice</h2>
          <p>
            When you first visit, our banner lets you accept or decline analytics
            cookies. To change your decision later, clear this site&apos;s data in your
            browser settings — the banner will appear again on your next visit so
            you can choose afresh. You can also block or delete cookies entirely
            through your browser settings at any time.
          </p>

          <h2 className="text-xl font-bold text-gray-900">More information</h2>
          <p>
            For how we handle your personal data more broadly, see our{' '}
            <Link href="/privacy" className="text-brand font-semibold">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
