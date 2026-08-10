---
title: Exogradient homepage implementation
status: ready for publication
updated: 2026-08-08
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
| Coffee | Lower right | Third | None while in development |

The composition may change without moving interaction logic between artifacts.

## Code ownership

- `HomepageShowcase.astro` owns composition and responsive order.
- `ArtifactCaption.astro` owns shared title, destination, and status semantics.
- `SplashArtifact.astro` owns only the product embed boundary.
- `WaterFilterArtifact.astro` owns the four mechanism states and selector.
- `CoffeeArtifact.astro` owns the origin-to-roast-to-cup study.
- `src/styles/home.css` owns homepage-scoped tokens and layout.

## Artifact contracts

### Splash of Hue

- Consume the canonical product-owned `https://hue.exogradient.dev/?embed=play`
  surface. A local override is deliberate development configuration only.
- Preserve the real memorize, reconstruct, and reveal loop.
- Keep the full-game link outside the embedded interaction.
- Do not crop, restyle, clone, or replace the game in site code.

### Splash attention prototype

When the measured viewport can provide a materially larger useful stage, the
homepage listens for the product-owned, versioned engagement message emitted
after a completed pointer or keyboard adjustment of Splash's color controls.
It then enlarges the existing iframe without swallowing or interrupting that
gesture. A device label or width-only breakpoint is not sufficient.
The focused state is addressable with `?artifact=splash` and returns through
outside click, deliberate scroll, Escape, or browser Back. The first focus shows
a brief return hint. Escape and wheel intent are also relayed from inside the
cross-origin frame when Splash has no local disclosure to dismiss.

After any dismissal, automatic focus is suppressed for the rest of that page
visit so subsequent gameplay does not fight the visitor's collection intent.
Scroll dismissal preserves direction and advances the page after restoring the
in-flow layout; Escape restores keyboard focus to the Splash frame.

This is a Splash-only hypothesis test, not a universal artifact wrapper. Phone
widths keep the existing in-flow composition, and Water and Coffee retain their
native interactions without focus behavior.

### Countertop Water Filters

- Keep diagram and selector in one connected panel.
- Each option changes the causal mechanism, not only its label.
- Use continuous aqua water, dark contaminants, and a visible
  input–interaction–output relationship in every state.
- Link to `/blog/countertop-water-filters/`.

### Coffee

- Use `From Blossom to Cup` as the visible encounter title. It names the
  literal endpoints shown here without implying a destination, geographic
  traceability, or the superseded Observatory product frame.
- Show the plant's longer cycle through blossom and mixed on-branch ripeness,
  then make the process begin with one visibly selected ripe cherry. Move
  through dry parchment, the hull opening to release a dense green seed, and a
  compact yellow-to-light-medium first-crack progression before an active
  pour-over with a waiting, properly scaled handleless sensory cup. Do not
  invent a literal grinding stage when it cannot be shown clearly.
- Preserve one continuous lifecycle composition across desktop and phone rather
  than substituting a compact crop that erases stages.
- Let natural color relationships, reflected light, and restrained variation
  in the copper's patina carry floral, fruit, caramel, and roast emotion without
  adding a visible band, haze, or claimed tasting result. Ground the physical
  process with believable contact shadows; use warmed rose-copper under the
  roast progression as the integrated heat cue. Directional sunlight may enter
  from the upper-left corner, but its physical illumination must fall away
  after pale parchment drying and before the first green bean so drying and
  roast heat remain distinct causes.
- Present the complete lifecycle as one static color image with unmistakable,
  physically coherent upper-left drying sunlight baked into the artwork. Let
  the still image carry craft and motion through the parchment release,
  first-crack expansion and chaff, wet bloom, faint condensation, one falling
  drop, and a restrained capillary ripple. Do not place an animated spotlight,
  sweep, color filter, particle effect, or simulated liquid layer over it.
- Treat the whole artifact as an instrument, not a false destination. Do not
  imply that the unfinished Coffee product is publicly playable or available.
- Keep Coffee subordinate to the published Splash and Water artifacts through
  its smaller grid position and restrained `In the studio` caption status. The
  phrase communicates active exploration without promising a release path; do
  not add a false action label or decorative status illustration.
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

Verified in this repository on 2026-08-09:

- production build completes;
- desktop and mobile layouts have no horizontal overflow;
- all four filter states update the diagram and pressed state;
- Coffee presents a legible static lifecycle without a false control, motion,
  or outbound link;
- homepage, blog index, and filter editorial routes resolve; and
- reduced-motion and native keyboard behavior remain intact.

The Coffee visual gate additionally requires owner review of the static artwork
at 390×844, 596×1137, and 1280×900, including the visibility and physical
coherence of the upper-left drying sunlight. Automated screenshots are review
evidence, not approval; the visual gate remains unpassed until that explicit
review is recorded against the current source and image hash.

External dependency verified on 2026-08-03:

- the deployed Splash of Hue `?embed=play` surface loads without overflow;
- a guess can be locked in and reaches the score/reveal state; and
- the production build points to the deployed surface rather than a local URL.

## Non-goals

- Labs taxonomy or entity resolution
- Final Coffee product narrative
- New homepage copy or a Splash companion article
- Redesigning Splash inside this repository
