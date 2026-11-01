# Coding Agent Task — Journal Events and Homepage Announcement

**Task type:** Specification-led implementation, after explicit owner approval  
**Repository:** mrcode-tech/nasoodi.art  
**Working branch:** feature  
**Primary specification:** journal-announcement-specification.md

## Objective

Implement the approved Journal event experience described by the proposal, wireframes, and detailed specification. The feature includes the fixed homepage event announcement, the in-flow homepage Journal preview, event-specific Journal detail presentation, and archive pagination where justified.

## Mandatory preflight

1. Read AGENTS.md and specification/README.md.
2. Read every mandatory design and technical authority listed in journal-announcement-specification.md.
3. Inspect current branch, worktree, latest commit, existing changes, and CI configuration.
4. Confirm the active branch is feature. Do not create, switch, reset, delete, or rename branches.
5. Inspect the actual Journal schema, routes, data, validators, locale strings, shell, breakpoints, design tokens, and test utilities.
6. Reconcile specification assumptions with implementation. If a conflict changes behavior or scope, stop and report it rather than silently inventing a solution.

## Implementation requirements

- Treat the Journal as the sole canonical content system for events and articles.
- Do not add a top-level Events navigation destination or duplicate content model.
- Render the announcement only for one eligible, published, artist-approved, locale-ready upcoming event.
- Anchor the announcement to physical left in English and physical right in Persian.
- Keep it fixed during scroll and independent of hero/layout geometry.
- Keep the menu trigger, sidebar, artwork, focus, and essential content unobstructed.
- Implement clean-paper baseline and provide a restrained torn-edge variant for screenshot review.
- Keep event link and dismissal as separate controls.
- Use event-specific session dismissal unless an existing approved project preference contract supersedes it.
- Preserve the independent homepage Journal preview and canonical Journal detail routes.
- Show confirmed event metadata only; never fabricate title, date, timezone, venue, participants, or registration details.
- Use approved translations only.
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

The task is complete only when the approved behavior is implemented, required tests pass, CI is verified, screenshots are reviewed, and unresolved issues are clearly reported. A code change or successful build alone is not completion.
