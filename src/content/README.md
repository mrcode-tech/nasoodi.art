# Portfolio content source

This directory contains owner-editable portfolio records, separated by domain:

- `artist.ts`: artist profile and statement/biography source.
- `artworks.ts`: canonical artwork records and their approved image references.
- `galleries.ts`: curated gallery records and ordered artwork identities.
- `journal.ts`: Journal articles and event records.
- `cv.ts`: verified CV records and the optional approved PDF reference.
- `contact.ts`: owner-authorized demo contact destinations.
- `homepage.ts`: editorial selection by stable content IDs.
- `portfolio-structured-data.ts`: code-owned site/artist identity graph.

## Ownership rules

1. Content records contain data only; no JSX, rendering, or route behavior.
2. UI labels belong in `src/i18n/messages/{locale}/`, never in these records.
3. Domain contracts live in `src/types/content.ts`; publication, validation, lookup, and route resolution live in `src/lib/content/`.
4. Components and route modules import the specific domain module they need. Do not add an aggregate `portfolio.ts` or general-purpose `site.ts` compatibility barrel.
5. Stable IDs connect translations and relationships. Localized slugs are route values, not identity.
6. Publication and artist/rights approval checks remain mandatory; a record existing here does not itself authorize publication.

## Content format decision

For new editorial records, prefer JSON for structured fields and Markdown for long-form prose. Keep TypeScript for domain types, validation/behavior, generated image-dimension data, and small code-owned configuration. Existing typed records are being migrated incrementally because artwork dimensions are generated from approved source images and Journal rich text currently has typed block semantics. Do not move or reformat an entire content family without preserving its exact content, stable IDs, localized slugs, publication state, ordering, and rendered output.

A content-only addition must not require changes to a React component, page route, or SEO implementation. Run the content validation tests and bilingual route/metadata checks after editing records.
