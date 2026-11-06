# Content Announcement Sticker — Technical Specification

**Status:** Approved implementation contract  
**Locales:** English (`en`) and Persian (`fa`)  
**Primary implementation prompt:** [General-Purpose JSON-Configured Content Announcement](./journal-announcement-implementation-prompt.md)  
**Visual asset:** `public/images/journal/journal-announcement-sticker.svg`

## 1. Purpose

The announcement sticker is a small, dismissible editorial discovery element attached to the edge of the artist portfolio. It can feature one configured artwork, gallery, Journal post, or event. It is not an exhibition-only feature and does not automatically select upcoming events.

There is at most one configured announcement. If it is inactive, the sticker is absent and reserves no layout space.

## 2. Single source of truth

The only editorial configuration is `src/content/announcement.json`:

- `active`: required boolean visibility switch.
- `type`: required supported content type (`artwork`, `gallery`, `journal`, `event`).
- `contentId`: required stable ID of the referenced record.
- `title`: required non-empty English and Persian strings.
- `description`: required non-empty English and Persian strings.
- `metadata`: optional localized supporting text.

No array or collection is used. Do not add an announcement repository, separate destination URL, automatic selection rule, or second active flag.

## 3. Visibility and validation

The configuration schema is validated in every build/test state. When inactive, do not resolve the referenced record and do not render the sticker. When active, resolve the record and validate that it is public, published, available in the active locale, and has a safe localized slug. An invalid active reference must fail the content validation/build path and must not create a broken public link.

No automatic fallback is permitted. New content publication never changes the selected announcement unless the JSON is edited. Dismissal is visitor state only and never mutates the configuration.

## 4. Content resolution and localized route

Reuse existing content access functions:
- Artwork: published artwork by stable ID.
- Gallery: published gallery by stable ID, including its existing publication/member checks.
- Journal: public Journal entry by stable ID.
- Event: public event/exhibition Journal entry by stable ID.

Derive the destination from the content type and the record's localized slug:
- artwork → localized `works` detail route.
- gallery → localized `galleries` detail route.
- journal → localized `journal` detail route.
- event → canonical localized Journal detail route.

Use existing route/slug utilities and URL encoding. English is LTR; Persian is RTL. The UI component receives only resolved title, description, optional metadata, href, and locale. It does not read JSON or resolve records.

## 5. Component behavior

The generic content announcement:
- Shows optional metadata, title, and description from the configuration.
- Uses a semantic link for the main content area.
- Navigates to the resolved localized destination.
- Has an independent accessible close button, outside the link.
- Dismisses without navigation or focus theft.
- Retains session-scoped dismissal behavior and synchronizes duplicate placement surfaces where appropriate.
- Scopes dismissal to the configured destination/content so a newly selected item is not unintentionally dismissed.
- Supports keyboard operation, visible focus, accessible labels, long copy, and reduced motion.

## 6. Placement and visual design

Preserve the existing decorative paper SVG and established placement model:
1. Homepage desktop viewport-edge placement.
2. Desktop sidebar placement on non-homepage routes.
3. Mobile navigation drawer placement after navigation and before settings.

English attaches to the physical left edge; Persian attaches to the physical right edge. Mirror only the decorative SVG. Do not mirror text or controls. Use logical CSS properties, preserve the current responsive breakpoint model, and avoid covering navigation, artwork, skip links, or focused controls.

The SVG is decorative only. All content and controls remain HTML. Preserve the quiet, minimal, gallery-paper identity; do not introduce marketing-banner styling. The inactive or dismissed component must reserve no layout space.

## 7. Test contract

### Always-running tests
- JSON/schema validation for active and inactive configurations.
- Required localized title/description and optional metadata validation.
- Synthetic destination mapping tests for all four types.
- Synthetic component tests for active/inactive rendering, content, navigation, dismissal, accessibility, RTL/LTR, responsive placements, long text, and themes.
- Content-integrity checks that apply to the configured state.

### Branch-aware Playwright tests
Playwright reads the actual JSON in the current branch checkout.

When active, run UI tests for configured copy, visibility, destination, navigation, dismissal, all placements, localization, and accessibility. Derive expected values from JSON and the referenced published record.

When inactive, skip only tests requiring a visible active sticker, with a clear reason. Still run inactive visibility, schema validation, synthetic activation-state tests, and all unrelated tests. Skips must be reported as skipped, not passed.

Always validate JSON structure. Resolve and validate the content reference only when active. Never use production editorial strings, IDs, counts, or the existence of an upcoming event as brittle test assumptions.

## 8. Non-goals

This component does not select the nearest upcoming event, manage multiple announcements, own Journal publication logic, create an event registry, or replace the Journal archive. Journal events and their routes remain part of the canonical Journal system.

## 9. Acceptance criteria

- One JSON file and one active flag control the sticker.
- Four content types are supported without a new repository.
- Destinations are derived from type and localized content ID.
- The initial configuration explicitly features the newest published gallery.
- Active references are validated; inactive configuration hides the sticker.
- Existing design, placements, dismissal, and accessibility are preserved.
- Playwright behavior is conditional on the actual branch JSON.
- Both activation states have always-running synthetic tests.
- CI validates configuration regardless of activation state.
