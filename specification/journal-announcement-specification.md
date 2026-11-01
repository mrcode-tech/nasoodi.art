# Journal Event Announcement — Detailed UI/UX and Implementation Specification

**Status:** Proposed implementation contract  
**Working branch:** feature  
**Design proposal:** journal-announcement-proposal.md  
**Wireframes:** journal-announcement-wireframes.md  
**Existing authorities:** journal-and-events.md, content-model.md, navigation-and-mobile-sidebar.md, localization-and-editorial-governance.md

## 1. Scope

Specify the homepage event announcement, homepage Journal preview, Journal archive integration, and event-specific Journal detail presentation.

This is a design and implementation specification only. Do not implement application code until the owner has reviewed the proposal and wireframes.

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

Baseline: clean warm-paper tab. Optional variant: subtle torn/perforated inward edge. Use existing semantic tokens and the project's design-engineering rules.

- English: physical-left outer edge flush; inward/right edge free.
- Persian: physical-right outer edge flush; inward/left edge free.
- Mobile: below the hamburger/menu trigger with a clear gap and safe-area offset.
- Desktop: align with the sidebar/identity zone; desktop may not display a hamburger.
- Tablet/compact: inspect the real navigation transition and choose a non-obstructive anchor.
- Fixed to viewport and independent of document scroll and hero geometry.
- Never span the viewport.
- Avoid covering wordmark, navigation rows, artwork, easel decoration, skip link, focused controls, or essential content.
- Use CSS logical properties where possible, but map the required physical edge explicitly from locale.
- Keep shape detail subtle; no raster texture unless approved and licensed.
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

Follow journal-and-events.md. Recommended hierarchy:
1. Section heading and approved introduction, if available.
2. Featured upcoming event card when eligible.
3. Up to two recent approved Journal entries.
4. Clear localized link to the complete Journal archive.

The section follows featured Works and Galleries and precedes final Contact/footer, subject to the established homepage composition. Use fewer entries when content is sparse. Never create fictional entries to fill a layout.

The fixed announcement and the in-flow Journal section are independent. Dismissing the former does not hide the latter.

## 9. Journal archive and pagination

Preserve one unified Journal destination for exhibitions, events, studio updates, and stories.

If pagination is justified by actual archive size:
- Default to five entries per page.
- Offer 5, 10, and 20 entries per page.
- Use the project's established accessible select component.
- Preserve filters, sort order, and page-size selection in URL state where appropriate.
- Reset to a valid page when filters or page size change.
- Provide accessible previous/next controls and current-page indication.
- Do not display pagination when all results fit on one page.
- Keep ordering deterministic and publication-date descending by default.
- Preserve the Journal taxonomy and avoid a duplicate Events route/navigation item.

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

## 17. Implementation sequence

Phase 1 — Discovery and reconciliation: inspect all required docs and actual code; report discrepancies before coding.

Phase 2 — Data selection: implement or reuse a pure eligible-event selector and test all editorial/temporal/locale rules.

Phase 3 — Announcement component: implement baseline clean tab, event-specific dismissal, and responsive physical-edge positioning.

Phase 4 — Homepage integration: add the fixed announcement and ensure the in-flow Journal section remains independent.

Phase 5 — Journal detail/archive alignment: implement event metadata presentation and page-size/pagination behavior only where needed and consistent with the existing Journal contract.

Phase 6 — Verification: run lint, typecheck, unit/component/integration/E2E tests, visual checks, and CI. Fix regressions before reporting completion.

Phase 7 — Owner review: present screenshots and list any unresolved visual decisions. Do not merge or deploy without separate authorization.
