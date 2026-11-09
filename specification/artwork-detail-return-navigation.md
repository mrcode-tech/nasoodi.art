# Artwork Detail — Return to Artworks Navigation Proposal

**Status:** Approved proposal for implementation planning  
**Scope:** A predictable return path from an artwork detail view to the Artworks archive, including restoration of archive pagination state  
**Locales:** Persian (`fa`) and English (`en`)  
**Related specifications:** `gallery-collections-and-artwork-detail.md`, `galleries-index-cards-and-pagination.md`, `testing-qa-and-release.md`, `localization-and-editorial-governance.md`

## 1. Problem

When a visitor opens an artwork from a paginated Artworks archive, the detail view should provide an explicit way to return to the archive. Returning should restore the page the visitor came from and the selected page size, rather than silently sending them to the first archive page.

This must also work when the detail route is opened directly from a bookmark, external link, search result, or refreshed browser tab.

## 2. User experience

- Add a quiet, clearly identifiable **Back to Artworks** control near the beginning of the artwork detail content, before the primary artwork presentation.
- English label: **Back to Artworks**.
- Persian label: **بازگشت به آثار**.
- Use the existing link/button and typography conventions; do not introduce a new visual component system.
- The directional arrow, if used, must follow the active locale direction and must not be embedded in a way that produces incorrect bidi ordering.
- Keep the control visually secondary to the artwork. It must remain keyboard accessible, have a visible focus state, and expose a clear accessible name.
- Preserve the existing artwork detail layout and artwork presentation.

## 3. Return-state contract

The originating Artworks archive URL is the source of truth for the return destination.

At minimum, preserve:
- Current archive page.
- Selected page size.

Also preserve any archive state that the existing implementation actually supports and that affects the visible result, such as search/filter/sort parameters. Do not invent new filters or query conventions for this feature.

Example only (not a mandate for parameter names):

```text
/en/artworks?page=3&pageSize=10
```

Implementation requirements:
1. Inspect the current archive route, pagination utility, query parameter names, and artwork-link construction before choosing an implementation.
2. Carry the originating archive location into the artwork detail navigation using the smallest compatible mechanism.
3. Prefer the URL as durable, shareable state. Avoid introducing global state or localStorage when the existing route/query architecture can preserve the context.
4. Keep the canonical artwork URL and SEO metadata independent of transient return context. Return context must not create duplicate canonical URLs or pollute sitemap entries.
5. Preserve locale and all supported archive query parameters exactly where valid.
6. Validate and normalize incoming return destinations. Accept only a same-origin, internal Artworks archive path for the current locale; reject external URLs, protocol-relative URLs, malformed values, other route families, and cross-locale destinations.
7. If the return context is missing or invalid, navigate to the localized default Artworks archive route.
8. Do not rely exclusively on `router.back()`: browser history may be absent or may point outside the site.
9. Browser Back/Forward should continue to behave naturally. Refreshing the artwork detail page must not destroy a valid return destination.

The example query string above is illustrative. The implementation must use the repository's actual route and pagination contract.

## 4. Navigation behavior

- Opening an artwork from archive page N with page size S and activating Back to Artworks returns to the same localized archive state.
- If the archive supports additional state, such as filtering or sorting, that state is retained when it is part of the originating URL.
- Opening an artwork directly without return context falls back to the localized Artworks archive default.
- Invalid or malicious return values fall back safely; they must never cause an external redirect or route users to an unrelated page.
- Reloading the detail page preserves a valid return target.
- The control works with mouse, touch, keyboard, and assistive technology.
- The control remains correctly positioned and readable in English LTR and Persian RTL, across supported breakpoints and themes.

## 5. Architecture and security

- Reuse the existing App Router, navigation helpers, localized route conventions, and shadcn/ui primitives.
- Keep return-target parsing/validation in a small reusable route/navigation utility if the existing architecture warrants it; do not scatter ad hoc URL parsing across components.
- Parse query parameters with standard URL APIs and allowlist the archive path and supported query keys/values.
- Do not trust a raw return URL from the browser or content data.
- Do not use a return-context value to construct canonical metadata, Open Graph URLs, sitemap URLs, or structured data.
- Do not add dependencies, a global navigation store, cookies, or persistent browser storage unless repository inspection demonstrates a concrete need and the choice is documented.

## 6. Localization and visual requirements

- Add both labels to the centralized UI message catalogs; do not hardcode translated strings in components.
- Keep English LTR and Persian RTL semantics correct.
- Use CSS logical properties and the shared design tokens.
- Reuse existing link/button styling and icon conventions.
- Avoid a prominent filled button, card, divider, or large navigation banner. The control should be discreet and editorial.
- Verify light and dark themes and desktop, tablet, and mobile layouts.
- Respect reduced-motion preferences; no new animation is required.

## 7. Acceptance criteria

1. A visitor opening an artwork from any valid Artworks archive page can return to that same page.
2. The selected page size is restored.
3. All currently supported archive query state is preserved.
4. The implementation uses the repository's actual route/query conventions.
5. A direct artwork visit has a safe, localized Artworks archive fallback.
6. Invalid, external, cross-locale, and unrelated return destinations are rejected.
7. Refreshing the artwork detail page does not lose a valid return destination.
8. Browser Back/Forward behavior remains functional.
9. English and Persian labels are localized centrally, with correct LTR/RTL presentation.
10. The control is accessible and responsive and does not visually compete with the artwork.
11. Artwork canonical URLs and SEO metadata remain stable and independent of return context.
12. Automated tests use synthetic data and do not depend on production artwork names, slugs, IDs, image filenames, or record counts.

## 8. Required test coverage

### Unit tests
- Valid same-locale Artworks archive return path.
- Preservation of page and page-size parameters.
- Preservation of other supported archive parameters.
- Missing, malformed, encoded, duplicated, and invalid query values.
- Rejection of external/protocol-relative URLs, cross-locale paths, unrelated route families, and unsafe paths.
- Safe localized default fallback.

### Integration/component tests
- Archive artwork links carry the originating archive context.
- Detail page renders the localized return control.
- Return action resolves to the validated archive URL.
- Direct detail entry uses the fallback.
- Canonical and social metadata do not include transient return context.

### Playwright/browser tests
- Start from a synthetic or dynamically discovered archive record on a non-default page and non-default page size; open an artwork and return.
- Assert the archive page, selected page size, and distinct visible slice are restored.
- Repeat in both locales.
- Exercise direct detail entry, refresh, browser Back/Forward, and invalid return context.
- Verify keyboard focus, accessible name, RTL/LTR direction, responsive layout, and no horizontal overflow.
- Do not assert production editorial values or fixed production record counts.

## 9. Out of scope

- Redesigning the Artworks archive or artwork detail page.
- Changing pagination defaults, supported page sizes, sorting, or filters.
- Adding new archive filters.
- Changing artwork identity, localized slugs, publication rules, or content records.
- Reworking the gallery Artwork Viewer or collection navigation beyond what is required for this return control.
- Adding global state, cookies, localStorage, analytics, or new dependencies without a demonstrated need.
- Merging, deploying, or publishing the feature.

## 10. Implementation decision rule

First inspect the current implementation and reconcile this proposal with the established route and viewer architecture. The implementation must preserve existing behavior and use the least complex durable mechanism. If the current artwork experience is a modal/viewer layered over the archive rather than a standalone detail page, preserve that architecture and restore the exact originating archive state and focus target instead of forcing a new route design.
