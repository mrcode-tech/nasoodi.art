# Nasoodi.art — Refined Design Direction and Unified Design System

**Status:** Proposed design-system contract for all site surfaces  
**Companion:** design-engineering-skills.md

## 1. Creative direction — “The artist's quiet gallery”

Nasoodi.art should feel like entering a thoughtful contemporary artist's gallery that retains the intimacy of the working studio. It is editorial rather than commercial, tactile rather than glossy, and confident rather than decorative.

The memorable qualities should be finished paintings presented at generous scale with accurate color and detail; an editorial rhythm alternating calm reading space with visually rich artwork; a restrained warm-paper environment derived from the supplied studio reference palette; a consistent but unobtrusive navigation system; and carefully considered transitions that make the site feel responsive without turning it into a motion showcase.

The interface is a frame around the work. The artwork must dominate the visual hierarchy.

## 2. Brand hierarchy

Priority order across all routes:
1. Finished artwork and artist-approved exhibitions/collections.
2. Artist identity and approved artist statement.
3. Gallery collections and Journal editorial content.
4. Navigation and utility controls.
5. Decorative details.

Never let the easel background, studio/process photo, UI animation, badges, or decorative typography compete with the paintings.

## 3. Color system

The source palette and initial interface values are documented in visual-identity-and-photo-direction.md. Use semantic roles rather than raw hex values in page-specific code.

| Semantic token | Current proposed value | Role |
|---|---|---|
| --color-canvas | #F3F0EA | Main warm paper background |
| --color-surface | #FAF8F4 | Raised surface and menus |
| --color-surface-muted | #E8E2DA | Subtle section contrast |
| --color-text | #302824 | Primary text |
| --color-text-muted | #6B5D55 | Secondary text; contrast test required |
| --color-accent | #837369 | Muted mauve/taupe accent |
| --color-accent-strong | #675A51 | Active/selected emphasis |
| --color-accent-soft | #C5B197 | Quiet highlight |
| --color-border | #D8D0C7 | Rules and separators |
| --color-earth | #533F30 | Limited decorative detail |

Rules:
- Keep the light warm-paper experience as the default.
- Do not infer a dark theme requirement merely because a theme selector appeared in an earlier proposal. Confirm whether Light/Dark/System is still a product requirement; if retained, design a complete accessible dark palette rather than mechanically inverting colors.
- Artwork color is never modified to match the interface.
- Avoid pure-black/pure-white large surfaces unless contrast or content requires it.
- No gradient palette, neon accent, or saturated purple/blue tech aesthetic.
- Validate all tokens for actual text, controls, focus, and disabled-state contrast.

## 4. Typography system

Use a two-script editorial system. Exact font families remain a selection/approval task and must be checked for license, Persian shaping, Latin quality, local hosting, and file weight.

| Role | Purpose |
|---|---|
| Display | Artist name and high-level editorial statements; distinctive and fluid |
| Page title | Works, Galleries, Journal, About; strong readable hierarchy |
| Section title | Homepage and page sections; clear but subordinate |
| Card title | Artwork/gallery/journal titles; content-first |
| Body | Biography and Journal prose; comfortable measure and leading |
| Metadata | Dates, medium, dimensions, event facts; compact but accessible |
| Eyebrow | Small category/section labels; restrained, never essential alone |
| Navigation | Primary routes and utilities; stable and touch-readable |

### Type scale proposal

Use clamp() or the project's fluid type utility where supported. These are target ranges, not fixed per-component overrides:

| Role | Desktop target | Mobile target |
|---|---:|---:|
| Display | 3.25–5rem | 2.25–3rem |
| Page title | 2.5–3.5rem | 2–2.75rem |
| Section title | 1.75–2.5rem | 1.5–2rem |
| Card title | 1.125–1.5rem | 1.0625–1.25rem |
| Body | 1–1.125rem | 1–1.0625rem |
| Metadata | 0.8125–0.9375rem | 0.8125–0.9375rem |

Do not force identical optical sizing across Persian and Latin scripts. Tune line-height and weight for each family. Do not use letter-spacing on Persian text to imitate English editorial typography.

## 5. Layout and spacing system

- Use a consistent page gutter based on the existing proposal: clamp(1.25rem, 4vw, 4.5rem).
- Use a maximum content width appropriate to image-rich editorial layouts; current proposal is 1440px and should be validated against real artwork sizes.
- Use a flexible 12-column desktop grid as a layout tool, not a rigid requirement for every page.
- Tablet should reduce columns and gutters while preserving image scale.
- Mobile should prioritize a single readable flow and preserve the original artwork's full composition.
- Use a spacing scale with intentional rhythm; avoid repeating identical section padding everywhere.
- Prefer open compositions and image/text pairings over card containers.
- Keep long-form reading measure around 60–75 characters per line where the script permits; validate Persian separately.
- Section spacing should establish chapter-like pacing, not arbitrary empty space.
- Use container queries only where they materially improve adaptation and fit the project architecture.

## 6. Shape, borders, and surfaces

- Image frames are square or subtly rounded; preserve existing approved corner language consistently.
- Use fine warm neutral rules for section divisions.
- Avoid heavy shadows; use surface contrast and spacing to create hierarchy.
- Avoid pills as a default shape for navigation, filters, and metadata.
- Use filled surfaces only for purposeful menus, controls, and selected contexts.
- Avoid card-in-card nesting.
- Focus rings must remain clearly visible and must not be clipped by image frames or overflow containers.

## 7. Image composition system

### Artwork
- Artwork is presented uncropped by default, using its native aspect ratio.
- The full image is the canonical primary asset; detail crops are separate approved assets.
- Never apply CSS filters, color overlays, blending modes, AI enhancement, mirroring, or automatic art-direction crops.
- Artwork grid layouts may vary in height and ratio; masonry is optional only if reading order and keyboard order remain logical.
- Artwork detail pages should provide enough display area to inspect the work, with metadata subordinate.
- Do not place text over artwork unless the artist explicitly approves a specific composition.

### Studio/process and easel assets
- Use process images to communicate practice and context, not as substitutes for finished paintings.
- The easel background is a separate decorative layer governed by easel-scroll-background.md.
- It must not reduce text contrast, interfere with pointer/focus interaction, obscure paintings, or create excessive scroll motion.
- In small viewports it may be reduced or hidden.

### Journal and event imagery
- Use editorial image compositions, not generic article-card templates.
- Event posters may be shown but all essential event details must remain accessible text.
- Do not use stock/AI-generated paintings as content placeholders.
- If no approved cover image exists, use a typographic editorial treatment rather than an invented image.

## 8. Navigation system

- Maintain one shared navigation information architecture across desktop and mobile.
- Desktop: persistent physical-left sidebar as specified; top utility area contains language/theme controls only if retained by the approved navigation contract.
- Mobile: accessible off-canvas sidebar; language/theme selectors live at the bottom of the opened menu when space permits.
- Physical sidebar position remains left in both RTL and LTR; text alignment and reading direction adapt to locale.
- Active navigation should be indicated through restrained text weight, a fine rule/marker, and accessible current-page semantics—not color alone.
- Journal is a primary route. Do not add a separate Events top-level item.
- Keep navigation labels concise and artist-approved in Persian and English.
- No duplicate navigation items across header/sidebar/mobile states.

## 9. Motion language

The site's motion character is quiet, responsive, and editorial.

- Use immediate state changes for frequent controls.
- Use short opacity/transform transitions for occasional menus and panels only where spatial context benefits.
- Use one restrained entrance choreography on a page only if it supports hierarchy; do not stagger every element.
- Artwork itself should not animate, tilt, zoom automatically, or parallax as decoration.
- The easel scroll effect is governed by its own spec and must be subtle, reversible, and progressively enhanced.
- No auto-rotating carousels, scroll hijacking, cursor tracking, or perpetual movement.
- Reduced motion removes spatial transitions and scroll-linked movement while preserving content and function.

See design-engineering-skills.md for the mandatory motion decision process and token use.

## 10. Component language

Shared components should be few, reusable, and purpose-built: site shell and responsive navigation; section heading/eyebrow; artwork media frame and metadata; gallery preview and collection layout; Journal entry preview, event facts, and editorial content body; language/theme controls; accessible link/button variants; footer and contact invitation.

Do not build a component solely to wrap one heading or image unless it encapsulates meaningful reusable behavior or contract. Component reuse must not flatten the visual distinction between artworks, galleries, and Journal content.

## 11. Page-specific composition contracts

### Homepage
- Hero: approved finished painting is the primary artwork-led focal point. Studio/process photo may support the identity but cannot replace the finished painting.
- Featured Works: editorially varied composition, not a repeated equal-card row by default.
- Featured Galleries: previews that communicate collection identity and lead to gallery detail.
- Latest from the Journal: restrained editorial section after Featured Works and Featured Galleries; feature an upcoming event only when verified.
- Contact/footer: quiet conclusion, not a second hero.

### Works and artwork detail
- Image-led catalogue, natural ratios, minimal filters unless catalogue size requires them.
- Artwork detail: large work, known metadata, related galleries/works only when approved.

### Galleries
- Gallery index should communicate distinct collection identities through cover scale and editorial spacing.
- Gallery detail should let selected works lead; description is concise and secondary.
- A work can appear in multiple galleries without duplicate content records.

### Journal
- Editorial archive with type filters and clear chronological hierarchy.
- Upcoming event feature is conditional, not a permanent empty banner.
- Article/event detail uses a readable text measure, restrained metadata, and contextual related works/galleries.
- Past events remain useful archive content when still accurate.

### About and CV
- Separate artist statement from biography.
- CV uses factual, scannable chronology and appears only when verified entries exist.
- Process imagery is contextual, not decorative filler.

## 12. Themes and locale

- Light warm-paper theme is the baseline.
- Dark mode is not mandatory unless confirmed; if it remains in scope, specify complete semantic tokens and image treatment.
- Persian and English share the same visual identity, not separate brands.
- Persian layout uses correct RTL flow; physical-left sidebar and unmirrored art imagery remain intentional.
- Test mixed scripts, dates, numerals, links, long names, and long titles.
- Do not assume a Persian translation is approved because a literal translation exists.

## 13. Visual quality gates

A page is not ready when it merely compiles. It must pass clear hierarchy in the first viewport; coherent shared type/color/spacing/image tokens; no repetitive card/template composition without content reason; artwork fidelity and no accidental crop; no decorative motion competing with the work; responsive desktop/tablet/mobile/short-height behavior; Persian RTL and English LTR; keyboard focus, touch targets, reduced motion; empty and long-title states; WCAG 2.2 AA contrast and semantics; and visual screenshot review.

Record unresolved choices as open decisions; do not convert proposals into facts without owner approval.


## 14. Artwork discovery and editorial rhythm refinement — 2026-10-31

The detailed cross-page presentation contract is [artwork-discovery-carousel-and-editorial-experience.md](./artwork-discovery-carousel-and-editorial-experience.md).

- Use responsive, user-controlled artwork carousels for homepage Selected Works and collection-detail primary browsing; use collection rails on the gallery index only when they improve collection discovery.
- Carousel item sizing must respond to available content width, including the desktop sidebar. Prefer a few large, legible works over a dense row of thumbnails.
- A carousel is an editorial browsing rail, not an auto-rotating slideshow. Keep controls quiet, movement purposeful, and all works accessible without swipe.
- Preserve natural painting proportions and do not crop to create identical cards.
- Keep the homepage Hero static and distinct from the Selected Works carousel.
- Keep Journal as a text-led editorial/post experience. The homepage shows at most the two newest eligible published Journal entries and links to the complete archive; do not apply artwork-carousel styling to Journal.
- Maintain the existing warm-paper palette, typography, whitespace, and quiet gallery identity. Avoid generic repeated cards or decorative carousel chrome.
