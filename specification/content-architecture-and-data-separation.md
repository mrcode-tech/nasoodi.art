# Content Architecture and Separation from Application Logic

**Status:** Owner-approved implementation contract (2026-11-05)

## 1. Purpose

Keep owner-editable editorial content separate from UI translations, application logic, utilities, and presentation. Ordinary content changes should be made in canonical JSON files without editing React components.

## 2. Responsibilities

1. UI translations: `src/i18n/messages/{en,fa}/`.
2. Editorial content: canonical JSON records under `src/content/data/`.
3. Domain types: describe the structure consumed by the application.
4. Repositories and utilities: load records, resolve locale, format values, build routes and metadata, and handle safe application behavior.
5. Components and routes: present the resolved records.

## 3. Canonical JSON sources

- `artist-profile.json`: artist identity, biography, statement, About.
- `cv.json`: CV, education, training, activities, exhibitions, awards, publications, PDF configuration.
- `contact.json`: Contact copy and email, Telegram, Instagram destinations.
- `artworks.json`: artwork records.
- `galleries.json`: gallery records and artwork references.
- `journal/index.json`: Journal articles, events, exhibitions, news.
- `site.json`: site metadata.
- `homepage-selection.json`: homepage selections.

There is exactly one canonical source per content domain. Do not add parallel preview, demo, fictional, verified, unverified, temporary, approved, pending, or production-only content providers.

## 4. Localization

Store editorial translations alongside each record under `en` and `fa`. Store interface labels and messages in next-intl message resources. Keep locale direction and route behavior in the existing locale infrastructure. Do not silently replace a missing localized editorial value with unrelated prose; render the available content gracefully.

## 5. Rendering and editing

Components must not import editorial JSON directly. Repositories provide the content to routes and components. The homepage biography and About page share the artist profile. About CV, CV page, and PDF use the same CV source. Homepage Contact and Contact page use the same Contact source. Journal and event views share the Journal collection.

## 6. Editorial data policy

The owner has explicitly requested that current canonical JSON content be used as the site's initial content and edited after launch. Display records as stored. Do not impose editorial verification, factuality, artist-approval, provenance, or completeness rules before rendering records. Do not require fields such as `isVerified`, `artistApproved`, `verificationStatus`, `isFictional`, `isPlaceholder`, `contentSource`, or similar flags.

Do not create editorial status gates that hide CV entries, exhibitions, awards, publications, Contact methods, or Journal entries. Existing content can be revised directly in JSON by the owner.

## 7. Technical safeguards only

Keep only technical checks that protect application behavior: valid TypeScript/data access, safe URL and asset paths, safe route segments, and graceful handling of optional or missing values. Technical safeguards must not make editorial judgments or block content because it has not been verified or approved.

## 8. Related specifications

- `content-model.md`: canonical editorial records and fields.
- `internationalization-and-ui-translation-architecture.md`: interface translations.
- `international-seo-and-search-discovery-architecture.md`: localized metadata and routes.
- `testing-qa-and-release.md`: automated application regression coverage.
