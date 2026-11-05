# Internationalization, Content, and SEO Completion Audit

**Updated:** 2026-11-05  
**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Latest change recorded in this audit:** `b17f32068cdec2f7a3831e3ae130c5d75dab0e96`

## Executive summary

The first implementation increment has moved the most important editorial domains toward the owner-approved unified JSON architecture. The eight existing Journal bodies are now localized rich-text arrays inside `journal/index.json`; the Markdown sources and generation pipeline have been removed. The artist profile is populated in canonical JSON and is shared by homepage/About. The independent About fixture and sample CV endpoint are removed. CV content is consolidated into one JSON record, the CV verification flag is removed, and Contact uses only the owner-supplied artist Instagram destination.

The work is **not complete**. The remaining high-risk items are route decomposition, full runtime/schema validation, complete rendered-HTML verification, i18n audit execution and remediation, specification cleanup, and final CI/test evidence. The CV contains only the supplied/known current artistic practice; education, exhibitions, awards, and other factual career entries must not be invented. Add them when the owner supplies the facts.

## Current audit

| Area | Current implementation | Remaining issue | Required change | Risk |
|---|---|---|---|---|
| i18n | next-intl 4.14.9; explicit `/en` and `/fa`; locale registry and message namespaces; AST-based audit now scans TSX/TS/JSX/JS in app/components | New AST audit has not yet been run and any detected hardcoded literals have not been remediated; unsupported-locale Playwright test has been added but not executed | Run CI; fix all diagnostics; verify unsupported locale 404, locale switching, missing editorial translations/slugs, lang/dir, and parity | High |
| Content | Artwork/gallery/homepage selection remain JSON; Journal bodies now live in localized JSON rich-text blocks; artist profile, CV, Contact, and site metadata have canonical JSON records | Runtime schemas are not yet organized/complete for every record; validator still needs comprehensive localized-field/body/asset/relationship checks | Add focused runtime schemas/repositories and content completeness tests; verify all existing asset paths and relationships | High |
| About/CV | Homepage and About read `artist-profile.json`; About fixture and sample-CV API removed; CV entries and optional document now live in `cv.json`; CV entries no longer require a `verified` flag | CV is only populated with the known current oil-painting practice; no owner-supplied education, exhibition, award, or qualification details exist; PDF document remains unset | Keep factual sections empty rather than inventing credentials; add owner-supplied records later; preserve download mechanism when an actual PDF is provided | Medium |
| Journal/events | All eight entries preserve IDs, localized metadata, dates, event relationships, and artwork cover IDs; body is JSON; Markdown generation removed | Confirm every entry body is complete in both locales; strengthen body block and event relationship validation; rendered detail HTML not yet inspected | Add validation for required localized rich-text blocks, safe links, event dates/time zones, and cover relationships; inspect rendered details | Medium |
| Contact | One canonical `contact.json` contains localized title/description and owner-supplied Instagram; invented demo email/Telegram destinations removed; Contact metadata and sitemap eligibility use canonical data | Verify actual Contact page HTML, metadata, links, and sitemap alternates in both locales; decide whether any additional owner-supplied channels should be added | Complete rendered route and link tests; do not add unprovided destinations | Medium |
| SEO | Metadata for homepage/About uses artist JSON; Works/Galleries/Journal/CV archive metadata uses `site.json`; detail pages use localized records; Contact uses Contact JSON; sitemap includes eligible About/CV/Contact pages | Need production HTML verification for all required page types and event details; structured-data validation coverage is incomplete | Build production app; inspect canonical/hreflang/OG/Twitter/JSON-LD/robots and server-rendered content for every page type; validate sitemap/robots | High |
| Routing | Existing routes and public URLs remain in place; localized slug resolution still uses stable IDs | `src/app/(site)/[locale]/[section]/page.tsx` still handles six unrelated page domains and is too large | Extract focused route/page modules for About, Contact, Works, Galleries, Journal, and CV without URL or visual changes | Medium |
| Documentation | `AGENTS.md`, `agent.md`, README, content architecture, i18n, SEO, content model, editorial governance, and this audit now contain the unified JSON policy | Historical sections may still contain superseded preview/demo/Markdown language; practical editing examples and test instructions need review for consistency | Remove remaining contradictory instructions; add verified examples for every JSON domain and locale addition | Medium |
| Testing/CI | Content, SEO, and Playwright tests were updated for JSON Journal bodies, canonical About/CV, Contact, sitemap, and unsupported locales; push CI is configured for `feature` | The current integration does not expose a push-run listing/dispatch operation or the latest run logs; no new run conclusion, test counts, or tested SHA can yet be claimed | Inspect the GitHub Actions run for the final feature SHA; fix failures and record run URL, conclusion, job logs, and artifacts | High |

## Changes implemented on `feature`

- Migrated all eight Journal English/Persian bodies from Markdown into localized JSON rich-text blocks in `src/content/data/journal/index.json`.
- Replaced the Journal adapter to consume JSON body blocks directly.
- Removed `body.en.md`, `body.fa.md`, `markdown.generated.ts`, and `scripts/generate-journal-content.mjs`.
- Removed Journal Markdown generation hooks from `package.json`.
- Populated `artist-profile.json` with stable identity, localized name/slug/discipline, short introduction, biography, statement, artistic approach, and interests.
- Updated homepage and About to resolve the same canonical artist profile.
- Removed `about-preview-fixtures.ts` and the sample CV API route.
- Consolidated CV entries and the optional PDF reference into `cv.json`; removed the separate CV files and the CV `verified` flag.
- Added support for a localized CV period where a year is not appropriate.
- Replaced demo Contact email/Telegram/social values with the owner-supplied Instagram destination and localized Contact metadata.
- Added localized archive metadata in `site.json`.
- Updated About/CV/Contact metadata, sitemap eligibility, content tests, and relevant Playwright tests.
- Upgraded the i18n audit to use the TypeScript AST and inspect user-facing literals in TSX/TS/JSX/JS.
- Updated repository guidance and specifications to make the unified JSON architecture authoritative.

## Canonical content map

| Domain | Canonical source |
|---|---|
| Site/archive metadata | `src/content/data/site.json` |
| Artist identity, biography, statement | `src/content/data/artist-profile.json` |
| CV entries and optional PDF reference | `src/content/data/cv.json` |
| Contact title, description, destinations | `src/content/data/contact.json` |
| Artworks | `src/content/data/artworks.json` |
| Galleries and artwork relationships | `src/content/data/galleries.json` |
| Journal articles and event records, including localized bodies | `src/content/data/journal/index.json` |
| Homepage featured IDs/order | `src/content/data/homepage-selection.json` |
| UI translations | `src/i18n/messages/en/` and `src/i18n/messages/fa/` |

No separate About preview fixture, sample-CV endpoint, Journal Markdown source, generated Journal mirror, or CV verification flag remains in the migrated implementation.

## Important factual limitation

The current canonical CV contains only a non-credential description of the known oil-painting practice. Education, exhibitions, awards, institutional affiliations, qualifications, and other career records are not populated because no owner-supplied factual details were present in the inspected repository. This is intentional: do not invent external credentials to make the page look complete. The JSON structure is ready to accept those records when supplied.

## Verification status

- **Implemented:** changes listed above are committed to the remote `feature` branch.
- **Test definitions updated:** content and Playwright coverage has been adapted to the new model.
- **Not yet verified:** latest GitHub Actions conclusion/logs, TypeScript/ESLint/build/test outcomes after these changes, production rendered HTML, visual screenshots, manual accessibility, and final browser checks.
- **No merge/deploy:** no changes to `stage`, `main`, Vercel, DNS, or production deployment were made.

## Next implementation sequence

1. Inspect the current feature-branch CI run and fix failures before adding more architectural change.
2. Complete route decomposition for the six localized page domains.
3. Add runtime schemas and repository functions with strict localized-content, ID, slug, relationship, rich-text, and asset validation.
4. Extend missing-locale and unsupported-locale tests; run the AST audit and remediate its findings.
5. Verify rendered HTML and structured data for homepage, About, CV, Contact, Works, Galleries, artwork detail, Journal archive/detail, and event detail.
6. Review every remaining specification paragraph for contradictory fixture, Markdown, verification, and Contact demo instructions.
7. Run full CI against the final feature SHA and record actual results and artifacts.
