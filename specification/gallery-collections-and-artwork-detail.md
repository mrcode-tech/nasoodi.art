# Nasoodi.art — Gallery Collections and Artwork Detail Specification

**Status:** Proposed product and implementation contract  
**Scope:** Multiple curated galleries, gallery discovery/index, gallery detail pages, artwork membership, and artwork presentation  
**Locales:** Persian (`fa`) and English (`en`)  
**Related documents:** `content-model.md`, `artwork-imaging-and-asset-pipeline.md`, `wireframes.md`, `site-wide-design-system-and-section-specification.md`, `seo-and-discovery.md`, `localization-and-editorial-governance.md`, `testing-qa-and-release.md`

## 1. Product intent

Nasoodi.art must support **multiple independent art galleries/collections**, not just one undifferentiated Works grid. Each gallery is a curated group of paintings with:

- A distinct title in Persian and English.
- A short, artist-approved description in each available locale.
- A cover image chosen from an approved artwork.
- A curated set of artwork entries.
- Its own shareable page and stable URL.
- A deliberate order in which the gallery and its artworks appear.

The visitor discovers galleries from the Works/Galleries area and from selected gallery previews on the homepage. Selecting a gallery title, cover, or clearly labelled “Explore gallery” link opens that gallery's dedicated page. The dedicated page presents the collection and its paintings.

A gallery is an editorial/curatorial collection. It is not automatically the same thing as an artist-defined series, an exhibition, a sales catalogue, or a physical gallery venue. Keep those concepts distinct in the content model.

## 2. Terminology and content hierarchy

Use these terms consistently:

- **Artwork:** one individual painting/work, with its own stable identity, images, metadata, and optional detail page.
- **Gallery:** a curated collection of artworks, with its own title, short description, cover, order, and detail page.
- **Series:** a body of work the artist identifies as a series. A series may be represented as a gallery, but the concepts should not be conflated in data.
- **Featured artwork:** an artwork selected for prominent display on the homepage.
- **Featured gallery:** a gallery selected for the homepage gallery preview.

A gallery can contain many artworks. An artwork may belong to more than one gallery if the artist approves the cross-listing. Do not duplicate the artwork record or image files to achieve this. A gallery's order of artwork membership is independent of the global Works order.

## 3. Information architecture and routes

Provide these visitor-facing destinations, aligned to the repository's existing locale-routing convention:

- Works / Galleries index: localized route equivalent to `/[locale]/galleries` (or the existing Works route if one already exists).
- Gallery detail: localized route equivalent to `/[locale]/galleries/[gallery-slug]`.
- Artwork detail: localized route equivalent to `/[locale]/works/[artwork-slug]`.

These route patterns are conceptual. Inspect the current App Router and existing route conventions before implementation; do not create duplicate or conflicting route trees. If the current product already uses `/works` for the collection index, keep that public convention and use gallery subroutes or an equivalent stable route design.

Requirements:
- Every published gallery has a stable, locale-independent slug/identity and localized route content.
- Gallery titles and descriptions are localized content, not URL identifiers.
- Gallery detail pages link back to the gallery index and link each artwork to its artwork detail page when such a page is published.
- Direct navigation, refresh, browser back/forward, and shared URLs must work.
- Unknown or unpublished gallery slugs return a proper not-found response.
- Locale switching preserves the equivalent gallery/artwork route when the translation exists; otherwise use the documented locale fallback.
- Do not expose draft or artist-review content through public routes, metadata, sitemap, or client-side payloads.

## 4. Gallery index page

### 4.1 Page purpose and hierarchy

The index should introduce the artist's bodies of work and let visitors choose a collection. It is not simply an artwork grid with headings.

Recommended hierarchy:

1. Global shell/navigation.
2. Page title: “Galleries” or the artist-approved equivalent.
3. Optional short, approved introductory sentence.
4. Curated gallery collection grid/list.
5. Optional selected artworks preview only if it supports discovery and does not duplicate the homepage section unnecessarily.
6. Footer.

Do not show empty headings, fake counts, or placeholder galleries. If only one gallery is approved, it may still have its own detail page; the index can present that collection without inventing additional groups. If no gallery is approved, keep the navigation entry hidden or provide the approved Works index fallback.

### 4.2 Gallery card design

Each gallery card should contain:

- One cover image from an artwork that belongs to that gallery.
- Gallery title.
- A short description, ideally one to three concise sentences; the visual layout should support a short teaser without truncating essential meaning.
- Optional artwork count only when the count reflects published, approved artworks and is useful.
- A clear “Explore gallery” link/action.

Interaction:
- The cover image and title should link to the same gallery detail destination.
- Provide one coherent accessible link target; avoid nested links.
- Hover/focus states are restrained: subtle underline, border, or small opacity/transform feedback. Never recolor or crop the artwork as a decorative hover effect.
- The entire card may be clickable only if its accessible name and focus behavior remain clear.
- Do not use autoplay carousels for gallery cards.

Image treatment:
- Use the selected cover's native aspect ratio or a consistent editorial frame that contains the full painting.
- If a crop is used for the gallery index, it must be an approved derivative/crop and must not hide essential artwork content or the signature.
- The gallery detail page must show the full approved artwork image, not only the cropped cover.
- Use appropriate responsive image sizes and reserve layout dimensions to prevent layout shift.

### 4.3 Layout

Desktop:
- Use an editorial grid with enough width for paintings and descriptions to breathe.
- Two or three columns may be appropriate depending on the actual artwork ratios and page width.
- Avoid forcing all gallery covers into identical portrait cards if the paintings are landscape or square.
- Keep title and description visually connected to the cover.

Tablet:
- Reduce the number of columns before reducing image size and caption legibility.
- Preserve deliberate order and comfortable spacing.

Mobile:
- Default to a single-column list of generous gallery cards.
- A two-column arrangement is allowed only when cover images remain legible and descriptions do not become cramped.
- Keep card links and text readable with comfortable touch targets.
- Do not turn descriptions into tiny overlays on the paintings.

## 5. Gallery detail page

### 5.1 Purpose and hierarchy

A gallery detail page should feel like entering a distinct curated room in the artist's portfolio.

Recommended hierarchy:

1. Global shell.
2. Breadcrumb/back link to Galleries.
3. Gallery title.
4. Short gallery description.
5. Optional cover/introductory artwork treatment, if it adds value and does not repeat the first item awkwardly.
6. Curated artwork collection.
7. Optional next/previous gallery links or related galleries, only when meaningful.
8. Footer.

The title and short description must be visible as page content, not embedded only in an image. The first artwork should appear promptly without requiring a long scroll.

### 5.2 Artwork collection layout

- Preserve the exact curated order configured for this gallery.
- Use an editorial responsive grid or a deliberate mixed-span composition.
- Preserve each artwork's aspect ratio. Do not force all paintings into a fixed crop.
- Use CSS grid and explicit layout rules where possible; avoid unstable JavaScript masonry.
- Keep each caption adjacent to its image and associated in DOM/reading order.
- Each artwork links to its own detail page if published. If no detail page exists, use a direct image viewer only when an accessible viewer is implemented.
- Do not mix unrelated works merely to fill a row.
- Do not repeat the same artwork twice in one gallery unless the second item is explicitly a labelled detail image and the content model supports that role.
- Do not show unpublished or unapproved works.
- Optional pagination or “load more” is only justified for genuinely large collections; initial small galleries should display all curated works.

### 5.3 Artwork card content

Show only approved available fields:
- Artwork title.
- Year, if confirmed.
- Medium, if confirmed.
- Dimensions, if useful and confirmed.

Keep captions concise. The image remains primary. Do not add invented narrative descriptions or sales language. Do not show price, availability, or purchase controls unless a separate approved commerce/enquiry decision exists.

### 5.4 Empty, unavailable, and error states

- A published gallery must contain at least one publishable artwork.
- A gallery that loses all publishable artwork must be unpublished or redirected according to an explicit editorial decision; do not display an empty gallery page.
- If an image fails to load, show a neutral fallback preserving layout and a useful retry/error treatment where feasible.
- If a gallery is not found, show the site's localized not-found page with a route back to Galleries.
- Do not show technical filenames, internal IDs, or rights-review notes to visitors.

## 6. Artwork detail page

Artwork detail pages provide a focused presentation of an individual painting, whether reached from a gallery, the homepage, or Works.

Recommended hierarchy:
1. Back link/breadcrumb to the referring gallery when navigated from a gallery; otherwise back to Works.
2. Large full artwork image.
3. Artwork title and verified metadata.
4. Artist-approved short description/context, if provided.
5. Optional approved detail photographs, each clearly labelled as a detail view.
6. Previous/next artwork navigation within the current gallery context where possible.
7. Related gallery links if the artwork belongs to multiple galleries.
8. Contact/enquiry action only if approved and operational.
9. Footer.

Requirements:
- The full painting is the primary image; never substitute the gallery-card crop.
- Preserve image fidelity, color, texture, ratio, and orientation.
- Zoom/lightbox is optional; if used, follow the accessible lightbox contract in `wireframes.md`.
- If an artwork belongs to multiple galleries, show relevant gallery links without duplicating the painting.
- Previous/next navigation should respect the current gallery order when the visitor arrived from a gallery. If the user arrived directly, use a predictable global Works order or omit the controls.
- Browser back should return to the previous page naturally; do not require custom history state to use the site.
- Do not invent titles, years, medium, dimensions, series, or interpretive text.

## 7. Gallery data contract

Suggested conceptual TypeScript shape:

```ts
type LocalizedText = {
  fa?: string;
  en?: string;
};

type GalleryStatus =
  | "draft"
  | "needs-artist-review"
  | "approved"
  | "published"
  | "archived";

type Gallery = {
  id: string;                 // stable internal identity
  slug: string;               // stable URL slug, locale-independent
  title: LocalizedText;
  description: LocalizedText;
  coverArtworkId: string;
  artworkIds: string[];       // curated order; no duplicates
  sortOrder: number;
  featuredOnHome?: boolean;
  status: GalleryStatus;
  seo?: {
    title?: LocalizedText;
    description?: LocalizedText;
  };
};
```

The exact field names may adapt to the existing repository data architecture. Preserve the semantics and validation rules.

Artwork relationship:
- Prefer a normalized artwork record with gallery membership represented by gallery `artworkIds` or an equivalent join/relationship structure.
- If the repository's existing model uses `galleryIds` on Artwork, ensure both sides cannot silently diverge; ideally define one source of truth for membership.
- Keep membership order inside the Gallery record.
- A cover artwork must be a member of its gallery.
- A published gallery cannot reference missing, draft, archived, or rights-unapproved artwork.

Do not duplicate full artwork objects inside each gallery.

## 8. Validation and publishing rules

A gallery can be published only when all of the following are true:

- Stable unique `id` and `slug`.
- Approved localized title for every locale in which the gallery is exposed.
- Approved short description for every locale in which the gallery is exposed.
- One valid cover artwork belonging to the gallery.
- At least one published artwork.
- All artwork references resolve to unique valid records.
- Every referenced artwork has a publishable primary image, confirmed usage rights, required alt text, and artist approval.
- The curated order contains no duplicate artwork IDs.
- SEO title/description are valid if supplied; otherwise derive only from approved visible content without fabricating facts.
- Gallery is marked `published`.

An artwork can appear in more than one gallery, but each membership and each gallery cover must be approved. Removing an artwork from a gallery must not delete the artwork record or its source asset.

## 9. Gallery and artwork editorial workflow

1. Artist/site owner defines the gallery's intent and approves its title.
2. Artist supplies or approves the short description in Persian and English.
3. Editor selects a cover from the gallery's approved artwork.
4. Editor assigns artworks and curates their order.
5. Validate source files, rights, image quality, metadata, alt text, and translations.
6. Preview the gallery index card and detail page at all breakpoints and locales.
7. Artist reviews the gallery title, description, cover, order, and image presentation.
8. Publish only after all required approvals are recorded.

A folder containing image files is not itself proof that they are separate galleries, nor does it establish titles, descriptions, rights, or publication approval.

## 10. SEO and sharing

For each published gallery:
- Provide a unique localized document title and meta description.
- Use a canonical URL for the locale-specific gallery page.
- Emit locale alternates only when a genuine translated page exists.
- Include the gallery page in the sitemap only while published and non-empty.
- Provide Open Graph/Twitter-compatible share metadata using the approved cover image.
- Use semantic page headings and descriptive internal links.
- Link from the gallery index and relevant homepage preview.
- Do not create thin pages for empty/draft galleries.
- Do not stuff gallery descriptions with search keywords.

For artwork detail pages:
- Use unique metadata based on approved title and available factual details.
- Use the full artwork image or approved share derivative.
- Do not publish internal rights, asset paths, or private notes in metadata.

## 11. Accessibility

- Use semantic headings, landmarks, lists, figures, captions, and links.
- Every gallery card link must have a clear accessible name.
- Artwork alt text describes visible content accurately and does not repeat the caption verbatim unless needed.
- Captions and image descriptions must remain available when images load slowly or fail.
- Maintain keyboard reading order consistent with the visual order.
- Provide visible focus indicators.
- Do not rely on hover to reveal gallery title or description.
- Avoid text overlays on busy paintings unless contrast and readability are guaranteed.
- Test Persian RTL and English LTR with keyboard and screen reader.
- Maintain WCAG 2.2 AA contrast and touch target expectations.

## 12. Performance and image delivery

- Treat original files in `specification/assets` as design/source references, not necessarily production delivery paths.
- Inspect source dimensions, orientation, color profile, file size, and rights before processing.
- Generate responsive derivatives from approved masters; never repeatedly recompress a derivative.
- Use intrinsic width/height or aspect ratio to prevent layout shift.
- Lazy-load below-the-fold gallery images.
- Prioritize the hero/first visible artwork only; avoid eagerly loading every gallery image.
- Use modern formats where the existing stack supports them, with quality settings checked against the original.
- Keep artwork pixels unfiltered and unmirrored.
- Do not load every full-resolution original into the index page.
- Test on mobile and slower connections.

## 13. Analytics and privacy

Do not add tracking merely to count gallery visits. If analytics are later approved, document purpose, data collected, retention, consent requirements, and privacy notice. Gallery browsing must work without an account or third-party service.

## 14. Test plan

Automated:
- Gallery schema validation and unique slug enforcement.
- Published-gallery gate and rights/approval gate.
- Cover artwork must be a member.
- All artwork IDs resolve; no duplicate IDs in one gallery.
- Gallery order is preserved.
- Artwork can belong to multiple galleries without duplicate records.
- Draft/archived/empty galleries are excluded from public routes, navigation, metadata, and sitemap.
- Gallery index and detail routes resolve in both locales.
- Unknown slugs return not found.
- Locale switch preserves gallery/artwork route where translated.
- Card links, breadcrumb/back link, artwork detail links, and previous/next context work.
- Image dimensions/alt text are present; missing assets have useful fallbacks.

Visual/manual:
- Desktop, tablet, mobile, short-height mobile.
- Persian RTL and English LTR.
- Light and dark themes.
- Gallery index with 1, 2, and many galleries.
- Gallery detail with short, long, portrait, landscape, and mixed-aspect-ratio artwork sets.
- Long gallery scroll and image loading.
- Keyboard and screen-reader flow.
- Reduced-motion mode.
- Image fidelity compared to approved masters.

## 15. Acceptance criteria

- The site supports multiple independently published galleries.
- Each gallery has its own approved title, short description, cover, curated artwork list, and dedicated page.
- Visitors can enter a gallery from its card/title and see that gallery's artworks on a separate route.
- Gallery ordering and artwork ordering are deterministic and artist-controlled.
- Artworks can be reused across galleries without duplicate records.
- Each artwork retains a dedicated detail presentation when published.
- No invented titles, descriptions, metadata, or rights claims are displayed.
- Persian and English pages are complete and directionally correct.
- Responsive layout preserves artwork proportions and readable captions.
- SEO, accessibility, image performance, automated tests, and visual QA pass.
- Artist/site-owner approval is recorded before public release.

## 16. Current asset inventory to audit

The repository currently contains these candidate assets under `specification/assets`:
- `artwork.JPG`
- `gallery/1.jpg` through `gallery/5.jpg`
- `canvase.png`
- `artist.png`
- `easel.png`
- `oil-paint-brush.png`

The filenames and presence of these files do not establish their visual contents, intended gallery membership, public-use rights, titles, or descriptions. Before implementation, inspect each image and create an asset manifest with dimensions, orientation, color profile, file size, intended role, source, rights/approval status, and proposed content mapping. Treat `gallery/1.jpg`–`5.jpg` as candidate artwork images only until the artist confirms their identity and groupings.

## Design-engineering refinement

Gallery and artwork surfaces must follow design-engineering-skills.md and design-direction-and-system-refinement.md.

- The gallery index should feel like an edited exhibition program, with distinct collection identities and varied composition—not a uniform e-commerce product grid.
- Artwork imagery must remain uncropped by default and retain its native aspect ratio. Use a varied editorial layout when the source dimensions demand it.
- Gallery detail pages should prioritize the paintings; title and approved description introduce the collection but must not dominate it.
- Artwork detail pages should provide generous image scale, minimal distractions, and known metadata only.
- Do not add automatic carousels, hover-only artwork details, animated zoom, or motion on the artwork itself.
- Filters, if required by catalogue size, must be immediate, accessible, and visually quiet.
- Review sparse galleries, a single artwork, mixed aspect ratios, long Persian/English gallery names, and mobile reading order.
