# Nasoodi.art — Shared Responsive Typography System

**Status:** Shared design-system refinement, effective 2026-11-03  
**Scope:** Every public route and shared interface component  
**Languages:** Persian (fa, RTL) and English (en, LTR)  
**Authority:** This document refines and supersedes the earlier proposed type-size ranges in design-direction-and-system-refinement.md. Page-specific specifications remain authoritative for content and composition, but must use these shared typography roles.

## 1. Design intent

Typography should frame the artist's work, establish a quiet editorial hierarchy, and remain readable without dominating the page. The system must correct oversized headings—especially in Persian—through shared type roles and responsive tokens, not isolated page overrides.

The two explicit Persian visual references are:

**Homepage artist identity**

# غزاله عبداله زاده نسودی

Target: one line at the reference widths where the content column provides sufficient room.

**Homepage Contact section**

## بیایید گفت‌وگویی را آغاز کنیم.

Target: one line at the reference widths where the introduction column provides sufficient room.

These are specific visual targets, not a global no-wrap rule. Other headings must wrap naturally when content or viewport width requires it.

## 2. Typography roles

Use these semantic roles consistently:

| Token | Responsibility |
|---|---|
| --type-display | Homepage artist name and exceptional display statements |
| --type-page-title | Main H1 on About, Works, Galleries, Journal, Contact, and detail pages |
| --type-section-title | Homepage and page section headings, including the homepage Contact heading |
| --type-subsection-title | Biography, profile, and meaningful subsection headings |
| --type-card-title | Artwork, gallery, Journal, and event preview titles |
| --type-body | Standard editorial prose and descriptions |
| --type-body-lead | Introductory copy where a lead is semantically justified |
| --type-supporting | Navigation, supporting descriptions, and secondary interface copy |
| --type-caption | Artwork captions and compact metadata |

### 2.1 Fluid token values

Implement the tokens centrally in the global design-token layer. Use CSS clamp() for fluid roles and preserve the existing font families and font-loading strategy.

English/LTR defaults:

| Token | Value |
|---|---|
| --type-display | clamp(1.875rem, 3.1vw, 2.75rem) |
| --type-page-title | clamp(1.875rem, 2.8vw, 2.5rem) |
| --type-section-title | clamp(1.5rem, 2.25vw, 2rem) |
| --type-subsection-title | clamp(1.1875rem, 1.65vw, 1.5rem) |
| --type-card-title | clamp(1.0625rem, 1.45vw, 1.35rem) |
| --type-body | 1rem |
| --type-body-lead | clamp(1.0625rem, 1.3vw, 1.125rem) |
| --type-supporting | 0.9rem |
| --type-caption | 0.8rem |

Persian/RTL overrides:

| Token | Value |
|---|---|
| --type-display | clamp(1.75rem, 2.8vw, 2.5rem) |
| --type-page-title | clamp(1.75rem, 2.65vw, 2.35rem) |
| --type-section-title | clamp(1.5rem, 2.1vw, 1.875rem) |
| --type-subsection-title | clamp(1.125rem, 1.55vw, 1.375rem) |
| --type-card-title | clamp(1.0625rem, 1.4vw, 1.25rem) |
| --type-body | 1rem |
| --type-body-lead | 1.0625rem |
| --type-supporting | 0.9rem |
| --type-caption | 0.8rem |

These values are a measured starting scale for the current font configuration, not permission to override them locally. If actual browser rendering reveals a font-metric issue, refine the shared role and this specification together.

## 3. Script-specific metrics

- Preserve the current licensed/selected font configuration; do not silently replace fonts as part of a size refinement.
- Persian uses its native font stack and connected glyph shaping. English uses the current Latin editorial stack.
- Define shared line-height tokens: English display 1.2, headings 1.35, body 1.9; Persian display 1.5, headings 1.55, body 2.
- Persian letter spacing remains normal (0); never apply negative tracking to Persian words.
- Do not mechanically apply Latin font-size/line-height assumptions to Persian.
- Keep punctuation, numerals, mixed-script names, URLs, and bidi isolation correct.
- Use logical alignment and spacing properties. Do not mirror artwork or physical navigation placement.

## 4. Wrapping and measure

- Use natural word wrapping. Never apply white-space: nowrap globally to headings.
- Do not use transforms, horizontal scaling, clipping, or tiny type to force a line.
- Do not use fixed widths designed for one screenshot.
- Prefer text-wrap: balance for display and heading roles where supported; it must not prevent natural wrapping.
- Prevent breaks inside ordinary Persian or English words. Long URLs and contact values may use overflow-wrap: anywhere within their own value elements.
- The two reference headings should remain on one line at the tested widths when their actual container can accommodate them. At narrower widths, allow a readable natural wrap rather than overflow.
- Maintain a readable measure for long-form prose. Do not make body copy smaller to compensate for oversized headings.

## 5. Application mapping

Apply shared roles to semantic elements and existing component classes:

- Homepage artist H1 → display.
- Shared page H1 → page title.
- Section H2 and homepage Contact H2 → section title.
- Profile/biography subsection headings → subsection title.
- Artwork, gallery, Journal, and event titles → card title.
- Editorial paragraphs → body or body-lead as appropriate.
- Navigation/supporting text and metadata → supporting/caption.

Preserve each page's semantic heading order. Do not change an H2 to H1 or vice versa merely to obtain a visual size.

Use the existing global CSS and theme-token architecture. Typography is theme-independent; Light and Dark themes must inherit the same hierarchy and retain accessible contrast.

## 6. Responsive and locale acceptance matrix

Verify the actual rendered page at these widths: 320, 360, 390, 430, 768, 1024, 1280, and 1440 CSS pixels. Include a short-height mobile viewport. Test both /fa and /en, and both Light and Dark themes.

Required assertions:

1. At 390, 430, 768, 1280, and 1440px, the Persian homepage artist name is a single rendered line.
2. At those same reference widths, the Persian homepage Contact heading is a single rendered line.
3. At 320 and 360px, both headings remain readable, wrap naturally when necessary, and do not create horizontal overflow.
4. The display heading does not exceed the shared Persian display token.
5. No heading uses white-space: nowrap as a workaround.
6. English headings follow the same role hierarchy and may wrap naturally.
7. Section, card, subsection, and page headings use their shared roles across all routes.
8. Persian shaping, line height, punctuation, and RTL reading order remain correct.
9. No page has horizontal overflow, clipped text, overlapping headings, or controls pushed outside the viewport.
10. Font sizes and line heights remain consistent in Light and Dark themes.

Automate line-count and computed-style checks with Playwright. Inspect screenshots for hierarchy and visual balance; a one-line assertion alone is not sufficient visual QA.

## 7. Implementation and governance

Specification-first changes are mandatory:

1. Inspect current fonts, global tokens, heading selectors, content widths, and rendered output.
2. Update this document and the shared design authorities before editing application CSS or components.
3. Implement the shared tokens once in the global token layer.
4. Map existing semantic headings to those roles; remove conflicting oversized declarations where practical.
5. Add automated responsive, locale, and wrapping tests.
6. Inspect actual GitHub Actions results and rendered screenshots against the final commit.

Future page work must consume these roles. Do not add one-off heading sizes without documenting a genuine component-specific need and checking that it does not undermine the hierarchy.

## 8. Out of scope

This refinement does not authorize a font-family change, artwork treatment change, page redesign, content rewrite, navigation redesign, or change to contact publication/approval rules. Contact data remains governed by AGENTS.md, content-model.md, localization-and-editorial-governance.md, and the current Contact implementation contract.
