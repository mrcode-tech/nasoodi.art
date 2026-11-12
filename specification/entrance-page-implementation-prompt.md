# Implementation Prompt — Nasoodi.art Entrance Page

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Primary specification:** `specification/entrance-page-specification.md`  
**Task type:** User-facing root-route feature implementation  
**Deployment/merge authorization:** Not granted

## Objective

Implement the new minimal entrance page at `/` according to the complete contract in `specification/entrance-page-specification.md`.

The entrance must present:
1. One large, authentic, existing published artwork.
2. The artist's canonical display name, resolved through the existing artist repository.
3. A concise English welcome message, visible regardless of the selected destination.
4. Exactly two minimal language links:
   - `Enter` → `/en`
   - `ورود` → `/fa`

The page should feel like entering a quiet contemporary art gallery. The painting is the dominant visual element. The root route is a language-selection destination, not a replacement for either localized homepage.

## Mandatory preparation — do not skip

1. Read `AGENTS.md`, `agent.md`, and `specification/README.md`.
2. Read the complete entrance specification.
3. Read the mandatory design authorities:
   - `specification/design-engineering-skills.md`
   - `specification/design-direction-and-system-refinement.md`
4. Read relevant specialized authorities:
   - `specification/visual-identity-and-photo-direction.md`
   - `specification/site-wide-design-system-and-section-specification.md`
   - `specification/shared-light-dark-theme-system.md`
   - `specification/shared-responsive-typography-system.md`
   - `specification/homepage-artwork-hero-and-featured-works.md`
   - `specification/artwork-imaging-and-asset-pipeline.md`
   - `specification/content-model.md`
   - `specification/content-architecture-and-data-separation.md`
   - `specification/localization-and-editorial-governance.md`
   - `specification/internationalization-and-ui-translation-architecture.md`
   - `specification/international-seo-and-search-discovery-architecture.md`
   - `specification/seo-and-discovery.md`
   - `specification/accessibility-performance-security.md`
   - `specification/testing-qa-and-release.md`
   - `specification/e2e-testing-strategy.md`
5. Inspect the actual feature-branch implementation before editing:
   - App Router route tree and root/locale layouts;
   - middleware or proxy and next-intl routing/configuration;
   - theme provider placement, theme persistence, and semantic tokens;
   - canonical artist profile repository and its localized data;
   - artwork repository, publication eligibility, image metadata, and existing featured-artwork resolution;
   - shared image, link, and button primitives;
   - metadata, canonical, hreflang, sitemap, robots, and JSON-LD builders;
   - existing unit, integration, Playwright, visual, and CI workflows.
6. Inspect actual artwork candidates and their aspect ratios. Select only an eligible existing artwork. Do not guess an image path or copy an asset.

If a required document or implementation path differs from this list, locate the current equivalent and record the actual path. Do not assume file locations from this prompt.

## Implementation requirements

### A. Root routing

- Make `/` render the entrance page directly.
- Remove the current root-to-`/fa` redirect only for the root route.
- Preserve all existing localized routes and locale resolution.
- Do not add geolocation, Accept-Language, cookie, or browser-locale redirects.
- Ensure refresh, direct URL entry, and opening either language link in a new tab work.
- Do not change the default locale for routes that genuinely require a locale.

### B. Artwork and artist data

- Resolve artist identity through the canonical artist repository/adapter.
- Resolve the artwork through the existing publication-safe artwork repository and selection rules.
- Prefer reuse of the existing homepage featured-artwork resolver only if it is semantically suitable and does not couple the entrance to homepage presentation state.
- If an explicit owner-selected artwork cannot be represented by current data, propose the smallest optional stable reference in canonical site configuration. Do not add duplicated artwork metadata or hardcoded asset paths.
- Preserve the complete artwork, native aspect ratio, original color, and image fidelity.
- Use the current responsive image pipeline, intrinsic dimensions, meaningful alt text, and correct LCP priority.
- Do not introduce sample, fictional, placeholder, or external artwork.
- If no eligible artwork can exist under the current content rules, implement the documented graceful fallback and keep both language links available. Do not weaken publication rules.

### C. Content and presentation

Use the English welcome message defined in the specification, with the artist display name supplied dynamically by the canonical repository:

> Welcome to the artistic world of {ARTIST_DISPLAY_NAME}. Discover paintings, stories, and artistic expressions.

The visible language labels must be exactly `Enter` and `ورود`.

- Do not hardcode the artist name in the component.
- Do not add biography text, invented profession facts, or a second editorial source.
- Do not add a logo, menu, sidebar, breadcrumb, contact information, gallery preview, journal preview, or conventional footer.
- Do not add flags, a dropdown, or extra language controls.
- Keep the copy concise and secondary to the painting.

### D. Visual design and responsive layout

- Follow the existing “The Artist's Quiet Gallery” direction.
- Use shared semantic theme, spacing, typography, and surface tokens.
- Keep the artwork centered and dominant, with the name, English message, and two actions beneath it.
- Show the complete artwork using contain behavior by default.
- Preserve the same content order at every breakpoint.
- Ensure short-height and narrow screens can scroll naturally rather than clipping controls.
- Make both language actions equal in visual importance.
- Do not introduce a parallel design system, arbitrary page-specific palette, heavy card treatment, gradients, or decorative effects.
- Do not use animation as a prerequisite for seeing the content.

### E. Theme and hydration

- Reuse the existing shared theme provider and its persisted preference.
- Support the existing light and dark themes without changing their tokens.
- If provider placement prevents the root route from using the shared theme, make the smallest safe layout-level adjustment; do not mount a duplicate provider.
- Keep the artwork unfiltered in both themes.
- Prevent hydration mismatch, flash of the wrong theme, and layout shift.
- Do not add a theme toggle to the entrance page.

### F. Semantics, accessibility, and localization

- Root document uses `lang="en"` and `dir="ltr"`.
- Use one main landmark and one H1.
- Use actual anchors/Next.js links for both destinations.
- The Persian link text must use appropriate Persian language and RTL semantics and the existing Persian font treatment.
- Keep keyboard order and focus visible.
- Verify contrast in both themes, zoom/reflow, touch target size, and screen-reader semantics.
- Respect reduced motion; avoid forced delays and auto-navigation.
- Do not add a Persian translation of the English welcome copy to the rendered root page.

### G. SEO and structured data

- Use existing metadata builders and canonical host configuration.
- Give the root route accurate, unique English title and description.
- Preserve existing locale canonical and hreflang behavior.
- Evaluate root `/` as the `x-default` destination for `/en` and `/fa`, using the centralized alternate builder. Do not hand-author duplicate hreflang tags.
- Include the root URL in the sitemap only if the final indexability policy and HTTP response make it eligible.
- Reuse the existing canonical Person entity and structured-data utilities; do not duplicate or conflict with the global artist graph.
- Use the entrance artwork for social metadata only if it meets the existing approved image rules.
- Ensure metadata describes the visible entrance page and does not contain hidden keywords or unreviewed name variants.
- Verify canonical host consistency across canonical, sitemap, robots, Open Graph, and hreflang.

If the current SEO architecture makes the proposed root x-default or sitemap behavior contradictory, document the conflict, resolve it in the relevant specification, and implement one consistent policy rather than silently emitting inconsistent metadata.

### H. Testing

Add focused tests at the appropriate layers. Keep tests content-independent and use synthetic records.

Cover:
- root route returns 200 and does not redirect to `/fa`;
- exactly two language links and their correct hrefs;
- both locale destinations remain functional;
- root language/direction and Persian link semantics;
- canonical artist repository integration;
- safe artwork selection and ineligible/empty-data behavior;
- image dimensions, aspect ratio, alt text, and no visual filters;
- light/dark theme behavior;
- keyboard focus and activation;
- reduced motion;
- desktop/tablet/mobile/landscape/short-height/reflow behavior;
- no horizontal overflow;
- metadata, canonical, sitemap, structured data, and x-default behavior.

Do not assert production artist names, artwork titles, production IDs, slugs, filenames, image counts, or current collection sizes. Do not add production fixture fallback data. Do not weaken or delete meaningful existing tests.

## Visual review

Run the application with a production-like build where possible. Inspect screenshots at representative desktop, tablet, mobile, landscape, and short-height sizes in both themes. Review actual artwork scale, whitespace, copy wrapping, Persian label rendering, button equality, focus, and image loading.

Fix the largest visual defects before reporting completion. Source-code review alone is not visual verification. Attach or link CI-generated screenshots/artifacts when available; do not claim a screenshot was inspected if it was not.

## Verification and reporting

Run the relevant checks and the complete configured CI workflow on the final implementation commit. At minimum, inspect:
- lint;
- TypeScript;
- content/schema tests;
- production build;
- image metadata checks;
- i18n audit;
- Playwright/browser tests;
- production route smoke tests;
- accessibility checks available in the repository.

Report:
1. exact branch and final commit SHA;
2. files changed;
3. root route and language-link behavior;
4. artwork resolution and fallback behavior;
5. SEO/canonical/hreflang/sitemap decisions;
6. tests and CI run URL with exact conclusion;
7. visual viewports/themes inspected;
8. known limitations or unresolved failures.

Do not report success for checks that did not complete.

## Strict change boundaries

- Work only on the existing `feature` branch.
- Preserve unrelated working-tree and branch changes.
- Use normal, non-destructive commits.
- Do not create or switch branches.
- Do not force-push or rewrite history.
- Do not merge into `stage` or `main`.
- Do not deploy, publish, or change Vercel settings, DNS, domains, analytics, or other external services.
- Do not implement unrelated refactors.
- Do not alter the existing localized homepages except for a strictly necessary shared infrastructure correction, with regression tests.
- Documentation and implementation must remain separate: this prompt authorizes the entrance feature implementation only when explicitly invoked as the next task; it does not authorize deployment or release.
