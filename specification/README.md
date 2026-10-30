# Nasoodi.art — Artist Portfolio Specification

This folder is the product and implementation source of truth for transforming **nasoodi.art** into the professional portfolio website of **Ghazaleh Abdolahzade Nasoodi (غزاله عبداله زاده نسودی)**, an oil painter based in Iran.

## Documents

- [Product proposal](./proposal.md) — goals, audiences, information architecture, visual direction, functionality, non-functional requirements, SEO, accessibility, privacy, and acceptance criteria.
- [Content and artwork model](./content-model.md) — editorial fields, artwork records, image handling, bilingual content, and content governance.
- [Wireframes and interaction design](./wireframes.md) — page-level layouts, responsive behavior, gallery interactions, and design principles.
- [Visual identity and photo direction](./visual-identity-and-photo-direction.md) — palette sampled from the supplied studio photograph, semantic color tokens, photo usage/cropping guidance, homepage composition, typography, components, and sign-off criteria.
- [Site-wide design system and section specification](./site-wide-design-system-and-section-specification.md) — detailed design rules and implementation guidance for the header, footer, homepage, hero, Works index, artwork detail, About, CV/Exhibitions, and Contact pages.
- [Animated hero implementation prompt](./hero-implementation-prompt.md) — comprehensive coding-agent prompt for the four-layer studio animation and homepage integration.
- [Implementation roadmap](./implementation-roadmap.md) — phased delivery plan, dependencies, tests, and completion gates.

## Current verified facts

- Public site/domain: `nasoodi.art`.
- Artist name supplied by the site owner: **Ghazaleh Abdolahzade Nasoodi**.
- Persian name supplied by the site owner: **غزاله عبداله زاده نسودی**.
- Practice: oil painting.
- Location supplied by the site owner: Iran.
- Instagram handle supplied by the site owner: [@ghazalenasoodi](https://www.instagram.com/ghazalenasoodi/).

These are the only artist-specific facts treated as confirmed in this proposal. The Instagram page could not be inspected in the research environment. No artwork titles, dates, dimensions, exhibition history, education, awards, artist statement, contact details, prices, or availability have been inferred.

## Decision status

This is a proposal, not an authorization to invent content or publish placeholder claims as facts. Implementation should follow the approved direction while treating missing artist-supplied content as an explicit dependency. See the roadmap and open decisions in the proposal.

## Working agreement

- The active working branch for this proposal is `feature`.
- `specification/` is the source of truth for this initiative.
- Keep artist facts evidence-based; use clearly marked draft/placeholder content until approved.
- Do not copy Instagram images or captions without permission and source verification.
- Do not merge this branch into `stage` or `main`, deploy, or change branch strategy without explicit authorization.
