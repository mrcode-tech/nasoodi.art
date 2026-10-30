# Nasoodi.art — Bilingual Artwork-Led Homepage Hero, CTAs, and Showcase Specification

**Status:** Proposed, implementation-ready design contract  
**Working branch:** `feature`  
**Locales:** English (`en`, LTR) and Persian (`fa`, RTL)  
**Scope:** Homepage hero artwork, artist identity, hero CTA hierarchy, responsive wireframes, and a complete visual/content QA scenario set for the homepage showcase (Featured Works, Featured Galleries, and Latest from the Journal).  
**Normative relationships:** This document specializes and extends `homepage-artwork-hero-and-featured-works.md`; it must be read with `design-engineering-skills.md`, `design-direction-and-system-refinement.md`, `site-wide-design-system-and-section-specification.md`, `visual-identity-and-photo-direction.md`, `artwork-imaging-and-asset-pipeline.md`, `gallery-collections-and-artwork-detail.md`, `journal-and-events.md`, `content-model.md`, `localization-and-editorial-governance.md`, `accessibility-performance-security.md`, and `testing-qa-and-release.md`.

---

## 1. Decision summary

The homepage is the opening room of an artist's portfolio. Its first viewport must make the artist and a finished painting immediately understandable, then offer two distinct, clearly named routes into the collection.

The approved design direction is **artwork-led, quiet, editorial, and bilingual by composition—not a mirrored copy of one layout**.

### 1.1 Hero decisions

1. Use `specification/assets/artwork.JPG` as the designated hero artwork candidate and visual source for this design.
2. Inspect the actual image before implementation: intrinsic dimensions, orientation, full canvas/frame bounds, color profile, resolution, visible content, and suitability for the target display sizes.
3. Do not infer artwork title, date, medium details, subject, or interpretation from the filename or image. Use only artist-approved text and metadata.
4. Preserve the entire artwork. The default rendering is uncropped, undistorted, unfiltered, unmirrored, and color-faithful.
5. Artist identity and the confirmed role “Oil painter” / «نقاش رنگ‌روغن» remain visible and text-based.
6. Provide two hero actions with different destinations:
   - Primary: **Explore galleries** → localized Galleries index.
   - Secondary: **View selected works** → localized Works index or the selected-works anchor only if that anchor is stable and intentional.
7. Do not repeat the hero action labels in the Featured Works heading. Its action is **View all works**.
8. The hero painting is a single static image. No carousel, simulated brush movement, parallax, zoom-on-scroll, or text overlay.

### 1.2 Content-readiness decisions

The repository currently has empty content arrays and no configured hero selection. The five gallery images are design/demo fixtures, not evidence of artist approval, publication rights, artwork metadata, or real Journal stories.

- The specification's sample imagery must make the intended full homepage composition understandable in design previews and test fixtures.
- Sample fixture content must be isolated from production content and must never be published as factual portfolio content.
- Public sections are conditional: render only when valid, approved, locale-ready content exists. Do not render empty public placeholders.
- If no approved hero artwork is configured, use the approved identity-only fallback described below; never silently use a sample fixture or a generated painting in production.

### 1.3 Terminology

- **Hero:** the first homepage composition containing the artwork, identity, concise introduction, and hero actions.
- **Hero CTA:** one of the two distinct hero navigation links.
- **Featured Works:** selected individual paintings, not galleries.
- **Featured Galleries:** curated collections, not a second Works grid.
- **Latest from the Journal:** recent approved editorial entries and/or a verified upcoming event.
- **Design fixture:** sample content/assets used only for wireframes, screenshots, and isolated preview/test data.

---

## 2. Experience goals and hierarchy

### 2.1 First-viewport goals

Within the first viewport, a visitor should be able to answer:

1. Whose portfolio is this?
2. What is the artist's confirmed practice?
3. Where can I see a painting at a meaningful size?
4. How do I browse collections?
5. How do I browse selected individual works?

The hierarchy is:

1. Finished painting.
2. Artist name.
3. Confirmed discipline.
4. Approved introductory sentence, if one exists.
5. Primary CTA: Explore galleries.
6. Secondary CTA: View selected works.
7. Navigation and quiet decorative details.

The image must not be reduced to a small thumbnail to make room for excessive copy. The interface frames the artwork; it does not compete with it.

### 2.2 Overall homepage sequence

When the corresponding approved content exists, use this sequence:

1. Shared site navigation/shell.
2. Artwork-led hero.
3. Featured Works.
4. Featured Galleries.
5. Latest from the Journal, including an upcoming event only when eligible.
6. Approved artist introduction/contact invitation where specified by the broader homepage contract.
7. Shared footer.

Do not render an empty section solely to preserve a fixed sequence. If a section has no qualifying content, omit it without leaving an empty heading, divider, blank card grid, or placeholder paragraph.

### 2.3 Avoid

- Generic SaaS split-hero patterns, gradients, glassmorphism, oversized rounded cards, decorative blobs, and heavy shadows.
- A hero that contains only an artist name and whitespace while the approved hero painting is available.
- Text positioned over the painting by default.
- Repeated “Explore works” actions in the hero and Featured Works heading.
- Two sections that both claim to be Selected/Featured Works.
- Unapproved descriptions, slogans, titles, years, medium, dimensions, or exhibition facts.
- Sample images presented as real published artworks or real Journal covers.
- Fixed-height image crops that cut off canvas edges.
- A carousel or swipe-only discovery control.

---

## 3. Asset contract and design fixture mapping

### 3.1 Required supplied assets

| Purpose | Exact repository path | Contract |
|---|---|---|
| Hero artwork | `specification/assets/artwork.JPG` | Designated hero candidate and primary hero reference. Inspect before implementation. Do not rename or assume rights from filename. |
| Sample artwork 01 | `specification/assets/gallery/1.jpg` | Design fixture for a Featured Works item and reusable gallery artwork reference. |
| Sample artwork 02 | `specification/assets/gallery/2.jpg` | Design fixture for a Featured Works item and reusable gallery artwork reference. |
| Sample artwork 03 | `specification/assets/gallery/3.jpg` | Design fixture for a Featured Works item and Journal-related visual example. |
| Sample artwork 04 | `specification/assets/gallery/4.jpg` | Design fixture for a Featured Works item and a gallery cover/reference. |
| Sample artwork 05 | `specification/assets/gallery/5.jpg` | Design fixture for a gallery cover/reference and Journal-related visual example. |

Exact filename casing matters. These assets are repository specification assets, not automatically public runtime assets.

### 3.2 Intended showcase distribution

Use all five sample images to make every homepage feature visible in isolated design previews and visual test fixtures. Reuse the same canonical fixture artwork identity when an image appears in more than one context; do not create duplicate artwork records just because an image is used in multiple sections.

| Homepage feature | Design fixture composition | Example mapping |
|---|---|---|
| Featured Works | Editorial selection of four individual works | `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg` |
| Featured Galleries | Two distinct collection previews with real artwork references | Gallery A cover: `2.jpg`; Gallery B cover: `5.jpg`; members may reference the same fixture artwork IDs in curated order |
| Latest from the Journal | Two editorial entries with contextual artwork imagery in the preview only | Entry A related visual: `3.jpg`; Entry B related visual: `5.jpg` |
| Hero | One dominant finished painting | `artwork.JPG` |

This distribution intentionally reuses artwork references across Works, Galleries, and Journal context. The image is not copied into a new content identity for each placement.

### 3.3 Fixture-only content rules

- Use neutral fixture identifiers such as `fixture-work-01` through `fixture-work-05`, `fixture-gallery-01`, and `fixture-journal-01`.
- In design-only wireframes, labels such as “Sample artwork 01” / «اثر نمونه ۰۱» are annotations, not proposed public titles.
- Do not invent a painting title, story, exhibition, event, artist statement, date, medium, dimensions, or venue to make a mockup look complete.
- A Journal card may use a sample artwork as a **related/contextual image** in the design preview. It must not imply that the painting is the cover image for a real article unless the artist/editor supplies and approves that relationship.
- In production, Journal imagery is optional. If no approved Journal cover exists, use the typographic editorial layout defined in `journal-and-events.md`.
- In production, a gallery cover must resolve to a published, rights-confirmed artwork record that belongs to that gallery.
- Sample fixtures must be loaded only by an explicit development/visual-test fixture path. They must not be imported into the production content registry, sitemap, JSON-LD, or public routes.
- The visual-test suite must prove fixture isolation from production builds and public data.

### 3.4 Asset inspection record required before implementation

Record for each asset: exact path, detected format, width, height, orientation, file size, color profile if available, alpha/transparency if any, visible canvas/frame bounds, and intended role. For `artwork.JPG`, additionally record the selected responsive derivative and verify that the full painting remains visible at desktop, tablet, and mobile sizes.

If an asset is unsuitable, stop and request owner direction. Do not replace it silently.

---

## 4. Hero structure and content contract

### 4.1 Semantic structure

The hero is one semantic section with one H1. Recommended conceptual structure:

```tsx
<section className="home-hero" aria-labelledby="home-hero-title">
  <div className="home-hero__media">
    <Image ... />
    <figcaption>{approvedArtworkTitle}</figcaption>
  </div>
  <div className="home-hero__content">
    <p className="eyebrow">{localizedPortfolioLabel}</p>
    <h1 id="home-hero-title">{localizedArtistName}</h1>
    <p className="home-hero__discipline">{localizedConfirmedDiscipline}</p>
    {approvedIntroduction && <p>{approvedIntroduction}</p>}
    <nav aria-label={localizedHeroActionsLabel}>
      <Link ...>{localizedPrimaryAction}</Link>
      <Link ...>{localizedSecondaryAction}</Link>
    </nav>
  </div>
</section>
```

This is a semantic illustration, not a demand to copy the exact markup. Reconcile with the actual App Router page, shared shell, and existing component conventions. Use Next Image or the existing project image component; do not introduce a second image pipeline.

### 4.2 Content fields and fallback behavior

| Element | English | Persian | Source/condition |
|---|---|---|---|
| Portfolio eyebrow | Artist portfolio | پورتفولیوی هنرمند | Existing localized UI copy; owner-approved wording |
| H1 | Ghazaleh Abdolahzade Nasoodi | غزاله عبداله زاده نسودی | Supplied artist identity; preserve spelling exactly unless owner updates it |
| Discipline | Oil painter | نقاش رنگ‌روغن | Confirmed practice |
| Optional introduction | Artist-approved English sentence | Artist-approved Persian sentence | Render only when approved for that locale |
| Primary CTA | Explore galleries | گالری‌ها را ببینید | Link to localized Galleries index |
| Secondary CTA | View selected works | گزیده آثار را ببینید | Link to localized Works index |
| Hero image caption | Approved artwork title, if available | Approved artwork title, if available | Omit if title is not approved |
| Hero image alt | Locale-specific factual description of visible content | توصیف دقیق و فارسیِ محتوای قابل مشاهده | Required for meaningful image; no interpretation or guessed title |

The Persian strings above are proposed UI copy and require editorial review before publication. The H1 and discipline are the currently supplied identity facts.

### 4.3 CTA distinction and destination

The two CTAs must be visually and semantically distinct:

**Primary — Explore galleries / گالری‌ها را ببینید**
- Destination: `pagePath(locale, "galleries")`.
- Role: invite visitors into curated collections.
- Visual treatment: quiet filled or stronger-accent text action, whichever matches the existing approved button/link system. It must remain editorial, not a large SaaS pill.
- It is primary only when the Galleries index has meaningful published content in that locale. If the destination is empty/unavailable, omit this CTA rather than sending visitors to an empty public page.

**Secondary — View selected works / گزیده آثار را ببینید**
- Destination: `pagePath(locale, "works")`, unless a stable, meaningful selected-works anchor is intentionally implemented and documented.
- Role: direct route to individual paintings.
- Visual treatment: text link with fine underline or the project's secondary link style.
- Show only when the Works destination contains meaningful published content.

Do not use one CTA to imply two destinations. Do not point both CTAs to the same route. Do not add `target="_blank"`.

### 4.4 CTA layout and alignment

- The CTA group is one coherent group, placed directly after the optional intro.
- Align the group to **logical inline-end** of the hero copy column. This is right in LTR and left in RTL.
- Use CSS logical properties and flex alignment; do not hardcode physical left/right margins.
- In a horizontal CTA row, the primary action precedes the secondary action in reading order. CSS direction handles visual flow.
- At narrow mobile widths, stack actions vertically in reading order; maintain logical inline-end alignment without squeezing or clipping labels.
- Keep the CTA group aligned to the content column, not to the viewport edge or the physical sidebar.
- Both links must have visible focus and hover states, a minimum 44×44 CSS-pixel target area where feasible, and distinct accessible names.
- Do not use arrow glyph direction as the only indicator of navigation. If a directional icon is used, mirror the icon behavior for RTL while leaving artwork unmirrored.

### 4.5 Duplicate CTA/content rules

- Hero CTA labels are “Explore galleries” and “View selected works”.
- Featured Works action is “View all works”.
- Featured Galleries action is “View all galleries”.
- Journal action is “View all journal entries”.
- Each section is rendered at most once.
- Never place two same-label links to the same destination in the hero.
- The hero's secondary action and Featured Works action may share the Works destination, but their labels and context must be distinct.
- A repeated route is acceptable only when each link serves a distinct section/context and has a distinct accessible name.

---

## 5. Hero visual design

### 5.1 Desktop: 1280–1600px and wider

- Use a two-column editorial composition within the shared content container.
- Artwork occupies approximately 55–62% of the hero composition; copy occupies approximately 38–45%. These are starting proportions, not fixed widths.
- Use a generous image area. Preserve the full source ratio with `width: 100%; height: auto` or a measured contain frame.
- Align the artwork and copy optically around their visual centers, not necessarily their top edges.
- Keep the title line length controlled. The artist's full name should not collide with the artwork or CTA group.
- Keep the hero height content-driven. Avoid a forced 88vh empty block when the image is absent.
- The full painting should be visible without a visitor needing to scroll merely to discover what the hero image is.
- Use a subtle caption below the image only if the title is approved.

### 5.2 Tablet: 768–1024px

- Reduce the image/copy gap and outer gutter before reducing image prominence.
- Use a two-column layout only if both columns retain readable widths and the painting remains legible.
- At the narrower tablet breakpoint, switch to a vertical composition: artwork first, then identity and actions.
- Preserve full artwork ratio and a comfortable text measure.
- Avoid a layout where the artwork becomes a narrow strip beside a long name.

### 5.3 Mobile: 360–767px

- Use a single-column sequence.
- Recommended order: portfolio eyebrow and identity, painting, discipline/approved intro, CTAs; alternatively painting before identity only if the visual review shows stronger first-viewport comprehension. The final order must be consistent across both locales and recorded in screenshots.
- The hero painting must appear near the top and at a meaningful width.
- No fixed-height crop. The entire artwork remains visible.
- Stack CTAs with comfortable separation; do not use two tiny inline links.
- Keep the first meaningful route to Works/Galleries visible without a long scroll.
- Do not hide either CTA behind hover or a carousel.
- Avoid horizontal overflow at 360px.

### 5.4 Short-height desktop

- Do not vertically center the entire hero if doing so pushes the artwork or CTAs below the fold.
- Reduce only excess vertical padding; do not reduce the painting below a useful display size.
- Navigation remains reachable and hero content is not clipped.
- Test a 1280×720 viewport and a 1440×700 viewport.

---

## 6. Bilingual wireframes

Wireframes are structural, not pixel-perfect. All text shown is proposed UI copy unless identified as supplied/confirmed. Artwork fixtures are represented by their exact asset paths.

### 6.1 Desktop — English (LTR)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ FIXED PHYSICAL-LEFT SIDEBAR     utility: EN / theme (if retained)           │
│                                                                              │
│ Nasoodi.art             ┌────────────────────────────┬─────────────────────┐ │
│ Home                   │                            │ ARTIST PORTFOLIO    │ │
│ Works                  │                            │                     │ │
│ Galleries              │   artwork.JPG               │ Ghazaleh            │ │
│ Journal                │   full image                │ Abdolahzade Nasoodi │ │
│ About                  │   uncropped                 │ Oil painter         │ │
│ Contact                │                            │                     │ │
│                        │                            │ approved intro      │ │
│                        │                            │                     │ │
│                        │                            │ Explore galleries   │ │
│                        │                            │ View selected works│ │
│                        └────────────────────────────┴─────────────────────┘ │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ FEATURED WORKS                                             View all works → │
│                                                                              │
│       [1.jpg]             [2.jpg]                  [3.jpg]                  │
│       Sample 01           Sample 02                Sample 03                │
│                                                                              │
│                    [4.jpg] / editorial variation as content permits         │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ FEATURED GALLERIES                                      View all galleries → │
│                                                                              │
│ [2.jpg]  Gallery fixture 01         [5.jpg]  Gallery fixture 02             │
│          approved description                approved description           │
│          Explore gallery                     Explore gallery                │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ LATEST FROM THE JOURNAL                         View all journal entries →  │
│                                                                              │
│ [3.jpg]  Journal fixture 01          [5.jpg]  Journal fixture 02            │
│          title / type / excerpt               title / type / excerpt        │
│          Read entry                           Read entry                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Desktop — Persian (RTL)

The content flow is RTL, while the desktop sidebar remains physically on the left per the shared navigation specification. The painting is never mirrored.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ FIXED PHYSICAL-LEFT SIDEBAR                    ابزارهای زبان / پوسته در بالا │
│                                                                              │
│ Nasoodi.art     ┌───────────────────────┬──────────────────────────────────┐ │
│ خانه            │      پورتفولیوی هنرمند │                                  │ │
│ آثار            │                       │           artwork.JPG            │ │
│ گالری‌ها        │ غزاله عبداله زاده      │           تصویر کامل              │ │
│ یادداشت‌ها      │ نسودی                 │           بدون برش               │ │
│ درباره          │ نقاش رنگ‌روغن          │                                  │ │
│ تماس            │ متن تأییدشده هنرمند    │                                  │ │
│                 │                       │                                  │ │
│                 │ گالری‌ها را ببینید    │                                  │ │
│                 │ گزیده آثار را ببینید  │                                  │ │
│                 └───────────────────────┴──────────────────────────────────┘ │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ ← مشاهده همه آثار                                      گزیده آثار            │
│                                                                              │
│       [1.jpg]             [2.jpg]                  [3.jpg]                  │
│       نمونه ۰۱            نمونه ۰۲                 نمونه ۰۳                 │
│                         [4.jpg]                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ ← مشاهده همه گالری‌ها                                   گالری‌های منتخب      │
│                                                                              │
│ [2.jpg]  مجموعه نمونه ۰۱                [5.jpg]  مجموعه نمونه ۰۲             │
│          توضیح تأییدشده                           توضیح تأییدشده              │
│          مشاهده گالری                             مشاهده گالری               │
├──────────────────────────────────────────────────────────────────────────────┤
│ ← همه یادداشت‌ها                                     تازه‌های یادداشت‌ها     │
│                                                                              │
│ [3.jpg]  یادداشت نمونه ۰۱               [5.jpg]  یادداشت نمونه ۰۲            │
│          عنوان / نوع / خلاصه                     عنوان / نوع / خلاصه        │
│          ادامه مطلب                              ادامه مطلب                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Tablet — English (LTR)

```text
┌───────────────────────────────────────────────────────────────┐
│ mobile/tablet header and navigation behavior per shared spec  │
├───────────────────────────────────────────────────────────────┤
│ ARTIST PORTFOLIO                                               │
│ Ghazaleh Abdolahzade Nasoodi                                   │
│ Oil painter                                                    │
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                  artwork.JPG                              │ │
│ │                  full image                                │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                               Explore galleries│
│                                               View selected works
├───────────────────────────────────────────────────────────────┤
│ FEATURED WORKS                              View all works →  │
│ [1.jpg]                [2.jpg]                                │
│ [3.jpg]                [4.jpg]                                │
├───────────────────────────────────────────────────────────────┤
│ FEATURED GALLERIES                       View all galleries → │
│ [2.jpg] Gallery 01       [5.jpg] Gallery 02                    │
├───────────────────────────────────────────────────────────────┤
│ LATEST FROM THE JOURNAL               View all journal entries →│
│ [3.jpg] Entry 01         [5.jpg] Entry 02                       │
└───────────────────────────────────────────────────────────────┘
```

### 6.4 Tablet — Persian (RTL)

```text
┌───────────────────────────────────────────────────────────────┐
│ سربرگ و منوی تبلت مطابق قرارداد مشترک                         │
├───────────────────────────────────────────────────────────────┤
│ پورتفولیوی هنرمند                                              │
│ غزاله عبداله زاده نسودی                                        │
│ نقاش رنگ‌روغن                                                   │
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                       artwork.JPG                         │ │
│ │                       تصویر کامل                          │ │
│ └───────────────────────────────────────────────────────────┘ │
│                  گالری‌ها را ببینید                            │
│                  گزیده آثار را ببینید                          │
├───────────────────────────────────────────────────────────────┤
│ مشاهده همه آثار                                      گزیده آثار│
│ [1.jpg]                [2.jpg]                                │
│ [3.jpg]                [4.jpg]                                │
├───────────────────────────────────────────────────────────────┤
│ مشاهده همه گالری‌ها                               گالری‌های منتخب│
│ [2.jpg] مجموعه ۰۱       [5.jpg] مجموعه ۰۲                      │
├───────────────────────────────────────────────────────────────┤
│ همه یادداشت‌ها                                  تازه‌های یادداشت‌ها│
│ [3.jpg] یادداشت ۰۱      [5.jpg] یادداشت ۰۲                     │
└───────────────────────────────────────────────────────────────┘
```

### 6.5 Mobile — English (LTR)

```text
┌─────────────────────────────────────┐
│ ☰                         Nasoodi.art│
├─────────────────────────────────────┤
│ ARTIST PORTFOLIO                    │
│ Ghazaleh Abdolahzade                 │
│ Nasoodi                              │
│ Oil painter                          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │          artwork.JPG            │ │
│ │          full image             │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ approved introduction (optional)    │
│                                     │
│ Explore galleries                   │
│ View selected works                 │
├─────────────────────────────────────┤
│ FEATURED WORKS                      │
│ View all works →                    │
│ [1.jpg full ratio]                  │
│ Sample artwork 01                   │
│ [2.jpg full ratio]                  │
│ Sample artwork 02                   │
│ [3.jpg full ratio]                  │
│ Sample artwork 03                   │
│ [4.jpg full ratio]                  │
│ Sample artwork 04                   │
├─────────────────────────────────────┤
│ FEATURED GALLERIES                  │
│ View all galleries →                │
│ [2.jpg] Gallery 01                  │
│ [5.jpg] Gallery 02                  │
├─────────────────────────────────────┤
│ LATEST FROM THE JOURNAL             │
│ View all journal entries →          │
│ [3.jpg] Journal entry 01            │
│ [5.jpg] Journal entry 02            │
└─────────────────────────────────────┘
```

### 6.6 Mobile — Persian (RTL)

```text
┌─────────────────────────────────────┐
│ Nasoodi.art                    ☰    │
├─────────────────────────────────────┤
│ پورتفولیوی هنرمند                   │
│ غزاله عبداله زاده نسودی             │
│ نقاش رنگ‌روغن                        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │          artwork.JPG            │ │
│ │          تصویر کامل             │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ متن تأییدشده (در صورت وجود)         │
│                                     │
│ گالری‌ها را ببینید                  │
│ گزیده آثار را ببینید               │
├─────────────────────────────────────┤
│ گزیده آثار                          │
│ مشاهده همه آثار                     │
│ [1.jpg تصویر کامل]                  │
│ اثر نمونه ۰۱                        │
│ [2.jpg تصویر کامل]                  │
│ اثر نمونه ۰۲                        │
│ [3.jpg تصویر کامل]                  │
│ اثر نمونه ۰۳                        │
│ [4.jpg تصویر کامل]                  │
│ اثر نمونه ۰۴                        │
├─────────────────────────────────────┤
│ گالری‌های منتخب                     │
│ مشاهده همه گالری‌ها                 │
│ [2.jpg] مجموعه نمونه ۰۱             │
│ [5.jpg] مجموعه نمونه ۰۲             │
├─────────────────────────────────────┤
│ تازه‌های یادداشت‌ها                 │
│ همه یادداشت‌ها                      │
│ [3.jpg] یادداشت نمونه ۰۱            │
│ [5.jpg] یادداشت نمونه ۰۲            │
└─────────────────────────────────────┘
```

### 6.7 Wireframe interpretation rules

- The ASCII diagrams communicate order and hierarchy, not exact pixel measurements.
- Persian diagrams show RTL reading flow but retain the physical-left sidebar.
- The hero painting must not be flipped for Persian.
- On mobile, all sections become a single document flow; do not create horizontally clipped grids.
- Featured Works, Featured Galleries, and Journal remain separate semantic sections with unique headings and unique action labels.
- Fixture labels are visual annotations only and must not leak into public content.

---

## 7. Featured Works design contract

### 7.1 Content

- Use 3–6 approved works when available; use fewer if that is all that is approved.
- The initial design fixture uses `1.jpg` through `4.jpg`.
- Each item must have a unique canonical artwork identity, localized approved title, valid primary image, rights confirmation, and published status before public rendering.
- Use explicit editorial order, never filename sorting in production.
- Avoid repeating the hero artwork immediately in the first featured slot unless deliberately approved.
- Do not show unknown year, medium, dimensions, or availability.
- The section CTA is **View all works** / «مشاهده همه آثار».

### 7.2 Layout

- Desktop: editorial multi-column grid with deliberate scale variation where supported by image ratios; captions remain adjacent to images.
- Tablet: two-column grid where images remain legible.
- Mobile: one-column full-width images with native aspect ratios and adjacent captions.
- Do not use uniform `object-fit: cover` thumbnails for paintings.
- No autoplay carousel or hidden swipe-only content.

### 7.3 Empty state

If there are no approved featured artworks:
- Omit the Featured Works section from the public homepage.
- Do not render an empty-note placeholder.
- Do not leave an orphan heading or divider.
- Keep the hero secondary CTA only if the Works destination itself has meaningful published works; otherwise omit it.
- Design/test fixture may still show the section to demonstrate the intended layout.

---

## 8. Featured Galleries design contract

- Render only published, localized galleries with approved descriptions and a valid cover artwork that belongs to the gallery.
- Design fixture: two gallery previews using cover images `2.jpg` and `5.jpg`.
- Gallery previews must communicate that these are curated collections, not individual artwork detail cards.
- Each preview shows cover image, title, short approved description, and a localized route to its gallery detail.
- The section action is **View all galleries** / «مشاهده همه گالری‌ها».
- Desktop: two or three editorial previews with comfortable image scale and text adjacent/below.
- Tablet: two columns if readable; otherwise stack.
- Mobile: one-column previews, full image ratio, title/description/link grouped.
- Do not fabricate collection names, descriptions, or membership.
- If no published gallery exists, omit the section and its CTA from public homepage.

---

## 9. Latest from the Journal design contract

- Keep one unified Journal section; do not add a separate Events homepage section.
- Place it after Featured Works and Featured Galleries as specified by `journal-and-events.md`.
- Include the nearest qualifying upcoming event when one exists; otherwise show up to two recent published entries.
- Use only entries that are published, artist-approved, and approved for the active locale.
- Design fixture: two editorial previews may reference `3.jpg` and `5.jpg` as related/contextual artwork visuals. These are fixture relationships only; no actual story or event is implied.
- If a real approved Journal cover is not available, use the typographic treatment defined in `journal-and-events.md`; do not invent a cover.
- Card content: type, title, short summary, publication date; event date/status only when verified.
- Section action: **View all journal entries** / «مشاهده همه یادداشت‌ها».
- Desktop: two editorial entries with clear title and summary; imagery is optional and subordinate to text.
- Tablet: two columns only where text remains readable.
- Mobile: one-column editorial list; preserve type/title/summary order.
- If there are no qualifying entries and no eligible upcoming event, omit the section from public homepage.

---

## 10. Design tokens and visual behavior

Use existing semantic tokens. Do not introduce parallel color, spacing, or typography values solely for this hero.

### 10.1 Palette roles

- Canvas: warm paper background.
- Surface: restrained warm neutral for the image surround only where needed.
- Primary text: warm ink.
- Secondary text: muted warm gray.
- Accent: muted mauve/taupe for CTA emphasis and fine rules.
- Border: warm neutral divider.
- Artwork: original source pixels; never color-corrected to match the UI.

### 10.2 Typography

- English artist name: editorial display face with controlled measure and responsive size.
- Persian artist name: Persian-capable family with correct shaping, natural word spacing, and a tuned line-height. Never apply Latin-style letter spacing to Persian.
- Discipline: readable body/intro role, subordinate to H1.
- CTA: project link/button role; not an oversized promotional label.
- Persian line-height may be greater than English to prevent clipping and maintain legibility.

### 10.3 Borders, shapes, and focus

- Prefer open composition and whitespace to enclosing every element in a card.
- Use a fine border or underline to define links.
- Avoid heavy shadows and default pill shapes.
- Focus indicators must be visible against warm paper and must not be clipped.
- Hover states may adjust underline/accent only; no image zoom or painting recolor.

### 10.4 RTL/LTR

- Set `lang` and `dir` at the document level using the existing locale shell.
- Use `margin-inline`, `padding-inline`, `inset-inline`, `text-align: start/end`, `align-self: flex-end`, and logical grid placement where appropriate.
- CTA group aligns to logical inline-end.
- Desktop sidebar remains physical-left in both locales as separately specified.
- Do not mirror paintings, image details, signatures, or studio photographs.
- Verify punctuation, Latin artist name, URLs, numerals, and mixed-script captions with bidi isolation as needed.

---

## 11. Responsive behavior and breakpoints

Use the repository's existing breakpoints unless a measured design defect justifies a documented adjustment.

| Target | Viewport | Required composition |
|---|---:|---|
| Wide desktop | 1600×1000 | Full sidebar; generous two-column hero; large full painting |
| Desktop | 1440×900 | Full sidebar; two-column hero; all hero actions visible |
| Short desktop | 1280×720 | Compact vertical rhythm; hero not clipped |
| Tablet landscape | 1024×768 | Two columns only if copy/image remain balanced |
| Tablet portrait | 768×1024 | Vertical hero if two columns become cramped |
| Mobile | 390×844 | Single-column hero; full painting; stacked CTAs |
| Small mobile | 360×800 | No horizontal overflow; Persian title wraps naturally |
| Large mobile | 430×932 | Full composition without excessive blank height |

Test intermediate widths around each CSS breakpoint to catch abrupt wrapping and layout shifts.

---

## 12. Accessibility and interaction requirements

Target WCAG 2.2 AA in both locales.

- One H1 on homepage.
- Hero is a labelled section; image is meaningful and has localized alt text.
- If the visible caption already fully names the painting, alt text should describe the visual rather than duplicate the caption.
- CTA links are real anchors with correct localized hrefs.
- Keyboard order follows visual/reading order.
- Focus ring is visible for both CTAs, including in RTL.
- No action requires hover.
- Touch target is at least 44×44 CSS px where feasible.
- Color contrast is verified using actual token pairs.
- Layout reflows at 200% zoom without loss of content or horizontal scrolling.
- `prefers-reduced-motion: reduce` removes optional entrance transitions; image and links remain immediately available.
- No animation delays link availability.
- Screen-reader names distinguish “Explore galleries” from “View selected works” and their Persian equivalents.
- Do not use an icon as the only accessible name.

---

## 13. Performance, image delivery, and SEO

- Hero image is the primary LCP candidate; use priority/eager loading only for this above-the-fold asset.
- Provide responsive sizes appropriate to the actual content container and viewport.
- Reserve intrinsic dimensions or aspect ratio to prevent CLS.
- Do not preload all five fixture images in production.
- Lazy-load below-the-fold Featured Works, Galleries, and Journal images using the project's standard image strategy.
- Do not generate oversized derivatives without a measured need.
- Verify that responsive derivatives preserve color and detail.
- Use descriptive localized alt text based on approved facts.
- Keep fixture filenames and fixture IDs out of public metadata and JSON-LD.
- Preserve localized canonical metadata and language alternates.
- No schema markup should describe fixture works, galleries, or journal entries as real published content.

---

## 14. Implementation contract

Before implementation:

1. Read root `AGENTS.md`, `specification/README.md`, the mandatory design documents, the specialized homepage/gallery/journal contracts, and the testing/asset/content contracts listed above.
2. Inspect current homepage JSX, shared layout, locale provider, navigation, content model, data validators, CSS tokens, image pipeline, test setup, and CI workflow.
3. Inspect all six supplied images; record dimensions/orientation/visual suitability. Do not assume `artwork.JPG` is approved solely because this document designates it as the candidate.
4. Reconcile the current `home-intro` implementation with this specification. Do not keep the existing one-link hero if it conflicts with the two-destination CTA hierarchy.
5. Implement one hero component/section only. Do not create duplicate hero or Featured Works sections.
6. Use canonical content records and stable editorial ordering. Fixture records belong in a test/development fixture module, isolated from production content.
7. Ensure the public homepage omits empty Featured Works, Featured Galleries, and Journal sections.
8. Keep Persian and English content parity; proposed Persian UI labels require editorial review before publication.
9. Update relevant component/page tests and Playwright scenarios. Do not weaken existing tests or acceptance criteria.
10. Capture and inspect screenshots for both locales and every required viewport before marking the work visually verified.

No unrelated route, content model, navigation, or global theme redesign is authorized by this specification.

---

## 15. Complete test scenarios and acceptance matrix

### 15.1 Test fixture setup

Create isolated fixture data for tests:
- One approved/published hero artwork referencing the hero asset fixture.
- Five sample artwork records referencing `1.jpg` through `5.jpg`.
- Two published gallery fixtures with valid artwork membership and covers.
- Two published Journal fixtures with locale-approved title/summary and optional related artwork references.
- Separate negative fixtures: draft, unapproved rights, missing locale, missing image, invalid cover, empty gallery, unpublished journal, and missing hero.

Use fixture paths in a way supported by the repository's test architecture. Do not make these records part of production exports.

### 15.2 Unit/content validation scenarios

| ID | Scenario | Expected result |
|---|---|---|
| U-01 | Hero ID resolves to a published, rights-confirmed artwork with valid primary image | Hero artwork is returned |
| U-02 | Hero ID is absent | Hero artwork is undefined; identity fallback is used |
| U-03 | Hero ID points to draft artwork | Hero is not publicly rendered |
| U-04 | Hero artwork has unconfirmed rights | Hero is not publicly rendered |
| U-05 | Hero primary image is missing/invalid | No broken image; identity fallback and eligible CTAs remain |
| U-06 | Hero title is missing in active locale | Caption is omitted; no filename fallback |
| U-07 | Hero alt text is missing in active locale | Publication validation fails or image is omitted according to existing accessibility policy; never emit guessed alt |
| U-08 | One locale is approved and the other is not | Content is shown only in approved locale; locale fallback follows governance contract |
| U-09 | Featured Works selection contains duplicate IDs | Each artwork appears once |
| U-10 | Featured Works references draft/unapproved/missing artwork | Invalid item is excluded |
| U-11 | Featured Galleries references invalid cover or unpublished work | Invalid gallery is excluded |
| U-12 | Journal entry is unpublished or locale-unapproved | Entry is excluded |
| U-13 | No approved content exists for a homepage section | Public section is omitted entirely |
| U-14 | Five design fixture images are loaded in visual tests | They remain isolated from production data and structured metadata |
| U-15 | Same artwork appears in Works, gallery, and Journal context | One canonical artwork identity is reused; no duplicate record is created |
| U-16 | Sample fixture label is encountered in production build/data | Build/data validation rejects fixture leakage |

### 15.3 Component and integration scenarios

| ID | Scenario | Expected result |
|---|---|---|
| I-01 | Render English hero with approved artwork | Artist name, Oil painter, artwork, and approved copy are present |
| I-02 | Render Persian hero with approved artwork | Persian name and discipline render correctly with RTL direction |
| I-03 | English primary CTA | Label is “Explore galleries”; href is `/en/galleries` |
| I-04 | Persian primary CTA | Label is «گالری‌ها را ببینید»; href is `/fa/galleries` |
| I-05 | English secondary CTA | Label is “View selected works”; href is `/en/works` |
| I-06 | Persian secondary CTA | Label is «گزیده آثار را ببینید»; href is `/fa/works` |
| I-07 | Galleries destination has no published content | Primary CTA is omitted |
| I-08 | Works destination has no published content | Secondary CTA is omitted |
| I-09 | Both destinations have content | Both CTAs render once and point to different routes |
| I-10 | Featured Works has eligible content | Exactly one section; action is “View all works” / «مشاهده همه آثار» |
| I-11 | Featured Galleries has eligible content | Exactly one section; action is “View all galleries” / «مشاهده همه گالری‌ها» |
| I-12 | Journal has eligible entries | Exactly one Journal section; action is “View all journal entries” / «مشاهده همه یادداشت‌ها» |
| I-13 | All content collections are empty | No empty public placeholder sections are rendered |
| I-14 | Hero image fails to load | Layout remains stable; no broken-image icon or collapsed hero |
| I-15 | Hero title/intro is long | Copy wraps without overlap, clipping, or CTA collision |
| I-16 | One or both CTAs are omitted | Remaining CTA maintains the intended logical alignment and spacing |

### 15.4 Playwright end-to-end scenarios

Run in Chromium at minimum; include WebKit/Firefox if already supported by project CI.

| ID | Scenario | Expected result |
|---|---|---|
| E-01 | Navigate to `/en` with populated test fixtures | English hero and homepage sections render |
| E-02 | Navigate to `/fa` with populated test fixtures | Persian hero and homepage sections render |
| E-03 | English hero primary CTA navigation | Opens `/en/galleries` |
| E-04 | Persian hero primary CTA navigation | Opens `/fa/galleries` |
| E-05 | English hero secondary CTA navigation | Opens `/en/works` |
| E-06 | Persian hero secondary CTA navigation | Opens `/fa/works` |
| E-07 | Inspect homepage section headings in English | Each of Featured Works, Featured Galleries, Journal appears at most once |
| E-08 | Inspect homepage section headings in Persian | Each equivalent Persian section appears at most once |
| E-09 | Inspect hero CTA names | No duplicate same-name/same-href CTA in the hero |
| E-10 | Inspect Works actions | Hero secondary CTA and Featured Works CTA have distinct labels |
| E-11 | Click a Featured Works item | Opens its localized artwork detail route |
| E-12 | Click a Featured Galleries preview | Opens its localized gallery detail route |
| E-13 | Click a Journal preview | Opens its localized Journal detail route |
| E-14 | Load page without fixtures/content | No sample asset or fixture title appears in public DOM |
| E-15 | Reload in both locales | No hydration warnings, missing translations, or direction flicker |
| E-16 | Browser back from a destination | Returns to the homepage naturally |

### 15.5 Responsive visual regression matrix

Capture full-page and first-viewport screenshots for both locales at all viewports below. For each screenshot, assert no clipping, overlap, unexpected horizontal overflow, image crop, or hidden CTA.

| ID | Locale | Viewport | Required review |
|---|---|---:|---|
| V-01 | en | 1600×1000 | Desktop hierarchy, image scale, sidebar-safe content |
| V-02 | fa | 1600×1000 | RTL hierarchy, physical-left sidebar, CTA inline-end |
| V-03 | en | 1440×900 | Desktop first viewport and section spacing |
| V-04 | fa | 1440×900 | Persian wrapping and action alignment |
| V-05 | en | 1280×720 | Short-height desktop; no clipped hero |
| V-06 | fa | 1280×720 | Short-height RTL; no clipped hero |
| V-07 | en | 1024×768 | Tablet landscape transition |
| V-08 | fa | 1024×768 | RTL tablet landscape |
| V-09 | en | 768×1024 | Tablet portrait composition |
| V-10 | fa | 768×1024 | RTL tablet portrait composition |
| V-11 | en | 430×932 | Large mobile, full artwork, stacked CTAs |
| V-12 | fa | 430×932 | Persian mobile title and CTA wrapping |
| V-13 | en | 390×844 | Standard mobile |
| V-14 | fa | 390×844 | Standard RTL mobile |
| V-15 | en | 360×800 | Small mobile, no horizontal overflow |
| V-16 | fa | 360×800 | Small RTL mobile, no clipped Persian glyphs |

Visual acceptance:
- Hero painting is fully visible and not distorted.
- Hero content and CTA group have consistent logical alignment.
- English CTA group aligns right (inline-end); Persian CTA group aligns left (inline-end).
- Persian heading and copy are RTL and use a Persian-capable font.
- The physical-left desktop sidebar remains on the left in both locales.
- No section is duplicated.
- Fixture sample images appear only in fixture-enabled visual runs.
- Below-fold images do not delay hero rendering.
- No horizontal scrolling at 360px.

### 15.6 Accessibility and interaction scenarios

| ID | Scenario | Expected result |
|---|---|---|
| A-01 | Keyboard Tab from page start | Focus order follows navigation, hero content, primary then secondary CTA, then page sections |
| A-02 | Keyboard activate primary CTA | Navigates to localized Galleries route |
| A-03 | Keyboard activate secondary CTA | Navigates to localized Works route |
| A-04 | Focus each CTA | Visible, high-contrast focus indicator |
| A-05 | Screen-reader inspect hero | One labelled hero section, one H1, meaningful artwork alt |
| A-06 | Screen-reader inspect actions | Distinct localized names and destinations |
| A-07 | 200% zoom | No loss of content or horizontal scrolling |
| A-08 | Reduced-motion enabled | No required content is delayed; painting and CTAs remain available |
| A-09 | Touch test at 390px | CTA targets are comfortably tappable |
| A-10 | RTL keyboard review | Focus order remains logical; no physical-direction assumptions |

### 15.7 Performance and build scenarios

| ID | Scenario | Expected result |
|---|---|---|
| P-01 | Measure hero image loading | Hero image is prioritized and responsive |
| P-02 | Inspect layout shift | Image dimensions reserve space; no material CLS from hero |
| P-03 | Inspect below-fold image requests | Only visible/near-visible images load eagerly |
| P-04 | Production build | Fixture data is excluded from production output |
| P-05 | Inspect sitemap and JSON-LD | No sample work/gallery/Journal entities are exposed |
| P-06 | Inspect browser console/network | No image 404, hydration error, or missing asset |
| P-07 | Run lint/typecheck/unit/component/Playwright/build | All required project checks pass without weakening existing checks |

### 15.8 Release acceptance gate

Do not mark the hero/homepage design complete until:

- [ ] Asset inspection for `artwork.JPG` and all five sample images is recorded.
- [ ] Owner/artist confirms hero artwork public-use approval and localized visible-content alt text.
- [ ] Persian CTA wording is reviewed and approved.
- [ ] Both CTAs have distinct purpose, localized destination, and meaningful target content.
- [ ] Empty public sections are omitted.
- [ ] Fixture data cannot leak into production.
- [ ] Exactly one hero and at most one of each homepage section render.
- [ ] All unit, integration, Playwright, accessibility, and responsive scenarios pass.
- [ ] Both locales have screenshot evidence for all required viewports.
- [ ] Lint, typecheck, production build, and CI pass.
- [ ] No unapproved artwork metadata or editorial content has been introduced.

---

## 16. Open approvals and decisions

The following remain owner/artist gates, not implementation assumptions:

1. Confirm that `specification/assets/artwork.JPG` is the intended public hero painting and approve its use.
2. Approve the English and Persian CTA wording, especially «گالری‌ها را ببینید» and «گزیده آثار را ببینید».
3. Approve localized hero alt text based on the actual visible content of the painting.
4. Approve any artist-written introductory sentence; otherwise omit it.
5. Confirm whether the supplied gallery images 1–5 are approved for public display or are reference-only. Until confirmed, they remain design/test fixtures.
6. Approve any real Featured Works, Galleries, or Journal records before publication.

## 17. Final design intent

The hero should feel like entering a quiet, carefully curated gallery: one real painting given room to speak, the artist's identity presented with clarity, and two purposeful invitations into the collection. English and Persian share the same visual identity while respecting their own reading direction. The rest of the homepage extends that experience through selected paintings, curated galleries, and a restrained Journal—only when real, approved content is available.
