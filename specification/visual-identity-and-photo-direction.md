# Visual Identity and Image Direction — Technical Design Contract

## Design intent

Use a restrained, contemporary gallery presentation. The interface should feel quiet and editorial, with visual content taking priority over decorative UI.

## Visual hierarchy

- Keep typography, spacing, and image composition consistent across routes.
- Use whitespace to separate sections rather than unnecessary borders or heavy cards.
- Prefer simple, clear navigation and restrained interaction feedback.
- Avoid promotional banner aesthetics and generic dashboard patterns.
- Keep controls visually secondary to the primary content.

## Theme system

- Use shared semantic color tokens for page background, surfaces, text, muted text, borders, and focus.
- Light and dark themes must use the same semantic token contract.
- Image frames use the current page/theme background token when contain behavior exposes empty space.
- Do not hardcode white or black image backgrounds where a theme token exists.
- Maintain readable contrast in both themes.

## Typography and localization

- Use the shared responsive typography scale.
- English and Persian must use appropriate font stacks and line-height values.
- Persian shaping, punctuation, numerals, and RTL alignment must be validated.
- Long localized titles and descriptions must wrap without clipping or overflow.
- Mixed-direction technical values retain their correct direction.

## Image presentation

- Preserve source aspect ratios unless a component explicitly requires cropping.
- Use contain for artwork reproductions where the full image must remain visible.
- Use cover only for decorative or portrait treatments where cropping is part of the approved component contract.
- Provide image dimensions and responsive sizing to reduce layout shift.
- Use descriptive alt text from canonical content.
- Do not include specific production image filenames or editorial image inventories in this specification.

## Responsive composition

Validate desktop, tablet, mobile, landscape, and short-height viewports. Sidebar, hero, archive cards, carousel controls, announcement callouts, and footer/contact surfaces must reflow without overlap or unintended horizontal scrolling.

## Motion

- Keep transitions subtle and purposeful.
- Respect prefers-reduced-motion.
- Avoid automatic movement that prevents users from reading or interacting with content.
- Ensure focus and scroll restoration after dialogs/viewers close.

## Acceptance criteria

The design system is token-driven, bilingual, responsive, accessible, theme-aware, and visually consistent. Individual editorial assets and content values remain outside technical documentation.
