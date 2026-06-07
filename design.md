# SEO Best Practices

## Critical Files (must exist at deploy root)
- `public/robots.txt` — allows all crawlers, points to sitemap
- `public/sitemap.xml` — single `<url>` entry for `https://syndrix.io/`

## Meta Tags (in `<head>`)
- `<title>` — must be descriptive (brand + tagline), not just the brand name
- `<meta name="description">` — 1–2 sentence summary of what the site/app does
- `<meta name="keywords">` — comma-separated relevant terms
- `<meta name="robots" content="index, follow">`
- `<meta name="author" content="Syndrix">`
- `<link rel="canonical" href="https://syndrix.io/">`

## Open Graph (social sharing)
- `og:title`, `og:description`, `og:url`, `og:type`, `og:image`
- Required for rich link previews on X/Twitter, LinkedIn, Discord, Slack

## Twitter Card
- `twitter:card` — must be `summary_large_image` (large image preview)
- `twitter:title`, `twitter:description`

## Structured Data (JSON-LD)
- `Organization` schema with `name`, `url`, `description`, `sameAs`
- Injected by `<script type="application/ld+json">` before `</head>`

## HTML Semantics
- Use semantic elements where appropriate: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Single `<h1>` per page matching the `<title>`
- Heading hierarchy: `h1` → `h2` → `h3` (no skips)

## Performance (indirect SEO)
- LCP: preload critical fonts, inline above-fold CSS, avoid render-blocking resources
- No 404s or broken links
- `aria-label` / `role` on interactive elements for accessibility

## Accessibility
- Touch targets must be at least 24×24px (WCAG minimum), ideally 48×48px
  - Use `::after` pseudo-element with `width/height` on a flex-centered container to keep visual size small while meeting hit-area requirements
  - Space targets ≥8px apart to prevent accidental activations
- Identical-link rule (WCAG 2.4.4 / 2.4.9): every `<a>` must have a unique accessible name
  - When rendering lists of items (team cards, project cards), include the item name in the `aria-label`
  - Example: `<a aria-label="Mithunkumar J on LinkedIn">` instead of `<a aria-label="LinkedIn">`
- All semantic elements must have proper `<h1>`–`<h6>` hierarchy
- Interactive controls must have visible focus indicators
- Images must have `alt` text (use empty `alt=""` for decorative images)
- Buttons must have `aria-label` when only an icon is visible
- Links containing only an SVG/icon must have `aria-label` (e.g. `aria-label="Syndrix home"`)
- Color contrast must meet WCAG AA:
  - Normal text (<18px / <14px bold): **4.5:1 minimum**
  - Large text (≥18px or ≥14px bold): **3:1 minimum**
  - Non-text content (icons, buttons): **3:1 minimum**
  - `--accent-text` has separate per-theme values: `#60A5FA` (dark) / `#1D4ED8` (light)
  - `--fg-dim` must be verified per theme whenever changed

## Updates
- `lastmod` in sitemap.xml must match the current deploy date
- When adding pages, add corresponding `<url>` entries to sitemap.xml
