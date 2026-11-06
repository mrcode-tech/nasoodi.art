# Bilingual Homepage Hero, CTAs, and Showcase — Technical Specification

## 1. Purpose

Define the homepage composition, responsive hero behavior, navigation actions, and selected-content sections without prescribing any production editorial values.

## 2. Hero content contract

The hero consumes profile data and optional visual assets through the repository/content layer. It may render:
- A profile image or other configured hero visual.
- A localized display name.
- A localized short biography or introduction.
- Two primary navigation actions.

Use generic content bindings such as ARTIST_NAME, BIOGRAPHY_TEXT, and HERO_IMAGE. Do not hardcode names, biography text, contact values, or image filenames in components or technical examples.

## 3. Desktop composition

At desktop breakpoints:
- Place the hero visual and introductory content in one horizontal composition.
- The image and text must remain visually balanced within the available main-content width.
- The image frame must occupy a meaningful share of the main-content area and preserve its intrinsic composition.
- Keep the name, biography, and primary actions grouped together.
- Avoid placing all text and actions below a full-width image when the desktop layout contract requires a side-by-side composition.
- The shared sidebar and main content must not overlap.

## 4. Mobile and tablet composition

At mobile widths:
- Reflow the hero into a single-column composition.
- The hero image uses the available content width.
- Introductory text follows the image.
- Primary actions remain visible and keyboard accessible.
- Avoid horizontal overflow and clipped text.
- Keep image and text order consistent with the semantic document order.

Tablet layouts must transition smoothly between the mobile stack and desktop horizontal composition.

## 5. Primary actions

The hero exposes two stable navigation actions:
- Explore collections: localized collection archive route.
- View selected works: localized artwork archive route.

The actions are interface controls, not editorial content. Their labels are localized through message resources. They should be hidden only when their destination is genuinely unavailable under the current publication rules.

## 6. Homepage content sections

The homepage may include:
- Selected artwork carousel.
- Featured collection carousel.
- A latest Journal preview.
- A single current event/Journal announcement when configured.
- Contact information.

Each section reads from its canonical repository. The page must adapt to empty, singleton, and multi-record datasets without layout errors.

The latest Journal preview is a bounded summary component, not a duplicate archive. Its item selection follows the publication-date sorting contract.

## 7. Carousel and viewer behavior

- Use the shared carousel component for sections that require carousel interaction.
- The number of visible items adapts to the viewport.
- Previous/next controls reflect the current navigation boundary.
- Keyboard interaction and reduced-motion preferences are respected.
- Selecting an artwork opens the shared viewer.
- Viewer navigation is limited to the active collection/context.
- Closing the viewer restores focus and the previous scroll position.
- Do not assert a fixed number of editorial records or a particular title in tests.

## 8. Image behavior

- Use the component's explicit object-fit contract.
- Preserve artwork proportions and avoid unintended cropping.
- When contain behavior creates letterboxing, use the current theme's page/background token rather than a fixed white background.
- Provide meaningful alt text from canonical data or an appropriate localized fallback.
- Missing optional images must not break the hero or archive layout.

## 9. Localization

- English layout uses LTR direction.
- Persian layout uses RTL direction.
- Physical alignment of navigation and controls follows the locale's direction contract.
- Mixed-direction values such as URLs and email addresses use bidi isolation.
- Content and interface translations remain separate.

## 10. Acceptance criteria

- Desktop hero uses the specified horizontal composition.
- Mobile hero stacks cleanly and uses the available width.
- Both primary actions navigate to the correct localized archive.
- Selected-content sections render dynamically for varying dataset sizes.
- Carousel and viewer controls work with keyboard and pointer input.
- No horizontal overflow occurs at supported viewport sizes.
- Light and dark themes use theme-aware image-frame backgrounds.
