# Exogradient website

The public Exogradient site, built with Astro and deployed at
[exogradient.dev](https://www.exogradient.dev/).

The homepage is an interactive showcase of Exogradient artifacts. Editorial
pieces remain available under `/blog` and branch from related homepage objects
when appropriate.

## Current implementation boundary

- Production homepage: `src/pages/index.astro`
- Editorial content: `src/content/blog/`
- Shared site styling: `src/styles/global.css`
- Canonical cross-project decisions: the `exogradient/design-memory` repository
- Homepage implementation contract: `docs/homepage-implementation.md`

The repository directory retains its historical `tangents` name for now. That
directory name is not the product identity and must not leak into public copy,
metadata, deployment configuration, or new documentation.

## Development

```sh
npm run dev
```

Astro serves the local site at `http://localhost:4321` by default.

## Verification

```sh
npm run build
```

Homepage changes also require visual checks at desktop and mobile viewports,
keyboard testing, reduced-motion testing, and verification that embedded
artifacts do not create nested scrolling.

## Existing site features

- Reader font customization for editorial pages
- RSS feed at `/rss.xml`
- Generated sitemap
- Astro image optimization
- Vercel Analytics and Speed Insights
