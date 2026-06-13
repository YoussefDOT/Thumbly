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

There's no official key-less YouTube API, so Thumbly fetches the public channel page (via raced CORS proxies) to read the avatar/name and the channel's RSS feed for recent videos. Thumbnails come straight from `i.ytimg.com`. Everything runs client-side; nothing is stored on a server.

## License

MIT
