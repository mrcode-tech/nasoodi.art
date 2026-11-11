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
