# Exogradient website

The public Exogradient site, built with Astro and deployed at
[exogradient.dev](https://www.exogradient.dev/).

The homepage is an interactive showcase of Exogradient artifacts. Editorial
pieces remain available under `/blog` and branch from related homepage objects
when appropriate.

## Repository map

- Production homepage: `src/pages/index.astro`
- Editorial content: `src/content/blog/`
- Shared site styling: `src/styles/global.css`
- Homepage implementation: `docs/homepage-implementation.md`
- Cross-project design memory: the separate `exogradient/design-memory`
  repository

The repository directory retains its historical `tangents` name for now. That
directory name is not the product identity and must not leak into public copy,
metadata, deployment configuration, or new documentation.

## Development and verification

```sh
npm run dev
npm run build
```

Astro serves the local site at `http://localhost:4321` by default.

Homepage changes also require desktop and mobile visual checks, keyboard and
reduced-motion testing, and verification that embedded artifacts do not create
nested scrolling. The current publication gate is recorded in the homepage
implementation document.

## Site capabilities

- Reader font customization for editorial pages
- RSS feed at `/rss.xml`
- Generated sitemap
- Astro image optimization
- Vercel Analytics and Speed Insights
