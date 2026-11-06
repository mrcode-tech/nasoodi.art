# Content Relationship and Integrity Contracts

This document defines technical invariants for artwork, collection, and homepage-selection records. It intentionally contains no current titles, IDs, dates, image filenames, or editorial record counts.

## 1. Canonical records

- Artwork records have stable IDs, localized fields, publication state, and safe asset references.
- Collection records have stable IDs, localized fields, an ordered list of artwork references, and an optional cover reference.
- Homepage selections contain references to canonical records; they do not duplicate records.
- Journal records may reference shared assets through stable identifiers or safe public paths.
- All records are loaded through the content repository layer.

## 2. Relationship invariants

- Every referenced artwork ID must resolve to an existing canonical record.
- A collection must not contain duplicate artwork references.
- A configured cover reference must resolve to a member of the collection.
- Where the cover contract specifies the first ordered member, the cover reference must equal the first member of that ordered list.
- Removing a record must not leave dangling references.
- Empty collections and optional cover fields must be handled according to the domain contract without crashing the application.
- Homepage selections must reference eligible canonical records and preserve explicitly configured order.

## 3. Route and presentation contracts

- Archive routes are locale-prefixed and resolve records using localized slugs.
- Localized slugs are not stable identifiers and must not be used as foreign keys.
- Public archive ordering is derived from the domain's configured sort key.
- The collection index uses its specified static-card layout and pagination contract.
- Homepage and detail-page carousel behavior remains scoped to the components that require it.
- Images preserve intended fidelity and use the component's defined contain/crop behavior.

## 4. Validation

Automated tests use generated records to validate uniqueness, reference integrity, ordering, cover selection, pagination, localized route resolution, and safe asset paths.

Do not assert a fixed number of records, actual editorial titles, specific production IDs, image filenames, or a particular production record being first/latest. A content change must update rendered output without requiring test or specification edits unless a technical contract itself changes.
