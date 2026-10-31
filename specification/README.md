# Nasoodi.art — Professional Oil Painter Portfolio Specification

This directory is the product, design, content, and implementation source of truth for nasoodi.art. It defines a bilingual (Persian/English) professional portfolio for oil painter Ghazaleh Abdolahzade Nasoodi (غزاله عبداله زاده نسودی).

## How to use this specification

1. Read this index and repository-level AGENTS.md.
2. Before any user-facing UI or interaction work, read design-engineering-skills.md and design-direction-and-system-refinement.md.
3. Read proposal.md for product scope and binding principles.
4. Read visual-identity-and-photo-direction.md and site-wide-design-system-and-section-specification.md before broad UI implementation.
5. Read the relevant page-specific specification: easel-scroll-background.md, navigation-and-mobile-sidebar.md, gallery-collections-and-artwork-detail.md, homepage-artwork-hero-and-featured-works.md, or journal-and-events.md.
6. Read content-model.md, artwork-imaging-and-asset-pipeline.md, and localization-and-editorial-governance.md before adding content or images.
7. Read the relevant technical contracts for SEO, accessibility, performance, privacy, security, and testing.
8. Follow implementation-roadmap.md for sequencing and phase exit criteria.
9. Treat artist/site-owner approval as a required content and visual gate; do not infer missing facts.

## Document map

### Product and experience
- [Product proposal](./proposal.md) — goals, audiences, non-goals, routes, page content, functionality, and open decisions.
- [Wireframes and interaction design](./wireframes.md) — page structure, responsive behavior, gallery, lightbox, and RTL interaction.
- [Site-wide design system and section specification](./site-wide-design-system-and-section-specification.md) — semantic tokens, typography, global shell, homepage, Works, artwork detail, About, CV, Contact, components, and responsive design.
- [Visual identity and photo direction](./visual-identity-and-photo-direction.md) — reference-photo analysis, palette, studio-image use, crop rules, and visual QA.
- [Full-page easel scroll background](./easel-scroll-background.md) — left-edge document-length easel composition, scroll-linked reveal, responsive rules, reduced motion, and acceptance criteria.
- [Responsive sidebar navigation, language, and theme](./navigation-and-mobile-sidebar.md) — persistent desktop left sidebar, desktop top-bar settings, mobile off-canvas menu, bottom-of-menu selectors, RTL, accessibility, and responsive acceptance criteria.
- [Gallery collections and artwork detail](./gallery-collections-and-artwork-detail.md) — multiple curated galleries, gallery index/detail pages, artwork membership, validation, editorial workflow, SEO, and testing.
- [Galleries index cards and pagination](./galleries-index-cards-and-pagination.md) — owner-approved static poster-card grid for the main Galleries index, five-item default, 5/10/20 page-size selector, URL-backed pagination, RTL/LTR behavior, accessibility, and homepage-carousel regression protection.
- [Homepage artwork hero and featured works](./homepage-artwork-hero-and-featured-works.md) — approved painting-led hero, middle-page selected works, featured gallery previews, responsive layout, and acceptance criteria.
- [Selected Works three-level experience](./selected-works-three-level-experience.md)
- [Approved artwork and gallery content inventory](./approved-artwork-content-inventory.md) — canonical public asset mappings, five localized artwork records, and four overlapping collections. — authoritative design and implementation contract for homepage artwork viewer, collection discovery index, collection detail gallery, contextual navigation, responsive behavior, shadcn composition, accessibility, SEO, and acceptance criteria.
- [Bilingual homepage hero, CTAs, and showcase](./homepage-hero-cta-and-showcase.md) — implementation-ready English/Persian hero and CTA design, responsive wireframes, sample asset mapping, homepage showcase rules, and complete test scenarios.
- [Design engineering skills and operating contract](./design-engineering-skills.md) — Emil Kowalski and Impeccable-inspired project rules for design workflow, interaction, motion, component craft, and visual QA.\n- [Refined design direction and unified design system](./design-direction-and-system-refinement.md) — the artist's quiet gallery direction, semantic tokens, typography, layout, image composition, navigation, and page-level design contracts.\n- [Journal, articles, and events](./journal-and-events.md) — unified Journal archive, article/event content model, homepage latest entries, sidebar navigation, event lifecycle, SEO, and QA.
- [Studio hero implementation prompt](./hero-implementation-prompt.md) — supporting studio-scene implementation brief; the artwork-led homepage hero specification takes precedence for the primary hero.

#
- [Shadcn/ui component reuse and bilingual shared UI](./shadcn-component-reuse-and-bilingual-ui.md) — component discovery, reuse, Sidebar/Sheet/Dropdown composition, RTL/LTR behavior, and new-component policy.

### Implementation execution
- [Phased implementation blueprint](./phased-implementation-blueprint.md) — dependency-aware phases, deliverables, tests, exit gates, and evidence requirements; use as the execution sequence.
- [Website implementation prompt](./website-implementation-prompt.md) — end-to-end coding-agent prompt that enforces the repository, content, design, testing, and release constraints.

## Content and assets
- [Content and artwork model](./content-model.md) — artist, artwork, series, galleries, homepage selections, CV, approval states, and localized fields.
- [Artwork imaging and asset pipeline](./artwork-imaging-and-asset-pipeline.md) — capture, provenance, rights, derivatives, fidelity, alt text, and image delivery.
- [Localization and editorial governance](./localization-and-editorial-governance.md) — Persian/English rules, translation parity, content approval, and writing standards.

### Technical quality
- [SEO and discovery](./seo-and-discovery.md) — metadata, canonicals, hreflang, sitemap, robots, structured data, and measurement.
- [Accessibility, performance, privacy, and security](./accessibility-performance-security.md) — WCAG 2.2 AA target, motion, Core Web Vitals, privacy, and security.
- [Testing, visual QA, and release acceptance](./testing-qa-and-release.md) — test layers, screenshots, CI, artist approval, and release gates.
- [Implementation roadmap](./implementation-roadmap.md) — compatibility pointer to the canonical phased blueprint.

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

## Design quality authority

The following documents are mandatory for all UI design and implementation work:

- [Design engineering skills and operating contract](./design-engineering-skills.md) — project-specific Emil Kowalski and Impeccable-inspired workflow, motion decision gate, component craftsmanship, responsive behavior, and visual QA.
- [Refined design direction and unified design system](./design-direction-and-system-refinement.md) — the artist's quiet gallery direction, semantic palette, typography roles, spacing, image composition, navigation, motion language, and page-specific composition contracts.

Read these before changing any visual surface. Page-specific specifications remain authoritative for their unique content and behavior, but must conform to the shared design direction and quality contract. If a conflict exists, preserve factual/content constraints and artwork fidelity first, then reconcile the visual treatment in the relevant page specification.

## Implementation execution and evidence

- [Website implementation prompt](./website-implementation-prompt.md) — complete coding-agent execution instructions.
- [Phased implementation blueprint](./phased-implementation-blueprint.md) — canonical phase order, dependencies, exit criteria, evidence, and current implementation progress.
- [Asset review register](./asset-review-register.md) — source-asset classification, inspection, rights, and public-use approval gates.

The blueprint's progress snapshot is the current status authority. Do not treat proposed specifications or empty content records as evidence of publication approval.


## Artwork discovery and editorial presentation refinement — 2026-10-31

The current authoritative contract for responsive artwork carousels and homepage Journal preview is [Artwork discovery, responsive carousels, and editorial Journal experience](./artwork-discovery-carousel-and-editorial-experience.md).

Read it together with:
- [Homepage artwork hero and featured works](./homepage-artwork-hero-and-featured-works.md)
- [Selected Works three-level experience](./selected-works-three-level-experience.md)
- [Gallery collections and artwork detail](./gallery-collections-and-artwork-detail.md)
- [Journal, articles, and events](./journal-and-events.md)
- [Wireframes and interaction design](./wireframes.md)
- [shadcn/ui component reuse](./shadcn-component-reuse-and-bilingual-ui.md)

**Conflict resolution:** the new contract supersedes earlier grid-first artwork presentation guidance for the homepage Selected Works section and collection-detail primary browsing surface. It does not replace the static artwork-led Hero, the gallery-index editorial collection-preview role, the canonical artwork viewer, content/approval rules, or the Journal editorial layout. The Journal homepage preview is limited to the two newest eligible published entries. Existing routes and the unified Journal information architecture remain unchanged.
