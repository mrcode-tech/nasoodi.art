# Portfolio content source

This directory separates owner-editable editorial data from TypeScript domain contracts and application behavior.

## Canonical data

- `data/artworks.json`: artwork identity, localized titles/descriptions, approved image references, rights state, and editorial order.
- `data/galleries.json`: gallery metadata, cover artwork IDs, ordered artwork membership, and publication state.
- `data/journal/index.json`: Journal identity, localized metadata, publication approvals, event facts, and cover-artwork relationships.
- `data/journal/body.en.md` and `body.fa.md`: long-form Journal prose. Each entry begins with an HTML comment marker containing its stable ID. The generation script validates one-to-one record coverage and emits a TypeScript string module for the application bundle.
- `data/homepage-selection.json`: homepage featured content IDs and ordering.
- `data/artist-profile.json`, `data/cv-entries.json`, and `data/cv-document.json`: canonical profile/CV records. They intentionally remain empty until verified artist content is supplied.
- `data/contact.json`: owner-authorized demo contact fixture. Replace it with confirmed real destinations before launch.

## TypeScript adapters and services

- `artist.ts`, `artworks.ts`, `contact.ts`, `cv.ts`, `galleries.ts`, `homepage.ts`, and `journal.ts` expose typed records to existing consumers.
- `artworks.ts` joins JSON artwork records with dimensions generated from the approved source photographs; dimensions are not duplicated in editorial JSON.
- `journal.ts` resolves cover artwork IDs and adapts generated Markdown into the existing typed rich-text block model. `predev`, `prebuild`, `pretypecheck`, and `pretest` regenerate the Markdown module from the source files; the application bundle does not import Node filesystem APIs.
- Domain contracts live in `src/types/content.ts`; publication, validation, lookup, and route resolution live in `src/lib/content/`.
- `portfolio-structured-data.ts` remains code-owned site/artist identity graph data, not editorial artwork or Journal content.

## Ownership rules

1. Content records contain data only; no JSX, rendering, or route behavior.
2. UI labels belong in `src/i18n/messages/{locale}/`, never in editorial records.
3. Components and route modules import the specific domain module they need. Do not add an aggregate compatibility barrel.
4. Stable IDs connect translations and relationships. Localized slugs are route values, not identity.
5. Publication, artist approval, locale approval, and asset-rights checks remain mandatory. A record existing in JSON does not itself authorize publication.
6. Content-only additions must not require React component or route changes. Run content validation, unit tests, and bilingual route/metadata checks after editing records.
7. Do not invent artist facts, translations, artwork metadata, event details, or CV entries. Missing information stays absent.
