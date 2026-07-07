// Fetches the current Google Places rating/reviews and writes them to
// lib/reviews-snapshot.json, which acts as the fallback the site serves
// whenever the live Places API is unavailable at request time.
//
// Run manually with `npm run refresh:reviews`, or on a schedule (GitHub
// Action / Vercel Cron) so the snapshot never goes too stale. Commit the
// updated lib/reviews-snapshot.json after running.

const fs = require('fs');
const path = require('path');

// This script runs outside Next.js, so .env.local isn't loaded automatically.
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!apiKey || !placeId) {
  console.error('Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID (checked process.env and .env.local).');
  process.exit(1);
}

async function main() {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}`
  );

  if (!res.ok) {
    console.error('Places API request failed:', res.status, await res.text());
    process.exit(1);
  }

  const json = await res.json();
  if (json.status !== 'OK') {
    console.error('Places API returned a non-OK status:', json.status, json.error_message || '');
    process.exit(1);
  }

  const result = json.result;
  const fiveStars = (result.reviews || []).filter((r) => r.rating === 5);

  const snapshot = {
    rating: result.rating,
    total: result.user_ratings_total,
    reviews: fiveStars,
    fetchedAt: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, '..', 'lib', 'reviews-snapshot.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`Snapshot updated: ${snapshot.rating}★ / ${snapshot.total} reviews (${fiveStars.length} five-star reviews saved).`);
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error('Failed to refresh reviews snapshot:', err);
  process.exit(1);
});
