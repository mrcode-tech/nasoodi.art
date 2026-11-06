# Content Announcement Sticker — Visual Design and SVG Asset Contract

**Status:** Existing paper-sticker visual direction retained  
**Primary specification:** journal-announcement-specification.md  
**Canonical website asset:** `public/images/journal/journal-announcement-sticker.svg`

## 1. Design intent

The sticker is a small piece of editorial paper attached to the edge of an artist's gallery. It can announce an artwork, gallery, Journal post, or event. Its appearance must not imply that the content is always an upcoming exhibition.

The visual should feel quiet, tactile, collected, and intentional. Paintings remain the primary visual content. The sticker is a secondary discovery detail, not an advertisement, sale badge, toast, or promotional banner.

## 2. Existing paper treatment

Preserve the existing hand-authored SVG study and its established paper silhouette unless implementation QA identifies a concrete defect. It uses a warm paper surface, fine neutral edge, subtle inward-facing irregular/torn edge, and restrained attachment detail.

- English/LTR: physical-left attachment edge; inward edge faces right.
- Persian/RTL: physical-right attachment edge; inward edge faces left.
- Mirror only the decorative SVG/background, never text, controls, artwork, or photography.
- Transparent outer canvas; no embedded image or text.
- Keep title, description, optional metadata, and close control as real HTML.

Do not generate a PNG, conversion pipeline, raster texture, or duplicate editable asset. Serve the canonical SVG directly.

## 3. Content hierarchy

1. Optional localized metadata/category label.
2. Localized title.
3. Short localized description.
4. Separate close control.

The component is content-driven. It must support varied text lengths and must not assume event dates. Metadata may contain a category, year, or confirmed date, but is optional.

## 4. Placement

Preserve the three existing compositions:
- Homepage desktop viewport placement.
- Desktop sidebar placement on non-homepage routes.
- Mobile navigation drawer placement after navigation and before settings.

Keep each placement's geometry appropriate to its available width. Respect safe areas, shell geometry, focus visibility, and reduced motion. The sticker must not cover navigation, artwork, skip links, or essential content. If no announcement is active, render no component and reserve no space.

## 5. Acceptance criteria

- Canonical SVG remains editable vector artwork and is served directly.
- SVG contains no text, metadata, links, controls, or embedded raster images.
- Existing paper identity is preserved.
- Both physical edge directions work without mirroring content.
- Content wraps without clipping or overlap.
- All three placements remain responsive and accessible.
- No marketing-banner treatment is introduced.
