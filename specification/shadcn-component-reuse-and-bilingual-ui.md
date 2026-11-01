# Shadcn/ui Component Reuse and Bilingual Shared UI Standard

**Status:** Project-wide engineering standard  
**Applies to:** Every public page, shared shell, form, menu, dialog, and interactive control  
**Locales:** Persian (RTL) and English (LTR)

## 1. Foundation

Use shadcn/ui as the preferred component architecture for reusable interface controls. shadcn/ui components are project-owned source composed with accessible Radix UI primitives; they are not a separate visual identity. Nasoodi's warm editorial palette, typography, and art direction remain authoritative.

Before implementing a control, inspect: (1) existing components in `src/components/ui/`; (2) shared project components; (3) shadcn patterns and installed Radix primitives; (4) only then consider a new component or dependency.

Never create a bespoke menu, dialog, sheet, dropdown, button, select, tooltip, tab, or sidebar before checking whether an existing component can be composed.

## 2. Repository conventions

- Configuration: `components.json`.
- Shared primitives: `src/components/ui/`.
- Class utility: `src/lib/utils.ts`.
- Application composition: `src/components/`.
- Styling: existing semantic tokens in `src/app/globals.css`.

Use project aliases. Do not duplicate primitive implementations or introduce another component library for already-supported interactions.

## 3. Component selection

| Requirement | Preferred component | Project use |
|---|---|---|
| Persistent desktop navigation | Sidebar | Shared left-side artist navigation |
| Modal mobile navigation | Sheet (Dialog primitive) | Left-entering mobile menu |
| Compact locale selection | Dropdown Menu | English/Persian selector |
| CTA and actions | Button | Hero links via `asChild` |
| Confirmations | Alert Dialog / Dialog | Only for real confirmation flows |
| Grouped navigation | Collapsible | Only if navigation grows into groups |
| Help text | Tooltip | Supplementary, never the only accessible label |
| Scrollable panel | Scroll Area | Only where native scrolling is insufficient |
| Segmented choices | Tabs | Only for true tab semantics |

Do not add unused components merely to complete an inventory.

## 4. Sidebar and navigation

### Desktop
- Keep the sidebar at the physical left edge in both locales, as required by `navigation-and-mobile-sidebar.md`.
- Keep the artist wordmark and primary navigation in the sidebar.
- Use semantic navigation landmarks, list structure, and `aria-current="page"`.
- Reserve layout space so content never sits beneath the sidebar.
- Keep locale controls in the utility area; do not duplicate primary navigation.

### Mobile
- Use Sheet with a left-side presentation for the off-canvas menu.
- The trigger exposes `aria-expanded`, `aria-controls`, and a localized accessible name.
- Sheet owns focus containment, Escape dismissal, backdrop dismissal, and focus restoration.
- Keep the locale selector in the menu settings area.
- Close the menu after route navigation.
- Respect device safe areas and reduced-motion preferences.

### Language selector
- Use Dropdown Menu with native language names: `English` and `فارسی`.
- Preserve the equivalent route when a translation exists; otherwise use the documented localized-home fallback.
- Expose current locale and correct `hrefLang`.
- Set document `lang` and `dir` on the locale layout.
- Do not translate names or artwork metadata without approved localized values.

## 5. RTL/LTR and visual styling

- Component direction follows the nearest locale-aware application surface.
- Explicit physical placement (left sidebar and left-entering mobile Sheet) must not be mirrored when document direction changes.
- Text alignment, inline spacing, icon placement, and reading order follow locale direction.
- Prefer logical CSS properties except where physical placement is intentional.
- Preserve the paper, ink, muted, mauve, sand, and border tokens.
- Avoid default dashboard styling, heavy shadows, gratuitous cards, and decorative gradients.

## 6. New component and dependency gate

A new component is justified only when no existing project or shadcn component satisfies the behavior, composition would materially reduce accessibility/maintainability, and the component has a reusable responsibility.

For every new component:
- Explain why existing primitives are insufficient.
- Use existing tokens and conventions.
- Preserve semantic HTML and keyboard behavior.
- Support both locales and directionality.
- Respect reduced motion.
- Add focused component and browser tests.
- Update this standard and the README inventory.

Do not copy/paste complete component implementations into multiple files.

## 7. Verification

For every materially changed shared control:
- Test both `en`/LTR and `fa`/RTL.
- Test keyboard operation and visible focus.
- Test touch interaction on mobile.
- Test open, closed, selected, active, and dismissal states as relevant.
- Test specified responsive viewports.
- Inspect actual browser screenshots; compilation alone is not visual verification.
- Keep CI and deployment policy intact.

## 8. Initial implementation inventory

| Component | Shared implementation | Status |
|---|---|---|
| Button | `src/components/ui/button.tsx` | Implemented |
| Sidebar composition | `src/components/ui/sidebar.tsx` | Implemented |
| Sheet | `src/components/ui/sheet.tsx` | Implemented |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` | Implemented |
| Class utility | `src/lib/utils.ts` | Implemented |
| Carousel | `src/components/ui/carousel.tsx` | Implemented with Embla; CI verification pending |
| Site navigation | `src/components/site-shell.tsx` | Composes shared primitives |

Update this inventory when components are added, removed, or replaced.


## 9. Responsive artwork carousel component — 2026-10-31

The new artwork discovery contract uses the official [shadcn Carousel](https://ui.shadcn.com/docs/components/base/carousel) composition: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, and `CarouselNext`.

The feature branch previously had Button, Dialog, Dropdown Menu, Sheet, and Sidebar primitives but no Carousel primitive or Embla dependency. The project uses Radix-backed shadcn components, and the implementation preserves that foundation.

The responsive carousel is now implemented as the project-owned `src/components/ui/carousel.tsx` primitive using `embla-carousel-react` (`^8.6.0`). It provides the standard Carousel/Content/Item/Previous/Next composition, direction-aware keyboard handling, disabled boundaries, and live snap position. The primitive is implemented; CI verification and rendered visual approval remain pending. No autoplay plugin or second carousel library is installed.

Implementation and QA must cover responsive item basis, content-container sizing, spacing, snap/alignment, disabled boundaries, keyboard navigation, touch/trackpad drag, accessible naming/position feedback, reduced motion, and clipping/focus behavior. For Persian set both `dir="rtl"` and Embla `direction: "rtl"`; for English use LTR. Directional controls must have correct localized movement meaning. Preserve the editorial artwork design; do not use default dashboard card styling.

See [artwork-discovery-carousel-and-editorial-experience.md](./artwork-discovery-carousel-and-editorial-experience.md) for the complete component and behavior contract.


## Shared theme selector

The theme selector is implemented in `src/components/theme-selector.tsx`, composed from the existing Dropdown Menu radio-group primitives and shared `next-themes` provider. It is available in the desktop utility area and the mobile Sheet settings area, with Persian and English labels.
