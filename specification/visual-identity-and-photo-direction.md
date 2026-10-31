# Nasoodi.art — Visual Identity, Reference Photograph, and Homepage Art Direction

**Status:** Proposed visual direction based on the owner-supplied reference photograph  
**Working branch:** feature  
**Reference image:** Owner-supplied vertical studio photograph, 1152 × 1536 px (3:4)  
**Purpose:** Define a distinctive visual identity and a practical first homepage direction.

---

## 1. Executive design decision

Build Nasoodi.art as a **warm contemporary artist's studio presented with the restraint of a small independent gallery**.

The photograph has three useful visual layers:

1. **The painting:** a broad atmospheric field of muted mauve, smoky violet-grey, taupe, and dark plum-brown.
2. **The artist at work:** an intimate studio moment; the artist is seen from behind, holding a brush and facing a large canvas.
3. **The light clothing and studio light:** a soft pale grey-white counterpoint that suggests a quiet paper-like interface.

Borrow the photograph's tonal relationships, not its indoor lighting. Use light warm neutrals for the main reading surfaces, muted mauve/taupe for restrained accents, and deep warm charcoal/umber for text. The site should not become brown, dark, or monochromatic.

**Design principle:** the website is a frame for the paintings and the artist's practice. The interface must never compete with, recolor, crop, or visually overpower the artwork.

## 2. Photograph examination

The image is a vertical studio photograph (1152 × 1536 px, 3:4). It shows the artist from behind, positioned in front of a large canvas on an easel. A brush is visible in the artist's hand. The canvas fills most of the photograph and contains a subdued atmospheric composition, with a lighter horizontal area toward the upper-middle and deeper dark tones below. Part of the studio wall/easel and the artist's light garment are also visible.

This is a **studio/process photograph, not a clean reproduction of the painting**. It communicates scale, presence, and the act of painting. It should not be presented as though the entire photograph were the artwork, and it should not replace a straight-on, color-accurate image of a finished painting in the Works gallery.

### Strengths

- The canvas creates a large, immediate art context.
- The back-facing pose feels candid and focused rather than staged.
- The brush gives a clear cue that this is an active working moment.
- The pale shirt separates the figure from the darker lower part of the canvas.
- The muted palette is distinctive and gives the website a coherent visual starting point.

### Limitations

- Warm indoor light affects the apparent color of the whites and neutrals.
- The painting is photographed in context and at an angle, not as a calibrated straight-on reproduction.
- The artist's face is not visible. Do not describe facial appearance or present this as a conventional portrait.
- The artist partially obscures the canvas. This is appropriate for a process image, but unsuitable as the only artwork image on a detail page.

## 3. Extracted color palette

Colors were sampled from the supplied image using pixel clustering. Canvas-focused samples came from visible areas of the painting; whole-photo samples also include the shirt, skin, easel, and studio. These are representative samples from this one photograph, not claims about the artist's entire body of work.

### 3.1 Source colors

| Token | Hex | Visual role | Suggested use |
|---|---|---|---|
| Canvas Mauve Taupe | #837369 | Frequent canvas midtone | Main muted accent; rules and selected states |
| Smoky Umber | #675A51 | Deep grey-brown canvas midtone | Secondary text and quiet surfaces |
| Warm Greige | #9F8B7C | Soft warm canvas highlight | Secondary neutral and hover surfaces |
| Deep Earth | #533F30 | Dark brown painted area | Small accent and footer details |
| Dark Studio Umber | #382517 | Very dark shadow/easel tone | Avoid as a large background |
| Muted Sand | #C5B197 | Warm light canvas tone | Fine accent and subtle highlights |
| Soft Garment White | #E6E4DD | Light shirt highlight | Inspiration for light page surfaces |
| Warm Pale Grey | #D4CFC6 | Shirt and soft neutral light | Borders and quiet panels |
| Dusty Mauve | #726059 | Visible lower-left canvas tone | Artwork-adjacent accent |

### 3.2 Proposed website tokens

These are proposed interface colors. Some are intentionally lighter or darker than the sampled source values to improve readability.

| Token | Proposed hex | Usage |
|---|---|---|
| Paper | #F3F0EA | Main page background |
| Paper Raised | #FAF8F4 | Cards, menus, form surfaces |
| Paper Muted | #E8E2DA | Subtle section alternation |
| Ink | #302824 | Primary text and headings |
| Ink Muted | #6B5D55 | Secondary text; verify contrast |
| Mauve | #837369 | Restrained main accent |
| Mauve Deep | #675A51 | Active navigation and quiet emphasis |
| Taupe Light | #C5B197 | Fine details and small highlights |
| Earth | #533F30 | Occasional icon or footer accent |
| Line | #D8D0C7 | Borders and understated separators |
| White | #FFFFFF | Selective contrast, not the only page background |

Do not use every token in every component. A page should mostly read as paper + ink, with mauve/taupe appearing in small deliberate amounts. Avoid saturated accents, violet gradients, pure-black-heavy layouts, and a full dark theme as the default.

### 3.3 Interface color balance

Suggested starting balance for interface surfaces (not artwork):

- 70% warm paper and raised-paper neutrals.
- 20% artwork imagery and its natural colors.
- 8% ink, warm grey, and structural borders.
- 2% muted mauve/sand accents.

The artwork's own color distribution must remain untouched. Do not apply these proportions to paintings.

### 3.4 Accessibility

The sampled mauve/taupe is a midtone, not a reliable text color on every background. Use the dark ink token for body text and small labels. Do not place small white text on #837369 without checking contrast. Do not use color alone to indicate selected, active, sold, or unavailable states. Verify WCAG 2.2 AA contrast for actual text/background pairs after typography and component states are implemented.

## 4. Photo usage strategy

Treat the supplied image as a **signature process/studio photograph** and a secondary identity image, not as the master artwork asset.

### Recommended placements

1. **About page — preferred:** place it beside a short artist-approved introduction or statement excerpt. It gives visitors a human sense of the artist's practice without requiring a staged portrait.
2. **Homepage supporting content — optional:** it may appear as a secondary studio/process image only when the approved finished painting remains the primary hero artwork. It must not displace or visually overpower that painting.
3. **Studio/process section — optional:** if more process photographs are supplied and approved, create a small editorial section. Do not invent a process narrative from this single image.
4. **Social preview — conditional:** it may be used as an Open Graph image if the artist approves it for public promotion and the crop remains recognizable.

### Do not use it for

- A substitute for a clean, straight-on photograph of a finished painting in the Works gallery.
- An artwork detail page's primary artwork image.
- A full-screen background behind text.
- A tiny thumbnail where the artist and canvas become unreadable.
- A repeated background texture or decorative pattern.
- A forced crop that removes the brush or canvas context in a misleading way.

### Crop and responsive guidance

- Preserve the native 3:4 portrait ratio wherever possible.
- For any supporting studio/process placement, prefer the full image with contain when the layout allows. If cover cropping is required, review the focal point manually at each breakpoint.
- Keep the artist and a meaningful area of canvas visible.
- Avoid cutting off the brush/brush hand or making the artist appear detached from the canvas.
- Keep enough of the upper canvas visible to communicate scale.
- Do not mirror the image for Persian RTL.
- Avoid aggressive sharpening, denoising, warm filters, contrast boosts, or automatic color grading.
- Generate responsive AVIF/WebP derivatives from the approved master, and compare them against the source so subtle canvas gradations and shadows remain intact.
- Provide explicit dimensions/aspect ratio to prevent layout shift; prioritize the hero and lazy-load lower-page images.

### Suggested accessible description

“The artist, seen from behind, paints at an easel in front of a large muted-toned canvas.”

This is suggested alt text for the photograph itself. If the image is purely decorative beside equivalent text, use empty alt text instead. Do not describe hidden facial features or infer the painting's subject matter.

## 5. Homepage visual composition

### 5.1 Desktop direction

Use a restrained editorial layout with generous outer margins and a clear distinction between navigation, image, and text.

~~~text
┌──────────────────────────────────────────────────────────────────────┐
│ GHAZALEH NASOODI       WORKS  GALLERIES  JOURNAL  ABOUT   فارسی | EN │
├──────────────────────────────────────────────────────────────────────┤
│ GHAZALEH ABDOLAHZADE NASOODI       ┌──────────────────────────────┐ │
│ Oil Painter                        │                              │ │
│ [Approved short introduction]      │    FINISHED PAINTING         │ │
│ Explore works →                    │    full composition          │ │
│                                    │                              │ │
│                                    └──────────────────────────────┘ │
│ [Optional studio/process image lower on page or About]              │
│ SELECTED WORKS · FEATURED GALLERIES · LATEST FROM THE JOURNAL         │
└──────────────────────────────────────────────────────────────────────┘
~~~

The primary homepage hero must feature an artist-approved finished painting, as specified in homepage-artwork-hero-and-featured-works.md. This studio photograph is supporting process imagery only. Keep the artist's name in a clear typographic hierarchy and avoid placing text over artwork.

### 5.2 Mobile direction

~~~text
┌────────────────────────────────┐
│ GHAZALEH NASOODI    MENU  FA/EN │
├────────────────────────────────┤
│ GHAZALEH ABDOLAHZADE NASOODI    │
│ Oil Painter                    │
│ [Short approved introduction]  │
│                                │
│ ┌────────────────────────────┐ │
│ │    FINISHED PAINTING       │ │
│ │    full composition        │ │
│ └────────────────────────────┘ │
│ Explore selected works →       │
├────────────────────────────────┤
│ SELECTED WORKS                 │
│ [Painting]                     │
│ Caption                        │
│ [Painting]                     │
│ Caption                        │
├────────────────────────────────┤
│ ABOUT                          │
│ [Approved excerpt]             │
│ CONTACT · INSTAGRAM            │
└────────────────────────────────┘
~~~

On narrow screens, place the artist's name and role before the photograph so the identity is immediately clear. Keep the image full-width within page margins and preserve its aspect ratio.

### 5.3 Persian and English behavior

- Use the same art direction in both locales; do not create separate visual identities.
- Apply true RTL layout for Persian and LTR layout for English.
- In Persian, text and navigation should follow RTL reading order, while the photograph remains unmirrored.
- Isolate Latin names, URLs, and social handles with correct bidirectional behavior.
- Check that the chosen font pairing gives Persian and Latin wordmarks comparable visual weight.
- Primary language remains an owner decision; do not infer it from the artist's location.

## 6. Typography and graphic language

Choose a refined editorial serif or humanist display face for large English headings, paired with a highly readable sans-serif for body copy and navigation. For Persian, choose a Persian-capable family with excellent shaping and readable text sizes; use a deliberate pairing rather than forcing a Latin font to cover Persian.

Check Persian glyph shaping, connected forms, legibility on mobile, numerals, punctuation, mixed Persian/Latin strings, font licensing, and local hosting/performance. Avoid faux letter spacing on Persian text and overly thin weights for small captions.

Graphic details:
- Fine warm-grey rules, small editorial section labels, and generous whitespace.
- Restrained, consistent arrow and external-link indicators.
- Square or subtly rounded image corners; avoid pill-shaped gallery cards.
- No glassmorphism, neon gradients, oversized shadows, generic blobs, or ornamental patterns unrelated to the artist's work.
- Understated buttons: clear text links for navigation and one deliberate filled/outlined style for important enquiry actions.
- Captions should be quiet and close to the associated image.

## 7. Design system starting tokens

Implement semantic tokens centrally using the project's existing styling conventions. These are starting values, not a mandate to hardcode colors into components.

~~~css
:root {
  color-scheme: light;
  --color-paper: #F3F0EA;
  --color-paper-raised: #FAF8F4;
  --color-paper-muted: #E8E2DA;
  --color-ink: #302824;
  --color-ink-muted: #6B5D55;
  --color-mauve: #837369;
  --color-mauve-deep: #675A51;
  --color-taupe-light: #C5B197;
  --color-earth: #533F30;
  --color-line: #D8D0C7;
  --content-max: 1440px;
  --page-gutter: clamp(1.25rem, 4vw, 4.5rem);
  --section-space: clamp(4rem, 9vw, 8rem);
}
~~~

Select licensed Latin and Persian font families during implementation. Do not add an unlicensed font or unnecessary external font request.

## 8. Component direction

Build on the repository's existing Next.js/Tailwind/component conventions. Suggested reusable components:

- SiteHeader: wordmark/name, primary navigation, locale switcher, accessible mobile menu.
- StudioHero: artist identity, approved short intro, process photograph, Works CTA.
- StudioImage: responsive image with preserved ratio and optional caption.
- SectionEyebrow: small editorial section label.
- ArtworkGrid: artwork-first layout preserving each original aspect ratio.
- ArtworkCard: image, title, and known metadata only.
- ArtistIntro: approved statement excerpt and About link.
- SiteFooter: contact, Instagram, language, and copyright.

Do not implement CV, exhibition, contact-form, sales, or commission claims until content and behavior are confirmed. Components should gracefully omit unknown optional content.

## 9. Image/content separation

Keep asset classes distinct:

| Asset class | Role | Required source |
|---|---|---|
| Studio/process photograph | Human context and homepage/About imagery | Owner/artist-approved source |
| Artwork master | Accurate gallery and detail presentation | Original, straight-on image of finished work |
| Artwork detail crop | Brushwork/surface close-up | Artist-supplied crop or approved derivative |
| Artist portrait | Optional About identity image | Separate artist-approved portrait |
| Social/press crop | Sharing preview | Derived from an approved source with reviewed crop |

The supplied photograph must not be stored in the artwork catalogue as if it were a finished painting. Give it an explicit content role such as studio-process in the asset/content model. Preserve the original file and track usage approval.

## 10. Quality gates before sign-off

### Visual review
- [ ] Compare rendered palette against the supplied reference.
- [ ] Confirm the page reads as warm paper and dark ink, not a brown/dark theme.
- [ ] Confirm the photograph remains recognizable as a studio/process image.
- [ ] Review all hero crops at mobile, tablet, desktop, and short-height screens.
- [ ] Ensure the photograph is not mirrored in Persian.
- [ ] Ensure real artwork images are not filtered or cropped to match the UI.

### Accessibility
- [ ] Check WCAG 2.2 AA contrast for every real foreground/background pair.
- [ ] Verify keyboard navigation and visible focus.
- [ ] Verify mobile menu and locale switcher names/states.
- [ ] Provide meaningful alt text or empty alt for decorative use.
- [ ] Respect reduced-motion preferences.

### Content and rights
- [ ] Confirm artist approval to use the supplied studio photograph publicly.
- [ ] Confirm preferred English name spelling and primary language.
- [ ] Replace draft introduction with artist-approved text.
- [ ] Add only original artwork images with permission and verified metadata.
- [ ] Do not publish fictional artwork titles, dates, dimensions, exhibitions, or availability.

### Performance
- [ ] Use responsive image derivatives and explicit dimensions.
- [ ] Prioritize only the hero image.
- [ ] Lazy-load below-the-fold imagery.
- [ ] Verify optimized images preserve subtle tonal gradations.

## 11. Decisions and follow-up assets

The visual direction can serve as the design baseline, but final sign-off needs:
1. Artist approval to use the supplied studio photograph on the public site.
2. Original, straight-on photographs of selected finished paintings for the Works gallery.
3. Preferred English name spelling and primary language.
4. Artist-approved short introduction/statement excerpt.
5. Confirmation whether additional studio/process photographs exist.
6. Final font selection after Persian/English rendering review.

## 12. Final recommendation

Adopt the **warm paper + smoky mauve + deep umber** identity. Use the supplied photograph as the signature studio/process image in the homepage hero and About page, with a carefully reviewed portrait crop and no color filters. Let actual finished paintings occupy the Works gallery in their original proportions and colors. This creates a coherent relationship between the artist's working environment and the portfolio while keeping the artwork itself at the center of the experience.

## 11. Unified design-engineering refinement

This visual identity is the source of truth for the site's creative direction and must be interpreted through [design-direction-and-system-refinement.md](./design-direction-and-system-refinement.md) and [design-engineering-skills.md](./design-engineering-skills.md).

Refinement rules:
- Preserve the warm contemporary studio / independent-gallery identity; do not replace it with a generic luxury-commerce, SaaS, or AI aesthetic.
- Treat the proposed palette as semantic roles, not a requirement to use every color on every page. Verify all foreground/background combinations against WCAG 2.2 AA.
- Establish a licensed Persian/Latin type pairing and test actual glyph shaping, line wrapping, and optical hierarchy before finalizing font tokens.
- Use editorial asymmetry and varied whitespace intentionally; avoid repeating identical card grids or wrapping every section in a card.
- Keep finished paintings dominant and unaltered. The studio photograph remains process context and is not a finished artwork.
- The easel, studio image, and any motion are subordinate layers. They must never obscure or compete with artwork.
- Any theme selector or dark theme must be reconciled with the product/navigation decision. Do not invent a dark palette by simply inverting light tokens.

The exact font families, dark-theme scope, final contrast-safe accent variants, and final image crop approvals remain open until inspected and approved.
