# End-to-End Testing Strategy

## Purpose

Browser tests verify stable user-visible behavior and technical contracts. They must not encode the current editorial content of the portfolio.

## Allowed assertions

- Route status, locale, direction, canonical URLs, and alternate-language relationships.
- Navigation, focus management, keyboard interaction, and browser-history behavior.
- Whether an archive item opens a valid detail route.
- Pagination state, URL synchronization, supported page-size values, and item-slice changes.
- Artwork viewer open/close/next/previous behavior.
- Announcement visibility, localization, destination, and dismissal, with expected values derived from the active JSON configuration.
- Responsive interaction behavior where it affects usability.

## Assertions to avoid

- Literal artwork, gallery, journal, exhibition, artist-statement, or biography titles and descriptions.
- Fixed editorial record counts, fixed slug values, specific artwork IDs, and assumptions about which record is first.
- Hardcoded content ordering unless the behavior under test is explicitly the ordering algorithm; in that case, compare machine-readable dates or synthetic fixtures rather than names.
- Screenshot snapshots, CSS-token equality, exact font sizes, exact line counts, decorative border values, and other presentation-only checks in functional E2E tests.
- Selectors that assume nested markup which is not part of the semantic contract (for example, assuming every card link contains a nested anchor).

## Test-data strategy

1. Use synthetic fixtures in unit tests for deterministic algorithms such as pagination, sorting, filtering, and URL normalization.
2. In E2E tests, discover a currently published record through the archive's semantic link and use that link as the test target. Never assert its title or slug.
3. If a behavior requires multiple records, check the minimum precondition and skip only that integration scenario with a clear reason when the current content cannot exercise it. Unit tests must still cover the behavior with synthetic data.
4. Keep content-integrity validation separate from browser interaction tests.
5. Configuration-driven features may compare rendered output with their actual configuration file; they must not duplicate editorial values in test code.

## Locator strategy

Prefer accessible roles, labels, and links. Use stable component hooks only when no suitable semantic locator exists. Add a dedicated data-testid only when the UI has no meaningful accessible contract; do not use generated text or editorial copy as a selector.

## Maintainability

- Keep shared archive selectors and pagination workflows in tests/e2e/helpers/.
- Name tests after the behavior they verify, not the page's current content.
- Keep one test focused on one behavior.
- Avoid repeating route parsing, query-string assertions, and archive-card discovery.
- Do not delete a meaningful functional assertion merely to make CI pass. When a test exposes a real product defect, fix the product behavior rather than weakening the test.
