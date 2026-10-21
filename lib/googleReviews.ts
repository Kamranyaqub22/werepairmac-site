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
