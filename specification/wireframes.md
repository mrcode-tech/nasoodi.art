# Nasoodi.art — Wireframes and Interaction Design

**Status:** Proposed structural wireframes  
**Visual direction:** Quiet contemporary gallery; artwork-led

These are layout contracts, not final visual designs. Final spacing, typography, palette, and image sequence must be evaluated against Ghazaleh's actual paintings.

## 1. Global shell

### Desktop

```text
┌────────────────────────────────────────────────────────────────────┐
│ GHAZALEH NASOODI      WORKS   ABOUT   CV   CONTACT    فارسی | EN   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                       PRIMARY ARTWORK                              │
│                  (large, accurate reproduction)                    │
│                                                                    │
│ GHAZALEH ABDOLAHZADE NASOODI                                       │
│ Oil Painter                                                        │
│                                                                    │
│ Explore selected works  →                                          │
├────────────────────────────────────────────────────────────────────┤
│ WORKS / SELECTED                                                   │
│                                                                    │
│ [Artwork image]       [Artwork image]       [Artwork image]         │
│ Title / year          Title / year          Title / year            │
├────────────────────────────────────────────────────────────────────┤
│ ABOUT EXCERPT                         [Portrait/studio, optional]   │
│ Artist-approved text                                               │
│ Read about the artist →                                            │
├────────────────────────────────────────────────────────────────────┤
│ CONTACT   Instagram   Language   ©                                 │
└────────────────────────────────────────────────────────────────────┘
```

The hero may use one strong painting or a carefully curated editorial composition. Do not turn the hero into a rotating carousel by default.

### Mobile

```text
┌──────────────────────────────┐
│ GHAZALEH NASOODI   MENU  FA/EN│
├──────────────────────────────┤
│                              │
│        PRIMARY ARTWORK       │
│                              │
│ GHAZALEH NASOODI             │
│ Oil Painter                  │
│ Explore works  →             │
├──────────────────────────────┤
│ SELECTED WORKS               │
│                              │
│ [Artwork image]              │
│ Title · year                 │
│                              │
│ [Artwork image]              │
│ Title · year                 │
├──────────────────────────────┤
│ ABOUT                        │
│ Short approved introduction  │
│ Read more →                  │
├──────────────────────────────┤
│ CONTACT · INSTAGRAM          │
└──────────────────────────────┘
```

On mobile, prioritize one-column artwork viewing and comfortable captions. Avoid tiny multi-column thumbnails that make paintings impossible to appreciate.

## 2. Works index

### Desktop

```text
┌────────────────────────────────────────────────────────────────────┐
│ HEADER                                                             │
├────────────────────────────────────────────────────────────────────┤
│ WORKS                                                              │
│ Optional short introduction                                        │
│                                                                    │
│ SERIES / COLLECTION (only if meaningful and approved)              │
│ [large landscape]       [portrait image]                            │
│ [portrait image]        [large landscape]                            │
│ [portrait image]        [portrait image]                             │
│                                                                    │
│ Artwork captions: title / year / medium (known fields only)        │
└────────────────────────────────────────────────────────────────────┘
```

Use a balanced editorial grid or masonry-like composition only if it preserves image dimensions and predictable reading order. CSS grid with explicit spans is acceptable; avoid JavaScript masonry if it adds layout instability.

### Mobile

- One column is the safest default for paintings.
- A two-column layout may be used only for small, visually coherent previews with sufficient image size.
- Keep captions directly associated with their artwork.
- Do not reorder the visual grid in a way that conflicts with DOM and keyboard reading order.

## 3. Artwork detail

```text
┌────────────────────────────────────────────────────────────────────┐
│ HEADER                                                             │
├────────────────────────────────────────────────────────────────────┤
│ ← Back to Works                                                    │
│                                                                    │
│                    LARGE ARTWORK IMAGE                             │
│                                                                    │
│                                                                    │
│ Title                                                              │
│ Year · Medium                                                      │
│ Dimensions                                                         │
│ Short artist-approved note                                         │
│ Availability (only if confirmed)                                   │
│ Enquire about this work → (only if enquiry is enabled)             │
│                                                                    │
│ [Optional detail image]                                            │
│ [Previous work]                                  [Next work]       │
└────────────────────────────────────────────────────────────────────┘
```

The detail image should be the focus. Metadata should be calm, readable, and consistent. Hide unknown fields rather than displaying “N/A” everywhere.

## 4. Lightbox (optional enhancement)

If a lightbox is implemented:

- Open only after an explicit user action.
- Provide visible close, previous, and next controls when applicable.
- Support Escape to close and restore focus to the invoking control.
- Keep keyboard focus within the modal while open.
- Expose the artwork title and useful image description to assistive technology.
- Prevent background scrolling without trapping users.
- Provide a close button with an accessible name and a sufficiently large touch target.
- Do not force zoom or prevent browser pinch zoom.
- Ensure the image fits within short-height screens and can be dismissed without scrolling.
- If there is only one image, do not show misleading previous/next controls.

A simple detail page without a lightbox is a valid first release.

## 5. About page

```text
┌────────────────────────────────────────────────────────────────────┐
│ HEADER                                                             │
├────────────────────────────────────────────────────────────────────┤
│ ABOUT THE ARTIST                                                   │
│                                                                    │
│ Artist portrait / studio image (optional)   BIOGRAPHY              │
│                                            Artist-approved facts   │
│                                                                    │
│ ARTIST STATEMENT                                                   │
│ First-person text describing the practice and concerns             │
│                                                                    │
│ Selected exhibitions / professional highlights (verified only)    │
└────────────────────────────────────────────────────────────────────┘
```

Keep statement and biography separate. The statement should describe the work; the biography should record factual professional context.

## 6. CV / exhibitions page

Use a simple chronological editorial list grouped by category. Include only categories with verified entries. If the artist has no formal exhibition history to publish yet, do not create a fake CV; the route can remain hidden until there is approved content.

## 7. Contact page

```text
┌────────────────────────────────────────────────────────────────────┐
│ HEADER                                                             │
├────────────────────────────────────────────────────────────────────┤
│ CONTACT                                                            │
│ A short artist-approved invitation                                 │
│                                                                    │
│ Email / approved contact method                                    │
│ Instagram @ghazalenasoodi                                          │
│                                                                    │
│ Optional enquiry form: name, email, subject, message              │
│ [Send enquiry]                                                     │
└────────────────────────────────────────────────────────────────────┘
```

Do not show a form until a real submission destination, validation, spam protection, and privacy notice exist. A mail link is a valid first-release option when the artist approves the address.

## 8. Persian RTL behavior

- Header order and navigation should read naturally from right to left.
- Use CSS logical properties for all layout spacing and positioning.
- Keep icons that indicate previous/next direction mirrored where semantically appropriate; do not mirror non-directional artwork or decorative marks.
- Use `dir="rtl"` at the page/document level for Persian, with `dir="ltr"` isolation for email, URLs, and Latin strings.
- Ensure gallery order and artwork captions follow a deliberate, consistent reading sequence.
- Do not simply right-align an English layout and call it RTL.

## 9. Responsive breakpoints

Test at representative widths, not only named device presets:

- Small mobile: 320–375 px.
- Large mobile: 390–430 px.
- Tablet portrait: 768 px.
- Tablet landscape / compact laptop: 1024 px.
- Desktop: 1280–1440 px.
- Wide desktop: 1600 px and above.
- Short-height desktop/mobile landscape: ensure the hero and lightbox remain usable.

The artwork should scale fluidly without cropping, horizontal overflow, or captions becoming detached from images.

## 10. Visual quality checks

Before approving the design:

- Compare displayed artwork against the supplied master image.
- Check warm/cool color shifts and dark shadow detail.
- Confirm image crop does not cut the canvas edges or signature.
- Check text and artwork contrast without placing text over important painted areas.
- Review both locales, all breakpoints, keyboard focus, and reduced-motion mode.
- Review loading placeholders and failed-image states.


## 11. Gallery index and gallery detail wireframes

### Gallery index — desktop

```text
┌───────────────────────────────────────────────────────────────────┐
│ GLOBAL SHELL / LEFT SIDEBAR                                       │
├───────────────────────────────────────────────────────────────────┤
│ GALLERIES                                                         │
│ Short approved introduction                                       │
│                                                                   │
│ ┌──────────────────────┐  ┌──────────────────────┐               │
│ │ [Gallery cover art]  │  │ [Gallery cover art]  │               │
│ │ Gallery title        │  │ Gallery title        │               │
│ │ Short description   │  │ Short description   │               │
│ │ Explore gallery →    │  │ Explore gallery →    │               │
│ └──────────────────────┘  └──────────────────────┘               │
│                                                                   │
│ [Additional gallery cards in curated order]                       │
└───────────────────────────────────────────────────────────────────┘
```

### Gallery index — mobile

```text
┌───────────────────────────────┐
│ GLOBAL MOBILE HEADER          │
├───────────────────────────────┤
│ GALLERIES                     │
│ Approved introduction         │
│                               │
│ [Full gallery cover image]    │
│ Gallery title                 │
│ Short description             │
│ Explore gallery →             │
│                               │
│ [Next gallery cover]          │
│ Gallery title                 │
│ Short description             │
│ Explore gallery →             │
└───────────────────────────────┘
```

### Gallery detail

```text
┌───────────────────────────────────────────────────────────────────┐
│ GLOBAL SHELL                                                      │
├───────────────────────────────────────────────────────────────────┤
│ ← All galleries                                                   │
│ Gallery title                                                     │
│ Short artist-approved description                                 │
│                                                                   │
│ [Artwork A]                 [Artwork B]                            │
│ Title / known metadata      Title / known metadata                │
│                                                                   │
│ [Artwork C — larger]        [Artwork D]                            │
│ Title / known metadata      Title / known metadata                │
│                                                                   │
│ [More artworks in curated order]                                  │
└───────────────────────────────────────────────────────────────────┘
```

Gallery cards navigate to dedicated gallery pages. Artwork cards navigate to individual artwork detail pages when available. Preserve curated DOM and keyboard order. Mobile defaults to a generous one-column layout.

## 12. Homepage hero and featured content wireframe

### Desktop

```text
┌───────────────────────────────────────────────────────────────────┐
│ GLOBAL SHELL                                                      │
├───────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────┐  ARTIST NAME                      │
│ │                             │  Oil Painter                      │
│ │      APPROVED HERO           │  Short approved introduction     │
│ │      PAINTING IMAGE          │  Explore galleries →             │
│ │                             │  View selected works →            │
│ └─────────────────────────────┘                                   │
├───────────────────────────────────────────────────────────────────┤
│ FEATURED WORKS                                                    │
│ [Painting]           [Painting]           [Painting]               │
│ Title                Title                Title                    │
│ View all works →                                                │
├───────────────────────────────────────────────────────────────────┤
│ FEATURED GALLERIES                                                │
│ [Gallery cover + title + short description]                       │
│ [Gallery cover + title + short description]                       │
│ View all galleries →                                              │
├───────────────────────────────────────────────────────────────────┤
│ ABOUT PREVIEW · VERIFIED HIGHLIGHTS · CONTACT · FOOTER            │
└───────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌───────────────────────────────┐
│ GLOBAL MOBILE HEADER          │
├───────────────────────────────┤
│ [Full hero painting]          │
│ Artist name · Oil Painter     │
│ Short approved intro          │
│ Explore galleries →           │
│ View selected works →         │
├───────────────────────────────┤
│ FEATURED WORKS                │
│ [Painting]                    │
│ Title / known metadata        │
│ [Painting]                    │
│ Title / known metadata        │
│ View all works →              │
├───────────────────────────────┤
│ FEATURED GALLERIES            │
│ [Gallery cover]               │
│ Title + short description     │
│ Explore gallery →             │
│ [Next gallery]                │
│ View all galleries →          │
├───────────────────────────────┤
│ ABOUT · CONTACT · FOOTER      │
└───────────────────────────────┘
```

Featured Works and Featured Galleries are distinct sections. The former promotes individual paintings; the latter promotes curated collections. Neither is an autoplay carousel.

## 13. Journal landing, homepage preview, and detail wireframes

The complete interaction and content contract is in [journal-and-events.md](./journal-and-events.md). These compact wireframes establish the page relationships.

### Homepage — Latest from the Journal

```text
LATEST FROM THE JOURNAL                         View all journal entries →
[Featured upcoming event — only when eligible]
[Event image]  Event or exhibition title
               Confirmed date · venue
               Short summary · View event →

[Recent entry]                         [Recent entry]
Title · type · publication date        Title · type · publication date
Excerpt · Read more                    Excerpt · Read more
```

The section follows Featured Works and Featured Galleries. If no upcoming event exists, show recent published entries; if no eligible entries exist, omit the section.

### Journal index

```text
JOURNAL
Artist-approved introduction
[All] [Exhibitions] [Events] [Studio Updates] [Stories]
[Featured upcoming event — optional]
[Entry cards in reverse chronological publication order]
[Pagination / Load more — only when needed]
```

### Journal detail

```text
← Journal
TYPE LABEL · TITLE · SUMMARY · PUBLICATION DATE
[Optional approved cover image]
[Article rich text OR event details panel and event content]
[Related artworks / galleries — optional]
[More from Journal]
```

Journal is a primary navigation destination on desktop and mobile. Persian and English use the same semantic order with locale-appropriate direction and labels.
