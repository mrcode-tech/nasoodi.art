# Portfolio content source

This directory separates owner-editable editorial JSON from TypeScript domain contracts and application behavior.

## Canonical data

- `data/artworks.json`: artwork identity, localized titles/descriptions, approved image references, rights state, and editorial order.
- `data/galleries.json`: gallery metadata, cover artwork IDs, ordered artwork membership, and publication state.
- `data/journal/index.json`: Journal identity, localized metadata, complete localized rich-text bodies, event details, and cover-artwork relationships. Each entry contains its English and Persian body as structured JSON blocks.
- `data/homepage-selection.json`: homepage featured content IDs and ordering.
- `data/artist-profile.json`, `data/cv-entries.json`, and `data/cv-document.json`: current artist profile and CV records. These are the canonical sources; do not add preview fixtures or environment-specific alternatives.
- `data/contact.json`: the single Contact configuration. Only owner-supplied contact destinations may be published; do not invent addresses or handles.

## TypeScript adapters and services

- `artist.ts`, `artworks.ts`, `contact.ts`, `cv.ts`, `galleries.ts`, `homepage.ts`, and `journal.ts` expose typed records to application consumers.
- `artworks.ts` joins JSON artwork records with dimensions generated from the approved source photographs; dimensions are not duplicated in editorial JSON.
- `journal.ts` resolves cover artwork IDs and adapts the JSON rich-text records to the existing page model. Journal body content is not generated from Markdown.
- Domain contracts live in `src/types/content.ts`; publication, validation, lookup, and route resolution live in `src/lib/content/`.

## Ownership rules

1. Editorial content is stored in JSON; UI labels belong in `src/i18n/messages/{locale}/`.
2. Keep one canonical record per entity, with stable IDs and locale-keyed values.
3. Localized slugs are route values, not identity.
4. Preserve artwork rights and publication safeguards; never invent artwork metadata or assets.
5. Content records contain data only. React components and route modules must not read JSON files directly.
6. Content-only additions should not require React component or route changes. Run content validation, unit tests, and bilingual route/metadata checks after editing.
7. Missing factual CV details must not be replaced with fabricated qualifications, awards, or exhibitions.
