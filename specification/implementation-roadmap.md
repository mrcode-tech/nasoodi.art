# Nasoodi.art — Implementation Roadmap

**Status:** Proposed plan  
**Working branch:** feature  
**Specification source:** specification/README.md and linked contracts

## Delivery principles
- Keep the current Next.js App Router, React, TypeScript, and Tailwind baseline unless repository evidence justifies a change.
- Implement approved content and design, not invented artist facts.
- Keep the public site useful without optional services, animation, or third-party embeds.
- Preserve original artwork masters and verify every public derivative.
- Work in small phases with evidence and explicit exit criteria.
- Run actual repository CI; never claim a workflow check exists or passes without logs.
- Do not merge to main or deploy without separate explicit authorization.

## Phase 0 — Repository, content, and asset audit
**Deliverables**
- Inspect current routes, components, dependencies, workflow files, and image references.
- Inventory all assets, dimensions, transparency, source, rights, and intended class.
- Confirm artist name spelling, primary locale, translations, artwork selection, metadata, public image rights, biography/statement, contact method, and CV.
- Decide whether commissions, sale enquiries, a contact form, or press kit are in scope.

**Exit criteria**
- Initial approved artwork set and source masters exist.
- Every selected asset has a documented usage basis.
- Missing metadata is intentionally omitted rather than fabricated.
- Open decisions and blocked content are recorded.

**Dependency:** Artist/site-owner input.

## Phase 1 — Foundation and design system
**Deliverables**
- Replace starter identity and generic copy with artist identity.
- Establish palette, typography, spacing, containers, image rules, and interaction states.
- Implement shared header/footer, navigation, locale switcher, and page metadata.
- Establish Persian RTL and English LTR routing and document attributes.
- Define validated artist, artwork, series, asset, and CV data contracts.

**Tests:** lint, typecheck, schema/unit tests, locale and metadata tests, responsive shell smoke tests.

**Exit criteria:** shared shell works by keyboard and touch; locale direction is correct; invalid/unapproved records cannot publish.

## Phase 2 — Studio hero and homepage
**Deliverables**
- Implement the signature studio/process composition using approved assets.
- Provide static/reduced-motion fallback and responsive desktop/tablet/mobile layouts.
- Keep the artist identity, Works action, and access to real finished paintings immediately visible.
- Build selected works, approved intro, optional verified highlights, contact invitation, and footer.

**Tests:** viewport screenshots, reduced motion, keyboard/screen-reader checks, image fidelity, layout shift, no overflow.

**Exit criteria:** artist approves the hero and homepage; the studio image is not misrepresented as a finished artwork.

## Phase 3 — Artwork catalogue and detail
**Deliverables**
- Build Works index, stable artwork routes, optional meaningful series grouping, metadata, and optional accessible viewer.
- Generate responsive derivatives from approved masters.
- Display only approved records and known metadata.

**Tests:** schema/publication gate, route/404 tests, image alt/dimensions, keyboard order, derivative comparison, visual review in both locales.

**Exit criteria:** artist reviews every published image/caption; all images preserve color, texture, ratio, and crop integrity.

## Phase 4 — About, CV, and contact
**Deliverables**
- About page with distinct artist statement and factual biography.
- CV/Exhibitions only where verified entries exist.
- Contact page with approved channel; form only if real delivery, validation, spam protection, and privacy handling are configured.
- Artwork-specific enquiry context only if approved.

**Tests:** content approval, locale review, contact destination/delivery, form failure/success states if applicable, privacy/security review.

**Exit criteria:** all copy and contact behavior approved; no private address/phone or unverified CV claims.

## Phase 5 — SEO, accessibility, performance, and security
**Deliverables**
- Unique metadata, canonical URLs, valid locale alternates, sitemap, robots, Open Graph, and supported structured data.
- Responsive image delivery and loading priorities.
- WCAG 2.2 AA review, Core Web Vitals measurement, privacy and security review.

**Tests:** metadata/sitemap/robots/canonical checks, JSON-LD validation, automated and manual accessibility, production-like performance, image fidelity.

**Exit criteria:** no critical accessibility/security issues; metadata reflects real content; performance and image quality are acceptable on mobile.

## Phase 6 — Final QA and release readiness
**Deliverables**
- Review all public routes, locales, devices, and content.
- Capture desktop/tablet/mobile and short-height screenshots with manifests.
- Verify external links, social links, 404s, and optional contact delivery.
- Record release and rollback notes.

**Exit criteria**
- npm run lint, npm run typecheck, npm run build pass.
- Relevant unit/component/integration/E2E checks pass.
- GitHub Actions CI passes on feature, confirmed from logs.
- Artist/site owner approves public content and visual presentation.
- Deployment and merge are separately authorized.

## CI expectations
The current package scripts documented in README are lint, typecheck, and build. Inspect workflow configuration before stating additional checks exist. Extend CI to run relevant tests as they are implemented: schema tests, component tests, locale/routes, accessibility smoke checks, E2E, production build/smoke, and upload screenshots/reports where supported. Use synthetic fixtures, not real private artist data.

## Completion tracking
For each phase record status (not started / in progress / blocked / complete), commit SHA and paths, actual commands/results, CI run URL/conclusion, screenshots/artifacts and viewports, artist approvals outstanding, known limitations, and next dependency. Code written is not sufficient evidence of completion.


## Gallery and homepage extension — implementation requirements

The existing phases above must include the following concrete scope; these requirements are part of the roadmap, not optional future enhancements.

### Extend Phase 0 — Asset and collection audit
- Inspect `specification/assets/artwork.JPG` as the candidate hero painting and inspect all files in `specification/assets/gallery/`.
- Inspect every image's actual visual content, dimensions, orientation, color profile, file size, crop suitability, and source/rights/artist approval.
- Build an asset manifest mapping approved source images to canonical artwork records, galleries, hero, and featured selections.
- Ask the artist/site owner to confirm gallery groupings, gallery titles/descriptions in Persian and English, cover choices, artwork titles/metadata, and the hero painting.
- Do not assume `gallery/1.jpg`–`5.jpg` are a single gallery or separate named galleries based on filenames.

### Extend Phase 2 — Artwork-led homepage
- Make the approved painting the dominant hero image; initial candidate is `specification/assets/artwork.JPG` pending inspection and approval.
- Add the middle-of-homepage Featured Works section with deterministic 3–6 selected artwork IDs where available.
- Add a separate Featured Galleries section with 2–4 published gallery previews where available.
- Ensure all hero/featured items use canonical content records and link to valid destinations.

### Extend Phase 3 — Multiple galleries and artwork detail
- Implement a gallery data contract, gallery index, dedicated gallery detail routes, curated membership/order, and artwork detail pages.
- Support an artwork appearing in multiple galleries without duplicate artwork records.
- Validate gallery cover membership, translations, approval state, image rights, non-empty published content, and unique slugs.
- Add route, schema, SEO, sitemap, accessibility, and visual tests for galleries and artwork details.

**Phase exit evidence:** screenshots of homepage, gallery index, at least two distinct gallery detail pages when two approved galleries exist, artwork detail, both locales, and responsive breakpoints; automated validation results; asset manifest and outstanding artist approvals.

## Journal and events extension

### Extend Phase 0 — Editorial and event content audit
- Confirm the first artist-approved Journal entries, content types, Persian/English copy, cover-image rights, and related artwork/gallery references.
- For events, verify date/time, time zone, venue/location, attendance mode, registration destination, and whether each fact is approved for public display.
- Confirm the editorial publishing workflow and whether scheduled publication is needed.

### Extend Phase 1 — Shared navigation and content contracts
- Add Journal to the shared desktop sidebar and mobile off-canvas navigation.
- Define validated localized Journal entry types and publication states.
- Ensure Journal is active for both index and detail routes; do not add a separate Events navigation item.

### Extend Phase 2 — Homepage
- Add Latest from the Journal after Featured Works and Featured Galleries.
- Feature an eligible upcoming event when available, then recent published entries.
- Provide a direct View all journal entries link to the Journal index.
- Omit the section when no approved published content exists.

### Add Journal delivery phase after core content routes are stable
- Implement the Journal archive, type filters, article/event detail templates, publication visibility rules, and related artwork/gallery links.
- Add date/time-zone handling and event temporal states without changing editorial publication status.
- Validate localized metadata, sitemap inclusion, Article/Event structured data, accessibility, and responsive performance.

**Phase exit evidence:** desktop/mobile sidebar screenshots, homepage Journal section, Journal archive and filter states, article and event detail pages, Persian/English screenshots, schema/publication test results, SEO validation, and artist approval of all published entries and event facts.
## Cross-phase design quality gate

Every phase that changes user-facing UI must apply design-engineering-skills.md and design-direction-and-system-refinement.md. The quality gate is continuous, not a final styling phase.

Before implementation: read the relevant design context, inspect current components/tokens/assets, and shape the intended composition and states.

Before phase completion: review rendered output at desktop, tablet, mobile, and short-height viewports; verify Persian RTL and English LTR; test reduced motion, keyboard, and touch; compare artwork against approved masters; and record screenshots/findings. Do not mark a phase complete based only on code or CI success.

No generic card-template fallback, unnecessary animation, invented content, or unapproved image treatment is acceptable as a shortcut.