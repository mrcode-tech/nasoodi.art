# SEO, Artist Discovery, and Structured Data

**Status:** Proposed implementation contract

## Goals and principles
Make the artist and individual paintings discoverable through useful, accurate pages. Optimize for collectors, curators, galleries, press, and visitors searching for the artist or a work. Do not promise rankings or traffic. Never fabricate artwork titles, years, exhibitions, reviews, prices, gallery affiliations, or availability.

## Indexable information architecture
Home, Works, individual artwork pages, meaningful artist-approved series pages, About, populated CV/Exhibitions, and Contact. Draft, pending-review, private, placeholder, and empty routes must not be indexed or included in the sitemap. Unknown artwork slugs return a real 404. Keep slugs stable; redirect a changed slug only to its genuine replacement.

## Metadata per page
Every indexable route needs a unique accurate title and description, canonical URL, locale, appropriate Open Graph metadata, meaningful H1, and valid language alternate only when an equivalent approved translation exists. Artwork metadata uses confirmed fields only. Never append an unverified year or medium. Social preview imagery and crop require approval.

## Page content
- Home: preferred artist name, discipline, approved introduction, immediate access to real selected works.
- Works: concise description of the collection, approved titles/series, descriptive links.
- Artwork: approved title, image, known medium/year/dimensions, approved description, accurate alt text, related works only when relationship is real.
- About: separate first-person artist statement and factual third-person biography.
- CV: verified professional entries only.
- Contact: actual approved contact destination and truthful response expectations.

## Structured data
Evaluate Schema.org Person for the artist, WebSite for the portfolio, and VisualArtwork for individual artwork pages. Use Organization only if a real organization is represented. Include only confirmed facts that match visible page content. Do not create fake Offer, price, review, rating, address, Event, gallery, or affiliation data. Structured data does not guarantee rich results. Validate JSON-LD syntax and avoid duplicate conflicting schemas.

## International SEO
Persian pages use lang=fa and dir=rtl; English pages use lang=en and dir=ltr. Use reciprocal hreflang only for genuine approved translations. Give each locale its correct canonical. Do not redirect crawlers or visitors solely by inferred location. The language switcher should open the equivalent page when available and otherwise use a clear locale-home fallback. Keep the artist's approved English transliteration consistent. Maintain defensible alternate spellings in the profile-owned `src/content/data/artist-name-aliases.json` inventory; do not publish a raw alias or partial-query list as page copy.

## Technical discovery
- XML sitemap includes canonical, public, indexable URLs only.
- robots.txt agrees with the production host and sitemap location and does not block required assets.
- Canonical, Open Graph, sitemap, and redirects use one consistent apex/www policy.
- Use real HTTP statuses for redirects, missing pages, and errors.
- Important artwork content must not depend on client-only rendering.
- Use approved favicon and social preview assets.
- Exclude drafts and placeholders from search output.

## Measurement and maintenance
After launch authorization, verify the canonical property in search webmaster tools, submit the sitemap, inspect representative home/artwork/localized URLs, and monitor indexing, duplicate canonical issues, crawl errors, and mobile performance. Add analytics only after an explicit provider/privacy decision; no tracking pixels or session replay by default. Improve content using real search queries and visitor needs, not keyword stuffing.

## Acceptance
- [ ] Unique accurate metadata on every indexable route.
- [ ] Canonical host and protocol consistent.
- [ ] Reciprocal locale alternates only for approved translations.
- [ ] Sitemap and robots behavior verified.
- [ ] Structured data matches visible facts.
- [ ] Artwork pages have stable URLs and useful content.
- [ ] Draft/placeholder content excluded.
- [ ] Correct 404 and redirect behavior.
- [ ] Open Graph images and crops approved.
## Design and content alignment

SEO presentation must follow design-engineering-skills.md and design-direction-and-system-refinement.md without compromising editorial quality.

- Page titles and descriptions must be human-readable and artist-approved, not keyword-stuffed.
- Artwork, gallery, and Journal titles must remain clear and semantically meaningful in page headings.
- Structured data must describe verified content only.
- Do not create visually hidden keyword blocks or duplicate thin filter pages to increase indexable URLs.
- Social preview imagery must use approved assets and reviewed crops; artwork color and composition must remain intact.

## Implemented structured-data coverage — 2026-10-30

The application emits the global Person/WebSite graph and now adds page-level structured data only on eligible published detail routes:

- Artwork detail: `VisualArtwork`, with the localized visible title and only present image, year, medium, and description fields.
- Editorial Journal detail: `Article`, with visible localized title/summary, canonical URL, artist author reference, and a valid publication date when supplied.
- Event Journal detail: `Event`, with confirmed start/end instants, declared attendance mode, and localized venue when present. No offers, prices, addresses, organizer, or other unprovided facts are synthesized.
- JSON-LD serialization escapes HTML-sensitive opening brackets before insertion into the document.
- Structured-data helpers are unit-tested; populated page output and rich-result eligibility still require approved real content and validation after publication.


## Gallery collection structured data — 2026-10-30

Published gallery detail pages emit `CollectionPage` JSON-LD with a nested `ItemList`. The list follows the gallery's curated artwork membership order and includes only artwork records that pass the same publication, rights, primary-image, and locale gates as the visible page. Each list item links to its canonical localized artwork detail route and uses only the approved localized artwork title and primary image. Empty, draft, incomplete, or untranslated gallery records remain excluded by the existing route and sitemap gates.

The helper is unit-tested with published and unpublished synthetic artwork records. Validate rendered structured data against populated artist-approved gallery content before launch.

## JSON-backed bilingual metadata — 2026-11-05

The current content architecture is authoritative for metadata: artist/About from `artist-profile.json`; archive titles/descriptions from `site.json`; Contact metadata from `contact.json`; CV metadata from the canonical CV/site record; and detail metadata from each artwork, gallery, or Journal entity. All localized alternatives are matched by stable content ID, never by slug equality.

The Contact page may be indexed only when the canonical localized title and description and an owner-supplied public contact destination exist for that locale. Do not retain the old demo Contact noindex rule after demo destinations have been removed and replaced by owner-supplied data. Verify actual rendered HTML and sitemap output for each supported locale.


## Canonical repository boundary — 2026-11-05

The homepage uses `getHomepageContent`; About uses `getAbout` and `getCv`; artwork/gallery/Journal detail pages use focused repositories; sitemap uses the same repositories as page rendering; and global Person structured data resolves through `getArtist`. Avoid importing JSON adapters directly into route or presentation modules. Localized detail alternates match stable IDs and then use the target record's explicit localized slug.

## Semantic topic coverage for About and CV

Name-based discovery should be complemented by accurate subject-based and professional-context content. The About page and CV should naturally cover the artist's real discipline, medium, techniques, education, teaching, memberships, publications, exhibitions, and other documented professional activities.

Relevant vocabulary may include painter, oil painter, oil painting, contemporary painting, contemporary Iranian art, Iranian visual artist, figurative painting, painting instructor, art educator, colour, composition, and visual expression, with natural Persian equivalents such as نقاش، نقاش رنگ‌روغن، نقاشی رنگ‌روغن، نقاش معاصر، هنر معاصر ایران، هنرمند تجسمی ایرانی، نقاشی فیگوراتیو، مدرس نقاشی، رنگ و ترکیب‌بندی.

Institution and organization searches should be served by the actual CV entries. Use the canonical bilingual names for documented education and memberships (for example, Alzahra University and University of Science and Culture) in visible CV content; do not create a keyword paragraph that merely lists institutions.

Nima Petgar (نیما پتگر) appears in the canonical CV only as part of the existing publication record “My Teacher: Nima Petgar” / «استادم: نیما پتگر». Keep it as a publication record; do not turn its title into a teacher-student claim or add the name to biography, statement, education, training, memberships, affiliations, or other visible website content.

If the name is needed as an SEO signal, store the bilingual term in a dedicated SEO metadata JSON source (for example, src/content/data/seo.json) under a CV-specific field such as cv.searchContext. Consume it only when generating CV page metadata, and use it to describe the existing publication naturally in the localized CV title or description. Do not use a detached keyword list, hidden text, or a meta keywords tag. Do not imply that Nima Petgar taught, mentored, employed, or was institutionally affiliated with the artist. Do not add the name to the artist-name alias inventory or Person JSON-LD.


## SEO-only implementation guardrails — 2026-11-12

The repository-ready implementation prompt is maintained in specification/technical-seo-implementation-prompt.md. It is the task contract for technical SEO work that must preserve the existing website.

For an SEO-only task:

- Treat all canonical editorial records and locale message files as read-only inputs.
- Do not modify artist identity, spelling, biography, statement, CV, artwork, gallery, journal, event, announcement, or Contact content.
- Do not add visible copy, headings, keyword lists, hidden text, or new editorial sections.
- Do not change routes, localized slugs, layouts, styles, navigation, responsive behavior, localization, or application interactions.
- Generate metadata and structured data only from existing public canonical repository values.
- Omit unsupported properties rather than inventing or inferring facts.
- Keep code changes limited to technical SEO modules, technical SEO tests, and specifications.
- Require a before/after diff audit proving that canonical editorial JSON and translation messages are unchanged.

The subject and professional-context vocabulary described above is guidance for evaluating existing content and metadata relevance. It is not permission to rewrite About/CV content during an SEO-only implementation. Any editorial additions require a separate explicit content-editing request.

The Person graph may expose curated complete-name aliases, official public profile URLs, documented professional roles, published educational organizations, published memberships, and genuine areas of practice only when the corresponding values already exist in public canonical repositories. Nima Petgar / نیما پتگر is not an artist alias or Person relationship; keep the name limited to CV-specific SEO metadata grounded in the existing publication record.
