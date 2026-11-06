# Implementation Prompt — General-Purpose JSON-Configured Content Announcement

**Repository:** `mrcode-tech/nasoodi.art`  
**Target branch:** `feature` only  
**Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, next-intl, Playwright  
**Priority:** High

**Approved architecture:** One JSON configuration, at most one active announcement, configuration-aware tests, and automatically resolved localized destinations.

This document is the complete implementation contract for the announcement sticker. It supersedes the former exhibition-only announcement implementation instructions. The Journal and event content model remains unchanged; this sticker is now a general content-discovery affordance.

## 1. Objective

Refactor the exhibition-specific sticker into a reusable content announcement that can feature exactly one configured item of one of these types:

- `artwork`
- `gallery`
- `journal`
- `event`

There is no announcement list, collection, announcement repository, automatic selection, or fallback selection. A single JSON file controls visibility and content.

The site owner can show or hide the sticker with `active`, select content with `type` and `contentId`, and edit localized title and description without changing React code.

**Destination URLs must be derived from the content type and the referenced record's localized slug. Never store a separately maintained URL in the JSON.**

## 2. Single configuration

Create `src/content/announcement.json` (or use the existing canonical content directory if repository conventions require another path).

The configuration shape is:

```json
{
  "active": true,
  "type": "gallery",
  "contentId": "CONTENT_ID",
  "title": {
    "en": "CONTENT_TITLE",
    "fa": "عنوان محتوا"
  },
  "description": {
    "en": "A short description of the featured content.",
    "fa": "توضیح کوتاهی درباره محتوای منتخب."
  },
  "metadata": {
    "en": "Featured content",
    "fa": "محتوای منتخب"
  }
}
```

Required fields:
- `active`: boolean.
- `type`: `artwork | gallery | journal | event`.
- `contentId`: non-empty stable content ID.
- `title.en` and `title.fa`: non-empty localized strings.
- `description.en` and `description.fa`: non-empty localized strings.

Optional:
- `metadata`: localized short supporting text, such as a category, year, or exhibition date. It is not required for every type.

Do not add event-specific date fields to this general model. Metadata is plain optional display copy, not a substitute for structured event data.

## 3. Visibility and validation

`active` is the only visibility switch:
- `true`: validate the reference, resolve the public content, derive the localized destination, and render the sticker.
- `false`: do not render the sticker and do not resolve the content reference.
- Missing configuration may be treated as inactive only if this is compatible with existing content-loading conventions.
- Invalid JSON or invalid field types must fail configuration validation and CI.

Always validate configuration structure, even when inactive. When active, additionally validate that the referenced item exists, is published, locale-ready, and has a safe localized slug. An active invalid reference must produce a clear error and must never render a broken link.

Do not automatically select a different item if the configured item is missing, unpublished, or unavailable. Do not automatically activate the sticker when new content is published. Dismissal must never modify the JSON file or `active`.

## 4. Content resolution and destinations

Reuse the existing artwork, gallery, Journal, and event content access functions. Do not create an announcement repository.

Resolve by `type` and `contentId`:
- artwork → `/[locale]/works/[localized-slug]`
- gallery → `/[locale]/galleries/[localized-slug]`
- journal → `/[locale]/journal/[localized-slug]`
- event → the canonical localized Journal detail route for the event/exhibition record.

For `event`, only accept an existing public Journal event/exhibition record. Reuse the current event repository or canonical Journal filtering. Do not create a parallel event registry.

Use the existing localized slug and route utilities, including URL encoding and Persian route normalization. English is LTR and Persian is RTL. Never manually duplicate route construction in the component.

The layout/server boundary should read the JSON, validate it, skip resolution when inactive, resolve active content, and pass a small localized view model to the component. The component must not import JSON or access content repositories.

## 5. Initial configuration

Set the initial configuration to active and reference the newest published gallery according to the repository's actual artwork-year/gallery ordering. Use that gallery's stable ID and suitable localized title and short description.

This selection is explicit configuration, not runtime auto-selection. Publishing a newer gallery must not change the sticker until the owner edits the JSON.

Do not hardcode the selected gallery ID, title, or description in React or UI tests.

## 6. Component contract

Refactor the exhibition-only component into a generic content announcement component, following existing naming conventions. It receives only resolved presentation data:

```ts
interface ContentAnnouncementProps {
  title: string;
  description: string;
  metadata?: string;
  href: string;
  locale: Locale;
}
```

Include the localized dismiss label and existing placement/navigation callbacks as needed.

Responsibilities:
- Render metadata only when supplied.
- Render title and description.
- Link the main content area to the resolved `href`.
- Provide a separate close button.
- Dismiss without navigation.
- Preserve the existing session-scoped dismissal behavior and event synchronization where functional.
- Scope dismissal to the configured destination/content so changing the featured item does not inherit an unrelated dismissal.
- Support keyboard operation, visible focus, accessible names, and long localized text without clipping or overlap.

Do not create per-type components or put content-selection logic in the UI component.

## 7. Visual design and placement

Preserve the existing quiet paper-sticker identity and the canonical hand-authored SVG at `public/images/journal/journal-announcement-sticker.svg`. The SVG is decorative only; all text and controls remain HTML. Do not create a PNG derivative or image conversion pipeline.

The sticker should remain minimal, editorial, paper-like, and visually secondary to the artwork. Avoid advertising banners, sale aesthetics, loud colors, large cards, excessive shadows, and unnecessary decoration.

Content hierarchy:
1. Optional metadata/category label.
2. Title.
3. Short description.
4. Separate close button.

Preserve the existing three placements:
- Homepage desktop: viewport-edge placement.
- Other desktop routes: compact placement in the desktop sidebar.
- Mobile: placement in the mobile navigation drawer, after navigation and before settings.

Keep the existing breakpoint and placement behavior unless a verified defect requires a minimal correction. Respect safe areas and avoid covering navigation, artwork, skip links, or focused controls. Do not reserve layout space when inactive or dismissed.

Use logical CSS properties and preserve physical attachment direction: English attaches on the left; Persian attaches on the right. Mirror only the decorative SVG, never text or controls. Verify light/dark themes, RTL/LTR, and responsive behavior.

The main content is a semantic link. The close button must be separate and must not trigger navigation. Preserve the existing 44×44px minimum dismissal target and reduced-motion behavior.

## 8. Technical specifications

Update the existing announcement specification, implementation prompt, agent instructions, visual design contract, and README document map. Remove contradictory exhibition-only assumptions, including:
- Upcoming-event lookup controlling sticker visibility.
- Requirement for an upcoming event before showing the sticker.
- Automatic nearest-event selection for this sticker.
- Multiple announcements or announcement collections.
- An announcement repository.
- A destination URL stored separately in JSON.

Keep Journal's event model, archive, event eligibility, and event-detail functionality intact. This change only generalizes the sticker.

Specifications must describe technical behavior, not current production titles, descriptions, artwork names, gallery IDs, Journal copy, personal biography, or current editorial counts.

## 9. Tests and CI

### Configuration tests — always run
Validate active and inactive configurations, required fields, booleans, supported types, non-empty content IDs, both required locales, and optional metadata structure.

### Content-resolution tests
Use synthetic fixtures to cover artwork, gallery, journal, and event destinations. Verify missing and unpublished records fail safely, event destinations resolve to Journal, and localized slugs are encoded correctly.

### Component tests — always run
Use synthetic active and inactive props to verify rendering and hiding, title/description/metadata, links, dismissal without navigation, keyboard/focus behavior, RTL/LTR, long text, responsive placements, and themes. Cover both activation states independently of production JSON.

### Configuration-aware Playwright tests — mandatory
Read and validate the actual `src/content/announcement.json` checked out in the current CI branch. Do not hardcode its activation state or use a separate test configuration to decide whether production UI tests run.

When `active: true`, run UI tests for visibility, configured localized copy, optional metadata, derived destination, navigation, dismissal, desktop/sidebar/mobile placement, and accessibility. Expected content and destination must be derived from the JSON and corresponding published record.

When `active: false`, skip only UI tests that require an active sticker, using a clear reason such as:

```ts
test.skip(
  !announcementConfig.active,
  "Announcement is inactive in the current branch configuration."
);
```

Still run inactive-visibility checks, configuration/schema validation, inactive-state unit/component tests, content-integrity checks that apply, and all unrelated site tests. Report conditional skips as skipped, not passed. Do not skip the entire announcement suite.

Configuration structure is validated regardless of activation. Content reference and destination validation is required when active; an inactive reference does not need to resolve for rendering.

Tests must not depend on production titles, gallery counts, journal counts, current content IDs, or the existence of an upcoming exhibition. Do not weaken or delete meaningful tests to get green CI.

## 10. Migration and cleanup

- Remove the old event-only component and obsolete event/date props.
- Remove `getUpcomingJournalEvent()` from the sticker configuration flow.
- Retain event repository and upcoming-event utilities where used elsewhere.
- Reuse existing content access functions.
- Remove obsolete translations or change their copy to generic announcement language.
- Remove unused imports and obsolete tests.
- Do not change unrelated Journal, artwork, gallery, About, or navigation behavior.

## 11. Implementation sequence

1. Inspect the current branch, component, layout, repositories, routes, messages, tests, and CI.
2. Confirm the target is the existing `feature` branch.
3. Determine the newest published gallery from current content data.
4. Add and validate the single JSON configuration.
5. Resolve active content using existing access functions.
6. Derive localized destinations from type and localized slug.
7. Refactor the sticker component and integrate it into the existing shell placements.
8. Preserve the paper SVG, dismissal, localization, and accessibility.
9. Update specifications and translations.
10. Refactor unit and Playwright tests, including branch-aware activation.
11. Run available lint, typecheck, unit tests, build, and Playwright checks.
12. Inspect every failed CI job and its logs; fix root causes.
13. Commit only to `feature`, after verification.
14. Inspect the latest complete GitHub Actions workflow. Do not claim success until it is completed successfully.

## 12. Acceptance criteria

- One JSON file is the only announcement configuration.
- No announcement repository or collection exists.
- `active: true` shows the configured content; `false` hides it.
- Artwork, gallery, journal, and event are supported.
- The initial active configuration references the newest published gallery.
- Destination is derived from type and content ID; no URL is stored in JSON.
- Active references must resolve to published, locale-ready content.
- Localized title and description render correctly; metadata is optional.
- Main sticker click navigates; close dismisses without navigation.
- Existing visual identity, placements, and dismissal behavior are preserved.
- English LTR, Persian RTL, mobile, desktop, and both themes work.
- Specs and tests describe the general-purpose model.
- Playwright reads the actual branch JSON and conditionally skips only active-only UI tests.
- Configuration and synthetic activation-state tests always run.
- No unrelated editorial content or functionality is changed.
- All changes remain on `feature`.
- Latest complete CI passes.

## 13. Strict constraints

Work on `feature` only. Do not merge to `stage` or `main`, deploy, alter unrelated editorial content, invent production events, create a repository/collection, store duplicate URLs, hardcode production content in tests, weaken tests, or report unverified CI success.

**Final deliverable:** A minimal JSON-configured content announcement, initially featuring the latest published gallery, with automatically resolved localized navigation, configuration-aware tests, updated specifications, and a verified passing CI workflow.
