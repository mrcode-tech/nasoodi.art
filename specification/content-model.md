# Content Model and Runtime Data Contracts

## 1. Purpose

Define the technical shape and lifecycle of content records consumed by the application. This document describes data boundaries and invariants only; editorial copy and production records belong exclusively in canonical data files.

## 2. Canonical content domains

Use one canonical source per domain. Domain records are stored under src/content/data/:

| Domain | Technical responsibility |
|---|---|
| Profile | Localized profile fields consumed by homepage and profile routes |
| CV | Structured, optionally categorized entries and optional document reference |
| Contact | Configurable contact labels, values, and safe destinations |
| Artwork | Stable identity, localized fields, asset references, dimensions, and publication state |
| Collection | Stable identity, localized fields, ordered artwork references, and cover reference |
| Journal | Unified localized stream supporting multiple entry types and optional media |
| Site metadata | Localized archive titles and descriptions |
| Homepage selection | Stable references to records selected for homepage presentation |

Do not create parallel demo, preview, fictional, temporary, verified, or production-only content providers.

## 3. Localization and identity

- Stable record IDs are independent of localized titles and slugs.
- Localized editorial fields are stored with their owning record.
- UI labels and interface messages belong in src/i18n/messages/{en,fa}/.
- Shared technical facts such as dates, dimensions, ordering, asset references, and publication state remain structured fields.
- Route resolution uses stable record identity and the requested locale's localized slug.
- Do not silently substitute unrelated prose when a localized editorial value is missing; follow the localization contract and render available content safely.

## 4. Record relationships

- Collection records reference artwork IDs; they do not duplicate artwork records.
- A collection cover reference must resolve to a member of the collection.
- Where the cover contract specifies the first ordered member, the cover reference must equal the first member of that ordered list.
- Journal records may reference reusable media assets without duplicating domain records.
- Homepage selections reference canonical records and are resolved through repositories.
- Derived views must reuse their canonical source rather than maintain a second dataset.

## 5. Publication and optional fields

- Publication state controls public route eligibility.
- Unpublished records must not become publicly indexable or appear in public navigation.
- Optional fields may be absent and must be handled gracefully.
- Missing optional values must not be replaced with invented editorial text.
- Technical validation protects runtime safety, route correctness, data shape, and asset references.
- Do not introduce factuality, personal approval, provenance, or editorial-completeness gates as prerequisites for rendering canonical records.

## 6. Repository and component boundaries

- Domain types describe the data contract.
- Repositories resolve records, locale-specific fields, ordering, publication eligibility, and relationships.
- Utilities handle pure operations such as pagination, sorting, URL safety, and formatting.
- Routes orchestrate data and metadata.
- Components present resolved data and must not import canonical editorial JSON directly.

## 7. Validation requirements

Validate technical invariants:
- Required structural fields and supported types.
- Unique stable IDs and localized route keys.
- Safe asset paths and supported image metadata.
- Valid references and no duplicate membership references.
- Valid date representation where dates drive sorting or publication.
- Correct publication filtering.
- Graceful handling of missing optional fields.
- No unsafe external destinations or malformed route segments.

Do not validate the truth, quality, or personal meaning of editorial statements, biography, achievements, titles, or descriptions.

## 8. Editing workflow

Ordinary editorial changes should be made in canonical data files without changing React components or technical specifications. Technical tests must continue to pass when editorial values or record counts change.
