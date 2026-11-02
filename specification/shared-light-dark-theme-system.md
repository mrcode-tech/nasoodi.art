# Nasoodi.art — Shared Light and Dark Theme System Design Specification

**Status:** Owner-approved design direction; detailed implementation contract  
**Project:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Primary design direction:** The Artist's Quiet Gallery  
**Dark theme name:** Midnight Gallery  
**Locales:** Persian (`fa`, RTL) and English (`en`, LTR)  
**Technology direction:** Next.js App Router, Tailwind CSS 4, shadcn/ui, shared semantic design tokens, and `next-themes` where compatible with the existing implementation

## 1. Purpose and scope

This specification defines one shared design-system capability: a complete light/dark theme system for every public Nasoodi.art route and shared interface component.

The two themes are not separate page designs. They are two coordinated presentations of the same identity:

- **Light:** a quiet, warm-paper artist's gallery in daylight.
- **Dark:** an atmospheric midnight gallery, shaped by deep blue skies, dark blue-grey environments, earthy ground tones, warm canvas surfaces, and restrained accents.

The shared design system—not individual pages—owns theme state, semantic color tokens, theme selection, and global component behavior. Pages consume semantic tokens and shared components. They must not create independent theme implementations or page-specific copies of the palette.

This specification covers visual direction, palette, token architecture, theme preference behavior, navigation integration, page/component treatment, accessibility, localization, responsive behavior, testing, and release acceptance. It does not assert that the feature is already implemented.

## 2. Binding design principles

### 2.1 Preserve the existing light theme

The currently approved light appearance is the baseline and must remain visually equivalent after implementation. Inspect the actual repository values before changing anything.

Preserve the existing warm-paper palette, typography, spacing, editorial rhythm, whitespace, sidebar, navigation, artwork presentation, Journal sticker, page composition, and responsive behavior. The theme selector is the only expected new visual control.

Do not use this work as an opportunity to redesign the light theme, re-layout pages, replace typography, change content, or alter artwork presentation.

### 2.2 Midnight Gallery is atmospheric, not generic

Dark mode should evoke a calm gallery at night. Use deep midnight blue as the environmental foundation, blue-grey surfaces for depth, warm ivory for text, and restrained mauve/sand/umber details.

Do not use pure black as the primary background, neon/electric blue, saturated purple, high-gloss gradients, glassmorphism, glowing controls, heavy shadows, excessive borders, or generic dashboard styling.

### 2.3 Artwork remains the focal point

Artwork is never recolored to match a theme. The theme changes only the surrounding interface. Original image assets, pixels, color, brush texture, orientation, proportions, signatures, and approved crop behavior remain unchanged.

Never apply theme-dependent filters, brightness/contrast, opacity, blend modes, overlays, hue rotation, mirroring, or image-processing derivatives to paintings or artist photographs.

### 2.4 Shared system, not page-by-page theming

Define the palettes and semantic roles centrally. Shared components and all pages consume the same token contract. A page may introduce a genuinely unique semantic role only through the shared design-token authority, with both light and dark values and documented contrast verification.

Do not scatter palette hex values across page components or add local dark-mode overrides as a substitute for shared tokens.

## 3. Palette specification

### 3.1 Existing light palette — preserve as source of truth

The light theme remains the current approved Nasoodi palette. The known core colors are:

| Existing role | Reference value | Intended use |
|---|---:|---|
| Warm Paper | `#F3F0EA` | Main page environment |
| Raised Paper | `#FAF8F4` | Raised/paper surfaces |
| Warm Ink | `#302824` | Main text |
| Canvas Mauve | `#837369` | Muted accent |
| Smoky Umber | `#675A51` | Deep warm accent/text |
| Muted Sand | `#C5B197` | Warm highlight |

The repository may contain additional or more precise existing values (for example muted paper, border, or secondary text). Inspect and preserve those values. Do not replace the actual light palette with this abbreviated reference list.

### 3.2 Approved dark palette — Midnight Gallery

The following hexadecimal values are the authoritative dark palette direction:

| Palette name | Hex | Semantic intent |
|---|---:|---|
| Midnight Blue | `#101A2B` | Main page background |
| Deep Blue | `#172438` | Sidebar and secondary environment |
| Gallery Slate | `#202F42` | Cards and elevated surfaces |
| Blue Charcoal | `#2B3542` | Interactive/hover surface |
| Warm Ivory | `#EAE4D9` | Primary text and headings |
| Soft Ash | `#B9B5AE` | Secondary text |
| Smoky Mauve | `#A18C83` | Subtle accent and decorative detail |
| Muted Sand | `#C5B197` | Primary warm accent/highlight |
| Dark Umber | `#51483F` | Earthy border/detail |
| Canvas Light | `#D9D0C2` | Supporting emphasis |

The palette is intentionally warm within a blue environment. Do not introduce additional saturated colors without a demonstrated semantic need.

### 3.3 Palette relationships and usage

- Midnight Blue is the main canvas, not a universal fill for every element.
- Deep Blue distinguishes the sidebar and secondary regions without creating a heavy panel effect.
- Gallery Slate is reserved for components that genuinely need elevation or a distinct surface.
- Blue Charcoal is for transient interaction states, not large decorative blocks.
- Warm Ivory is the primary foreground.
- Soft Ash is secondary text; verify small-text contrast before using it.
- Smoky Mauve is restrained and must not become the dominant interactive color.
- Muted Sand is the primary warm highlight and may be used for primary action surfaces when the foreground contrast is verified.
- Dark Umber supports quiet borders and earthy details; do not outline every component.
- Canvas Light is supporting emphasis, not a substitute for the main foreground.

### 3.4 Contrast is a required validation, not an assumption

The supplied palette establishes the art direction, not automatic WCAG conformance for every pairing. Test actual foreground/background combinations, including small text, focus indicators, button labels, disabled states, selected states, and Persian typography.

Where a pairing fails WCAG 2.2 AA, adjust the semantic role minimally (for example, use Canvas Light instead of Soft Ash for a specific small-text role). Preserve the overall palette character. Document any adjustment and do not silently alter the canonical palette swatches.

## 4. Semantic token architecture

### 4.1 Central token ownership

Use the existing global token mechanism in `src/app/globals.css` and the project's Tailwind CSS 4 conventions. Extend the current token system rather than creating a parallel one.

At minimum, the shared semantic contract must cover:

- `background`, `foreground`
- `surface`, `surface-foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `border`, `input`, `ring`
- `destructive`, `destructive-foreground`
- `link`, `link-hover)
- `sidebar`, `sidebar-foreground`, `sidebar-border`, `sidebar-accent`
- selection colors and any existing project-specific editorial roles.

Retain existing custom token names where they are already consumed by the application; map them to the shared semantic roles instead of breaking existing components.

### 4.2 Token mapping guidance

| Semantic role | Light direction | Dark direction |
|---|---|---|
| Main background | Existing Warm Paper | Midnight Blue |
| Main foreground | Existing Warm Ink | Warm Ivory |
| Secondary background | Existing Raised Paper | Deep Blue |
| Elevated/card surface | Existing raised/muted paper role | Gallery Slate |
| Hover/selected surface | Existing muted paper role | Blue Charcoal |
| Secondary foreground | Existing muted ink role | Soft Ash (contrast-checked) |
| Primary accent | Existing approved warm accent | Muted Sand |
| Muted accent | Canvas Mauve / Smoky Umber | Smoky Mauve |
| Borders | Existing warm border | Dark Umber or a verified blue-grey derived from the palette |
| Focus ring | Existing visible light focus role | Muted Sand or another verified high-contrast role |
| Sidebar surface | Existing light sidebar treatment | Deep Blue |
| Artwork/image surface | Existing image framing | Same image treatment; surrounding surface may change |

This table defines relationships, not permission to change the current light implementation. Inspect existing token usage before mapping or renaming variables.

### 4.3 shadcn compatibility

Use the color-variable format already established by the repository and compatible with its installed shadcn components. If the project uses OKLCH, convert the approved palette accurately and document the conversion. If it uses HSL, validate the conversion. Hex values above remain the authoritative palette reference.

Do not paste approximate sample HSL values without validating their rendered color. Do not introduce a second color format without a concrete need.

Prefer semantic component classes such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, and `ring-ring`. Fixed palette values are acceptable only for deliberately branded artwork-adjacent details, and should still be centralized.

## 5. Theme preference and application architecture

### 5.1 Supported modes

Provide exactly these user-facing choices:

1. **Light** — always use the light theme.
2. **Dark** — always use Midnight Gallery.
3. **System** — follow the operating system/browser color-scheme preference.

When no explicit user preference exists, default to System. Persist explicit choices across reloads and route navigation. Changing locale must not reset the selected theme.

### 5.2 Theme engine

Use `next-themes` unless the repository already has an equivalent implementation that meets all requirements. Inspect `package.json`, current providers, App Router layouts, and existing theme-related code before adding a dependency or replacing anything.

Use the class-based strategy expected by Tailwind/shadcn. Apply the resolved theme consistently at the document root so all localized routes and portals (Sheet, Dropdown Menu, Dialog, Popover, Tooltip) inherit the same theme.

Do not create a second localStorage manager or a per-page theme context. Keep one shared provider at the correct application boundary. Preserve existing providers and server-component boundaries.

### 5.3 Rendering and hydration

Prevent a flash of the wrong theme on initial load. Avoid hydration mismatch warnings. Do not read browser-only preference state in server-rendered output. Render theme-dependent icon/label states only when hydration-safe. Do not globally suppress hydration warnings to conceal an implementation problem.

System mode must react when the operating-system preference changes while the site is open. Explicit Light and Dark preferences must not be overridden by later OS changes.

### 5.4 No theme-dependent content or route behavior

Theme selection is presentation state only. It must not alter route structure, localized content, SEO metadata, publication eligibility, artwork data, or page behavior.

Do not introduce theme feature flags, environment variables, account settings, cookies/services beyond the selected theme mechanism, analytics, or third-party preference tracking.

## 6. Theme selector and navigation integration

### 6.1 Shared selector

Implement one reusable theme selector using the existing shadcn/ui Dropdown Menu composition (including radio-group semantics where supported). Use the project's installed icon library, preferably Lucide:

- Sun — Light
- Moon — Dark
- Monitor — System

The selected option must be programmatically identifiable. The control must have a localized accessible name and expose the current choice without relying on color alone.

Do not create a bespoke dropdown or duplicate shadcn primitives.

### 6.2 Placement

Follow the existing navigation specification:

- **Desktop:** place the theme selector in the shared desktop utility area alongside the language selector. Keep it understated and consistent with the site's editorial utility styling. Do not add a competing sidebar navigation item.
- **Mobile:** place the theme selector in the bottom settings area of the existing shadcn Sheet, alongside/below the language selector, after the navigation links. Keep the closed mobile header free of duplicate locale/theme controls.
- Preserve the existing physical sidebar placement and mobile drawer edge rules in `navigation-and-mobile-sidebar.md`. In particular, do not let theme work alter the established physical-left desktop sidebar rule or locale-specific text direction.

If responsive layout requires more than one rendered placement, ensure hidden instances are not focusable or exposed to assistive technology. Prefer a single shared component with responsive placement/composition.

### 6.3 Menu behavior

- Use native menu/radio semantics from shadcn/Radix.
- Support keyboard navigation and activation.
- Close after selection as appropriate.
- Keep focus visible.
- Prevent clipping or viewport overflow, including Persian RTL.
- Respect reduced-motion preferences.
- Ensure the control remains usable at narrow widths and short viewport heights.

### 6.4 Localization

Provide natural, reviewed Persian and English labels for Light, Dark, System, and the theme selector's accessible name. Do not machine-translate final UI strings without review. The theme preference itself is locale-independent.

The four primary combinations must all work: English + Light, English + Dark, Persian + Light, Persian + Dark. System must resolve correctly for either locale.

## 7. Shared component and page treatment

All shared components must consume the central tokens. This is a site-wide audit, not permission to redesign the following pages.

### 7.1 Global shell, sidebar, and breadcrumbs

- Main page background uses the theme's background token.
- Desktop sidebar uses the sidebar token family; mobile Sheet uses the same semantic surface.
- Wordmark, navigation, active item, hover, focus, copyright, and utility controls remain legible.
- Active navigation is distinguishable without relying only on color.
- Breadcrumb ancestors and current-page text use consistent secondary/primary roles.
- Keep the existing editorial whitespace and restrained separators.
- Portaled menus and overlays must inherit the current theme.

### 7.2 Homepage

- Preserve the existing hero composition and all artwork/photo treatment.
- Keep hero copy readable without adding heavy text panels or gradients that were not already approved.
- Selected Works, gallery previews, About, Journal, Events, and Contact inherit shared tokens.
- Carousel controls, captions, links, and section headings have clear hover/focus/disabled states.
- Do not add generic dark cards around content that currently uses open editorial layouts.

### 7.3 Works, galleries, and artwork details

- Preserve the existing collection/gallery layouts and image proportions.
- Gallery poster cards use semantic surfaces only where the existing design requires them.
- Artwork viewer/carousel controls and pagination/selectors remain visible and accessible.
- Artwork images remain pixel-faithful and independent of the theme.
- Metadata and descriptions use primary/secondary foreground roles with adequate contrast.

### 7.4 About and CV

- Preserve biography, artist statement, CV hierarchy, and page layout.
- Artist imagery and artwork are never filtered.
- Download links and supporting metadata use semantic action/link roles.
- Do not alter content or approval state as part of theme implementation.

### 7.5 Journal and announcement sticker

Journal pages, archive pagination, article/event details, and controls use the shared tokens.

**Explicit exception — paper announcement sticker:** retain its distinctive warm exhibition-paper appearance in both themes. In dark mode it should still read as a small piece of paper attached to the gallery edge, with warm paper surface and dark readable ink. Do not automatically convert it into a dark card or promotional banner. Keep its existing silhouette/edge treatment, proportions, typography, placement, dismissal control, and navigation behavior. Ensure its contrast and close control remain correct in desktop sidebar and mobile Sheet.

The sticker's paper-like treatment is a deliberate branded material surface, not a failure to theme.

### 7.6 Contact and interactive controls

- Contact copy, email/social links, and icons remain readable.
- Links have visible hover/focus states.
- Buttons, Select, Dropdown Menu, Sheet, Dialog, Popover, Tooltip, inputs, pagination, and other existing shadcn components use semantic tokens.
- No component should remain unintentionally light-themed inside the dark application or vice versa.

## 8. Typography, surfaces, borders, and interaction states

### Typography
- Preserve existing font families, weights, sizes, line heights, and hierarchy.
- Dark primary headings/body use Warm Ivory.
- Secondary copy uses Soft Ash only at verified contrast sizes/weights.
- Use Canvas Light where needed for stronger supporting emphasis.
- Preserve Persian shaping, line-height, and text alignment.

### Surfaces
- Use a restrained hierarchy: page canvas → sidebar/secondary surface → genuinely elevated surface → transient interactive surface.
- Do not turn every section into a card.
- Avoid excessive surface contrast or stacked panels.

### Borders and separators
- Keep borders subtle and purposeful.
- Use the existing light borders unchanged in light mode.
- In dark mode use Dark Umber or a validated low-contrast blue-grey role.
- Do not add horizontal rules or outlines merely because dark surfaces differ.

### Interaction states
For each interactive component, define and verify default, hover (fine pointer), focus-visible, active/selected, disabled, and open states as applicable. Focus must remain clearly visible in both themes. Never communicate state by color alone.

### Transitions
Theme changes may use a short, restrained transition for background, foreground, border, and surface colors. Do not animate layout, dimensions, image size/position, artwork pixels, or navigation structure. Avoid `transition: all`. Respect `prefers-reduced-motion`; no transition is required when reduced motion is requested. Switching must feel immediate and stable.

## 9. Responsive and bilingual requirements

Preserve existing responsive breakpoints and composition. At minimum verify:

| Viewport | Width |
|---|---:|
| Small mobile | 360px |
| Standard mobile | 390px |
| Tablet | 768px |
| Desktop | 1280px |
| Wide desktop | 1440px |

Also test a short-height viewport and mobile landscape where the menu is open.

For both locales:
- English remains LTR.
- Persian remains RTL.
- Existing physical navigation placement is unchanged.
- Theme menu alignment and portal positioning are correct.
- Icon order, labels, spacing, keyboard order, and reading order are natural.
- Dropdowns do not overflow the viewport.
- No theme-specific rule changes page direction or mirrors imagery.

Test both themes for all primary page families: homepage, Works, artwork detail, Galleries index/detail, About, CV, Journal archive/detail, and Contact. Include navigation open/closed and the Journal sticker where present.

## 10. Accessibility and quality

Target WCAG 2.2 AA for text and non-text UI contrast. Verify:
- Primary and secondary text.
- Small text and metadata.
- Navigation and breadcrumbs.
- Theme selector labels and selected state.
- Button foreground/background.
- Focus indicators and control boundaries.
- Disabled controls.
- Sticker text and dismiss control.
- Persian and English content at real sizes.

Also verify:
- Keyboard-only selection and dismissal.
- Screen-reader announcement of selector name and selected value.
- Adequate touch targets.
- Browser zoom and text resizing.
- Reduced-motion behavior.
- Focus order and restoration in the mobile Sheet.
- No theme flash or hydration warnings.
- No horizontal overflow or clipped menus.

Do not claim compliance from palette inspection alone; record measured contrast ratios for critical pairings.

## 11. Performance, privacy, SEO, and content integrity

- Avoid runtime image processing and theme-specific artwork downloads.
- Avoid unnecessary dependencies and client-component boundaries.
- Keep theme state local to the visitor's browser preference mechanism; do not add analytics or remote tracking.
- Do not change page metadata, canonical URLs, hreflang, robots, sitemap, or structured data.
- Do not change artist facts, artwork records, translations, rights, approval state, or publication eligibility.
- Do not change the exact artist name: **Ghazaleh Abdolahzade Nasoodi**.

## 12. Implementation workflow

Before coding:

1. Read `AGENTS.md`, this specification, `specification/README.md`, `design-engineering-skills.md`, `design-direction-and-system-refinement.md`, `site-wide-design-system-and-section-specification.md`, `navigation-and-mobile-sidebar.md`, `shadcn-component-reuse-and-bilingual-ui.md`, `localization-and-editorial-governance.md`, `accessibility-performance-security.md`, and `testing-qa-and-release.md`.
2. Inspect the current branch, HEAD, worktree status, `package.json`, Tailwind/shadcn configuration, global CSS, root/locale layouts, providers, all existing tokens, shared shell, and all components containing hardcoded colors.
3. Inventory the existing token consumers and identify which styles need migration to semantic tokens.
4. Inspect installed shadcn primitives and current Radix packages before adding anything.
5. Document the implementation mapping from existing tokens to light/dark semantic roles before broad edits.
6. Implement the shared provider, global tokens, and reusable selector before page-specific styling migration.
7. Migrate shared components first, then audit all route/page families.
8. Preserve the existing light appearance through before/after screenshots.
9. Run automated tests, contrast checks, responsive tests, and visual QA.
10. Fix all regressions and repeat the full relevant verification.

Do not force the suggested folder structure from an implementation prompt if the repository has an established equivalent. Reuse the actual App Router/provider architecture.

## 13. Automated and visual verification

### Functional tests
Verify:
1. No explicit preference resolves to System.
2. System follows OS light/dark changes.
3. Selecting Light applies the light theme globally.
4. Selecting Dark applies Midnight Gallery globally.
5. Selecting System restores OS-following behavior.
6. Explicit preference persists after reload and route navigation.
7. Locale switching does not reset theme.
8. Theme selection works from desktop and mobile controls.
9. Theme menu keyboard behavior and selected state are correct.
10. No hydration mismatch, wrong-theme flash, or console error is introduced.

### Regression and integrity tests
Verify:
- Existing light-mode screenshots/layouts remain materially unchanged.
- All shared shadcn controls respond to semantic tokens.
- Portaled overlays use the active theme.
- Journal sticker remains warm paper in both themes.
- Artwork image sources and visual styles are unchanged across themes.
- Routes, locale alternates, content, and SEO output are unchanged.

### Visual QA matrix
Capture and inspect actual browser screenshots for:
- Both themes.
- Both locales.
- 360px, 390px, 768px, 1280px, and 1440px widths.
- Desktop utility and sidebar.
- Mobile header and open Sheet.
- Homepage and every major page family.
- Journal sticker in desktop and mobile navigation.
- Dropdown open/selected states.
- Normal and reduced-motion settings.

Record viewport, locale, resolved theme, page/state, screenshot artifact path, and findings. A generated but uninspected screenshot is not visual verification. Inspect actual rendered output and fix contrast, spacing, clipping, hierarchy, or RTL defects.

## 14. Acceptance criteria

The specification is satisfied only when:

- [ ] Light mode remains visually equivalent to the approved existing design.
- [ ] Midnight Gallery is implemented using the approved palette.
- [ ] One shared semantic token system powers both themes.
- [ ] All relevant pages and shared components consume semantic tokens.
- [ ] Theme preference supports Light, Dark, and System.
- [ ] System is the default when no explicit preference exists.
- [ ] Explicit preference persists across reloads and navigation.
- [ ] No theme flash, hydration mismatch, or console error occurs.
- [ ] Theme selector uses existing shadcn/ui primitives and is accessible.
- [ ] Desktop and mobile placements follow the navigation specification.
- [ ] English LTR and Persian RTL work in both themes.
- [ ] The Journal sticker retains its warm paper identity.
- [ ] Artwork and artist photographs remain visually unchanged.
- [ ] WCAG 2.2 AA contrast is measured for critical combinations.
- [ ] Responsive and short-height layouts are verified.
- [ ] Automated tests, production build, and complete CI pass.
- [ ] Visual QA artifacts have been inspected.
- [ ] No route, content, SEO, or publication behavior changes are introduced.

## 15. Implementation and release boundaries

- Work only on the existing `feature` branch unless separately authorized.
- Preserve unrelated work.
- Do not merge to `stage` or `main`.
- Do not deploy or publish.
- Do not change the artist's exact name.
- Do not add fictional content or alter approved content.
- Do not add theme-specific environment variables or feature flags.
- Do not install dependencies before verifying they are needed.
- Do not replace or duplicate existing shadcn primitives.
- Do not report a check as passing unless it actually ran and completed.
- Distinguish implemented, automated-tested, visually verified, owner-approved, and published states.

## 16. Required implementation report

The implementation report must include:

1. Branch and final HEAD SHA.
2. Shared theme architecture and provider placement.
3. Files created/modified.
4. Final light/dark semantic token mapping.
5. Theme selector placement and interaction behavior.
6. Confirmation of Light, Dark, and System behavior and persistence.
7. English/Persian and responsive test matrix results.
8. Measured contrast findings and any justified semantic adjustments.
9. Artwork-fidelity and Journal-sticker regression results.
10. Exact test/build results.
11. Final GitHub Actions run URL, conclusion, and tested SHA.
12. Known limitations and remaining approvals.
13. Explicit confirmation that no unauthorized merge or deployment occurred.

**Final experience:** Nasoodi.art should feel like a warm, quiet artist's gallery in daylight and an atmospheric midnight gallery after dark. Both modes must remain unmistakably the same portfolio, with the paintings always taking visual priority.
