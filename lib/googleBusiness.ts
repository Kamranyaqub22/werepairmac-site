export const GOOGLE_PLACE_ID = 'ChIJw5ByVHEJdkgRUdKAOadEHgA';

export const GOOGLE_BUSINESS_NAME = 'We Repair Mac';

export const GOOGLE_REVIEW_URL =
  `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

export const GOOGLE_BUSINESS_LISTING_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_BUSINESS_NAME)}&query_place_id=${GOOGLE_PLACE_ID}`;
