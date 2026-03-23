# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Astro 6 static blog. Uses bun. Posts are markdown/MDX files in `src/content/blog/` with Zod-validated frontmatter (schema in `src/content.config.ts`). Update `site` in `astro.config.mjs` before deploying.

## Verification

After UI changes, always verify visually in a real browser using Playwright (take screenshots and inspect them). Do not rely on `curl` or HTML grep alone — they miss rendering errors that only appear in the browser.
