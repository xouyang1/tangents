---
title: Exogradient homepage implementation contract
status: active
updated: 2026-08-02
owner: Exogradient site
---

# Exogradient homepage implementation contract

This document translates settled cross-project decisions into code boundaries
for the production Astro site. It does not redefine the design; canonical
rationale lives in `exogradient/design-memory`.

## Production target

Replace the current text-led `src/pages/index.astro` with the mixed interactive
showcase. Port the behavior and composition from the validated prototype into
maintainable components; do not copy the temporary HTML wholesale.

## Current composition

Desktop:

- Splash of Hue is the dominant left artifact.
- Countertop Water Filters is upper-right.
- Coffee Auction Observatory is lower-right.

Mobile reading order is Splash, Filters, Coffee. This composition is
provisional and should remain easy to change without rewriting artifact logic.

## Component ownership

Suggested site-owned boundaries:

- `HomepageShowcase.astro` — composition and responsive order only.
- `ArtifactFrame.astro` — shared title/destination/status semantics, not a
  forced universal visual container.
- `WaterFilterObject.astro` — four mechanism states and their selector.
- `CoffeeAuctionObject.astro` — current development-state observatory object.
- `SplashEmbed.astro` — integration wrapper for the product-owned miniature.

Names may change during implementation; ownership must not.

## Artifact contracts

### Splash of Hue

- Load the canonical product-owned `?embed=play` surface.
- Preserve the real memorize, reconstruct, and reveal loop.
- Do not reproduce the game as static tabs, a color-changing decoration, or a
  site-owned simulation.
- Keep the external full-game affordance outside the embedded gameplay area.

### Countertop Water Filters

- Render as one connected panel containing diagram and selector.
- The four options change the causal mechanism, not only labels.
- Preserve the visual grammar documented in the design memory: continuous aqua
  water, dark contaminants, and input–interaction–output in every state.
- Link the artifact to `/blog/countertop-water-filters/`.

### Coffee Auction Observatory

- Preserve the current rotating-lot/auction signal as exploratory, not final
  product definition.
- Use a non-link development-state affordance with an accessible label.
- Do not expose placeholder navigation or visible status prose.

## Site-shell boundary

The homepage may bypass the editorial Header, Footer, constrained `main` width,
and reader-font controls when those interfere with the showcase. Blog routes
continue to use the editorial shell and its existing identity.

Homepage-specific tokens should be scoped to the showcase rather than changing
article typography globally.

## Responsive and accessibility gates

- No nested iframe scrollbar or horizontal selector strip.
- No clipped controls at 390×844 or similarly narrow/tall mobile viewports.
- Titles remain spatially coupled to their artifacts.
- All controls are keyboard reachable with visible focus.
- Status and diagram meaning are available to assistive technology without
  adding visible explanatory clutter.
- Respect `prefers-reduced-motion`; no meaning depends on animation alone.
- Touch targets remain usable without inflating text or panel chrome.

## Verification matrix

Before treating the port as reviewable:

1. run `npm run build`;
2. inspect desktop and mobile screenshots;
3. exercise all four filter states;
4. complete one Splash miniature round;
5. verify the full-game and filter-editorial destinations;
6. verify Coffee is not exposed as a link;
7. test keyboard-only operation and reduced motion; and
8. confirm the blog index and water-filter article are visually unchanged.

## Out of scope for the first port

- final Exogradient palette or identity system;
- a Labs taxonomy;
- entity resolution;
- the final Coffee Auction Observatory narrative;
- new homepage copy or a companion Splash blog post; and
- redesigning Splash beyond the product-owned embed adaptation.
