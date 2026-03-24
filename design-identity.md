<!-- What: Visual identity spec for Tangents blog — palette, influences, design principles.
     Where else: CSS variables live in src/styles/global.css; component-level styles in src/components/.
     Stability: Living document — update when the palette or design direction changes.
     Last reviewed: 2026-03-23 -->

# Tangents — Design Identity

Nickname: **Field Notes**

---

## Influences

**Maggie Appleton** — Confident use of color as editorial voice. Opinionated palettes that signal a point of view rather than defaulting to safe neutrals. From her work we take the conviction that a research-oriented site should *look* like it has opinions, not like a template.

**Frank Chimero** — Editorial restraint and quiet authority. Typography and whitespace do the heavy lifting; color is structural, not decorative. From his work we take the discipline of using accent color sparingly — for wayfinding, not atmosphere.

The synthesis: a palette that is precise and opinionated (Appleton) but deployed with restraint (Chimero). Color marks structure and interaction; everything else stays neutral.

---

## Palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#ffffff` | Pure white — the background disappears, letting typography and accent do the work. |
| Text | `#1c1917` | Stone-900: warm enough to feel human, dark enough for crisp reading. |
| Accent | `#0f766e` | Links, active nav, blockquote border. Teal-700: precision and depth. |
| Accent dark | `#115e59` | Hover states. Teal-800: deepens on interaction. |
| Secondary | `#b45309` | Data callouts, rare highlights. Amber-700: the warm pen marking up a cool notebook. |
| Gray | `#78716c` | Dates, captions, muted text. Stone-500. |
| Gray light | `#e7e5e4` | Borders, dividers, inline code background. Stone-200. |

Cool/warm axis: teal marks structure and interaction, amber interrupts for emphasis, warm stone grays mediate between the two.

---

## Design principles

1. **Readability first.** Large serif body text, generous line height, constrained width. The palette and layout disappear behind the writing.
2. **Restraint in color.** Teal is used sparingly — links, borders, active states. Most of the page is neutral. Amber is rarer still.
3. **No decoration for decoration's sake.** No gradients, shadows, or ornamental elements.
4. **Playful but intelligent.** The visual language signals curiosity with purpose — following threads wherever they lead, arriving at something useful.
5. **Content-first hierarchy.** Color serves wayfinding (where can I click? what's active?) not mood.

---

## Icon

A rounded blob character (back-facing silhouette) holding a lotus leaf above its head like an umbrella. The leaf and body together form the letter T for Tangents. Teal leaf, dark charcoal body, white outline glow for dark-background contrast.

Source artwork: `src/assets/favicon-source.jpeg`

---

## Illustration style

Flat vector, clean outlines, minimal detail. Muted pastel palette. No text baked into images. Accuracy over aesthetics.
