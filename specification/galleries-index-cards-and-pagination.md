# Collection Archive — Cards and Pagination Specification

## Purpose

Define the localized collection archive layout, card behavior, and pagination independently of the current editorial dataset.

## Layout

- Render a responsive static-card grid, not a carousel.
- Each card may include a cover image, localized title, optional summary, and detail link.
- Card layout remains consistent when titles, summaries, and source-image aspect ratios vary.
- Images preserve their full composition using the documented contain behavior.
- Empty and missing optional values must not break card alignment.
- Use theme tokens for image-frame backgrounds.

## Ordering

- Order records using the configured collection sort key.
- Use deterministic tie-breaking for equal sort values.
- Localized title changes must not alter record identity or ordering unless the explicit sort key changes.

## Pagination

- Default page size: 6.
- Additional page sizes: 10 and 20.
- Page and page-size state are reflected in URL query parameters.
- Changing page size resets or clamps the current page according to the shared pagination utility.
- The next page must display a distinct slice when more records are available.
- Empty datasets and final pages must not display invalid navigation controls.
- Pagination must adapt to any valid number of published records.

## Localization

- The archive is available under both supported locales.
- English uses LTR; Persian uses RTL.
- Card links use localized slugs resolved through stable record IDs.
- Pagination labels and status text use localized interface messages and locale-appropriate numerals.

## Automated tests

Use generated collection datasets of different sizes. Validate ordering, pagination slices, URL state, localized route resolution, image containment, and responsive card layout. Do not assert current production collection count, titles, slugs, IDs, or image filenames.
