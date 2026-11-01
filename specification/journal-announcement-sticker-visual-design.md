# Journal Announcement Sticker — Visual Design and SVG Asset Contract

**Status:** First vector design study prepared for owner review; not final visual approval  
**Project:** Nasoodi.art  
**Branch:** feature  
**Primary specification:** journal-announcement-specification.md  
**Source asset:** assets/journal-announcement-sticker.svg

## 1. Design intent

The announcement should resemble a small piece of exhibition paper physically attached to the edge of an artist's gallery. It is an editorial object belonging to the gallery, not a commercial promotion.

The visual should feel quiet, tactile, collected, and intentional. The paintings remain the primary visual content. The sticker is a secondary discovery detail: a visitor notices it at the edge, understands that an exhibition is upcoming, and can open the event entry.

Avoid sale-banner conventions: no percentage marks, prices, bursts, loud colors, gradients, glossy effects, oversized shadows, countdowns, or promotional urgency language.

## 2. Design concept: edge-pinned exhibition slip

The initial vector study uses a narrow landscape paper slip with:
- Warm ivory paper fill derived from the site's warm-paper palette.
- Fine warm-neutral outline.
- A gently irregular, hand-torn inward-facing edge.
- A small muted paper-tape detail near the attached/outer edge.
- Extremely restrained vector imperfections and fold/highlight lines.
- Transparent canvas outside the paper silhouette.

The straight outer edge is the attachment edge. The torn edge faces inward toward page content. For English, the attachment edge sits flush against the physical left viewport edge and the torn edge faces right. For Persian, reflect only the decorative silhouette horizontally so the attachment edge sits flush against the physical right edge and the torn edge faces left. Never mirror artwork or photography.

This is a design study, not final approval of the torn-paper variant. Review the rendered PNG at actual intended display size before approval.

## 3. Composition and geometry

- SVG viewBox: 420 × 280 units; 3:2 landscape ratio.
- CI review render: 1260 × 840 pixels (3× source dimensions).
- Background: transparent; only the paper silhouette and vector details are painted.
- No event title, category label, date, arrow, close icon, venue, logo, or interactive element may be baked into the SVG/PNG.
- HTML owns all text, links, dates, and dismissal controls.
- Keep the SVG decorative and hidden from assistive technology when used as a background or aria-hidden image.
- Avoid raster blur or image-processing texture. The paper character comes from paths, strokes, and a few vector marks.

The component's actual CSS width/height, top offset, safe-area offset, and z-index must be selected only after inspecting live shared-navigation geometry at desktop, tablet, and mobile sizes. Do not derive production offsets from the SVG viewBox.

## 4. Visual hierarchy

The paper silhouette is background/edge treatment only. Live component content order:
1. Localized eyebrow such as “UPCOMING EXHIBITION” (approved locale copy only).
2. Event title, with wrapping and no forced truncation.
3. Optional confirmed date/date range, omitted before the title is clipped.
4. Independent dismiss button with localized accessible name.
5. Optional small directional affordance that does not duplicate the link's accessible name.

Use project typography and semantic color tokens for all HTML content. The SVG palette is limited to warm paper, a fine warm-neutral edge, and a subdued tape accent; it must not introduce a new brand color.

## 5. Placement and mirroring

- English LTR: physical left edge flush; inward edge free and facing right.
- Persian RTL: physical right edge flush; inward edge free and facing left.
- The announcement is fixed to the viewport and does not move with page scroll or hero geometry.
- On mobile it must sit below the actual menu trigger and safe area; on desktop it must not obscure the wordmark or navigation.
- When reflecting the decorative SVG for Persian, preserve DOM reading order and do not transform the content/control layer.
- If shell geometry leaves no safe position, suppress the announcement at that breakpoint rather than overlap navigation, focused controls, artwork, or essential content.

## 6. Asset source and generation

The checked-in SVG is the single editable source of truth. It is authored directly as vector XML; no image generation, screenshot tracing, raster painting, or image-processing workflow is permitted or required.

GitHub Actions converts the SVG into a PNG review artifact using CairoSVG. The conversion:
- Runs on the existing Nasoodi.art CI workflow.
- Installs minimal system/runtime requirements in the CI runner.
- Renders at 3× dimensions to artifacts/journal-announcement-sticker.png.
- Verifies RGBA output, expected dimensions, transparent canvas, non-empty paper pixels, and absence of embedded text/raster image elements in the SVG.
- Uploads the PNG with the existing visual-QA artifact bundle.

The PNG is a generated CI artifact, not a separately hand-edited source file. Do not check in a generated PNG until the owner has reviewed the artifact and explicitly approves the selected variant. After approval, decide whether PNG is needed at runtime; if CSS/SVG is sharper and sufficient, keep SVG as the production asset and omit PNG from the application bundle.

## 7. Review states

Prepare screenshots or artifact previews for English and Persian desktop, tablet, and mobile; normal, keyboard-focus, dismissed, no-eligible-event, long-title, and short-height states; and actual intended display size plus 2×/3× inspection.

Owner review should determine:
- Does the paper read as an exhibition note attached to a gallery rather than a promotion?
- Is the torn edge subtle enough?
- Is the tape detail appropriate, or should it be removed?
- Is the size restrained relative to the sidebar and artwork?
- Does the object feel balanced when attached to either physical edge?

Do not call the study approved until the owner reviews the rendered artifact.

## 8. Acceptance criteria

- [ ] Source SVG is valid, editable vector XML with transparent outer canvas.
- [ ] SVG contains no text, logos, event facts, links, or controls.
- [ ] SVG contains no embedded raster images.
- [ ] PNG is rendered by GitHub Actions from the checked-in SVG.
- [ ] PNG is RGBA at 1260 × 840 and has transparent pixels outside the silhouette.
- [ ] Palette conforms to the existing warm-paper design direction.
- [ ] Inward torn edge and outer attachment edge are unambiguous.
- [ ] English and Persian edge attachment are represented in review screenshots.
- [ ] No visual approval is inferred from successful asset generation.

## 9. Responsive composition decisions — implementation review

The component uses three explicit placement variants. They share one localized event view model and dismissal behavior, but adapt to their real available width.

- **Viewport placement:** fixed to the physical outer edge. The normal event state has a compact minimum height of 7.5rem. Long titles may increase the paper height naturally; text must never be clipped or painted outside the paper.
- **Desktop sidebar:** uses the real navigation-column width with a 7.5rem minimum height. The content reserves an inline-end column for the independent 44×44 close control.
- **Mobile drawer:** uses the full drawer content width with a 7rem minimum height. The normal event state is designed to remain at or below 155px high, keeping the navigation drawer compact. Long titles may expand the sticker when required rather than overflow or be truncated.
- The live link participates in normal layout flow so the paper silhouette can grow with wrapped title content. The decorative SVG remains absolutely positioned behind it.
- The close control is inset from the component edge to account for the SVG's transparent side margins, keeping the full target visibly on the paper in both LTR and RTL.
- All placements use logical block/inline spacing. The decorative SVG alone is mirrored for Persian; the content and controls are not transformed.
- The component exposes stable `data-part` hooks for visual/behavioral browser tests. Tests must not target CSS-module implementation class names.
- The paper SVG remains a provisional first study pending owner review. Responsive screenshots and the CI PNG are technical review evidence, not visual approval.

If the actual sidebar/drawer geometry changes, update the relevant variant and its screenshot evidence rather than applying global scale or transform fixes.

## 10. Responsive screenshot review — evidence and status

The CI workflow captures English and Persian screenshots for the viewport announcement, desktop sidebar, and mobile drawer at desktop, tablet, standard mobile, narrow mobile, and short-height sizes. It also captures synthetic long- and short-title states in all three placements.

The browser contract checks:
- The close target remains at least 44×44 CSS pixels.
- The close target stays at least 12px inside the component's horizontal bounds, accounting for the SVG's transparent side margins.
- The title and close control do not overlap.
- Title content remains within the paper's vertical and horizontal bounds, including long-title states.
- The sticker remains contained by the drawer and the page has no horizontal overflow.
- Activating the event link from the mobile drawer closes the drawer and navigates to the localized Journal detail route.

The previous CI runs exposed real title/control geometry issues and a mobile height excess. Those findings were used to refine the CSS and strengthen the assertions. A successful latest full CI run is still required before marking this responsive matrix verified. Do not claim visual verification solely because screenshots were generated; inspect the uploaded screenshots at actual display size.

The PNG and responsive screenshots are technical review evidence only. They do not constitute owner approval of the final paper silhouette or tape detail.

## 11. Compact editorial treatment and mobile event navigation — 2026-11-01

The owner requested a thinner, more minimal sticker in both sidebar contexts, especially on mobile so it does not create unnecessary drawer scrolling.

- The viewport announcement has a 7.5rem minimum height and grows only when its live title content requires additional space.
- The desktop sidebar has a 7.5rem minimum height, compact typography/spacing, and a reserved inline-end column for the close control.
- The mobile drawer has a 7rem minimum height, compact typography/spacing, and a normal-state target of no more than 155px high. Its height may grow for unusually long titles instead of clipping content.
- The close control remains a separate 44×44 target, inset far enough to sit on the visible paper rather than in the SVG's transparent outer margin.
- Activating the announcement link inside the mobile drawer closes the drawer while navigating to the event's localized Journal detail route. Dismissing remains a separate, non-navigation action.
- Playwright checks the mobile sticker's normal-state maximum height and verifies that activating its link both navigates to the event and closes the dialog.
