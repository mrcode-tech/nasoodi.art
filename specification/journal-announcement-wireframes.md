# Journal Event Announcement — Responsive Wireframes

**Status:** Structural wireframes for review  
**Related:** journal-announcement-proposal.md and journal-announcement-specification.md

These are structural, not pixel-perfect wireframes. Implementers must inspect the real shared shell, breakpoints, spacing tokens, and z-index layers before choosing dimensions.

## 1. Desktop — English (LTR)

The existing English sidebar is physically left. The notice is attached to the left viewport edge and extends inward. Its position must not obscure the artist wordmark or navigation links.

~~~text
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                         TOP UTILITIES                                │
│ ┌──────────────────────┐                                                     │
│ │ ARTIST WORDMARK      │                                                     │
│ │                      │                                                     │
│ │ ┌────────────────────┼───────┐                                             │
│ │ │ UPCOMING           │  ×    │  ← compact fixed paper tab                  │
│ │ │ EXHIBITION         │       │    left edge flush; right edge free         │
│ │ │ Event title        │       │                                             │
│ │ │ Confirmed date     │       │                                             │
│ │ └────────────────────┘       │                                             │
│ │                      │       │                                             │
│ │ Home                 │       │               HOMEPAGE                      │
│ │ Works                │       │                                             │
│ │ Galleries            │       │               [Featured artwork]            │
│ │ Journal              │       │                                             │
│ │ About                │       │                                             │
│ └──────────────────────┘       │                                             │
└─────────────────────────────────────────────────────────────────────────────┘
~~~

## 2. Desktop — Persian (RTL)

The Persian sidebar is physically right. Anchor the notice to the right viewport edge, extending inward to the left. Do not mirror paintings or photographic assets.

~~~text
┌─────────────────────────────────────────────────────────────────────────────┐
│               HOMEPAGE CONTENT                                  SIDEBAR     │
│                                                        ┌───────────────────┐│
│                                                        │ نام هنرمند        ││
│                                                        │                   ││
│                                      ┌───────┬─────────┤                   ││
│                                      │   ×   │ نمایشگاه پیش‌رو             ││
│                                      │       │ عنوان رویداد                 ││
│                                      │       │ تاریخ تأییدشده               ││
│                                      └───────┘                              ││
│                                                        │ خانه              ││
│                                                        │ آثار              ││
│                                                        │ گالری‌ها          ││
│                                                        │ ژورنال            ││
│                                                        └───────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
~~~

The physical right edge is anchored; the inward left edge is free. Confirm the internal reading order and close-control placement in the rendered Persian version.

## 3. Mobile — English (LTR)

The menu trigger stays unobstructed. The notice sits below it with a clear gap and remains fixed independently of the hero layout.

~~~text
┌──────────────────────────────────┐
│ NASOODI                    [MENU]│
│                                  │
│ ┌───────────────────────────┐    │
│ │ UPCOMING EXHIBITION    ×  │    │
│ │ Event title              │    │
│ │ Confirmed date           │    │
│ └───────────────────────────┘    │
│                                  │
│          [Hero artwork]          │
│                                  │
│ Artist introduction              │
└──────────────────────────────────┘
~~~

The notice must not push the hero artwork down or alter its position.

## 4. Mobile — Persian (RTL)

~~~text
┌──────────────────────────────────┐
│ [منو]                     نسودی  │
│                                  │
│    ┌───────────────────────────┐ │
│    │ نمایشگاه پیش‌رو       ×  │ │
│    │ عنوان رویداد             │ │
│    │ تاریخ تأییدشده           │ │
│    └───────────────────────────┘ │
│                                  │
│          [تصویر اثر]             │
│                                  │
│ معرفی هنرمند                     │
└──────────────────────────────────┘
~~~

The notice anchors to the physical right edge. Text direction is RTL. The artwork itself is not mirrored.

## 5. Homepage Journal section

The page-bottom Journal section is part of normal document flow, not fixed positioning. The current artwork-discovery contract limits this preview to the two newest eligible published entries across article and event types. An upcoming event appears here only when it is among those two entries; the fixed sticker is the separate upcoming-event discovery affordance.

~~~text
┌──────────────────────────────────────────────────────┐
│                                                      │
│ LATEST FROM THE JOURNAL                              │
│                                                      │
│ ┌────────────────────────────┐ ┌───────────────────┐ │
│ │ NEWEST JOURNAL ENTRY       │ │ SECOND NEWEST     │ │
│ │                            │ │ JOURNAL ENTRY     │ │
│ │ Approved image if supplied │ │                   │ │
│ │ Entry title                │ │ Entry title       │ │
│ │ Type / publication date    │ │ Type / date       │ │
│ │ Short excerpt              │ │ Short excerpt     │ │
│ │ Read entry                 │ │ Read entry        │ │
│ └────────────────────────────┘ └───────────────────┘ │
│                                                      │
│                         [Explore Journal →]          │
└──────────────────────────────────────────────────────┘
~~~

Use fewer cards when fewer approved entries exist. Do not pin an older upcoming event into this two-entry preview. On mobile, stack entries in document order and keep the archive link visible after them.

## 6. Journal archive

~~~text
┌──────────────────────────────────────────────────────┐
│ JOURNAL                                              │
│ Approved introduction (optional)                     │
│                                                      │
│ [All] [Exhibitions] [Events] [Studio] [Stories]       │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ [Approved image]  TYPE                            │ │
│ │                   Entry title                     │ │
│ │                   Excerpt                         │ │
│ │                   Publication date                 │ │
│ │                   Event date when applicable      │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ [Previous]       Page 1 of N       [Next]            │
│ Entries per page: [5 ▾]                              │
└──────────────────────────────────────────────────────┘
~~~

The page-size selector is a native accessible select or the project's established shadcn select. Preserve filter state when changing page or page size. Do not show pagination controls if all results fit on one page.

## 7. Event detail page

~~~text
┌──────────────────────────────────────────────────────┐
│ ← Back to Journal                                     │
│                                                      │
│ EXHIBITION / EVENT                                    │
│ Event title                                           │
│ Publication date                                      │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ EVENT INFORMATION                                 │ │
│ │ Date and time + timezone                          │ │
│ │ Venue / location (if confirmed)                   │ │
│ │ Attendance mode (if confirmed)                   │ │
│ │ Registration / official link (if valid)           │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ [Approved event image or poster, if supplied]        │
│                                                      │
│ Event description and editorial content              │
│                                                      │
│ Related gallery / artworks                            │
│ More from Journal                                     │
└──────────────────────────────────────────────────────┘
~~~

The actual event date/time must be visually distinct from the Journal publication date. Do not render empty metadata rows.

## 8. Interaction states

~~~text
ANNOUNCEMENT VISIBLE
- One eligible event selected.
- Link opens the localized canonical event detail route.
- Close button dismisses only the announcement.

DISMISSED
- Announcement disappears without page reflow.
- No toast, dialog, or focus movement.

NO ELIGIBLE EVENT
- No announcement component or reserved gap.

NEW EVENT SELECTED
- Dismissal of a different event does not suppress this event.

LONG TITLE / NARROW VIEWPORT
- Title wraps safely.
- Optional date is removed before title is clipped.
- If the tab cannot fit safely, reposition or suppress at that breakpoint.
~~~

## 9. Geometry and responsive constraints

- Fixed to viewport; safe-area-aware top offset.
- Physical left anchor for English and physical right anchor for Persian, consistent with current locale-aware sidebar behavior.
- On mobile, below the menu trigger with a clear gap.
- On desktop, align with the identity/sidebar zone without covering navigation.
- Use existing z-index and spacing tokens.
- No horizontal overflow at 320px, no clipping at 200% zoom, no overlap at short viewport heights.
- The announcement does not reserve layout space and never changes hero geometry.
