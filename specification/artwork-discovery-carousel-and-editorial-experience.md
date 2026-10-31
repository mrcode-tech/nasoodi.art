# Artwork Discovery, Responsive Carousels, and Editorial Journal Experience

**Status:** Approved direction for specification and future implementation planning; implementation and final visual approval remain pending  
**Revision date:** 2026-10-31  
**Applies to:** Homepage Selected Works, gallery index, collection detail, shared artwork presentation, and homepage Journal preview  
**Locales:** Persian (`fa`, RTL) and English (`en`, LTR)  
**Design authorities:** `design-engineering-skills.md`, `design-direction-and-system-refinement.md`, `visual-identity-and-photo-direction.md`, `site-wide-design-system-and-section-specification.md`

## 1. Decision and intent

Replace the image-grid-first presentation of artwork discovery with a deliberate editorial experience built around **user-controlled, responsive artwork carousels**.

This is not a conventional slideshow or a row of decorative sample images. It is a curated way to browse real approved artwork: several items are visible at once, item width adapts to the available content width, the visitor controls movement, and every work remains discoverable.

The site should feel like entering a carefully curated artist exhibition rather than browsing a generic image gallery. A carousel is a presentation and navigation pattern; it must not become a barrier to the complete collection.

### 1.1 Core decisions

1. **Homepage:** keep the existing single, static, artwork-led hero. Redesign the Selected/Featured Works presentation as a responsive artwork carousel. Keep featured collection previews visually distinct.
2. **Gallery index:** present curated collections as editorial previews, using a responsive collection carousel/rail when enough published collections justify it. Do not make the page an uninterrupted wall of artwork thumbnails.
3. **Collection detail:** use a responsive artwork carousel as the primary browsing experience, with access to every artwork and an intentional non-grid index for visitors who want to scan the whole collection.
4. **Journal:** preserve the existing post/editorial design. On the homepage show only the two most recently published Journal entries (articles or events together), ordered by publication date. The complete archive remains available through **Explore Journal**.
5. **Artwork authenticity:** use canonical artwork records and approved images only. Do not use generic sample images, stock photographs, generated paintings, or invented content.
6. **Component foundation:** use the project's shadcn/ui conventions. Reuse the existing component stack; do not migrate the project from its installed Radix primitives to Base UI solely to add a carousel.

## 2. Existing repository facts and compatibility

The feature branch currently has:
- A static artwork-led homepage hero contract.
- A three-level journey: homepage selected artwork, collection discovery index, collection detail.
- One shared Artwork Viewer used in homepage and collection contexts.
- Localized routes: `/[locale]/galleries`, `/[locale]/galleries/[gallerySlug]`, and canonical artwork detail routes at `/[locale]/works/[artworkSlug]`.
- Persian RTL and English LTR.
- shadcn-style UI primitives under `src/components/ui/`; the inspected inventory includes Button, Dialog, Dropdown Menu, Sheet, and Sidebar.
- A `components.json` configuration and installed Radix UI primitives.
- No existing `src/components/ui/carousel.tsx` and no Embla dependency in the inspected feature-branch package manifest.

The content inventory `approved-artwork-content-inventory.md` records five owner-approved artwork assets, canonical records, localized editorial titles/descriptions/alt text, and four curated overlapping collections. It is the current content mapping authority. The older pending wording in `asset-review-register.md` must be reconciled with that newer explicit approval record; do not revert the five works to generic placeholders or duplicate their records.

The asset inventory and its approval basis do not remove the need for visual QA of the actual images, responsive image treatment, and final owner review of the composed pages.

## 3. Global experience principles

- Artwork remains the primary content and must be displayed at a scale that allows meaningful viewing.
- Preserve original color, texture, orientation, signature, canvas edges, and aspect ratio. Never crop, recolor, mirror, filter, distort, or animate artwork.
- Do not force every work into the same image box if that hides important parts of a painting.
- Use restrained controls and generous whitespace. Avoid dashboard-like cards, excessive borders, decorative badges, and unnecessary shadows.
- Use visible artwork titles/captions where approved; do not invent missing metadata.
- Do not autoplay, auto-advance, or loop artwork carousels by default.
- Never make swipe the only way to navigate.
- A carousel must not conceal content or make visitors guess that more works exist.
- When the content count is too small to justify a carousel, use a considered static editorial layout rather than empty or disabled carousel chrome.
- Keep Journal and event content semantically and visually distinct from artwork.

## 4. Homepage composition

### 4.1 Hero — explicitly unchanged

The existing hero remains a single, static, approved artwork-led composition. It is not part of the carousel redesign.

Retain all current hero rules: the painting must be immediately visible; use its natural aspect ratio; no autoplay, rotating hero, forced intro, scroll hijacking, or movement of the artwork itself. Studio/process photography remains subject to its separate factual classification and must not be misrepresented as a finished painting.

### 4.2 Selected Works carousel

Replace the existing grid-first Selected Works/Featured Works composition with a horizontal responsive artwork rail using the shared shadcn Carousel primitive.

**Purpose**
- Introduce a small, artist-curated selection of individual paintings.
- Let visitors compare and discover several works without leaving the homepage.
- Open the existing shared Artwork Viewer when an artwork is selected.
- Provide a clear route to the complete collection-discovery experience.

**Content**
- Use the canonical homepage selection and stable artwork IDs from the content model.
- Use explicit curated order; never randomize or sort by filename.
- Do not repeat the hero artwork immediately unless the editorial configuration has an explicit reason.
- Show approved title and only verified optional metadata.
- Use actual approved artwork images. Do not create a mock carousel filled with sample placeholders.
- If fewer than two eligible artworks exist, omit carousel controls and use a static layout appropriate to the available count. Never pad the selection.

**Composition**
- A section heading and optional approved introduction precede the rail.
- Artwork image is dominant; title/caption sits adjacent to or below the image, not baked into it.
- Preserve each artwork's natural ratio. The rail may use a consistent maximum media frame while allowing image-specific contain behavior; do not crop to equalize card heights.
- Previous/next controls sit outside the image area where possible and must not cover the painting.
- A small progress indicator (for example, current snap / total snaps) is optional when it materially helps orientation. Do not add decorative dot navigation for a large set.
- A subtle peek of the next item may signal horizontal continuation on touch widths, but must not clip artwork, captions, or focus outlines.

**Interaction**
- Activating an artwork opens the existing shared Artwork Viewer with the homepage selection as its navigation context.
- The viewer continues to own title, description, approved metadata, URL/history, focus restoration, and close behavior as defined in `selected-works-three-level-experience.md`.
- Carousel previous/next controls move the rail; they do not open the artwork viewer.
- Artwork cards remain individually keyboard-operable and have clear accessible names.

### 4.3 Featured collections

Keep collection previews distinct from individual artwork previews.

Each preview contains a member artwork cover, localized collection title, approved short description, and one clear Explore Collection link. Use editorial composition rather than identical small thumbnails. A collection rail is appropriate when there are multiple published collections; if only one collection is featured, use a deliberate standalone editorial feature.

A homepage collection preview navigates to its established collection detail route. Do not make the collection card behave like an artwork viewer trigger.

### 4.4 Homepage Journal preview

The homepage Journal section shows **at most the two most recently published Journal entries across all supported entry types**, including articles and events together. Sort by the canonical publication timestamp, newest first; do not create separate two-entry quotas for articles and events.

- When at least two entries are published and eligible, show exactly the two latest.
- When only one eligible entry exists, show one; when none exist, omit the entries and use the existing intentional empty-state/section-omission rule. Never invent or duplicate an entry to fill space.
- Preserve the existing Journal post-style/editorial card composition: representative image when approved, title, publication date, short excerpt, and clear article navigation.
- Do not turn Journal entries into artwork cards or put Journal in the artwork carousel.
- Provide one clear **Explore Journal** link to `/[locale]/journal`.
- The homepage Journal section is secondary to artwork and collection discovery.

## 5. Gallery index

The gallery index is a curated discovery page, not a raw image dump.

- Keep a concise editorial introduction.
- Present published collections using collection previews with cover artwork, title, and approved description.
- For multiple collections, use a responsive horizontal collection rail where it improves browsing and fits the number of collections.
- Collection cards should have enough width for their cover and title/description to be legible; avoid a row of tiny thumbnails.
- A partial next-card peek is optional on mobile when it clearly signals horizontal continuation.
- Use explicit editorial order from the collection records.
- Each collection is one coherent accessible link to its own detail route; avoid nested links.
- If the collection count is one or two, a simple editorial composition may be clearer than carousel controls. Do not force the component.
- Do not place the same full artwork catalogue on the index page; the index introduces collections, while collection detail presents its works.

## 6. Collection detail

A collection detail page should feel like entering a curated body of work.

### 6.1 Introduction

Retain the collection title, approved localized description, and a representative cover/hero composition. Do not invent chronology, themes, medium, year range, or exhibition context. Keep the introduction concise so the paintings remain prominent.

### 6.2 Primary artwork carousel

Use the shared shadcn Carousel primitive to browse the collection's canonical ordered artwork references.

- Display multiple works simultaneously at desktop/tablet widths when the available container allows it.
- Let item width respond to the actual content container, including the persistent desktop sidebar; do not calculate from raw viewport width alone.
- On mobile, show one large work and optionally a restrained part of the next card as a continuation cue.
- Use explicit curated order, not random or alphabetical order.
- Preserve natural aspect ratios and never crop paintings to satisfy a uniform carousel card.
- Show each approved title and verified metadata in a stable caption position.
- Previous/next controls and touch/trackpad dragging must work without interfering with opening the Artwork Viewer.
- Selecting an artwork opens the shared viewer with the current collection's ordered artwork sequence as its context.
- Navigation inside the viewer remains scoped to this collection.
- Do not auto-advance or loop by default. At the ends, controls become disabled/hidden consistently; the sequence must not imply an endless gallery.
- Show current position/progress where useful, but keep indicators secondary.

### 6.3 Complete collection access

All published artworks in the collection must remain reachable even if the visitor does not use drag gestures.

- Every artwork is present in the ordered carousel content and reachable through previous/next controls and keyboard interaction.
- Provide an explicit **View all works** affordance when the rail alone does not make the collection size and completeness sufficiently clear.
- The expanded all-works view should use a readable ordered index or editorial list with meaningful artwork thumbnails and titles; do not default to another dense, uniform image wall.
- Keep the order identical to the canonical collection membership.
- The complete index and carousel reference the same artwork records and images; do not duplicate content records.
- If an expanded view is not needed for a small collection, state that the carousel itself is the complete collection and show its item count.

## 7. Responsive item sizing and layout behavior

The number of visible items is a result of available content width, not a fixed slide count. Initial design targets (to be validated against actual artwork ratios, captions, and the desktop sidebar):

| Available content width | Initial target |
|---|---|
| Wide desktop | 3–4 substantial items |
| Standard desktop | 3 items |
| Tablet | 2 items |
| Mobile | 1–1.2 items |
| Narrow mobile | 1 prominent item; next-item peek only if it remains clear |

These are composition targets, not hard-coded viewport promises. Actual width adapts fluidly using responsive item basis/sizing and, where useful, container-aware breakpoints.

Specify and test:
- Standard desktop with persistent sidebar.
- Wide desktop.
- Tablet portrait and landscape.
- Mobile portrait and landscape.
- Narrow 320px viewport.
- Browser zoom/reflow.
- Short-height viewport.
- Long Persian and English titles.
- Different artwork ratios (portrait, landscape, square, panoramic if present).
- One item, two items, and many items.

Do not reduce image size so far that four items fit at the cost of artwork legibility. Prefer fewer larger works over a dense strip.

## 8. shadcn component contract

Official reference: https://ui.shadcn.com/docs/components/base/carousel

Use the documented composition:
- `Carousel`
- `CarouselContent`
- `CarouselItem`
- `CarouselPrevious`
- `CarouselNext`

The official shadcn Carousel is built with Embla. The project currently uses shadcn-style components backed by Radix UI; select the matching shadcn implementation variant and preserve the existing primitive foundation. Do not migrate all existing components to Base UI or mix primitive families simply to install the carousel.

The repository currently has no carousel primitive and no Embla dependency. Future implementation may add the shadcn Carousel component and the minimal Embla React dependency through the official shadcn workflow, after inspecting current versions and generated code. Do not add the autoplay plugin. Do not add a second carousel library.

Component sizing should use responsive item basis/sizing in the CarouselItem composition and consistent logical spacing. Exact classes and breakpoints are implementation details to be validated in browser screenshots; visible-item targets are the design contract.

Document the component's API/composition, responsive item widths and spacing, alignment/snap behavior, direction/RTL, drag/free-drag behavior and keyboard support, previous/next disabled states, progress/current position, insufficient-item and empty states, reduced motion, focus outline/clipping, loading/image stability, and accessible names/slide descriptions.

Avoid a custom carousel wrapper that duplicates Embla behavior. Page-specific components compose the shared primitive and provide artwork/collection content only.

## 9. RTL and bilingual behavior

- Set both the carousel's document direction and Embla direction option from the active locale (`ltr` for English, `rtl` for Persian).
- Ensure previous/next icons and accessible labels reflect actual movement direction.
- Preserve canonical editorial artwork order across locales unless the owner explicitly approves a different order. RTL changes visual direction, not content sequence.
- Do not mirror paintings, images, signatures, or artwork.
- Use logical spacing and positioning; do not hardcode left/right assumptions into card layout.
- Test keyboard order, touch direction, progress text, and visible focus in both locales.
- Keep title and caption reading direction correct, including mixed-script metadata and numerals.

## 10. Accessibility and motion

Target WCAG 2.2 AA and use W3C carousel guidance:
- https://www.w3.org/WAI/tutorials/carousels/
- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

Requirements:
- Provide a visible section heading and an accessible carousel name associated with it.
- Use native buttons for Previous and Next with localized accessible names.
- Give each artwork item a meaningful accessible name based on approved title and position where needed.
- Ensure every item can be reached without dragging; keyboard operation is required.
- Keep focus visible and not clipped by carousel overflow.
- Communicate selection/progress changes to assistive technology without excessive announcements.
- Do not hide off-screen content from assistive technology in a way that makes carousel navigation incoherent; inspect the shadcn/Embla semantics and adjust only as needed.
- Do not add autoplay or automatic movement.
- Respect `prefers-reduced-motion`; reduce transition duration/movement while preserving functionality.
- Swipe is supplementary, never the only navigation method.
- Controls must not overlap artwork or be too small for touch.

## 11. Journal design preservation

Journal is not part of the artwork carousel redesign.

Preserve the current editorial post-style presentation across homepage preview, Journal index/archive, Journal article detail, and event detail within the unified Journal.

The Journal index remains a readable chronological editorial archive. It may use a carefully composed list or editorial cards as already specified, but must not become a carousel of artwork or a generic image-grid gallery. Event facts remain text, not poster-only information.

On the homepage, the latest two published entries are a compact preview only. Explore Journal leads to the complete archive. Do not change global navigation or add a separate top-level Events route.

## 12. Wireframe deliverables

Update `wireframes.md` with annotated layouts for:
1. Homepage desktop: static hero, Selected Works carousel, featured collections, two latest Journal entries.
2. Homepage tablet.
3. Homepage mobile and narrow mobile.
4. Gallery index desktop/tablet/mobile.
5. Collection detail desktop/tablet/mobile, including primary carousel and complete-collection access.
6. Journal homepage preview (two entries), Journal index, and Journal detail to demonstrate the preserved editorial treatment.

Each wireframe identifies visible item count, item width/spacing, controls, next-item peek, no-crop image policy, caption placement, Artwork Viewer activation, collection navigation, Journal's separate post-style layout, and RTL behavior without mirroring artwork.

Use approved artwork references from the content inventory. Do not use generic stock sample screenshots or fictional paintings. If a wireframe cannot embed an approved image, label the placeholder as structural only, never as portfolio content.

## 13. Testing and acceptance criteria

### Content and behavior
- [ ] Homepage hero remains a single static artwork-led composition.
- [ ] Homepage Selected Works uses a responsive carousel when enough approved works exist.
- [ ] Homepage carousel uses canonical artwork IDs and explicit editorial order.
- [ ] Carousel displays a fluid number of items based on actual available content width.
- [ ] Carousel items open the existing shared Artwork Viewer.
- [ ] Collection previews remain distinct from individual artwork cards.
- [ ] Gallery index supports curated collection discovery without an uninterrupted image wall.
- [ ] Collection detail uses a responsive artwork carousel as its primary browse experience.
- [ ] Every published artwork in each collection remains discoverable through keyboard and visible controls.
- [ ] Collection viewer navigation stays within the active collection.
- [ ] No duplicate artwork records or invented metadata are introduced.
- [ ] No generic sample or unapproved imagery is introduced.
- [ ] Homepage Journal preview contains at most the two latest published Journal entries across article and event types.
- [ ] With at least two eligible entries, the two newest by publication timestamp appear.
- [ ] Explore Journal links to the complete Journal archive.
- [ ] Journal index and detail retain their existing editorial/post-style design.

### Responsive and localization
- [ ] Wide desktop, standard desktop, tablet, mobile, narrow mobile, landscape, and short-height wireframes are updated.
- [ ] Item sizing adapts to the content container and sidebar, not only raw viewport width.
- [ ] No painting is cropped or distorted.
- [ ] Persian RTL and English LTR carousel direction and control meaning are correct.
- [ ] Keyboard and touch navigation work in both locales.
- [ ] Focus outlines are visible and not clipped.

### Accessibility and quality
- [ ] No autoplay or automatic advancement.
- [ ] Accessible names, position/progress announcements, keyboard controls, and reduced-motion behavior are specified.
- [ ] The complete collection is accessible without swipe-only interaction.
- [ ] Image dimensions prevent layout shift; off-screen images use appropriate lazy loading.
- [ ] Carousel behavior is tested at 320px, 390px, tablet, desktop, and short-height sizes.
- [ ] Visual QA compares the rendered UI with the approved artwork masters.
- [ ] Automated content, component, and Playwright tests cover populated and sparse collections, both locales, and Journal preview limits.
- [ ] The new component is included in the shadcn component inventory only after it is actually implemented.

## 14. Status and approval boundaries

This document establishes the design direction and implementation contract. It does not assert that the carousel component has been installed, that the new layout has been implemented, that tests pass, or that visual approval has occurred.

The approved artwork inventory remains the source of truth for artwork records and image mappings. The Journal content model remains the source of truth for publication state and timestamps. Shared design-system and accessibility specifications remain authoritative for tokens, interaction, motion, and quality gates.

Any unresolved artwork identity, rights, metadata, translation, or editorial grouping must be recorded as an approval dependency; do not invent an answer to make a wireframe appear complete.
