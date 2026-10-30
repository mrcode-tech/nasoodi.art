# Nasoodi.art — Phased Implementation Blueprint

**Status:** Proposed execution blueprint; phase completion must be evidenced  
**Working branch:** `feature`  
**Product:** Bilingual Persian/English portfolio for oil painter Ghazaleh Abdolahzade Nasoodi  
**Primary design direction:** “The artist's quiet gallery”  
**Companion execution prompt:** [website-implementation-prompt.md](./website-implementation-prompt.md)

This blueprint converts the product and design specifications into dependency-aware implementation phases. It is the execution sequence for implementation work. Page-specific specifications remain authoritative for detailed behavior and content; this blueprint governs sequencing, dependencies, exit gates, and evidence.

## Guiding principles

1. Finished, artist-approved paintings are the primary content; the interface frames them.
2. The homepage hero is an approved finished painting, not a studio/process photograph.
3. Do not invent artist facts, artwork metadata, gallery groupings, translations, rights, or approvals.
4. Preserve original artwork color, texture, aspect ratio, orientation, and signature.
5. Persian RTL and English LTR are first-class experiences; the physical-left sidebar stays left in both.
6. Apply the mandatory design-engineering and refined design-system authorities in every UI phase.
7. Build in small vertical slices; test and visually inspect real output before marking a phase complete.
8. Do not merge to `main`, deploy, publish, or alter branch strategy without separate explicit authorization.

## Phase dependency map

```mermaid
flowchart TD
  P0[0. Discovery and audit] --> P1[1. Foundation and design system]
  P1 --> P2[2. Shared shell and navigation]
  P0 --> P3[3. Content and artwork pipeline]
  P2 --> P4[4. Artwork-led homepage]
  P3 --> P4
  P3 --> P5[5. Works catalogue and artwork detail]
  P5 --> P6[6. Curated galleries]
  P1 --> P7[7. About, CV and Contact]
  P1 --> P8[8. Unified Journal and events]
  P2 --> P8
  P3 --> P8
  P4 --> P9[9. Easel scroll composition]
  P5 --> P10[10. SEO, accessibility, performance and security]
  P6 --> P10
  P7 --> P10
  P8 --> P10
  P9 --> P10
  P10 --> P11[11. Full QA, CI and release readiness]
```

Phases may proceed in parallel only where dependencies are satisfied and changes do not conflict. Phase 0 is mandatory before implementation. Content-dependent public features may be built with unpublished fixtures, but must not expose unapproved content.

## Phase 0 — Repository, product, content, and asset discovery

**Objective:** Establish an evidence-based implementation baseline and resolve critical unknowns before design or code decisions.

**Work**
- Inspect branch, HEAD, worktree, routes, layouts, components, tokens, dependencies, scripts, tests, workflows, and hosting configuration.
- Read all mandatory specifications and reconcile conflicts, especially the homepage hero direction and the unified Journal information architecture.
- Inventory all image assets. Inspect actual visual content, dimensions, orientation, color profile, file size, source/provenance, rights, approval, and derivative status.
- Inspect `specification/assets/artwork.JPG` and every file in `specification/assets/gallery/`; filenames alone do not establish grouping or suitability.
- Create an asset manifest linking source master, canonical content ID, intended use, approval state, and derivative paths.
- Confirm artist identity spelling, locale priorities, hero painting, selected works, gallery names/membership/order/covers, artwork metadata, biography/statement, CV, exhibitions, Journal entries, event facts, contact route, and any sales/commission scope.
- Record all missing facts and approval dependencies.

**Deliverables**
- Repository baseline and gap report.
- Asset manifest and source/rights/approval register.
- Content readiness matrix and explicit owner questions.
- Reconciled list of routes, requirements, and implementation gaps.

**Tests / verification**
- Verify actual asset metadata and open images for visual inspection.
- Validate that content records can distinguish draft, approved, and published states.
- Confirm current build/test commands and existing CI workflows.

**Exit gate**
- No critical implementation decision relies on guessed repository structure or invented content.
- Every candidate public asset has a documented status.
- All unresolved content and approval decisions are recorded.

**Dependencies:** Owner/artist input for approval-dependent decisions.

## Phase 1 — Application foundation and design system

**Objective:** Establish a stable, reusable, accessible technical and visual foundation.

**Work**
- Preserve the current Next.js App Router, React, TypeScript, and Tailwind architecture unless inspection demonstrates a justified change.
- Remove starter-template identity and generic placeholder copy where safe.
- Establish semantic warm-paper, surface, ink, muted-text, accent, border, and focus tokens based on the visual identity specification.
- Implement a deliberate bilingual typography system after font license, Persian shaping, Latin rendering, weight, and file-size checks.
- Establish spacing, container, grid, image-frame, responsive, focus, and interaction-state conventions.
- Define strict content/data contracts for artist, localized content, artwork, galleries, Journal entries/events, assets, and CV entries.
- Add validation and publication gates so unapproved or incomplete content cannot be published.
- Establish baseline lint, typecheck, unit-test, and build checks.

**Deliverables**
- Documented tokens and typography decisions.
- Reusable primitives and validated content schemas.
- Baseline quality scripts and CI integration plan.

**Tests / verification**
- Token and schema tests.
- Persian/English rendering and direction tests.
- Typecheck, lint, build, and responsive foundation smoke tests.

**Exit gate**
- No parallel or conflicting design token system.
- Invalid/unapproved content is rejected or remains unpublished.
- Foundation is usable in both locales and keyboard/touch contexts.

## Phase 2 — Shared site shell and navigation

**Objective:** Deliver consistent navigation and layout behavior across all routes.

**Work**
- Implement desktop persistent physical-left sidebar.
- Implement accessible mobile off-canvas sidebar with locale/theme controls at the bottom where specified.
- Keep physical-left placement in both RTL and LTR; adapt reading direction and alignment without mirroring navigation placement.
- Add top-bar utilities only as confirmed by the navigation contract.
- Include Home, Works, Galleries, Journal, About, CV (if approved/appropriate), and Contact according to the final approved information architecture.
- Use one unified Journal route; do not create a separate Events top-level item.
- Implement focus management, Escape dismissal, focus restoration, active route semantics, touch targets, and clear open/close states.
- Implement locale switching and correct document-level `lang` and `dir`.

**Deliverables**
- Shared responsive shell and navigation components.
- Route/locale navigation configuration.
- Keyboard and touch interaction behavior.

**Tests / verification**
- Unit/component tests for active routes, drawer state, focus, Escape, locale switch, and RTL/LTR.
- Desktop/tablet/mobile/short-height screenshots.
- Keyboard-only and touch review.

**Exit gate**
- Navigation is consistent across routes, accessible, and correctly localized.
- No duplicate or unsupported navigation destinations.

## Phase 3 — Content model and artwork asset pipeline

**Objective:** Safely represent and deliver real paintings without compromising fidelity.

**Work**
- Implement canonical artwork records with stable IDs/slugs, localized approved titles/captions, metadata, source asset, publication state, alt text, and relationships.
- Implement gallery membership references without duplicating artwork records.
- Build a reproducible responsive derivative pipeline from approved masters.
- Preserve native ratio/orientation/color/texture/signature; do not crop unless a separately approved crop asset exists.
- Record dimensions, formats, quality settings, and source-to-derivative mapping.
- Define image loading priority, responsive sizes, intrinsic dimensions, and fallback behavior.
- Keep studio/process photos separately classified from finished artwork.

**Deliverables**
- Validated content schemas and sample fixtures.
- Asset manifest and derivative generation process.
- Approved image delivery components/utilities.

**Tests / verification**
- Schema and publication-gate tests.
- Image dimension/ratio/metadata tests.
- Source-to-derivative visual comparison and color/fidelity inspection.
- Missing image, unusual ratio, and loading/error-state tests.

**Exit gate**
- Every public artwork maps to an approved master and approved metadata.
- Derivatives preserve fidelity and no process image is misclassified as artwork.

## Phase 4 — Artwork-led homepage

**Objective:** Create a memorable, painting-first introduction to the artist.

**Work**
- Use one artist-approved finished painting as the dominant hero; `specification/assets/artwork.JPG` is only a candidate until inspected and approved.
- Establish artist identity and a concise approved introduction without invented biography or claims.
- Provide a clear Works path and meaningful exploration actions.
- Add a Featured Works section with deterministic selection of 3–6 approved artwork IDs where enough content exists.
- Add a separate Featured Galleries section with 2–4 published curated galleries where available.
- Add Latest from the Journal after artwork and gallery features; omit when no approved published entries exist.
- Keep the hierarchy editorial and artwork-led, not a repetitive card grid.
- Ensure each feature links to a valid canonical destination.

**Deliverables**
- Responsive homepage with approved content selection logic.
- Homepage metadata and structured data where factual support exists.

**Tests / verification**
- Homepage content-selection and link tests.
- Desktop/tablet/mobile/short-height visual QA in Persian and English.
- Artwork fidelity and no-crop checks.
- Empty/one/many works, no galleries, and no Journal content states.

**Exit gate**
- Hero and public copy are approved.
- Featured items are valid, approved records.
- Homepage hierarchy and responsive behavior pass visual review.

## Phase 5 — Works catalogue and artwork detail

**Objective:** Make the complete approved body of work discoverable and inspectable.

**Work**
- Implement Works index and stable artwork detail routes.
- Support optional meaningful groupings/series only when approved.
- Display approved artwork images uncropped with subordinate, verified metadata.
- Add accessible image viewing/zoom only if it improves inspection without compromising keyboard, touch, and reduced-motion behavior.
- Implement related gallery links and related artwork only when relationships are approved.
- Handle missing optional metadata without empty labels or invented values.

**Deliverables**
- Works catalogue, artwork detail template, route generation, and not-found behavior.

**Tests / verification**
- Route, slug uniqueness, schema, publication, metadata, alt-text, and sitemap tests.
- Keyboard/touch viewer tests if applicable.
- Persian/English visual inspection and image fidelity review.

**Exit gate**
- Every published work is artist-approved and traceable to a master.
- No fabricated metadata or broken routes.
- Catalogue remains usable with one, many, or no published works.

## Phase 6 — Multiple curated galleries

**Objective:** Present artist-approved curated collections as distinct editorial destinations.

**Work**
- Implement Galleries index and dedicated gallery detail routes.
- Support multiple independently titled/described galleries with ordered artwork membership and approved cover artwork.
- Allow one artwork to appear in multiple galleries using canonical artwork references.
- Validate unique slugs, non-empty published galleries, cover membership, localized fields, rights, and approval states.
- Provide clear navigation between gallery, artwork, and other relevant galleries without duplicating records.

**Deliverables**
- Gallery schemas, index, detail pages, and editorial validation.

**Tests / verification**
- Gallery membership/order/cover/slug tests.
- Route, SEO, sitemap, accessibility, and responsive tests.
- Screenshots of index and at least two distinct detail pages when two approved galleries exist.

**Exit gate**
- Every published gallery has artist-approved name, description, cover, and membership.
- Cross-gallery artwork references remain canonical and consistent.

## Phase 7 — About, CV, and Contact

**Objective:** Provide accurate artist context and a reliable contact path.

**Work**
- Implement About with approved artist statement and factual biography as separate content fields.
- Implement CV/Exhibitions only when verified entries exist; omit empty or fabricated sections.
- Implement Contact with an explicitly approved public channel.
- Add a contact form only if delivery infrastructure, validation, spam protection, accessibility, privacy handling, and failure states are implemented and approved.
- Add artwork enquiry context only when the owner approves the workflow.

**Deliverables**
- About, CV/Exhibitions, and Contact routes as supported by approved content.
- Validated contact behavior or a direct approved contact link.

**Tests / verification**
- Content approval and localization review.
- Contact destination and delivery tests if a form exists.
- Privacy/security review and responsive/keyboard checks.

**Exit gate**
- No unverified CV or biography claims.
- Contact route is real, public, tested, and approved.

## Phase 8 — Unified Journal and events

**Objective:** Provide one editorial destination for articles and event announcements.

**Work**
- Implement Journal archive and detail routes with validated entry types (article and event) and publication states.
- Include type filters only where useful and accessible.
- Add event date/time, timezone, venue, attendance mode, registration destination, and temporal status only from verified facts.
- Keep event occurrence status distinct from editorial publication status.
- Link related artwork/galleries using canonical records.
- Add homepage latest Journal section and optional upcoming-event feature when approved eligible content exists.
- Do not add a separate Events top-level navigation item.

**Deliverables**
- Journal archive, article/event templates, filters, content validation, and homepage integration.

**Tests / verification**
- Publication visibility, event time-zone, temporal state, and filter tests.
- Article/Event structured data only when content qualifies.
- Route, sitemap, metadata, accessibility, responsive, and bilingual visual tests.

**Exit gate**
- Journal and event content is approved and accurate.
- Draft/unapproved content is never publicly exposed.
- Empty and no-upcoming-event states are intentional.

## Phase 9 — Easel scroll background

**Objective:** Add the specified subtle studio/easel motif without competing with artwork or content.

**Work**
- Follow `easel-scroll-background.md` exactly.
- Use the approved source assets and document-relative composition.
- Implement subtle, reversible scroll-linked reveal only if it remains performant and accessible.
- Keep the composition behind content and outside interactive hit areas.
- Reduce or hide it at constrained viewports as specified.
- Provide a static/no-motion fallback and honor `prefers-reduced-motion`.

**Deliverables**
- Easel background component and responsive/reduced-motion behavior.

**Tests / verification**
- Screenshot review at long/short pages and desktop/tablet/mobile.
- Reduced-motion, high zoom, contrast, and interaction-hit-testing.
- Mobile performance and scroll smoothness.

**Exit gate**
- Effect is subtle, reversible, non-blocking, and does not obscure or alter artwork.
- Full site remains usable with motion disabled.

## Phase 10 — SEO, accessibility, performance, privacy, and security

**Objective:** Make the complete site discoverable, inclusive, fast, and responsibly operated.

**Work**
- Implement factual localized metadata, canonical URLs, Persian/English alternates, sitemap, robots, Open Graph, and supported structured data.
- Validate route indexing and avoid indexing drafts or duplicate localized URLs.
- Audit WCAG 2.2 AA semantics, contrast, keyboard, focus, names, touch targets, zoom/reflow, reduced motion, and screen-reader behavior.
- Measure Core Web Vitals and optimize image delivery, fonts, hydration, scripts, and layout stability based on evidence.
- Minimize tracking and third-party requests; review CSP, headers, dependencies, form handling, and data collection.
- Do not make unsupported security or privacy claims.

**Deliverables**
- SEO implementation and validation report.
- Accessibility findings and remediation.
- Performance measurements and optimization record.
- Privacy/security review and risk register.

**Tests / verification**
- Metadata, canonical, hreflang, sitemap, robots, and JSON-LD validation.
- Automated accessibility tests plus manual keyboard/screen-reader checks.
- Production-like mobile performance and Core Web Vitals.
- Dependency/security checks and route smoke tests.

**Exit gate**
- No critical accessibility/security issues remain.
- SEO signals match real approved content.
- Performance is measured and acceptable on mobile.
- Privacy behavior is documented and minimal.

## Phase 11 — Full regression, CI, and release readiness

**Objective:** Verify the integrated product and prepare a safe handoff without publishing.

**Work**
- Test every public route and locale across desktop, tablet, mobile, and short-height viewports.
- Verify loading, empty, error, not-found, long-title, unusual-image-ratio, and optional-content states.
- Run all repository quality commands discovered in `package.json`, including lint, typecheck, unit/component/integration/E2E tests, and production build where available.
- Ensure GitHub Actions CI runs the relevant checks; inspect actual workflow logs and report the exact run conclusion.
- Capture and inspect screenshot evidence with manifests; fix issues and repeat screenshots.
- Verify external/social/contact links, metadata, sitemap/robots, image integrity, and no unintended third-party requests.
- Record release notes, known limitations, rollback considerations, and owner approvals outstanding.

**Deliverables**
- Test and CI evidence.
- Screenshot set and manifest.
- Accessibility, SEO, performance, and artwork-fidelity reports.
- Release-readiness checklist and handoff report.

**Exit gate**
- All relevant automated checks and production build pass.
- CI passes with actual logs inspected.
- Visual QA is complete for required routes/locales/viewports.
- Artist/site-owner approval is recorded for public content and visual choices.
- Merge, deployment, and publication remain separate actions requiring explicit authorization.

## Phase tracking template

Copy this block for every phase in the implementation report:

| Field | Required evidence |
|---|---|
| Status | Not started / In progress / Blocked / Complete |
| Scope | Requirements and paths addressed |
| Dependencies | Completed phases and owner decisions |
| Changes | Changed files and concise implementation summary |
| Tests | Exact commands, results, and relevant test counts |
| CI | Workflow, run URL, conclusion, and log evidence |
| Visual QA | Routes, locale, viewport, state, screenshot paths, findings |
| Approvals | Artist/site-owner decisions completed or outstanding |
| Risks | Known defects, limitations, and mitigations |
| Next step | Concrete next action and owner/dependency |

## Cross-phase quality gates

These apply to every phase, not only the final QA phase:

- Read the relevant design authorities and page-specific specifications before implementation.
- Inspect existing code/assets before creating new patterns.
- Preserve artwork and editorial integrity.
- Test Persian RTL and English LTR.
- Test keyboard, touch, focus, and reduced motion for affected interactions.
- Inspect actual rendered screenshots; source review alone is insufficient.
- Update the relevant specification when a durable design or behavior decision changes.
- Never report a phase complete without its exit evidence.

## Implementation progress — 2026-10-30

This is an evidence snapshot, not a declaration that every blueprint phase is complete.

| Phase | Status | Evidence and remaining gates |
|---|---|---|
| 0. Repository and asset discovery | In progress | Repository structure, scripts, CI, route baseline, and supplied transparent artist/easel cutouts inspected. Finished-painting assets, rights, metadata, translations, and public-use approvals remain unverified. See [asset review register](./asset-review-register.md). |
| 1. Application foundation and design system | Implemented; CI verified | Next.js route-group foundation, semantic warm-paper palette, strict TypeScript content contracts, root redirect, and responsive page frame. Exact Latin/Persian font pairing remains a licensing/rendering decision. |
| 2. Shared shell and navigation | Implemented; browser QA verified | Physical-left desktop sidebar, locale utility, mobile off-canvas drawer, keyboard Escape/focus restoration, and Persian/English direction. Playwright checks cover drawer behavior and physical-left positioning. Theme selector remains unresolved because the navigation spec requests Light/Dark/System while the refined design authority says not to infer dark-mode scope without confirmation. |
| 3. Content model and asset pipeline | Partial | Artwork, Gallery, Journal types and publication filters exist; collections are deliberately empty. Asset register, source/rights approval, derivative generation, and visual comparison remain outstanding. |
| 4. Artwork-led homepage | Partial / content blocked | Localized homepage composition, featured Works/Galleries/Journal sections and honest empty states exist. The required approved finished-painting hero is not published because no specific hero asset approval is recorded. |
| 5. Works and artwork detail | Partial | Localized catalogue/detail route templates, metadata omission, and 404 behavior exist. No artwork records are published. |
| 6. Curated galleries | Partial | Gallery index/detail route templates and canonical artwork references exist. No gallery names, covers, descriptions, or memberships are published without approval. |
| 7. About, CV, and Contact | Partial / content blocked | About and Contact routes disclose missing approved copy/contact details. CV is omitted because no verified entries are available. |
| 8. Unified Journal and events | Partial | One Journal route supports article/event records; no entries are published. No separate Events navigation destination is added. |
| 9. Easel scroll background | Not started | Source easel cutout inspected; full-page sizing, document-relative mapping, responsive/reduced-motion behavior, and explicit public-use approval gate remain. |
| 10. SEO, accessibility, performance, privacy, and security | Partial | Locale metadata, canonical homepage alternates, robots, sitemap, semantic landmarks, focus styling, reduced-motion CSS, and route noindex rules for empty editorial destinations exist. Manual WCAG 2.2 AA, screen-reader, performance, security, and privacy audits remain. |
| 11. Regression, CI, and release readiness | In progress | ESLint, TypeScript, four content-publication tests, production build, seven Playwright browser tests, screenshot artifact upload, and production route smoke tests passed on commit `5b1ad749cfff1b568cf24c5226aa47cfbcd5d508`. Visual screenshots were inspected at desktop and mobile sizes; artist/content approvals remain outstanding. |

### Verified implementation evidence

- Repository: `mrcode-tech/nasoodi.art`
- Active branch: `feature`
- Verified commit: `5b1ad749cfff1b568cf24c5226aa47cfbcd5d508`
- Successful GitHub Actions run: [41057600503](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41057600503)
- Browser tests: 7 passed, 0 failed.
- Content publication tests: 4 passed, 0 failed.
- Visual QA artifact: `nasoodi-visual-qa-5b1ad749cfff1b568cf24c5226aa47cfbcd5d508` (artifact ID `12977058389`).
- Inspected screenshots: Persian desktop homepage (1440 × 960), Persian mobile menu (390 × 844), and English mobile menu (390 × 844).

The screenshots verify shell/layout and responsive menu behavior, not final artwork-led visual acceptance. The homepage remains intentionally sparse because approved painting records and hero image selection are not yet available.

### Explicit publication blockers

1. Confirm which supplied files are finished-painting masters and which are process/composite assets.
2. Approve the exact homepage hero painting and public use of each image.
3. Confirm artwork titles or approved untitled treatment, alt text, metadata, order, and gallery membership.
4. Approve Persian and English artist statement, biography, translations, public contact channel, and any CV/Journal facts.
5. Resolve whether the Light/Dark/System selector remains a product requirement.
6. Approve the easel asset's site-wide decorative use and final scroll treatment.

Until those decisions are recorded, keep the related content unpublished and non-indexable. Do not substitute invented or generated artwork.


## Incremental implementation update — 2026-10-30

This update records verified code and CI work after the earlier evidence snapshot. It does not mark the overall website or any phase as release-complete.

| Phase | Updated status | New implementation evidence | Remaining gate |
|---|---|---|---|
| 3. Content model and artwork asset pipeline | Partial | Journal entries now use the specification's four discriminants (`exhibition`, `event`, `studio-update`, `story`), constrained rich-text blocks (paragraphs, headings, lists, quotes, safe links), explicit artist approval, per-locale approval, and scheduled publication state. Unsafe rich-text link schemes are rejected. | Approved content records, source-to-derivative pipeline, rights evidence, and painting fidelity review remain outstanding. |
| 6. Multiple curated galleries | Partial | Homepage and Galleries index now resolve each gallery's canonical cover artwork through the public-artwork gate and display its approved image, localized title, and description. Cover imagery is rendered without cropping. | No gallery content is published until cover, title, description, membership, translations, and rights are approved. |
| 8. Unified Journal and events | Partial | Added URL-addressable filters for Exhibitions, Events, Studio Updates, and Stories; localized labels; active filter semantics; empty-category feedback; publication/event dates; event time-zone validation; and constrained rich-text detail rendering. | No Journal or event records are published; actual event facts, copy, dates, and translations require approval. |
| 10. SEO, accessibility, performance, privacy, and security | Partial | Added localized canonical/Open Graph metadata for artwork, gallery, and Journal details. Filtered Journal URLs canonicalize to the archive, and empty editorial destinations remain noindex. | Structured data qualification, manual WCAG 2.2 AA/screen-reader audit, production-like Core Web Vitals, and privacy/security review remain. |
| 11. Regression, CI, and release readiness | In progress | GitHub Actions run [41060637606](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41060637606) passed on commit `82a32f0c1d8968ddb029930546c5d0aee32bd7a3`: ESLint, TypeScript, 11 content tests, production build, 8 Chromium browser tests, screenshot artifact upload, and production route smoke test. Screenshot artifact: `nasoodi-visual-qa-82a32f0c1d8968ddb029930546c5d0aee32bd7a3` (artifact ID `12979170943`). | Existing screenshots validate the tested shell and empty-content states, not final artwork-led visual acceptance. Firefox/Safari, real-device, assistive-technology, and manual visual audits remain. |

### Recent implementation commits

- `9752da1fb78f9ab3e8d4ae8ea934c6391f97f255` — categorized and filterable Journal archive.
- `d9e252d183088e810d1e0488185a540b793b3aa3` — canonical gallery cover artwork in discovery views.
- `6be70e8b91e57f74f9b5fb97d65eca1a28d116ee` — category test import correction; the subsequent complete successful verification is recorded above.
- `0c05ec094b93f790b9756329722bf41062291f47` — localized metadata for artwork, gallery, and Journal details.
- `e17a00a1ad623c899d5bb958f13e765be1199f74` — Journal type union aligned with the four specification categories.
- `373c2cc20065982954a213ed830f13180bb4fc8d` — constrained Journal rich-text rendering and safe link validation.
- `adcb576e6ad4cb000578e257bc14d4c65a1772c5` — completed Journal type-union migration.
- `85bcd3b3609dc817b392aa282933ef5f39d75989` — explicit Journal artist/locale publication approval gates.
- `82a32f0c1d8968ddb029930546c5d0aee32bd7a3` — canonical archive metadata and browser regression test.

### Publication and release blockers remain unchanged

The implementation intentionally does not invent paintings, artwork metadata, gallery memberships, artist biography/statement, CV entries, Journal copy, event facts, or public contact details. The approved homepage hero and public-use status of each painting remain owner decisions. The easel background remains unimplemented pending the specified asset-use approval and visual review. The Light/Dark/System selector remains unresolved against the conflicting design authorities.

Keep all unapproved content unpublished and non-indexable. No merge, deployment, or public release is authorized by this progress update.


## Incremental implementation update — 2026-10-30 (localization and event correctness)

This update records code and CI evidence from the latest feature-branch work. It does not mark the full site or release as complete.

| Area | Change | Evidence | Remaining gate |
|---|---|---|---|
| Localization | The locale switcher now checks whether the equivalent published Works, Gallery, Journal, or CV destination exists in the target locale. If not, it falls back to that locale's homepage. Static About and Contact routes retain their localized equivalents. | Unit coverage for the route resolver; updated Playwright test for the empty Works fallback. | Add translated records only after artist/editorial approval; verify reciprocal hreflang as content is approved. |
| Journal events | Event start/end timestamps now require an explicit ISO 8601 UTC offset or `Z`, plus the validated IANA time zone. Time-zone-less values are rejected to avoid server/visitor interpretation drift. | Content publication tests cover explicit offsets, UTC timestamps, invalid time zones, and timezone-less rejection. | Owner-supplied event records, dates, venues, and approved translations remain absent. |
| CI / regression | The full GitHub Actions pipeline passed after correcting the E2E expectation to match the specified locale-home fallback. | [Run 41065984109](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41065984109): ESLint, TypeScript, content tests, production build, 11 Chromium E2E tests, screenshot artifact upload, and production route smoke test all passed. | Manual visual review, assistive-technology review, Firefox/Safari, and real-device QA remain. |

### Recent commits

- `b25b38a7b06fd3fa98fc4324d202060308de2238` — locale-aware equivalent-route fallback.
- `896571020802e00e0318c41a280d28a6b8be29a1` — explicit event timestamp validation and Journal contract update.
- `81dfab54d44a245645dc455311b1cd5ed251905a` — corrected locale fallback integration.
- `a8ac64d672873b1bc26a3e360e2569fc7f8ffab6` — corrected event timestamp validator syntax after CI lint caught the issue.
- `59c9cf042d126ea861999cec3f7945db4f2c6c1d` — E2E assertion aligned with the specified locale fallback.

The latest verified application commit is `59c9cf042d126ea861999cec3f7945db4f2c6c1d`. This progress record must be kept separate from artist approval and publication readiness.


## Incremental implementation update — 2026-10-30 (homepage event selection and event-local time)

This update records the next verified feature-branch increment. It does not mark the site or release as complete.

| Area | Change | Verification | Remaining gate |
|---|---|---|---|
| Homepage / Journal | Added a publication-gated upcoming-event selector. It chooses the nearest future event by its occurrence instant, requires the existing published/artist-approved/locale-approved event contract, and presents it as the lead item before up to two recent Journal entries. Expired events are not presented as upcoming. | Unit test covers chronological selection, expired-event exclusion, and locale approval. | No approved Journal/event records exist yet, so populated event rendering and editorial acceptance remain unverified. |
| Journal event dates | Archive event dates now format in the event's declared IANA time zone and show that zone; event details also show the zone and optional end time. Publication dates retain their separate UTC formatting. | ESLint, TypeScript, content tests, production build, 11 Chromium E2E tests, and production route smoke test passed together. | Verify populated event cards and detail pages in both locales when approved events are supplied. |
| CI / visual evidence | Successful GitHub Actions run [41068529735](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41068529735) on commit `6e3e2b0718ac35683dcb662a872c0c397ff32569`. | 14 content tests passed; 11 Chromium E2E tests passed; lint, typecheck, build, screenshot upload, and smoke test passed. Visual QA artifact: `nasoodi-visual-qa-77c4b67d940cef33581b1bfdf23f0b4d8aa8bf41` (artifact ID `12984895625`). | Existing screenshots exercise empty-content and shell states; they cannot visually validate an event card until real approved event content is present. |

### Recent implementation commits

- `23ab175c8f559311c4a884a4d9eadaa55c0b01df` — upcoming Journal event selection and homepage presentation.
- `befa5415ad3635b99760b80148cacc825cf97f58` — Journal archive/detail event-local time-zone presentation.
- `6e3e2b0718ac35683dcb662a872c0c397ff32569` — corrected Journal event-card JSX and verified the complete CI pipeline.

The first CI attempt for the event-local time-zone presentation caught a JSX grouping error. That defect was corrected in the final commit above; the successful run is the evidence of the corrected state. The duplicate CI run triggered for the same commits is not needed to establish the passing result.

### Publication and release blockers

The approved homepage painting, published artwork/gallery records, CV facts, artist statement/biography, public contact destination, Journal entries/event facts, image rights, and easel-use approval remain owner/artist decisions. The Light/Dark/System selector remains unresolved against the conflicting design authorities. Do not fill these gaps with invented content or unapproved imagery. No merge, deployment, or publication is authorized by this progress update.
