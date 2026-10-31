# Nasoodi.art — Selected Works: Three-Level Experience Specification

**Status:** Proposed implementation-ready design contract; requires artist/site-owner content and visual approval before publication  
**Scope:** Homepage artwork preview and viewer, Works/collection discovery index, individual collection pages, shared artwork viewer, route/history behavior, responsive wireframes, component contracts, content relationships, accessibility, SEO, performance, and acceptance tests  
**Locales:** Persian (`fa`, RTL) and English (`en`, LTR)  
**Design authorities:** `design-engineering-skills.md`, `design-direction-and-system-refinement.md`, `visual-identity-and-photo-direction.md`, `site-wide-design-system-and-section-specification.md`, `shadcn-component-reuse-and-bilingual-ui.md`  
**Related specifications:** `homepage-artwork-hero-and-featured-works.md`, `gallery-collections-and-artwork-detail.md`, `wireframes.md`, `content-model.md`, `artwork-imaging-and-asset-pipeline.md`, `seo-and-discovery.md`, `accessibility-performance-security.md`, `testing-qa-and-release.md`

---

## 1. Executive design decision

Implement a connected, three-level artwork discovery experience:

1. **Homepage — Selected Works:** a small, curated set of individual artworks. Selecting an artwork opens an immersive popup/viewer containing the image, title, description, and approved metadata. The homepage also provides an explicit Explore Works/Explore Collections action.
2. **Works index — collection discovery:** a dedicated page presenting the artist's approved collections as editorial previews. Visitors understand each collection's identity and choose one to explore.
3. **Collection detail — complete collection gallery:** a dedicated page for one collection, showing its approved introduction and all published artworks in the curated order. Selecting any artwork opens the same reusable artwork viewer, with navigation constrained to that collection.

**Core principle:** the homepage introduces individual works; the Works index introduces collections; a collection page presents the complete body of work. The three levels must not collapse into one endless grid or duplicate each other's purpose.

**Viewer principle:** one reusable Artwork Viewer serves both homepage and collection contexts. Its artwork sequence is supplied by the originating context, so Next/Previous on a collection page never unexpectedly jumps to another collection.

The experience should feel like entering an artist's exhibition, not browsing a product catalogue or dashboard.

## 2. Goals and non-goals

### Goals

- Make individual selected paintings immediately explorable from the homepage.
- Display artwork title and artist-approved description in the viewer, adjacent to or directly below the image.
- Provide a clear route from the homepage to all collections.
- Give every collection a distinct preview and a dedicated page.
- Present every approved artwork in the selected collection, in editorial order.
- Reuse one viewer, artwork data model, image pipeline, and interaction contract.
- Preserve browser history, direct links, scroll position, locale, and gallery context.
- Preserve original artwork color, texture, orientation, signature, and aspect ratio.
- Support Persian RTL and English LTR with the same visual identity.
- Reuse existing shadcn/Radix primitives and the project's existing route and component conventions.

### Non-goals

- E-commerce, prices, availability, purchasing, or commission flows.
- Inventing collection names, artwork titles, descriptions, dates, dimensions, medium, themes, or artwork groupings.
- Treating the supplied studio/process photograph or transparent studio props as finished paintings.
- Automatic/auto-rotating carousels, scroll hijacking, forced cropping, animated artwork, or decorative motion on paintings.
- Building a new CMS or adding a component library solely for this experience.
- Publishing candidate sample images before rights, identity, metadata, and artist approval are confirmed.

## 3. Information architecture and terminology

Use the following conceptual hierarchy consistently:

- **Artwork:** one canonical painting record with stable identity, approved images, localized title/alt text, optional description and factual metadata, rights, and publication state.
- **Collection:** a curated editorial group of artwork records with its own stable slug, localized title/description, cover artwork, ordered membership, and publication state.
- **Homepage selected artwork:** an artwork explicitly selected for the homepage; it remains the same canonical artwork record.
- **Collection preview:** a visual and editorial summary of a collection on the Works index or homepage.
- **Artwork viewer:** a reusable modal/overlay presentation of one artwork, with contextual previous/next navigation.
- **Artwork detail route:** the canonical, independently addressable page for an artwork. It is the fallback for direct navigation, refresh, shared links, and cases where a modal route cannot be intercepted.

Do not assume that a collection is an artist-defined series or a physical exhibition. The artist/site owner must approve the collection's meaning, name, description, cover, and membership.

## 4. Three-level experience contract

### 4.1 Level 1 — Homepage: Selected Works

**Purpose:** create interest and introduce a representative selection, not display the entire archive.

Content:
- Section heading: use the approved homepage label, normally “Selected Works”.
- Optional short artist-approved introductory sentence.
- A curated selection, normally 4–6 artworks when enough approved works exist. The count is a design target, not a requirement to invent or duplicate content.
- A clear “Explore Works” or “Explore Collections” link to the collection index. Final localized copy is subject to editorial approval.
- Artwork captions with title and only verified optional metadata such as year.

Composition:
- Editorial/asymmetric grid with deliberate variation in image scale and placement.
- Preserve every artwork's native ratio and full composition.
- Do not force identical card geometry or crop artwork to fit a grid.
- Keep generous whitespace and restrained captions.
- On mobile, use a deliberate one-column sequence by default; a two-column layout is allowed only when images and captions remain legible.
- Do not hide essential titles/descriptions behind hover.

Artwork-card interaction:
- The entire artwork image/card is a single accessible activation target.
- Hover on pointer devices may reveal a restrained title/indicator, but title and action must remain available without hover.
- Keyboard focus must clearly identify the card.
- Selecting the card opens the Artwork Viewer at that artwork without losing the homepage context.
- The viewer's initial index is the selected artwork's position in the homepage selected-artwork sequence. Previous/Next traverses that sequence only.
- If only one selected artwork exists, omit or disable navigation consistently; do not imply more items exist.
- Closing the viewer returns focus to the invoking card and restores the exact homepage scroll position.

Do not add a second homepage collection grid that duplicates the Works index. A separate Featured Collections preview may appear only if the homepage composition specification explicitly includes it and it serves a different editorial purpose from the Selected Works section.

### 4.2 Level 1 — Artwork Viewer popup

**Required content:** the selected artwork image, title, and artist-approved description. Title and description must be visible as normal accessible page content, not baked into the image.

Desktop and wide tablet:
- Use a large custom Dialog composition.
- Preferred layout: artwork image occupies approximately 60–70% of the available viewer width; an information column occupies approximately 30–40%.
- Center the image in its available region and use `object-fit: contain`; never crop the full artwork to fill the viewer.
- Place previous/next controls at the outer edges of the image region or in a compact navigation row. Controls must not obscure important painted content.
- Place close control in a predictable top corner and an artwork position indicator (for example, “3 of 6”) in the top information area.
- Information column order: title; verified year/medium/dimensions when present; description; optional collection label/link when relevant.
- Description should have a readable line length and independent vertical scrolling only if it exceeds the available height. Avoid making the entire viewer content scroll when the artwork and short description fit.
- The artwork remains the focal point; controls and metadata are visually quiet.

Mobile:
- Use a near/full-screen viewer with safe-area-aware padding.
- Place close control at the top.
- Show the full artwork first, constrained by available viewport height and using contain.
- Show title immediately below the image; do not require scrolling to discover the title.
- Show verified metadata and description below the title.
- Place Previous/Next in a comfortable bottom row or at the sides only if they do not overlap the painting or conflict with touch gestures.
- The description may continue below the fold; the viewer content must scroll naturally.
- Swipe navigation may be supported as a convenience, but visible Previous/Next buttons remain available.
- Avoid a nested Sheet/Drawer for the description. On mobile the description is simply part of the viewer content.

Artwork navigation:
- Previous/Next updates image, title, description, metadata, alt text, position indicator, and URL state together.
- The Dialog stays open during navigation.
- No full-page reload.
- Do not auto-advance.
- Define boundary behavior: default is non-looping; Previous is unavailable at the first item and Next at the last item. If looping is later approved, it must be explicit and tested.
- Escape and close dismiss the viewer, restore focus to the trigger, and return to the originating context.
- Browser Back closes the viewer when it was opened as a route-aware modal; Browser Forward reopens it.
- Direct artwork URLs render a complete artwork detail page, not an empty modal without a background context.

Description rules:
- Display only artist-approved description in the active locale.
- If no description exists, omit the description block; do not invent placeholder copy.
- If title is unavailable for the active locale, follow the content publication policy; do not silently machine-translate or expose an internal slug as a title.
- Metadata fields are optional and omitted when unknown.
- Keep the description visually associated with the image using semantic figure/figcaption or a labelled information region.

### 4.3 Level 2 — Works index / collection discovery

**Purpose:** introduce the artist's distinct collections and let visitors choose a collection. This is not an all-artworks grid.

Page hierarchy:
1. Shared site shell.
2. Breadcrumb or page context when appropriate.
3. Page heading, preferably “Works” as the navigation label and “Collections” as the editorial heading where approved.
4. A concise artist-approved introduction, optional.
5. Editorial collection preview grid/list.
6. Shared site footer.

Each collection preview includes:
- One representative cover artwork belonging to that collection.
- Collection title.
- Short artist-approved description (normally one to three sentences).
- Optional artwork count only when derived from the currently published, approved membership.
- Optional year range only when all dates are confirmed and the range is meaningful.
- A clear “Explore collection” action/link.

Collection preview design:
- Primary recommendation: asymmetric editorial composition with varied image scale and whitespace.
- A uniform two/three-column grid is acceptable when the actual collection count and image ratios make it clearer.
- A full-width alternating row layout is an alternative for a small number of major collections; do not mix layout patterns without a clear rhythm.
- A featured collection may receive a larger cover image, but its title and description remain visible outside the image.
- Do not use generic icon cards, e-commerce product cards, heavy shadows, or text overlays on busy paintings.
- A card can be one coherent link target; avoid nested links. The cover, title, and CTA should lead to the same collection route.
- Hover/focus feedback should be subtle (underline, small opacity change, or restrained transform on the container only); never recolor, crop, filter, or animate the artwork itself.
- Do not use autoplay collection carousels.

Responsive behavior:
- Desktop: two or three editorial columns depending on image ratio and content width; varied spans are permitted when the visual and DOM order stay consistent.
- Tablet: reduce columns before making images or captions too small; maintain curated reading order.
- Mobile: one generous collection preview per row by default. Two columns are allowed only when the images and descriptions remain readable.
- Short-height viewports: avoid large fixed-height covers; let content flow naturally.

If no approved/published collection exists:
- Do not show placeholder collections or fake counts.
- Keep the index hidden/noindex or show only the explicitly approved empty-state copy and navigation treatment.
- Do not infer collections from asset folders or filenames.

### 4.4 Level 3 — Collection detail page

**Purpose:** present the full approved body of work belonging to one collection.

Page hierarchy:
1. Shared site shell.
2. Breadcrumb/back link to Works/Collections index.
3. Collection title.
4. Artist-approved description.
5. Optional verified year range and published artwork count.
6. Optional featured/introductory artwork only when it adds meaning and does not awkwardly repeat the first grid item.
7. Complete artwork gallery in curated order.
8. Previous/next collection links or a related-collections section only when useful and approved.
9. Footer.

Collection introduction:
- The title and description are real text, not part of an image.
- Keep the intro concise and visually subordinate to the paintings.
- Avoid a very tall hero that pushes the gallery far below the fold.
- If a cover/featured image is used, show the full composition or an approved cover derivative. Do not use an arbitrary crop.
- Do not show internal IDs, file names, approval states, or rights notes.

Collection artwork gallery:
- Include every published, approved artwork assigned to the collection, in its explicit curated order.
- Preserve original aspect ratio and artwork fidelity.
- Use CSS Grid with controlled editorial spans and natural image proportions; avoid unstable JavaScript masonry.
- Keep captions adjacent to their images in visual and DOM order.
- Show artwork title and only verified optional metadata.
- A collection with one artwork is valid if the collection itself is approved; do not invent filler.
- For small/medium collections, show all artworks without pagination. Pagination/load-more is only justified after measuring a genuinely large collection and defining accessible behavior.
- Selecting an artwork opens the shared viewer.
- The viewer's sequence is the collection's ordered published artwork list, not the homepage selection or global catalogue.
- Viewer close returns to the exact artwork card and scroll position.
- Previous/Next collection links appear at the bottom only when a real adjacent published collection exists; include a return-to-all-collections link.
- Do not repeat one artwork in the same collection unless the content model explicitly supports and labels a separate detail view.

### 4.5 Artwork detail route fallback

Every published artwork should remain independently addressable through the canonical artwork detail route defined by the existing application. The route must render a complete page containing:
- Back link/breadcrumb to the originating collection when a valid context is available, otherwise Works.
- Full artwork image.
- Title and approved description.
- Verified metadata.
- Previous/Next within the collection when entered with collection context; otherwise use a documented global order or omit navigation.
- Related collection links only when the artwork has approved memberships.

The modal is an enhancement to this real resource, not a substitute for it.

## 5. Route and browser-history contract

The repository already distinguishes artwork detail routes and curated gallery index/detail routes. Preserve the existing App Router conventions and avoid a route collision between a collection slug and an artwork slug.

Current documented route concepts:
- Localized collection index: `/[locale]/galleries`.
- Localized collection detail: `/[locale]/galleries/[gallerySlug]`.
- Localized artwork detail: `/[locale]/works/[artworkSlug]`.

The visitor-facing navigation label may be “Works” or “Explore Works” while the existing canonical collection routes remain under `/galleries`. Do not silently repurpose `/[locale]/works/[slug]`, because it is already documented as an artwork-detail route. If the owner later explicitly chooses a public `/works` collection URL, make that a deliberate route migration: define canonical collection and artwork paths, preserve redirects/aliases, update sitemap/canonicals/internal links, and add route regression tests before implementation.

Modal URL behavior:
- Prefer the project's existing Next.js route-aware modal/intercepting-route pattern if present and compatible.
- Otherwise use a stable query/state URL contract that can be parsed on direct load and refresh.
- The artwork detail route remains the canonical fallback and canonical SEO resource.
- Opening a viewer from a collection must preserve the originating collection context in navigation state.
- Opening from homepage uses the homepage selected-artwork sequence.
- Browser Back closes the viewer only when opening it created a history entry; it must not unexpectedly leave the site.
- Browser Forward reopens the same artwork state.
- Directly opening or refreshing an artwork URL must render meaningful page content without relying on client-only state.
- Close must restore the correct focus target and scroll position when the originating page is still mounted.
- Locale switching should preserve the equivalent collection/artwork route only when approved localized content exists; otherwise follow the established locale fallback.

Before implementation, inspect the actual `src/app` route tree and current navigation links. Document the verified route mapping in the implementation PR/phase evidence. Do not create duplicate route trees.

## 6. Design system and visual direction

Follow the existing nasoodi.art visual identity. This document does not introduce a parallel palette or typography system.

Semantic palette starting points from the approved visual identity specification:
- Paper: `#F3F0EA` — main page background.
- Paper Raised: `#FAF8F4` — restrained raised surfaces.
- Paper Muted: `#E8E2DA` — subtle section variation.
- Ink: `#302824` — primary text/headings.
- Ink Muted: `#6B5D55` — secondary text, subject to contrast verification.
- Mauve: `#837369` — restrained accent.
- Mauve Deep: `#675A51` — active/quiet emphasis.
- Taupe Light: `#C5B197` — fine accent only.
- Line: `#D8D0C7` — subtle separators.

Page surfaces:
- Homepage Selected Works: warm paper.
- Works collection index: warm paper.
- Collection detail: warm paper.
- Artwork viewer: use the same warm-paper/ink design system by default. A deeper warm-ink viewer treatment may be prototyped as an optional art-direction variant, but it is not approved as the default because the site's established direction is warm paper rather than a dark-first interface. Compare both against actual approved paintings and obtain visual approval before changing the palette.
- Artwork surroundings must remain neutral and must not apply color overlays or filters to paintings.

Composition:
- The website should read as an independent artist's editorial gallery, not a luxury-commerce storefront or generic SaaS dashboard.
- Use typography, whitespace, image scale, quiet rules, and asymmetric rhythm to create hierarchy.
- Avoid repetitive rounded cards, thick borders, large shadows, decorative gradients, glassmorphism, badges on every item, and hover-only content.
- Keep collection cards and artwork cards visually distinct: a collection preview communicates a body of work; an artwork card identifies one painting.
- Captions are quiet and close to their images.
- Do not put long text over artwork.

## 7. shadcn/ui and component architecture

Inspect `components.json`, installed Radix/shadcn dependencies, and `src/components/ui` before adding or changing primitives. Reuse existing components. Do not install another component library or duplicate an existing primitive.

Recommended component responsibilities:

| Component | Responsibility | Foundation / notes |
|---|---|---|
| `SelectedWorksSection` | Homepage section heading, editorial layout, curated artwork selection, Explore CTA | Custom composition; server component where possible |
| `ArtworkGrid` | Responsive editorial arrangement of artwork records | CSS Grid; preserve ratio and DOM order |
| `ArtworkCard` | One artwork preview and accessible activation | Semantic link/button according to route strategy |
| `CollectionIndexPage` | Collection discovery page composition | Server-rendered page |
| `CollectionGrid` | Editorial collection layout | CSS Grid; avoid equal-card requirement |
| `CollectionCard` | Cover, title, description, optional count, link | Semantic single link; no nested links |
| `CollectionHeader` | Breadcrumb, title, description, approved metadata | Semantic headings and text |
| `CollectionArtworkGallery` | Complete ordered artwork list | Reuses ArtworkCard/ArtworkGrid |
| `ArtworkViewer` | Shared modal artwork experience | Custom composition over existing Dialog |
| `ArtworkViewerImage` | Full artwork presentation | Existing image pipeline; contain; explicit dimensions |
| `ArtworkViewerInfo` | Title, metadata, description, collection context | Semantic content region |
| `ArtworkViewerControls` | Close, previous, next, counter | Existing Button; localized labels |
| `ArtworkViewerThumbnailRail` | Optional compact sequence navigation | Only if collection size and usability justify it; existing ScrollArea |
| `CollectionBreadcrumb` | Navigation hierarchy | Existing Breadcrumb if installed; otherwise semantic links |
| `CollectionNavigation` | Previous/next collection and index return | Ordinary links |
| `ArtworkLoadingState` | Loading/failure fallback | Existing Skeleton or neutral fallback |

Primitive selection:
- **Dialog:** preferred foundation for the desktop/tablet artwork viewer and full-screen mobile viewer. The artwork and description are composed inside one dialog; do not create nested dialogs.
- **Button:** previous, next, close, and optional thumbnail controls. Use localized accessible names and visible focus.
- **AspectRatio:** optional stable card geometry where a frame is needed; do not use it to crop the full artwork.
- **ScrollArea:** only for a justified thumbnail rail or long information area; native page scrolling is preferred for mobile.
- **Breadcrumb:** collection hierarchy, if the existing primitive is present.
- **Skeleton:** image loading placeholder, with reserved dimensions.
- **Sheet/Drawer:** not the primary artwork viewer. Use only for an independent secondary interaction if the existing product design requires it; do not put the title/description in a nested Sheet.
- **Carousel:** do not add a carousel dependency solely to implement two previous/next buttons. Use the existing carousel only if already installed and it provides a real, accessible benefit. A small state-driven sequence controller is sufficient for the viewer.

Do not implement an entire viewer using a default shadcn Card. The primitives provide behavior/accessibility; the custom composition provides the artistic identity.

## 8. Artwork and collection data contracts

Use existing canonical records from `content-model.md`. The following is a semantic reference, not permission to create a competing model:

```ts
type LocalizedText = {
  fa?: string;
  en?: string;
};

type Artwork = {
  id: string;
  slug: string;
  title: LocalizedText;
  description?: LocalizedText;
  alt: LocalizedText;
  image: {
    src: string;
    width: number;
    height: number;
  };
  year?: number;
  medium?: LocalizedText;
  dimensions?: {
    width: number;
    height: number;
    unit: "cm" | "in";
  };
  rightsConfirmed: boolean;
  artistApproved: boolean;
  published: boolean;
};

type Gallery = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  coverArtworkId: string;
  artworkIds: string[]; // explicit curated order
  sortOrder: number;
  status: "draft" | "needs-artist-review" | "approved" | "published" | "archived";
};

type HomepageSelection = {
  artworkIds: string[]; // explicit homepage sequence
};
```

Adapt to the existing repository schema instead of duplicating it. One artwork record may appear on the homepage and in one or more approved collections without duplicating the artwork or source image.

Validation:
- Collection cover must be a published member of that collection.
- Every collection artwork ID resolves to one unique, published, rights-cleared, artist-approved record.
- Collection membership order and homepage selection order are explicit and deterministic.
- Viewer sequence is derived from the current context and active locale's publishable records.
- Missing optional title metadata, description, year, medium, or dimensions is omitted; do not show blank labels.
- A public artwork needs a localized title and required localized alt text for the exposed locale, a valid primary image, confirmed rights, and artist approval under the existing publication contract.
- A public collection needs approved localized title/description, a valid cover, and at least one publishable artwork.
- Never infer title, description, collection identity, order, year, medium, dimensions, symbolism, or rights from a filename or image appearance.

## 9. Repository sample-image usage in wireframes

The following repository images are included as **design-reference samples** for the wireframes. They are not yet verified artwork identities, collection memberships, final covers, public-use rights, or approved content.

Candidate gallery images:
- `specification/assets/gallery/1.jpg`
- `specification/assets/gallery/2.jpg`
- `specification/assets/gallery/3.jpg`
- `specification/assets/gallery/4.jpg`
- `specification/assets/gallery/5.jpg`

Embed these relative assets in the wireframes to make the proposed compositions concrete. Preserve the original files. Do not rename, crop, edit, move, publish, or map them to real collection/artwork metadata based only on their filenames. Before implementation uses them as actual site content, inspect each image and complete `asset-review-register.md` with dimensions, orientation, file size, source/provenance, rights, artwork identity, approved title/description/alt text, and artist approval.

Other existing assets have different known/unknown roles:
- `specification/assets/artwork.JPG`: previously identified as a studio/process photograph, not a clean finished-artwork reproduction. Do not use it as an artwork card or viewer painting.
- `specification/assets/artist.png`: process/studio cutout, not a painting or conventional portrait.
- `specification/assets/easel.png` and `oil-paint-brush.png`: studio props/decorative candidates, not artwork.
- `specification/assets/canvase.png`: role remains unverified; do not classify as finished artwork without inspection and approval.

## 10. Responsive, locale, and viewport contract

Test at the project's documented breakpoints and representative widths:
- Small mobile: 320–375 px.
- Large mobile: 390–430 px.
- Tablet portrait: 768 px.
- Tablet landscape/compact laptop: 1024 px.
- Desktop: 1280–1440 px.
- Wide desktop: 1600 px and above.
- Short-height desktop and mobile landscape.

Across all viewports:
- Preserve artwork ratio and full image.
- Prevent title/description from colliding with controls.
- Avoid horizontal overflow.
- Keep navigation and touch targets usable.
- Keep image dimensions reserved to prevent layout shift.
- Ensure the artwork viewer fits short-height screens; allow content scroll rather than clipping title or close controls.
- Respect device safe areas.
- Do not use hover as the only disclosure mechanism.

Persian/English:
- Use the same page hierarchy and design identity.
- Persian uses true RTL; English uses LTR.
- Use logical properties for inline spacing and reading flow, but preserve intentional physical placement defined by the shared shell.
- Do not mirror artwork or non-directional imagery.
- Directional arrows may mirror when their meaning requires it.
- Isolate Latin URLs, artist handles, and mixed-direction metadata correctly.
- Verify long Persian/English titles, multi-line descriptions, numerals, dimensions, and punctuation.
- Do not machine-translate missing artist-approved copy.

## 11. Accessibility and interaction quality

Target WCAG 2.2 AA and the repository's accessibility specification.

Artwork Viewer:
- Use a semantic Dialog with a localized accessible title and description relationship.
- Move focus into the Dialog on open; contain focus while modal; restore focus to the invoking artwork control on close.
- Provide a visible close button with an accessible name.
- Support Escape.
- Support Left/Right Arrow navigation when the viewer is open, without intercepting keystrokes while focus is inside an editable control.
- Previous/Next buttons remain visible and keyboard reachable.
- Update accessible announcement for artwork title and position when navigation changes; avoid excessively verbose repeated announcements.
- Do not announce decorative image details twice when caption/description already supplies equivalent context.
- Prevent background scroll while modal is open without breaking page restoration.
- Ensure buttons have at least the project's target touch size (prefer approximately 44–48 CSS px).
- Ensure controls have visible focus and sufficient contrast.
- Respect `prefers-reduced-motion`; modal open/close and image changes remain understandable without motion.

Collection cards and artwork cards:
- Use semantic links/buttons, not clickable non-semantic divs.
- One clear activation target per card; no nested links.
- Accessible name identifies the collection/artwork using approved title text.
- Do not rely on color or hover alone.
- Keyboard order follows visual/DOM order.
- Images have localized descriptive alt text; purely decorative duplicate imagery uses empty alt.

## 12. Motion and visual transitions

Motion must follow `design-engineering-skills.md` and its motion decision gate.

Allowed only when it communicates state/spatial continuity:
- Short, restrained Dialog open/close opacity/transform transition.
- Subtle collection-card focus/hover feedback on the container or caption.
- Optional low-amplitude transition between viewer items if it does not delay rapid navigation or obscure image loading.

Not allowed:
- Automatic slide advance.
- Animated artwork itself.
- Zoom/pan by default.
- Scroll hijacking, perpetual motion, cursor-following, parallax, or layout-thrashing transitions.
- `transition: all`.
- Motion required to understand page hierarchy.

Use immediate feedback for keyboard navigation. Respect reduced motion with minimal or no transition.

## 13. SEO, sharing, and analytics

- Collection index and collection detail are indexable only when published and content-complete.
- Each collection has unique localized title/description, canonical URL, and approved cover image for sharing.
- Each artwork detail route is a canonical, indexable resource only when its publication contract is met.
- Modal state is not a duplicate indexable page. Canonical metadata should resolve to the artwork detail route.
- Add structured data only where supported by approved facts; do not invent artwork dates, material, dimensions, or availability.
- Use localized hreflang only when the corresponding translated resource exists.
- Include published, non-empty collections and approved artwork detail routes in the sitemap.
- Keep internal links contextual and descriptive.
- Do not add analytics/tracking for artwork views without an explicit privacy review and owner approval.

## 14. Performance and image fidelity

- Use the existing image pipeline and same-origin approved image sources.
- Reserve intrinsic dimensions or aspect ratios before loading.
- Lazy-load below-the-fold gallery imagery.
- Prioritize only the actual first visible artwork when justified; do not preload every image.
- Load an appropriate high-quality viewer source when the viewer opens.
- Preload at most the next artwork in the active sequence when the user is likely to navigate; avoid downloading the entire collection.
- Use responsive sizes and modern formats only after visual comparison with the approved master.
- Never apply CSS filters, blend modes, recoloring, mirroring, forced crop, or lossy processing that visibly alters artwork.
- Provide a neutral fallback on failure without exposing internal paths or technical details.
- Test slow connections, long collections, and image failures.

## 15. Error, empty, and edge states

Test and design:
- No approved selected artworks: omit the homepage section or show only approved editorial copy; never use placeholder paintings.
- One selected artwork: viewer has no misleading navigation.
- One published collection: collection index still works without fake related collections.
- One artwork in a collection: gallery remains intentional and complete.
- Missing optional description/metadata: omit absent fields.
- Long title or description: wrap naturally without covering the artwork or controls.
- Mixed portrait, landscape, and square images: preserve all ratios.
- Missing/broken image: stable neutral placeholder and accessible status.
- Unknown collection/artwork slug: localized not-found page and useful return link.
- Unpublished or rights-unapproved content: excluded from page, viewer sequence, metadata, sitemap, and client payload.
- Collection loses its last publishable artwork: unpublish/handle per existing publication policy; do not leave an empty public collection.
- Locale translation missing: use established locale fallback; never machine-translate.

## 16. Implementation phases and dependencies

This feature maps to the existing canonical phased implementation blueprint. It does not replace the full roadmap.

### Work package A — Audit and content readiness
- Read all mandatory design authorities and specialized specs.
- Inspect actual route tree, current Works/Galleries navigation, data records, existing Dialog/Sheet/Carousel primitives, and image pipeline.
- Inspect all five candidate gallery images and update the asset review register. Record which are visually suitable as samples, without inventing identities or grouping.
- Confirm route mapping and avoid conflict with the existing artwork detail route.
- Identify which collection and artwork content is genuinely approved; do not create sample public records from unapproved images.

### Work package B — Shared artwork viewer
- Implement one reusable, context-driven Artwork Viewer.
- Compose it with the existing Dialog and Button primitives.
- Implement title, description, metadata, image, close, counter, Previous/Next, keyboard behavior, focus management, URL/history, and loading/error states.
- Verify direct artwork detail fallback.
- Add component and browser tests.

### Work package C — Homepage Selected Works
- Implement the curated editorial artwork grid using canonical artwork IDs.
- Add artwork-card activation to the shared viewer.
- Add the Explore Works/Collections link to the canonical collection index.
- Verify scroll/focus restoration and homepage-specific viewer sequence.

### Work package D — Works collection index
- Implement the collection discovery page with editorial collection previews.
- Show cover, title, approved short description, optional valid count/year range, and one coherent link.
- Verify sparse and multi-collection layouts, locale, responsive behavior, and empty/publication states.

### Work package E — Collection detail
- Implement collection introduction and complete ordered artwork gallery.
- Reuse ArtworkGrid/ArtworkCard and the shared viewer.
- Constrain viewer navigation to the current collection.
- Add breadcrumbs, previous/next collection links where valid, and return to collection index.
- Verify direct route, refresh, browser history, and artwork context.

### Work package F — Quality gates
- Unit/component tests for publication, order, viewer sequence, and metadata.
- Browser tests for all three levels, modal history, keyboard, touch, RTL/LTR, and breakpoints.
- Visual screenshot inspection at desktop, tablet, mobile, and short-height viewports.
- Image fidelity review against approved masters.
- SEO, accessibility, performance, lint, typecheck, production build, and full CI.
- Artist/site-owner visual/content approval before publication.

## 17. Acceptance criteria

### Homepage
- [ ] Selected Works shows only the curated, approved homepage artwork selection.
- [ ] Artwork cards preserve full image proportions and show approved titles.
- [ ] Selecting an artwork opens the viewer without losing homepage context.
- [ ] Viewer visibly presents artwork image, title, approved description, and available verified metadata.
- [ ] Previous/Next follows homepage selection order and updates all artwork information.
- [ ] Close, Escape, and browser Back restore the homepage state, scroll, and focus.

### Works index
- [ ] Explore Works/Collections reaches the canonical collection index.
- [ ] The index presents collections, not an undifferentiated list of every artwork.
- [ ] Each preview contains an approved cover, title, description, and only valid optional metadata.
- [ ] Selecting a preview navigates to its dedicated collection page.
- [ ] No placeholder collection or fake count appears.

### Collection detail
- [ ] Collection title and approved description are visible as text.
- [ ] All published artworks in the collection appear in the configured order.
- [ ] Artwork ratios and full compositions are preserved.
- [ ] Artwork selection opens the same viewer used on the homepage.
- [ ] Viewer navigation remains within the current collection.
- [ ] Closing returns to the exact collection artwork card and scroll position.
- [ ] Collection breadcrumbs and valid previous/next collection links work.

### Shared quality
- [ ] Direct routes, refresh, Back/Forward, and shared URLs work.
- [ ] Persian RTL and English LTR work with the same content hierarchy.
- [ ] Desktop, tablet, mobile, and short-height viewports are visually reviewed.
- [ ] Keyboard, screen reader, touch, focus restoration, and reduced-motion behavior pass.
- [ ] Loading/error/empty states are intentional and accessible.
- [ ] SEO metadata and sitemap include only approved published resources.
- [ ] No invented artwork facts, translations, collection identities, or rights claims.
- [ ] All relevant automated tests and CI checks pass.
- [ ] Artist/site-owner approval is recorded before public release.

## 18. Decision log

| Decision | Status |
|---|---|
| Three-level homepage → collection index → collection detail structure | Recommended and requested by site owner |
| Artwork title and description visible in popup/viewer | Required |
| One shared viewer reused across homepage and collection pages | Recommended architecture |
| Viewer navigation follows originating context | Required behavior |
| Warm paper editorial visual identity remains authoritative | Existing project design authority |
| Dialog as viewer foundation; not a small Drawer | Recommended |
| Existing localized gallery routes retained unless a route migration is explicitly approved | Compatibility requirement |
| Candidate gallery images used as visual references in wireframes only | Allowed; identity/rights/approval pending |
| Collection titles, descriptions, artwork grouping, and public image mapping | Requires artist/site-owner approval |
| Dark viewer treatment | Optional visual prototype only; not default-approved |

## 19. Required reading for implementation agents

Before implementing this experience, read:
1. `AGENTS.md`.
2. `specification/README.md`.
3. `specification/design-engineering-skills.md`.
4. `specification/design-direction-and-system-refinement.md`.
5. `specification/visual-identity-and-photo-direction.md`.
6. This document.
7. `specification/wireframes.md`.
8. `specification/homepage-artwork-hero-and-featured-works.md`.
9. `specification/gallery-collections-and-artwork-detail.md`.
10. `specification/content-model.md`.
11. `specification/shadcn-component-reuse-and-bilingual-ui.md`.
12. `specification/artwork-imaging-and-asset-pipeline.md`.
13. `specification/seo-and-discovery.md`.
14. `specification/accessibility-performance-security.md`.
15. `specification/testing-qa-and-release.md`.
16. `specification/phased-implementation-blueprint.md`.

This document is the detailed experience contract for the three-level Selected Works/Collections journey. If it conflicts with shared design, content, accessibility, or publication authorities, record and resolve the conflict; do not silently override them.


## 20. Responsive carousel presentation refinement — 2026-10-31

The presentation rules in [artwork-discovery-carousel-and-editorial-experience.md](./artwork-discovery-carousel-and-editorial-experience.md) supersede the earlier grid-first composition guidance for the homepage Selected Works section and the primary collection-detail browsing surface.

- Homepage Selected Works becomes a user-controlled responsive shadcn Artwork Carousel; the single static homepage Hero is unchanged.
- The collection index introduces curated collections through editorial previews and may use a responsive collection rail when appropriate.
- Collection detail uses a responsive artwork carousel as its primary browsing surface. Every artwork remains reachable by visible controls and keyboard; provide an ordered, readable complete-collection index when needed rather than another dense generic image grid.
- Continue to use the one shared Artwork Viewer, with navigation scoped to the originating homepage selection or collection.
- The carousel must never autoplay, force-crop paintings, or rely on swipe alone.
- The new contract supplies viewport/container targets, RTL behavior, shadcn composition, accessibility, wireframe, and test requirements.

Content identity, viewer history, route compatibility, publication gates, and artwork approval requirements in this document remain in force.
