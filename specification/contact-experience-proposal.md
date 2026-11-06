# Contact Experience — Technical Contract

## Purpose

Provide a reusable contact presentation on the homepage and a dedicated localized route. Both surfaces consume the same canonical contact-domain record through the repository layer.

## Data contract

- Contact methods are structured records with a stable type, localized label where required, display value, and destination.
- The application renders all configured supported methods.
- Personal contact values must not be hardcoded in components or duplicated in technical documentation and test assertions.
- A missing optional method is omitted without breaking layout.
- External destinations pass safe-URL validation.
- Email destinations use the mailto: scheme; supported external profile destinations use HTTPS.
- Display values and destinations remain distinct so localized labels do not alter the underlying destination.

## Layout and behavior

- The homepage section and dedicated contact route reuse the same shared presentation component.
- The dedicated route is available under each supported locale.
- Navigation is available through shared desktop and mobile navigation.
- Desktop uses the established editorial composition; mobile reflows to a readable single-column layout.
- English uses LTR and Persian uses RTL. Email addresses and other intrinsically LTR values retain correct bidi isolation.
- Preserve shared typography, spacing, theme tokens, and responsive behavior.
- Do not introduce a form, phone, address, booking workflow, or service promise without a separate approved technical requirement.

## Accessibility

Links are keyboard accessible, have localized accessible names, expose visible focus, and maintain adequate contrast. The layout must not introduce horizontal overflow at supported widths.

## Automated tests

Use synthetic contact fixtures. Verify that both surfaces render the same configured methods, safe destinations are preserved, optional methods can be omitted, navigation works in both locales, and responsive composition remains valid. Do not assert actual personal contact values.

## Scope

This specification defines application behavior only. Editorial contact values remain in canonical content data and must never be copied into technical documentation or test assertions.
