# Nasoodi.art — Content Model

**Owner decision, 2026-11-05:** Content is editorial data. Do not impose factual verification, artist-approval, provenance, or content-validation gates before displaying records supplied or authorized by the owner. The owner wants the current editable content to populate the site and will revise the JSON after launch.

## 1. Canonical content sources

Use one canonical JSON source for each content domain:

| Domain | Source |
|---|---|
| Artist profile, biography, statement, About | `src/content/data/artist-profile.json` |
| CV, education, activities, exhibitions, awards, publications | `src/content/data/cv.json` |
| Contact details | `src/content/data/contact.json` |
| Artworks | `src/content/data/artworks.json` |
| Galleries | `src/content/data/galleries.json` |
| Journal articles, events, exhibitions and news | `src/content/data/journal/index.json` |
| Site metadata | `src/content/data/site.json` |
| Homepage selections | `src/content/data/homepage-selection.json` |

Do not create parallel verified/unverified, approved/pending, sample/real, preview/production, temporary/permanent, or environment-specific content stores. The homepage, About, CV, Contact, gallery, and Journal views must read the canonical records.

## 2. Content fields and localization

- Keep stable record IDs.
- Store English and Persian editorial copy in the same record using `en` and `fa` localized values.
- Store UI labels and interface messages in `src/i18n/messages/{en,fa}/`.
- Keep shared facts such as dates, dimensions, medium, ordering, and image paths in structured fields.
- Use structured JSON blocks for long-form Journal content.
- Keep content separate from React components and application logic.
- Missing optional fields may simply be omitted. Do not create artificial placeholder values to satisfy a content rule.

## 3. Artist profile and About

The homepage biography and About page use the same artist-profile record. The record may contain the artist's name, biography, statement, discipline, and portrait reference. Do not maintain a second About fixture or environment-specific provider.

## 4. CV and activities

The CV is one editable collection. It can contain education, training, professional activities, solo/group exhibitions, publications, awards, collections, workshops, and other relevant activities. Display the entries currently present in the canonical JSON. Do not suppress entries because they lack a separate verification, approval, or provenance flag. The owner may edit or remove entries directly in JSON.

The CV page and About CV preview use the same CV repository/source. The downloadable PDF is generated from or served using the same canonical CV data/document configured in that record.

## 5. Contact

Use the single Contact record for the homepage Contact section and dedicated Contact page. Current owner-provided methods are:
- Email: `g.nasoodi@gmail.com`
- Telegram: `@nasoodi`
- Instagram: `@ghazalenasoodi`

Do not hide these methods behind approval-state or verification flags. Render email as a `mailto:` link and Telegram as `https://t.me/nasoodi`.

## 6. Artwork, galleries, Journal and events

- Artwork records describe the artwork and point to repository assets.
- Galleries reference artwork IDs rather than duplicating artwork records.
- Journal is the unified editorial stream for articles, studio notes, exhibitions, events, and news, including events involving other artists.
- The event repository is a filtered view of Journal records, not a second data store.
- The homepage Journal preview shows one newest eligible item; the full Journal page uses pagination.
- Keep existing visual presentation, route structure, and localized content behavior.

## 7. Technical integrity (not editorial approval)

Application code may retain technical checks needed to prevent runtime errors or unsafe behavior, such as TypeScript shape checks, safe URL/path handling, route collision handling, and correct rendering of optional fields. These checks must not judge whether an artist fact is true, whether an entry is verified, whether the artist has approved it, or whether editorial content is sufficiently complete to be shown.

Do not add editorial validation rules, verification flags, factuality checks, approval gates, or data-quality thresholds as prerequisites for rendering, indexing, or showing CV/Contact/Journal content. A missing optional value should be omitted gracefully rather than blocking the record.

## 8. Editing workflow

To change site content, edit the corresponding canonical JSON file. No React component change should be needed for ordinary content edits. Preserve the current IDs and structure when updating existing entries. Run the normal application and regression tests to ensure the site still builds and renders; tests must not encode editorial approval or factual verification requirements.
