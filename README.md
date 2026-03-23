# Tangents

Personal blog built with [Astro](https://astro.build). Deployed at [on-tangents.vercel.app](https://on-tangents.vercel.app). Posts live in `src/content/blog/` as markdown files.

```sh
bun run dev   # localhost:4321
```

## Features

- **Reader font customization** — Gear icon in the header lets readers set any [Google Font](https://fonts.google.com). Choice persists in localStorage. Default is Lora.
- **RSS feed** at `/rss.xml` via `@astrojs/rss`
- **Sitemap** auto-generated via `@astrojs/sitemap`
- **Image optimization** — automatic resizing and format conversion for post images
