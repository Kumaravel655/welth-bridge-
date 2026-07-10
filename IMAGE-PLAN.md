# Image Placement Plan — The Wealth Bridge

Goal: place **proper, credible images** on every page without breaking the ink-navy + marigold
identity or the animated-bridge signature. Trust is the product here (financial/legal services),
so imagery must read as *authentic and cohesive*, never as templated stock.

Applied UX rules (from ui-ux-pro-max): `image-optimization`, `image-dimension` (CLS < 0.1),
`alt-text`, `lazy-load-below-fold`, `font/asset preload discipline`, `color-accessible-pairs`
(text-over-image contrast), `reduced-motion`, `dark-mode-pairing`.

---

## 1. Art direction (the rule that prevents a "stock photo" look)

Every photograph gets a **navy duotone / scrim treatment** so it sits inside the palette instead
of fighting it:

- Desaturate + tint toward `--ink` shadows and `--accent` (marigold) highlights, **or** overlay a
  40–60% navy scrim (`oklch(0.21 0.04 250)`) when text sits on top.
- Consistent aspect ratios: `16/9` for banners, `4/5` for portraits, `1/1` for avatars.
- Subject matter: real Indian SMEs, a working office, documents/handshakes done tastefully,
  Vellore/Tamil Nadu context. **Avoid** suited-men-pointing-at-charts clichés.

Result: photos feel like they were shot for this brand, matching the existing gradient/bridge world.

---

## 2. Asset system — map images to categories, not to pages

Mirror the existing `categories` data model in `src/lib/services.ts`. Add one editorial image per
category; that single set then powers the services index, every service card, and all 64 detail
pages.

| Asset | Count | Drives |
|---|---|---|
| Category image (per category) | 5 | Services index headers · service cards · service detail banners |
| Brand / office / team photo | 2–3 | About hero, Contact, home "about" band |
| Flagship service hero (optional) | 6 | The 6 featured services get a unique hero; the rest inherit their category image |
| Client headshots (optional) | 6 | Testimonial avatars (fallback: current initials) |

**Total realistic set: ~10–14 images.** Not 64.

Data change: add `image` to each `Category`, and optional `heroImage` to flagship `Service`
entries — same pattern as the existing content model.

---

## 3. Per-page image map

### Home (`/`)
- **Hero** — keep the animated bridge as the signature. Optionally layer a *treated* office/Vellore
  photo behind the gradient mesh at ~15% opacity for depth. (Recommendation: keep hero graphic; add
  the real photo one section down instead.)
- **New "who we are" band** (after Stats) — one strong treated office/team photo beside a short
  paragraph. This is a high-trust slot the page currently lacks.
- **Service showcase cards** — small category thumbnail on each of the 6 cards (uses the category set).
- **Testimonials** — swap initials for real client headshots if available; otherwise keep initials.
- Values / Process / Pricing / CTA — stay graphic (gradient/mesh). No photos needed.

### About (`/about`) — highest-value imagery on the site
- **Hero** — treated office or team-at-work photo alongside the headline. The single most important
  trust image; this is where authenticity pays off most.
- **Five professions** — one cohesive team/office photo rather than five fake headshots (fake
  portraits erode trust faster than icons).
- **Offices** — a photo (or static map thumbnail) per office: Vellore, Arakkonam, Ranipet.

### Services index (`/services`)
- **Category section headers** — full-width treated banner per category (the 5-image set).
- **Service cards** — inherit their category thumbnail so all 64 look intentional.

### Service detail (`/services/[slug]`)
- **Hero / fact-panel band** — the category image (or the flagship `heroImage` for featured
  services). Reusing the category image keeps 64 pages consistent and maintainable.

### Contact (`/contact`)
- Treated Vellore office photo + a **static map image** per office (static image, not an embedded
  iframe — better for CSP, performance, and no external runtime dependency).

### 404 / error / loading
- Stay graphic. No photos.

---

## 4. Technical spec

- **`next/image` everywhere** (already used for the logo). Auto AVIF/WebP, responsive `srcset`.
- **Store locally in `public/images/…`** — no `next.config` `remotePatterns` needed, no hotlinking,
  reliable offline/prod. (If remote CDN is required later, add `remotePatterns` then.)
- **Always set `width`/`height` or `fill` + `aspect-ratio`** → prevents layout shift (CLS < 0.1).
- **`priority`** only on the About hero image; everything else lazy-loads (next/image default).
- **`blurDataURL`** placeholders for smooth load-in (generate at build or inline tiny base64).
- **`sizes`** attribute on responsive images so mobile doesn't download desktop resolution.
- **One reusable `<Media>` component** encapsulating the duotone/scrim treatment, aspect ratio,
  blur placeholder, and rounded corners — so every image is consistent and theme-aware.
- **Alt text**: descriptive for meaningful images; `alt=""` for purely decorative background layers.
- **Reduced motion**: no parallax/scale on images when `prefers-reduced-motion` is set.
- **Dark mode**: verify scrim keeps text ≥ 4.5:1 in *both* themes (test independently).

---

## 5. Sourcing & licensing (the one decision that gates execution)

Ranked by credibility:

1. **Client's own photos** (best) — real office, team, Vellore. Highest trust, zero licensing risk.
   Recommend requesting these regardless; they can swap in later via the `<Media>` component.
2. **Licensed stock** (fast interim) — Unsplash/Pexels free license or a paid library. I download
   locally to `public/images/`, apply the navy treatment so they cohere. Good enough to ship.
3. **AI-generated** — flexible, but risky for anything implying *real people/clients* (trust +
   authenticity concerns). Fine for abstract/office-texture backgrounds, not for "our team."

Recommendation: **licensed stock now** (treated to match the brand) as placeholders, structured so
the client's real photos drop in later with no code changes.

---

## 6. Execution phases

- **Phase 1 — Infra**: `public/images/` structure · reusable `<Media>` treated-image component ·
  add `image` to categories + optional `heroImage` to flagship services · blur-placeholder helper.
- **Phase 2 — Services**: wire category images into index headers, service cards, and detail banners
  (covers 64 pages via 5 images).
- **Phase 3 — About + Contact**: hero photo, office photos, static maps (highest trust value).
- **Phase 4 — Home + Testimonials**: "who we are" band, card thumbnails, optional client headshots.
- **Phase 5 — QA**: Lighthouse/CLS check, alt-text audit, text-over-image contrast in both themes,
  reduced-motion verification, mobile `sizes` check.

---

## Open decisions
1. **Sourcing** — client photos, licensed stock (I fetch + treat), or AI? (gates everything)
2. **Hero** — keep it graphic (recommended) or introduce a treated background photo?
3. **Testimonial avatars** — real headshots or keep the clean initials fallback?
