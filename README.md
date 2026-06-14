# Thumbly — YouTube Thumbnail Tester

A clean, single-file web app for testing how a YouTube thumbnail + title will actually look across every real YouTube surface — **before** you publish.

![Thumbly](https://img.shields.io/badge/status-live-ff3a3a) ![No build](https://img.shields.io/badge/build-none%20required-7b2ff7)

## Features

- **Load your channel** by `@handle`, name, or any `youtube.com` link — auto-grabs your avatar, name & recent uploads. Saved to your device so you only do it once.
- **Live preview, no submit button** — drop in a thumbnail and type a title; everything updates in realtime.
- **Four accurate YouTube views** — Home feed, Watch sidebar, Channel page, and Search results.
- **Compare with other channels** — add competitor handles/links and their real thumbnails fill the feeds next to yours.
- **Channel page** pulls your real uploads so you can see the new thumbnail sitting among them.
- **Light & dark themes** matching YouTube's real palettes.
- **Desktop & mobile** layout toggle.
- **2 MB size warning** (YouTube's upload limit).
- Progress bar + loading states while fetching, raced CORS proxies for speed, and local caching.
- App UI uses **Poppins**; the YouTube replica uses **Roboto** for accuracy.

## Run it

No build step. Just open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How channel data is fetched

There's no official key-less YouTube API, so Thumbly fetches the public channel page to read the avatar/name/description and the channel's RSS feed for recent videos. Thumbnails come straight from `i.ytimg.com`, and Shorts are detected by the aspect ratio of their `oardefault.jpg` thumbnail. Everything runs client-side; nothing is stored on a server.

## Reliable fetching

Out of the box Thumbly races free public CORS proxies, but they're unreliable for **large channels**:

- **corsproxy.io** is US-hosted and returns the real page, but caps responses at ~1 MB — and big channel pages exceed that.
- **allorigins** has no size cap but is EU-hosted, so YouTube serves it the cookie-consent wall, which contains no channel data.

The result: small channels load, large ones (MrBeast, MKBHD, etc.) often fail. The fix is a tiny **Cloudflare Worker** — free, no size cap, and it sends a consent cookie so YouTube returns the full real page (banner, subscriber count and Shorts included).

### Deploy the proxy (free, ~2 minutes)

**Option A — Dashboard**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Create Worker**.
2. Replace the default code with the contents of [`worker.js`](worker.js), then **Deploy**.
3. Copy the worker URL (e.g. `https://thumbly-proxy.yourname.workers.dev`).
4. In Thumbly, open **Change → "Big channels won't load? Add a free proxy"** and paste the URL.

**Option B — Wrangler CLI**
```bash
npm i -g wrangler
wrangler deploy worker.js --name thumbly-proxy
```

Once set, the worker URL is saved to your device and used first for every fetch; the public proxies remain as fallback.

## License

MIT
