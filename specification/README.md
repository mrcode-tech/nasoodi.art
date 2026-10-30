# Nasoodi.art — Professional Oil Painter Portfolio Specification

This directory is the product, design, content, and implementation source of truth for nasoodi.art. It defines a bilingual (Persian/English) professional portfolio for oil painter Ghazaleh Abdolahzade Nasoodi (غزاله عبداله زاده نسودی).

## How to use this specification

1. Read this index and the repository-level AGENTS.md before making changes.
2. Read proposal.md for product scope and binding principles.
3. Read visual-identity-and-photo-direction.md and site-wide-design-system-and-section-specification.md before UI implementation.
4. Read easel-scroll-background.md before implementing the persistent easel background or any scroll-linked movement.\n5. Read gallery-collections-and-artwork-detail.md and homepage-artwork-hero-and-featured-works.md before implementing galleries, artwork detail routes, or homepage artwork sections.
7. Read content-model.md, artwork-imaging-and-asset-pipeline.md, and localization-and-editorial-governance.md before adding content or images.
8. Read the relevant technical contracts for SEO, accessibility, performance, privacy, security, and testing.
9. Follow implementation-roadmap.md for sequencing and phase exit criteria.
10. Treat artist/site-owner approval as a required content and visual gate; do not infer missing facts.

## Document map

### Product and experience
- [Product proposal](./proposal.md) — goals, audiences, non-goals, routes, page content, functionality, and open decisions.
- [Wireframes and interaction design](./wireframes.md) — page structure, responsive behavior, gallery, lightbox, and RTL interaction.
- [Site-wide design system and section specification](./site-wide-design-system-and-section-specification.md) — semantic tokens, typography, global shell, homepage, Works, artwork detail, About, CV, Contact, components, and responsive design.
- [Visual identity and photo direction](./visual-identity-and-photo-direction.md) — reference-photo analysis, palette, studio-image use, crop rules, and visual QA.
- [Full-page easel scroll background](./easel-scroll-background.md) — left-edge document-length easel composition, scroll-linked reveal, responsive rules, reduced motion, and acceptance criteria.
- [Responsive sidebar navigation, language, and theme](./navigation-and-mobile-sidebar.md) — persistent desktop left sidebar, desktop top-bar settings, mobile off-canvas menu, bottom-of-menu selectors, RTL, accessibility, and responsive acceptance criteria.\n- [Gallery collections and artwork detail](./gallery-collections-and-artwork-detail.md) — multiple curated galleries, gallery index/detail pages, artwork membership, validation, editorial workflow, SEO, and testing.\n- [Homepage artwork hero and featured works](./homepage-artwork-hero-and-featured-works.md) — approved painting-led hero, middle-page selected works, featured gallery previews, responsive layout, and acceptance criteria.\n- [Journal, articles, and events](./journal-and-events.md) — unified Journal archive, article/event content model, homepage latest entries, sidebar navigation, event lifecycle, SEO, and QA.
- [Studio hero implementation prompt](./hero-implementation-prompt.md) — supporting studio-scene implementation brief; the artwork-led homepage hero specification takes precedence for the primary hero.

### Content and assets
- [Content and artwork model](./content-model.md) — artist, artwork, series, galleries, homepage selections, CV, approval states, and localized fields.
- [Artwork imaging and asset pipeline](./artwork-imaging-and-asset-pipeline.md) — capture, provenance, rights, derivatives, fidelity, alt text, and image delivery.
- [Localization and editorial governance](./localization-and-editorial-governance.md) — Persian/English rules, translation parity, content approval, and writing standards.

### Technical quality
- [SEO and discovery](./seo-and-discovery.md) — metadata, canonicals, hreflang, sitemap, robots, structured data, and measurement.
- [Accessibility, performance, privacy, and security](./accessibility-performance-security.md) — WCAG 2.2 AA target, motion, Core Web Vitals, privacy, and security.
- [Testing, visual QA, and release acceptance](./testing-qa-and-release.md) — test layers, screenshots, CI, artist approval, and release gates.
- [Implementation roadmap](./implementation-roadmap.md) — phased delivery, dependencies, tests, and completion evidence.

## Confirmed project context

- Domain: nasoodi.art.
- Artist name supplied by the site owner: Ghazaleh Abdolahzade Nasoodi.
- Persian name supplied by the site owner: غزاله عبداله زاده نسودی.
- Practice: oil painting.
- Location supplied by the owner: Iran.
- Instagram handle supplied by the owner: @ghazalenasoodi.

These supplied facts do not confirm an artist statement, biography, education, exhibitions, artwork titles, years, dimensions, exact medium/substrate per work, prices, availability, commissions, contact details, or image rights. Those require artist/owner confirmation.

## Source-of-truth and status rules

- This folder is the source of truth for portfolio product/design/content requirements.
- The repository-level AGENTS.md governs engineering workflow and quality commands.
- If two documents conflict, proposal.md defines product intent; site-wide-design-system-and-section-specification.md defines page/component design; specialized contracts define their named domains. Record and resolve conflicts rather than silently choosing.
- The implementation roadmap is a plan, not evidence that a feature or CI check already exists.
- Distinguish proposed, implemented, verified, artist-approved, and published states.
- Never publish invented content, unapproved assets, fake testimonials, fake CV entries, or placeholder artwork.
- The studio-process photograph and layered scene are not finished artwork reproductions. Actual paintings must be presented separately in Works.
- The site is a portfolio, not an e-commerce store by default. Sales, pricing, availability, commissions, and enquiry forms require explicit decisions and real operational support.

## Working agreement

- Working branch: feature.
- Keep changes on feature unless explicitly authorized otherwise.
- Do not merge to main, deploy, or change branch strategy without separate explicit authorization.
- Preserve existing work and inspect actual repository state before implementation.
- No claim of test, visual review, asset inspection, artist approval, or deployment is valid without evidence.
