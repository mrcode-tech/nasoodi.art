# Content Architecture and Separation from Application Logic

**Status:** Proposed implementation contract

## 1. Purpose

Separate owner-editable website content from UI translations, application logic, utilities, and TypeScript domain definitions. Adding an artwork, gallery, Journal article, event, artist profile field, CV entry, or contact content should normally require editing or adding a content record—not changing React components or general utility modules.

The site is an editorial artist portfolio. Content should be straightforward to maintain, while code owns validation, rendering, routing, and behavior.

## 2. Four distinct responsibilities

1. UI translation: stable interface labels and messages. Governed by internationalization-and-ui-translation-architecture.md.
2. Editorial content: artist facts and published portfolio material (artworks, galleries, Journal, events, biography, statement, CV, contact).
3. Domain types and schemas: TypeScript types and runtime validation for valid content shapes.
4. Application logic/utilities: loading, selecting, filtering, slug resolution, publication eligibility, formatting, SEO generation, and reusable behavior.

Content is data. Types describe data. Utilities operate on data. Components present data. Keep dependencies one-directional.

## 3. Proposed directory structure

Reconcile this proposal with the existing repository before moving files:

src/
  content/
    artist/
      profile.json
      statement.en.md
      statement.fa.md
      biography.en.md
      biography.fa.md
      cv.en.json
      cv.fa.json
    artworks/
      artwork-id/
        artwork.json
        description.en.md
        description.fa.md
    galleries/
      gallery-id.json
    journal/
      entry-id/
        entry.json
        body.en.md
        body.fa.md
    events/
      event-id.json
    contact/
      contact.json
  messages/
    en.json
    fa.json
  types/
    content.ts
    locale.ts
  lib/
    content/
      load-content.ts
      resolve-localized-content.ts
      publication.ts
      routes.ts
    validation/
      content-schemas.ts

This is conceptual, not a mandate to create many tiny files. Prefer cohesive, readable records. Do not proliferate files without a content ownership benefit.

## 4. Correct ownership

- UI labels/buttons/accessibility phrases: locale message bundles.
- Artist name, biography, statement, CV: artist content.
- Artwork title, description, medium, dimensions, image refs: artwork records.
- Gallery title, description, membership/order: gallery records.
- Journal title, summary, body, author/date: Journal records.
- Event title, dates, venue, description: event records.
- Public contact copy/destinations: contact content/config with appropriate approval state.
- TypeScript interfaces/unions: domain type modules.
- Runtime validation: schema modules.
- Sorting, lookup, slug resolution, publication checks: content services/utilities.
- Rendering and interaction: React components/routes.
- Metadata generation: SEO modules consuming resolved content.

General utils.ts/util.ts must not become a dumping ground for artist content, JSON dictionaries, route records, and unrelated helpers.

## 5. Format selection

Use the simplest suitable format:
- JSON for structured records and relationships.
- Markdown for long-form prose when editorial readability matters.
- TypeScript for behavior and genuinely code-owned static configuration—not as the default store for frequently edited editorial content.

Do not adopt a database or headless CMS merely to separate content. File-based content is appropriate for this portfolio unless the owner later needs a non-developer editing interface, collaborative editorial workflow, or dynamic publishing. If a CMS is introduced, preserve schemas and the content-service boundary so UI components remain vendor-independent.

## 6. Localized editorial model

Editorial content is separate from UI messages. Use stable identity independent of localized slug/title. Example:

{
  "id": "stable-artwork-id",
  "status": "draft",
  "locales": {
    "en": {
      "slug": "spring-garden",
      "title": "Spring Garden",
      "description": "Approved English description",
      "alt": "Approved image description"
    },
    "fa": {
      "slug": "bagh-bahar",
      "title": "باغ بهاری",
      "description": "توضیح تأییدشده فارسی",
      "alt": "توصیف فارسی تصویر"
    }
  },
  "images": {
    "primary": "/images/approved-artwork.jpg"
  }
}

Illustrative only; never invent or approve artist content. Stable identity connects translations and supports language switching/hreflang. Missing translations remain unavailable; never silently borrow prose or metadata from another locale. Store shared facts such as dates, dimensions, and image IDs in normalized fields where practical.

## 7. Schema and validation

Define typed domain models and runtime validation. Validate at build time or through a dedicated command:
- Unique stable IDs and locale-specific slugs.
- Supported locales and required localized fields.
- Valid image references and approved asset status.
- Valid dates, dimensions, and enumerated values.
- Valid gallery/artwork and Journal/artwork relationships.
- Publication and approval requirements.
- Duplicate routes and unsupported fields.

Use a schema dependency only when justified. TypeScript types alone do not validate JSON at runtime.

## 8. Editorial workflow

Align states with localization-and-editorial-governance.md: draft, needs-review, approved, published, archived.

A content-only change should involve editing the relevant record/prose, running validation/tests, reviewing rendered locales and assets, obtaining approval for factual/visual/linguistic/rights-sensitive changes, and following the authorized release process.

Adding an artwork must not require editing a carousel component, page component, or general utility. Existing content queries should discover eligible records and render them through shared presentation logic.

## 9. Logic and component boundaries

- Components receive validated presentation-ready props/view models.
- Components do not import raw content files throughout the tree.
- Route loaders call content services.
- Content services resolve locale, relationships, and publication eligibility.
- SEO, sitemap, hreflang, breadcrumbs, and internal links consume the same resolved published content.
- Utilities remain narrowly scoped and preferably pure.
- Domain types do not import React components.
- Content records contain no executable code or JSX.
- Avoid circular dependencies between content, SEO, routes, and components.

Do not over-engineer a repository abstraction for a small static content set.

## 10. Assets and rights

Content records reference approved assets; they do not embed binary data. Preserve source/derivative provenance, rights, dimensions, and approval according to artwork-imaging-and-asset-pipeline.md and asset-review-register.md. A file existing in the repository does not automatically mean it is approved for public use.

## 11. SEO and routing integration

Expose stable IDs, localized slugs, locale availability, publication state, and meaningful updated timestamps. Metadata, sitemap, hreflang, structured data, breadcrumbs, and internal links must derive from the same validated published content source.

Do not add unpublished records or missing locales to the sitemap. A locale key alone does not establish an approved public translation.

## 12. Migration strategy

1. Inventory content currently embedded in JSX, util.ts/utils.ts, JSON, constants, and route files.
2. Classify each value as UI translation, editorial content, domain configuration, or logic.
3. Record current routes, IDs, image mappings, ordering, and publication behavior.
4. Design schemas that preserve existing approved content and relationships.
5. Extract one representative artist profile, artwork, gallery, and Journal entry as a vertical proof.
6. Verify route parity, rendered content, metadata, RTL/LTR, and image fidelity.
7. Migrate remaining records incrementally.
8. Remove old embedded content only after parity tests prove the new source authoritative.

Do not rewrite everything in one pass or change wording, URLs, artwork ordering, or visual behavior as an incidental effect.

## 13. Acceptance criteria

- [ ] Editorial content is not embedded in JSX or general-purpose utility modules.
- [ ] UI messages are not mixed into editorial records.
- [ ] Domain types and runtime validation are separate from content.
- [ ] Adding artwork/gallery/Journal content requires no component changes.
- [ ] Localized variants share stable identity and may have different slugs.
- [ ] Missing translations are handled explicitly.
- [ ] Invalid schemas, duplicate IDs/slugs, and broken references fail validation.
- [ ] Draft/unapproved content is not public, indexed, or in sitemap.
- [ ] SEO and rendering consume the same resolved record.
- [ ] Existing approved content, routes, ordering, and UI behavior survive migration.
- [ ] Content-only edits can be reviewed without inspecting application logic.
- [ ] No real artist facts are fabricated for fixtures or tests.

## 14. Related source-of-truth documents

- content-model.md defines portfolio entities and factual fields.
- localization-and-editorial-governance.md defines editorial approval and language quality.
- artwork-imaging-and-asset-pipeline.md defines image rights and derivatives.
- internationalization-and-ui-translation-architecture.md defines UI translation.
- international-seo-and-search-discovery-architecture.md defines search/indexing behavior.


## Owner-approved unified JSON architecture — 2026-11-05

This section supersedes earlier proposals in this document that place editorial bodies in Markdown files, split one content domain across preview fixtures, or require separate sample/verified records.

### Canonical localized records

- `src/content/data/site.json`: localized site/archive metadata.
- `src/content/data/artist-profile.json`: one artist identity record containing localized name, slug, discipline, short introduction, biography, artist statement, approach, and interests.
- `src/content/data/cv.json`: one CV record containing ordered structured entries and an optional PDF reference.
- `src/content/data/contact.json`: one Contact configuration with localized page title/description and owner-supplied destinations.
- `src/content/data/artworks.json`: one collection of artwork records.
- `src/content/data/galleries.json`: one collection of gallery records and stable artwork relationships.
- `src/content/data/journal/index.json`: one collection of Journal/event records, with complete localized rich-text bodies embedded in each record.
- `src/content/data/homepage-selection.json`: editorial selection by stable IDs.

Use stable IDs for identity and locale-keyed fields for translations. Localized slugs may differ; relationships always use stable IDs. Missing Persian editorial content must not silently fall back to English.

### Journal body representation

Journal bodies are JSON arrays of typed blocks (paragraph, heading, quote, list, or safe link) under `body.en` and `body.fa`. Do not add Markdown body files, generated TypeScript mirrors, build-time content generation, or filesystem parsing to render editorial prose.

### About and CV

Homepage and About resolve biography and artist statement from the same artist-profile record. CV entries and optional download metadata resolve from the same `cv.json` record. There is no About preview fixture, sample-CV endpoint, production suppression, or environment-specific provider. Do not introduce `isFictional`, `isPlaceholder`, `isVerified`, `isTemporary`, `contentSource`, or `verificationStatus` fields. A CV entry may have a year or localized period; do not require a separate verification flag.

### Factual safeguards

Initial editorial prose may be authored as the site's normal editable content, but do not fabricate real-world education, awards, exhibitions, qualifications, institutions, dates, prices, or contact channels and present them as confirmed facts. Where factual CV details are unavailable, keep those record categories empty rather than manufacturing credentials. Preserve artwork asset rights and owner-supplied identity information.

### Layer boundaries

JSON contains editorial data only. TypeScript types and runtime validation define contracts. Repositories/adapters resolve records and relationships. Utilities own filtering, routing, validation, and metadata behavior. Route modules pass resolved data to presentation components; components never import JSON files directly.
