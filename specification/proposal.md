# Nasoodi.art — Technical Product Specification

## Purpose

Define the technical and experience requirements for a bilingual, editorial-style portfolio application. This document describes product behavior and engineering constraints only; all editorial values and production records remain in canonical content data.

## Product principles

- Present visual content through a restrained, gallery-like interface.
- Keep the interface minimal, accessible, responsive, and bilingual.
- Treat English and Persian as first-class locales, with correct LTR and RTL composition.
- Separate editorial data, interface translations, domain logic, routing, and presentation.
- Keep stable record identity independent of localized slugs and display titles.
- Avoid hardcoded personal data, editorial copy, image filenames, and current record counts in application code and technical documentation.

## Core application areas

- Homepage with a responsive profile hero and selected content sections.
- Artwork archive and artwork detail/viewer experience.
- Collection archive and collection detail experience.
- Journal archive and detail experience, including event-type entries.
- About and CV routes.
- Contact route and reusable homepage contact section.
- Shared navigation, locale selector, theme selector, and dismissible event announcement.
- Search-engine metadata, structured data, sitemap, and robots behavior.

## Architecture

- Next.js App Router provides locale-prefixed routes.
- next-intl provides locale routing and interface-message resolution.
- Domain types define content contracts.
- Repositories load and resolve canonical content records.
- Pure utilities handle sorting, pagination, slug normalization, and safe URL validation.
- Components receive resolved data through typed props.
- Canonical content is stored under src/content/data/.
- UI messages are stored under src/i18n/messages/{en,fa}/.
- Shared visual tokens are defined centrally and support light and dark themes.

## Localization and routing

- Supported locale prefixes are /en and /fa.
- English uses LTR; Persian uses RTL.
- Persian is the default locale.
- Stable content IDs do not change when localized titles or slugs change.
- Locale switching preserves the equivalent content identity when a translation exists.
- Unknown and unpublished detail routes return a real 404.

## Design and accessibility

- Preserve the established quiet editorial design language.
- Prefer shared shadcn/ui components where available.
- Use semantic landmarks, keyboard-operable controls, visible focus, and accessible names.
- Support reduced motion.
- Prevent unintended horizontal overflow at supported breakpoints.
- Preserve image fidelity and use theme tokens for image-frame backgrounds.

## Data and publication

- Content records are validated for structure, unique IDs, valid references, safe asset paths, and publication state.
- Optional editorial fields may be absent and must not break rendering.
- Public archives and detail routes include only eligible published records.
- Archive ordering is deterministic and follows the domain sort contract.
- Pagination defaults to 6 and supports 10 and 20.

## Quality gates

- ESLint and TypeScript.
- Locale message catalog audit.
- Content schema and relationship validation.
- Content-independence audit for technical documentation and tests.
- Unit and integration tests using synthetic data.
- Browser tests for routing, localization, accessibility, responsive behavior, and interaction.
- Production build and route smoke tests.

## Scope boundary

This document does not define the artist's identity, biography, family information, contact destinations, CV facts, artwork titles, collection names, Journal copy, or any other editorial content. Those values are maintained only in canonical content sources.
