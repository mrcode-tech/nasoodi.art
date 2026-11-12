# CV SEO Metadata Model

**Status:** Proposed implementation contract  
**Scope:** SEO metadata derived from existing CV records  
**Locales:** English (`en`) and Persian (`fa`)  
**Canonical data location:** `src/content/data/seo-cv-metadata.json`

## 1. Purpose

Define an extensible, data-driven model for enriching CV page SEO metadata with names and search context already supported by the artist's canonical CV records.

The model must support named entities found in any CV category, including (but not limited to):

- People named in publications or other CV records.
- Universities and educational institutions.
- Publishers and publication titles.
- Professional associations and organizations.
- Employers and teaching institutions.
- Exhibition organizers, galleries, venues, and event organizations.
- Other named entities that are factually grounded in an existing CV record.

Examples include Nima Petgar / نیما پتگر and the bilingual names of universities such as University of Science and Culture / دانشگاه علم و فرهنگ and Alzahra University / دانشگاه الزهرا.

The purpose is to improve the relevance and accuracy of search-engine metadata for the existing CV page. This file is an SEO enrichment layer; it is not editorial content and is never a source for visible website content.

## 2. Non-negotiable boundaries

1. **SEO only:** Values from this file may be consumed only by SEO metadata generation for the CV page (and future explicitly approved CV-specific SEO surfaces).
2. **No visible-content changes:** Never render these values in page components, headings, body copy, CV cards, navigation, accessibility labels, image alt text, or translation messages.
3. **Canonical CV remains authoritative:** A metadata association is valid only when its referenced CV record exists and the entity is supported by that record's existing canonical fields.
4. **No inferred relationships:** An entity reference does not establish a teacher-student, employment, membership, mentorship, institutional, authorship, or other relationship beyond what the canonical CV record explicitly states.
5. **No canonical-data mutation:** Do not edit `cv.json`, artist profile data, other editorial JSON, or UI translations to populate this metadata.
6. **No artist identity pollution:** Do not add CV entities to `artist-name-aliases.json`, the artist Person `alternateName`, `sameAs`, `knowsAbout`, `alumniOf`, or `memberOf` merely because they appear in this file.
7. **No keyword dump:** Do not emit a `meta keywords` tag, hidden keyword text, comma-separated keyword paragraphs, or a list of unrelated entities in a description.
8. **No fabricated claims:** Do not add degrees, dates, affiliations, roles, awards, relationships, or credentials that are not present in the referenced canonical CV record.
9. **No ranking promises:** Metadata enrichment does not guarantee indexing, ranking, traffic, or rich results.

## 3. Source-of-truth and ownership

The two data sources have separate responsibilities:

| Source | Responsibility |
|---|---|
| `src/content/data/cv.json` | Canonical visible CV records and their factual fields |
| `src/content/data/seo-cv-metadata.json` | SEO-only entity names, bilingual search terms, and CV-record associations |

The SEO metadata file must be maintained independently of application code. Do not hardcode entity names, search phrases, or CV-specific exceptions in TypeScript/TSX.

The canonical CV repository remains responsible for loading and localizing CV records. A dedicated SEO metadata repository/adapter is responsible for loading and validating this file. Route and presentation components must not import either JSON file directly.

## 4. Data model

Use a two-level model:

- **Entities:** reusable named entities with a stable ID, entity type, localized canonical names, and required bilingual search terms.
- **CV record mappings:** associations from stable canonical CV record IDs to entity IDs, plus optional localized SEO-only context.

This avoids duplicating the same university/person name across multiple CV records and allows one entity to be referenced by several records.

### 4.1 Top-level structure

The JSON document must contain:

- `schemaVersion`: integer version of this data contract (currently `2`; version 2 removes the redundant alternate-name field).
- `entities`: dictionary keyed by stable entity ID.
- `cvRecords`: dictionary keyed by the exact stable ID of a canonical CV record.

Illustrative structure:

```json
{
  "schemaVersion": 2,
  "entities": {
    "person-nima-petgar": {
      "type": "person",
      "name": {
        "en": "Nima Petgar",
        "fa": "نیما پتگر"
      },
      "searchTerms": {
        "en": ["Nima Petgar"],
        "fa": ["نیما پتگر"]
      }
    },
    "institution-university-of-science-and-culture": {
      "type": "educational-institution",
      "name": {
        "en": "University of Science and Culture",
        "fa": "دانشگاه علم و فرهنگ"
      },
      "searchTerms": {
        "en": ["University of Science and Culture"],
        "fa": ["دانشگاه علم و فرهنگ"]
      }
    }
  },
  "cvRecords": {
    "publication-nima-petgar": {
      "entityIds": ["person-nima-petgar"],
      "searchTerms": {
        "en": [],
        "fa": []
      },
      "descriptionContext": {
        "en": "A publication record mentioning Nima Petgar.",
        "fa": "یک مدخل انتشار که در عنوان آن به نیما پتگر اشاره شده است."
      },
      "priority": 100
    },
    "CV_EDUCATION_RECORD_ID": {
      "entityIds": ["institution-university-of-science-and-culture"],
      "searchTerms": {
        "en": [],
        "fa": []
      },
      "descriptionContext": {
        "en": "Education record naming the University of Science and Culture.",
        "fa": "مدخل تحصیلی مرتبط با دانشگاه علم و فرهنگ."
      },
      "priority": 80
    }
  }
}
```

The example is illustrative. During implementation, use only CV record IDs that actually exist in the current canonical CV data. Do not create the example placeholder ID as a real mapping.

### 4.2 Entity types

Use a controlled but extensible `type` string. Initial recommended values:

- `person`
- `educational-institution`
- `organization`
- `publisher`
- `professional-association`
- `employer`
- `gallery`
- `exhibition-venue`
- `event-organizer`
- `place`
- `publication`
- `other`

New values may be introduced without changing the JSON shape. Type values classify the entity for validation and editorial review; they do not authorize structured-data relationships.

### 4.3 Entity fields

Each entity supports:

- `type`: required entity classification.
- `name.en` and `name.fa`: localized canonical names. A locale may be omitted only when no reliable name is available; do not translate or transliterate proper names automatically.
- `searchTerms.en` and `searchTerms.fa`: required, non-empty, locale-specific arrays of concise search phrases. Include defensible name variants, common spellings, and relevant topical queries here; do not maintain a separate alias field. These terms are SEO inputs, not page copy or meta keywords.

Keep canonical names in `name.en` and `name.fa`. Put useful, defensible name variants and relevant query phrases in the corresponding `searchTerms` arrays. Keep phrases concise (normally 1–4 words; allow longer only for established titles or proper names). Do not generate speculative spelling permutations, unrelated translations, or sentence-like keyword strings. Preserve correct spelling and Persian orthography.

### 4.4 CV record mapping fields

Each mapping is keyed by an exact canonical CV record ID and supports:

- `entityIds`: required array of references to entities in the top-level registry.
- `searchTerms`: required bilingual SEO-only terms specific to this CV record, with non-empty `en` and `fa` arrays.
- `descriptionContext`: optional localized, human-reviewed metadata-only context. It must be narrowly grounded in the referenced CV record and must not assert a stronger relationship than that record supports.
- `priority`: optional non-negative integer used only to choose among eligible records when composing a concise CV page description. Higher values indicate editorial priority, not factual importance.

A mapping may reference more than one entity. An entity may be referenced by multiple CV records. A CV record may have no mapping. Do not add an entity merely because it is generally associated with the artist; the association must be grounded in that specific CV record.

Do not add fields for visible labels, body descriptions, UI titles, slugs, page routes, or content publication state. Those remain owned by the canonical CV and routing systems.

## 5. Association and factual-grounding rules

The mapping expresses only: **“This SEO metadata entity is relevant to this existing CV record.”** It is not itself a semantic relationship assertion.

Before adding a mapping:

1. Resolve the exact CV record by stable ID in the canonical CV repository.
2. Inspect its category and localized title, organization, period, and other populated fields.
3. Confirm that the entity name is explicitly present or unambiguously represented by that record.
4. Add only the minimum entity and metadata context needed for accurate discovery.
5. Review English and Persian values independently.
6. Ensure the proposed metadata does not imply a fact absent from the CV record.

Examples:

- A university named in an education record may be classified as an `educational-institution` and mapped to that education record.
- An association named in a membership record may be classified as a `professional-association` and mapped to that membership record.
- A publisher named in a publication record may be classified as a `publisher` and mapped to that publication record.
- Nima Petgar / نیما پتگر may be mapped only to the existing `publication-nima-petgar` record. Its publication title must not be reinterpreted as proof of a teacher-student relationship.

Never map a university to a publication or membership record merely because the artist attended or belonged to it elsewhere. Use the record that actually documents the entity.

## 6. Metadata generation contract

The CV page metadata generator may combine:

1. Existing localized CV page title/description from the canonical site metadata.
2. Existing localized canonical CV record fields.
3. Eligible SEO-only entity names and optional `descriptionContext` values from this file.

The generator must:

- Run on the server through the existing Next.js Metadata API path.
- Resolve CV records through the existing CV repository and stable IDs.
- Resolve this file through a focused SEO metadata repository; do not import the raw JSON from route components.
- Filter out mappings whose CV record does not exist or is not eligible for the public CV page.
- Respect locale: use only the requested locale's values. Do not silently substitute English for missing Persian metadata.
- Deduplicate repeated entities and repeated terms after locale-aware normalization, while preserving the canonical display spelling.
- Use `priority` and a deterministic tie-breaker to keep generated descriptions concise and stable.
- Prefer natural localized metadata sentences over appended lists of names.
- Keep titles concise and do not append every CV entity to the title.
- Use a curated subset of eligible record context in the page description; the presence of a mapping does not require every entity to appear in every metadata response.
- Preserve an accurate description of the CV page as a whole.
- Omit unavailable, unverified, duplicate, or irrelevant values rather than guessing.
- Respect the existing metadata length/quality policy; do not truncate words arbitrarily or produce awkward fragments.

The metadata generator must not create a new route, indexable page, visible section, or entity detail page from an entity record.

### 6.1 Scope of use

In the initial implementation, this file may affect only:

- CV page `title`
- CV page `description`
- CV page Open Graph title/description
- CV page Twitter/X title/description

Open Graph and Twitter/X values must remain consistent with the corresponding localized page metadata unless an existing approved policy specifies otherwise.

Do not use this data for:

- Visible About/CV content or components.
- Artist Person JSON-LD.
- CV-entry JSON-LD or other structured-data relationships.
- Artist-name aliases.
- Artwork, gallery, Journal, event, announcement, or Contact metadata.
- Sitemap, robots, canonical, hreflang, or route generation.
- Search UI, internal site search, navigation, filters, or accessibility text.
- A `meta keywords` element.

Any future use outside the initial scope requires a separate specification update and explicit approval.

## 7. Repository architecture

Implement a focused module boundary, following the repository's existing content-repository conventions:

- Data: `src/content/data/seo-cv-metadata.json`
- Types/schema: a dedicated SEO CV metadata type and runtime validation schema in the existing content/SEO validation structure.
- Repository: a focused read-only repository such as `src/content/repositories/seo-cv-metadata.repository.ts`.
- Metadata integration: the existing CV section metadata generation path, not a new parallel metadata system.

The repository should expose narrow functions such as:

- `getCvSeoMetadata()`
- `getCvRecordSeoMetadata(cvRecordId)`
- `getCvSeoEntitiesForLocale(locale)`

Use the actual repository naming conventions if equivalent functions already exist. Do not add redundant abstractions.

The data file must remain pure JSON: no comments, functions, imports, environment-specific values, or runtime-generated content.

## 8. Validation and error handling

Validate the JSON at build/test time and when loaded through the repository boundary.

Required validation:

- Supported `schemaVersion`.
- Unique entity IDs and valid entity types.
- Non-empty canonical names for each populated locale.
- Correct locale keys (`en`, `fa`) and non-empty string arrays for entity and CV-record `searchTerms`.
- No empty strings, whitespace-only values, sentence-like search terms, or duplicate values after locale-aware normalization.
- Every `cvRecords` key resolves to an existing canonical CV record.
- Every `entityIds` reference resolves to an existing entity.
- No duplicate entity references within one mapping.
- `priority` is a non-negative integer when present.
- Every mapping is grounded in the referenced CV record.
- Localized metadata context is not present for a locale unless it is reviewed and accurate for that locale.

An invalid or stale mapping must never break the public CV page. Fail CI validation with a precise diagnostic; at runtime, omit invalid enrichment and retain the canonical CV metadata as the safe fallback. Do not silently invent or repair missing data.

## 9. Content and rendering isolation

This is a strict separation requirement.

- No page component may import `seo-cv-metadata.json` or call the SEO metadata repository.
- Only the CV metadata generation module may consume this repository.
- The data must not be passed through props to visible page components.
- Do not expose it through public content APIs, client bundles, browser globals, or serialized page data.
- Do not add the SEO entities to the canonical CV repository return type.
- Do not alter CV rendering, sorting, pagination, category grouping, links, or localized visible text.
- Do not edit canonical editorial JSON or translation messages as part of this implementation.

The SEO JSON is a server-side metadata input, not a second CV content model.

## 10. Testing strategy

Use synthetic fixtures for general behavior and real canonical record IDs only for integration checks. Tests must not depend on the number, order, titles, names, or current content of CV entries.

Required tests:

1. **Schema:** accepts valid entities and mappings; rejects invalid types, locales, priorities, and malformed fields.
2. **References:** rejects unknown CV record IDs and unknown entity IDs.
3. **Grounding:** detects mappings not supported by their referenced CV record.
4. **Locale isolation:** Persian metadata uses Persian values; English metadata uses English values; no silent cross-locale fallback.
5. **Deduplication:** repeated entities and search terms do not appear repeatedly.
6. **Priority and determinism:** eligible context selection is stable and respects priority.
7. **Metadata output:** generated CV title/description are natural, concise, localized, and accurate.
8. **Fallback:** empty or invalid SEO metadata leaves canonical CV metadata intact.
9. **Scope isolation:** no other page metadata or structured data consumes this file.
10. **Visible-content invariance:** before/after rendered CV and About content remains unchanged.
11. **Client isolation:** SEO metadata JSON and repository are not included in client-side bundles or serialized page props.
12. **Production HTML:** inspect both `/en/cv` and `/fa/cv` and verify title, description, Open Graph, and Twitter/X metadata while confirming the visible page content is unchanged.

Do not assert exact CV item counts, fixed pagination pages, or specific visible text in generic tests. Use synthetic records and stable IDs.

## 11. Acceptance criteria

- [ ] `src/content/data/seo-cv-metadata.json` is the sole data source for CV-specific SEO enrichment.
- [ ] The schema supports reusable entities and mappings for every current and future CV category.
- [ ] People, educational institutions, publishers, associations, employers, galleries, venues, and other named entities can be represented without changing the schema shape.
- [ ] All mappings reference stable canonical CV record IDs.
- [ ] Nima Petgar / نیما پتگر is associated only with the existing publication record.
- [ ] University and organization names are mapped only to CV records that actually document them.
- [ ] SEO metadata values never appear in visible page content, UI, translations, client bundles, or public content APIs.
- [ ] No canonical CV/profile/editorial JSON or translation message is modified.
- [ ] Only CV page SEO metadata is affected in the initial implementation.
- [ ] Person JSON-LD and all unrelated structured data remain unchanged.
- [ ] Missing or invalid enrichment safely falls back to canonical CV metadata.
- [ ] English and Persian production HTML prove metadata enrichment and visible-content invariance.
- [ ] CI validates schema, references, locale isolation, metadata quality, and scope boundaries.

## 12. Implementation constraints

Before implementation, inspect the current branch and existing SEO metadata/repository patterns. Reuse existing infrastructure where appropriate and avoid parallel abstractions.

The implementation must be limited to:

- This SEO-only JSON data file.
- Its types and validation.
- Its focused repository/adapter.
- CV page metadata integration.
- Focused tests and specification updates.

Do not change artist identity, CV editorial records, biography, artist statement, About/CV rendering, translation messages, page design, routes, or application interactions.

Work on the existing `feature` branch. Run the relevant tests and GitHub Actions CI only when authorized for the implementation task. Do not merge to `stage` or `main`, and do not deploy.

## 13. Related project contracts

This specification extends, and must remain consistent with:

- `specification/international-seo-and-search-discovery-architecture.md`
- `specification/seo-and-discovery.md`
- `specification/technical-seo-implementation-prompt.md`

If a conflict exists, preserve the strictest content-isolation and no-inference rules. This document is authoritative for the CV SEO metadata JSON model and its initial usage scope.
