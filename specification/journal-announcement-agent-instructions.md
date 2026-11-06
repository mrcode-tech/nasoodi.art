# Coding Agent Instructions — Configurable Content Announcement

**Repository:** `mrcode-tech/nasoodi.art`  
**Branch:** `feature` only  
**Primary prompt:** [journal-announcement-implementation-prompt.md](./journal-announcement-implementation-prompt.md)  
**Technical contract:** [journal-announcement-specification.md](./journal-announcement-specification.md)

## Objective

Implement the general-purpose announcement sticker controlled by one JSON configuration. Read the complete implementation prompt and technical contract before changing code.

## Mandatory preflight

1. Read repository agent instructions and `specification/README.md`.
2. Confirm the existing branch is `feature`; do not create or switch branches.
3. Inspect current code, routes, content models, repositories, locale messages, tests, and CI.
4. Preserve unrelated work and editorial content.
5. Reconcile specifications with the actual repository before implementation.

## Implementation rules

- One JSON file: `src/content/announcement.json`.
- One `active` boolean; no announcement array, repository, or automatic selection.
- Supported types: artwork, gallery, journal, event.
- Resolve active references using existing content access functions.
- Do not resolve content while inactive.
- Derive localized href from type and the referenced record's localized slug.
- Do not store destination URLs in JSON.
- Configure the initial sticker to the newest published gallery found in the current data.
- Pass only resolved display data to the component.
- Preserve existing paper SVG, viewport/sidebar/mobile-drawer placements, session dismissal, RTL/LTR behavior, and accessibility.
- Keep event repository and Journal event behavior where used elsewhere; remove only the sticker's dependency on upcoming-event selection.
- Update translations to generic announcement wording.
- Update specifications and remove contradictory exhibition-only requirements.

## Testing rules

- Validate configuration structure regardless of activation.
- Validate active content references and localized destinations.
- Always test both active and inactive states with synthetic fixtures.
- Playwright reads the actual branch JSON. Run active-only UI tests only when active is true; when false, skip only those tests with an explicit reason.
- Inactive visibility, schema validation, synthetic tests, and unrelated site tests always run.
- Report skipped tests as skipped.
- Do not hardcode production titles, IDs, counts, or event assumptions in UI tests.
- Do not skip, weaken, or delete meaningful tests to make CI pass.

## Delivery

Run available lint, typecheck, unit, build, and Playwright checks. Inspect the latest GitHub Actions workflow and failed logs. Fix root causes. Commit only to `feature`; do not merge, deploy, or modify unrelated editorial content. Report exact commit and workflow evidence. Never claim CI passed unless the latest complete run is successful.
