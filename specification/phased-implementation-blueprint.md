# Phased Implementation Blueprint

This document defines a technical delivery sequence. It does not record editorial inventory, artist identity, production content, or historical visual-QA artifacts.

## Phase 1 — Repository and engineering baseline

- Inspect repository structure, branch state, package scripts, CI, and deployment boundaries.
- Confirm the supported Next.js, React, TypeScript, Tailwind, shadcn/ui, and next-intl architecture.
- Establish deterministic dependency installation, lint, typecheck, unit test, and build checks.
- Keep changes scoped to the authorized branch.

## Phase 2 — Content and domain architecture

- Define typed domain contracts for profile, artwork, collection, Journal, CV, contact, and site metadata.
- Keep canonical content under the content data layer.
- Separate interface translations from editorial fields.
- Implement repository methods for locale resolution, publication eligibility, relationships, and ordering.
- Validate unique IDs, references, asset paths, and optional fields.
- Keep stable IDs independent of localized slugs.

## Phase 3 — Routing and localization

- Implement locale-prefixed routes.
- Enforce LTR for English and RTL for Persian.
- Normalize Unicode and encoded localized slugs safely.
- Ensure unknown and unpublished records return a real 404.
- Preserve equivalent content identity during locale switching.

## Phase 4 — Shared design system and shell

- Implement shared semantic theme tokens.
- Reuse shadcn/ui primitives where appropriate.
- Implement desktop sidebar and mobile navigation.
- Implement locale and theme controls.
- Establish responsive typography, spacing, focus, and reduced-motion behavior.

## Phase 5 — Page and component experiences

- Implement homepage hero and primary navigation actions.
- Implement artwork archive, viewer, and detail routes.
- Implement collection archive, detail routes, and cover relationships.
- Implement Journal archive, detail routes, and event entry support.
- Implement About, CV, and contact routes.
- Implement optional announcement callout and homepage previews.
- Ensure all sections support empty and variable-sized datasets.

## Phase 6 — Quality and verification

- Add unit tests with generated datasets for pagination, sorting, slug normalization, and repository behavior.
- Add integration tests using synthetic localized records.
- Add browser tests for routing, navigation, viewer behavior, accessibility, responsive layouts, themes, and SEO.
- Keep production-backed browser tests structural and content-independent.
- Validate the content model separately from application behavior.
- Audit technical specifications and tests for production editorial coupling.

## Phase 7 — CI and release readiness

- Run dependency installation, lint, message audit, content-independence audit, typecheck, unit tests, content validation, build, browser tests, and route smoke tests.
- Inspect complete workflow logs and artifacts for failures.
- Fix genuine application defects; replace brittle assertions with stronger data-driven tests.
- Record exact commit and workflow evidence.
- Do not merge or deploy unless explicitly authorized.

## Completion criteria

A phase is complete when its technical acceptance criteria pass and the implementation remains compatible with the shared architecture, localization, accessibility, design-system, and content-independence contracts. Editorial changes must not require unrelated technical specification or test changes.
