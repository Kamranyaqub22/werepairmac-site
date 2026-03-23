import type { Metadata } from 'next';
import Link from 'next/link';
import { StarIcon, PhoneIcon } from '@/components/Icons';
import { GOOGLE_REVIEW_URL } from '@/lib/googleBusiness';

export const metadata: Metadata = {
  title: 'Leave a Review | We Repair Mac London',
  description: 'Happy with your repair? Leave us a Google review — it takes less than a minute and helps us enormously.',
  alternates: { canonical: 'https://werepairmac.co.uk/review' },
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <section className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Top band */}
          <div className="bg-brand px-8 py-8 text-center">
            <div className="flex justify-center text-amber-400 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <StarIcon key={n} className="w-8 h-8" />
              ))}
            </div>
            <h1 className="text-2xl font-extrabold text-white leading-snug">
              Were you happy with your repair?
            </h1>
            <p className="text-blue-200 text-sm mt-2">
              A quick review on Google makes a huge difference to us — it takes under a minute.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 text-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              We are a small independent business and every review genuinely helps.
              Just click the button below — Google will open directly on your phone or browser.
            </p>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full justify-center py-4 text-base rounded-xl mb-4 flex items-center gap-2"
            >
              {/* Google G icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
              </svg>
              Leave a Google Review
            </a>

            {/* Steps */}
            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">How it works</p>
              {[
                'Click the button above',
                'Sign in to your Google account (or create one — it\'s free)',
                'Select your star rating and write a few words',
                'Hit "Post" — done in under 60 seconds',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Not happy with something? Please call us first on{' '}
              <a href="tel:07378349222" className="text-brand font-medium hover:underline">
                0737 834 9222
              </a>{' '}
              — we will put it right.
            </p>

            <Link href="/" className="text-sm text-gray-400 hover:text-brand transition-colors">
              ← Back to werepairmac.co.uk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
