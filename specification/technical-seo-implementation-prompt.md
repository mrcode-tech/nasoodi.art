# Technical SEO Implementation Prompt — nasoodi.art

**Purpose:** A repository-ready implementation contract for improving search-engine discovery and social sharing without changing the website's editorial content, identity, interface, or behavior.

**Scope:** Technical SEO only. This document is both an implementation prompt for coding agents and an acceptance contract for reviewing the resulting changes.

## 1. Mission

Audit and complete the technical SEO implementation for the existing bilingual portfolio at nasoodi.art, using the current Next.js App Router architecture, canonical content repositories, locale routing, and the SEO specifications in this directory.

Improve search-engine understanding, crawlability, international indexing signals, structured data, and social previews. Do not promise ranking, traffic, indexing, Knowledge Panel, or rich-result outcomes.

Inspect before implementing. Reuse and improve existing metadata, sitemap, robots, and JSON-LD facilities. Do not create parallel SEO systems or duplicate existing functionality.

## 2. Non-negotiable protection boundary

This is an SEO-only task. The website itself must remain unchanged for visitors.

### 2.1 No editorial/content changes

Do not create, delete, edit, translate, correct, reorder, or rewrite any canonical editorial content or visible copy, including:

- Artist name, spelling, identity, biography, artist statement, discipline, and profile information.
- About and CV text, education, institutions, memberships, teaching, publications, exhibitions, awards, and career history.
- Artwork titles, descriptions, dates, mediums, images, captions, and alt text.
- Gallery titles, descriptions, cover choices, artwork membership, and ordering.
- Journal articles, announcements, events, dates, venues, and event details.
- Contact details, email addresses, social profiles, and public destinations.
- English or Persian UI messages, labels, headings, navigation, and page copy.

Do not add SEO keywords to visible pages. Do not create hidden keyword text, keyword paragraphs, new headings, extra links, or editorial sections.

Canonical editorial records are read-only inputs for this task. If a desired SEO property is not supported by existing public content, omit it and report the limitation. Never invent a value.

### 2.2 No application/UI/behavior changes

Do not redesign or refactor page layouts, components, styling, responsive behavior, navigation, breadcrumbs, sidebars, theme handling, locale switching, RTL/LTR behavior, forms, pagination, filtering, artwork/gallery/journal presentation, routes, localized slugs, image rendering, or application logic.

Do not change route semantics or URL structures to simplify SEO. Do not change redirects, business rules, or content publication behavior unless an independently verified SEO defect makes it strictly necessary; if that would alter user-visible behavior, stop and report it rather than silently expanding scope.

Do not upgrade dependencies or perform unrelated cleanup.

### 2.3 No artist identity or fact changes

Use the existing artist profile and curated name-alias inventory. Preserve the canonical English and Persian names exactly. Never promote exploratory aliases, partial search queries, or generated permutations into public identity claims.

Do not add, infer, or expose a teacher-student relationship unless it is already present in public canonical content. This task does not authorize adding such a relationship to the biography or CV. Do not represent a teacher-student relationship as alumniOf, memberOf, or sameAs.

## 3. Mandatory repository audit

Before editing:

1. Confirm the current branch is feature.
2. Inspect the latest branch head and working repository state.
3. Read the applicable specifications:
   - specification/seo-and-discovery.md
   - specification/international-seo-and-search-discovery-architecture.md
   - specification/artist-name-variants-and-search-identity.md
   - specification/content-model.md
   - specification/localization-and-editorial-governance.md
4. Inspect existing route files, generateMetadata, metadata helpers, metadataBase, canonical host policy, hreflang, Open Graph, Twitter/X metadata, structured-data generators, sitemap, robots, redirects, image metadata, and relevant tests.
5. Inspect src/content/repositories and the typed content models. Read canonical editorial data through its existing repositories.
6. Record the baseline for visible content and relevant route behavior.
7. Identify existing working functionality and verified gaps. Do not infer that a feature is missing because it is implemented in a different module.

The existing application architecture and specifications are authoritative. Any conflict must be resolved in favor of preserving current behavior and canonical content.

## 4. Metadata implementation

Use the Next.js Metadata API on the server. Use existing shared helpers where possible.

Every public, indexable route should have accurate, unique, localized metadata appropriate to its actual content:

- Homepage.
- About.
- CV.
- Contact, when complete public contact metadata and an owner-supplied public destination exist.
- Works archive.
- Gallery archive.
- Journal archive.
- Published artwork details.
- Published gallery details.
- Published journal and event details.

Implement or verify:

- A consistent metadataBase and canonical production origin.
- Unique, human-readable page titles and descriptions.
- Self-referencing canonical URLs for localized pages.
- Correct robots directives.
- Open Graph type, title, description, canonical URL, site name, locale, alternate locale, and relevant image.
- Twitter/X card type, title, description, and relevant image.
- Absolute, valid social image URLs.
- Page-specific images when an approved image exists.
- Appropriate omission of social cards for noindex pages.

Do not put a global duplicate description on every page. Do not use meta keywords. Do not append alias lists or comma-separated target queries to titles or descriptions. Do not generate metadata from unsupported claims.

Metadata may reuse the existing localized editorial values. Do not edit the source values to improve a metadata score.

## 5. English/Persian international SEO

Preserve the existing locale-prefixed route architecture and localized slugs.

- English pages use en and LTR; Persian pages use fa and RTL.
- Each locale has its own canonical URL.
- Emit reciprocal hreflang links only when the same stable content identity has a complete, published equivalent in the target locale.
- Use the target record's explicit localized slug. Never assume that English and Persian slugs match.
- Do not emit alternates to missing, unpublished, noindex, redirected, or non-equivalent pages.
- Include self-referencing language alternates when alternates are emitted.
- Use x-default only if the existing root/default-language behavior is an intentional and valid fallback destination.
- Preserve existing language-switch fallback behavior.
- Handle Persian Unicode and URL encoding safely.

Do not introduce language-based redirects or change the visitor's locale behavior for SEO.

## 6. Structured data and entity relationships

Use safe JSON-LD and Schema.org types only where their semantics match the existing public content.

Potential types include:

- Person and WebSite for the portfolio and artist.
- VisualArtwork for published artwork details.
- CollectionPage and ItemList for genuine published galleries.
- Article for journal/editorial entries.
- Event only when the existing event data satisfies the required details.
- WebPage and BreadcrumbList when useful and accurately supported.

### Person entity

- Keep one stable Person @id across locales.
- Use the canonical localized artist name for name.
- Use alternateName only for a small reviewed set of complete-name aliases with core or supported confidence from the existing profile-owned alias inventory.
- Exclude partial search queries, component-only aliases, exploratory entries, and generated name permutations.
- Use sameAs only for official public profile URLs already present in the canonical public Contact data.
- Use jobTitle only for documented professional roles.
- Use knowsAbout only for actual areas of practice or expertise supported by the existing profile or published artwork records.
- Use alumniOf only for existing published education entries, with an appropriate educational organization type.
- Use memberOf only for existing published membership entries.
- Do not use unrelated properties to encode teaching, influence, or teacher-student relationships.
- Use the existing artist portrait only if it is public, rights-confirmed, and valid.

The global Person/WebSite graph must not duplicate Person entities or conflict between locales.

### Artwork, gallery, journal, and event entities

Use only localized values from the corresponding canonical repository. Include only fields that exist and are publicly rendered or otherwise explicitly approved as public. Do not invent image, date, medium, dimensions, creator, author, event venue, attendance mode, organizer, offer, price, review, rating, or availability values.

Use stable creator/author references to the single Person entity. Escape HTML-sensitive characters during JSON-LD serialization. Do not output incomplete Event markup or false relationships.

## 7. Sitemap and robots

Use the existing Next.js metadata route or its current equivalent.

Sitemap requirements:

- Include only canonical, public, indexable URLs that resolve successfully.
- Include supported localized routes.
- Derive alternate URLs by stable content ID and explicit localized slug.
- Exclude drafts, archived/private/incomplete/untranslated content, noindex routes, internal routes, missing routes, redirects, and duplicates.
- Include populated archives and details only when their existing publication gates permit indexing.
- Include Contact only when its localized metadata is complete and at least one owner-supplied public destination is available.
- Do not hardcode content counts, titles, slugs, or route lists that should come from repositories.
- Do not invent lastModified values or update dates on every build.

Robots requirements:

- Permit crawling of public website content.
- Reference the canonical sitemap URL.
- Do not block resources required to render pages.
- Do not expose private/internal routes.
- Do not use robots.txt to hide a page whose noindex directive must be crawled.

Keep canonical, sitemap, Open Graph, and redirects on one consistent HTTPS/host policy.

## 8. Image SEO

Use existing approved images and metadata only.

- Ensure informative images have meaningful existing localized alt text.
- Keep decorative images decorative.
- Use artwork titles or approved descriptions only where they accurately describe the image.
- Keep image URLs publicly crawlable and absolute in social metadata.
- Preserve image dimensions and aspect ratios.
- Do not rename, replace, crop, recolor, mirror, or otherwise modify artwork assets.
- Do not invent visual details in alt text.
- Do not modify visible captions or editorial descriptions.

## 9. Testing and validation

Add or update content-independent tests. Use synthetic fixtures for artist names, aliases, CV entries, artwork, gallery, journal, and locale data. Never hardcode production content counts, titles, slugs, image names, CV entry counts, or actual artist identity into behavior tests.

Verify:

### Metadata
- Every supported indexable route has an appropriate title and description.
- Canonical URLs are correct and absolute.
- Robots directives match indexability.
- Open Graph and Twitter/X values are localized and page-relevant.
- No duplicate or contradictory metadata is emitted.

### International SEO
- lang and dir remain correct.
- Self canonical is correct per locale.
- Hreflang alternates are reciprocal and identity-based.
- No alternate points to a missing or ineligible route.
- Persian routes and Unicode slugs remain valid.

### Structured data
- JSON-LD parses and is safely serialized.
- Types and properties are semantically appropriate.
- Person identity is stable across locales.
- Aliases obey the curated confidence policy.
- sameAs, alumniOf, memberOf, knowsAbout, and jobTitle are based only on supported canonical data.
- No unsupported relationships or invented values appear.
- Page-level entities agree with their visible canonical content.

### Sitemap and robots
- XML and robots output are valid.
- Sitemap URLs are canonical and eligible.
- Localized alternates are correct.
- No duplicates, redirects, or missing routes are included.
- Public assets are not blocked.

### Regression and content integrity
- Existing routes, HTTP behavior, navigation, UI, layouts, responsive behavior, theme, locale switching, pagination, filtering, and page interactions remain unchanged.
- Canonical editorial JSON and translation message files are byte-for-byte unchanged.
- No visible page text or artist identity is changed.

Use the actual rendered production build HTML and HTTP status as the acceptance source for metadata and route checks. Unit tests of helper functions alone are insufficient.

## 10. Required before/after diff audit

Before implementation, record the hashes or exact baseline contents of all canonical editorial files and locale message files.

After implementation:

1. Compare all canonical editorial JSON and translation message files with the baseline.
2. Confirm they are unchanged.
3. Review the complete Git diff.
4. Remove any unrelated application, UI, styling, content, route, or dependency changes.
5. Confirm all modified files are limited to technical SEO implementation, SEO tests, and SEO specifications.

If a required SEO improvement would require an editorial change or visible behavior change, do not perform it. Report it as a blocked recommendation requiring separate owner approval.

## 11. Branch and deployment boundaries

- Work only on the existing feature branch.
- Do not merge into stage or main.
- Do not deploy.
- Do not change DNS, domain, hosting, production environment variables, analytics providers, or webmaster account settings.
- Do not add tracking pixels, session replay, or third-party collection.
- Keep commits focused on SEO and its specification/tests.

## 12. Final implementation report

Report:

1. Baseline SEO implementation found.
2. Confirmed gaps and completed changes.
3. Metadata coverage by route type and locale.
4. Structured-data types and properties implemented.
5. Sitemap and robots behavior.
6. Files created or modified.
7. Tests, type-check, lint, and build actually executed, with results.
8. Rendered HTML/status validation results.
9. Explicit confirmation that canonical editorial data and translation messages were not modified.
10. Explicit confirmation that visible content, artist identity, UI, routes, and website behavior were not modified.
11. Any blocked recommendations and reasons.
12. Commit hashes on feature.

Never claim a test, build, audit, or validation passed unless it was actually run and its result was observed.

## 13. Definition of done

The task is complete only when technical SEO metadata, localized canonicals and alternates, social metadata, supported structured data, sitemap, and robots behavior are implemented and validated; relevant tests pass; and the complete diff confirms that the existing website and all visible/editorial content remain unchanged.

**Guiding rule: Improve how search engines interpret the existing website. Do not change the website, its content, or its behavior.**
