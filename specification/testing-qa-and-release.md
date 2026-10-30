# Testing, Visual QA, and Release Acceptance

**Status:** Proposed verification contract  
**Working branch:** feature

## Verification principles
A phase is complete only with implementation, content, accessibility, visual, and test evidence. A successful build alone is not proof of portfolio readiness. Never fabricate test results, screenshots, CI status, artist approval, or production behavior.

## Test layers
**Static:** ESLint, TypeScript noEmit, production build, dependency/security review.

**Unit:** artwork/series schema, publication and rights gates, locale fallback, metadata omission, image record validation, slug uniqueness and ordering.

**Component:** header/mobile navigation/locale switcher, artwork cards and metadata, grid ordering, image loading/fallback/alt, optional lightbox, optional contact form.

**Integration/routes:** public routes in each locale, lang/dir, canonical and alternate metadata, sitemap/robots, unknown artwork 404, draft/archived exclusion, contact provider in safe test mode.

**End-to-end:** Home → Works → artwork → About → Contact; locale switching; keyboard gallery; dialog behavior if present; valid/invalid form in test environment; no fake data; mobile navigation and overflow.

**Accessibility:** automated core-page checks, manual keyboard, screen-reader spot checks in both locales, reduced-motion, zoom/reflow, focus, and dialog semantics.

## Visual regression
Capture Home, Works, an artwork detail, About, Contact, and populated CV where applicable:
- Desktop 1440×900.
- Laptop 1280×800.
- Tablet 768×1024.
- Mobile 390×844 and 360×800.
- Short-height and landscape views.

Review both locales. Assess fonts/Persian shaping, palette, shared shell, hero/fallback, artwork fidelity/crop/aspect ratio, captions, metadata, responsive reflow, loading and error states. Pixel snapshots do not replace human review of paintings because browser and image encoder differences occur. Compare derivatives with source masters and request artist approval.

Store screenshots/reports as CI artifacts where supported. Include commit, route, locale, viewport, and environment in the manifest.

## CI expectations
The documented package scripts are lint, typecheck, and build. Inspect actual workflow files before claiming additional tests exist. Extend CI as suites are implemented. A feature-branch pipeline should install reproducibly from lockfile, run static checks and existing tests, run accessibility smoke checks where configured, build production, run production smoke tests, and upload diagnostic artifacts. Use synthetic fixtures that cannot be mistaken for published artist content.

## Content and rights gate
Every public artwork needs confirmed source/rights, artist approval for image/crop/title/caption/metadata, approved translations, reviewed alt text, and no private metadata. No test, placeholder, or invented records in production.

## Release gates
Technical: lint, typecheck, relevant tests, build, feature CI, no critical security/accessibility issues, production-like route smoke tests.

Visual/content: approved assets and copy, image fidelity reviewed, both locales reviewed, responsive screenshots approved, SEO/structured data validated, contact actions verified.

Authorization: artist/site owner explicitly approves public content; deployment and merge target are separately authorized. Passing tests does not authorize deployment or merge.

## Completion report
Record status, commit SHA/paths, commands and actual results, CI run URL/conclusion, screenshots/artifacts, outstanding approvals, known limitations, and next dependency.
## Visual design-engineering verification

In addition to functional checks, release QA must follow design-engineering-skills.md and design-direction-and-system-refinement.md.

Required visual evidence:
- Desktop, tablet, mobile, and short-height screenshots.
- Persian RTL and English LTR captures.
- Normal and reduced-motion behavior.
- Navigation, gallery filters, Journal filters, drawers, focus, and touch states.
- Artwork fidelity comparison against approved source files.
- Long titles, sparse content, empty Journal/event states, and mixed artwork ratios.

A build passing lint/typecheck/build does not establish visual quality. Record what was actually inspected, the viewport/locale, findings, and unresolved artist approvals. Do not claim visual verification without rendered evidence.