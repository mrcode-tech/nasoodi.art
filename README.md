# Nasoodi.art

A bilingual Persian/English artist portfolio for oil painter Ghazaleh Abdolahzade Nasoodi. The visual direction is **the artist's quiet gallery**: warm paper, restrained mauve and taupe, editorial typography, and artwork-first composition.

## Stack

- Next.js 16.4.3 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- ESLint and Playwright

## Requirements

- Node.js 20.9 or newer
- npm

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route currently directs to the Persian-first `/fa` experience; English is available at `/en`.

## Commands

```bash
npm run dev       # Development server
npm run lint      # ESLint
npm run typecheck # TypeScript
npm test          # Content publication and governance tests
npm run build     # Production build
npm run start     # Production server
npm run test:e2e  # Playwright browser and responsive tests
npm run audit:assets # Inventory candidate image dimensions, sizes, and checksums
```

## Route structure

- `/[locale]` — localized homepage (`fa`, `en`)
- `/[locale]/works` and `/[locale]/works/[slug]` — catalogue and artwork detail
- `/[locale]/galleries` and `/[locale]/galleries/[slug]` — curated gallery index and detail
- `/[locale]/journal` and `/[locale]/journal/[slug]` — unified articles and events
- `/[locale]/about` — artist profile
- `/[locale]/contact` — approved contact destination when supplied

The desktop sidebar remains physically left in both locales. Persian pages use RTL; English pages use LTR. The mobile navigation is an accessible left-side drawer.

## Content and artwork governance

Artwork, gallery, and Journal collections are intentionally empty until their records, translations, image rights, and public presentation are approved. Publication helpers exclude drafts, review items, unapproved rights, missing localized titles, and missing primary-image alt text. Do not add placeholder paintings or invent artist facts, artwork metadata, CV entries, event details, or contact information.

See `specification/README.md` and `specification/phased-implementation-blueprint.md` for implementation contracts and phase evidence. The blueprint records current implementation progress and blockers.

## CI

GitHub Actions runs ESLint, TypeScript, content tests, a production build, Playwright Chromium checks, responsive navigation assertions, screenshot artifact upload, and production route smoke tests on the configured branches.

## Deployment

No deployment is performed by the implementation workflow. Publishing requires a separate explicit authorization and completed content/visual approval gates.

## Continuous integration

GitHub Actions verifies every push to `feature`, `stage`, and `main` with dependency installation, linting, TypeScript checks, content tests, a production build, responsive browser tests, asset inventory, and localized-route smoke tests. Responsive navigation coverage checks fixed desktop utility placement, RTL ordering, keyboard focus, and the portaled language menu.
