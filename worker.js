/**
 * Thumbly fetch proxy — a tiny Cloudflare Worker.
 *
 * Why this exists:
 *   Free public CORS proxies either cap responses at ~1MB (YouTube channel pages
 *   are bigger) or are EU-hosted and get served Google's cookie-consent wall,
 *   which contains none of the channel data. This Worker fixes both: no size cap,
 *   and it sends a consent cookie + desktop User-Agent so YouTube returns the
 *   full real page (banner, subscriber count, Shorts and all).
 *
 * Deploy (free, ~2 minutes):
 *   Option A — Dashboard:
 *     1. https://dash.cloudflare.com  →  Workers & Pages  →  Create  →  Create Worker
 *     2. Replace the default code with this file's contents, click Deploy
 *     3. Copy the worker URL (e.g. https://thumbly-proxy.yourname.workers.dev)
 *     4. Paste it into Thumbly's "custom proxy" box (under "Change channel")
 *   Option B — Wrangler CLI:
 *     npm i -g wrangler && wrangler deploy worker.js --name thumbly-proxy
 *
 * Usage:  GET https://your-worker.workers.dev/?url=<encoded target URL>
 */
const ALLOW = /^https:\/\/((www\.|m\.)?youtube\.com|i\.ytimg\.com|yt3\.(ggpht|googleusercontent)\.com)\//;

export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const target = new URL(request.url).searchParams.get('url');
    if (!target) return new Response('Missing ?url=', { status: 400, headers: cors });
    if (!ALLOW.test(target)) return new Response('URL not allowed', { status: 403, headers: cors });

    try {
      const upstream = await fetch(target, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          // bypass the "Before you continue to YouTube" consent wall
          'Cookie': 'SOCS=CAISEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; CONSENT=YES+1; PREF=hl=en&tz=UTC',
        },
        redirect: 'follow',
      });
      const headers = new Headers(cors);
      headers.set('Content-Type', upstream.headers.get('content-type') || 'text/plain; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=1800');
      return new Response(upstream.body, { status: upstream.status, headers });
    } catch (e) {
      return new Response('Proxy error: ' + e, { status: 502, headers: cors });
    }
  },
};
