# The Wealth Bridge — Website Redesign

Modern rebuild of [thewealthbridge.in](https://www.thewealthbridge.in/) — a business setup and compliance consultancy in Vellore, Tamil Nadu (est. 2007).

## Stack

- **Next.js 15** (App Router, React 19, TypeScript, static export-ready)
- **Tailwind CSS 4** — token-driven theme in [globals.css](src/app/globals.css)
- **Motion** (`motion/react`) — entrance choreography, scroll reveals, animated counters
- **Radix UI** — navigation menu (mega menu), dialog (mobile nav), accordion, label
- **next-themes** — dark / light with system default
- **Lucide** icons · **Geist / Geist Mono / Newsreader** via `next/font`

## Design system

| Token | Meaning |
| --- | --- |
| `ink` / `ink-*` | Deep navy band — hero, header, footer stay ink in both themes |
| `accent` (marigold) | The flower of Indian business openings — CTAs, waypoints, highlights |
| `background` / `card` / `muted` | Warm paper (light) / navy surfaces (dark) |
| `font-display` | Newsreader — headlines, italic emphasis |
| `font-mono` | Geist Mono — prices, timelines, eyebrows (the "paperwork" voice) |

Signature element: the animated **suspension bridge** ([bridge.tsx](src/components/motion/bridge.tsx)) whose deck carries the four steps every filing crosses — Consult → Documents → Filing → Registered.

## Content architecture

All **64 services** live in one typed data file: [src/lib/services.ts](src/lib/services.ts).
Each entry drives a statically generated page at `/services/[slug]` (pricing, timeline, process steps, inclusions, document checklist, JSON-LD). Category defaults keep entries small; flagship services override with verbatim content from the original site.

Contact details and offices: [src/lib/site.ts](src/lib/site.ts).

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build (74 static pages)
npm run start      # serve the build
npm run typecheck  # tsc --noEmit
```

## Accessibility & SEO

- WCAG 2.2 AA: skip link, visible focus rings, `prefers-reduced-motion` respected everywhere, semantic landmarks, sr-only fallbacks for decorative SVG
- Per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, Organization + Service JSON-LD

## Source content

Everything extracted from the original site is archived in
[wealthbridge-website-audit.txt](wealthbridge-website-audit.txt) — including two
data conflicts to confirm with the client (head-office address wording, GST
registration price ₹1,499 vs ₹12,999).
