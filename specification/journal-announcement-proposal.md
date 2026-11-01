# Journal Event Announcement — Design Proposal

**Status:** Direction approved in principle on 2026-11-01; detailed visual treatment remains subject to screenshot review  
**Project:** Nasoodi.art  
**Branch:** feature  
**Related contract:** journal-and-events.md

## Owner review outcome — 2026-11-01

The owner approved the overall proposal and requested refinement of the implementation contract. This approval confirms the unified Journal approach and the restrained, edge-attached announcement concept. It does **not** select the final clean/torn/typographic visual variant, approve final Persian microcopy, or approve a finished PNG asset. Those remain visual-review decisions.

## 1. Purpose

Introduce one compact, fixed, dismissible announcement for a qualifying upcoming exhibition or event. It should feel like a small editorial object attached to an artist's gallery—not a discount promotion, modal, toast, or commercial campaign banner.

The announcement is secondary to the paintings and the artist's identity. It helps visitors discover a timely event without changing the homepage composition.

## 2. Product decision

- Events remain structured entries in the existing unified Journal.
- Do not add an Events top-level navigation item, separate event archive, or duplicate event records.
- The announcement appears only when a published, artist-approved, locale-ready upcoming event qualifies under the Journal publication rules.
- Activating its content navigates to the event's canonical localized Journal detail route.
- The homepage Journal preview and full Journal archive remain independently accessible.
- Dismissing the announcement does not hide Journal content.
- With no eligible event, the component is absent and reserves no layout space.

## 3. Recommended direction: editorial edge tab

A compact paper-inspired tab, attached to the viewport edge and extending inward.

Visual characteristics:
- Warm paper surface, warm ink typography, and existing semantic design tokens.
- Small category eyebrow, such as “UPCOMING EXHIBITION”, using approved localized copy.
- One concise event title.
- Optional confirmed date/date range, only when it fits cleanly.
- Restrained directional cue.
- Separate close control.
- Clean rectangular body with an optional subtle torn/perforated edge on the inward-facing side.
- No price, percentage, discount language, loud sale colors, glossy finish, large shadow, or promotional burst.
- No text over artwork.

The paper effect should be achieved with CSS or a small SVG shape if practical. Do not introduce photographic texture unless a licensed, artist-approved asset is supplied and demonstrably improves the result.

## 4. Visual variants for review

### A. Clean paper tab — recommended baseline
A simple warm-paper rectangle, a restrained border or clipped corner, small eyebrow, event title, optional date, and close control. This is the clearest and quietest version.

### B. Subtle torn-edge notice
The same content and dimensions, with a restrained torn/perforated silhouette along the inward-facing edge. The edge must not impair hit targets, text alignment, or legibility.

### C. Minimal typographic tab
No paper texture or irregular edge. A narrow paper-colored strip with fine border, eyebrow, title, and close control. Use if the paper treatments compete with the easel, paintings, or existing visual identity.

Recommendation: build the component around A and compare B as a visual refinement. C is the fallback. The owner will select the final treatment after reviewing screenshots. Do not assume visual approval.

## 5. Position and direction

The tab attaches to the physical edge associated with the locale-aware sidebar:
- English (LTR): physical left edge; outer/left edge flush with the viewport, inward/right edge free.
- Persian (RTL): physical right edge; outer/right edge flush with the viewport, inward/left edge free.

Use the actual shared-shell geometry and responsive breakpoints:
- On mobile, sit below the hamburger/menu trigger with a clear gap. Do not cover the trigger, safe areas, or opened drawer.
- On desktop, align with the sidebar/identity zone without covering the wordmark or navigation links. Do not assume a hamburger exists at desktop sizes.
- On compact desktop/tablet, inspect the real navigation transition and select a safe anchor.
- Keep the tab fixed to the viewport while scrolling. It must not move with the hero image or page content.
- Do not cover artwork, easel decoration, focused controls, skip links, or essential page content.
- The tab must remain compact and must never stretch into a full-width banner.

The opposite edge remains visually open. The outer edge is anchored; the inward edge is free.

## 6. Content and hierarchy

Display only:
1. A small event/exhibition category label.
2. Localized event title.
3. Optional confirmed date/date range.
4. Directional/open affordance.
5. Independent dismiss control.

Do not place venue, long description, poster, registration form, ticket price, or multiple events in this compact element. Those belong on the Journal detail page.

Use content-driven height with a controlled maximum width. Long Persian and English titles must wrap without clipping or overlap. If space is constrained, omit the optional date before truncating the title. The title must remain understandable.

## 7. Interaction and dismissal

- The title/content region is a normal link to the canonical localized Journal detail page.
- The close control is a separate button and must not be nested inside the link.
- Dismissal hides the tab immediately without navigation.
- Proposed default: session-scoped dismissal. Inspect existing preference utilities and reuse them if suitable; do not introduce a new tracking system.
- Scope dismissal to the selected event's stable ID or slug. Dismissing event A must not suppress a newly selected event B.
- If an event becomes expired, unpublished, unapproved, archived, locale-incomplete, or otherwise ineligible, remove it regardless of dismissal state.
- No modal, forced focus, sound, repeated reappearance during the same session, or attention-seeking entrance animation.
- Respect reduced-motion preferences.

## 8. Homepage Journal section

The homepage should retain a distinct Journal section near the bottom, after the featured Works and Galleries content and before the final Contact/footer region, subject to the existing homepage composition.

The current authoritative artwork-discovery contract limits this preview to **the two newest eligible published Journal entries across all entry types**. Do not add a third card or independently pin an older upcoming event into this preview. An upcoming event may appear as one of the two entries when its publication date places it in the newest-two set. The fixed announcement sticker is the separate discovery path for the nearest eligible upcoming event.

Recommended hierarchy:
- Section heading and optional approved introduction.
- Up to two newest eligible published Journal entries, preserving the established post-style editorial presentation.
- A clear “Explore Journal” / approved Persian equivalent link to the complete archive.

Do not fabricate entries to fill a fixed number of cards. Show fewer entries or omit the section when no approved content exists, following the existing Journal specification. The floating announcement is an additional discovery path, not a replacement for this section.

## 9. Event detail page experience

Use the existing Journal detail route and shared editorial shell. For event entries, present a clear event information panel near the title/summary:
- Event category and localized title.
- Event date/time, with explicit timezone where relevant.
- Temporal state only when reliably derived.
- Venue/location or online/hybrid attendance mode when confirmed.
- Registration or official information link only when supplied and approved.
- Approved cover image/poster, if available.
- Editorial description and supporting content.
- Related gallery/artwork links when they resolve to published, approved records.
- Return-to-Journal path and related entries where useful.

Clearly distinguish the publication date from the actual event date. A past event may remain in the archive. Do not leave expired registration actions active.

## 10. Journal archive experience

The Journal remains the single destination for exhibitions, events, studio updates, and stories.

The archive follows journal-and-events.md and the existing archive specification. Where pagination is implemented and justified by archive size, default to five entries and offer 5, 10, or 20 entries per page. Preserve active filters and deterministic ordering in URL state. Do not add pagination controls when all entries fit on one page.

## 11. Accessibility and responsive quality

- Semantic link for navigation and button for dismissal.
- Localized accessible names and visible keyboard focus.
- WCAG 2.2 AA contrast for text, controls, and focus indicators.
- Comfortable touch targets and logical reading order.
- No assertive live-region interruption on appearance.
- Test 320px width, 200% zoom, short-height screens, keyboard, touch, and screen readers.
- No horizontal overflow or obstruction of essential controls.
- Persian is true RTL; English is LTR. Artwork and photographs are never mirrored.
- Respect reduced motion and safe-area insets.

## 12. Editorial safeguards

Only published, artist-approved, locale-ready records may drive the announcement. Never invent event titles, dates, timezones, venues, participants, organizers, attendance details, or registration links. Missing translations remain missing. Development fixtures must be explicitly fictional and non-publishable, and excluded from sitemap, indexing, and structured data.

## 13. Review and acceptance

The design is ready for implementation review when:
- Clean and torn-edge variants are shown at desktop, tablet, mobile, and short-height sizes.
- Both Persian and English versions are shown.
- The tab remains fixed during scroll and does not move the hero.
- The close and navigation actions are independent.
- Empty, dismissed, long-title, expired-event, and missing-translation states are represented.
- Screenshots demonstrate no obstruction, clipping, or overflow.
- The owner has selected the final visual variant.

## 14. Sticker asset production contract

The announcement is a UI component, not a flattened image containing event copy. The eventual PNG must be a transparent-background decorative paper silhouette/edge treatment only; title, category, date, close control, and directional affordance remain real localized HTML text and controls for accessibility, responsiveness, and translation. Prefer CSS/SVG for the shape where it produces a cleaner and sharper result; use the PNG only for the approved paper material/edge artwork. Do not use a raster image for text, controls, or layout. Create the PNG only after the owner selects the visual variant. Store the approved source asset in the specification asset area and document dimensions, transparency, intended display size, and provenance. The asset must not contain a real event name/date or imply a real exhibition.

## 15. Decisions intentionally deferred

- Final selection between clean edge and torn edge.
- Exact offset and dimensions after comparison with the real shared shell.
- Final approved Persian microcopy.
- Whether session dismissal should be replaced by an existing project-standard persistence strategy.
- Final PNG/SVG visual asset, if any. Do not create or add a raster sticker before the owner reviews the design direction.
