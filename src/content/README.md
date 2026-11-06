# Portfolio content source

This directory separates owner-editable editorial JSON from TypeScript domain contracts and application behavior.

## Canonical data

- `data/site.json`: localized editorial metadata for the site-wide Works, Galleries, Journal, and CV archive pages.

- `data/artworks.json`: artwork identity, localized titles/descriptions, approved image references, rights state, and editorial order.
- `data/galleries.json`: gallery metadata, cover artwork IDs, ordered artwork membership, and publication state.
- `data/journal/index.json`: Journal identity, localized metadata, complete localized rich-text bodies, event details, and cover-artwork relationships. Each entry contains its English and Persian body as structured JSON blocks.
- `data/homepage-selection.json`: homepage featured content IDs and ordering.
- `data/artist-profile.json`: the single localized artist profile, including biography, statement, identity, and profile copy.
- `data/cv.json`: the single CV record, containing ordered entries and the optional downloadable document reference.
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


## Editorial editing guide

Edit the canonical JSON file for the domain you are changing. Keep the existing stable IDs, asset paths, and relationships unless the content itself is intentionally being replaced. Use valid JSON (double quotes, no trailing commas) and provide every required locale value.

### Artist profile and About

Edit `data/artist-profile.json`. The homepage biography and About page read this same record.

```json
{
  "id": "artist-profile",
  "name": { "en": "Ghazale Abdolahzade Nasoodi", "fa": "غزاله عبداله زاده نسودی" },
  "slug": { "en": "ghazale-abdolahzade-nasoodi", "fa": "غزاله-عبداله-زاده-نسودی" },
  "shortIntroduction": { "en": "A concise introduction.", "fa": "معرفی کوتاه هنرمند." },
  "biography": { "en": "Biography paragraph.", "fa": "پاراگراف زندگی‌نامه." },
  "statement": { "en": "Artist statement.", "fa": "بیانیه هنری." }
}
```

Keep factual details accurate and owner-supplied. The current record also supports discipline, artistic approach, interests, and an optional portrait.

### CV

Edit `data/cv.json`. Add entries to its `entries` array; each entry needs a stable ID, category, localized title, and either a year or a localized period. The optional `document` property points to an actual PDF stored in the approved public assets.

```json
{
  "id": "cv-entry-id",
  "category": "group-exhibition",
  "title": { "en": "Exhibition title", "fa": "عنوان نمایشگاه" },
  "organization": { "en": "Organization", "fa": "نام برگزارکننده" },
  "location": { "en": "City, Country", "fa": "شهر، کشور" },
  "year": 2026,
  "status": "published",
  "sortOrder": 1
}
```

Do not invent education, exhibitions, awards, institutions, or dates. Use only facts supplied by the artist/owner.

### Artwork

Add a record to `data/artworks.json`, preserving the exact approved image path and using a unique stable ID. Add the artwork to the relevant gallery's `artworkIds` and, when appropriate, to `homepage-selection.json`.

```json
{
  "id": "artwork-stable-id",
  "slug": "localized-route-slug",
  "localizedSlugs": { "en": "english-slug", "fa": "persian-slug" },
  "title": { "en": "Artwork title", "fa": "عنوان اثر" },
  "description": { "en": "Description.", "fa": "شرح اثر." },
  "images": [{
    "src": "/images/approved-artwork.jpg",
    "alt": { "en": "Description of the painting", "fa": "توصیف نقاشی" },
    "role": "primary"
  }],
  "rightsConfirmed": true,
  "status": "published",
  "sortOrder": 6
}
```

Do not create or rename image assets as part of a content-only edit. Confirm image rights and preserve original artwork fidelity.

### Gallery

Add a record to `data/galleries.json`. `coverArtworkId` must also appear in `artworkIds`, and every referenced ID must exist in `artworks.json`.

```json
{
  "id": "gallery-stable-id",
  "slug": "gallery-slug",
  "localizedSlugs": { "en": "gallery-slug", "fa": "شناسه-مسیر" },
  "title": { "en": "Collection title", "fa": "عنوان مجموعه" },
  "description": { "en": "Collection description.", "fa": "شرح مجموعه." },
  "coverArtworkId": "artwork-stable-id",
  "artworkIds": ["artwork-stable-id"],
  "status": "published",
  "sortOrder": 5
}
```

### Journal article and event

Add an entry to `data/journal/index.json`. Keep the stable `id`; provide localized title, summary, slug, and rich-text body blocks in both locales. Event entries also require a valid start instant with an explicit UTC offset, an IANA time zone, and the appropriate event details.

```json
{
  "id": "journal-entry-id",
  "slug": "article-slug",
  "localizedSlugs": { "en": "article-slug", "fa": "مقاله" },
  "type": "story",
  "title": { "en": "Article title", "fa": "عنوان مقاله" },
  "summary": { "en": "Short summary.", "fa": "خلاصه کوتاه." },
  "body": {
    "en": [{ "type": "paragraph", "text": "Article paragraph." }],
    "fa": [{ "type": "paragraph", "text": "پاراگراف مقاله." }]
  },
  "status": "published",
  "publishedAt": "2026-11-05T09:00:00Z",
  "approvedLocales": ["en", "fa"],
  "artistApproved": true
}
```

Supported rich-text blocks are `paragraph`, `heading`, `quote`, `list`, and safe `link`. Do not create Markdown files or generated content modules.

For an event, set `type` to `event` or `exhibition` and add an `event` object with `startsAt`, optional `endsAt`, `timeZone`, localized `venue` when applicable, and `attendanceMode`.

### Contact and site metadata

- Edit `data/contact.json` for the localized Contact page title/description and owner-supplied contact methods.
- Edit `data/site.json` for localized Works, Galleries, Journal, and CV archive metadata.
- Do not invent contact addresses or social handles.

### Adding another language

1. Register the locale and its direction in the locale configuration.
2. Add the matching next-intl message namespace files.
3. Add the locale key to every required editorial JSON field.
4. Add explicit localized slugs for routable records.
5. Run the i18n audit, content validation, unit tests, Playwright routes, and rendered metadata checks.

### Validation and tests

Run `npm run audit:i18n`, `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, and `npm run test:e2e`. The CI workflow runs these checks on pushes to `feature`, `stage`, and `main`. A content edit is not complete until JSON validation, relationships, localized routes, metadata, and rendered output have been checked.
