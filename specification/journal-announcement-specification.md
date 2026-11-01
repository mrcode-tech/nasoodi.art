# Journal Event Announcement — Detailed UI/UX and Implementation Specification

**Status:** Refined implementation contract — overall direction owner-approved; detailed visual variant and PNG asset pending review  
**Working branch:** feature  
**Design proposal:** journal-announcement-proposal.md  
**Wireframes:** journal-announcement-wireframes.md  
**Existing authorities:** journal-and-events.md, content-model.md, navigation-and-mobile-sidebar.md, localization-and-editorial-governance.md

## 1. Scope

The complete execution brief is [Journal and Sticker Implementation Prompt](./journal-announcement-implementation-prompt.md). That prompt is the coding-agent task package; this document remains the detailed product and technical acceptance contract. Read both, and resolve any discrepancy in favor of this specification plus the repository-wide authorities.

Specify the homepage event announcement sticker, homepage Journal preview, Journal archive integration, event-specific Journal detail presentation, and the decorative paper SVG source plus CI-generated PNG review workflow.

The owner has approved the overall Journal/sticker direction. The exact sticker treatment remains a visual review gate. The coding agent may implement Journal behavior and prepare the announcement using the hand-authored SVG study, but must not treat the study as final artist-approved artwork until the owner reviews the CI-rendered PNG.

Read journal-announcement-sticker-visual-design.md for the normative vector design and generation contract.

## 2. Mandatory repository discovery

Before implementation, read repository AGENTS.md, specification/README.md, design-engineering-skills.md, design-direction-and-system-refinement.md, journal-and-events.md, content-model.md, navigation-and-mobile-sidebar.md, localization-and-editorial-governance.md, accessibility-performance-security.md, seo-and-discovery.md, testing-qa-and-release.md, and the implementation roadmap.

Inspect actual App Router routes, Journal schema and data source, publication validation, event selection, locale dictionaries, shared sidebar and mobile menu, breakpoints, semantic tokens, z-index layers, preference utilities, and test/CI commands. Reconcile every integration point with real code. Do not invent paths, components, hooks, APIs, or commands.

## 3. Canonical content and eligibility

Use canonical Journal records. Never create a parallel event registry or duplicate an exhibition/event record.

An announcement candidate must:
- Be an eligible event or an exhibition entry with structured event dates, as permitted by the actual Journal schema.
- Have Published editorial status at the current time.
- Have explicit artist approval.
- Include the active locale in approvedLocales and provide a non-empty localized title.
- Have valid event date semantics and sufficient timezone context under journal-and-events.md.
- Be Upcoming, not ongoing or past.
- Not be archived, withdrawn, expired, or otherwise unavailable.
- Resolve to a canonical localized detail route.

Select the nearest upcoming start time. Define deterministic tie-breaking in code and tests. Do not use unapproved translation fallbacks. If no eligible candidate exists, return null and render nothing.

The existing Journal specification distinguishes publication status from event temporal status. Preserve that distinction. Do not automatically unpublish a past event.

## 4. Announcement content

Required:
- Localized category eyebrow.
- Localized event title.
- Link to canonical localized detail route.
- Separate dismiss button.

Optional:
- Confirmed event date/date range, formatted with the event timezone and project locale conventions.
- Small directional cue.

Exclude venue, long description, registration form, poster, ticket price, multiple events, and marketing language from the compact tab. Do not show ambiguous local timestamps.

## 5. Component and rendering architecture

- Follow current Next.js App Router conventions.
- Prefer server-side selection and validation; pass only a minimal localized view model to the interactive dismissal surface.
- Keep the component server-rendered where possible. Isolate client behavior to dismissal/persistence only.
- Reuse existing Button, Link, icon, typography, tokens, and preference utilities.
- Avoid dependencies for this small feature.
- Integrate at the actual homepage/shared-shell boundary discovered in code; do not assume a file path.
- Do not render the component on unrelated routes unless separately approved.
- Do not add layout padding or placeholder space when the component is absent.

## 6. Visual design and positioning

Baseline for the first visual review: the hand-authored torn-edge exhibition slip in specification/assets/journal-announcement-sticker.svg. The SVG is a candidate study, not final owner approval. Follow journal-announcement-sticker-visual-design.md for its exact vector, palette, dimensions, mirroring, and CI conversion rules.

- English: physical-left outer edge flush; inward/right edge free.
- Persian: physical-right outer edge flush; inward/left edge free.
- Mobile: below the hamburger/menu trigger with a clear gap and safe-area offset.
- Desktop: align with the sidebar/identity zone; desktop may not display a hamburger.
- Tablet/compact: inspect the real navigation transition and choose a non-obstructive anchor.
- Fixed to viewport and independent of document scroll and hero geometry.
- Never span the viewport.
- Avoid covering wordmark, navigation rows, artwork, easel decoration, skip link, focused controls, or essential content.
- Use CSS logical properties where possible, but map the required physical edge explicitly from locale.
- Keep shape detail subtle; no raster texture, image generation, screenshot tracing, or image-processing workflow. The SVG is authored directly as vector paths.
- No attention animation. Respect reduced motion.

The exact offset, dimensions, and z-index must be derived from the real shell and token system and verified at all supported breakpoints.

## 7. Dismissal behavior

- The event link and dismiss button are separate semantic controls.
- Dismissal hides the tab without navigation, page reflow, or focus theft.
- Default proposal is session-scoped dismissal. Inspect and reuse the existing preference mechanism if appropriate.
- Key dismissal to the selected event's stable ID or slug.
- Dismissing event A must not suppress event B.
- An ineligible event is removed even if its dismissal state exists.
- No analytics or new tracking mechanism.
- No dialog, toast, assertive live region, sound, or repeated reappearance in the same session.

## 8. Homepage Journal section

Follow both journal-and-events.md and the newer artwork-discovery-carousel-and-editorial-experience.md contract. The homepage preview contains **at most the two newest eligible published Journal entries across article and event types**. Preserve the established editorial/post-style presentation; do not redesign it as an event-led dashboard or add a third card.

- Section heading and approved introduction, if available.
- Up to two newest eligible published entries, ordered by publication date descending with deterministic tie-breaking.
- A clear localized link to the complete Journal archive.
- If fewer than two eligible entries exist, show fewer. If none exist, omit the section according to the existing Journal contract.
- Do not independently pin an older upcoming event into this preview. The upcoming event may appear here only if it is one of the two newest entries.

The fixed announcement sticker independently selects the nearest eligible upcoming event. Dismissing the sticker never hides or changes the in-flow Journal preview.

## 9. Journal archive and pagination

Preserve the existing unified Journal destination, route, taxonomy, filters, and editorial entry presentation defined by journal-and-events.md. Do not create a separate Events page or duplicate content model.

Where the actual archive size justifies pagination, use the requested page-size choices of 5, 10, and 20, with five as the default. Use the existing shadcn select pattern. Preserve filters and page size in URL state where supported; reset to a valid page after filter/page-size changes; provide accessible previous/next controls and current-page indication. Hide pagination when all results fit on one page. Default ordering remains publication date descending with deterministic tie-breaking. Reconcile with any already-implemented archive behavior before changing it; do not introduce a second pagination system.

## 10. Event detail page

Use the existing canonical Journal detail route and shared editorial shell.

Event-specific hierarchy:
1. Return-to-Journal breadcrumb/link.
2. Event/exhibition type label.
3. Localized title and optional summary.
4. Publication date.
5. Event information panel.
6. Approved cover image/poster, if available.
7. Main editorial content.
8. Related published gallery/artwork links.
9. More-from-Journal links.

Event information panel may show:
- Event start/end date and time, with timezone.
- Temporal state only when reliably derived.
- Confirmed venue/location.
- Confirmed online/in-person/hybrid attendance mode.
- Registration/official-information URL only when supplied and valid.

Do not render empty metadata rows. Clearly distinguish publication date from event date. Do not leave a stale registration action active after its deadline. Past events can remain published as archive entries.

## 11. Localization and RTL

- English uses lang=en and dir=ltr.
- Persian uses lang=fa and dir=rtl.
- Physical announcement anchor follows the locale-aware sidebar: left in English, right in Persian.
- Use approved Persian and English strings; no machine-generated runtime fallback.
- Isolate Latin names, URLs, and numeric values with existing bidi conventions.
- Validate long titles, date formatting, punctuation, and close-control order in both locales.
- Artwork, paintings, and photographs are never mirrored.
- Avoid hydration flash when locale changes.

## 12. Accessibility

- Use anchor for navigation and button for dismissal.
- Do not nest the button inside the anchor.
- Provide localized accessible names and visible focus indicators.
- Maintain WCAG 2.2 AA contrast.
- Touch targets meet project accessibility standards.
- Keep logical reading and keyboard order.
- Do not announce appearance as an assertive alert.
- Respect prefers-reduced-motion and forced-colors where supported.
- Test keyboard-only operation, screen-reader semantics, 320px width, short viewport heights, and 200% zoom.
- No horizontal overflow, clipped focus rings, or obstruction of essential controls.

## 13. SEO, privacy, and content governance

- The announcement is not a separate indexable page.
- Canonical event detail pages follow Journal SEO rules.
- Draft, scheduled, archived, unapproved, or locale-incomplete records must not be exposed or indexed.
- Do not add tracking, fingerprinting, or new personal-data collection.
- Do not invent events or publish sample fixtures.
- Any development fixture must be explicitly fictional, non-publishable, noindex, and excluded from sitemap and structured data.

## 14. Failure and empty states

- No eligible event: render nothing.
- Missing translation: render nothing for that locale.
- Expired/past/unpublished/unapproved event: render nothing.
- Dismissed current event: hide for the configured session.
- New event: may appear even if a different event was dismissed.
- Long title: wrap safely; omit optional date before truncating title.
- Unavailable image: omit image; do not show broken-image placeholder.
- Missing venue/registration: omit those rows/actions.

## 15. Acceptance criteria

1. One canonical Journal event record drives the announcement.
2. The nearest eligible upcoming event is selected deterministically.
3. Unapproved, unpublished, past, archived, or untranslated content never appears.
4. Announcement is fixed during scroll and does not move the hero or page layout.
5. English anchors physically left; Persian anchors physically right.
6. Mobile placement does not cover menu trigger or safe areas.
7. Desktop placement does not cover sidebar identity or navigation.
8. Link and dismissal are independent and keyboard accessible.
9. Dismissal is event-specific and follows the agreed persistence policy.
10. Homepage Journal preview remains visible independently.
11. Archive pagination is accessible and preserves filters when present.
12. Event detail separates publication date from event date and omits unknown metadata.
13. No horizontal overflow or clipping at supported breakpoints and zoom.
14. Tests cover selection, locale eligibility, temporal state, dismissal, responsive geometry, and accessibility.
15. CI passes all required repository workflows.

## 16. Required verification evidence

Provide:
- Unit tests for event eligibility, nearest-event selection, tie-breaking, locale readiness, and temporal boundaries.
- Component tests for link/dismiss separation, hidden state, empty state, and long titles.
- Integration tests for homepage selection and localized Journal detail navigation.
- E2E coverage for English and Persian at desktop, tablet, and mobile.
- Accessibility checks for keyboard, names/roles, contrast, and reduced motion.
- Screenshots for both visual variants and all target breakpoints, including a short-height viewport.
- CI workflow run links and actual results. Do not claim success without a completed run.

## 17. SVG source and CI-rendered PNG requirements

The SVG is the editable source of truth. The checked-in study at `specification/assets/journal-announcement-sticker.svg` is a starting point, not a reason to skip artwork authoring or visual refinement during implementation.

Mandatory requirements:
- Inspect and refine or replace the SVG paths during the implementation; do not merely copy the existing study into the application and call the artwork complete.
- Author the decorative silhouette directly as SVG markup using editable vector paths and strokes.
- Keep the outer canvas transparent and preserve the established warm-paper visual direction.
- Keep all announcement text, dates, arrows, labels, and controls in localized accessible DOM content. Do not embed SVG `<text>` or raster `<image>` elements.
- Do not use image generation, screenshot tracing, raster painting, or image-processing tools to create or modify the artwork.
- Preserve the physical attachment direction: English attaches at the physical left edge with the torn edge facing inward/right; Persian attaches at the physical right edge with the torn edge facing inward/left. Mirror only the decorative silhouette, never text or artwork.
- Keep the canonical SVG in the specification asset location. If an application asset copy is necessary, document the source-to-runtime relationship and prevent divergence.

GitHub Actions must render a transparent PNG review artifact from the checked-in SVG during implementation, regardless of whether PNG is later selected for runtime use. Use the existing renderer and CI workflow where possible:
- Source viewBox: 420 × 280 unless the visual-design specification is deliberately revised.
- Review PNG: 1260 × 840 pixels (3×).
- PNG mode: RGBA with transparent pixels outside the paper silhouette.
- Validate SVG parsing, viewBox, expected dimensions, non-empty render, alpha transparency, and absence of baked text/raster imagery.
- Upload the PNG as a named GitHub Actions artifact and make renderer/validation failures fail the workflow.
- Inspect the actual PNG at intended display size and at higher density. CI success proves technical rendering only, not visual approval.

The generated PNG is a CI review artifact, not a hand-maintained source asset. Do not commit it or add it to the application bundle before the owner has reviewed and approved the visual treatment. The live component may use the SVG directly if that is the sharper and more maintainable option. Runtime PNG use is a separate implementation decision and is not a reason to skip CI PNG generation.

Record the SVG's provenance, review status, intended display dimensions, and any owner-approved refinements in the visual-design specification.

## 18. Implementation sequence

Follow the detailed phase plan in `journal-announcement-implementation-prompt.md`. The minimum required order is:

1. **Repository and specification audit:** inspect instructions, branch/worktree, current Journal implementation, content model, routes, localization, shared shell, tests, and CI. Record actual gaps and conflicts before editing.
2. **SVG authoring and CI rendering:** refine or author the SVG immediately during implementation; validate it locally; run the existing GitHub Actions renderer; inspect the generated PNG. Do not postpone vector authoring until feature work is otherwise complete.
3. **Canonical event selection:** implement or reuse a pure deterministic selector using publication approval, locale readiness, event temporal state, timezone semantics, and stable tie-breaking.
4. **Journal experience:** implement the homepage preview, existing unified archive, event-specific detail presentation, and pagination/page-size behavior only where justified and not already implemented.
5. **Announcement component:** implement server-selected event data, accessible localized DOM content, event-specific dismissal, fixed responsive placement, and decorative SVG integration.
6. **Quality and regression:** add unit, component, integration, E2E, accessibility, localization, and responsive tests; protect existing homepage, gallery, artwork, and navigation behavior.
7. **CI and visual QA:** run repository-required checks and complete GitHub Actions; inspect logs and final tested SHA; capture and inspect English/Persian desktop, tablet, mobile, and short-height screenshots plus the PNG artifact.
8. **Owner review and handoff:** present the actual rendered PNG and browser screenshots. Record any visual decisions still awaiting owner approval. Do not merge, push, deploy, or publish without the required separate authorization.

## 19. Owner review and release gate

The overall Journal/sticker direction is approved in principle. The exact paper silhouette, torn-edge character, tape detail, sizing, and final Persian microcopy remain subject to owner review. A successful renderer, build, or test suite is not visual approval. Do not merge, deploy, or publish without separate authorization.
