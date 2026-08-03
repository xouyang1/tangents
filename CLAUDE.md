# Exogradient site — agent guidance

Astro 6 static site. Use npm scripts from `package.json`. Posts are Markdown or
MDX files in `src/content/blog/` with Zod-validated frontmatter in
`src/content.config.ts`.

## Sources of truth

- Cross-project design decisions and principles: `exogradient/design-memory`
- Homepage implementation contract: `docs/homepage-implementation.md`
- Tangents editorial styling only: `design-identity.md`
- Splash gameplay and embed behavior: the `splash-of-hue` repository

Do not revive old homepage copy, a blog-first gateway, the Labs taxonomy, or
entity resolution as inventory. Do not treat temporary prototype files as
production source.

## Homepage implementation

- Build the composition as Astro components in this repository.
- Keep Countertop Water Filters and Coffee Auction Observatory native to the
  site.
- Consume Splash through its product-owned embed surface; do not crop or clone
  the game UI in site code.
- Preserve honest readiness: Coffee has no false outbound link while its
  product destination is unavailable.
- Keep artifact controls and visuals coupled, including on mobile.
- Avoid nested scrolling, horizontally scrolling selectors, and decorative
  boundaries without a semantic role.

## Verification

After UI changes, run `npm run build` and verify visually in a real browser at
desktop and mobile sizes. Exercise every interactive state, keyboard focus,
reduced motion, outbound destinations, and the Splash embed. Do not rely on
HTML inspection alone.
