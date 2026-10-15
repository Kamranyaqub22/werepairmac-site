/**
 * Read-only Google Search Console access for werepairmac.co.uk.
 *
 *   node scripts/gsc.mjs sites
 *   node scripts/gsc.mjs queries        [--days 28] [--limit 50]
 *   node scripts/gsc.mjs pages          [--days 28] [--limit 50]
 *   node scripts/gsc.mjs opportunities  [--days 90] [--min-impressions 20]
 *   node scripts/gsc.mjs inspect <url>
 *   node scripts/gsc.mjs sitemaps
 *   node scripts/gsc.mjs sitemap-submit <sitemap url>   (needs Full permission)
 *   node scripts/gsc.mjs sitemap-delete <sitemap url>   (needs Full permission)
 *   Any command also takes --site <property> and --json.
 *
 * Credentials: a Google Cloud service account that has been added as a user
 * (Restricted is enough) on the Search Console property. Supply its JSON key as
 *   GSC_SERVICE_ACCOUNT_JSON  — the whole key file's contents, or
 *   GSC_SERVICE_ACCOUNT_FILE  — a path to it (never inside this repo).
 *
 * No dependencies: the service-account JWT is signed with node:crypto and the
 * REST endpoints are called with fetch. The scope is read-only, so this cannot
 * change anything in Search Console — except the two sitemap commands above.
 */
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Read-only unless the command changes something (sitemap submit/delete),
// which also needs the service account to hold Full permission on the property.
const READ_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const WRITE_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const API = 'https://searchconsole.googleapis.com';
const DOMAIN = 'werepairmac.co.uk';
// Performance data lags by about two days; ending the range earlier avoids
// reporting a falsely empty last day.
const LAG_DAYS = 2;

/* ------------------------------------------------------------ args --- */

const [command, ...rest] = process.argv.slice(2);
const SCOPE = ['sitemap-submit', 'sitemap-delete'].includes(command) ? WRITE_SCOPE : READ_SCOPE;
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) {
    const key = rest[i].slice(2);
    const next = rest[i + 1];
    if (next === undefined || next.startsWith('--')) flags[key] = true;
    else flags[key] = rest[++i];
  } else positional.push(rest[i]);
}

/* ------------------------------------------------------------ auth --- */

function loadKey() {
  const raw =
    process.env.GSC_SERVICE_ACCOUNT_JSON ||
    (process.env.GSC_SERVICE_ACCOUNT_FILE && readFileSync(process.env.GSC_SERVICE_ACCOUNT_FILE, 'utf8'));
  if (!raw) {
    fail(
      'No credentials. Set GSC_SERVICE_ACCOUNT_JSON (the key file contents) or GSC_SERVICE_ACCOUNT_FILE (its path).'
    );
  }
  let key;
  try {
    key = JSON.parse(raw);
  } catch {
    fail('GSC_SERVICE_ACCOUNT_JSON is not valid JSON — paste the whole key file, including the braces.');
  }
  if (!key.client_email || !key.private_key) fail('That JSON is not a service-account key (no client_email/private_key).');
  return key;
}

const b64url = (input) => Buffer.from(input).toString('base64url');

async function accessToken() {
  const key = loadKey();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key.private_key, 'base64url')}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const body = await res.json();
  if (!res.ok) fail(`Google refused the key: ${body.error_description || body.error || res.status}`);
  return { token: body.access_token, email: key.client_email };
}

/* ------------------------------------------------------------- api --- */

let auth;
async function call(path, { method = 'GET', body } = {}) {
  auth ??= await accessToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${auth.token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    /* empty or non-JSON body, e.g. a successful DELETE */
  }
  if (!res.ok) {
    const msg = data.error?.message || `HTTP ${res.status}`;
    if (res.status === 403) {
      fail(
        `${msg}\nAdd ${auth.email} as a user on the property in Search Console (Settings → Users and permissions), and check the Search Console API is enabled for the Google Cloud project.`
      );
    }
    fail(msg);
  }
  return data;
}

async function listSites() {
  const data = await call('/webmasters/v3/sites');
  return (data.siteEntry ?? []).filter((s) => s.permissionLevel !== 'siteUnverifiedUser');
}

/** The property to query: --site, else the Domain property, else the www URL-prefix one. */
async function resolveSite() {
  if (typeof flags.site === 'string') return flags.site;
  const sites = await listSites();
  const ours = sites.map((s) => s.siteUrl).filter((u) => u.includes(DOMAIN));
  const pick = ours.find((u) => u.startsWith('sc-domain:')) ?? ours.find((u) => u.includes('www.')) ?? ours[0];
  if (!pick) {
    fail(
      `The service account can't see any ${DOMAIN} property. Add ${auth.email} in Search Console → Settings → Users and permissions.`
    );
  }
  return pick;
}

const sitePath = (site) => `/webmasters/v3/sites/${encodeURIComponent(site)}`;

function dateRange(days) {
  const end = new Date(Date.now() - LAG_DAYS * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { startDate: iso(start), endDate: iso(end) };
}

async function analytics(site, dimension, days, limit) {
  const range = dateRange(days);
  const data = await call(`${sitePath(site)}/searchAnalytics/query`, {
    method: 'POST',
    body: { ...range, dimensions: [dimension], rowLimit: limit, dataState: 'final' },
  });
  return {
    range,
    rows: (data.rows ?? []).map((r) => ({
      [dimension]: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Number((r.ctr * 100).toFixed(1)),
      position: Number(r.position.toFixed(1)),
    })),
  };
}

/* ---------------------------------------------------------- output --- */

function fail(message) {
  console.error(message);
  process.exit(1);
}

function print(title, rows, extra = {}) {
  if (flags.json) {
    console.log(JSON.stringify({ title, ...extra, rows }, null, 2));
    return;
  }
  console.log(`\n${title}`);
  for (const [k, v] of Object.entries(extra)) console.log(`${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
  if (!rows.length) {
    console.log('(no rows)');
    return;
  }
  console.table(rows);
}

/* -------------------------------------------------------- commands --- */

const days = Number(flags.days) || 28;
const limit = Number(flags.limit) || 50;

switch (command) {
  case 'sites': {
    print('Properties this key can read', await listSites());
    break;
  }
  case 'queries':
  case 'pages': {
    const site = await resolveSite();
    const dim = command === 'queries' ? 'query' : 'page';
    const { range, rows } = await analytics(site, dim, days, limit);
    print(`Top ${command} by clicks`, rows, { site, range });
    break;
  }
  case 'opportunities': {
    // Queries Google already ranks on page one-ish to page two: a better page,
    // title or internal link moves these more cheaply than anything new.
    const site = await resolveSite();
    const min = Number(flags['min-impressions']) || 20;
    const { range, rows } = await analytics(site, 'query', Number(flags.days) || 90, 1000);
    const near = rows
      .filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= min)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, limit);
    print('Near-miss queries (position 4–20)', near, { site, range, minImpressions: min });
    break;
  }
  case 'inspect': {
    const url = positional[0];
    if (!url) fail('Usage: node scripts/gsc.mjs inspect <full page URL>');
    const site = await resolveSite();
    const data = await call('/v1/urlInspection/index:inspect', {
      method: 'POST',
      body: { inspectionUrl: url, siteUrl: site },
    });
    const r = data.inspectionResult?.indexStatusResult ?? {};
    print('URL inspection', [
      {
        verdict: r.verdict,
        coverage: r.coverageState,
        indexing: r.indexingState,
        lastCrawl: r.lastCrawlTime,
        googleCanonical: r.googleCanonical,
        userCanonical: r.userCanonical,
      },
    ], { url, site });
    break;
  }
  case 'sitemaps': {
    const site = await resolveSite();
    const data = await call(`${sitePath(site)}/sitemaps`);
    print(
      'Sitemaps',
      (data.sitemap ?? []).map((s) => ({
        path: s.path,
        lastDownloaded: s.lastDownloaded,
        errors: Number(s.errors ?? 0),
        warnings: Number(s.warnings ?? 0),
        submitted: s.contents?.reduce((n, c) => n + Number(c.submitted ?? 0), 0) ?? 0,
      })),
      { site }
    );
    break;
  }
  case 'sitemap-submit':
  case 'sitemap-delete': {
    const feed = positional[0];
    if (!feed) fail(`Usage: node scripts/gsc.mjs ${command} <full sitemap URL>`);
    const site = await resolveSite();
    await call(`${sitePath(site)}/sitemaps/${encodeURIComponent(feed)}`, {
      method: command === 'sitemap-submit' ? 'PUT' : 'DELETE',
    });
    console.log(`${command === 'sitemap-submit' ? 'Submitted' : 'Removed'} ${feed} on ${site}.`);
    break;
  }
  default:
    fail('Commands: sites | queries | pages | opportunities | inspect <url> | sitemaps | sitemap-submit <url> | sitemap-delete <url>   (options: --days --limit --site --json)');
}
