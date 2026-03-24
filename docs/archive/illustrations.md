# Illustration & Image Guidelines

Last updated: 2026-03-23

## Style

Flat vector, clean outlines, minimal detail. Cross-section/infographic style for technical topics. Muted pastel palette on a light blue-green background. No text baked into images — labels belong in HTML.

## Hero images

2:1 aspect ratio (1020×510 rendered). Left-to-right narrative flow when depicting a process. Favor whitespace over density — should read clearly at thumbnail size.

## OG / social images

Separate from hero images (`ogImage` frontmatter field). Text-based cards: title in Lora, filter/tag chips in color, site URL in muted gray. 1200×630, `#fafaf9` background.

## AI image generation

When using AI generators (e.g. Gemini/Nanobanana), specify: "flat minimal illustration, clean vector style, muted pastel palette, no text, no people, 2:1 aspect ratio." Explicitly exclude elements that would misrepresent the content — accuracy over aesthetics.

## Favicon

Generated via Gemini. Prompt: "minimal flat vector silhouette, blob character holding lotus leaf umbrella, T shape, teal leaf, dark body, solid white background." Background removed and white outline glow added via sharp.

Files: `favicon-32.png`, `favicon-16.png`, `favicon.ico`, `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png`. Source: `src/assets/favicon-source.jpeg`. Processed full-res: `public/favicon-full.png`.
