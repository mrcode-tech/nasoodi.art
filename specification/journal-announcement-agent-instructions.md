# Coding Agent Task — Journal Events and Homepage Announcement

**Task type:** Implementation of the owner-approved direction; final sticker visual selection remains a review gate  
**Repository:** mrcode-tech/nasoodi.art  
**Working branch:** feature  
**Primary specification:** journal-announcement-specification.md  
**Visual asset:** hand-authored SVG source with a GitHub Actions-generated PNG review artifact; governed by journal-announcement-sticker-visual-design.md

## Objective

Implement the approved Journal event experience described by the proposal, wireframes, and detailed specification. The feature includes the fixed homepage event announcement, the in-flow homepage Journal preview, event-specific Journal detail presentation, and archive pagination where justified.

## Mandatory preflight

1. Read AGENTS.md, root agent.md, and specification/README.md.
2. Read specification/journal-announcement-sticker-visual-design.md before touching the sticker asset or announcement styling.
3. Read every mandatory design and technical authority listed in journal-announcement-specification.md.
4. Inspect current branch, worktree, latest commit, existing changes, and CI configuration.
5. Confirm the active branch is feature. Do not create, switch, reset, delete, or rename branches.
6. Inspect the actual Journal schema, routes, data, validators, locale strings, shell, breakpoints, design tokens, and test utilities.
7. Reconcile specification assumptions with implementation. If a conflict changes behavior or scope, stop and report it rather than silently inventing a solution.

## Implementation requirements

- Treat the Journal as the sole canonical content system for events and articles.
- Do not add a top-level Events navigation destination or duplicate content model.
- Render the announcement only for one eligible, published, artist-approved, locale-ready upcoming event.
- Anchor the announcement to physical left in English and physical right in Persian.
- Keep it fixed during scroll and independent of hero/layout geometry.
- Keep the menu trigger, sidebar, artwork, focus, and essential content unobstructed.
- Implement the functional announcement structure using the hand-authored torn-edge SVG study as a provisional decorative shape. Do not declare the visual treatment final until the owner reviews the CI-generated PNG and responsive screenshots.
- Keep event link and dismissal as separate controls.
- Use event-specific session dismissal unless an existing approved project preference contract supersedes it.
- Preserve the independent homepage Journal preview, limited to the two newest eligible published entries across all Journal types, and canonical Journal detail routes.
- Show confirmed event metadata only; never fabricate title, date, timezone, venue, participants, or registration details.
- Use approved translations only.
- Treat specification/assets/journal-announcement-sticker.svg as the editable source of truth. Do not use image generation, screenshot tracing, raster painting, or image processing.\n- Use the existing CI workflow to render the SVG into a transparent 1260 × 840 PNG review artifact and verify alpha transparency and dimensions.\n- Do not commit a generated PNG or copy it into the application bundle before owner review. If SVG/CSS is sufficient for production, retain the vector and omit the raster runtime asset.
- Reuse project components, semantic tokens, shadcn-style controls, and existing utilities.
- Avoid unnecessary dependencies, tracking, or new personal-data collection.
- Follow the repository's SEO, accessibility, privacy, performance, and content-governance contracts.

## Testing and verification

Add or update tests for:
- Eligible event selection and nearest upcoming event.
- Publication approval, locale completeness, timezone boundaries, expired/past events, and deterministic tie-breaking.
- Dismissal and event-specific persistence.
- Link and close-control semantics.
- Empty, missing-translation, long-title, and missing-metadata states.
- English LTR and Persian RTL placement.
- Desktop, tablet, mobile, short-height, 320px, and 200% zoom behavior.
- Homepage integration, event detail metadata, and archive pagination/filter preservation.
- Keyboard, screen-reader semantics, reduced motion, and focus visibility.

Run repository-prescribed lint, formatting, typecheck, unit, component, integration, E2E, build, and CI workflows as applicable. Do not invent command names. Capture desktop/tablet/mobile and both-locale screenshots. Inspect CI logs and fix failures before reporting.

## Git and release boundaries

- Work only on the existing feature branch.
- Preserve unrelated work and existing user changes.
- Do not merge into stage or main.
- Do not deploy.
- Do not push unless separately authorized.
- Do not commit until implementation and verification are complete and the owner has approved the commit.
- Report exact changed files, test commands/results, CI run links, screenshots, remaining risks, and any decision required from the owner.

## Completion definition

The task is complete only when the approved behavior is implemented, the SVG source and CI PNG conversion are verified, required tests pass, CI is inspected, responsive/locale screenshots are reviewed, and unresolved visual decisions are clearly reported. Owner review is still required before the sticker is called final. A code change or successful build alone is not completion.
