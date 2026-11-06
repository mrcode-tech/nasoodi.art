# Canonical artwork and gallery inventory

**Status:** Current canonical content contract for the feature branch.
**Source of truth:** `src/content/data/artworks.json`, `src/content/data/galleries.json`, and `src/content/data/homepage-selection.json`.

## Current inventory

The canonical JSON currently contains **25 published artwork records**, organized into **eight year-based galleries**. The records cover Persian calendar years 1388, 1392, 1393, 1395, 1398, 1399, 1401, and 1403.

The inventory is data-driven. Do not hardcode an earlier five-image inventory, a four-gallery inventory, or a fixed list of image filenames in application logic or tests. When the owner adds, replaces, or removes artwork, update the canonical JSON and its related references; then update this document's counts and summary table in the same change.

| Gallery year | Gallery title (English) | Slug | Artwork count | Cover artwork |
|---:|---|---|---:|---|
| 1403 | A Season of Light | `a-season-of-light` | 6 | `artwork-1403-1` |
| 1401 | A New Rhythm | `a-new-rhythm` | 2 | `artwork-1401-1` |
| 1399 | After the Moment | `after-the-moment` | 1 | `artwork-1399-1` |
| 1398 | Impressions That Remain | `impressions-that-remain` | 8 | `artwork-1398-1` |
| 1395 | A Quiet Interval | `a-quiet-interval` | 1 | `artwork-1395-1` |
| 1393 | The Held Space | `the-held-space` | 2 | `artwork-1393-1` |
| 1392 | Figures and Interior Light | `figures-and-interior-light` | 4 | `artwork-1392-1` |
| 1388 | First Light | `first-light` | 1 | `artwork-1388-1` |
| **Total** | **8 galleries** |  | **25 artworks** |  |

The canonical gallery JSON is stored oldest-to-newest for editorial chronology. Public archive and homepage selections are presented newest-to-oldest. Each gallery's `artworkIds` array is its canonical editorial order.

## Content and relationship rules

- Artwork records have stable IDs, localized titles and descriptions, explicit localized slugs, and one primary image in the current inventory.
- Image paths must be safe, same-origin public paths. Committed image metadata is generated from actual files by `scripts/generate-image-metadata.mjs`; `npm run images:check` verifies it without rewriting it.
- Artwork publication requires the existing publication and rights checks, localized fields, a valid primary image, dimensions, and localized alternative text.
- The eight galleries are year-based groupings, not overlapping thematic collections. Every current artwork belongs to exactly one gallery.
- A gallery's `coverArtworkId` must equal the first item in its ordered `artworkIds` list. Do not choose a cover by filename sorting or by an unrelated artwork ID.
- Gallery memberships reference canonical artwork IDs. Never duplicate an artwork record or image file to place it in a gallery.
- `homepage-selection.json` contains eight featured gallery IDs and eight featured artwork IDs. Each featured artwork is the first artwork (cover) of the corresponding featured gallery, and the selection is ordered newest-first.
- Keep the artist's studio/process portrait separate from finished artwork records. Do not register a portrait or process photograph as an artwork.
- Journal entries may reuse canonical artwork images. Their localized alt text is context-specific editorial metadata and does not have to be identical to the artwork page's alt text; it must remain accurate, meaningful, localized, and rights-cleared.

## Public routes and presentation

- Works archives: `/[locale]/works`; detail routes: `/[locale]/works/[localizedSlug]`.
- Gallery index: `/[locale]/galleries`. It uses static poster cards, not the homepage carousel.
- Gallery details: `/[locale]/galleries/[localizedSlug]`.
- Homepage Selected Works and featured Galleries retain their own carousel behavior and use the explicit homepage selection.
- Public artwork and gallery archives are ordered newest year first. The first artwork in each gallery is its cover.
- Persian routes and localized slugs must resolve correctly under RTL; English routes use LTR.

## Validation contract

Automated tests should validate invariants rather than preserve obsolete inventory assumptions:

1. Stable artwork IDs and slugs are unique.
2. Current published artwork records have localized content and valid primary image metadata.
3. Gallery IDs and slugs are unique; every gallery is published, localized, and has at least one artwork.
4. Gallery membership IDs resolve to canonical artworks, contain no duplicates, and partition the current artwork inventory exactly once.
5. Each gallery cover is its first artwork.
6. Homepage featured gallery/artwork selections contain eight current records, are newest-first, and pair each gallery with its first artwork.
7. Public records are available in both locales and route slugs are safe.
8. Journal cover images are safe and rights-cleared; localized Journal alt text is validated independently from artwork-page alt text.
9. CI's image metadata check, content tests, route tests, and production build pass against the same feature-branch commit.

Avoid tests that assert stale image filenames, old five/four inventory sizes in unrelated code, fixed thematic overlap, or the existence of an upcoming event. Tests for repositories should verify their filtering and ordering contracts; a valid empty event result is allowed when the canonical Journal contains no published event/exhibition records.

## Editorial and approval boundary

The canonical data currently marks the published artwork records as rights-confirmed and supplies localized editorial text. Automated checks verify data consistency and asset availability; they do not independently establish legal ownership, artist approval of every title/translation, or final visual acceptance. Keep owner review distinct from technical publication validation and do not infer new approval from the existence of a JSON record.
