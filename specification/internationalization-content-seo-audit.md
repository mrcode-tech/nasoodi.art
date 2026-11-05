# Internationalization, Content, and SEO Architecture Audit

**Repository:** `mrcode-tech/nasoodi.art`  
**Branch:** `feature`  
**Audit snapshot:** `dc1e40c97c0f777f9659e8e5f8f4048da12a41aa`  
**Framework versions:** Next.js 16.4.3, React 19.2.4, TypeScript 5.9.3, next-intl 4.14.9  
**Locales:** Persian (`fa`, default, RTL) and English (`en`, LTR)

This is an evidence-based audit of the current repository snapshot, not a claim that every acceptance criterion is complete. Existing design, routes, owner-approved assets, and publication controls remain the compatibility baseline. No production deployment or branch merge is part of this work.

## Executive summary

The repository has a working foundation: App Router locale segments, next-intl, locale-aware server rendering, centralized content modules, publication filters, stable IDs, localized slugs, and localized metadata for artwork/gallery/Journal detail pages. CI now validates both locales and the browser suite passes.

The architecture is not yet at the requested completion standard. The main remaining issues are:
1. UI messages are stored in two flat locale JSON files rather than domain-organized message resources.
2. `src/lib/site.ts` remains a large compatibility barrel combining content exports, locale helpers, content resolution/publication rules, sanitization, and Schema.org generation.
3. About rendering still consumes a separate demo fixture instead of the canonical `ArtistProfile` record.
4. Metadata generation is repeated in route files; archive pages lack the same complete description/Open Graph/Twitter treatment as detail pages.
5. Runtime content validation is distributed across filter functions and tests; there is no single validation boundary checking global ID/slug uniqueness and all relationships.
6. The message parity script checks key and placeholder parity, but not unused keys, embedded UI literals, route behavior, or actual locale coverage.
7. Some editorial records and sample content need an explicit owner/editorial approval review before being treated as genuine artist content. Existing publication flags are preserved pending that review.

## Architecture audit

| Area | Current implementation | Problem / evidence | Proposed solution | Risk |
|---|---|---|---|---|
| i18n | `next-intl` 4.14.9; `src/i18n/routing.ts`, `request.ts`, typed `AppConfig`; `/fa` and `/en` route segment; `setRequestLocale` in locale layout | Message catalogs are flat `en.json`/`fa.json`; keys are not grouped by domain. Parity script checks missing keys/placeholders only. | Split source messages by domains (navigation, common, home, artwork, gallery, Journal, About/CV, Contact, accessibility), compose them in request config, retain typed message inference, and test parity/unused keys. | Medium |
| Content | `src/content/{artist,artworks,contact,cv,galleries,homepage,journal}.ts`; `src/types/content.ts`; stable IDs and localized slugs; publication filters in `site.ts` | Artist profile is currently `undefined`; About page/homepage read `aboutPreviewFixture` directly. CV entries and PDF are empty. Editorial content remains TypeScript literals. Some Journal records appear as populated demo editorial copy and require owner approval confirmation. | Make page renderers consume canonical content resolvers; keep demo fixtures isolated and unmistakably non-indexable; add runtime validation for IDs, slugs, localized variants, image metadata, references, approval and publication state. Use JSON/Markdown where content operations benefit from it. | High |
| SEO | Metadata API in locale index/detail routes; canonical paths; per-record alternate slug lookup; sitemap and robots routes; JSON-LD helpers | Metadata responsibilities are repeated in route files. Archive metadata is incomplete (e.g. description/social cards); detail route metadata is another independent lookup. Sitemap index alternates use any shared ID rather than proving the same eligible localized collection. Sitemap entries do not currently carry meaningful `lastModified`. | Centralize page-level metadata builders over resolved records; use one eligibility/alternate resolver for routes, sitemap and language switch; verify reciprocal alternates and rendered response headers/HTML. | High |
| Utilities | Locale helpers in `src/types/locale.ts`; `src/lib/gallery-pagination.ts`; broad `src/lib/site.ts` | `site.ts` re-exports data/types and also contains publication filters, link/image sanitizers, locale switching, pagination-adjacent content behavior, and JSON-LD builders. This creates a catch-all dependency surface. | Introduce focused modules such as `src/lib/content/{artworks,galleries,journal,publication}`, `src/lib/routing`, and `src/lib/seo/structured-data`; migrate consumers incrementally and remove compatibility exports only after import/reference checks. | Medium |
| Components | Server-rendered route components and focused interactive components; locale messages used via next-intl | Some route components combine data retrieval, metadata lookup, translation, filtering, formatting, and large presentation branches. About/home consume preview fixture directly. | Extract server-side page data/resolver functions and focused page sections while keeping Server Components default; leave carousel, pagination, drawer and theme interactions client-side only where needed. | Medium |
| Testing / CI | ESLint, TypeScript, content publication tests, translation parity audit, production build, Playwright, asset/SVG checks, production smoke test | CI currently gives strong regression coverage but does not fully validate SEO invariants, global content schema integrity, all literal UI strings, cross-browser accessibility, or manual editorial approval. | Add focused content/SEO integration tests and rendered HTML assertions; keep manual assistive technology and real-device checks explicitly separate from automated Chromium evidence. | Medium |

## Confirmed implementation facts

### Internationalization
- `next-intl` is installed and integrated through the Next.js plugin.
- Locale routing is `fa` and `en`, default `fa`, always-prefixed, with automatic locale detection/cookie disabled.
- Locale layout sets `lang` and `dir` and calls `setRequestLocale`.
- `src/i18n/types.d.ts` derives the message type from the English catalog.
- Current CI reports 109 bilingual message keys with matching placeholders.
- The locale-resolution fix explicitly passes locale to route-level translation calls and sets request locale in the layout.

### Content
- Domain types include artwork, gallery, Journal/event, artist profile, contact, CV, and homepage selection.
- Artwork/gallery/Journal records have stable IDs and optional localized slugs.
- Publication filters gate artwork on publication and image rights; Journal on publication, artist approval and locale approval; CV on publication and verification.
- Gallery membership and cover relationships are checked by publication filters.
- Contact demo values are centralized and are explicitly documented as owner-authorized demo fixtures; Contact routes remain noindex and outside the sitemap.
- Artist profile is currently undefined; CV records and approved CV PDF are currently absent.
- About page currently uses `src/lib/about-preview-fixtures.ts`, rather than the canonical artist profile record.

### SEO
- Artwork, gallery, and Journal detail metadata resolves localized records by stable ID and localized slug.
- Detail metadata includes canonical URLs and alternate locale routes when a corresponding published record exists.
- JSON-LD helpers exist for VisualArtwork, CollectionPage/ItemList, Article and Event; serialization escapes opening angle brackets.
- Sitemap is generated from public records and excludes Contact.
- Robots currently allows crawl and points to the canonical sitemap.
- About is intentionally noindex while the canonical artist profile is unavailable; Contact is noindex.
- Archive page metadata and sitemap alternate equivalence need further normalization and explicit tests.

## Skills and references

The requested named skills were checked in the installed skill registry during the implementation session. Matching installed skills were not available. Relevant guidance was consulted manually where source material was accessible (Vercel React Best Practices, React architecture, and Next.js i18n). The Patterns and Refactoring skill source could not be retrieved, so it is not claimed as used. No third-party skill was installed or executed.

## Prioritized follow-up plan

1. **Message resources:** split locale catalogs into domain files without changing translation keys or UI behavior; preserve typed next-intl messages and extend the audit to detect unused keys.
2. **Content boundary:** introduce explicit content resolvers and validation; make About resolve canonical ArtistProfile content, with the existing demo fixture isolated and non-indexable until approved content exists.
3. **Editorial governance:** review existing Journal titles, summaries, long-form copy, publication flags, and image placeholders with the owner; do not silently relabel or rewrite approved states during a technical refactor.
4. **SEO service:** centralize metadata generation and alternate eligibility; complete archive Open Graph/Twitter metadata; make sitemap alternates reciprocal and exact; add meaningful last-modified policy.
5. **Tests:** add content registry validation, localized route/404 checks, canonical/hreflang/sitemap/robots/JSON-LD tests, rendered HTML checks, and a literal UI-copy audit.
6. **Cleanup:** migrate consumers away from `src/lib/site.ts` by responsibility; remove the compatibility barrel only after confirming all imports are migrated.

## Verification snapshot

GitHub Actions run `41899192403` completed successfully for commit `dc1e40c97c0f777f9659e8e5f8f4048da12a41aa`, which matches the `feature` branch HEAD at audit time.

- ESLint: passed
- Bilingual message-catalog audit: passed (109 keys and matching placeholders)
- TypeScript: passed
- Content publication tests: passed
- Production build: passed
- Playwright Chromium browser/responsive tests: 129 passed
- Production smoke test: passed (root redirect and both `/fa` and `/en` routes returned HTML)
- SVG sticker validation and asset inventory: passed

This CI run verifies the listed automated checks only. It does not establish manual screen-reader/real-device review, artist approval of editorial copy, Search Console indexing, or production deployment behavior.


> **Reading this report:** The architecture audit and confirmed facts above preserve the original baseline at `dc1e40c`. The implementation status and verification below supersede baseline findings where they differ.

## Implementation progress — feature branch

**Implementation snapshot:** \`294aa803ab5ebf8f7cc5bf73affe1db56cd5a609\`

### Implemented

**Internationalization**
- Split English and Persian UI resources into domain files under \`src/i18n/messages/{en,fa}/\`: navigation, common, home, artwork, galleries, Journal, About, and Contact.
- Compose each locale's domains through its \`index.ts\` while retaining the existing flat next-intl key API and inferred message types.
- Load the locale-specific domain catalog from \`src/i18n/request.ts\`.
- Extend the catalog audit to compare both key sets and interpolation placeholders.
- Set locale explicitly at localized route boundaries and pass it to \`NextIntlClientProvider\`. This corrected the regression where English URLs rendered Persian messages.

**Content and application boundaries**
- Extracted safe localized-slug and same-origin asset-path behavior into \`src/lib/content/paths.ts\`.
- Extracted stable identity comparisons into \`src/lib/content/identity.ts\`. Archive hreflang now requires the same complete set of published content IDs in both locales; a partial overlap is insufficient.
- Moved publication eligibility, artwork/gallery/CV/profile/contact resolution, and homepage selections into \`src/lib/content/publication.ts\`.
- Moved Journal publication, event/time-zone validation, category selection, and upcoming-event resolution into \`src/lib/content/journal.ts\`.
- Added \`src/lib/content/validate-portfolio.ts\` for registry-wide ID/slug uniqueness, image-path and dimension checks, gallery/artwork references, Journal event dates/time zones, CV records, and homepage references.
- Reduced \`src/lib/site.ts\` to a backwards-compatible export barrel. Existing consumers can migrate incrementally; new tests import focused modules directly.
- The About route now prefers the canonical approved \`ArtistProfile\` and verified CV records when they exist. The existing fictional preview fixture is used only while the canonical profile is absent and remains noindex. No artist facts were fabricated or added.

**International SEO**
- Added \`src/lib/seo/metadata.ts\` to build localized canonical URLs, reciprocal hreflang links, Open Graph, Twitter cards, and robots policy consistently.
- Home, archive, and detail routes use the shared metadata builder and resolved canonical records. Social images are selected from approved local content images.
- Archive hreflang and sitemap alternates use exact published identity-set equivalence. Detail alternates use stable record IDs and localized slugs.
- Noindex pages explicitly clear inherited social metadata from the locale layout. About preview and Contact remain noindex; empty CV remains unavailable and outside the sitemap.
- Moved VisualArtwork, CollectionPage/ItemList, Article, and Event JSON-LD generation to \`src/lib/seo/structured-data.ts\`.

**Testing**
- Added registry validation and malformed-record tests.
- Added unit tests for canonical metadata, locale alternates, article timestamps, social image URLs, and noindex metadata.
- Added Playwright assertions against rendered English/Persian archive and detail HTML, including canonical, hreflang, descriptions, Open Graph/Twitter fields, and noindex About/Contact pages.

### Content-domain migration status

| Domain | Current status | Publication/approval handling |
|---|---|---|
| Artist profile / About | Canonical profile resolver and rendering path implemented; no canonical profile record has been supplied yet. | Preview fixture remains visibly identified as fictional and noindex. Approved profile content will become indexable. |
| Artwork | Central typed records, stable IDs, localized slugs, image metadata, and publication resolver. | Requires published status, confirmed image rights, and locale-specific title/alt. |
| Galleries | Central records with stable IDs, ordered artwork references, and cover relationships. | Published only when all members and the cover resolve to public locale-ready artworks. |
| Journal / events | Central records and shared publication/event resolver. | Requires publication, artist approval, locale approval, valid occurrence/time-zone data, and safe registration links. Existing editorial copy and placeholder-image mappings still need owner/editorial review; technical refactoring did not rewrite or reapprove them. |
| CV | Typed entry/document models and publication filters are implemented. | No verified CV entries or artist-approved PDF currently exist; the empty CV route remains unavailable. |
| Contact | Contact data is centralized and validated by method. | Current demo destinations remain noindex and excluded from the sitemap until replaced with real owner-supplied details and indexing is authorized. |

### Verification snapshot

GitHub Actions run [41949722751](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41949722751) completed successfully for commit \`294aa803ab5ebf8f7cc5bf73affe1db56cd5a609\`. At verification time, this SHA matched the \`feature\` branch HEAD.

- ESLint: passed
- Bilingual catalog key and placeholder audit: passed
- TypeScript: passed
- Content and metadata unit tests: passed
- Production build: passed
- SVG sticker validation and asset inventory: passed
- Playwright Chromium: **130 passed**
- Production smoke test: passed for the root redirect and both localized routes

No merge to \`stage\` or \`main\`, production deployment, or external service change was performed.

### Remaining technical debt and recommendations

1. **Content formats:** editorial records remain typed TypeScript modules. This preserves current computed asset-dimension behavior and typed data, but simple structured records could move to JSON and long-form Journal/artist prose to Markdown after editorial review. Do not bulk-convert placeholder copy or alter publication status as part of that migration.
2. **Consumer migration:** \`src/lib/site.ts\` is now a compatibility barrel, but some route/component consumers still import through it. Move imports to focused modules gradually, then remove the barrel only after reference and regression checks.
3. **Message governance:** key/placeholder parity is enforced, but unused-key detection and a reliable scan for embedded UI literals are not yet implemented.
4. **Sitemap freshness:** no meaningful \`updatedAt\` field exists on the current content model. \`lastModified\` is therefore omitted rather than populated with a misleading build timestamp. Add it only when editorial updates can supply a real value.
5. **SEO coverage:** rendered HTML tests cover representative homepage, archive, detail, About, and Contact cases. Expand the route matrix for every page type and test sitemap alternate pairs for records with genuinely different localized slugs.
6. **Editorial approval:** confirm the current Journal copy and temporary Journal image mappings with the owner. Existing approval flags were preserved; passing technical tests does not replace artist/editorial/rights approval.
7. **Manual QA:** automated Chromium checks do not establish manual screen-reader, keyboard-only, real-device, Safari/Firefox, contrast, or production Core Web Vitals verification. These remain release checks.
8. **Locale expansion:** the locale list, direction, Open Graph tags, and content validation are centralized, but the language selector and alternate-route/metadata API still model one counterpart locale. Generalize them to enumerate all configured locales before adding a third language.
9. **Search monitoring:** Search Console/Bing verification and indexing monitoring require explicit launch authorization and are not part of this branch-only refactor.

### Skills usage clarification

The installed skill registry did not expose the requested named skills. Relevant Vercel React, React architecture, and Next.js i18n guidance was applied manually from accessible source material. The Patterns and Refactoring skill source could not be retrieved and is not claimed as used. No third-party skill was installed or executed.
