# Nasoodi.art — Galleries Index: Editorial Cards and Pagination Specification

**Status:** Approved direction from site owner; specification only (implementation not yet changed)  
**Scope:** The localized main Galleries index at `/[locale]/galleries`  
**Locales:** Persian (`fa`, RTL) and English (`en`, LTR)  
**Reference supplied by site owner:** `https://nasoodi-art-git-stage-mrcode-techs-projects.vercel.app/fa/galleries`  
**Related specifications:** `gallery-collections-and-artwork-detail.md`, `selected-works-three-level-experience.md`, `wireframes.md`, `shadcn-component-reuse-and-bilingual-ui.md`, `content-model.md`, `localization-and-editorial-governance.md`, `accessibility-performance-security.md`, `testing-qa-and-release.md`

---

## 1. Confirmed design decision

The main Galleries index must use a **static editorial grid of gallery poster cards with pagination**. It must not use a carousel, horizontal slider, swipe rail, auto-advancing component, or carousel controls.

- The initial page size is **5 gallery cards**.
- At the end of the page, show pagination when the published gallery count exceeds the selected page size.
- Provide a page-size listbox with exactly these options: **5, 10, and 20 items per page**.
- The visitor can change the page size without leaving the Galleries index.
- The visitor can navigate to a specific page using pagination controls.
- When there are 5 or fewer published galleries, show the cards without pagination controls; the page-size selector may be hidden because there is no useful page-size choice to make.
- Preserve the existing homepage carousel exactly as it is. This specification does not authorize changing, replacing, restyling, removing, or reconfiguring the homepage Selected Works carousel.
- This is a page-specific decision. It does not change the carousel or viewer behavior on the homepage, gallery detail pages, or any other page.

The supplied reference URL is the visual direction for the main Galleries page. Match its simple card-based, paginated browsing approach while retaining Nasoodi.art's established quiet-gallery visual identity, semantic design tokens, typography, and bilingual behavior. Do not copy unrelated layout or styling that conflicts with the project's design system. If the reference deployment cannot be inspected, treat the requirements in this document as authoritative rather than guessing at unobserved details.

## 2. Purpose and scope

The Galleries index is a browsable catalogue of curated collections. It should let visitors scan gallery posters, understand each collection at a glance, and open a collection detail page. It is not an artwork viewer and it is not a continuously moving showcase.

This specification applies only to:
- `/[locale]/galleries` (or the repository's already-established equivalent route).
- Gallery poster cards rendered on that index.
- Page-size selection, pagination, URL state, empty states, responsive layout, accessibility, localization, and associated tests.

This specification does not authorize changes to:
- Homepage Selected Works carousel or any homepage carousel configuration.
- Homepage hero, featured artwork, homepage gallery preview, or Journal sections.
- Gallery detail artwork presentation or its existing carousel/viewer behavior.
- Artwork Viewer, artwork records, collection membership, asset selection, or image-processing pipeline.
- Global navigation, site shell, theme, typography, or unrelated pages except where an existing shared primitive is reused without changing its behavior.

## 3. Relationship to existing specifications

This document is the more specific and later owner-approved contract for the **main Galleries index layout and pagination**. Where an earlier general gallery-index recommendation implies a carousel, a non-paginated collection rail, or leaves the index layout open, this document takes precedence for `/[locale]/galleries`.

All existing content-governance, artwork-fidelity, route, locale, design-token, accessibility, SEO, and testing rules remain in force. The three-level artwork experience remains intact:
1. Homepage Selected Works continues to use its existing carousel.
2. Main Galleries index uses static poster cards and pagination as specified here.
3. Gallery detail continues to present that collection's artworks using its existing approved layout and viewer behavior.

Do not interpret the word “poster” as permission to invent poster artwork or create new image crops. Use each gallery's approved cover artwork and approved derivative under the existing asset pipeline.

## 4. Page information architecture

The page follows this order:

1. Existing global site shell and navigation.
2. Localized page heading (“Galleries” or the approved Persian equivalent).
3. Optional short introduction, only if approved copy exists.
4. Static responsive grid of gallery poster cards for the current page.
5. Pagination and page-size controls at the bottom of the gallery listing, when applicable.
6. Existing footer/site ending.

Do not add:
- Carousel arrows, dots, slide counters, autoplay, swipe affordances, or horizontal overflow rails.
- Search, filters, sorting controls, category tabs, or view toggles unless separately specified and approved.
- Artificial gallery counts, filler cards, placeholders, or duplicated collections.
- A second artwork grid unrelated to the gallery collection cards.

The grid must remain in normal document flow. The page should scroll vertically in the normal browser manner.

## 5. Gallery poster card contract

Each card represents exactly one published gallery and links to its localized gallery detail route.

### Required content
- Approved gallery cover image.
- Localized gallery title.
- A short localized description/teaser when approved content exists.
- Optional published-artwork count only if the content model already provides a trustworthy count and the value is useful. Do not invent or hardcode counts.

### Image and composition
- Use the approved gallery cover artwork and its approved derivative.
- Preserve the artwork's intrinsic aspect ratio and visual integrity.
- Prefer a consistent poster frame for the card grid, using `object-fit: contain` or an equivalent non-destructive presentation when the source ratios differ. If the existing approved cover derivative defines a specific poster ratio, use that documented ratio consistently.
- Do not crop, stretch, mirror, recolor, filter, overlay, or apply decorative effects to the artwork.
- Reserve image dimensions/aspect ratio before load to avoid layout shift.
- Use responsive image sizes and the repository's established image component/pipeline.
- Do not use a blank placeholder as a published gallery cover. A gallery without an approved cover remains unpublished under the existing publication rules.

### Card hierarchy and interaction
- The image is the primary visual element.
- The title is clearly associated with the image.
- The description is secondary and concise; do not place essential information only in an image overlay or hover state.
- Make the cover and title lead to the same gallery detail route using one coherent accessible link target. Avoid nested links.
- The card may be one whole-card link only if its accessible name remains clear and no nested interactive controls are introduced.
- Hover and focus feedback must be restrained and use existing tokens (for example, a subtle border/underline/opacity transition). Do not animate or visually alter the painting itself.
- Provide a visible keyboard focus indicator.
- Use the correct localized title and description. Never fall back to untranslated content in a way that silently presents the wrong language; follow the existing locale fallback contract.

### Content integrity
- Render only galleries eligible for public publication under the existing content and rights gates.
- Preserve editorial order across pages.
- A gallery appears exactly once in the paginated result set.
- Do not duplicate gallery records or artwork assets to fill the grid.
- Do not display draft, review, unapproved, incomplete, or archived galleries.

## 6. Grid layout and responsive behavior

Use a simple CSS grid, not a carousel or JavaScript-driven masonry layout.

### Desktop / wide screens
- Use a balanced multi-column editorial grid (normally three columns where the content width and poster proportions permit).
- Keep card widths, gutters, image frames, and caption spacing consistent.
- Preserve generous whitespace and the site's quiet-gallery character.
- Avoid dashboard-like heavy borders, large shadows, or excessive card chrome.

### Tablet
- Reduce the column count as needed (normally two columns).
- Keep artwork large enough to appreciate and text comfortably readable.
- Maintain the same editorial order.

### Mobile
- Use a single-column list by default.
- Cards should have a generous poster image and legible title/description.
- Do not squeeze cards into narrow multi-column tiles.
- Keep touch targets comfortable and avoid horizontal page overflow.

### All sizes
- Grid order follows the underlying editorial gallery order after pagination has selected the current slice.
- Grid height is allowed to vary naturally based on card text, but card composition should remain visually coherent.
- The pagination controls must remain after the final card in normal reading order.
- Do not use sticky pagination or a fixed overlay.

## 7. Pagination behavior

### Default behavior
- Default page size: **5**.
- Start on page **1** when the visitor opens the index without pagination state.
- Total pages are calculated from the number of published galleries and the selected page size:
  `totalPages = ceil(publishedGalleryCount / pageSize)`.
- Render only the current page's slice, preserving editorial order.
- When `publishedGalleryCount <= pageSize`, do not render page-navigation controls.
- When `publishedGalleryCount > pageSize`, render pagination after the grid.
- When the page has more than one page, show a clear current-page state and controls to navigate between available pages.

### Controls
Use the existing shadcn/Radix-compatible pagination primitives if available. Otherwise inspect the installed UI primitives and compose the smallest accessible solution consistent with the repository's shadcn component policy.

The pagination area should provide:
- Previous-page control.
- Numbered page controls for available pages, with a compact ellipsis pattern for large page counts if necessary.
- Next-page control.
- An accessible indication of the current page (for example, `aria-current="page"`).
- Disabled state for Previous on the first page and Next on the last page.
- Localized accessible names for previous/next and page navigation.
- A page-size listbox with exactly three options: `5`, `10`, and `20`.

Do not show controls that appear enabled when no destination page exists. Do not render a long unbounded row of page numbers on narrow screens; use a compact, understandable page window with ellipses.

### Page-size selection
- The page-size listbox defaults to 5.
- Its options are exactly 5, 10, and 20 items per page.
- The selected value is visible and exposed to assistive technology.
- Changing the page size resets the current page to page 1. This avoids unexpectedly landing beyond the new final page and makes the result predictable.
- After changing page size, recalculate the total page count and render the correct first slice.
- The page-size selector is a native accessible select or the existing shadcn Select primitive; do not build a custom listbox from non-semantic clickable elements.
- Localize the label (for example, “Items per page” and its approved Persian equivalent).
- Keep the selector visually associated with pagination. It may sit beside the page controls on desktop and stack above/below them on mobile, but must remain at the end of the listing.

### URL and browser history
Pagination state should be shareable and resilient to refresh. Use query parameters on the existing localized Galleries route:
- `page`: one-based page number; omit it for page 1.
- `pageSize`: selected value `5`, `10`, or `20`; omit it for the default value 5.

Examples:
- `/fa/galleries` → page 1, 5 per page.
- `/fa/galleries?page=2` → page 2, 5 per page.
- `/en/galleries?page=1&pageSize=10` → page 1, 10 per page (canonical serialization may omit default page 1).

Requirements:
- Parse query values defensively. Invalid, non-integer, zero/negative, or unsupported page-size values must not crash rendering.
- Unsupported `pageSize` falls back to 5.
- Invalid page falls back to 1.
- If the requested page exceeds the calculated final page (for example after content changes), normalize to the last valid page; if no published galleries exist, normalize to the empty state.
- Changing page or page size updates the URL without dropping the locale or unrelated supported query parameters.
- Browser Back/Forward restores the corresponding page and page-size state.
- Directly loading a valid paginated URL and refreshing it must render the same result.
- Prefer the framework's existing navigation/search-parameter patterns; do not introduce a new routing library or bespoke history manager.
- Avoid unnecessary full-page reloads when the existing App Router can update search parameters client-side.
- Canonical metadata should remain the canonical Galleries index URL, not create separate indexable pages for every page-size/page query. Follow the repository SEO conventions for pagination query URLs.

### Content changes between requests
- If galleries are added, removed, unpublished, or reordered, compute pagination from the current eligible published dataset.
- Never show duplicates or skip items because of stale client state.
- If the current page becomes invalid, normalize it to the last valid page.
- Do not cache stale total counts independently of the gallery data.

## 8. Empty and boundary states

### No published galleries
- Show the existing approved empty-state treatment or a quiet page with the localized page heading and no gallery cards.
- Do not show fake posters, example cards, empty pagination controls, page-size selector, or a “0 of 0” control state unless the existing design system explicitly defines it.
- Keep the route stable and free of runtime errors.

### One through five galleries
- Show all eligible cards on the first page.
- Do not show page navigation or page-size selection when only one page exists.

### More than five galleries
- Show exactly five cards by default on page 1.
- Show the pagination area and page-size selector at the end of the listing.
- A selected page size of 10 or 20 shows up to that many cards on each page.

### Last page
- Show only the remaining cards; do not pad with duplicates or placeholders.
- Disable Next.
- Keep Previous enabled when a previous page exists.

### One-page result after selection
- If a page-size change results in one page, hide numbered navigation and previous/next controls. The page-size selector may remain visible only if the product decision is to keep it discoverable; default behavior is to hide the complete pagination region when there is only one page.

## 9. Localization and directionality

Support Persian and English with the same functionality and content hierarchy.

Persian (`fa`):
- Page direction is RTL.
- Grid reading order follows the Persian editorial order.
- Pagination labels and accessible names are Persian.
- Previous/next visual placement and movement semantics must be tested in RTL; do not assume a left/right icon direction without verifying its meaning.
- Page numbers may remain Western numerals if that matches the site's existing numeral policy; use one consistent policy across the control and do not mix formats.

English (`en`):
- Page direction is LTR.
- Grid reading order follows the same underlying editorial order.
- Pagination labels and accessible names are English.
- Previous/next placement and icon direction follow LTR semantics.

Do not reverse the data order when switching locale unless the existing content model explicitly defines locale-specific editorial ordering. Preserve equivalent page/page-size state when switching locale if the equivalent localized route exists.

## 10. Accessibility

Target the repository's WCAG 2.2 AA contract.

- Use a semantic list/grid structure for the gallery collection and semantic links for cards.
- Pagination is a labelled navigation landmark (for example, `aria-label="Gallery pages"` localized appropriately).
- Expose current page with `aria-current="page"`.
- Previous/Next controls have localized accessible names; icon-only controls must not be unnamed.
- Disabled controls must be programmatically disabled, not merely styled as inactive.
- The page-size control has a visible, associated label and a semantic select/listbox implementation.
- Keyboard users can reach every card, page control, and page-size option in a logical order.
- Focus indicators are visible and not clipped.
- After page navigation, move focus or announce the updated results in a predictable accessible manner without unexpectedly stealing focus from unrelated UI. Prefer a polite live status for the displayed range/page when appropriate.
- After changing page size, announce the updated page/result state.
- Ensure the page does not rely on color alone to indicate the active page.
- Preserve adequate contrast, touch target size, and browser zoom/reflow behavior.
- Respect reduced-motion settings; pagination should not introduce motion beyond restrained existing transitions.

Suggested status text: “Showing 6–10 of 18 galleries” with localized Persian equivalent. The range and total must be computed from the actual published dataset, not hardcoded.

## 11. Performance and implementation constraints

- Pagination should be deterministic and computed from the already validated published gallery collection.
- Do not fetch or render every gallery image in the browser if the existing data architecture can provide only the current page's records. If the content is statically bundled and small, slice the validated data at render time and lazy-load non-visible card images.
- Use stable gallery IDs/keys.
- Avoid layout shift by reserving image dimensions.
- Lazy-load below-the-fold poster images; prioritize only an image that is genuinely above the fold.
- Do not add a dependency solely for pagination if the existing framework and shadcn primitives are sufficient.
- Do not duplicate gallery data in a new pagination-specific store.
- Keep page size and page state as URL-derived state; avoid conflicting independent sources of truth.
- Do not alter the homepage carousel primitive or its usage to implement this page.

## 12. Suggested wireframes

### Desktop — default page size (5)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Existing site shell / navigation                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Galleries                                                           │
│  Optional approved introductory sentence                             │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐          │
│  │                │  │                │  │                │          │
│  │  Gallery       │  │  Gallery       │  │  Gallery       │          │
│  │  poster 01     │  │  poster 02     │  │  poster 03     │          │
│  │                │  │                │  │                │          │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤          │
│  │ Title          │  │ Title          │  │ Title          │          │
│  │ Short text     │  │ Short text     │  │ Short text     │          │
│  └────────────────┘  └────────────────┘  └────────────────┘          │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐                              │
│  │ Gallery        │  │ Gallery        │                              │
│  │ poster 04      │  │ poster 05      │                              │
│  ├────────────────┤  ├────────────────┤                              │
│  │ Title          │  │ Title          │                              │
│  │ Short text     │  │ Short text     │                              │
│  └────────────────┘  └────────────────┘                              │
│                                                                      │
│  Showing 1–5 of N galleries              Items per page [ 5  v ]    │
│                                                                      │
│             [Previous]  [1] [2] [3] [Next]                           │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ Existing footer                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

The exact alignment of the range summary, selector, and page controls may follow the existing design tokens and reference page; their semantic order and placement after the cards are fixed.

### Mobile — page end

```text
┌──────────────────────────────┐
│ Existing mobile site shell    │
├──────────────────────────────┤
│ Galleries                     │
│                              │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │      Gallery poster      │ │
│ │                          │ │
│ ├──────────────────────────┤ │
│ │ Gallery title            │ │
│ │ Short approved text      │ │
│ └──────────────────────────┘ │
│                              │
│       ... next cards ...     │
│                              │
│ Showing 1–5 of N             │
│ Items per page               │
│ [ 5                 v ]      │
│                              │
│ [Previous]  [1] [2] [Next]   │
│                              │
│ Existing footer              │
└──────────────────────────────┘
```

On mobile, controls may wrap or stack; they must not overflow horizontally or become too small to operate.

### Persian RTL
Use the same structure with RTL reading order and Persian labels. The desktop sidebar remains physically left according to the global navigation specification; this document does not change its placement.

## 13. Test and acceptance matrix

### Data and pagination unit tests
- Page size defaults to 5.
- Only 5, 10, and 20 are accepted.
- Unsupported page size falls back to 5.
- Missing, malformed, zero, negative, decimal, and non-numeric page values normalize to page 1.
- Total page count is correct for 0, 1, 5, 6, 10, 11, 20, 21, and larger gallery counts.
- Current-page slice has no duplicate or missing records.
- Final page contains only remaining records.
- Page beyond final page normalizes to the last valid page.
- Empty dataset has no pagination.
- Changing page size resets page to 1.
- Gallery ordering is stable and editorially correct.
- Only published, localized, rights-approved galleries are eligible.

### Component and route tests
- Main Galleries index renders poster cards, never a carousel component.
- With 5 or fewer galleries, no pagination region is rendered.
- With 6 published galleries and page size 5, page 1 shows exactly 5 and page 2 shows 1.
- Page size 10 renders up to 10; page size 20 renders up to 20.
- Selector exposes exactly 5, 10, and 20.
- Previous/Next enabled/disabled states are correct.
- Numbered controls select the correct page.
- Direct URL with `page` and `pageSize` renders the matching slice.
- Refresh preserves the same page and page size.
- Back/Forward restores pagination state.
- Changing locale preserves equivalent page and page-size state where the route exists.
- Query parameters are normalized without dropping locale or unrelated supported parameters.
- No draft/unapproved gallery appears in any page.
- Gallery card links navigate to the matching detail route.

### Responsive and visual tests
Capture both locales at:
- 320×568 and 390×844 mobile.
- 768×1024 tablet.
- 1024×768 compact desktop.
- 1440×900 desktop.
- 1920×1080 wide desktop.
- Short-height desktop/landscape.

Verify:
- One-column mobile, two-column tablet, and appropriate multi-column desktop grid.
- No horizontal overflow.
- Consistent poster frames and preserved artwork proportions.
- Titles/descriptions readable without hover.
- Pagination follows the final card in DOM and visual order.
- Page-size selector and pagination controls wrap/stack correctly.
- RTL order and previous/next semantics are correct.
- Focus indicators are visible and not clipped.

### Regression protection — mandatory
- Homepage Selected Works carousel remains present and behaviorally unchanged.
- Existing homepage carousel controls, keyboard navigation, RTL/LTR direction, slide ordering, responsive behavior, and Artwork Viewer integration continue to pass their existing tests.
- The main Galleries index does not import or render the carousel component.
- Gallery detail page behavior is unchanged.
- No changes to shared carousel implementation, homepage carousel configuration, homepage markup, or homepage carousel styles are required for this page-specific work.
- Add an explicit regression assertion that the homepage still renders its carousel and that the Galleries index does not.

## 14. Definition of done

The main Galleries index is complete only when:
1. It displays static gallery poster cards in a responsive grid.
2. It shows 5 galleries by default.
3. When more than 5 galleries are published, pagination appears at the bottom.
4. Visitors can select exactly 5, 10, or 20 items per page.
5. Pagination, page-size selection, URL state, refresh, and browser history work correctly.
6. Persian RTL and English LTR layouts and labels are verified.
7. Empty, boundary, and content-change states are correct.
8. Accessibility, responsive screenshots, and automated tests pass.
9. The homepage Selected Works carousel is demonstrably unchanged.
10. No unapproved content or assets are introduced.

## 15. Implementation handoff

Before coding:
- Read this document and all related specifications listed above.
- Inspect the actual Galleries route, gallery data model, current card implementation, current query-parameter conventions, existing shadcn Select/Pagination primitives, and homepage carousel tests.
- Identify the smallest isolated change set limited to the main Galleries index and its tests.
- Do not assume the route or component paths; use the repository's actual structure.
- Keep the implementation on the authorized feature branch.
- Do not merge, deploy, or modify `main` unless separately authorized.
- Do not alter the homepage carousel under any circumstances as part of this task.
- Record implementation evidence, test results, screenshots, CI run, and outstanding content/artist approvals in the existing project progress documentation.
