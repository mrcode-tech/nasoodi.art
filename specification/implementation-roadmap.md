# Nasoodi.art — Implementation Roadmap

**Status:** Proposed  
**Branch:** `feature`  
**Source of truth:** `specification/artist-portfolio/`

## Delivery principles

- Work in small phases with visible evidence.
- Keep the current Next.js App Router, React, TypeScript, and Tailwind baseline unless repository evidence justifies a change.
- Implement the proposal, not unverified artist facts.
- Use real artist-approved artwork assets before final visual approval.
- Keep the site usable when optional data or third-party services are unavailable.
- Run the repository CI workflow on every relevant change.
- Do not merge into `stage` or `main`, deploy, or alter branch structure without explicit authorization.

## Phase 0 — Content discovery and approval

**Deliverables**
- Confirm public English spelling and Persian display name.
- Confirm primary language and translation expectations.
- Collect original artwork images and rights approvals.
- Create an initial artwork inventory with title, date, medium, dimensions, series, and availability where known.
- Collect approved artist statement, biography, portrait/studio image, CV, and contact method.
- Decide whether sales/commission enquiries and a downloadable PDF are in scope.

**Exit criteria**
- At least an initial curated set of approved artwork images exists.
- Every selected work has a confirmed publication right and an accurate caption or a deliberate decision to omit unknown metadata.
- No invented biography, exhibition, price, or contact details remain.
- Artist approves the initial visual references and content direction.

**Dependency:** Artist/site owner supplies and approves content.

## Phase 1 — Foundation and design system

**Deliverables**
- Replace starter identity, copy, and violet-gradient visual language with the approved artist identity.
- Define typography, palette, spacing, layout widths, image ratios, caption styles, and interaction states.
- Implement global navigation, footer, locale switcher, and page-level metadata.
- Establish locale-aware routing and correct `lang` / `dir` behavior.
- Define structured types and validation for artworks, series, and artist profile.

**Tests**
- Lint and TypeScript.
- Unit tests for content schema and required publication fields.
- Route and locale metadata tests.
- Responsive layout smoke checks.

**Exit criteria**
- Both locales render correct direction and navigation.
- Shared shell is keyboard accessible and responsive.
- Content validation rejects invalid or unapproved records.

## Phase 2 — Portfolio gallery and artwork details

**Deliverables**
- Selected Works homepage section.
- Works index organized by artist-approved series.
- Artwork detail route or detail panel.
- Responsive image derivatives and accurate artwork captions.
- Optional lightbox only if it passes accessibility and mobile checks.

**Tests**
- Gallery renders only published/approved work.
- Artwork detail metadata hides unknown values.
- Image alt text and dimensions are present.
- Gallery order and keyboard behavior are stable.
- Broken/missing images show a graceful fallback.

**Exit criteria**
- Artist can review every published image and caption.
- Image fidelity is checked against original files.
- Desktop, tablet, mobile, LTR, and RTL reviews pass.

## Phase 3 — Artist profile, CV, and contact

**Deliverables**
- About page with separate artist statement and biography.
- CV/exhibitions page using verified records; hide empty sections.
- Contact page with approved email or configured form.
- Artwork-specific enquiry links if approved.
- Instagram link to the supplied account.

**Tests**
- No unapproved facts appear in public output.
- Contact links are valid and accessible.
- Form validation, spam controls, and failure states are tested if a form exists.
- External social links have appropriate labels and safe behavior.

**Exit criteria**
- Artist approves all published text and contact methods.
- No private address or phone is exposed without explicit approval.

## Phase 4 — SEO, accessibility, performance, and security

**Deliverables**
- Per-page title/description, canonical URLs, Open Graph metadata.
- Sitemap, robots.txt, structured data, and language alternates.
- Optimized image delivery and loading priorities.
- Accessibility review against WCAG 2.2 AA baseline.
- Privacy/security review for forms, scripts, and external services.

**Tests**
- Metadata, sitemap, robots, canonical, and hreflang checks.
- Structured data validation using only supported facts.
- Automated accessibility checks plus manual keyboard/screen-reader review.
- Core Web Vitals and mobile performance review.
- Image visual regression/fidelity spot checks.

**Exit criteria**
- No critical accessibility defects.
- No unapproved data or image assets.
- Performance is acceptable on representative mobile conditions.
- Search-engine metadata reflects the actual artist identity and content.

## Phase 5 — Final content QA and release readiness

**Deliverables**
- Artist review across all pages, languages, and responsive sizes.
- Final copy proofread by the artist or an approved editor.
- Verified contact/social links.
- Optional press-kit PDF if approved.
- Release checklist and rollback notes.

**Exit criteria**
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Automated unit/component/integration/E2E checks relevant to implemented behavior pass.
- GitHub Actions CI passes on the feature branch.
- Artist gives explicit approval of content and visual presentation.
- Deployment and branch merge are separately authorized.

## CI expectations

The current repository CI validates dependency installation, ESLint, TypeScript, production build, and a production homepage smoke test on pushes to `feature`, `stage`, and `main`, plus pull requests targeting those branches.

As portfolio features are implemented, extend CI to include:
- Unit tests for artwork/series data validation.
- Component tests for gallery, artwork metadata, navigation, and language controls.
- Route tests for locale, canonical metadata, and not-found states.
- E2E tests for navigation, RTL/LTR, keyboard gallery use, and contact flows.
- Automated accessibility checks for core routes.
- Responsive visual snapshots using only approved test artwork assets.

Do not claim a check exists or passes until the workflow actually runs and its logs confirm the result.

## Completion tracking

Update this roadmap with evidence after each phase:
- Status: not started / in progress / blocked / complete.
- Commit(s) and changed paths.
- Tests run and actual results.
- Screenshots or artifacts for responsive visual review.
- Open issues and decisions still needed from the artist.

A phase is not complete merely because code has been written.
