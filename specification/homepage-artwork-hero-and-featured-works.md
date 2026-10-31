# Nasoodi.art — Homepage Artwork Hero, Featured Works, and Gallery Discovery Specification

**Status:** Proposed homepage experience contract  
**Scope:** Main hero artwork, featured paintings section, featured gallery previews, and homepage-to-gallery navigation  
**Related documents:** `gallery-collections-and-artwork-detail.md`, `content-model.md`, `artwork-imaging-and-asset-pipeline.md`, `hero-implementation-prompt.md`, `easel-scroll-background.md`, `site-wide-design-system-and-section-specification.md`, `navigation-and-mobile-sidebar.md`

## 1. Homepage experience goals

The homepage must immediately communicate that Nasoodi.art is the portfolio of an oil painter and make the paintings—not interface decoration—the primary content.

The homepage must provide three distinct discovery experiences:

1. **Hero artwork:** one strong, approved painting is prominently displayed in the first viewport.
2. **Featured artworks:** a curated selection of individual paintings appears in the middle portion of the homepage.
3. **Featured galleries:** visitors can discover multiple curated collections, each with a title, short description, cover artwork, and link to its own gallery page.

The hero artwork, featured artwork cards, and gallery covers must be drawn from the same canonical artwork records. Do not create duplicate or disconnected image content for these placements.

## 2. Hero artwork section

### 2.1 Primary visual

Use the artwork image currently supplied at:

`specification/assets/artwork.JPG`

as the **initial candidate source for the homepage hero painting**. The implementation agent must inspect the actual file before use: verify that it is a finished artwork image, assess orientation/composition/resolution/color profile, and confirm that it is the intended public hero image with artist/site-owner approval. The filename alone is not proof of suitability or rights.

If the artist confirms a different image from the asset set as the hero painting, update the asset mapping and this specification with the approved path. Do not silently substitute another image.

The hero must show the painting itself as a prominent, legible image—not merely a small thumbnail, background texture, or an image hidden behind a studio animation. It must be possible to appreciate the painting immediately.

### 2.2 Composition

Recommended desktop composition:
- Prominent artwork image as the dominant visual, using a generous display area.
- Artist identity and role as a clear typographic element.
- One concise, artist-approved introductory sentence if available.
- Primary action: “Explore galleries” or the approved localized equivalent.
- Secondary action: “View selected works”.
- Avoid text over the painting. Place copy beside, below, or in a carefully tested negative-space region only if the image itself permits it.
- Use the image's natural orientation to guide the composition. Portrait artwork may sit beside copy; landscape artwork may span a wider area.
- Keep the painting's full frame visible by default. Any crop must be a separately approved derivative.

The hero should feel like a gallery opening wall: quiet, confident, editorial, and image-led. Avoid a generic SaaS-style split hero, oversized gradient, decorative blobs, or a rotating carousel.

### 2.3 Mobile composition

- Put the painting prominently near the top of the page, with a readable size.
- Preserve the full image ratio; do not crop simply to force a fixed hero height.
- Place artist identity and role in a clear sequence with the painting.
- Keep at least one visible route to the galleries/works.
- Avoid placing small text on top of the artwork.
- Keep the first view purposeful; do not force the visitor to scroll past a large empty animation before seeing the painting or navigation action.

### 2.4 Image treatment

- Preserve original painting colors, brush texture, canvas edges, orientation, and aspect ratio.
- No CSS filters, overlays that tint the image, blend modes, AI enhancement, recoloring, mirroring, distortion, or aggressive compression.
- Use `object-fit: contain` or equivalent full-image rendering for the hero unless an artist-approved crop is explicitly provided.
- Provide a neutral frame/background that complements the design palette without changing image pixels.
- Reserve image dimensions to prevent layout shift.
- Use a high-quality responsive derivative appropriate to the hero display size.
- Provide localized alt text that describes visible content. The adjacent caption/title should not be needlessly duplicated in alt text.

### 2.5 Motion

The hero artwork should be static by default. Optional entrance motion may be limited to a subtle fade or small positional settle after the image is available. The painting itself must not animate, warp, pan, zoom, or move independently.

- No autoplay carousel.
- No forced intro or loading gate.
- No scroll hijacking.
- Respect `prefers-reduced-motion`; reduced-motion mode shows the complete image immediately.
- Text and CTA remain available if animation is disabled or JavaScript is delayed.
- Do not animate brush strokes or simulate painting unless the artist explicitly approves a separately scoped, technically credible effect.

The persistent easel background is a separate decorative layer governed by `easel-scroll-background.md`; it must not obscure the hero artwork.

## 3. Hero content model

The hero should reference a canonical artwork record rather than hardcode an independent image path in a page component.

Conceptual configuration:

```ts
type HomepageHero = {
  artworkId: string;
  headline?: {
    fa?: string;
    en?: string;
  };
  introduction?: {
    fa?: string;
    en?: string;
  };
  primaryAction: "galleries" | "works";
  secondaryAction?: "works" | "about";
};
```

Rules:
- `artworkId` must resolve to a published, artist-approved artwork with a primary image and confirmed usage rights.
- Hero title/intro must be approved in both published locales.
- The action target must exist and contain meaningful published content.
- Do not infer an artwork title from the filename.
- Do not fabricate a slogan, artist statement, painting interpretation, or biography.
- If no approved headline/intro exists, show artist name and confirmed discipline only.

## 4. Featured artworks section (middle of homepage)

### 4.1 Position and purpose

Place a dedicated **Featured Works / Selected Paintings** section in the middle portion of the homepage, after the hero and before the lower editorial/contact sections. It must be a substantial, clearly titled part of the page—not a tiny footer strip.

Its purpose is to let visitors see several individual paintings without first navigating into a gallery. It provides a direct route to each artwork detail page where available and to the full Works/Galleries index.

### 4.2 Content

- Show a curated set, normally 3–6 approved artworks, depending on the number and quality of approved records.
- Each card displays a painting image and approved title; optionally show year or medium only when confirmed.
- Use a clear “View all works” link to the full works catalogue.
- The selection is manually curated through stable artwork IDs and explicit sort order, not random, newest-first, or filename order unless the artist requests it.
- A featured artwork may also appear in one or more galleries; do not duplicate its data record.
- Avoid showing the same hero painting again immediately below the hero unless a deliberate editorial reason exists. Prefer a diverse selection of other works.
- If fewer than three approved artworks exist, show the smaller valid set rather than padding with placeholders.
- If no additional approved artwork is available, omit the section or show only the approved hero with a clear path to Galleries; never use stock or generated paintings.

### 4.3 Visual layout

Desktop:
- Use an editorial grid or staggered composition that responds to artwork ratios.
- Feature one larger painting with two or three supporting images only if it improves hierarchy.
- Do not force all images into uniform thumbnail crops.
- Captions should be placed directly below or beside their painting with consistent spacing.

Tablet:
- Reduce columns and rebalance spans; preserve image size and reading order.

Mobile:
- Use one-column cards or a simple horizontal arrangement only if it remains accessible and does not require auto-scrolling.
- Avoid tiny carousels and hidden swipe-only content.
- Keep the image and caption together.
- Make all artwork links operable by touch and keyboard.

### 4.4 Interaction

- Clicking an artwork image or title opens that artwork's detail page when published.
- If an artwork detail page is not part of the initial release, link to a meaningful accessible image presentation rather than a dead link.
- Hover effects are subtle and never modify artwork pixels.
- Do not autoplay or automatically advance artwork.
- Provide a visible “View all works” action.

## 5. Featured galleries section

### 5.1 Placement

Place a gallery-discovery section after Featured Works or at another clearly intentional point in the middle-to-lower homepage flow. It must not be confused with the individual Featured Works section.

The two sections serve different purposes:
- Featured Works highlights selected individual paintings.
- Featured Galleries introduces curated groups and invites visitors into dedicated gallery pages.

### 5.2 Content

- Show 2–4 featured galleries when that many published, approved galleries exist.
- Each preview includes cover artwork, gallery title, and a short description.
- Include a clear “Explore gallery” link.
- Include “View all galleries” to the gallery index.
- Order galleries explicitly according to editorial priority.
- Use only published galleries with valid covers and at least one published artwork.
- Do not show unpublished galleries, empty galleries, or automatically generated categories.
- If only one gallery is approved, show one; do not create artificial variety.

### 5.3 Design

- Treat each gallery preview as an editorial invitation, not a generic product tile.
- Keep gallery title and short description readable outside the image.
- Cover images must preserve artwork fidelity and use an approved crop/frame.
- A gallery preview may use a larger cover image with text alongside it or a restrained grid, depending on the available images.
- Do not repeat the exact same gallery preview multiple times on the homepage.
- Do not use an autoplay carousel. If a manually operated carousel is later justified by a large gallery count, it must have visible controls, keyboard support, reduced-motion behavior, and a static fallback.

## 6. Recommended homepage sequence

The following sequence is the default content architecture; the final order may be refined after reviewing the actual approved paintings and image set:

1. Global navigation shell.
2. Hero artwork and artist identity.
3. Short selected-works introduction or section lead.
4. Featured Works / Selected Paintings (3–6 where available).
5. Featured Galleries (2–4 where available).
6. Artist introduction/About preview with approved text and optional approved artist/studio image.
7. Verified exhibitions/CV highlights, only if meaningful entries exist.
8. Contact invitation.
9. Footer.

Do not force every section to appear if content is not ready. A smaller, complete homepage is preferable to a long page filled with placeholders.

## 7. Content selection and editorial control

Use explicit configuration or content fields for:
- Homepage hero artwork ID.
- Featured artwork IDs and order.
- Featured gallery IDs and order.

These selections must be deterministic and reviewable in source control. Do not derive featured selections from filenames, upload time, array position, random selection, or unreviewed AI ranking.

Validation:
- Every selected artwork must be published and rights-approved.
- Every selected gallery must be published, non-empty, and have an approved cover.
- No broken references or duplicate IDs within one featured list.
- Hero artwork may not be duplicated in Featured Works unless explicitly allowed by editorial configuration.
- Removing an item from the homepage must not delete it from its gallery or artwork archive.

## 8. Responsive and localization requirements

- The same approved content is available in Persian and English where translations exist.
- Persian pages use RTL document direction; English pages use LTR.
- Artwork images are never mirrored.
- Keep gallery/work order consistent across locales unless the artist explicitly approves locale-specific editorial ordering.
- Titles and descriptions use approved translations; no unreviewed machine translation.
- The hero's physical image placement may be art-directed per breakpoint, but it must not be mirrored as a result of RTL.
- The global physical-left sidebar and easel background remain governed by their own specifications.
- Test the full homepage at 320–375px, 390–430px, tablet, desktop, wide desktop, and short-height mobile/landscape.

## 9. SEO and sharing

- Homepage metadata should identify the artist and painting practice without keyword stuffing.
- The hero artwork may be used as the homepage social share image only after approval and correct crop/derivative preparation.
- Featured works and galleries must link to crawlable internal routes.
- Use descriptive alt text and visible captions.
- Gallery pages and artwork detail pages must have their own metadata as defined in the gallery contract.
- Do not place important page copy only inside the artwork image.

## 10. Performance and quality

- The hero image is a likely LCP candidate: use a correctly sized responsive derivative, reserve its dimensions, and prioritize it appropriately.
- Avoid downloading multiple full-resolution images in the initial viewport.
- Lazy-load featured works and galleries below the fold.
- Do not load the entire artwork catalogue on the homepage.
- Avoid unnecessary client-side JavaScript; render content server-side where the current architecture supports it.
- Measure LCP, CLS, and image transfer sizes on mobile.
- Compare hero and featured artwork derivatives against the approved source.
- Provide a static and useful homepage if animation or optional scripts fail.

## 11. Acceptance criteria

- The first viewport prominently shows the approved artwork from the configured hero record; initial candidate asset is `specification/assets/artwork.JPG`.
- The hero image is the painting itself, not merely a decorative placeholder or hidden layer.
- The artist identity and a clear path to Works/Galleries are visible without waiting for animation.
- A Featured Works section appears in the middle portion of the homepage and shows 3–6 approved paintings when available.
- A distinct Featured Galleries section presents multiple curated collections when available.
- Each gallery preview includes a title, short description, cover, and working link to its own gallery page.
- Visitors can reach gallery detail pages and then open individual artwork details.
- Hero, featured works, and gallery previews use canonical artwork/gallery records without duplicate content data.
- All content is approved, localized, responsive, accessible, and SEO-ready.
- Image fidelity, loading performance, automated tests, and visual QA pass in both locales and all supported breakpoints.

## 12. Implementation boundary

This document defines intended design and behavior. It does not establish that the candidate hero image or gallery assets have been visually inspected, rights-cleared, or approved. The implementation agent must inspect the files and obtain/confirm approval before publication. Do not generate replacement paintings or invent gallery titles/descriptions.

## 13. Latest from the Journal

The homepage must provide a clear, direct path to the unified Journal archive. Follow the complete content and interaction contract in [journal-and-events.md](./journal-and-events.md).

- Place a restrained “Latest from the Journal” section after Featured Works and Featured Galleries, before the final contact/footer region unless the approved composition establishes a better order.
- Show one eligible upcoming event prominently when one exists, followed by up to two recent published Journal entries.
- If no eligible upcoming event exists, use the most recent published entries. If there are no approved published entries, omit the section rather than showing placeholders.
- Each card links to its canonical Journal detail route.
- The section heading or explicit “View all journal entries” link must navigate to the Journal index.
- Use the shared Journal content records; do not duplicate editorial data in homepage configuration.
- Keep the section responsive, localized, accessible, and visually subordinate to Featured Works and Featured Galleries.
- Do not label an expired event as upcoming or display unapproved event facts.
## Design-engineering refinement

Apply design-engineering-skills.md and design-direction-and-system-refinement.md to the homepage.

- The first viewport must establish artist identity and the approved finished painting as the primary visual focal point.
- Compose the hero as an editorial/gallery introduction, not a conventional centered marketing banner.
- Featured Works should use a curated composition responsive to actual artwork ratios; do not force identical card sizes.
- Featured Galleries should feel like curated collection invitations, not a second artwork catalogue.
- Latest from the Journal should be visually quieter than the artwork sections and should not become a generic news-card grid.
- Do not animate painting images. Use motion only for meaningful UI transitions and only after the motion decision gate.
- Review all homepage sections together for rhythm, section pacing, visual hierarchy, and content density.

## Selected Works three-level experience alignment

The detailed cross-page contract is [selected-works-three-level-experience.md](./selected-works-three-level-experience.md); responsive structural layouts are in [wireframes.md](./wireframes.md), Section 15.

For the homepage, apply these specific rules:

- The Selected Works section is a curated preview of individual artworks, not the complete catalogue and not a collection index.
- Selecting an artwork opens the shared Artwork Viewer. The viewer must visibly present the artwork image, approved title, artist-approved description when available, and only verified optional metadata.
- The viewer supports previous/next navigation within the homepage's explicitly configured selected-artwork sequence. It must update image, title, description, metadata, alt text, and position together.
- Closing the viewer returns to the exact homepage context, scroll position, and invoking artwork control.
- The Explore Works/Explore Collections action navigates to the canonical collection index. It is a normal link/navigation action, not another artwork popup.
- The homepage selected-artwork sequence and collection membership are derived from canonical artwork/collection records; do not duplicate artwork records or image files.
- Do not invent titles, descriptions, collection identities, grouping, dates, dimensions, medium, or translations. Missing optional fields are omitted.
- A separate Featured Galleries/Featured Collections preview is optional only when it has a distinct editorial role and does not duplicate the Works index or overwhelm Selected Works. If retained, it must use approved collection records and link to their dedicated pages.
- The homepage and collection pages reuse the same Artwork Viewer component. Only the navigation context changes.

These rules refine the homepage popup and discovery behavior; the existing artwork-led hero, visual identity, and approval gates remain unchanged.
