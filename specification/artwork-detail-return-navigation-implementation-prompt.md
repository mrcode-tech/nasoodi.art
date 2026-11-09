# Implementation Prompt — Artwork Detail Back to Artworks Navigation

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** existing `feature` branch only  
**Primary specification:** `specification/artwork-detail-return-navigation.md`  
**Task:** Implement a localized Back to Artworks control that restores the originating archive page and page size, with a safe direct-entry fallback.

## Role and outcome

Act as a senior Next.js/React engineer, frontend architect, localization/accessibility specialist, security reviewer, and QA lead.

Implement the complete behavior in the primary specification. The result must be production-quality, bilingual, responsive, accessible, secure, and consistent with the existing editorial gallery experience.

Do not assume the current UI is a conventional standalone detail page. The repository may use an Artwork Viewer/modal with route integration. Inspect the real implementation and preserve its established architecture.

## 1. Authorization and repository safety

- Inspect repository, current branch, HEAD SHA, worktree status, latest commits, package scripts, and CI workflows before editing.
- Work only on the already-existing `feature` branch.
- The owner has authorized commits, pushes, and GitHub Actions on `feature`; no additional confirmation is required for those actions.
- Preserve unrelated work and uncommitted changes.
- Do not create/switch branches, force-push, rewrite history, reset, or use destructive Git commands.
- Do not merge into `stage` or `main`.
- Do not deploy, publish, change DNS, modify Vercel settings/secrets, or change external services.
- Do not combine unrelated refactors, dependency upgrades, or design changes with this task.

## 2. Mandatory reading

Read in full before implementation:

1. `AGENTS.md`
2. `agent.md`
3. `specification/README.md`
4. `specification/artwork-detail-return-navigation.md`
5. `specification/gallery-collections-and-artwork-detail.md`
6. `specification/galleries-index-cards-and-pagination.md`
7. `specification/artwork-discovery-carousel-and-editorial-experience.md`
8. `specification/selected-works-three-level-experience.md`
9. `specification/internationalization-and-ui-translation-architecture.md`
10. `specification/localization-and-editorial-governance.md`
11. `specification/shadcn-component-reuse-and-bilingual-ui.md`
12. `specification/accessibility-performance-security.md`
13. `specification/testing-qa-and-release.md`
14. `specification/ai-assisted-development-and-code-quality.md`

If a named document does not exist, locate the current authoritative equivalent in `specification/` and record the substitution. Read relevant root/route-level agent instructions as well.

Before non-trivial React/Next.js work, follow the repository's AI-assisted development and code-quality contract and applicable installed engineering skills. Do not claim a skill was invoked unless it was actually available and used.

## 3. Audit the existing implementation before coding

Trace the full visitor flow and document findings:

- Actual localized Artworks archive route and artwork detail/viewer route.
- Whether artwork selection navigates to a standalone route, opens a dialog/viewer, or combines both.
- Archive pagination implementation, current query parameter names, default page size, supported page sizes, and invalid-value behavior.
- How archive artwork links or viewer-open actions are constructed.
- Existing previous/next navigation and collection/archive context handling.
- Current URL update strategy (router navigation, history state, intercepted routes, parallel routes, or other mechanism).
- Existing focus restoration and scroll restoration behavior.
- Localized route helpers and message-catalog organization.
- Current canonical, alternate-language, Open Graph, and structured metadata generation.
- Relevant unit, component, integration, and Playwright test patterns.

Do not infer parameter names from examples in the proposal. The current repository implementation is authoritative for existing route/query contracts. If the current UI uses an Artwork Viewer/modal, preserve it and implement the return interaction in that architecture rather than adding a second navigation model.

Create a concise audit note in the implementation report. Do not add an unnecessary permanent audit document unless repository conventions require it.

## 4. Required behavior

Implement the specification with these priorities:

1. Add a discreet localized Back to Artworks control in the appropriate location in the artwork detail/viewer experience.
2. When opened from the Artworks archive, preserve the exact originating archive URL state, including page and page size.
3. Preserve other existing archive state (for example supported search, filter, or sort parameters) without inventing new ones.
4. On activation, restore the originating archive view. If a modal/viewer is used, restore the relevant archive state, scroll position, and focus target using the existing architecture.
5. On direct detail entry, missing context, or invalid context, use the localized default Artworks archive destination.
6. Refreshing the detail route must not destroy a valid return destination.
7. Browser Back/Forward must remain natural and correct.
8. Preserve the canonical artwork route and its SEO identity independently of transient navigation context.

Use the smallest compatible and durable implementation. Prefer URL-backed context when compatible with current routing. Do not add a global store, localStorage, cookies, or new dependencies unless inspection proves they are necessary and the tradeoff is documented.

## 5. Return destination validation and security

Treat all return context as untrusted input.

- Accept only a same-origin, internal Artworks archive destination for the active locale.
- Reject external absolute URLs, protocol-relative URLs, cross-locale destinations, unrelated route families, malformed/ambiguous encodings, and unsafe paths.
- Parse with standard URL utilities and explicit allowlists.
- Preserve only supported query parameters and validate their values using the same rules as archive pagination/filtering.
- Prevent path traversal, encoded separator tricks, duplicate-parameter ambiguity, and open redirects.
- Use a localized default archive fallback for every rejected or missing value.
- Do not use transient return context in canonical URLs, alternate links, sitemap entries, Open Graph URLs, or structured data.

Do not write a bespoke parser if the repository already has a safe route/query utility that can be extended.

## 6. UI, localization, and accessibility

- English label: “Back to Artworks”.
- Persian label: “بازگشت به آثار”.
- Add translations to the centralized UI message catalogs. No inline locale conditionals or hardcoded user-facing strings in components.
- Ensure arrow/icon direction follows LTR/RTL correctly; avoid incorrect Unicode bidirectional ordering.
- Reuse existing shadcn/ui link/button primitives and design tokens.
- Keep the control visually quiet and secondary to the artwork. Do not add a large filled CTA, card, banner, or unnecessary divider.
- Preserve the artwork's scale, image fidelity, layout, and existing metadata presentation.
- Provide semantic navigation, a clear accessible name, visible keyboard focus, and appropriate focus restoration for modal/viewer behavior.
- Maintain logical DOM/reading order in English and Persian.
- Verify light/dark themes and desktop/tablet/mobile breakpoints.
- Respect reduced-motion preferences. No new animation is required.

## 7. Test strategy — content-independent

Follow `specification/testing-qa-and-release.md` and the repository test conventions.

Use synthetic fixture factories based on production domain types. Do not hardcode or assert current production artwork titles, artist identity, slugs, IDs, image filenames, editorial dates, ordering assumptions, or record counts.

### Unit tests

Cover:
- Valid return destination for the current locale's Artworks archive.
- Correct preservation of page and page-size state.
- Preservation of every currently supported archive query parameter.
- Invalid, missing, malformed, duplicated, and out-of-range query values.
- Rejection of external, protocol-relative, cross-locale, unrelated, and unsafe destinations.
- Correct localized fallback.
- Canonical URL generation remaining independent of return context.

### Component/integration tests

Cover:
- Archive-to-artwork navigation includes the expected context.
- Localized return control is rendered and has the correct accessible name.
- Activating it returns to the validated archive state.
- Direct entry and invalid context use fallback.
- Viewer/modal close behavior restores scroll and focus where applicable.
- Existing previous/next artwork navigation remains scoped and functional.

### Browser tests

Use deterministic synthetic data or a dynamically discovered semantic archive link only where a real published route transition is required.

Verify:
- Navigate from a non-default archive page and non-default page size to an artwork, then return.
- The same archive page and page size are selected after return.
- The visible archive slice is the same/distinct expected slice, not merely a URL with stale controls.
- Supported filters/sorting survive the round trip.
- English LTR and Persian RTL behavior.
- Direct detail entry, refresh, browser Back/Forward, missing context, and malicious/invalid return values.
- Keyboard navigation, visible focus, modal focus restoration if applicable, and touch interaction.
- Responsive layout and absence of horizontal overflow.

If a browser test requires a minimum number of published production records, check that precondition and skip only that production-backed scenario with an explicit reason. Synthetic unit/integration tests must still cover the behavior. Never weaken assertions or hide failures to make CI green.

## 8. Visual verification

Capture and inspect rendered output for:
- English desktop and mobile.
- Persian desktop and mobile.
- Light and dark themes.
- Artwork detail/viewer with valid archive context.
- Direct detail entry with fallback.
- Viewer/modal state and return/focus restoration, if applicable.

Record actual viewport, locale, theme, state, artifact path, and findings. Do not claim visual inspection unless the screenshots/artifacts were opened and inspected. Fix hierarchy, spacing, RTL/LTR, focus, overflow, and artwork presentation issues, then repeat the inspection.

## 9. Quality checks and CI

Inspect `package.json` and workflow definitions; use the actual repository scripts rather than assuming command names.

Run:
- Focused unit/component/integration tests.
- Relevant Playwright tests.
- Lint.
- TypeScript/typecheck.
- Production build.
- Relevant content, i18n, accessibility, route, and SEO checks.
- Complete GitHub Actions workflow on the final tested `feature` SHA.

Inspect completed workflow conclusion and logs. A queued or in-progress run is not a pass. If a check fails, diagnose and fix the underlying defect without deleting meaningful coverage or weakening assertions.

## 10. Documentation and commit

- Keep the implementation consistent with `specification/artwork-detail-return-navigation.md`.
- Update any relevant route/viewer or testing documentation if the implementation reveals a necessary contract clarification.
- Update `specification/README.md` only if the new document is not already indexed.
- Commit and push the focused implementation to `feature` after relevant tests and verification pass, as authorized.
- Do not merge, deploy, or publish.

## 11. Completion report

Report:

1. Branch and final HEAD SHA.
2. Audit findings about the actual archive/detail/viewer architecture.
3. Exact return-state mechanism and validation rules.
4. Files changed.
5. Unit/component/Playwright test results.
6. Lint, typecheck, build, and other check results.
7. CI workflow URL, conclusion, and exact tested SHA.
8. Visual QA locales, viewports, themes, and states inspected.
9. Known limitations or remaining work.
10. Explicit confirmation that no merge to `stage`/`main`, deployment, or publication occurred.

Do not report the feature as complete unless the final tested SHA has passing relevant checks and the required behavior has been verified in both locales.
