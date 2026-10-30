# Nasoodi.art — Responsive Sidebar Navigation, Language, and Theme Specification

**Status:** Proposed implementation contract  
**Scope:** Global navigation shell across all public routes  
**Working branch:** `feature`  
**Related documents:** `proposal.md`, `wireframes.md`, `journal-and-events.md`, `site-wide-design-system-and-section-specification.md`, `localization-and-editorial-governance.md`, `accessibility-performance-security.md`, `testing-qa-and-release.md`

## 1. Purpose and design intent

Define one consistent global navigation system for the Nasoodi.art portfolio. The primary navigation mirrors the active locale: a left-side vertical sidebar in English and a right-side vertical sidebar in Persian. On mobile, it becomes an off-canvas menu entering from that same physical side.

Language and appearance controls must be easy to discover but must not compete with the artist's work:

- **Desktop:** show the language selector and theme selector in the top navigation bar, as separate, clearly labelled controls.
- **Mobile:** place both controls at the bottom of the opened sidebar, after the navigation links.
- Do not show a second copy of these controls in another mobile header or footer location unless a later approved design explicitly requires it.

The navigation should feel like part of a quiet, editorial artist portfolio: warm, restrained, legible, and visually subordinate to the paintings.

## 2. Information architecture

The global navigation is shared across all public routes and locales. It should provide links to the pages that actually exist and are ready for public navigation.

Initial navigation destinations:
- Home
- Works
- About
- CV / Exhibitions — show only when the route and meaningful approved content are available.
- Contact

Do not render dead links, empty destinations, or placeholder pages as if they were complete. The artist wordmark/name may link to Home and must have an accessible name.

The Journal destination is part of the primary navigation on desktop and mobile. It remains active on Journal detail routes. Do not add a separate Events item; events are content types within Journal. The homepage also links to Journal as specified in `journal-and-events.md`.

The navigation labels must be localized in Persian and English. Use the approved translations from the localization source; do not invent awkward literal translations.

## 3. Desktop layout

### 3.1 Left sidebar

- Render a persistent vertical sidebar along the physical left edge of the desktop layout in both Persian and English.
- The sidebar contains the artist identity/wordmark and the primary navigation links.
- Keep its width restrained so it does not compete with the artwork or consume excessive horizontal space.
- Use the existing semantic design tokens for paper surfaces, ink, muted text, fine borders, and focus/active states.
- The sidebar may be fixed or sticky within the viewport, but its behavior must be consistent across routes and must not cover page content or interfere with the easel background.
- The main content region must reserve the correct inline space for the sidebar; no content may sit underneath it.
- The sidebar must remain visually stable while the page scrolls. Avoid unnecessary entrance animations, parallax, or scroll-linked movement.
- Indicate the current route using both a visual treatment and an accessible current-page state (for example, `aria-current="page"`).

### 3.2 Top navigation bar

The top bar is a separate horizontal utility/navigation region aligned with the main content area. It contains:

1. Language selector.
2. Theme selector.

The artist identity and primary page links remain in the left sidebar; do not duplicate the full primary navigation in the top bar.

Language and theme controls:
- Must be visible without opening a menu.
- Must have visible labels or an equally clear accessible name; do not rely on an icon alone.
- Must use the project's shared control styling and token system.
- Must have comfortable pointer and touch targets.
- Must show the currently active selection.
- Must be keyboard operable and expose appropriate semantics.
- Must not overlap the page title, artwork, or easel decoration at narrower desktop widths.

If the available horizontal space becomes insufficient, use the mobile/tablet responsive menu treatment rather than compressing controls until they become difficult to use.

## 4. Mobile layout and sidebar menu

### 4.1 Closed state

- Show a compact top header containing the artist identity/wordmark and an accessible menu trigger.
- The menu trigger opens the locale-appropriate navigation panel (left for English, right for Persian).
- Do not show the language or theme controls in the closed mobile header; they belong at the bottom of the opened menu.
- Preserve the content's full usable width when the menu is closed.

### 4.2 Open state

The mobile menu is an off-canvas panel that enters from the physical left edge, matching the requested left-side menu treatment. It contains, in this order:

1. Artist identity/wordmark.
2. Primary navigation links.
3. Flexible empty space where the viewport height permits.
4. A visually separated settings area at the bottom:
   - Language selector.
   - Theme selector.

The settings area must remain at the bottom of the menu panel, not immediately after the navigation links on tall screens. Use a flex-column layout with the settings region pushed down; if the menu content exceeds the available height, allow the panel to scroll and ensure the settings remain reachable.

### 4.3 Mobile menu interaction

- Open from the menu trigger and close from a visible close control, Escape, selecting a navigation destination, or activating the backdrop.
- The backdrop dims the page subtly and closes the menu when activated.
- Prevent background page scrolling while the modal-style menu is open.
- Keep keyboard focus within the open menu when it is modal; restore focus to the menu trigger when it closes.
- Set and update `aria-expanded`, `aria-controls`, and an accessible label on the trigger.
- Do not close the menu when the user interacts with the language or theme selector.
- After a language change, close the drawer when the destination route has completed navigation. Do not dismiss it before the locale transition starts; restore focus to the mobile menu trigger after the destination is rendered.
- Ensure the menu does not cover system status/navigation areas or device safe areas. Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` where applicable.

### 4.4 Mobile panel dimensions and appearance

- Panel width should be comfortable for labels and controls without taking over the entire screen; use a responsive width with a sensible maximum.
- On very narrow screens, the panel may approach full width, but it must retain a clear close affordance.
- Use the same paper/ink palette and typography as the desktop sidebar.
- Use a fine divider or restrained spacing to distinguish navigation from settings.
- Avoid heavy shadows, glossy surfaces, oversized icons, or generic app-dashboard styling.
- The open/close transition should be short and subtle. No spring/bounce effect.
- Respect reduced-motion preferences by removing or minimizing the transition.

## 5. Language selector

### 5.1 Supported locales

The initial supported locales are:
- Persian (`fa`)
- English (`en`)

Do not expose a locale that is not implemented and reviewed across the site's navigation and page content.

### 5.2 Behavior

- Selecting a language switches the site locale and updates the page's language and direction attributes.
- Persian pages use `lang="fa"` and `dir="rtl"`; English pages use `lang="en"` and `dir="ltr"`.
- When a translation of the current page exists, preserve the equivalent page when switching languages rather than sending the visitor to Home.
- If the equivalent page does not exist in the selected locale, use a documented, predictable fallback (prefer the localized Home page) and do not show a broken route.
- Update localized navigation labels, page metadata, document title, and locale-specific links consistently.
- Keep the language selector's own labels understandable in both locales. Native language names such as “فارسی” and “English” are preferred.
- Do not translate artist names, artwork titles, or factual metadata unless an approved localized value exists.
- Never mirror the paintings, studio photographs, easel, or other physical artwork when switching direction.

### 5.3 Persistence

- Persist the visitor's selected language across navigation and subsequent visits using the project's existing locale strategy.
- The URL/route locale is authoritative for the currently rendered page; persisted preference may guide the initial visit or fallback route but must not override an explicit locale in the URL.
- Avoid a flash of the wrong language or direction during initial render.
- Do not store unnecessary personal data.

## 6. Theme selector

### 6.1 Available modes

Provide these modes:
- Light
- Dark
- System

The initial/default mode should be **Light**, unless an existing approved project decision establishes otherwise. System mode follows the operating-system preference. The visitor can explicitly select Light or Dark regardless of the system preference.

### 6.2 Visual design contract

- Define theme values through semantic design tokens rather than scattered component-level color overrides.
- The light theme follows the approved warm paper, ink, and muted earth palette.
- The dark theme must be deliberately designed for the portfolio; do not simply invert colors. Use a calm, warm dark surface and readable foregrounds, while preserving the color fidelity of artwork images.
- Artwork images must not receive CSS filters, opacity changes, blend modes, or color transformations when the theme changes.
- Validate text, controls, borders, focus indicators, active states, and overlays for WCAG 2.2 AA contrast.
- Theme changes must apply consistently to the sidebar, top bar, mobile menu, page surfaces, typography, dialogs, and form controls.
- Avoid theme transitions that cause flashing or make the artwork appear to change color. If transitions are used, keep them brief and disable them for reduced-motion users.

### 6.3 Persistence and initialization

- Persist the selected mode across routes and visits using the existing project preference mechanism.
- Store the selected preference (`light`, `dark`, or `system`), not only the currently resolved color scheme.
- System mode must react to operating-system theme changes while it is selected.
- Initialize the theme early enough to prevent a flash of the wrong theme during hydration.
- Ensure server rendering and client hydration agree; avoid hydration mismatch warnings.
- If persistence is unavailable, fall back safely to Light.

## 7. Responsive behavior

Use project breakpoints and existing responsive conventions rather than introducing arbitrary breakpoint values. Define and verify at least:

- Wide desktop: persistent left sidebar and top-bar settings.
- Compact desktop/tablet: retain the sidebar only while the content and settings remain comfortable; otherwise switch to the compact menu pattern.
- Mobile: compact header and off-canvas left menu; language and theme controls at the bottom of the open menu.

At every breakpoint:
- No horizontal overflow.
- No overlapping navigation, utility controls, page content, or easel background.
- No clipped labels or inaccessible settings.
- Main content width and gutters remain consistent with the site-wide layout system.
- The menu remains usable in portrait and landscape orientations and at short viewport heights.

## 8. RTL and physical positioning

The navigation shell mirrors its **physical placement** with the active locale. Persian is a complete RTL layout, not an LTR layout with right-aligned labels.

- English (`en`): desktop sidebar is fixed to the physical left; mobile drawer enters from the physical left; desktop language utility is positioned at the upper-right of the content area.
- Persian (`fa`): the entire desktop sidebar is fixed to the physical right, including its surface, border, wordmark, navigation rows, and footer; the main content reserves space on the right. The mobile drawer enters from the physical right. The desktop language utility moves to the physical left of the content area.
- The language selector must mirror its position and internal ordering in Persian; it must not remain on the right while only its text direction changes.
- Set the mobile Sheet side from the locale (`right` for Persian, `left` for English). Keep panel placement and closed-state translation paired so the panel enters from the correct physical edge.
- Set the desktop sidebar's `dir` from the locale. Persian labels, wordmark role, footer, and navigation align to the right; English aligns to the left. Artist names and brand marks retain their intended LTR letter order and are not mirrored.
- Keep drawer text direction locale-aware independently of its physical side. The closed panel must be removed from keyboard interaction and the accessibility tree.
- Use logical CSS properties for content alignment and spacing where possible, but assert physical edge placement explicitly for the sidebar and drawer.
- Directional icons inside navigation should be reviewed in context; do not mirror non-directional brand or artwork imagery.
- The language and theme selectors must remain correctly aligned and readable in both locales.

## 9. Easel background integration

The navigation shell must coexist with the persistent easel background defined in `easel-scroll-background.md`.

- Keep the easel as a decorative background layer behind the page, never as part of the sidebar/menu interaction layer.
- The sidebar and mobile menu must have sufficient surface contrast and opacity for readable navigation.
- The easel must not show through text or controls in a way that reduces contrast.
- Sidebar/menu open and close must not alter the easel's scroll mapping or restart its animation.
- Do not duplicate the easel image inside the sidebar or mobile menu.
- Ensure the left-edge easel composition does not become hidden behind an opaque sidebar in a way that contradicts the approved overall composition; resolve the visual relationship through the layout/z-index design and screenshot review.

## 10. Accessibility requirements

Target WCAG 2.2 AA and verify the following:

- Use semantic navigation landmarks and a labelled navigation region.
- All controls work with keyboard alone.
- Focus order follows the visual and reading order.
- Focus indicators are clearly visible in both themes.
- The menu trigger exposes its expanded/collapsed state.
- The mobile menu has correct dialog/modal semantics if it blocks interaction with the page.
- Focus is trapped only while the menu is modal and is restored to the trigger after close.
- Escape closes the open menu.
- Language and theme selectors have programmatic labels and announce their current values.
- Do not communicate selected locale, theme, or current page by color alone.
- Touch targets meet WCAG 2.2 target-size requirements or their spacing exception.
- Text and control contrast is checked in both themes and both locales.
- Respect browser zoom and text resizing.
- Support reduced motion.
- Test with keyboard and at least one screen reader workflow for menu open/close, locale selection, and theme selection.

## 11. Implementation guidance

- Inspect the existing application shell, route structure, locale handling, theme mechanism, and component library before coding.
- Reuse the existing project components and design tokens where they satisfy this contract.
- Build shared components for the global sidebar, responsive menu trigger/panel, language selector, and theme selector rather than implementing separate inconsistent versions per route.
- Keep the language/theme controls as shared components that are rendered in the desktop top bar or the mobile menu settings area according to the responsive shell.
- Avoid rendering duplicate interactive controls simultaneously at different breakpoints. If responsive composition requires separate DOM placement, ensure only the visible instance is exposed to keyboard and assistive technology.
- Prefer CSS for responsive layout and transitions; avoid unnecessary JavaScript state or animation dependencies.
- Keep navigation and preference behavior independent from page-specific artwork components.
- Do not add third-party tracking or preference services for these controls.

## 12. Verification and test plan

Automated tests must cover:

1. Sidebar renders on all applicable desktop routes.
2. Desktop language and theme selectors are visible in the top bar.
3. Mobile header exposes the menu trigger and does not expose duplicate language/theme controls outside the menu.
4. Opening the mobile menu reveals navigation links and places language/theme controls at the bottom of the panel.
5. Menu closes through close control, Escape, backdrop, and route selection.
6. Focus enters the menu, remains contained when modal, and returns to the trigger after close.
7. Language switching updates locale route, document title, `lang`, and `dir`; equivalent route is preserved when available.
8. Explicit URL locale takes precedence over stored preference.
9. Theme switching updates the whole interface and persists after reload/navigation.
10. System theme follows OS preference only when System is selected.
11. Artwork image pixels/styles are not altered by theme switching.
12. Persian and English labels, alignment, and reading order are correct while the sidebar remains physically left.
13. Reduced-motion mode disables/minimizes menu transitions.
14. No horizontal overflow, clipping, or overlap at supported viewport sizes.

Visual QA screenshots are required for:
- Desktop wide and compact.
- Tablet portrait and landscape.
- Mobile narrow and standard.
- Menu closed and open.
- Persian RTL and English LTR.
- Light, Dark, and System-resolved appearances.
- Normal and reduced-motion settings.

## 13. Acceptance criteria

This specification is implemented only when:

- Desktop has a persistent left sidebar for primary navigation.
- Desktop top bar visibly contains language and theme selectors.
- Mobile uses a left-side off-canvas menu.
- Mobile menu places language and theme selectors at its bottom, below the navigation links.
- The controls are accessible, functional, localized, and persistent.
- Persian/English direction is correct without moving the sidebar from the physical left.
- Light/Dark/System appearances are coherent and preserve artwork fidelity.
- Navigation works across all public routes without dead links.
- No layout collision occurs with the easel background or page content.
- Automated tests and the required responsive/locale/theme visual checks pass.
- The implementation is reviewed against the site's accessibility, performance, and release contracts.

## 14. Implementation boundaries and open decisions

- This document specifies the intended behavior and design; it does not assert that any of it is already implemented.
- Do not merge to `main`, deploy, or change branches without separate explicit authorization.
- Do not invent additional navigation destinations or expose routes that are not ready.
- Confirm the final visual treatment of the dark theme during design review before publication.
- If repository inspection reveals an existing locale/theme implementation, extend and reconcile it rather than replacing it without evidence.

## Design-engineering refinement

Apply design-engineering-skills.md and design-direction-and-system-refinement.md to the navigation implementation.

- Navigation should feel like a quiet gallery wayfinding system, not a dashboard menu. Prefer clear typography, restrained active indication, and purposeful whitespace over icon-heavy rows, pills, or decorative containers.
- The desktop sidebar remains physically left in Persian and English; only reading direction and text alignment change.
- The mobile drawer must provide immediate, reliable feedback, preserve focus, close predictably, and avoid unnecessary animation. Any spatial transition must be interruptible and reduced-motion aware.
- Keyboard-triggered navigation and frequent interactions must not be delayed by animation.
- Hover treatment is only for hover-capable fine pointers; touch must not depend on hover.
- Keep locale/theme utilities accessible and reachable, with visible focus and correct expanded/current semantics.


## Shared component implementation standard

Implement the desktop side navigation using the project's shadcn/ui Sidebar composition and the mobile off-canvas navigation using the shared Radix-backed shadcn Sheet. Use the shared Dropdown Menu for the desktop language selector and a clear, directly accessible locale link within the mobile drawer. Do not create parallel menu primitives.

The component selection, RTL/LTR rules, keyboard and focus behavior, and new-component/dependency gate are defined by [Shadcn/ui Component Reuse and Bilingual Shared UI](./shadcn-component-reuse-and-bilingual-ui.md). That document is mandatory alongside this navigation contract.
