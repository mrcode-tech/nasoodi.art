# Selected Artwork and Viewer Experience — Technical Specification

## Purpose

Define the technical behavior of selected artwork presentation, archive discovery, and the shared artwork viewer.

## Data source

- Artwork records are loaded through the canonical artwork repository.
- Homepage selection stores stable artwork IDs, not duplicated editorial records.
- Only eligible published records are rendered in public surfaces.
- Localized titles and descriptions are resolved for the active locale.
- No specific production artwork IDs, titles, dates, or image filenames belong in this specification.

## Homepage selection

- The homepage presents a curated selection through the shared responsive carousel.
- The carousel adapts visible items to viewport size.
- Ordering follows the configured selection order or documented domain sort contract.
- The section remains usable when the selection is empty, contains one item, or contains multiple items.
- A primary action links to the localized artwork archive.

## Artwork viewer

- Selecting an artwork opens an accessible modal/dialog viewer.
- The viewer displays the selected image, localized title, and optional description.
- Previous and next controls navigate within the active selection context.
- Controls are disabled at boundaries when looping is not part of the component contract.
- Escape and close controls dismiss the viewer.
- Focus returns to the invoking item after dismissal.
- Browser history and query-state behavior follow the route/viewer contract.
- Viewer state must not expose unpublished records.

## Collection-scoped navigation

- When opened from a collection, viewer navigation is restricted to that collection's ordered artwork references.
- The originating collection context is represented by a stable collection identity, not a hardcoded localized slug.
- A detail route may show a collection breadcrumb only when the origin is validated.
- Invalid origin context falls back to the canonical artwork route without a misleading collection breadcrumb.

## Responsive and accessibility behavior

- The image remains within the available viewport.
- Artwork proportions are preserved.
- Long localized titles and descriptions wrap safely.
- Controls remain visible at mobile and short-height desktop sizes.
- Keyboard navigation, visible focus, and reduced-motion preferences are supported.

## Automated tests

Use synthetic artwork and collection fixtures. Verify empty/single/multiple-item states, viewer navigation, collection scoping, focus restoration, route context, localization, and image loading. Do not assert production titles, filenames, or record counts.
