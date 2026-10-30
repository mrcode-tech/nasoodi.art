# Nasoodi.art — Full-Page Easel Scroll Background Specification

**Status:** Proposed visual/interaction specification  
**Scope:** Decorative, full-page easel background used across the portfolio shell  
**Primary asset:** `specification/assets/easel.png`  
**Working branch:** `feature`

## 1. Intent

Use the existing easel image as a distinctive, quiet visual signature that runs down the **left edge of the entire website**. The easel should feel like a physical studio object standing beside the visitor while they explore the portfolio.

This is a persistent page-background composition, not a hero-only image and not a fixed image that remains at one viewport coordinate. Its full vertical form should relate to the page's overall scroll length:
- The top of the easel begins at the top-left of the document.
- The lower end/feet of the easel reach the lower-left end of the document.
- As the visitor scrolls, the viewport reveals successive vertical portions of the easel; the middle structure becomes visible naturally during the journey.
- The easel remains visually behind content and never competes with paintings, text, controls, or navigation.

The desired result is elegant and atmospheric: a subtle studio presence, not a loud parallax effect.

## 2. Reference and creative interpretation

The owner supplied [MotionSites](https://motionsites.ai/) as inspiration for smooth animated website backgrounds. Its public site presents curated animated-background and hero-section inspiration. Use it as a reference for polish, restrained motion, and smoothness only.

Do not copy a specific MotionSites design, source code, proprietary asset, prompt, or animation verbatim. The easel treatment must be original and tailored to Nasoodi.art's warm, painterly visual identity.

## 3. Asset verification gate

Before implementation:
1. Open and inspect the exact repository asset at `specification/assets/easel.png`.
2. Record its intrinsic width, height, aspect ratio, alpha transparency, visible bounds, color profile, and file size.
3. Determine whether it is a full easel cutout, a photograph with a background, or an already-composited scene.
4. Confirm artist/site-owner permission to use it as a site-wide decorative asset.
5. Inspect the top, middle, and bottom visible regions so placement is based on actual content, not filename assumptions.
6. Do not crop, recolor, mirror, distort, regenerate, or remove parts of the asset without explicit approval.

If the PNG is not transparent, do not assume that CSS blending or background removal is acceptable. Use the supplied image as-is and adapt the layout. If the image is unsuitable for a continuous full-page treatment, stop and propose a crop/asset-preparation decision rather than fabricate missing easel parts.

## 4. Positioning model

### 4.1 Document-relative composition

The preferred model is a document-relative decorative layer whose rendered vertical extent is tied to the page's content height, not the viewport height.

- Anchor its top at document top / page start.
- Align its visual left edge with the left side of the page's content canvas, accounting for safe area and responsive gutters.
- Preserve the image's intrinsic aspect ratio.
- Scale the image proportionally so its complete top-to-bottom structure can be seen over the page's vertical journey.
- The lower feet/base must land near the bottom of the page content, with enough breathing room that they are not clipped by the footer.
- The middle portion should naturally pass through the viewport as the visitor scrolls from upper to lower sections.

Avoid hardcoding a single page pixel height. The document may grow when artwork cards, translations, or content change. Recalculate/size against actual content or use a robust layout relationship so the easel remains aligned to the page's full scrollable composition.

### 4.2 Layering and content safe zone

- Place the easel on a dedicated decorative layer behind page content.
- The main content column must remain readable and must not overlap the easel's opaque/visually dense area.
- Use a content safe zone: reserve left-side space on wide screens where the image is prominent; on smaller screens, reduce its scale/opacity or remove it if it harms readability.
- Header, navigation, menus, dialogs, artwork images, forms, and footer controls must render above the easel.
- The background layer must have no pointer interaction and must not intercept clicks, selection, focus, or touch.
- Never place easel detail over an artwork image or make a painting look like it is mounted on the easel unless that is the actual supplied composition and has been approved.

### 4.3 Left/right locale behavior

The easel is a physical scene element, not a directional UI control:
- Keep it on the **physical left side** in both English LTR and Persian RTL.
- Do not mirror or flip it in Persian.
- Use CSS logical properties for content layout, but use an explicit physical-left anchor for this decorative asset.
- Ensure Persian content remains comfortably readable and does not collide with the easel.

## 5. Scroll-linked motion

### 5.1 Core behavior

The scroll experience should reveal the easel as a continuous long-form background. The preferred effect is a restrained scroll-linked vertical translation or background-position progression that makes the top, middle, and lower structure enter the viewport in sequence.

The animation must preserve the user's requested spatial relationship:
- At the top of the page, the easel's top is aligned near the page's top-left.
- Through scrolling, the middle section becomes visible; it must not jump, pop, or appear from an unrelated location.
- Near the end of the page, the lower section/feet become visible near the bottom-left.
- The easel's movement is subtle and tied to scroll progress; it must not feel detached from the page or move faster than the reading experience.

Use a single coherent scroll mapping for the page, not independent arbitrary animations per section. The animation should be continuous and deterministic in both scroll directions. Scrolling upward must reverse the progression smoothly.

### 5.2 Preferred technical approach

First choice: CSS-driven layout and scroll-linked animation where browser support and the project's framework/browser matrix make it reliable. Use progressive enhancement and feature detection; the non-animated document-relative background must remain correct without scroll-timeline support.

Fallback: a lightweight requestAnimationFrame-throttled scroll progress calculation using passive scroll observation and transforms, only if CSS scroll-linked animation is not sufficiently supported or controllable. Avoid React state updates on every scroll frame, layout reads/writes in a hot loop, and heavy animation libraries for one decorative element.

Do not use a continuously running animation. The easel should respond to actual scroll position, not drift on its own.

### 5.3 Motion character

- Smooth, low-amplitude, slow-feeling movement.
- No bounce, elastic overshoot, spring wobble, rotation, shaking, or artificial depth distortion.
- No scale pulsing or opacity flashing.
- No abrupt section-boundary resets.
- Avoid a parallax ratio that makes the easel appear to float independently of the page.
- Do not animate the easel when the user is idle.
- Keep the easel's shape and proportions stable; no perspective warp.

The image may have a very subtle opacity treatment if necessary to keep content legible, but never tint it with a strong brand color or use a blend mode that changes its natural appearance. Prefer correct sizing and content spacing over opacity tricks.

## 6. Responsive behavior

### Desktop / wide screens
- Show the complete visual identity of the easel along the left edge.
- Preserve its top-to-bottom relationship to the page.
- Reserve enough horizontal content space to avoid collisions.
- The easel must not reduce the main reading column to an awkward width.

### Tablet
- Reduce easel scale and/or visual prominence.
- Keep page content dominant.
- Re-evaluate safe zone and scroll range; do not simply apply desktop offsets.

### Mobile
- The full easel may be too dominant or consume valuable reading width.
- Use a simplified treatment: narrow, subdued edge detail or hide it entirely when content width, navigation, or artwork clarity would suffer.
- Do not force horizontal overflow.
- Keep all controls and text fully usable.
- Avoid a heavy large image download on mobile if the asset is not displayed.

Breakpoint values must follow the existing design tokens and be verified in actual browser screenshots, not invented independently in this document.

## 7. Page coverage and exceptions

The background should be shared by the global site shell so it remains consistent across:
- Home.
- Works index.
- Artwork detail.
- About.
- CV/Exhibitions when populated.
- Contact.

The effect must work with pages of different heights. Short pages must not stretch the easel unnaturally; long pages must not leave the middle or bottom detached. For very short pages, use a minimum natural height or a static crop/placement that does not distort the source. For pages where an artwork is displayed edge-to-edge or a focused reading task requires a clean canvas, the shell may suppress or further subdue the background according to explicit page-level variants.

Do not add separate easel images to every page component. There must be one shared implementation and one source of truth for its behavior.

## 8. Visual integration

- Use the approved site palette from `visual-identity-and-photo-direction.md`.
- Treat the easel as a quiet warm studio detail; it should support, not replace, the paintings.
- Do not add text, labels, shadows, decorative strokes, or invented objects to the easel.
- Keep a clear visual hierarchy: artist identity and artwork first, easel second, interface decoration last.
- Review against both light and any approved alternate theme; if a dark theme is not part of the product, do not introduce one solely for this effect.

## 9. Accessibility and user preferences

- The easel is decorative and should be hidden from assistive technology (`alt=""` / `aria-hidden="true"`, as appropriate).
- It must not add focusable elements or accessible-name noise.
- Respect `prefers-reduced-motion: reduce`: disable scroll-linked movement and use a static document-relative placement or hide the asset if the static form is distracting.
- Provide a no-motion fallback when JavaScript is disabled or animation APIs are unavailable.
- Do not capture wheel/touch events, hijack scrolling, snap scroll positions, or delay navigation.
- Content contrast and reading order must remain correct independently of the easel.

## 10. Performance and implementation constraints

- Use the existing local PNG asset; do not fetch the image from a third-party host.
- Inspect whether the asset is large; if necessary, prepare an approved optimized derivative without altering visual content or transparency.
- Avoid loading it on routes/breakpoints where it is hidden, if the framework implementation allows this without layout instability.
- Keep the effect to one decorative layer; avoid duplicate full-page copies.
- Prefer transform/opacity over layout-affecting animation.
- Avoid expensive filters, backdrop-filter, blend modes, and large blur.
- Reserve dimensions to prevent layout shift.
- Ensure no horizontal scrollbar is introduced.
- Do not add a new dependency unless a measured need justifies it.
- Do not run scroll calculations at a frequency higher than display refresh; do not update React component state on every scroll event.

## 11. QA and evidence

Capture screenshots and review scroll recordings at:
- Desktop: top, approximately 25%, 50%, 75%, and bottom of page.
- Tablet: top, middle, and bottom.
- Mobile: top, middle, and bottom, including a short viewport.
- English LTR and Persian RTL.
- Reduced-motion mode.
- Short and long pages.
- With actual artwork cards/images and footer content present.

Verify:
- The easel top aligns with the page's top-left as intended.
- Its bottom/feet reach the lower-left page area without clipping.
- The middle is revealed progressively during scroll.
- Upward scroll reverses smoothly and deterministically.
- No jumps occur at section boundaries or after image/font load.
- Main content never collides with the easel.
- Artwork colors and texture are unchanged.
- No pointer/focus interception, horizontal overflow, or layout shift.
- Mobile fallback is calm and readable.
- Reduced-motion mode has no scroll-linked movement.

Record browser, viewport, route, locale, commit, and actual screenshots/video artifacts. Artist/site-owner visual approval is required before release.

## 12. Acceptance criteria

The feature is complete only when:
1. The exact approved `specification/assets/easel.png` is used.
2. The image is anchored to the physical left and is not mirrored for RTL.
3. The top and lower ends align to the beginning and end of the page composition.
4. The middle easel structure is naturally revealed as the visitor scrolls.
5. Scroll motion is subtle, reversible, continuous, and never autonomous.
6. It works across page heights and all supported viewports.
7. Reduced-motion and no-JavaScript fallbacks are correct.
8. Content, navigation, and paintings remain dominant and unobstructed.
9. Performance, accessibility, and visual QA pass.
10. Artist/site-owner approves the final result.

## 13. Out of scope

- Replacing or retouching the easel image.
- Generating new studio objects or painting pixels.
- Animating a fictional painting process.
- Adding a cursor-following effect, scroll hijacking, or background video.
- Copying MotionSites assets, code, or a specific animation.
- Adding a new animation dependency without evidence.
- Changing the overall site palette or redesigning unrelated sections.
