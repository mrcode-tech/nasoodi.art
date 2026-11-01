# Implementation Prompt — Journal Experience and SVG Exhibition Announcement Sticker

**Project:** Nasoodi.art  
**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** existing `feature` branch only  
**Task type:** Full implementation, automated verification, and visual QA  
**Primary contract:** [Journal Event Announcement Specification](./journal-announcement-specification.md)  
**Supporting product contract:** [Journal, Articles, and Events](./journal-and-events.md)  
**SVG authority:** [Sticker Visual Design and SVG Asset Contract](./journal-announcement-sticker-visual-design.md)  
**Execution checklist:** [Journal Announcement Agent Instructions](./journal-announcement-agent-instructions.md)

## 1. Mission and expected result

Implement the connected Journal and exhibition-announcement experience as one coherent feature. This is an implementation task, not a documentation-only exercise.

Deliver:
1. The approved homepage Journal preview, limited to the two newest eligible published entries across all Journal types.
2. The existing unified Journal archive and its established filters/taxonomy, without creating a separate Events destination or duplicate content model.
3. Event-specific presentation on the canonical Journal detail route.
4. Accessible archive pagination/page-size behavior only where justified by the actual archive and existing implementation.
5. A fixed, dismissible, locale-aware exhibition announcement sticker that independently selects the nearest eligible upcoming event.
6. An SVG decorative paper asset authored or refined during this implementation.
7. A transparent PNG rendered from that SVG by GitHub Actions for owner review.
8. Automated tests, completed CI evidence, and inspected English/Persian responsive screenshots.

The overall product direction is approved in principle. The exact sticker silhouette, torn edge, tape detail, sizing, and final localized microcopy remain subject to owner review. Do not represent a successful build or SVG render as visual approval.

## 2. Non-negotiable product decisions

- Journal remains the single editorial destination for articles, exhibitions, events, studio updates, and stories.
- Do not add a top-level Events navigation item, separate Events archive, parallel event registry, or duplicate event record.
- Use the canonical Journal content model, publication workflow, route structure, and approval state.
- The homepage in-flow Journal preview shows **at most the two newest eligible published entries across article and event types**, sorted by publication date descending with deterministic tie-breaking.
- Do not add a third entry or pin an older upcoming event into the two-entry preview.
- The fixed sticker independently selects the nearest eligible upcoming event. It is not a third Journal preview card.
- Dismissing the sticker must not hide, reorder, or change the Journal preview.
- With no eligible upcoming event, render no sticker and reserve no layout space.
- Do not invent exhibitions, events, dates, time zones, venues, artists, registration links, artwork, or artist biography.
- Only approved, published, locale-ready content may appear publicly.
- Past events may remain published as Journal archive entries; temporal state and editorial publication state are separate.

## 3. Repository safety and operating rules

Before editing:
1. Read `AGENTS.md`, root `agent.md`, `specification/README.md`, this prompt, the primary specification, the proposal, wireframes, concise agent instructions, SVG visual-design contract, and all mandatory referenced design/content/technical authorities.
2. Inspect current branch, HEAD SHA, worktree status, latest commits, package scripts, route structure, existing Journal implementation, content data, and CI workflow.
3. Confirm the current branch is the already-existing `feature` branch.
4. Record unrelated and uncommitted changes; preserve them.

Rules:
- Do not create, switch, reset, rename, or delete branches.
- Do not merge into `stage` or `main`.
- Do not push, deploy, publish, change DNS, modify Vercel settings, or change secrets without separate explicit authorization.
- Do not overwrite unrelated work or use destructive Git operations.
- Do not commit until implementation, tests, build, and verification are complete and the owner has separately authorized the commit.
- Do not expand scope into unrelated About, Works, Galleries, artwork, or navigation redesigns.
- Do not invent file paths, route names, components, hooks, commands, or APIs. Discover them in the repository.
- If the branch or repository state is unsafe or materially different from the expected state, stop and report the evidence.

## 4. Mandatory discovery and reconciliation

Inspect the actual implementation rather than treating conceptual examples as literal paths.

Discover:
- App Router locale route structure and canonical Journal index/detail routes.
- Journal schema, data source, validators, publication status, artist approval, approved locales, and content fixtures.
- Existing article/event types and structured event date/timezone semantics.
- Existing homepage Journal section and selection logic.
- Existing archive filters, sort order, pagination, page-size state, and URL behavior.
- Event detail rendering and related artwork/gallery link conventions.
- Shared sidebar, mobile drawer, locale switcher, shell geometry, breakpoints, safe-area handling, z-index tokens, and skip link.
- Existing button/link/icon/typography primitives, shadcn components, CSS tokens, and RTL utilities.
- Existing preference/session persistence utility and current dismissal conventions.
- Existing tests, Playwright setup, screenshot artifacts, CI renderer, and GitHub Actions workflow.

Produce a short evidence-based gap matrix: requirement, current implementation evidence, status (implemented/partial/missing/conflicting/unverified), proposed minimal change, and tests needed.

Resolve conflicts using this precedence:
1. `AGENTS.md` and mandatory repository-wide safety/design authorities.
2. This feature's detailed `journal-announcement-specification.md`.
3. `journal-and-events.md` for canonical content model and Journal semantics, as reconciled by the newer two-entry homepage rule.
4. The approved proposal and wireframes.
5. Existing code conventions, where they do not contradict the contracts.

Do not silently weaken product rules to fit an existing implementation. If an unresolved conflict changes public behavior, ask the owner before coding that part.

## 5. Phase 1 — Author/refine the SVG immediately

**Do this during the early implementation phase. Do not leave SVG creation until the end.**

The existing `specification/assets/journal-announcement-sticker.svg` is a hand-authored design study and starting point. Inspect it, then refine its vector paths or replace its artwork with a better-authored SVG that satisfies the visual-design contract. Merely copying the existing study without assessment does not satisfy this task.

### SVG requirements

- Author the illustration directly in SVG/XML using editable paths, shapes, and strokes.
- Keep a transparent canvas outside the paper silhouette.
- Retain the quiet, tactile, warm-paper editorial direction; the sticker must look like a small exhibition paper slip attached to a gallery edge, not a sale badge, ad, toast, or promotional banner.
- Create a subtle irregular inward-facing torn edge and a restrained attachment/tape detail only if it improves the result.
- Keep the vector clean and maintainable; avoid unnecessary path complexity, heavy filters, raster texture, or harsh shadows.
- Keep text, date, category label, arrow, close icon, links, and all interactive controls out of the SVG.
- Do not embed `<text>` or `<image>` elements.
- Add suitable SVG title/description metadata only if it remains decorative and does not create redundant screen-reader announcements when used by the component.
- Do not use image generation, screenshot tracing, raster painting, or image-processing tools.

### Physical direction

- English/LTR: attachment edge on the physical left; torn/inward edge faces right.
- Persian/RTL: attachment edge on the physical right; torn/inward edge faces left.
- Mirror only the decorative silhouette or its isolated asset wrapper. Never mirror announcement text, controls, dates, icons with directional meaning, artwork, or photographs.
- Keep content DOM order and keyboard order correct in both locales.

### Asset source of truth

- Keep `specification/assets/journal-announcement-sticker.svg` as the canonical editable source unless repository discovery reveals a stronger existing asset convention; document any deliberate path change.
- If a runtime asset copy is necessary, define a deterministic source/copy strategy or use the source directly. Avoid multiple independently editable SVG copies.
- Do not add a generated PNG to the application bundle before owner approval.

## 6. Phase 2 — GitHub Actions SVG-to-PNG review pipeline

GitHub Actions **must** convert the checked-in SVG into a transparent PNG review artifact during this implementation. This requirement applies even if the live application ultimately uses the SVG directly and never ships a PNG.

Reuse and improve the existing:
- `scripts/render-journal-sticker.py`
- `.github/workflows/ci.yml`

Expected baseline unless the visual-design contract is deliberately updated:
- SVG viewBox: `0 0 420 280`.
- Review render: 1260 × 840 pixels (3×).
- PNG: RGBA with a real alpha channel.
- Background outside the paper silhouette: transparent.
- Output path: `artifacts/journal-announcement-sticker.png`.

CI validation must check:
- Source SVG exists and parses.
- Valid explicit viewBox and expected aspect ratio/dimensions.
- No baked SVG text or embedded raster images.
- PNG is generated from the checked-in source in the same workflow run.
- Exact output dimensions and RGBA mode.
- Alpha channel contains transparent canvas pixels and visible/opaque paper pixels.
- Rendered image is not empty.
- Failure of any required validation fails the CI job.

Upload the PNG as a clearly named GitHub Actions artifact with the visual-QA outputs. Inspect the actual artifact at intended display size and at 2×/3× review scale. A successful script exit alone is not visual inspection.

The PNG is a review artifact, not the editable source. Do not commit it or promote it to a production asset until the owner has reviewed and approved the visual treatment. Report the workflow URL, run conclusion, tested commit SHA, artifact name, and artifact availability.

## 7. Phase 3 — Canonical event eligibility and selection

Use existing canonical Journal records. Never create a separate announcement/event registry.

An event is eligible for the sticker only when all applicable conditions hold:
- It is a canonical event or an exhibition entry with structured event dates, as allowed by the actual schema.
- Editorial publication status is Published at the current time.
- Explicit artist approval is true.
- The active locale is included in approved locales and has a non-empty approved title and the required localized content.
- Required event date and timezone semantics are valid and unambiguous under `journal-and-events.md`.
- Its temporal state is Upcoming; ongoing and past events do not qualify.
- It is not archived, withdrawn, expired, or otherwise unavailable.
- It resolves to the canonical localized Journal detail route.

Select the nearest upcoming event by start instant. Define deterministic tie-breaking using stable data fields and cover it with tests. Never rely on filesystem ordering or incidental array order. Missing translation must not silently fall back to unapproved copy. If no candidate qualifies, return `null`.

Keep publication status distinct from temporal status. Do not automatically unpublish an event just because its date has passed.

## 8. Phase 4 — Implement the Journal experience

Implement the existing unified Journal contract, not a generic blog template.

### Homepage preview

- Preserve the existing homepage composition and editorial/post-style presentation.
- Show zero, one, or two entries according to eligible published content.
- Select the two newest eligible entries across article and event types by publication date descending, with deterministic tie-breaking.
- Never add a pinned older upcoming event as an extra item.
- Include the approved localized heading/introduction only when available and a clear localized link to the full archive.
- Omit the section when there are no eligible entries if required by the current homepage contract.
- Keep this section independent from sticker visibility and dismissal.

### Archive

- Preserve the existing canonical localized Journal index route, content taxonomy, filters, and entry presentation.
- Do not create a separate Events page or duplicate route/content model.
- Default ordering remains publication date descending with deterministic tie-breaking.
- Reuse existing filters and URL state. Do not implement a second filtering or pagination system.
- Add/adjust pagination only if the actual archive size and current specification justify it.
- Where page-size selection is required, offer 5, 10, and 20 entries per page, default 5, using the existing shadcn select pattern.
- Preserve active filters and page size in URL state where supported; reset to a valid page after changes.
- Hide pagination when all results fit on one page.
- Keep controls keyboard accessible and correctly localized.

### Event detail

Use the existing canonical Journal detail route and shared editorial shell. Present event-specific information without duplicating the content model:
1. Return-to-Journal breadcrumb/link.
2. Event/exhibition type label.
3. Localized title and optional summary.
4. Publication date.
5. Event information panel.
6. Approved cover/poster, if available.
7. Main editorial content.
8. Related published gallery/artwork links.
9. More-from-Journal links where useful.

Show only confirmed information: event start/end date and time with timezone, reliably derived temporal state, confirmed venue/location, attendance mode, and valid approved registration/official-information URL. Clearly distinguish publication date from event date. Omit unknown metadata and stale registration actions. Past events may remain published in the archive.

Do not add unapproved filters, new routes, or editorial fields merely because they appear in a conceptual example.

## 9. Phase 5 — Implement the announcement component

The sticker is a small, fixed, edge-attached editorial object. It is not a full-width banner, toast, modal, or generic notification.

### Content and structure

- Localized category eyebrow.
- Localized event title.
- Optional confirmed event date/date range, formatted using event timezone and locale conventions.
- Content link to the canonical localized event detail route.
- Separate dismiss button with localized accessible name.
- Optional restrained directional cue if approved by the design.

All text and controls are live DOM content. The decorative SVG must not contain the content.

### Position and responsive safety

- Fixed to the viewport, independent of page scroll and hero geometry.
- English physical-left edge; Persian physical-right edge.
- Mobile: below the actual menu trigger and safe-area inset, with a clear gap.
- Desktop: align with the real sidebar/identity zone without covering wordmark or navigation.
- Tablet/compact layouts: derive placement from the real shell transition, not assumptions.
- Never cover artwork, easel decoration, skip links, focused controls, navigation, or essential content.
- Never create horizontal overflow or cause page reflow when appearing/dismissing.
- If there is no safe position at a breakpoint/short viewport, suppress the sticker rather than overlap important content.
- Use actual measured shell geometry, project tokens, and z-index conventions. Do not guess offsets from SVG dimensions.
- Do not add attention-seeking animation; respect reduced motion.

### Dismissal

- Link and dismiss button are separate semantic controls; do not nest the button inside the anchor.
- Dismissal hides the sticker without navigation, page reflow, or focus theft.
- Default behavior is session-scoped and event-specific unless an existing approved preference contract supersedes it.
- Key dismissal to the event's stable ID/slug. Dismissing event A must not suppress event B.
- An event that becomes ineligible disappears regardless of stored dismissal.
- No analytics, tracking, sound, toast, modal, assertive live region, or repeated reappearance in the same session.

## 10. Phase 6 — Localization, accessibility, SEO, and performance

### Localization

- English uses `lang=en`, `dir=ltr`; Persian uses `lang=fa`, `dir=rtl`.
- Use approved Persian and English strings only; no machine-generated runtime fallback.
- Localize navigation, headings, filters, page-size controls, dates, event labels, links, close controls, metadata, and accessible names.
- Use existing bidi isolation for Latin names, URLs, and numeric values.
- Never mirror paintings, photos, or announcement text.

### Accessibility

Target WCAG 2.2 AA and follow repository-wide accessibility contracts:
- Semantic headings, links, and buttons.
- Independent event link and close button.
- Localized accessible names and visible focus indicators.
- Correct keyboard order and focus behavior after dismissal.
- Adequate touch targets and text contrast.
- Decorative SVG hidden from assistive technology when appropriate.
- No assertive live-region announcement on appearance.
- Reduced-motion and forced-colors support where the project requires it.
- Test keyboard-only behavior, 320px width, short-height screens, and 200% zoom.

### SEO and privacy

- The sticker itself is not an indexable page.
- Canonical Journal detail pages follow existing localized SEO rules.
- Draft, scheduled, archived-unpublished, unapproved, or locale-incomplete records must not appear in public lists, metadata, sitemap, or social previews.
- Do not create structured data from unknown or unsupported facts.
- No tracking, fingerprinting, new personal-data collection, or unnecessary third-party dependencies.
- Use approved content only. Any fixture used for tests must be clearly fictional, non-publishable, and excluded from production metadata/sitemap.

### Performance

- Prefer server components and server-side selection; isolate client behavior to dismissal.
- Reuse existing primitives, tokens, and utilities.
- Avoid unnecessary dependencies and duplicate client bundles.
- Avoid layout shift and reserve no space when no sticker exists.
- Preserve image dimensions and established lazy-loading/prioritization behavior.

## 11. Phase 7 — Automated tests

Inspect the actual test architecture and add tests at the correct existing layers.

### Unit tests

Cover:
- Publication status and artist approval.
- Locale readiness and missing translations.
- Event date/timezone validity and temporal boundaries.
- Upcoming versus ongoing/past classification.
- Nearest upcoming event selection.
- Deterministic tie-breaking.
- Homepage newest-two selection across all entry types.
- Exclusion of older upcoming event from the homepage preview when it is not in newest-two.
- Event-specific dismissal identity and state.
- Optional metadata formatting and omission.

### Component tests

Cover:
- Journal preview with zero, one, and two eligible entries.
- Archive filters/pagination/page-size behavior where implemented.
- Event detail metadata and omission of unknown fields.
- Sticker content and canonical localized link.
- Separate link and close button semantics.
- Dismissal state and no page reflow.
- Long English/Persian titles and missing optional date.
- LTR/RTL decorative direction without mirrored content.
- No sticker when no eligible event exists.

### Integration/E2E tests

Cover:
1. Homepage Journal preview shows at most two newest eligible records.
2. Sticker selects the nearest upcoming event independently.
3. Dismissing sticker does not change the preview.
4. Sticker link opens the correct localized Journal detail.
5. Event A dismissal does not suppress event B.
6. Expired, unpublished, unapproved, archived, and untranslated records are excluded.
7. Journal archive filters and pagination preserve valid URL state.
8. Event detail distinguishes publication date from event date.
9. English LTR and Persian RTL placement is correct.
10. Desktop, tablet, mobile, short-height, 320px width, and 200% zoom do not introduce obstruction or overflow.
11. Keyboard navigation, focus visibility, and dismissal work.
12. Existing homepage, galleries, artwork viewer, sidebar, and locale switching regressions remain clear.

### SVG renderer tests

Validate missing/invalid SVG, missing/invalid viewBox, embedded text/image elements, renderer failure, incorrect dimensions, missing alpha channel, empty output, and transparent-canvas preservation. Assert actual output properties, not only process exit status.

## 12. Phase 8 — CI and visual verification

Inspect `package.json` and workflow definitions; use real project commands rather than guessing. Run applicable lint, formatting, typecheck, unit, component, integration, E2E, accessibility, localization, and production build checks.

Run/inspect GitHub Actions when authorized and available:
- Verify the workflow belongs to the exact final feature HEAD SHA.
- Wait for completion; queued/in-progress is not a pass.
- Inspect every relevant job and logs.
- Confirm SVG renderer/validation passed.
- Confirm the PNG artifact was uploaded and can be retrieved.
- Fix actual failures and rerun.

Capture actual browser screenshots for:
- English and Persian.
- Desktop, tablet, mobile, and short-height viewport.
- Sticker visible and dismissed.
- No eligible event.
- Long event title.
- Journal preview with 0/1/2 entries.
- Archive and event detail.
- Keyboard focus state where practical.

Inspect the screenshots and PNG artifact. Record viewport, locale, state, artifact location, and findings. A screenshot that has not been opened/inspected is not visual verification.

## 13. Phase 9 — Owner review and handoff

Present:
- The CI-generated PNG artifact.
- Sticker close-up and actual display-size screenshots.
- English/Persian desktop/tablet/mobile screenshots.
- Any alternative vector treatment if the current torn-edge/tape design needs comparison.
- Remaining decisions: silhouette/torn-edge subtlety, tape detail, proportions, safe placement, and final localized microcopy.

The owner may request vector-path refinements. Apply requested changes directly to the SVG source and rerun CI; do not edit the PNG manually.

Do not call the visual treatment final or artist-approved until the owner explicitly approves it. Do not commit the generated PNG before approval.

## 14. Definition of done

The task is complete only when:
- All unblocked requirements in the primary specification are implemented.
- Canonical Journal content and event data are reused without duplication.
- Homepage newest-two preview and independent nearest-upcoming sticker rules are both verified.
- SVG artwork has been authored/refined during implementation.
- GitHub Actions renders and validates the transparent PNG review artifact.
- Sticker behavior, dismissal, LTR/RTL, responsive placement, and accessibility are implemented.
- Required tests, lint, typecheck, and production build pass.
- The completed CI run matches the final tested feature SHA and its logs are inspected.
- Actual responsive/localized screenshots and PNG are reviewed.
- Remaining owner approvals and known gaps are clearly reported.
- No merge, deployment, publication, or unauthorized push/commit has occurred.

## 15. Final report format

1. Branch and final HEAD SHA.
2. Requirement-by-requirement implementation status.
3. Files created/modified.
4. SVG authoring changes and canonical source path.
5. Renderer validation and CI-generated PNG artifact link.
6. Test commands and exact pass/fail results.
7. GitHub Actions run URL, conclusion, and tested SHA.
8. Visual QA locales, viewports, states, and artifact references.
9. Owner approvals obtained and still required.
10. Known issues, blockers, and next actions.
11. Explicit confirmation that no merge or deployment occurred.

**Do not stop after a plan or documentation update. Implement the working Journal and sticker experience, author the SVG early, render it through CI, test the complete behavior, inspect the browser output, and report only what the evidence proves.**
