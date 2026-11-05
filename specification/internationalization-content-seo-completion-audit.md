# Internationalization, Content, and SEO Completion Audit

**Audit date:** 2026-11-05  
**Repository:** `mrcode-tech/nasoodi.art`  
**Target branch:** `feature`  
**Baseline evidence:** The current `agent.md` records commit `01c00996c60313088e06478df4cca7aea47d3569` and CI run `41993382170` as the latest completed checkpoint. The branch comparison against `stage` reports divergence (141 commits ahead, 21 behind); this task must not merge or reconcile those branches.

## Executive summary

The repository already has a substantial Next.js 16 / React 19 / next-intl implementation, bilingual message namespaces, typed editorial records, localized route slugs, metadata helpers, a sitemap, structured data, and automated checks. However, the current content architecture does **not** satisfy the new unified JSON requirement.

The largest blockers are concrete:

1. The canonical artist profile JSON is `null`, CV entries are an empty array, and the CV document JSON is `null`.
2. The About route imports `src/lib/about-preview-fixtures.ts` and renders that separate fixture when the canonical artist profile is absent. It also displays a sample-content notice.
3. Journal article bodies remain in bilingual Markdown files and are converted to generated TypeScript during dev/build/test.
4. The current content model and publication helpers require approval/verification/status fields, including `artistApproved`, `approvedLocales`, and `verified`; these fields are part of the existing publication gate and need an explicit domain-model migration rather than being copied into the new editorial data model.
5. The i18n audit checks Persian literals only, scans only TSX under app/components, and uses a broad Unicode regular expression. It does not detect English hardcoded UI copy or inspect TS/JS/JSX.
6. The generic localized section route combines About, Contact, Works, Galleries, Journal, and CV in one large route module.
7. Existing metadata helpers correctly centralize canonical/hreflang/social metadata, but archive titles/descriptions are largely sourced from UI messages rather than canonical editorial records. About/CV are currently omitted from the sitemap because their canonical content is empty.

The new owner-provided implementation prompt supersedes the older sample/preview fixture architecture for this task. Existing artwork assets, stable artwork IDs, gallery membership, localized routes, UI design, and unrelated work must remain intact.

## Findings by area

| Area | Current implementation | Remaining issue | Required change | Risk |
|---|---|---|---|---|
| i18n | next-intl 4.14.9; `/en` and `/fa`; centralized locale registry; separate en/fa message namespaces; locale direction configured as LTR/RTL | Request config resolves an invalid request locale to the default locale; audit covers Persian literals in TSX only, not all user-facing literals or JS/TS/JSX | Enforce unsupported-locale 404 at routing boundary; extend UI-literal audit to all relevant source extensions with documented exceptions; test missing localized values | High |
| Content | JSON records exist for artworks, galleries, homepage selection, Journal metadata, artist, CV, and Contact; typed adapters and a validator exist | Artist JSON is `null`; CV entries are `[]`; CV document is `null`; Journal bodies remain Markdown; approval/status fields are coupled to editorial content; there is no single unified localized JSON record model for all requested domains | Populate canonical artist/About/CV content; move Journal bodies into localized JSON fields; remove Markdown generation; simplify to one record per entity with localized values and stable IDs; add/extend runtime validation and focused repositories | High |
| About/CV | About and CV are handled in the generic `[section]/page.tsx`; profile lookup uses publication gating; About falls back to `about-preview-fixtures.ts`; CV uses a separate entries/document adapter | Separate fixture and canonical sources; production page can show sample notice; empty canonical profile suppresses normal About content; CV is empty | Remove fixture/fallback and sample notice; render About and CV from canonical JSON in all environments; retain current presentation and PDF download behavior only when a real PDF asset is configured | High |
| SEO | Shared localized metadata helper; stable-ID matching for artwork/gallery/Journal alternates; localized sitemap; JSON-LD for artwork/gallery/Journal | Archive metadata title/description mostly come from UI messages; About/CV are excluded while content is empty; rendered HTML coverage does not cover all required page types; generic route metadata logic is coupled to page routing | Resolve localized metadata from canonical records; add About/CV/Contact and event metadata rules; verify every requested page's actual HTML, canonical, hreflang, social tags, JSON-LD, sitemap, and robots behavior | High |
| Utilities | Typed domain definitions, content publication helpers, route identity helpers, validation function, gallery pagination; scripts for Journal Markdown generation, i18n audit, asset audit | Journal generation script is obsolete under JSON-only editorial policy; schemas/repositories are not consistently separated; validation does not yet establish completeness of all requested domains/locales | Remove Markdown generation after migration; introduce small focused repositories and runtime schemas; validate required locale fields, IDs, localized slug uniqueness, relationships, and asset existence | Medium |
| Components | Server Components are the default; shadcn/Radix primitives and shared components exist; current visual behavior has broad Playwright coverage | `[section]/page.tsx` is a large multi-domain route with content lookup, metadata, presentation, and fallback behavior combined | Split About, Contact, Works, Galleries, Journal, and CV route responsibilities incrementally; keep shared metadata/routing helpers reusable; avoid visual redesign | Medium |
| Testing | `npm test` covers content, gallery pagination, SEO, and Vercel deployment policy; CI runs lint, i18n audit, typecheck, tests, build, asset audit, SVG validation, Playwright, and production smoke checks | Existing tests explicitly import the About fixture and expect verified/published CV data; SEO E2E currently expects About to remain noindex and absent from sitemap; no comprehensive JSON-only or all-page rendered-HTML assertion exists | Migrate tests with the model; add JSON schema/completeness/relationship tests, localized route tests, rendered metadata tests for all page types, and About/CV regression coverage | High |

## Evidence inspected

- `AGENTS.md`, `agent.md`, `specification/README.md`
- AI-assisted engineering, i18n, content architecture, content model, editorial governance, accessibility/security, and testing specifications
- `package.json` and `.github/workflows/ci.yml`
- `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/types/locale.ts`
- `src/content/*` adapters and editorial JSON records
- `src/types/content.ts`
- `src/lib/content/publication.ts`, `src/lib/content/journal.ts`, `src/lib/content/validate-portfolio.ts`
- `src/lib/about-preview-fixtures.ts`
- `src/app/(site)/[locale]/[section]/page.tsx`, localized detail route, and `src/app/sitemap.ts`
- SEO metadata and structured-data helpers
- i18n audit and Journal Markdown generation scripts
- Content, SEO, and international SEO Playwright tests

## Existing behavior and compatibility constraints to preserve

- Keep the existing `feature` branch; do not switch branches, merge, deploy, or change external services.
- Preserve explicit locale-prefixed `/en` and `/fa` URLs, current localized navigation, RTL/LTR document behavior, and all existing public paths.
- Preserve artwork IDs, asset paths, gallery relationships, artwork order, image fidelity, and publication/rights safeguards that apply to artwork assets.
- Preserve the homepage and current page designs, responsive behavior, themes, shadcn/Radix component architecture, and existing interaction behavior.
- Keep UI messages in next-intl resources; do not move editorial copy into UI message catalogs.
- Do not fabricate real-world awards, qualifications, exhibitions, contact destinations, or other factual claims. Where a factual CV detail is unavailable, do not manufacture a credential; use only non-claiming editorial material until owner-supplied facts are available.
- Do not commit to `stage` or `main`, deploy, or publish.

## Implementation sequence

1. Establish the unified localized JSON content contract and migrate existing editorial records without changing IDs, paths, ordering, or relationships.
2. Populate the canonical artist/About content and a structured CV record without fabricating real-world credentials; remove the About fixture/fallback.
3. Move Journal bodies into JSON and remove the Markdown generation pipeline.
4. Refactor repositories, runtime validation, and route consumers.
5. Extend i18n literal auditing and unsupported-locale/missing-translation tests.
6. Generate metadata from canonical records and verify rendered HTML, sitemap, robots, alternates, social tags, and JSON-LD.
7. Update all affected specifications and developer content-editing documentation.
8. Run local checks where available and GitHub Actions on `feature`; record exact SHA, workflow conclusion, logs, and remaining visual/owner review gates.

## Status

This is the initial repository audit, not a completion claim. Requirements are not considered implemented or verified until the corresponding code, tests, rendered output, and CI evidence are available.
