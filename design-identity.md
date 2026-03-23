<!-- What: Visual identity spec for Tangents blog — palette, influences, design principles, component usage.
     Where else: CSS variables live in src/styles/global.css; component-level styles in src/components/.
     Stability: Living document — update when the palette or design direction changes.
     Last reviewed: 2026-03-22 -->

# Tangents — Design Identity

Nickname: **Field Notes**

---

## Influences

**Maggie Appleton** — Confident use of color as editorial voice. Opinionated palettes that signal a point of view rather than defaulting to safe neutrals. From her work we take the conviction that a research-oriented site should *look* like it has opinions, not like a template.

**Frank Chimero** — Editorial restraint and quiet authority. Typography and whitespace do the heavy lifting; color is structural, not decorative. From his work we take the discipline of using accent color sparingly — for wayfinding, not atmosphere.

The synthesis: a palette that is precise and opinionated (Appleton) but deployed with restraint (Chimero). Color marks structure and interaction; everything else stays neutral.

---

## Palette

| Role | Value | CSS variable | Usage |
|------|-------|-------------|-------|
| Background | `#ffffff` | — (set on `body`) | Page background, header, footer. Pure white — the Chimero influence. The background disappears entirely, letting typography and teal accent do the work. Restraint as design choice. |
| Text | `#1c1917` | `--black`, `--gray-dark` | Body text, headings. Stone-900: warm enough to feel human, dark enough for crisp reading. |
| Accent | `#0f766e` | `--accent` | Links, active nav, blockquote border, buttons. Teal-700: reads as precision and depth — the color of engineering diagrams and technical notation. Confident without being loud. |
| Accent dark | `#115e59` | `--accent-dark` | Hover states. Teal-800: deepens on interaction, giving links a tactile feel. |
| Secondary | `#b45309` | `--secondary` | Data callouts, emphasis, rare highlights. Amber-700: the warm pen marking up a cool notebook. Creates dimensional tension with teal — cool precision meets warm annotation. |
| Gray | `#78716c` | `--gray` | Dates, captions, muted text. Stone-500: warm gray that bridges the cool accent and warm text tones. |
| Gray light | `#e7e5e4` | `--gray-light` | Borders, dividers, inline code background. Stone-200. |

### How the colors relate

The palette operates on a cool/warm axis. Teal accent is the primary structural color — it marks everything interactive or navigational. Amber secondary is its complement, reserved for moments that need to *interrupt* the reader (callouts, data emphasis). The warm stone grays mediate between these two temperatures, keeping the neutral space cohesive. Background and text are both stone-family, so the page reads as a unified surface that the accent colors punctuate.

---

## Design principles

1. **Readability first.** Large serif body text, generous line height, constrained width. The palette and layout should disappear behind the writing.
2. **Restraint in color.** Teal is used sparingly — links, borders, active states. Most of the page is neutral. The secondary amber is rarer still.
3. **No decoration for decoration's sake.** No gradients, shadows (except Settings panel), or ornamental elements.
4. **Precision over personality.** The visual language signals methodical research and data-driven analysis. Every color choice should feel deliberate, not playful.
5. **Content-first hierarchy.** Color serves wayfinding (where can I click? what's active?) not mood. If removing an accent color would make the page harder to *use*, it belongs. If removing it would only make the page less *pretty*, it doesn't.

---

## Component patterns

**Header** — Teal `border-top: 3px solid var(--accent)`. Background matches page (`#fafaf9`). Active nav link gets a teal bottom border. The top border is the strongest color signal on the page — it anchors the brand.

**Footer** — Matches page background. Light top border (`--gray-light`). Muted text. No accent color — the footer recedes.

**Links** — `--accent` default, `--accent-dark` on hover. The teal-to-darker-teal transition gives links a tactile depth without introducing new hues.

**Blockquotes** — `3px` left border in `--accent`. Gray text. The teal border marks quoted material as structurally distinct from body text.

**Buttons (Settings Apply)** — Solid `--accent` background, white text. Hover dims via opacity. Buttons are rare, so when they appear the teal is unmistakable as a call to action.

**Secondary accent** — `--secondary` (amber) is defined and available but used sparingly. Intended for data tables, chart highlights, or inline callouts where a warm contrast to the cool teal draws the eye to specific values.
