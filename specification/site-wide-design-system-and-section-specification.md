# Nasoodi.art — Site-wide Design System and Detailed Section Specification

**Status:** Proposed design baseline for all public portfolio sections  
**Branch:** `feature`  
**Related source documents:** `proposal.md`, `visual-identity-and-photo-direction.md`, `content-model.md`, `wireframes.md`  
**Purpose:** Translate the visual identity into a consistent, implementation-ready design language for the complete website, not only the homepage hero.

## 1. Design north star

Nasoodi.art should feel like a contemporary artist's studio curated as a small independent gallery. The site is warm, tactile, quiet, editorial, image-led, and personal. It must give the paintings room to breathe and make the artist's identity clear without looking like a generic marketing template.

**Core rule:** artwork is the content; the interface is its frame.

The animated studio hero is the signature opening moment. The rest of the site should continue the same visual language in a calmer, more navigable way. Do not repeat the hero animation on every page or turn every section into a dramatic visual effect.

## 2. Design principles

1. **Artwork-first:** large images, preserved aspect ratios, faithful color, concise captions.
2. **Warm restraint:** warm paper surfaces, dark warm text, muted mauve/taupe accents.
3. **Editorial hierarchy:** strong page titles, small section eyebrows, readable body copy, quiet metadata.
4. **Consistent rhythm:** predictable page gutters, section spacing, content widths, and grid gaps.
5. **Human authenticity:** use only artist-approved photographs and facts; no fictional biography or generated artwork.
6. **Motion with purpose:** reserve the main entrance sequence for the homepage hero; elsewhere use subtle, optional transitions.
7. **Bilingual by design:** Persian RTL and English LTR must both feel native, not mirrored afterthoughts.
8. **Accessible by default:** keyboard, focus, contrast, reduced motion, semantic structure, readable image descriptions.
9. **Responsive composition:** re-compose each page at breakpoints rather than simply shrinking desktop layouts.
10. **Reusable, not repetitive:** shared components and tokens; vary layouts where the artwork or content calls for it.

## 3. Semantic visual tokens

Use the existing repository token mechanism and avoid hardcoding values into individual components. The following palette is the proposed baseline derived from the supplied studio photograph. Validate contrast and actual rendered behavior before final sign-off.

| Token | HEX | Role |
|---|---|---|
| Paper | #F3F0EA | Main page background |
| Paper raised | #FAF8F4 | Cards, menus, form surfaces |
| Paper muted | #E8E2DA | Alternating sections and quiet panels |
| Ink | #302824 | Primary headings and body text |
| Ink muted | #6B5D55 | Secondary text, metadata (contrast-check) |
| Mauve | #837369 | Restrained accent, active detail |
| Mauve deep | #675A51 | Stronger accent and selected states |
| Sand | #C5B197 | Small highlights and fine details |
| Earth | #533F30 | Occasional deep accent |
| Line | #D8D0C7 | Dividers, borders, separators |
| White | #FFFFFF | Selective high-contrast surface |

### 3.1 Usage rules

- Most interface area should be paper/raised paper; ink carries typography.
- Artwork supplies its own color. Do not tint artwork to match the interface.
- Mauve and sand are accents, not large decorative fills.
- Do not use mid-tone mauve for small text unless the actual contrast passes WCAG 2.2 AA.
- Do not rely on color alone for active, selected, sold, reserved, or unavailable states.
- Keep shadows extremely subtle or omit them. Prefer spacing and fine rules to card elevation.
- Avoid default dark mode unless separately designed and approved.

### 3.2 Layout and spacing tokens

Use fluid CSS variables or the existing Tailwind theme:
- Page gutter: `clamp(1.25rem, 4vw, 4.5rem)`.
- Main content max width: approximately 1440px, with narrower reading widths for prose.
- Section vertical spacing: `clamp(4rem, 9vw, 8rem)`.
- Small editorial label: compact uppercase in English; use natural Persian styling without forced uppercase or tracking.
- Grid gap: responsive and content-led; generally larger between sections than between image/caption pairs.
- Text measure: keep long-form biography and statements at a comfortable reading width, not full viewport width.

Do not create a new spacing scale if the project already has a coherent one. Map these semantic values to existing tokens.

## 4. Typography system

Use a considered Latin/Persian pairing with proper licenses and local hosting where practical.

- Display: elegant editorial face for large titles; avoid fragile ultra-thin weights.
- Body: highly legible family with comfortable line-height.
- Metadata/captions: smaller but still readable; never sacrifice legibility for minimalism.
- Persian: native Persian glyph shaping, connected forms, correct punctuation, readable numerals and weights.
- English: typographic hierarchy should complement, not overpower, the imagery.
- Do not apply letter spacing to Persian words in a way that breaks natural reading.
- Use logical alignment and direction-aware layout, not hardcoded left/right.

Typography hierarchy (semantic, not fixed pixel mandates):
- H1: one per page, distinct and editorial.
- H2: section titles.
- H3: card/detail subheadings only when structurally needed.
- Eyebrow: optional small section context label.
- Body lead: intro paragraph, larger than body copy.
- Body: comfortable reading text.
- Caption: artwork title/context.
- Metadata: year, medium, dimensions, series; secondary but readable.

## 5. Global shell

### 5.1 Header

**Purpose:** identify the artist and provide predictable navigation without competing with artwork.

Desktop:
- Wordmark/artist name on one side.
- Primary links: Works, About, CV/Exhibitions (only if populated), Contact.
- Visible Persian/English locale switch.
- Instagram may appear as a restrained external link, not a primary nav replacement.
- Header should be compact, with generous horizontal breathing room.
- Prefer a calm paper surface; use a fine bottom rule only if it helps separation.
- Avoid a large opaque sticky header that consumes the first viewport.

Mobile:
- Artist wordmark/name.
- Accessible menu trigger with expanded state.
- Locale switch remains discoverable.
- Menu panel uses the same paper/ink tokens and clear focus management.
- Do not squeeze desktop navigation into tiny text.

Behavior:
- Keyboard navigation and visible focus.
- Escape closes the mobile menu; focus returns to trigger.
- Current page is indicated semantically and visually.
- Direction-aware order for RTL/LTR; do not mirror artwork.
- Avoid hiding the only contact route in an inaccessible menu.

### 5.2 Footer

The footer closes the gallery experience rather than becoming a second navigation-heavy section.

Include, when confirmed:
- Artist name.
- Primary navigation shortcuts.
- Public contact method.
- Instagram link.
- Locale switch.
- Copyright notice and year generated correctly.
- Optional privacy/legal links if data collection or forms require them.

Use a warm paper/ink palette, restrained typography, and a fine divider. Do not show a private address or unapproved contact data. Avoid large social icon clusters.

### 5.3 Shared page container

- Consistent page gutters across all routes.
- Content max width for wide gallery layouts.
- Narrower measure for biography and statement text.
- Consistent top offset below header.
- Avoid a different arbitrary margin on every page.
- Keep image/caption groups visually connected.
- Allow selected artworks to break the grid deliberately when a larger editorial image is warranted.

## 6. Homepage — complete section specification

The homepage introduces the artist and previews the portfolio. Its hierarchy:

1. Header.
2. Animated studio hero.
3. Selected works.
4. Artist introduction.
5. Exhibition/CV highlights (only if verified content exists).
6. Contact/enquiry invitation.
7. Footer.

### 6.1 Animated studio hero

Use the separate implementation prompt in `hero-implementation-prompt.md`.

Required scene: visible easel support → canvas artwork reveal → artist foreground → subtle brush gesture → settled composition.

The hero includes:
- Artist's approved public name.
- Discipline label “Oil Painter”.
- Optional approved short intro.
- Primary CTA to Works.
- Secondary CTA to About.
- Static original-photo fallback.
- Reduced-motion final composition.

Draft headline/intro copy must be approved before publication. Do not block access to navigation or content while animation runs.

### 6.2 Selected works section

Purpose: move visitors from the studio introduction into actual paintings.

Design:
- Clear section heading and optional short introduction.
- Curated selection, normally a small set of 3–6 items depending on actual supplied work.
- Mix image sizes only when it creates a deliberate editorial rhythm.
- Preserve each painting's aspect ratio.
- Avoid generic uniform cards with heavy borders/shadows.
- Captions include only verified title and metadata.
- One clear “View all works” link.

Interaction:
- Entire artwork link can open its detail page; ensure accessible link name includes title when available.
- Hover may reveal a restrained underline or subtle image treatment, but must not recolor or crop the painting.
- No autoplay carousel.
- Keyboard focus should be obvious.

If there are not enough approved artwork images, do not fill the section with stock/generated images. Show only approved work or keep the section unpublished until content is ready.

### 6.3 Artist introduction preview

Purpose: provide a human context and invite visitors to learn about the artist.

Design:
- A concise artist-approved excerpt.
- Optional studio/process photograph, distinct from finished artwork.
- Asymmetric editorial layout with generous whitespace.
- Link to About.
- Avoid inventing themes or a personal story.

Use the studio photograph only if the artist approves public use and the crop retains its process context.

### 6.4 Exhibition/CV preview

Render only if there are verified entries.

Design:
- Small number of recent/relevant highlights.
- Date, exhibition title, venue, city/country only when supplied and verified.
- Link to full CV page.
- No empty placeholder headings or invented milestones.

### 6.5 Contact invitation

Purpose: provide a calm, clear next step for collectors, galleries, curators, and other visitors.

Design:
- One short heading and concise approved invitation.
- A public email or working contact action only after approval.
- Optional Instagram link.
- If artwork enquiries are supported, pass the artwork context into the contact flow.
- No fake form, nonfunctional button, or unconfigured mail endpoint.

## 7. Works index page

**Purpose:** let visitors browse the artist's paintings as a curated collection.

Page structure:
1. Shared header.
2. H1 “Works” / Persian equivalent.
3. Optional artist-approved introductory sentence.
4. Optional series navigation when real series exist.
5. Artwork grid/editorial arrangement.
6. Pagination or “load more” only if the collection size requires it.
7. Footer.

Visual behavior:
- Use a responsive multi-column grid at wide widths; reduce columns as screen width narrows.
- Preserve native image ratios; use masonry only if it remains stable, accessible, and consistent with the project architecture.
- Vary image scale intentionally rather than randomizing card heights.
- Use neutral backgrounds and restrained captions.
- Keep title and metadata adjacent to the corresponding image.
- Do not display unverified year, medium, dimensions, or availability.
- Avoid filter controls for a small collection. If the collection grows, filters must use real metadata and have clear reset/empty states.

Empty state:
- Never show fabricated sample artworks in production.
- If content is not ready, show a clear editorial placeholder only in preview/development and omit public empty navigation if appropriate.

## 8. Artwork detail page

**Purpose:** give one painting the space and context it deserves.

Suggested structure:
1. Header and breadcrumb/back-to-works navigation.
2. Large primary artwork image.
3. Title and metadata.
4. Artist-approved description or note, if available.
5. Optional detail/texture images and installation/context image.
6. Enquiry action only if approved and configured.
7. Previous/next artwork navigation where meaningful.
8. Related works/series only when real relationships exist.
9. Footer.

Image treatment:
- Preserve original ratio and color.
- Give the painting generous space.
- Use a neutral frame/surface, not a decorative card.
- Optional zoom/lightbox only if keyboard, focus, Escape, caption, and screen-reader behavior are implemented.
- Detail crops must be labelled as details.
- Never mirror, tint, or aggressively compress the artwork.

Metadata panel:
- Title.
- Year/date.
- Medium.
- Dimensions.
- Series.
- Availability.
Only render populated, approved fields. Unknown is not the same as “not applicable”.

Enquiry:
- Include the artwork title/slug as context.
- Do not show prices or availability unless the artist confirms and maintains them.

## 9. About page

**Purpose:** introduce the artist's practice and factual professional identity.

Recommended sections:
1. Page title and concise role.
2. Artist statement (first person, approved).
3. Biography (factual, third person, approved).
4. Studio/process photograph or portrait (optional and approved).
5. Selected professional highlights only if verified.
6. Contact/Works CTA.

Design:
- Narrow text measure for comfortable reading.
- Generous paragraph spacing.
- One strong image rather than a collage of uncurated photos.
- Clear distinction between statement and biography.
- Do not use generic inspirational filler.
- Do not infer influences, themes, education, or artistic intent from the reference photograph.

If the artist has not supplied approved text, keep content fields pending; do not fabricate a finished biography.

## 10. CV / Exhibitions page

Show this route in navigation only when there is meaningful verified content, or retain it as a clearly curated page only after the owner decides it should exist before content is ready.

Possible categories:
- Solo exhibitions.
- Group exhibitions.
- Education.
- Awards.
- Residencies.
- Publications.
- Collections.
- Press.

Design:
- Editorial timeline or grouped chronological lists.
- Reverse chronological order.
- Consistent date, event/title, venue, location, and role hierarchy.
- Minimal decoration; typography and spacing provide structure.
- Omit empty categories.
- Downloadable PDF only if supplied/approved, accessible, current, and linked correctly.

No fictional events, galleries, awards, dates, or education records.

## 11. Contact page

**Purpose:** make professional enquiries straightforward and trustworthy.

Page structure:
1. H1 and short approved invitation.
2. Approved public contact channel.
3. Optional enquiry form if a real delivery mechanism exists.
4. Instagram link.
5. Optional enquiry type selection only if it helps route real requests.

Form requirements, if implemented:
- Clearly labelled fields.
- Minimal data collection.
- Validation with useful error messages.
- Accessible success/failure feedback.
- Spam protection and rate limiting.
- Server-side validation.
- Privacy notice appropriate to actual data handling.
- No secret values in client code.
- Do not claim an email was sent until delivery is actually confirmed.

If no backend exists, use a real approved mailto/contact method or omit the form. Never render a fake submit button.

## 12. Responsive behavior

Design for at least:
- Wide desktop (1440px and above).
- Laptop (1280px).
- Tablet (768px).
- Mobile (390px).
- Small mobile (360px).
- Short-height desktop.

Rules:
- Recompose layouts instead of merely shrinking them.
- Preserve artwork aspect ratio.
- Keep readable line lengths and captions.
- Avoid horizontal scrolling.
- Maintain adequate tap targets.
- Use intentional image focal positions at each breakpoint.
- Do not mirror images for RTL.
- Ensure menu, gallery, lightbox, and forms work by keyboard and touch.
- The hero may switch to a static source photo on narrow screens if layered motion compromises quality.

## 13. Motion and interaction system

- Main multi-stage motion is reserved for the homepage studio hero.
- Other pages use small opacity/transform transitions only where they improve feedback.
- No scroll hijacking, parallax on paintings, autoplay carousel, or attention-grabbing repeated animation.
- All motion respects `prefers-reduced-motion`.
- Avoid motion that delays access to page content.
- Use clear hover/focus/active states with both visual and semantic cues.

## 14. Localization and RTL system

- Persian pages: `lang="fa"`, `dir="rtl"`.
- English pages: `lang="en"`, `dir="ltr"`.
- Use the existing locale routing and translation conventions.
- All interface copy must come from locale-aware content/messages.
- Use CSS logical properties.
- Keep painting and studio photographs unmirrored.
- Isolate Latin names, email addresses, URLs, dimensions, and mixed-direction content.
- Directional icons and breadcrumb arrows may adapt; artwork imagery must not.
- Do not publish a translation until it has been reviewed for meaning and tone.

## 15. Accessibility requirements

Target WCAG 2.2 AA:
- Semantic landmarks and logical heading order.
- One H1 per page.
- Keyboard-accessible navigation, links, controls, dialogs, and forms.
- Visible focus indicators.
- Text and control contrast verified using actual token pairs.
- Useful alt text for meaningful imagery; empty alt for redundant decorative layers.
- Accessible names for icon-only controls.
- Lightbox/dialog focus management and Escape behavior.
- Reduced motion.
- Zoom/reflow without content loss.
- Readable captions and touch targets.
- Both RTL and LTR keyboard/screen-reader review.

## 16. SEO and content integrity

- Unique metadata per route and artwork.
- Canonical URLs and valid language alternates only where translations exist.
- Sitemap and robots configuration.
- Semantic headings and descriptive, accurate image alt text.
- Structured data only for verified entities and fields.
- No keyword stuffing or invented artwork metadata.
- Artwork title, medium, year, dimensions, and context visible where known.
- Preserve clean URLs and stable slugs.
- Avoid indexing draft or placeholder content.

## 17. Component inventory

Build reusable components using existing project conventions. Suggested component families:

**Global:** SiteHeader, DesktopNavigation, MobileNavigation, LocaleSwitcher, SiteFooter, PageContainer, SectionHeading, Breadcrumbs.

**Hero:** StudioHero, StudioScene, EaselLayer, ArtworkLayer, ArtistLayer, BrushLayer, HeroIdentity, HeroActions, StaticStudioFallback.

**Artwork:** ArtworkGrid, ArtworkCard, ArtworkFigure, ArtworkCaption, ArtworkMetadata, ArtworkDetailGallery, ArtworkLightbox, SeriesNavigation, RelatedWorks.

**Editorial:** ArtistStatement, BiographySection, StudioProcessFigure, ExhibitionList, CVTimeline, ContactInvitation.

**Forms:** ContactDetails, EnquiryForm, FormField, FormStatus.

Do not create every component as a separate file by default. Group related elements according to the repository's architecture. Avoid duplicating nearly identical components across routes.

## 18. Design QA and acceptance

For each route, capture and inspect desktop, tablet, and mobile screenshots in both available locales.

Checklist:
- [ ] Header/footer are consistent across routes.
- [ ] Homepage hero matches its separate animation prompt.
- [ ] Selected works and Works index show only approved real artwork.
- [ ] Artwork details preserve ratio, color, and accurate metadata.
- [ ] About statement and biography remain distinct and approved.
- [ ] CV/exhibitions appear only with verified content.
- [ ] Contact actions genuinely work.
- [ ] Persian RTL and English LTR are both native and usable.
- [ ] No horizontal overflow at 360px.
- [ ] Focus, contrast, keyboard, lightbox, and reduced motion are verified.
- [ ] Images are optimized without visible fidelity loss.
- [ ] No broken assets, fake data, or dead links.
- [ ] SEO metadata and structured data are valid.
- [ ] Lint, typecheck, tests, and production build pass.

## 19. Implementation sequencing

Use the existing roadmap, refined by these design dependencies:

1. **Foundation:** confirm tokens, fonts, global shell, locale behavior, and content/asset provenance.
2. **Homepage:** implement the studio hero, selected works, intro, verified highlights, contact invitation, and footer.
3. **Works:** implement index, series grouping where supported, artwork detail, metadata, and accessible image viewing.
4. **About and CV:** implement only approved factual content.
5. **Contact:** implement approved contact route and functioning enquiry mechanism if configured.
6. **Quality:** responsive review, accessibility, SEO, image/performance optimization, automated tests, and release readiness.

Do not build later sections on invented content just to fill the layout. The content model and artist approvals are dependencies.

## 20. Decisions still requiring owner/artist approval

- Preferred public English name and transliteration.
- Primary language.
- Artist-approved statement and biography.
- Artwork selection, titles, dates, dimensions, and series.
- Which photographs can be used publicly.
- Contact method and whether artwork/commission enquiries are accepted.
- Verified CV/exhibition entries.
- Final font pairing and any artist-specific design preferences.
- Approval of the proposed homepage headline and intro.

**Final design intent:** every page should feel like another carefully arranged room in the same gallery. The homepage introduces the studio; Works lets the paintings speak; About introduces the person and practice; CV records verified professional history; Contact opens a clear professional conversation. Consistency comes from shared tokens, typography, spacing, image treatment, and interaction quality—not from forcing every page into the same layout.


## 21. Persistent full-page easel background

The shared portfolio shell may include the existing easel image as a quiet decorative background running along the physical left edge of the complete page. This is distinct from the homepage's animated studio hero.

The dedicated implementation contract is [easel-scroll-background.md](./easel-scroll-background.md). It is normative for asset verification, document-relative positioning, scroll-linked reveal, responsive behavior, RTL, reduced motion, performance, and QA.

Key design rules:
- The easel's top begins near the top-left of the document and its lower feet align near the bottom-left of the page composition.
- The middle structure is progressively revealed as the visitor scrolls; the effect reverses smoothly when scrolling upward.
- Use one shared decorative layer in the global shell, not duplicated per section.
- Keep it physically left in both English and Persian; never mirror the easel for RTL.
- Reserve a content safe zone and suppress or subdue the image on small screens when it harms reading or artwork presentation.
- The background never overlaps or visually competes with paintings, navigation, text, or controls.
- Reduced-motion and no-JavaScript modes use a stable static fallback.
- The easel is decorative to assistive technology and cannot intercept pointer or keyboard interaction.

Do not implement the effect until the exact `specification/assets/easel.png` has been inspected for intrinsic dimensions, transparency, visible bounds, and suitability. Follow the specialist document rather than guessing its crop or stretching it to page height.


## 22. Multiple galleries and artwork-led homepage

The portfolio supports multiple curated galleries, each with a title, short artist-approved description, cover artwork, curated artwork order, and its own detail page. The complete implementation contract is [gallery-collections-and-artwork-detail.md](./gallery-collections-and-artwork-detail.md). Homepage hero, Featured Works, and Featured Galleries are defined in [homepage-artwork-hero-and-featured-works.md](./homepage-artwork-hero-and-featured-works.md).

### 22.1 Homepage hero painting

- The homepage hero must prominently show one approved finished painting, not only a studio scene or decorative canvas layer.
- Initial candidate source: `specification/assets/artwork.JPG`. Inspect the actual image and confirm its intended role and public-use approval before implementation; do not infer suitability or title from its filename.
- Preserve full image ratio, orientation, color, texture, and canvas edges. No unapproved crop, filter, mirroring, or simulated brush movement.
- Place artist identity and clear Works/Galleries actions beside or below the image; avoid obscuring the painting with copy.
- Use a static image by default. Any subtle entrance effect must be optional and respect reduced motion.

### 22.2 Featured Works

- Place a substantial selected-paintings section in the middle of the homepage, normally 3–6 approved artworks where available.
- Each item shows its painting and approved title, with year/medium only when verified.
- Each item links to its artwork detail page when published; include a clear all-works link.
- Use canonical artwork records and explicit editorial order. Do not pad the section with placeholders.

### 22.3 Featured Galleries

- Include a distinct gallery-discovery section, normally 2–4 published galleries where available.
- Each preview includes cover artwork, gallery title, concise description, and a link to the gallery's own page.
- Include a link to the complete gallery index.
- Gallery cover and artwork records are reused, not duplicated.

### 22.4 Galleries index and detail

- The index presents all published galleries as editorial cards.
- Selecting a gallery title, cover, or Explore link opens its dedicated localized route.
- The gallery detail page shows its title, short description, and artwork collection in curated order.
- Artwork cards lead to individual detail pages when available.
- Route patterns must follow the existing App Router and locale convention; the dedicated contract describes conceptual patterns and fallback behavior.

The former studio-scene hero concept remains an optional studio/process feature only if separately approved and placed without displacing the hero painting. The artwork-led hero contract takes precedence for the homepage's primary visual.

## 23. Journal and events integration

The unified Journal experience is specified in [journal-and-events.md](./journal-and-events.md). It is one primary destination for editorial articles, exhibition announcements, studio updates, stories, and structured event entries; do not split Blog and Events into separate primary navigation items in the initial release.

- Add Journal to the shared primary sidebar on desktop and mobile.
- Add a Latest from the Journal section to the homepage after Featured Works and Featured Galleries, with a direct link to the Journal index.
- Use one Journal archive with type filters and shared detail-page shell; event entries expose structured date/time, time-zone, attendance, and location information only when confirmed.
- Keep event temporal status separate from editorial publication status; past events may remain in the archive.
- Follow the Journal specification for localization, responsive wireframes, content validation, SEO, accessibility, and acceptance criteria.
