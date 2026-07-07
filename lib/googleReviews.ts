export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
  headline?: string;
}

interface PlacesResult {
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

export interface GoogleReviewsData {
  reviews: GoogleReview[];
  rating: number;
  total: number;
}

// Last known-good response from the Places API, refreshed by
// `npm run refresh:reviews` and committed to the repo. Used whenever the live
// API call fails, so a real (if slightly stale) rating is shown instead of a
// hardcoded placeholder number.
function readSnapshot(): GoogleReviewsData | null {
  try {
    // Lazily required so this never gets pulled into a client bundle.
    const fs = require('fs');
    const path = require('path');
    const raw = fs.readFileSync(path.join(process.cwd(), 'lib', 'reviews-snapshot.json'), 'utf8');
    const snapshot = JSON.parse(raw);
    if (!snapshot.rating || !snapshot.total) return null;
    return { reviews: snapshot.reviews ?? [], rating: snapshot.rating, total: snapshot.total };
  } catch {
    return null;
  }
}

export const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    author_name: 'Sarah T.',
    rating: 5,
    headline: 'Saved My MacBook After Water Damage',
    text: 'My MacBook had water damage and I thought it was gone for good. The engineer came out within 2 hours and recovered everything. Absolutely brilliant service.',
    relative_time_description: '2 months ago',
  },
  {
    author_name: 'James K.',
    rating: 5,
    headline: 'Screen Fixed Same Day at Home',
    text: 'Cracked MacBook Air screen fixed same day at home. Much cheaper than the Apple Store and done properly. Really happy with the result.',
    relative_time_description: '3 months ago',
  },
  {
    author_name: 'Priya M.',
    rating: 5,
    headline: 'All My Photos Recovered',
    text: 'Recovered all my photos from a dead hard drive I thought were lost forever. Genuinely over the moon. Would recommend to everyone.',
    relative_time_description: '1 month ago',
  },
  {
    author_name: 'Daniel F.',
    rating: 5,
    headline: 'Gaming PC Fixed in Under an Hour',
    text: 'Gaming PC was crashing repeatedly. Fixed in under an hour - turned out to be a faulty RAM stick. Fast, honest and genuinely great value.',
    relative_time_description: '4 months ago',
  },
];

export const FALLBACK_RATING = 5.0;
export const FALLBACK_TOTAL = 47;

export async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}`,
        { next: { revalidate: 86400 } }
      );

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'OK') {
          const result: PlacesResult = json.result;
          const fiveStars = (result.reviews ?? []).filter((review) => review.rating === 5);

          return {
            reviews: fiveStars,
            rating: result.rating,
            total: result.user_ratings_total,
          };
        }
      }
    } catch {
      // Fall through to the last known-good snapshot below.
    }
  }

  // Live API unavailable (missing credentials, request failure, quota, etc.) —
  // serve the last genuine snapshot rather than a fabricated placeholder.
  return readSnapshot();
}
