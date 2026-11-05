# Internationalization, Unified JSON Content, and SEO Completion Audit

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Audited implementation HEAD:** `2eed70cf1a3af26553a4c76a881ff6617227cea5`  
**Latest successful CI run:** [#42015803121](https://github.com/mrcode-tech/nasoodi.art/actions/runs/42015803121)  
**Tested SHA:** `2eed70cf1a3af26553a4c76a881ff6617227cea5`  
**Audit date:** 2026-11-05

## Executive summary

The feature branch has a working bilingual Next.js 16 application with separate English/Persian next-intl messages, localized server-rendered routes, JSON editorial records, focused repositories, content validation, metadata generation, stable-ID detail alternates, sitemap/robots routes, and production browser coverage. Earlier integration defects around About repository resolution, missing localized-slug handling, route-level Suspense for URL pagination, metadata/repository composition, and stale test assumptions have been corrected.

The implementation uses one canonical JSON source per content domain. Journal articles and exhibition/event records share the single Journal collection; the event repository is a typed filtered view, not a second data store. About and homepage biography resolve from the same artist-profile record. CV is one structured record. No About preview fixture, parallel demo content provider, or Markdown Journal body source remains.

The latest feature-branch GitHub Actions run completed successfully. It passed ESLint, the bilingual message/AST audit, TypeScript, all 57 unit/content/SEO/pagination tests, production build, asset inventory, all 136 Playwright browser/responsive tests, screenshot/diagnostic artifact upload, sticker SVG validation, and production-server smoke test.

## Initial audit and findings

| Area | Current implementation | Remaining issue | Required change | Risk |
|---|---|---|---|---|
| i18n | next-intl serves `/en` and `/fa`; locale layout sets document language/direction; message namespaces are separate; TypeScript AST audit scans TSX/TS/JSX/JS in app, components, and lib | Static audit cannot prove translation quality or human approval; only configured locales are covered | Keep parity and literal audit in CI; human-review editorial translations when changed; add locale config and JSON values for any future locale | Medium |
| Content | One JSON source each for artist, CV, Contact, artworks, galleries, Journal/events, site metadata, and homepage selections; focused repositories and validation | CV contains only a non-credential current-practice entry because owner-supplied career facts are not available; do not invent credentials to fill sections | Add education, exhibition, award, publication, or professional records only when supplied by the owner; keep JSON schema/repository unchanged | Medium |
| About/CV | About reads artist profile and CV repositories; CV route reads the same CV JSON; homepage biography uses the same artist record | Optional portrait and PDF are absent, so existing image fallback and no-download state remain active | Add approved portrait/PDF assets only when supplied; no fixture or alternate provider is needed | Low |
| SEO | Metadata helpers, canonical/hreflang, stable-ID detail alternates, JSON-LD, sitemap, robots, and rendered-HTML Playwright assertions are present | E2E validates rendered metadata and JSON-LD presence/type, but is not a substitute for independent search-engine validation or human editorial review | Retain route matrix; review Search Console/indexing after an authorized production release; do not deploy as part of this task | Medium |
| Utilities | Publication filters, slug resolution, pagination, metadata, and content validation are separated from repositories | The generic `[section]/[slug]` detail route still dispatches among artwork, gallery, and Journal details; it is intentionally retained to preserve existing URL architecture | Split only if future maintenance demonstrates a concrete benefit; keep current routes and server rendering | Low |
| Components | Dedicated About, CV, Contact, Works, Galleries, Journal, and homepage pages; shared presentation components; client pagination under Suspense | CI screenshots are uploaded but have not been manually inspected in this audit; accessibility automation does not replace assistive-technology/device review | Perform human visual and assistive-technology review before public release; no redesign is authorized here | Medium |
| Testing | CI includes lint, AST message audit, typecheck, 57 Node tests, production build, asset inventory, 136 Playwright tests, and production smoke test | Automated checks cannot establish artist approval, image rights, translation quality, or real-device behavior | Retain approval gates and record any manual review separately | Medium |

## Canonical content architecture

| Domain | Canonical source | Repository / consumer |
|---|---|---|
| Artist profile, biography, statement, About | `src/content/data/artist-profile.json` | `artist.repository.ts` |
| CV | `src/content/data/cv.json` | `cv.repository.ts` |
| Contact | `src/content/data/contact.json` | `contact.repository.ts` |
| Artworks | `src/content/data/artworks.json` | `artwork.repository.ts` |
| Galleries | `src/content/data/galleries.json` | `gallery.repository.ts` |
| Journal articles, events, exhibitions | `src/content/data/journal/index.json` | `journal.repository.ts`; `event.repository.ts` filters this same collection |
| Site/archive metadata | `src/content/data/site.json` | `site.repository.ts` |
| Homepage selections | `src/content/data/homepage-selection.json` | `homepage.repository.ts` composition |
| UI translations | `src/i18n/messages/{en,fa}/` | next-intl |

Journal bodies are localized structured JSON rich-text blocks; no editorial Markdown body files or Markdown generation pipeline remain. Components do not import editorial JSON directly. Repositories and typed adapters form the application boundary.

## About and CV verification

- `/en/about` and `/fa/about` read `artist-profile.json` through `getAbout(locale)`.
- Homepage artist content reads the same artist repository.
- About's CV section and `/en/cv` / `/fa/cv` read the same `cv.json` record through `getCv(locale)`.
- No preview fixture, production-only suppression, or separate environment provider exists.
- CV currently contains a single current-practice entry. Education, professional experience, exhibitions, awards, and workshops must not be fabricated; add those records when the artist/owner supplies the facts.
- Portrait and downloadable CV PDF are optional assets and are not fabricated.

## Localization and SEO verification

- Locales: `en`, `fa`; locale layout applies `ltr` and `rtl` respectively.
- UI message audit checks namespace parity, flattened keys, duplicate keys, non-empty strings, interpolation placeholders, and hardcoded visible UI literals using the TypeScript AST.
- Localized route slugs are explicit per locale; detail hreflang alternates are found by stable record ID, not by requiring slug equality.
- Sitemap consumes repositories and includes eligible localized routes; unknown/unpublished routes are handled as non-indexable/404 according to route behavior.
- The rendered-HTML Playwright matrix covers homepage, About, Contact, Works, Galleries, artwork detail, Journal archive/detail, event detail, and gallery detail in English and Persian. It checks document language/direction, canonical, hreflang, description, Open Graph, Twitter metadata, server-rendered editorial content, and JSON-LD.
- Robots and sitemap behavior are included in the SEO regression suite.

## Validation evidence

Latest successful run: [GitHub Actions #42015803121](https://github.com/mrcode-tech/nasoodi.art/actions/runs/42015803121)  
Tested SHA: `2eed70cf1a3af26553a4c76a881ff6617227cea5`

| Check | Result |
|---|---|
| Journal sticker SVG render/transparency validation | Passed |
| ESLint | Passed |
| next-intl parity + AST hardcoded-literal audit | Passed |
| TypeScript | Passed |
| Node content, pagination, and SEO tests | 57 passed, 0 failed |
| Next.js production build | Passed |
| Portfolio asset inventory | Passed |
| Playwright browser/responsive suite | 136 passed |
| Browser screenshot/diagnostic artifact upload | Passed |
| Production-server smoke test | Passed |

## Remaining work and release gates

1. Obtain owner-supplied factual CV details before adding education, exhibitions, awards, or professional history.
2. Obtain an approved artist portrait and downloadable CV PDF if those optional elements are desired.
3. Human-review Persian and English editorial copy, metadata, and translations before public release.
4. Manually inspect uploaded desktop/mobile, locale, and theme screenshots; run real-device and assistive-technology checks. CI success alone is not visual or accessibility sign-off.
5. Confirm image rights and artist approval for every artwork and its title, description, alt text, and gallery membership.
6. Do not merge, deploy, or publish without separate authorization.

No merge to `stage` or `main`, deployment, Vercel change, or DNS change was performed.
