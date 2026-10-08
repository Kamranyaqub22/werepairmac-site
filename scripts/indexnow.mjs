/**
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver) that URLs changed.
 *
 *   node scripts/indexnow.mjs https://www.werepairmac.co.uk/blog/some-post [...]
 *
 * Bing is the one that matters: ChatGPT search and Copilot read its index, and
 * an IndexNow ping gets a new post crawled in hours instead of whenever Bing
 * next gets round to the sitemap. Google does not support IndexNow — it picks
 * new posts up from the sitemap's lastmod and the links from service pages.
 *
 * Run it only AFTER the deploy is live. The key file must be reachable at
 * KEY_LOCATION or the submission is rejected, and a URL pinged before it exists
 * gets crawled as a 404.
 */
const HOST = 'www.werepairmac.co.uk';
const KEY = '88d4d725b87f161da18bb977c0f6aaa6';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Usage: node scripts/indexnow.mjs <url> [url ...]');
  process.exit(1);
}
const foreign = urls.filter((u) => new URL(u).host !== HOST);
if (foreign.length) {
  console.error(`Not on ${HOST}: ${foreign.join(', ')}`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});

// 200 and 202 are both success; 202 means accepted but the key is still being verified.
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
