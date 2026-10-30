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
Persian pages use lang=fa and dir=rtl; English pages use lang=en and dir=ltr. Use reciprocal hreflang only for genuine approved translations. Give each locale its correct canonical. Do not redirect crawlers or visitors solely by inferred location. The language switcher should open the equivalent page when available and otherwise use a clear locale-home fallback. Keep the artist's approved English transliteration consistent.

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
