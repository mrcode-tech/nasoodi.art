# Nasoodi.art — Technical Specification Index

This directory documents application architecture, interface behavior, design systems, localization, accessibility, content schemas, SEO, testing, and release processes. It is not an editorial source of truth.

## Documentation rules

- Describe stable technical contracts and observable behavior.
- Do not include personal identity, biography, family details, contact destinations, CV entries, artwork or collection titles, Journal copy, production content IDs, production slugs, image filenames, or current editorial record counts.
- Use generic placeholders such as ARTWORK_ID, COLLECTION_ID, JOURNAL_ENTRY_ID, CONTENT_TITLE, and LOCALIZED_SLUG.
- Keep editorial records in canonical content data files and UI translations in locale message resources.
- Use synthetic examples in tests and documentation.
- Update acceptance criteria and tests when a technical contract changes.
- Mark obsolete specifications clearly and remove conflicting requirements from the active document map.

## Technical document map

### Architecture and content boundaries
- Content model: content-model.md
- Content architecture and data separation: content-architecture-and-data-separation.md
- Artwork imaging and asset pipeline: artwork-imaging-and-asset-pipeline.md
- Localization and editorial governance: localization-and-editorial-governance.md

### Routing, localization, and discovery
- Internationalization and UI translation architecture: internationalization-and-ui-translation-architecture.md
- International SEO and search discovery architecture: international-seo-and-search-discovery-architecture.md
- Artist name variants and search identity: artist-name-variants-and-search-identity.md
- SEO and discovery: seo-and-discovery.md
- Technical SEO implementation prompt and strict content-preservation contract: technical-seo-implementation-prompt.md

### Design system and interaction
- Site-wide design system: site-wide-design-system-and-section-specification.md
- Shared light and dark theme system: shared-light-dark-theme-system.md
- Shared responsive typography: shared-responsive-typography-system.md
- Navigation and mobile sidebar: navigation-and-mobile-sidebar.md
- shadcn/ui component reuse: shadcn-component-reuse-and-bilingual-ui.md
- Accessibility, performance, and security: accessibility-performance-security.md

### Page and component behavior
- Homepage artwork hero and featured content: homepage-artwork-hero-and-featured-works.md
- Artwork discovery and responsive carousels: artwork-discovery-carousel-and-editorial-experience.md
- Gallery index and pagination: galleries-index-cards-and-pagination.md
- Gallery collections and artwork detail: gallery-collections-and-artwork-detail.md
- Artwork detail return navigation proposal: artwork-detail-return-navigation.md
- Artwork detail return navigation implementation prompt: artwork-detail-return-navigation-implementation-prompt.md
- About and CV layout: artist-about-page-and-mobile-hero.md
- Journal and events: journal-and-events.md
- Configurable content announcement sticker: journal-announcement-specification.md
- Single announcement configuration: src/content/announcement.json
- Contact experience: contact-experience-proposal.md

### Engineering, quality, and release
- AI-assisted development and code quality: ai-assisted-development-and-code-quality.md
- Testing, visual QA, and release acceptance: testing-qa-and-release.md
- Content-independent functional E2E testing strategy: e2e-testing-strategy.md
- Phased implementation blueprint: phased-implementation-blueprint.md
- Website implementation prompt: website-implementation-prompt.md

## Repository conventions

- Localized routes use explicit /en and /fa prefixes.
- English pages use LTR; Persian pages use RTL.
- The default locale is Persian.
- Stable content IDs are independent of localized slugs.
- Canonical content is stored under src/content/data/.
- The artist's canonical profile is `src/content/data/artist-profile.json`; its curated alternate-name inventory is `src/content/data/artist-name-aliases.json`, owned and exposed by the same artist content adapter.
- UI translations are stored under src/i18n/messages/{en,fa}/.
- Components consume repository-layer data rather than importing editorial JSON directly.
- Pagination defaults to 6 and supports 10 and 20.
- Pagination, sorting, routing, and metadata must work for arbitrary valid dataset sizes.
- The collection index uses its specified static-card layout; carousel behavior is scoped to components that require it.
- Preserve design tokens, accessibility, responsive behavior, and RTL/LTR contracts.

## Specification authority

The most specific active technical specification governs its domain. Shared architecture, localization, design-system, accessibility, and testing contracts apply across the application. Resolve conflicts explicitly and update superseded documents rather than leaving contradictory active requirements.

## Change and release boundaries

Work only on the explicitly authorized branch. Inspect repository state before editing, keep changes focused, run relevant checks and the complete CI workflow, and report exact commit and CI evidence. CI completion does not authorize merging or deployment.
