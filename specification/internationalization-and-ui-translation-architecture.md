# Internationalization and UI Translation Architecture

**Status:** Proposed implementation contract  
**Locales:** English (en) and Persian (fa)  
**Recommended library:** next-intl, subject to compatibility audit

## 1. Goal

Remove language-specific UI text from React components and centralize it in locale message bundles. Components and application logic must not contain Persian/English conditional copy. Adding a supported locale should primarily require locale configuration, message resources, and reviewed localized content—not edits throughout the component tree.

This specification governs interface localization. Editable artist/portfolio content is governed separately by content-architecture-and-data-separation.md.

## 2. Library decision

Adopt next-intl unless the repository audit identifies a concrete incompatibility. It supports Next.js App Router, Server Components, Client Components, locale routing, request configuration, and server metadata integration.

Before installing, inspect the current route/layout architecture and existing localization helpers; confirm compatibility with the exact Next.js/React versions; review current official next-intl docs and migration notes; assess client bundle impact; and record the selected version. Do not build a custom translation framework or combine multiple i18n libraries.

## 3. Locale registry and routing

Maintain one authoritative locale registry containing supported locales, default locale, labels, direction, and formatting defaults. Do not scatter locale arrays or fa-specific conditionals across components.

Initial behavior:
- en: LTR, document language en.
- fa: RTL, document language fa.

Preserve locale-prefixed public routes unless audit demonstrates migration is required. Validate locale at the routing boundary. Unsupported locales must not silently fall back to another language.

Use current Next.js 16 routing conventions, including proxy.ts where required by the selected design. Do not copy obsolete middleware.ts examples without checking current framework documentation.

## 4. Message bundles

Use one message resource per locale, organized by semantic namespaces and stable keys. Example:

messages/
  en.json
  fa.json

Suggested namespaces: Common, Navigation, Actions, Accessibility, Theme, Language, Gallery, Journal, Contact, Validation.

Keys describe meaning rather than component location. Avoid text1/title2 keys. Persian must provide reviewed values for every required key.

## 5. Component rules

- Render UI messages through the i18n library APIs.
- Prefer Server Components for static localized UI.
- Use Client Components only when interaction requires them; pass only required messages.
- Do not import the full translation dictionary into every client component.
- No Persian/English ternaries, inline dictionaries, hardcoded localized labels, or fallback copy in JSX.
- Never display a missing translation key as fallback text.
- Keep formatting locale-aware.
- Shared components receive semantic props/data, not duplicated translated copy.

Document exceptions such as brand names, proper nouns, user-generated content, and code examples.

## 6. Server/client boundaries

Configure request-scoped locale and messages using current next-intl guidance. Validate locale before rendering. Server-render the correct language and direction to prevent hydration mismatch and language flash.

Use server translation APIs for server-rendered pages and metadata. For client interaction, use the narrowest provider/message scope possible. Do not fetch translations in a client effect after rendering the wrong language.

## 7. Localized navigation

Use next-intl localized navigation helpers or a shared typed navigation layer. Internal links preserve locale. Language switching resolves the equivalent localized content route through stable content identity; do not simply replace the locale prefix when localized slugs differ.

If no equivalent translation exists, use the corresponding locale homepage or another explicit fallback. Never map to unrelated content.

## 8. RTL/LTR and formatting

- Set html lang and dir from the active locale at document root.
- Use CSS logical properties.
- Keep semantic DOM and keyboard order aligned with reading order.
- Isolate Latin names, URLs, email addresses, and dimensions in RTL content when needed.
- Use locale-aware date/number formatting while storing locale-neutral values.
- Never mirror paintings or photographs.
- Mirror only directional interface icons when their meaning requires it.
- Preserve Persian shaping and font metrics; do not apply faux letter spacing to connected script.

## 9. Translation governance

Message resources are source-controlled and reviewed. AI may draft translations but does not approve artist-facing language. UI terminology must be consistent and reviewed in context. Artist statements, artwork descriptions, editorial content, and SEO metadata do not belong in UI message bundles.

Missing required keys fail validation. Do not silently fall back to English on Persian pages. Optional editorial translations follow the content-level availability policy.

## 10. Adding a locale

Adding a locale requires:
1. Register locale, direction, and formatting.
2. Add its message bundle.
3. Provide reviewed localized content.
4. Add localized slug mappings when needed.
5. Add localized metadata and valid alternate relationships.
6. Update shared navigation configuration.
7. Run translation parity, route, SEO, RTL/LTR, accessibility, and production rendering tests.

Existing feature components should not need locale-specific edits.

## 11. Tests and acceptance

- [ ] No hardcoded Persian/English UI copy remains in JSX/shared logic except documented exceptions.
- [ ] Every required key exists in every supported locale.
- [ ] Unused keys are detected.
- [ ] Unsupported locale routes return correct 404 behavior.
- [ ] Server HTML has correct lang, dir, and localized content.
- [ ] No hydration mismatch or wrong-language flash.
- [ ] Internal links preserve locale.
- [ ] Language switcher resolves equivalent content correctly.
- [ ] RTL keyboard order, alignment, and scrolling are correct.
- [ ] Date, number, plural, and mixed-direction formatting are tested.
- [ ] Client bundles contain only needed messages.
- [ ] A synthetic third locale can be added without editing shared feature components.

## 12. References

- next-intl: https://next-intl.dev/docs
- Next.js internationalization: https://nextjs.org/docs/app/guides/internationalization
- W3C language declarations: https://www.w3.org/International/questions/qa-html-language-declarations
- Unicode Bidirectional Algorithm: https://www.unicode.org/reports/tr9/

## Current UI literal audit contract — 2026-11-05

The required `scripts/audit-i18n-messages.mjs` audit validates namespace parity, flattened key parity, duplicate keys, non-empty values, and interpolation placeholder parity. It also parses relevant `.tsx`, `.ts`, `.jsx`, and `.js` source files with the TypeScript AST and reports hardcoded user-facing JSX text, visible attributes, and common alert/confirm/prompt messages with file paths and line numbers.

Comments and non-rendered code are not UI copy. Brand names, proper nouns, technical identifiers, CSS classes, URLs, route paths, editorial JSON, and tests are legitimate exceptions. A narrowly scoped inline `i18n-literal-ok` comment documents an intentional source-code literal exception. Do not use broad file-level exclusions to hide actual UI copy.

Unsupported locale routes must return 404; do not silently render the default locale. Editorial fields required by a route must exist in the active locale. UI message fallback and editorial-content fallback are separate concerns: never substitute English editorial text into a Persian page.


## Expanded AST audit and strict editorial slug behavior — 2026-11-05

The AST audit scans `.tsx`, `.ts`, `.jsx`, and `.js` under `src/app`, `src/components`, and `src/lib`. It checks rendered JSX text, visible/accessibility attributes, UI-message-shaped object properties, and alert/confirm/prompt strings. Supplied brand/proper names are narrow exceptions. `aria-roledescription` values such as `carousel` and `slide` are semantic ARIA role descriptors, not translatable prose; visible `aria-label` and `aria-description` remain audited. Use `i18n-literal-ok` only for a narrow, explained exception.

Every published artwork, gallery, and Journal record requires a safe localized slug for every supported locale. If `localizedSlugs` exists but lacks the active locale, resolution returns no slug and validation reports the missing value. It never borrows the other locale's slug. Legacy records without a localized map remain helper-compatible but fail canonical validation.
