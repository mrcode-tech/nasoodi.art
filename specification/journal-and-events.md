# Nasoodi.art — Journal, Articles, and Events Specification

**Status:** Proposed product, content, and experience contract  
**Working branch:** `feature`  
**Primary navigation label:** Journal  
**Locales:** Persian (`fa`) and English (`en`)

## 1. Purpose and product decision

Provide one unified **Journal** destination for artist-authored editorial posts and structured event announcements. Do not create separate top-level Blog and Events navigation items in the initial release.

The unified section should feel like an artist's editorial journal rather than a generic news portal. It supports:
- Exhibition and gallery announcements.
- Upcoming, ongoing, and past events (openings, talks, workshops, participation, and other artist-approved public appearances).
- Studio updates and works-in-progress stories.
- Articles, reflections, and stories behind selected artworks or collections.

Visitors can browse all entries, filter by content type, open a dedicated detail page, and follow contextual links to the relevant gallery or artwork. The homepage and global sidebar both provide clear paths to Journal.

## 2. Information architecture and routes

Use the repository's established locale and App Router conventions; these route patterns are conceptual and must be reconciled with actual routing before implementation:

- `/[locale]/journal` — Journal landing page and archive.
- `/[locale]/journal/[slug]` — canonical detail route for an article or event.
- Optional query/filter state such as `?type=event` may be used if it preserves shareable, accessible navigation and does not create duplicate indexable pages.

The Journal landing page is the canonical destination for the complete feed. A visitor must be able to reach it from:
1. The persistent desktop left sidebar.
2. The mobile off-canvas sidebar.
3. A clearly visible Journal section on the homepage, with a “View all journal entries” link to the Journal landing page.
4. Contextual links from relevant gallery, artwork, and About pages where approved.

Do not add a separate Events top-level route or navigation item in the initial release. Event filters and event detail content live inside Journal. If event volume later justifies a dedicated index, it may be introduced as a filtered view or route while preserving the unified content model and existing canonical event URLs.

## 3. Global navigation and homepage entry points

### 3.1 Sidebar navigation

Add **Journal** to the shared primary navigation on desktop and in the mobile off-canvas menu. Suggested order:

1. Home
2. Works
3. Galleries
4. Journal
5. About
6. CV / Exhibitions — only when the route and meaningful approved content are available
7. Contact

The Journal item:
- Uses an artist-approved Persian label in the Persian locale; do not assume an unreviewed translation.
- Has a clear active/current-page state for both the Journal index and Journal detail routes.
- Appears in both desktop and mobile navigation from the shared navigation configuration.
- Must not create a duplicate Events item.
- Must not link to an empty or unpublished destination.

### 3.2 Homepage Journal section

Place a restrained **Latest from the Journal** section after Featured Works and Featured Galleries, and before the final contact/footer area unless the approved homepage composition establishes a better fit.

The homepage preview is limited to **at most the two newest eligible published Journal entries across all entry types** (articles and events), ordered by publication date descending with deterministic tie-breaking.

- Do not add a third entry/card.
- Do not independently pin or promote an older upcoming event into this in-flow preview.
- An upcoming event may appear in the preview only when it naturally belongs in the newest-two publication-date ordering.
- Include a clear localized link to the complete Journal archive.
- If only one eligible entry exists, show one. If none exist, omit the section according to the homepage content contract.
- Keep the editorial/post-style presentation; do not turn the section into an event dashboard or artwork carousel.
- The fixed announcement sticker is a separate discovery mechanism. It independently selects the nearest eligible upcoming event and does not change the Journal preview.
- Dismissing the sticker must never hide, reorder, or otherwise alter the in-flow Journal preview.

On mobile, preserve the section's document order, readable text, artwork fidelity, and a visible, reachable archive link. Do not fabricate content to fill a fixed count.

## 4. Journal landing page design

The landing page should establish the editorial identity and make upcoming events easy to discover without splitting the site into separate Blog and Events destinations.

### 4.1 Page hierarchy

1. Page heading: Journal.
2. Optional short artist-approved introduction.
3. Featured upcoming event region, only when an eligible event exists.
4. Filter controls:
   - All
   - Exhibitions
   - Events
   - Studio Updates
   - Stories
5. Chronological entry list/grid.
6. Pagination or “Load more” only if the archive becomes long enough to require it.

Filter taxonomy:
- **Exhibitions:** exhibition announcements, openings, participation, and exhibition-related reports.
- **Events:** workshops, talks, demonstrations, public appearances, and other event notices not better classified as an exhibition.
- **Studio Updates:** process notes, new collection updates, and studio news.
- **Stories:** essays, reflections, inspiration, and artwork/collection context.

A single entry may have one primary type and optional secondary tags. Do not create overlapping or confusing duplicate filter categories.

### 4.2 Entry card anatomy

Each card may display:
- Approved cover image, if supplied.
- Type label.
- Localized title.
- Short excerpt/description.
- Publication date.
- Event date/status when the entry is an event and the information is known.
- Read-more link.

Card requirements:
- Entire-card click behavior is optional; provide a clear link regardless.
- Maintain meaningful reading order and visible keyboard focus.
- Use consistent image aspect-ratio containers only where they do not crop important artwork or event imagery. For artwork, preserve full image composition.
- Do not render empty metadata rows or generic placeholder images.
- Distinguish event dates from publication dates.

### 4.3 Sorting and filtering

- Default order: publication date descending.
- Upcoming event feature: event start date ascending among eligible upcoming events.
- Filters update the visible list and announce result changes accessibly.
- Provide an obvious “All” reset.
- Preserve filter state in a shareable URL if practical; do not make filters keyboard- or screen-reader-hostile.
- Pagination must preserve selected filters and stable ordering.
- Past events remain in the archive unless the artist archives or unpublishes them.

## 5. Journal detail page

Use one shared detail-page shell for articles and events, with type-specific metadata blocks.

Common structure:
1. Breadcrumb/back link to Journal.
2. Type label.
3. Title.
4. Short summary/deck.
5. Publication date.
6. Optional approved cover/hero image with localized alternative text.
7. Main rich-text content.
8. Optional related artworks and galleries.
9. Previous/next or more-from-Journal links, where useful.
10. Return-to-Journal link.

Editorial presentation:
- Comfortable line length and generous paragraph spacing.
- Clear heading hierarchy, lists, quotations, captions, and links.
- Persian content uses correct RTL direction; embedded English names, URLs, dates, and Latin strings use appropriate bidi isolation.
- Do not use an image of text as the only source of event details.
- Do not inject arbitrary HTML from content records. Use a constrained, sanitized rich-text format with an explicit set of supported blocks.

## 6. Event-specific behavior

An Event is a structured Journal entry, not merely an article with a date in its title.

### 6.1 Event information

Required for a public event:
- Localized title.
- Localized short description.
- Main content or sufficient event information.
- Confirmed start date/time or an explicitly defined all-day event date.
- Confirmed time zone or location context sufficient to interpret the time.
- Publication state and artist approval.

Event `startsAt` and `endsAt` values must be unambiguous ISO 8601 instants with an explicit `Z` or numeric UTC offset, alongside the required IANA `timeZone`. Do not store a timezone-less local timestamp: server and visitor environments may interpret it differently.\n\nRecommended when applicable:
- End date/time.
- Venue name.
- Venue address or public location description.
- Online/physical/hybrid attendance mode.
- Registration or official event-information URL.
- Cover image/poster with usage approval.
- Related gallery, exhibition, and artwork references.
- Organizer/partner details only when confirmed and approved.

Never fabricate dates, time zones, venues, registration links, admission details, participating artists, or event status.

### 6.2 Event states

Derive public temporal state from event dates using the event's declared time zone:
- **Upcoming:** current time is before the start.
- **Ongoing:** current time is at/after start and before end; for an event without an end, use a clearly defined duration policy or avoid asserting “ongoing”.
- **Past:** current time is after the end; for a date-only/all-day event, use the event locale/time-zone end-of-day boundary.

Editorial publication state is separate:
- Draft
- Scheduled
- Published
- Archived

A past event can remain Published in the archive. Do not automatically archive or unpublish it solely because its date has passed.

If event time-zone information is unknown, do not silently assume the visitor's local time zone. Display a confirmed venue-local time or a date-only value as supplied.

### 6.3 Event detail presentation

For an event, show a compact event-information panel near the title or immediately after the introductory summary:
- Date and time, with time zone when relevant.
- Venue/location or online mode.
- Registration / official information link when supplied.
- Current temporal state (upcoming, ongoing, past) when reliably computable.

Past events should retain their original date and may link to a related gallery or selected artworks. Never leave a stale registration CTA active after its confirmed deadline; the artist/editor must be able to remove or replace it.

## 7. Content model

Use a discriminated content model with shared editorial fields and type-specific event fields. This is a conceptual contract; adapt to the project's existing data validation and content architecture.

```ts
type LocalizedText = {
  fa?: string;
  en?: string;
};

type JournalType =
  | "exhibition"
  | "event"
  | "studio-update"
  | "story";

type PublicationStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

type JournalEntryBase = {
  id: string;
  slug: string;
  type: JournalType;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedRichText;
  coverImage?: {
    src: string;
    alt: LocalizedText;
    width: number;
    height: number;
    rightsConfirmed: boolean;
  };
  publishedAt?: string;
  scheduledAt?: string;
  status: PublicationStatus;
  relatedArtworkSlugs?: string[];
  relatedGallerySlugs?: string[];
  tags?: string[];
  seo?: {
    title?: LocalizedText;
    description?: LocalizedText;
    socialImage?: string;
  };
  approvedLocales: Array<"fa" | "en">;
  artistApproved: boolean;
};

type ArticleEntry = JournalEntryBase & {
  type: "exhibition" | "studio-update" | "story";
};

type EventEntry = JournalEntryBase & {
  type: "event";
  event: {
    startAt?: string;
    endAt?: string;
    dateOnly?: string;
    timeZone?: string;
    venueName?: LocalizedText;
    locationDescription?: LocalizedText;
    attendance: "in-person" | "online" | "hybrid" | "unspecified";
    registrationUrl?: string;
  };
};

type JournalEntry = ArticleEntry | EventEntry;
```

Model notes:
- `LocalizedRichText` must be a defined, constrained schema; it is not an unrestricted HTML string.
- Date/time values should use a consistent ISO 8601 representation with explicit offset or IANA time-zone handling. Do not store ambiguous local timestamps.
- The example permits optional event fields for drafts; publication validation must enforce the required event details.
- Stable IDs are internal references; slugs are public route identifiers.
- Related artwork/gallery links must resolve to published, approved records.
- Avoid duplicate event and article records for the same exhibition. A single exhibition announcement can be an exhibition-type Journal entry linked to the relevant Gallery and, when needed, a structured Event record or event-type entry. Choose one canonical public entry and link related records rather than copying content.

## 8. Localization and editorial governance

- Persian and English are independently reviewed content values, not machine-generated fallbacks.
- A route should be publicly indexable only in locales with approved, complete content for that entry.
- Locale switching preserves the equivalent Journal entry when an approved translation exists; otherwise follow the site's documented locale fallback.
- Titles, excerpts, rich text, event venue information, date labels, CTA labels, metadata, and alt text must be localized as applicable.
- Format dates using the entry's event time zone for event information and the site's locale formatting conventions for publication dates.
- Preserve proper names and official venue names unless an approved localized form exists.
- Draft, scheduled, and archived-unpublished entries must never leak through public lists, route metadata, sitemap, or social previews.
- Provide an editorial checklist for factual accuracy, image rights, translations, links, dates, and final artist approval.

## 9. Image and media rules

- Use only artist/owner-approved images with a documented usage basis.
- Preserve artwork color, brush texture, signature, orientation, and original aspect ratio.
- Do not apply filters, AI enhancement, generative fill, mirroring, or unapproved crops.
- Event posters may contain text, but all essential details must also be present as accessible page text.
- Provide responsive image variants and explicit dimensions; lazy-load below-the-fold images and prioritize only a genuinely prominent featured event image.
- Do not embed autoplay video or audio. External media embeds require privacy, performance, and accessibility review; provide a direct link fallback.
- If no approved image exists, use a deliberate typographic/text-only presentation rather than stock or generated artwork.

## 10. SEO and sharing

- Journal index has a localized title and description.
- Each published entry has a stable canonical URL and unique, artist-approved localized metadata.
- Include only published, locale-complete entries in sitemap and locale alternates.
- Add Open Graph/social metadata using approved images.
- Use structured data only when the entry meets the relevant factual requirements: Article for editorial stories; Event for actual events with confirmed dates and location/attendance details. Validate output and do not emit invented fields.
- Do not mark an ordinary studio update as an Event merely because it mentions a date.
- Avoid thin duplicate pages from filter combinations; canonicalize filtered archive views to the Journal index unless a separately curated index is explicitly approved.
- Past events may remain indexable as useful historical records if their content remains accurate.

## 11. Accessibility, responsive behavior, and performance

Target WCAG 2.2 AA and the site's shared accessibility contract:
- Semantic main, navigation, article, time, and list structures.
- Correct heading hierarchy and localized document language/direction.
- Keyboard-operable filters and links, visible focus, and accessible result announcements.
- Do not use color alone for event state.
- Provide meaningful alt text for informative images and empty alt for decorative images.
- Respect reduced motion; no auto-rotating journal carousels.
- Ensure date/time information is understandable to assistive technology.
- No horizontal overflow at supported viewport widths or short-height screens.
- Avoid layout shift with image dimensions and stable card geometry.
- Keep the Journal page fast on mobile and avoid unnecessary client-side JavaScript.

## 12. Wireframes

### Homepage section

```text
LATEST FROM THE JOURNAL                         View all journal entries →
[Featured upcoming exhibition/event — only when eligible]
[Event image]  Exhibition title
               Date · Venue (confirmed values only)
               Short summary
               View event →

[Recent entry image]  Studio update title     [Recent entry image] Story title
                      Date · Excerpt                              Date · Excerpt
                      Read more →                                 Read more →
```

If no eligible upcoming event exists, show the latest published entries in a balanced editorial layout. If there are no published entries, omit the section rather than show placeholders.

### Journal index

```text
JOURNAL
Artist-approved introduction

[All] [Exhibitions] [Events] [Studio Updates] [Stories]

[Featured upcoming event — optional]
[Cover] Type · Publication date
Title
Short description
Read more →

[Entry card] [Entry card]
[Entry card] [Entry card]
... chronological archive ...
```

### Journal detail — article

```text
← Journal
STUDIO UPDATE
Article title
Short summary
Published date

[Optional approved cover image]

Rich text article content...

Related works / galleries (optional)
More from the Journal →
```

### Journal detail — event

```text
← Journal
EVENT / EXHIBITION
Event title
Short summary
Published date

[Approved event image/poster]

EVENT DETAILS
Date and time · Time zone
Venue / location / attendance mode
Official information or registration link

Event description and practical information...

Related gallery / artworks (optional)
More from the Journal →
```

Responsive rules:
- Desktop uses a restrained editorial grid with a clear featured-event hierarchy.
- Tablet reduces columns without changing content order.
- Mobile uses a single column; event facts remain near the title and are not hidden in hover-only UI.
- Persian and English preserve semantic order; physical-left sidebar behavior remains as defined by the navigation contract.

## 13. Testing and acceptance criteria

Automated and manual verification must cover:

### Content and publication
- Valid article and event records pass schema validation.
- Invalid slugs, duplicate IDs/slugs, missing required localized content, unapproved assets, and unresolved relations block publication.
- Draft, scheduled, and archived-unpublished entries are absent from public routes, lists, sitemap, metadata, and social previews.
- Published locale output includes only approved translations.
- Missing optional fields are omitted cleanly.

### Navigation and homepage
- Journal appears in desktop sidebar and mobile off-canvas menu.
- Journal detail routes keep Journal active in navigation.
- Homepage section links to the Journal index.
- Each homepage card opens the correct canonical detail route.
- No empty Journal links or placeholder cards are rendered.
- Homepage selection follows upcoming-event and latest-entry rules.

### Archive and detail
- Filters return correct types and All resets the filter.
- Sorting is deterministic and newest-first.
- Pagination/load-more preserves filters and ordering.
- Article and event details render correct type-specific fields.
- Related gallery/artwork links resolve correctly.
- Unknown event time zones never silently become visitor-local times.

### Locale, accessibility, and visual QA
- Persian RTL and English LTR content, metadata, date formatting, and navigation work.
- Keyboard-only filter operation, focus visibility, screen-reader announcements, and reduced motion are verified.
- Event status is not conveyed by color alone.
- Desktop, tablet, mobile, and short-height screenshots are reviewed in both locales.
- Images preserve fidelity and no layout shift/overflow is introduced.

### SEO and release
- Canonicals, hreflang, sitemap, Open Graph, and supported structured data are validated.
- Past event pages remain accurate and do not expose stale registration actions.
- Relevant lint, typecheck, unit, component, integration, E2E, accessibility, and build checks pass.
- Artist/site owner approves all public content, translations, event facts, and imagery.

## 14. Implementation sequencing and dependencies

- **Phase 0 — Content audit:** confirm initial articles/events, event facts, image rights, localized copy, and editorial ownership.
- **Phase 1 — Foundation:** extend validated content types, shared navigation, locale handling, and publication rules.
- **Phase 2 — Homepage:** add Latest from the Journal section and links to the Journal archive.
- **Phase 4 or dedicated content phase — Journal:** implement archive, filters, article/event detail templates, and editorial content workflow. Sequence after the core artwork/gallery routes are stable, while ensuring navigation and homepage entry points are included in the same release.
- **SEO/QA phases:** validate structured data, localized metadata, sitemap, accessibility, performance, and responsive screenshots.

No admin/CMS, authentication, public comments, likes, newsletter subscription, or visitor-generated posts are implied by this specification. A content-authoring mechanism must be chosen based on the repository's actual architecture and owner's workflow; do not add an external CMS or service without approval.

## 15. Open decisions

Before implementation/publication, confirm:
- Artist-approved Persian translation for “Journal” and filter labels.
- Initial post types and first entries to publish.
- Whether events use exact times, date-only dates, and which time-zone policy applies.
- Which event details (venue address, registration, admission) are safe and approved to publish.
- Whether scheduled publishing is required by the current content workflow.
- Whether any event should link to a gallery, artwork, or external official event page.

This is a design/content contract, not evidence of implementation, populated content, artist approval, or publication. Do not invent entries or publish example wireframe text.
## Design-engineering refinement

Journal is an editorial reading experience within the artist's gallery identity. Apply design-engineering-skills.md and design-direction-and-system-refinement.md.

- The Journal index should read like an artist's considered journal or exhibition notes, not a generic blog CMS or news portal.
- Use typography, editorial image scale, whitespace, and chronology to distinguish content types. Do not place every entry in identical bordered cards.
- The featured upcoming event is conditional and should be visually prominent only when it is a real, approved event.
- Detail pages must prioritize readable text measure and a clear title/metadata/content hierarchy. Event facts should be scannable without decorative badges or color-only state.
- Filters should be visually quiet, keyboard-operable, immediate, and free of unnecessary animated transitions.
- Do not animate article text, event posters, or artwork. Avoid auto-rotating featured entries.
- Test long Persian/English titles, no-cover entries, no upcoming events, past events, and long-form content at all supported breakpoints.

## Homepage Journal preview and presentation preservation — 2026-10-31

The existing Journal design remains the approved editorial/post-style experience. The artwork-carousel redesign does not apply to Journal entries, article detail pages, or event detail pages.

- The homepage displays at most the two newest eligible published Journal entries across all entry types (articles and events together), ordered by publication timestamp, newest first.
- When at least two eligible entries exist, show the two latest. If one exists, show one; if none exist, use the existing intentional omission/empty-state rule. Never invent or duplicate entries to fill the preview.
- Preserve the existing editorial preview structure: approved representative image where available, title, publication date, excerpt, and article/event link.
- Add one clear **Explore Journal** link to the complete `/[locale]/journal` archive.
- Do not place Journal entries in an artwork carousel, convert them to artwork cards, add a separate Events top-level route, or redesign the Journal index/detail as an image gallery.
- This homepage limit does not change archive pagination, filtering, event lifecycle, publication states, or canonical Journal routes.

The authoritative cross-surface layout and acceptance rules are in [artwork-discovery-carousel-and-editorial-experience.md](./artwork-discovery-carousel-and-editorial-experience.md).
