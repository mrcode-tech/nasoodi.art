# Entrance Page — Product and Technical Specification

**Status:** Proposed implementation contract  
**Repository:** `mrcode-tech/nasoodi.art`  
**Authorized working branch:** `feature` only  
**Surface:** Public root route (`/`)  
**Locales entered from this page:** English (`/en`) and Persian (`/fa`)  
**Primary direction:** The Artist's Quiet Gallery

## 1. Purpose

Introduce a dedicated, minimal entrance page at the site root. It is the visitor's first point of entry and presents one large, authentic artwork, the artist's canonical display name, a short English welcome message, and two language-entry links.

The entrance page is a language-selection gateway with an editorial gallery presentation—not a replacement homepage, marketing landing page, splash animation, or new content section.

The visitor must be able to enter either localized experience immediately:

- **Enter** → `/en`
- **ورود** → `/fa`

The existing localized homepages and all localized routes remain intact.

## 2. Goals and non-goals

### Goals

- Make the artwork the dominant visual element.
- Communicate whose artistic portfolio the visitor is entering using the canonical artist profile.
- Keep the welcome message in English for both language choices.
- Offer exactly two clear, equally weighted language-entry actions.
- Feel like entering a quiet contemporary art gallery.
- Work on desktop, tablet, mobile, portrait, landscape, and short-height screens.
- Respect the existing light/dark theme system and preserve artwork fidelity.
- Keep the root route directly accessible, crawlable, keyboard-operable, and fast.

### Non-goals

- Do not redesign, replace, or duplicate either localized homepage.
- Do not add a new navigation sidebar, breadcrumb, menu, footer navigation, contact panel, gallery grid, journal preview, newsletter, or promotional content.
- Do not add language auto-detection, geolocation redirects, browser-language redirects, or forced locale selection.
- Do not add a new theme switcher to the entrance page.
- Do not add autoplay, slideshow behavior, video, parallax, scroll hijacking, or decorative animation.
- Do not create a new artist biography, artwork record, or duplicate image asset.
- Do not change editorial content, artwork ordering, localized slugs, or existing page SEO except where root-route discovery requires a coordinated update.

## 3. Visitor experience and information hierarchy

The page has one clear visual hierarchy:

1. **Artwork:** one large, real artwork from the existing published portfolio data.
2. **Artist identity:** the canonical display name from the existing artist-profile repository.
3. **Welcome message:** concise English copy.
4. **Language selection:** two small, equally prominent links.

The composition should communicate the artwork before the visitor reads the copy. Avoid adding a logo, eyebrow, explanatory paragraph, decorative badge, or secondary call to action unless the existing design system demonstrates a necessary role.

### 3.1 Approved message structure

Use the canonical artist display name dynamically. Do not hardcode a second copy of the artist's name in a component, route, metadata file, or test.

Recommended English message:

> Welcome to the artistic world of {ARTIST_DISPLAY_NAME}. Discover paintings, stories, and artistic expressions.

A shorter alternative is acceptable if the rendered design needs less vertical space:

> Enter a world of art, emotion, and expression.

The artist's name and any profession/role label must come from the existing canonical artist-profile repository. Do not invent or duplicate profile facts. The message is English on the root page regardless of which language link the visitor chooses.

The visible language labels are exactly:

- `Enter`
- `ورود`

The Persian label must be rendered with the existing Persian font treatment and correct local directionality. Do not add flags or language abbreviations.

## 4. Layout and visual design

### 4.1 Overall composition

Use a single centered editorial column on a quiet, theme-aware canvas. The artwork receives the largest area; identity, welcome copy, and language links form a compact block below it.

The page should fit within a typical viewport without forcing scrolling. On short screens or when the artwork's native aspect ratio makes this impossible, allow natural vertical scrolling rather than shrinking the painting to an unusable size or clipping the controls.

The layout is not a rigid pixel specification. Use the shared spacing, typography, width, and breakpoint tokens after inspecting their actual definitions.

### 4.2 Artwork region

- Render one artwork only.
- Prefer the existing homepage featured-artwork resolution if it represents an appropriate, published, public artwork and can be reused without changing homepage behavior.
- Otherwise use the existing artwork repository and its established publication/eligibility rules to resolve a deterministic entrance artwork.
- If the current content model cannot express an owner-selected entrance artwork, propose a minimal optional stable reference in the canonical site configuration. Do not duplicate the artwork record, image path, or metadata.
- Never select a draft, private, review-only, unpublished, rights-ineligible, or incomplete record.
- Do not hardcode production artwork IDs, slugs, titles, or image filenames in the component or technical tests.
- Preserve the source aspect ratio and show the complete painting by default. Use contain behavior, not an arbitrary cover crop.
- Do not mirror, recolor, filter, blur, fade, overlay, mask, or otherwise alter the painting.
- Use the existing image pipeline and responsive image component. Provide intrinsic dimensions/aspect ratio to prevent layout shift.
- Prioritize the single above-the-fold artwork as the likely Largest Contentful Paint (LCP) image. Do not eagerly prioritize unrelated images.
- Provide meaningful alt text from canonical artwork data. If the chosen artwork is intentionally decorative in the final semantic context, use empty alt only when that decision is justified and documented.
- The image frame/background must use the shared theme canvas token, not hardcoded white or black.

Suggested composition targets for visual review, not fixed implementation values:
- Desktop/tablet: artwork region should occupy roughly 55–70% of the available first-screen visual height when the source aspect ratio permits.
- Mobile: artwork should remain the first and largest element, usually around 45–60% of the initial viewport height.
- Preserve comfortable breathing room around the artwork and a compact, readable text/action block below it.
- Do not force a common image crop across different source aspect ratios.

### 4.3 Identity and message block

- Use one semantic H1 for the canonical artist display name.
- Use the shared display/page typography tokens; do not introduce page-specific arbitrary font sizes.
- Keep the English welcome copy short, readable, and visually subordinate to the artwork and artist name.
- Keep line lengths controlled and allow natural wrapping.
- Do not add a second biography or repeat the homepage introduction.

### 4.4 Language actions

- Present exactly two actions, side by side when space permits and stacked only when the narrow viewport or text metrics require it.
- Use semantic links (Next.js Link or equivalent), not buttons with JavaScript-only navigation.
- The English link must resolve to the literal localized route `/en`; the Persian link must resolve to `/fa`.
- Use the existing shared button/link primitives and design tokens where appropriate.
- Keep both actions visually equal in importance. A restrained outline or text-link treatment is preferred; avoid a large filled primary CTA that competes with the artwork.
- Provide clear hover, active, and visible keyboard-focus states.
- Hover styling must not be the only feedback and must be gated to hover-capable fine pointers where needed.
- Do not use flags, icons, tooltips, or a dropdown.
- The Persian label must carry appropriate `lang="fa"` and `dir="rtl"` semantics at the smallest suitable element boundary; the overall root document remains English LTR.

## 5. Responsive behavior

The layout must adapt fluidly without separate desktop/mobile page implementations.

### Desktop

- Keep the artwork centered and large, with its full composition visible.
- Keep the identity/message/action group directly below the artwork.
- Avoid sidebars, top navigation, or multi-column content.

### Tablet

- Reduce outer whitespace and artwork maximum dimensions as needed.
- Preserve the same content order and clear focal point.
- Keep both language links comfortably separated and touch-accessible.

### Mobile

- Artwork remains first.
- The name, English message, and language actions follow in that order.
- Avoid clipping the image or controls under browser chrome and safe areas.
- Use dynamic viewport units only where supported by the current project conventions; include a robust fallback.
- Support narrow widths, text enlargement, landscape orientation, and short-height screens.
- If all content cannot fit, allow scrolling. Never hide the language links below an inaccessible fixed-height container.
- Prevent horizontal overflow in both themes.

## 6. Theme behavior

The entrance page uses the existing shared theme system:

- Light mode uses the current warm-paper gallery canvas and semantic text/accent tokens.
- Dark mode uses the existing Midnight Gallery tokens.
- Artwork pixels remain unchanged in both themes.
- Image containment space and surrounding surfaces use semantic theme tokens.
- The entrance page must not create its own theme state, palette, or independent theme provider.
- Do not add a theme toggle to this deliberately minimal page.
- Preserve an existing visitor theme preference when the shared provider supports it; otherwise follow the application's established default/system behavior.
- Avoid hydration flashes or a visible theme jump during initial render.

If the current provider is scoped only to localized routes, refactor its placement only as much as necessary to make the root route share the same provider. Do not mount duplicate providers.

## 7. Routing and application architecture

### 7.1 Root route

- The root URL `/` renders the entrance page directly.
- It must no longer automatically redirect to `/fa`.
- Do not redirect based on IP, geolocation, cookies, Accept-Language, or browser locale.
- Do not change the existing `/en` or `/fa` route behavior.
- Direct navigation, refresh, and opening either language link in a new tab must work.
- The localized homepages remain the actual portfolio experiences.

### 7.2 App Router integration

Before implementation, inspect the real route tree, root layout, locale layout, middleware/proxy, next-intl configuration, and theme-provider scope. Do not assume a particular route-group or layout file path.

Implement the root page using the existing Next.js App Router conventions. Prefer a server component. Add client-side code only if an existing shared primitive requires it.

Reuse:
- the canonical artist repository for artist identity;
- the existing artwork repository/selection mechanism for the image;
- the shared image component/pipeline;
- the shared theme provider and semantic design tokens;
- the existing link/button primitives;
- the established metadata and structured-data builders.

Components must not import editorial JSON directly. Do not introduce a second source of truth or a parallel content provider.

### 7.3 Error and empty-data behavior

The implementation must not silently render a broken image or a fabricated painting if no eligible artwork can be resolved.

First inspect whether the repository's current content policy guarantees an eligible public artwork. If the entrance artwork is optional or the collection can be empty:
- define a deliberate, visually calm fallback that still permits language entry;
- do not use stock art, generated art, a random external image, or a fictional placeholder;
- do not crash the root route;
- ensure both language links remain visible and usable;
- add a test for the empty state.

Do not change publication eligibility rules merely to make the entrance page display an image.

## 8. Localization and semantics

The entrance is intentionally English-led even though it offers two locales.

- Root document language: `en`.
- Root document direction: `ltr`.
- Welcome message and artist identity display follow the canonical English profile data.
- English action label: `Enter`, linking to `/en`.
- Persian action label: `ورود`, with Persian language/direction semantics, linking to `/fa`.
- The Persian destination must be a normal locale-prefixed link, not a client-only locale mutation.
- Do not add the entrance copy to the Persian translation catalog merely to make the entrance bilingual; the page's specified welcome copy is English-only.
- If shared message catalogs or typed message schemas require a key for the English entrance copy, follow the existing catalog/parity convention without inventing a Persian translation that is rendered on this page.
- Verify correct font loading, Persian shaping, punctuation, focus order, and accessible announcement of the Persian link.

## 9. Accessibility

Target WCAG 2.2 AA and the repository's existing accessibility contract.

- Use a semantic `main` landmark.
- Use one clear H1 for the artist identity.
- Use a real image element with appropriate alt text and intrinsic dimensions.
- Use real anchors for the two destinations.
- Ensure each link has an accessible name matching its visible label.
- Keep keyboard order aligned with visual order: artwork (non-interactive), identity/message, English link, Persian link.
- Provide visible focus indicators with sufficient contrast in both themes.
- Ensure text and control contrast meet WCAG 2.2 AA.
- Do not communicate language choice by color alone.
- Keep touch targets at least the project accessibility standard; target 44 by 44 CSS pixels where practical.
- Support 200% zoom and reflow without loss of content or horizontal scrolling.
- Respect `prefers-reduced-motion`. The page does not need entrance animation.
- Do not add focus traps, auto-focus, timed redirects, or forced delays.
- Verify Persian and English screen-reader pronunciation/semantics.

## 10. Motion and interaction

The default experience is static and immediate.

- No autoplay, slideshow, video, parallax, scroll-triggered reveal, or looping animation.
- A very subtle hover/focus transition may be used for the language links, using existing motion tokens.
- Keep transitions short and purposeful.
- Disable non-essential transitions under reduced-motion preferences.
- Navigation must occur immediately on link activation; never wait for an animation to finish.
- Do not intercept ordinary link behavior or break open-in-new-tab, copy-link, or browser history.

## 11. SEO and structured data

Treat the root entrance as a deliberate language-selection destination.

- Give `/` unique, accurate English title and description using the existing metadata conventions and canonical artist profile data.
- Reuse the repository's configured canonical host and metadata base; do not hardcode a second host policy.
- Use a self-referencing canonical for the root page if it is indexable.
- Keep Open Graph/Twitter metadata accurate. Use the selected artwork only if it is a valid approved social image under the existing image rules; otherwise omit the image rather than inventing one.
- Preserve the existing Person entity identifier and structured-data builder. Do not create a second Person entity or a conflicting artist graph.
- Add or reuse a WebPage/WebSite representation only if consistent with the current shared JSON-LD architecture.
- Do not add keyword lists, name aliases, CV details, or invisible SEO text to the page.
- Do not use hidden content or metadata that misrepresents the visible page.
- Keep `/en` and `/fa` self-canonical and preserve their genuine reciprocal hreflang behavior.
- Since `/` is an intentional language-selection destination, evaluate it as the site's `x-default` hreflang target for both locale homepages, consistent with the international SEO architecture. Emit it only through the centralized metadata builder and verify reciprocal, valid output.
- Include `/` in the sitemap only if the page is intentionally indexable and returns 200. Exclude redirects and non-indexable states.
- Do not add automatic locale redirects for crawlers or visitors.
- Verify robots, sitemap, canonical, Open Graph, and hreflang all use the same canonical host.

The entrance page should be useful to visitors and understandable to search engines, not a thin keyword doorway. Its visible artwork, artist identity, concise introduction, and explicit language links must be rendered in crawlable HTML.

## 12. Performance and resilience

- Keep the root page a server-rendered route where possible.
- Avoid adding dependencies or animation packages.
- Prioritize only the entrance artwork image.
- Use responsive image sizes and an accurate `sizes` attribute.
- Avoid layout shift by reserving image space.
- Do not lazy-load the above-the-fold LCP image.
- Do not preload duplicate artwork variants.
- Avoid client-only image selection or a flash of empty content.
- Keep the language links usable if the image fails to load.
- Verify production build output and root route response.

## 13. Privacy and external services

- Do not add analytics, advertising pixels, session replay, third-party fonts, remote embeds, or tracking.
- Do not add external image requests.
- Do not introduce geolocation or browser fingerprinting.
- Preserve the current privacy and security headers.

## 14. Testing and quality assurance

Tests must verify behavior and stable contracts, not current editorial values.

### Unit/integration coverage

- Artist display name is obtained through the existing repository/adapter.
- Entrance artwork is resolved through the existing published-content mechanism.
- Ineligible content is never selected.
- Empty artwork state remains usable if the content model allows it.
- Metadata and structured data use the centralized builders.
- The root page does not mutate or bypass locale routing.

### Browser coverage

- `/` returns 200 and renders the entrance page instead of redirecting to `/fa`.
- Exactly two visible language-entry links are present.
- The English link has the expected accessible name and resolves to `/en`.
- The Persian link has the expected accessible name and resolves to `/fa`.
- Both destination routes load successfully.
- Root document language and direction are English/LTR.
- Persian link text exposes Persian language/direction semantics.
- Artwork is visible, uses the resolved source, preserves aspect ratio, and does not overflow.
- Artist identity and message are visible without hardcoded editorial assertions.
- Light and dark themes render with readable contrast and no artwork filtering.
- Keyboard focus is visible and activation works.
- Reduced-motion mode does not introduce forced animation.
- Desktop, tablet, mobile, landscape, short-height, and enlarged-text layouts have no unintended horizontal overflow.
- Image failure or an allowed empty-data state does not hide language navigation.
- Root metadata, canonical, sitemap membership, and hreflang/x-default behavior match the agreed SEO policy.

### Test-data policy

- Use synthetic artist/artwork records and generic IDs.
- Do not assert production names, titles, artwork counts, slugs, or image filenames.
- Do not add fixture fallback content to production.
- Do not weaken existing tests to obtain a passing run.

## 15. Visual QA

Inspect rendered screenshots—not only source code—at representative wide desktop, laptop, tablet, narrow mobile, landscape mobile, and short-height viewports.

Review:
- artwork scale and full-image visibility;
- balance between image and text;
- whitespace and vertical rhythm;
- name and message wrapping;
- visual equality of the two language actions;
- Persian font rendering;
- theme consistency;
- focus states;
- loading/empty/error behavior;
- no visual competition from unnecessary controls.

Capture screenshots for both themes and both language-action states where meaningful. Record the viewport and theme used. Do not claim visual verification unless the rendered output was inspected.

## 16. Acceptance criteria

- [ ] Root URL renders the new entrance page directly.
- [ ] Root no longer automatically redirects to the Persian homepage.
- [ ] Existing `/en` and `/fa` experiences remain unchanged.
- [ ] One eligible existing artwork is displayed without visual alteration.
- [ ] Artist identity is sourced from the canonical repository.
- [ ] English welcome copy is visible for both language choices.
- [ ] Exactly two language links are present: Enter and ورود.
- [ ] Links navigate to `/en` and `/fa` using normal browser navigation.
- [ ] The page follows the shared design system and both themes.
- [ ] Responsive, keyboard, reduced-motion, RTL, and contrast checks pass.
- [ ] Root SEO, canonical, sitemap, structured data, and x-default behavior are consistent.
- [ ] Empty/error behavior is deliberate and does not block entry.
- [ ] Relevant automated checks and the full CI workflow pass on the final tested commit.
- [ ] No unrelated page, content, asset, route, or deployment behavior changes.

## 17. Change boundaries

Implementation is authorized only on the existing `feature` branch. Preserve unrelated work and use normal non-destructive commits. Do not create or switch branches, force-push, rewrite history, merge into `stage` or `main`, deploy, publish, or change external services without separate explicit approval.
