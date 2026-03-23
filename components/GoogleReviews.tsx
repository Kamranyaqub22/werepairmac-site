import { StarIcon } from '@/components/Icons';
import {
  FALLBACK_RATING,
  FALLBACK_REVIEWS,
  FALLBACK_TOTAL,
  GoogleReview,
  fetchGoogleReviews,
} from '@/lib/googleReviews';
import { GOOGLE_BUSINESS_LISTING_URL, GOOGLE_REVIEW_URL } from '@/lib/googleBusiness';

function StarRow({ count, size = 'w-4 h-4' }: { count: number; size?: string }) {
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`${size} ${i < count ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default async function GoogleReviews() {
  const data = await fetchGoogleReviews();

  const reviews: GoogleReview[] = data?.reviews?.length ? data.reviews : FALLBACK_REVIEWS;
  const rating = data?.rating ?? FALLBACK_RATING;
  const total = data?.total ?? FALLBACK_TOTAL;
  const isLive = !!data;

  return (
    <section className="py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="section-heading">What our customers say</h2>
            {total && (
              <p className="text-sm text-gray-400 mt-1">Based on {total} Google reviews</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StarRow count={5} size="w-5 h-5" />
            <div className="text-sm">
              <span className="font-bold text-gray-900 text-base">{rating.toFixed(1)}</span>
              <span className="text-gray-400"> · Google Reviews</span>
            </div>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand font-semibold underline decoration-dotted hover:text-brand/70 transition-colors"
            >
              Leave a review
            </a>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.slice(0, 4).map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                {r.profile_photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={r.profile_photo_url}
                    alt={r.author_name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm flex-shrink-0">
                    {r.author_name[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{r.author_name}</div>
                  <div className="text-xs text-gray-400">{r.relative_time_description}</div>
                </div>
                {/* Google G logo */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 ml-auto flex-shrink-0" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>

              <StarRow count={r.rating} />

              <p className="text-sm text-gray-600 leading-relaxed mt-3 flex-1">
                &ldquo;{r.text.length > 200 ? r.text.slice(0, 200).trimEnd() + '…' : r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {!isLive && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Live Google reviews will appear automatically once the Places API credentials are configured.
          </p>
        )}

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <a
            href={GOOGLE_BUSINESS_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand font-semibold hover:underline"
          >
            See all reviews on Google
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
