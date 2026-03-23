export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
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

export const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    author_name: 'Sarah T.',
    rating: 5,
    text: 'My MacBook had water damage and I thought it was gone for good. The engineer came out within 2 hours and recovered everything. Absolutely brilliant service.',
    relative_time_description: '2 months ago',
  },
  {
    author_name: 'James K.',
    rating: 5,
    text: 'Cracked MacBook Air screen fixed same day at home. Much cheaper than the Apple Store and done properly. Really happy with the result.',
    relative_time_description: '3 months ago',
  },
  {
    author_name: 'Priya M.',
    rating: 5,
    text: 'Recovered all my photos from a dead hard drive I thought were lost forever. Genuinely over the moon. Would recommend to everyone.',
    relative_time_description: '1 month ago',
  },
  {
    author_name: 'Daniel F.',
    rating: 5,
    text: 'Gaming PC was crashing repeatedly. Fixed in under an hour - turned out to be a faulty RAM stick. Fast, honest and genuinely great value.',
    relative_time_description: '4 months ago',
  },
];

export const FALLBACK_RATING = 5.0;
export const FALLBACK_TOTAL = 47;

export async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'OK') return null;

    const result: PlacesResult = json.result;
    const fiveStars = (result.reviews ?? []).filter((review) => review.rating === 5);

    return {
      reviews: fiveStars,
      rating: result.rating,
      total: result.user_ratings_total,
    };
  } catch {
    return null;
  }
}
