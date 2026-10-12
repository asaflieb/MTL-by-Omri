// ─── 365scores client: fetch + retry + in-memory TTL cache ───────
const BASE    = 'https://webws.365scores.com';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };
const COMMON  = 'appTypeId=5&langId=2';

const MACCABI_ID = 566; // מכבי תל אביב
const LEAGUE_ID  = 42;  // ליגת העל

const TTL = {
  short: 2 * 60 * 1000,   // fixtures / live data
  medium: 10 * 60 * 1000, // standings, squad, results
  long: 24 * 60 * 60 * 1000, // finished games never change
};

const cache    = new Map(); // key → { at, ttl, data }
const inflight = new Map(); // key → Promise (dedupe concurrent requests)

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchJson(pathAndQuery, { retries = 2, timeoutMs = 10000 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(BASE + pathAndQuery, {
        headers: HEADERS,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!r.ok) throw new Error(`365scores ${r.status}`);
      return await r.json();
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await sleep(500 * (attempt + 1));
    }
  }
  throw lastErr;
}

// GET /web/<path>?appTypeId=5&langId=2&<query>, cached for `ttl` ms.
// `path` may also be a full paging URL returned by the API (starts with /web/).
async function get365(path, query = '', ttl = TTL.medium) {
  const url = path.startsWith('/web/')
    ? path
    : `/web/${path}/?${COMMON}${query ? '&' + query : ''}`;

  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < hit.ttl) return hit.data;
  if (inflight.has(url)) return inflight.get(url);

  const p = fetchJson(url)
    .then(data => {
      cache.set(url, { at: Date.now(), ttl, data });
      return data;
    })
    .catch(e => {
      // Serve stale data rather than failing if we have any
      if (hit) return hit.data;
      throw e;
    })
    .finally(() => inflight.delete(url));

  inflight.set(url, p);
  return p;
}

// ─── Image URLs ──────────────────────────────────────────────────
// No default image → missing photos return 404 so the frontend fallback kicks in
const IMG = 'https://imagecache.365scores.com/image/upload/f_png,w_100,h_100,c_limit,q_auto:eco';
const athleteImage    = id => `${IMG}/Athletes/${id}`;
const competitorImage = id => `${IMG}/Competitors/${id}`;

module.exports = { get365, TTL, MACCABI_ID, LEAGUE_ID, athleteImage, competitorImage };
