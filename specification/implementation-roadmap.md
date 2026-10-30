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
