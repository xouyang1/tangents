---
title: Exogradient homepage implementation
status: ready for publication
updated: 2026-08-03
owner: Exogradient site
---

# Homepage implementation

This record describes the production boundary in this repository. Design
rationale and reusable principles belong in `exogradient/design-memory`.
Temporary prototype HTML is reference material, not production source.

## Current composition

| Artifact | Desktop | Mobile | Destination |
| --- | --- | --- | --- |
| Splash of Hue | Dominant left | First | Product-owned full game |
| Countertop Water Filters | Upper right | Second | Filter editorial |
| Coffee Auction Observatory | Lower right | Third | None while in development |

The composition may change without moving interaction logic between artifacts.

## Code ownership

- `HomepageShowcase.astro` owns composition and responsive order.
- `ArtifactCaption.astro` owns shared title, destination, and status semantics.
- `SplashArtifact.astro` owns only the product embed boundary.
- `WaterFilterArtifact.astro` owns the four mechanism states and selector.
- `CoffeeAuctionArtifact.astro` owns the exploratory auction object.
- `src/styles/home.css` owns homepage-scoped tokens and layout.

## Artifact contracts

### Splash of Hue

- Consume the product-owned `?embed=play` surface.
- Preserve the real memorize, reconstruct, and reveal loop.
- Keep the full-game link outside the embedded interaction.
- Do not crop, restyle, clone, or replace the game in site code.

### Countertop Water Filters

- Keep diagram and selector in one connected panel.
- Each option changes the causal mechanism, not only its label.
- Use continuous aqua water, dark contaminants, and a visible
  input–interaction–output relationship in every state.
- Link to `/blog/countertop-water-filters/`.

### Coffee Auction Observatory

- Treat the rotating-lot signal as exploratory product language.
- Show development state without visible status prose.
- Do not expose a link until a real destination exists.

## Editorial handoff

The homepage object is an invitation into the Countertop Water Filters article;
it is not the article's opening thesis. Preserve the article's infrastructure
hero and systems-level framing. Do not replace them with the filter mechanism
merely to manufacture visual continuity.

The article comparison may bleed to the viewport edge, but it must remain
inside the viewport at every breakpoint. Editorial depth and evidence take
precedence over making the article resemble a product page.

## Site and accessibility boundaries

- The homepage bypasses the editorial header, footer, reader controls, and
  constrained prose width.
- Blog routes retain their editorial shell.
- Homepage tokens must not alter article typography globally.
- Controls remain keyboard reachable with visible focus.
- Diagram meaning remains available to assistive technology.
- Motion respects `prefers-reduced-motion` and carries no exclusive meaning.
- Mobile layouts use no horizontal selector or nested iframe scrolling.

## Publication state

Verified in this repository on 2026-08-03:

- production build completes;
- desktop and mobile layouts have no horizontal overflow;
- all four filter states update the diagram and pressed state;
- Coffee cycles records and has no false outbound link;
- homepage, blog index, and filter editorial routes resolve; and
- reduced-motion and native keyboard behavior remain intact.

External dependency verified on 2026-08-03:

- the deployed Splash of Hue `?embed=play` surface loads without overflow;
- a guess can be locked in and reaches the score/reveal state; and
- the production build points to the deployed surface rather than a local URL.

## Non-goals

- Labs taxonomy or entity resolution
- Final Coffee Auction Observatory narrative
- New homepage copy or a Splash companion article
- Redesigning Splash inside this repository
