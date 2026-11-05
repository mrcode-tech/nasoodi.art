# Internationalization, Unified JSON Content, and SEO Completion Audit

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Initial audited HEAD:** `3d00bce7d26130a429aefc397c75e605c32d1c88`  
**Latest implementation commit before this documentation/test update:** `f054a07a4f24403a32ad70c8e782a66c46db2795`  
**Audit date:** 2026-11-05

## Executive summary

The repository already contained most of the unified JSON content migration: localized artist profile, CV, Contact, artwork, gallery, Journal/event, site metadata, and homepage selection files; Journal rich-text bodies in JSON; focused repositories; and dedicated localized archive routes. The audit found integration defects rather than a need to rewrite the site: About referenced unresolved content identifiers instead of its repositories; homepage and detail routes resolved canonical content through lower-level adapters; sitemap/global SEO used similar direct dependencies; localized slug resolution could reuse a common slug when a locale mapping was incomplete; the i18n AST audit reported legitimate brand/ARIA values; Journal cover alt text described reused artwork as a temporary placeholder; and the Next.js 16 build failed because URL-driven pagination used `useSearchParams()` without Suspense boundaries.

The implementation has been corrected incrementally on `feature`. The first production build after the fixes passed lint, i18n audit, TypeScript, content tests, asset inventory, and Next.js static generation. Playwright then identified obsolete assertions tied to the former demo-contact, placeholder-image, empty-CV, and noindex behavior, plus a test selector defect and stale sitemap expectations. Those assertions have been updated to match the canonical content and owner-supplied Contact data. A new rendered-HTML SEO regression test now covers both locales and the homepage, About, Contact, Works, Galleries, artwork detail, Journal archive/detail, event detail, and gallery detail.

## Initial audit findings

| Area | Initial implementation | Remaining issue found | Required change | Risk |
|---|---|---|---|---|
| i18n | next-intl, `/en` and `/fa`, message namespaces, TypeScript-AST literal audit | Audit reported artist/brand names, copyright wordmark, and ARIA `slide` role description as hardcoded UI copy; scan omitted `src/lib` | Add narrow proper-name/semantic-role exceptions, keep visible labels audited, scan application utilities | High |
| Content | Canonical JSON for artist, CV, Contact, artworks, galleries, Journal/events, site metadata, homepage selection | Homepage/detail routes, sitemap and some SEO helpers still used lower-level adapters; missing localized slug could silently reuse common slug | Resolve through focused repositories; require safe per-locale slugs; validate all editorial domains | High |
| About/CV | Artist/About and CV JSON records/repositories existed; preview fixture and sample-CV endpoint removed | About route referenced undefined identifiers rather than consuming `getAbout()` and `getCv()` | Resolve About and CV through canonical repositories in all environments | High |
| SEO | Metadata helpers, stable-ID alternate lookups, JSON-LD, sitemap and robots existed | Sitemap/global structured data still imported content adapters; rendered HTML and page-type metadata coverage incomplete | Use repositories for sitemap/SEO and verify actual HTML/metadata/JSON-LD | High |
| Utilities | Publication, slug, Journal, pagination and metadata utilities existed | `getLocalizedSlug` tolerated a missing locale mapping by returning `slug` | Return no slug for incomplete localized maps and reject missing values in validation | Medium |
| Components | Dedicated archive pages and reusable pagination components existed | `useSearchParams()` caused Next.js 16 static prerender failure without Suspense | Wrap only affected pagination components in route-level Suspense boundaries | High |
| Testing | Content, SEO, pagination and Playwright coverage existed | Tests encoded former demo Contact values, temporary cover alts, empty CV, About noindex, and sitemap exclusions | Update regression tests to assert canonical JSON behavior and real owner-supplied destinations | High |

## Implementation completed on feature

### Unified JSON and repository boundaries

- Kept one canonical source per domain:
  - `src/content/data/site.json`
  - `src/content/data/artist-profile.json`
  - `src/content/data/cv.json`
  - `src/content/data/contact.json`
  - `src/content/data/artworks.json`
  - `src/content/data/galleries.json`
  - `src/content/data/journal/index.json`
  - `src/content/data/homepage-selection.json`
- Added `src/content/repositories/homepage.repository.ts` to compose the localized homepage view model from existing repositories.
- Updated homepage and artwork/gallery/Journal detail routes to resolve records through focused repositories.
- Updated About to use `getAbout(locale)` and `getCv(locale)`; no separate fixture/provider was introduced.
- Updated sitemap, section metadata, and global Person/WebSite structured data to consume canonical repositories.
- Kept Journal event/exhibition records in the canonical Journal collection and exposed them through the event repository; no duplicate event JSON database was introduced.
- Kept UI messages separate in `src/i18n/messages/{en,fa}/`.

### Locale, validation, and content correctness

- A present `localizedSlugs` map with a missing active locale resolves to an empty slug, not another locale's slug.
- Portfolio validation requires a safe localized slug for every supported locale and checks uniqueness per locale.
- Expanded domain validation for artist profile, site/archive metadata, Contact destinations, artwork localized title/description/alt, gallery localized metadata, and published Journal locale approvals.
- Added regression coverage for missing localized slugs, canonical homepage repository composition, and canonical Journal artwork alt text.
- Journal cover alt text now reuses the localized alt text from its referenced canonical artwork.
- About, CV, artwork, gallery, Journal and event content continue to use the same canonical records in all environments.
- The locale layout uses next-intl message loading for the validated route locale rather than a hardcoded English/Persian import branch.

### i18n, SEO, and Next.js production rendering

- Expanded AST scanning to `src/app`, `src/components`, and `src/lib`, covering TSX/TS/JSX/JS.
- Added explicit proper-name exceptions for the supplied artist/brand identity.
- Excluded `aria-roledescription` values such as `carousel` and `slide` from translation-copy detection; visible `aria-label` and `aria-description` remain audited.
- Localized the artist wordmark's home-link accessible label and isolated brand wordmarks in JSX.
- Added Suspense boundaries around Galleries and Journal pagination client components that use `useSearchParams()`.
- Added a rendered-HTML Playwright matrix for both locales across homepage, About, Contact, Works, Galleries, artwork detail, Journal archive/detail, event detail, and gallery detail. It checks language/direction, canonical, description, Open Graph, Twitter, server-rendered content, and JSON-LD types.
- Updated existing E2E expectations to require populated/indexable CV and About pages, include About/Contact/CV in the sitemap, use the owner-supplied Instagram destination, and reject placeholder Journal alt text.

## Canonical content map

| Domain | Source | Repository/API |
|---|---|---|
| Site/archive metadata | `site.json` | `getSitePageMetadata` |
| Artist profile and About | `artist-profile.json` | `getArtist`, `getAbout` |
| CV | `cv.json` | `getCv` |
| Contact | `contact.json` | `getContact` |
| Artworks | `artworks.json` | `getArtworks`, `getArtworkById`, `getArtworkBySlug` |
| Galleries | `galleries.json` | `getGalleries`, `getGalleryById`, `getGalleryBySlug` |
| Journal and event records | `journal/index.json` | `getJournalEntries`, `getJournalEntryById`, `getJournalEntryBySlug`, `getEvents` |
| Homepage selections | `homepage-selection.json` | `getHomepageContent` |
| UI translations | `i18n/messages/{en,fa}/` | next-intl |

## Content-editing instructions

- Artist/About: edit localized fields in `artist-profile.json`; homepage and About use the same record.
- CV: add ordered entries to `cv.json` with stable IDs, category, localized title, and known year or localized period. Do not fabricate education, exhibition, award, or qualification facts.
- Artwork: add an ID, localized titles/descriptions/alt, both localized slugs, approved image path, and actual gallery relationships.
- Gallery: add an ID, localized title/description/slugs, existing cover artwork ID, and ordered artwork IDs.
- Journal: add one record to `journal/index.json`; put English and Persian rich-text arrays in `body.en` and `body.fa`. Add event dates, venues, and registration URLs only when supplied/confirmed.
- Contact: edit only owner-supplied public destinations in `contact.json`.
- Site metadata: edit localized page title/description values in `site.json`.
- Homepage: change selected stable IDs/order in `homepage-selection.json`.
- New locale: add routing/direction/message configuration and localized values/slugs to the same records; do not duplicate entities.

Run `npm test`, `npm run audit:i18n`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` after content or architecture changes.

## Factual and publication safeguards

The CV contains only the non-credential current-practice entry; the absence of owner-supplied education, awards, qualifications, institutions, and exhibition history is not a reason to invent records. Contact remains limited to the owner-supplied Instagram destination. Event dates, venue details, and other factual announcements require owner confirmation before public release. Existing publication/artist-approval and artwork-rights rules remain separate domain gates; they are not a parallel sample/verified content store.

## CI evidence and verification status

- Run `42008606167` on `ee4291ecfcdb5cc4500e04705643e9a995c562ae`: ESLint, i18n audit, TypeScript, content tests, and asset inventory passed; production build failed on missing Suspense boundaries.
- Run `42008871046` on `82a4e2edc04d5e9a4e14169da36e6e7a614cfe07`: lint, i18n audit, TypeScript, content tests, production build/static generation, and asset inventory passed; Playwright exposed obsolete expectations and one incorrect test locator; smoke test was skipped after E2E failure.
- Run `42009963433` on `5aed1d16f90dce284d096c4ebed590f59d3840af`: lint, i18n audit, TypeScript, content tests, production build, and asset inventory passed; three remaining E2E failures identified stale sitemap/robots expectations and a nested locator error.
- Run `42010442374` on `f054a07a4f24403a32ad70c8e782a66c46db2795`: pending/in progress at the time of this audit update. It includes the corrections and new rendered-HTML test; inspect the completed run before claiming final success.
- Additional domain validation and documentation/test updates are committed after `f054a07`; the final feature SHA must have a completed successful CI run.

## Remaining work

1. Inspect the latest GitHub Actions run against the final feature HEAD; fix any remaining Playwright or build issues.
2. Confirm all test calls use the expanded site/contact validator inputs and the canonical JSON validation suite passes.
3. Inspect the rendered-HTML test results for all page types and both locales; fix any incorrect route/structured-data assumptions.
4. Review event date/venue and publication approval facts with the owner before public release.
5. Confirm no obsolete Markdown consumer, preview fixture, duplicate repository, or environment-specific content provider remains.
6. Update this audit and `agent.md` with the final tested SHA, CI run URL/conclusion, changed files, and any remaining owner approvals.

No changes to `stage`, `main`, Vercel, DNS, or production deployment were made.
