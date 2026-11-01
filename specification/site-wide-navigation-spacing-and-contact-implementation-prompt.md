# Implementation Prompt: Unified Breadcrumbs, Editorial Spacing, Responsive Journal Controls, Typography, and Contact Experience

**Project:** Nasoodi.art  
**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Task type:** Cross-site UX refinement and new Contact experience  
**Status:** Implementation brief; inspect current code and reconcile before changing it  
**Primary design authorities:** `AGENTS.md`, `specification/design-engineering-skills.md`, `specification/design-direction-and-system-refinement.md`, `specification/site-wide-design-system-and-section-specification.md`, `specification/navigation-and-mobile-sidebar.md`, `specification/shadcn-component-reuse-and-bilingual-ui.md`, `specification/localization-and-editorial-governance.md`, and `specification/accessibility-performance-security.md`.

## 1. Objective

Deliver a coherent refinement across the entire bilingual portfolio, not a collection of isolated page patches. The work has six connected outcomes:

1. Introduce one reusable, shadcn/ui Breadcrumb pattern across all applicable routes. Every meaningful ancestor in the path must be navigable, including intermediate levels. Artwork detail pages must provide a clear route back to Selected Works or the relevant collection; Journal pages must have a path back to the Journal archive.
2. Audit and refine vertical spacing across the homepage and every page so sections feel intentionally composed, editorial, and connected rather than separated by excessive empty space.
3. Keep the Journal archive's page-size selector and pagination controls compact, minimal, and on one line at mobile widths whenever the available width permits, without clipping, overlap, or unreadable controls.
4. Keep the sidebar copyright notice on one line at supported desktop sidebar widths, reclaiming unnecessary vertical space without shrinking it into illegibility.
5. Establish a consistent readable text measure and justified alignment for long-form/editorial text across the site, using the actual remaining content width in the viewport rather than an unnecessarily narrow column that causes premature wrapping.
6. Add a Contact section at the bottom of the homepage and a dedicated localized Contact page, linked from the sidebar, with Telegram, email, and Instagram contact methods. Use fictional sample contact details only as clearly identified design-review fixtures until the owner supplies and approves real details.

The outcome must preserve Nasoodi.art's quiet, minimalist, image-led gallery identity. Do not turn the portfolio into a generic SaaS dashboard, marketing landing page, or contact-sales funnel.

## 2. Mandatory preflight and source-of-truth rules

Before editing code:

1. Read root `AGENTS.md`, this prompt, `specification/README.md`, and every design/localization/navigation/accessibility/testing authority listed above.
2. Inspect the current `feature` branch, HEAD, worktree, recent history, package scripts, CI workflows, and open PR context. Preserve unrelated work.
3. Inspect all app routes and page layouts, including localized route segments, shared shell, desktop sidebar, mobile drawer, homepage sections, artwork detail/viewer routes, gallery index and collection detail, About, Journal archive and Journal detail/event routes, and any existing Contact route or section.
4. Trace the actual navigation context for artwork and Journal detail pages. Determine whether the site already preserves origin/context in route state, query parameters, parent relationships, or canonical content records. Do not invent route semantics or rely on fragile browser history as the only way back.
5. Inspect installed shadcn/ui primitives and wrappers, especially Breadcrumb, Sidebar, Select, Pagination, and Link. Check `components.json`, `src/components/ui/`, package versions, and existing usage before adding anything.
6. Inspect current spacing tokens, typography tokens, global content wrappers, section components, page-specific overrides, and responsive breakpoints. Measure rendered geometry at real viewports before changing values.
7. Inspect translation dictionaries and locale routing for English (LTR) and Persian (RTL). Reuse existing localization conventions and translation keys.
8. Inspect Journal pagination implementation and URL state. Preserve existing page-size choices and default unless the canonical Journal specification says otherwise.
9. Inspect current Contact models/routes/content and existing external-link safety conventions.
10. Record findings as implemented, partially implemented, missing, conflicting, blocked by owner input, or unverified.

Do not blindly apply a global CSS override. Identify root causes and correct shared layout primitives/tokens first, then page-specific exceptions only where justified. If existing implementation conflicts with this prompt or a higher-level authority, reconcile and document the decision before coding.

## 3. Shared breadcrumb system

### 3.1 Component and visual language

- Use the installed shadcn/ui Breadcrumb composition as the common implementation foundation. Do not build a bespoke parallel breadcrumb primitive if the installed shadcn component can be reused.
- Create or extend one thin shared localized breadcrumb wrapper so all pages use the same semantic markup, spacing, separators, focus treatment, and responsive behavior.
- Follow Nasoodi's editorial visual identity: understated typography, restrained separators, no heavy container, no card background, no pill/badge styling, no decorative border, and no oversized back button.
- Breadcrumbs are navigation, not a replacement for the page's H1 or global sidebar.
- Place them consistently near the beginning of the page's main content, aligned with the page content edge and below the global navigation/header region. Avoid introducing a large reserved vertical gap above them.
- Use semantic `nav` with an accessible localized label and an ordered breadcrumb list. Mark the current page with `aria-current="page"`; it is not an active link.
- Use the project's existing icon set and shadcn separator conventions. Do not use text glyphs that render incorrectly across scripts.
- Keep the component compact and visually secondary to the page title.

### 3.2 Path semantics and clickable ancestors

- Every ancestor segment that represents a real navigable destination must be clickable, not just the Home segment.
- The current page segment is plain text with current-page semantics.
- Do not render a segment as a link if no valid destination exists.
- Each intermediate segment must navigate directly to its corresponding route. Do not make the entire breadcrumb one click target.
- Use canonical localized routes; preserve locale when navigating between levels.
- Ensure browser back/forward continues to work naturally, but do not depend on browser history for the breadcrumb path.
- Breadcrumb labels must use localized, human-readable names—not raw slugs, IDs, or internal route keys.
- Avoid duplicate breadcrumb levels and avoid repeating the global sidebar navigation as a breadcrumb.

### 3.3 Required route coverage and hierarchy

Audit every public page and apply the shared component wherever a meaningful hierarchy exists. At minimum, define and test these route families:

- Home: no breadcrumb is required if it would only show “Home” on the Home page.
- Selected artwork detail: Home → Selected Works → Artwork title.
- Artwork opened from a collection: Home → Galleries → Collection title → Artwork title, where that is the actual navigation context and all ancestors are real destinations. If a canonical artwork page has no collection context, use the Selected Works hierarchy as the stable fallback.
- Collection detail: Home → Galleries → Collection title.
- Galleries index: Home → Galleries.
- About: Home → About.
- Journal archive: Home → Journal.
- Journal article/event detail: Home → Journal → Entry title.
- Contact: Home → Contact.
- Any other nested public route: use its real information architecture, not a guessed hierarchy.

For artwork detail specifically, users must have a visible path back to Selected Works or the originating collection. For Journal detail and archive, users must have a visible path back to Journal. Do not add a one-off back arrow as a substitute for the shared breadcrumb system.

### 3.4 Context, direct entry, and route resilience

- Breadcrumbs must work when a page is loaded directly, refreshed, opened in a new tab, or reached through internal navigation.
- If the same artwork can be reached from multiple parents, use a deterministic canonical parent or a safely encoded, validated navigation context that survives refresh and does not create open-redirect or malformed-route risks.
- Context-aware breadcrumbs must never create a false parent or link to a route that does not contain the current item.
- Keep canonical URLs, metadata, and SEO route behavior independent of transient visual navigation context.
- If a context parameter is invalid, fall back to the canonical hierarchy.
- Do not rely solely on client-side in-memory state.

### 3.5 RTL and responsive behavior

- Persian breadcrumb order must follow the natural RTL reading sequence: Home appears at the right/start of the path and the current page at the left/end, with separators and chevrons oriented consistently with the direction.
- English remains LTR.
- Use CSS logical properties and direction-aware icon/separator handling; do not solve RTL by applying a blanket `scaleX(-1)` to the entire breadcrumb.
- Verify keyboard traversal follows the visual and DOM reading order.
- On narrow screens, preserve useful ancestor navigation. Prefer a deliberate compact treatment (wrapping or a carefully designed overflow/ellipsis strategy) over clipping or horizontal page overflow. If collapsing ancestors, ensure hidden ancestors remain reachable through an accessible control/menu; never silently remove required clickable path levels.
- Long Persian and English artwork/event titles must wrap or truncate safely without displacing the page title or causing horizontal scroll.

## 4. Site-wide vertical rhythm and section spacing

### 4.1 Audit before adjustment

- Review the homepage and every route at desktop, tablet, and mobile widths.
- Identify excessive top padding, repeated margins, oversized gaps between consecutive sections, duplicated spacing from nested wrappers, and page-specific overrides that conflict with the global rhythm.
- Distinguish intentional breathing room around hero artwork, major editorial transitions, and page starts from accidental or redundant whitespace.
- Use screenshots and measured bounding boxes to compare the current layout and proposed layout; do not rely on subjective CSS guessing.

### 4.2 Shared spacing system

- Establish or refine a small semantic spacing scale using existing project tokens where possible (for example: compact, standard, spacious, and major editorial break). Do not add arbitrary per-page pixel values without justification.
- Use consistent relationships between: breadcrumb and page heading; page heading and introduction; introduction and first content block; consecutive homepage sections; content groups; and page content and footer.
- Reduce excessive top whitespace across pages, especially where a page title or first content block begins far below the shared shell.
- Ensure the homepage sections flow as one intentional editorial composition. Avoid large repeated vertical gaps between Hero, Selected Works, Galleries, Journal, Contact, and footer.
- Keep major section transitions distinguishable. Do not collapse all spacing into a dense list or remove the calm gallery atmosphere.
- Use responsive spacing tokens so mobile is appropriately tighter while artwork and text remain comfortable.
- Remove duplicate margins/padding at component boundaries instead of compensating with negative margins.
- Preserve artwork image proportions, crop rules, carousel behavior, and existing approved image presentation.

### 4.3 Design quality principles

Apply the repository's design-engineering contract and the interaction/visual craft principles documented there (including the project's Emily/Impeccable-inspired editorial quality guidance): intentional hierarchy, restrained spacing, clear alignment, readable typography, consistent component states, responsive content flow, and evidence-based visual iteration. Do not imitate another website or add ornamental elements merely to make the page look “designed.”

## 5. Journal archive controls on mobile

- Keep the existing page-size choices and pagination semantics. Do not remove functionality to force a one-line layout.
- On mobile, render the items-per-page label/select and pagination controls in one compact horizontal control row wherever the minimum accessible widths allow.
- Use a responsive flex/grid composition with controlled gaps and min-width behavior. Allow the select to shrink to a usable width; keep pagination buttons compact and consistent.
- Avoid wrapping the pagination to a second line at common phone widths (including 320, 360, 375, 390, and 430 CSS px) when it can be achieved without clipping or inaccessible targets.
- Keep all controls visible, readable, keyboard accessible, and operable with touch. Do not use tiny text, microscopic hit targets, overlapping controls, or horizontal page scrolling.
- At extremely narrow widths or large text settings, use a graceful accessible fallback (for example, compact previous/next controls with a visible page indicator, or a controlled wrap) rather than hiding controls or forcing overflow. Document the exact breakpoint and behavior.
- Keep Persian order and alignment natural for RTL; do not reverse DOM order in a way that breaks keyboard navigation.
- Preserve URL-backed page/pageSize behavior, selected page size, browser navigation, and existing 5/10/20 options if these are the current contract.
- Use the shared shadcn Select and Pagination components where already installed. Keep the visual result minimal and consistent with the archive's editorial design.

## 6. Sidebar copyright on one line

- Inspect the desktop sidebar's actual usable width, padding, font metrics, and locale strings.
- Reflow the copyright notice into a single line in English and Persian at supported desktop sidebar widths.
- Reclaim vertical space by removing unnecessary line breaks, block margins, or redundant wrapper spacing.
- Use a modest, legible type size and appropriate letter spacing; do not solve the issue by making the text tiny, clipping it, hiding part of the copyright, or using ellipsis.
- Ensure the line fits without colliding with theme/language controls or the sidebar edge.
- Use direction-aware alignment and punctuation in Persian.
- At widths where the desktop sidebar itself is no longer used, preserve the existing mobile navigation contract; do not force the copyright into the mobile drawer if the current design places it elsewhere.
- Add responsive assertions for the supported sidebar widths and both locales.

## 7. Consistent justified editorial text

### 7.1 Scope

Audit text-bearing components across all public pages, including About biography and artist statement, Journal article/event body, collection descriptions, artwork descriptions, homepage introductions, Contact introduction, and other long-form editorial content. Do not indiscriminately justify short labels, navigation, buttons, metadata, dates, form labels, headings, or compact UI copy.

### 7.2 Alignment and available width

- Apply a consistent justified text treatment to long-form/editorial paragraphs so lines use the available content width rather than ending early because of unnecessary narrow wrappers or inconsistent max-width rules.
- Remove accidental width constraints that cause premature wrapping on desktop. Use the actual remaining main-content width after accounting for the sidebar and page gutters.
- Maintain a readable line length: use the available viewport/content width responsibly, but do not create excessively long lines on ultrawide displays. If a shared editorial measure is needed, make it responsive and consistent across pages rather than inventing a different arbitrary width on each route.
- Use `text-align: justify` for supported long-form blocks, with appropriate text alignment behavior for the final line. Prefer `text-align-last: start` or normal last-line behavior so the final line does not stretch awkwardly.
- Use `hyphens: auto` only where language dictionaries and browser behavior are appropriate (especially English); do not introduce unnatural breaks in Persian.
- Set correct `lang` and `dir` on localized content containers. Persian must retain correct shaping, punctuation, and word order.
- Avoid large rivers of whitespace between words. On narrow mobile screens, test whether justified alignment remains comfortable; if it becomes visibly uneven, use a documented responsive start-aligned treatment for narrow widths while preserving the same typography, width, and paragraph spacing.
- Preserve paragraph breaks, headings, inline links, lists, emphasis, and semantic structure.
- Do not use manual spaces or nonbreaking spaces to simulate justification.
- Do not apply justification to artwork captions or metadata if it damages scanability.

### 7.3 Acceptance

A reader should see a consistent content edge and line measure across comparable pages. On desktop, paragraphs should not wrap early because of an accidental narrow container. On mobile, text must remain readable without horizontal scrolling, extreme word spacing, or broken Persian shaping.

## 8. Contact experience: homepage and dedicated page

### 8.1 Information architecture

- Add a Contact section near the bottom of the homepage, after the existing editorial/gallery content and before the global footer.
- Add Contact as a first-class item in the existing desktop sidebar and mobile drawer, using the current navigation architecture and active-route behavior.
- Add localized Contact routes following the repository's established route convention (for example, `/en/contact` and `/fa/contact` if that is the current convention). Reuse an existing Contact route if present; do not create duplicates.
- The homepage Contact section should be a concise invitation and a restrained summary of the contact methods, with a clear link to the full Contact page.
- The Contact page should provide the complete contact presentation and the same canonical contact data source as the homepage. Do not duplicate hardcoded contact details in multiple components.

### 8.2 Content and visual design

- Design the section and page as an artist's professional contact point, not a sales funnel.
- Use a calm editorial hierarchy: localized heading, short welcoming introduction, and clearly named contact methods for Telegram, email, and Instagram.
- Present each method with a clear text label and human-readable destination/handle. Icons may support recognition but must not replace labels.
- Use semantic external links with safe `target`/`rel` handling where applicable; email uses `mailto:`, Telegram and Instagram use verified canonical URL formats.
- Do not add a contact form, newsletter signup, map, phone number, address, booking system, or extra social platforms unless the owner explicitly requests them.
- Avoid fake testimonials, availability promises, response-time guarantees, commercial claims, or claims that the artist accepts commissions unless approved.
- Provide useful hover, focus, active, and visited states consistent with the design system.
- Maintain readable contrast and touch target sizes.
- Contact methods should stack or form a restrained responsive row/grid according to available width, without card-heavy dashboard styling.

### 8.3 Fictional contact details — intentionally visible

The owner explicitly instructs that fictional contact details must be implemented, committed, and rendered in the normal production build/output for now. They will replace these values with the artist's real contact details later.

Use these centralized values as the current site contact data:
- Email: `studio@example.com`.
- Telegram display: `@nasoodi_contact_demo`.
- Instagram display: `@ghazaleh.nasoodi.demo`.

Rules:
- Render these values normally on both the homepage Contact section and the dedicated Contact page, in English and Persian. They are not hidden, omitted, disabled, or replaced in production builds.
- Do not introduce environment variables, production flags, feature flags, approval toggles, conditional build logic, or a runtime switch to suppress these values.
- Do not add a visible “fictional”, “demo”, or “sample” disclaimer to the public Contact UI unless the owner later requests it. The owner understands these are temporary fictional values.
- Keep the values in one centralized typed content source so the owner can replace them later in one place.
- Use predictable link formats: `mailto:studio@example.com`; Telegram URL `https://t.me/nasoodi_contact_demo`; Instagram URL `https://www.instagram.com/ghazaleh.nasoodi.demo/`. The social profiles may not exist yet; do not claim that they are verified or monitored.
- Do not change the existing artist Instagram handle `@ghazalenasoodi` in its existing approved context.
- Do not invent a physical address, phone number, response-time promise, availability, commission policy, or other contact method.
- Keep the contact data straightforward to replace later; no special migration or content approval mechanism is needed for these temporary values.

### 8.4 Localization

- Provide complete English and Persian content with equivalent meaning and professional tone.
- Persian Contact page and section must be RTL, including icon placement, contact labels, link direction, punctuation, and spacing.
- Email addresses and social handles remain LTR within Persian content using isolated direction-aware inline elements so they do not reorder surrounding Persian text.
- Use translation dictionaries and canonical content data; do not scatter inline locale ternaries throughout components.
- Verify screen-reader pronunciation and accessible link names in both locales.

## 9. Shared component and implementation architecture

- Reuse existing shadcn/ui primitives and project wrappers. Inspect before adding components.
- Prefer one shared Breadcrumb component and one shared editorial text style rather than route-specific implementations.
- Use the current Sidebar/navigation component for Contact; do not fork desktop and mobile navigation data.
- Keep the Contact details in one typed canonical data source/fixture with localized descriptions and explicit approval status.
- Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`) and direction-aware layout. Avoid LTR-only left/right assumptions.
- Preserve current theme tokens, typography, artwork image treatment, carousel behavior, Journal data model, and approved route structure.
- Avoid new dependencies unless inspection demonstrates a real gap.
- Keep components composable, typed, and testable. Avoid broad selectors that accidentally affect buttons, controls, metadata, or artwork captions.

## 10. Accessibility, SEO, privacy, and performance

- Meet the repository's WCAG 2.2 AA target.
- Breadcrumb links and all contact links must have meaningful accessible names, visible keyboard focus, correct semantics, and adequate target sizes.
- Breadcrumb current-page state must be programmatically exposed.
- Maintain logical DOM/keyboard order in both LTR and RTL.
- Respect reduced motion; do not add motion solely for decoration.
- Avoid horizontal overflow at all tested widths and zoom settings.
- Keep fictional contact data out of public metadata, JSON-LD, sitemap, and production-visible pages.
- Preserve canonical URLs, localized alternates, and metadata for existing routes.
- Contact page metadata must not claim unverified contact facts or artist services.
- Do not introduce analytics, tracking pixels, or third-party form services.
- External links must use safe URL validation and appropriate rel attributes.

## 11. Required tests

Use the repository's existing test architecture and add meaningful regression coverage.

### Breadcrumb unit/component tests
- Shared component renders correct hierarchy and localized labels.
- All valid ancestor segments are links; current page is not a link.
- Correct `aria-current`, navigation label, ordered list semantics, and focus behavior.
- Selected artwork has a path back to Selected Works.
- Artwork opened from a collection has a valid collection ancestor when context is valid.
- Invalid/missing context falls back to the canonical path.
- Journal archive and detail have a path back to Journal.
- Direct route load and refresh preserve valid breadcrumb hierarchy.
- No duplicate or broken route segments.

### RTL/LTR and responsive tests
- English is LTR and Persian is RTL.
- Breadcrumb order, separators, alignment, wrapping/collapse, and keyboard order are correct.
- Long titles do not create horizontal page overflow.
- Test desktop, tablet, and 320/360/375/390/430 CSS px mobile widths.

### Spacing and typography tests
- Add visual regression/screenshot coverage for homepage and representative routes.
- Assert section spacing tokens are used consistently where practical.
- Verify no duplicate margins or unexpected large blank areas.
- Verify long-form paragraphs use the shared editorial treatment and available width.
- Confirm headings, labels, metadata, captions, and controls are not unintentionally justified.
- Verify Persian shaping and English hyphenation behavior.

### Journal controls tests
- Page-size selector and pagination remain on one line at common mobile widths.
- Controls remain operable and readable at 320px and at increased text zoom.
- URL page/pageSize state and browser back/forward remain correct.
- RTL order and keyboard sequence remain coherent.

### Sidebar tests
- Copyright remains one line at supported desktop sidebar widths in English and Persian.
- It is not clipped, truncated, or colliding with neighboring controls.
- Existing mobile navigation behavior is unchanged.

### Contact tests
- Contact appears in desktop sidebar and mobile drawer.
- Homepage Contact section and Contact page use the same canonical data source.
- Both localized routes render with correct direction and translation parity.
- Email link is correctly formed; social destinations are validated or non-operational sample text.
- Contact values render in production and remain easy for the owner to replace.
- Existing real artist Instagram handle remains unchanged in its approved context.
- No unrequested form, phone, address, or commercial claim is introduced.

### Regression tests
Protect homepage hero, Selected Works, Galleries index and detail, artwork viewer, About, Journal archive and detail, announcement sticker, sidebar/mobile drawer, pagination, image fidelity, and existing locale switching.

## 12. Visual QA matrix

Capture and actually inspect screenshots for the following combinations:

- English desktop wide and standard desktop.
- Persian desktop wide and standard desktop.
- English and Persian tablet.
- English and Persian mobile at 320, 360, 375, 390, and 430 CSS px.
- Homepage full-page composition with all sections including Contact.
- Selected artwork detail reached from Selected Works.
- Artwork detail reached from a collection.
- Journal archive and Journal detail.
- About and Contact pages.
- Journal pagination at first, middle, and last pages.
- Desktop sidebar copyright.
- Breadcrumb long-title and collapsed/overflow states.

Inspect spacing, alignment, content width, type, wrapping, visual hierarchy, focus, touch target geometry, RTL ordering, and horizontal overflow. Do not claim visual verification unless the screenshots were opened and inspected. Iterate after inspection.

## 13. CI and completion gates

- Inspect package scripts and CI workflow definitions; run the actual required lint, typecheck, unit/component, E2E, accessibility/localization, and production build checks.
- Trigger GitHub Actions only where available and authorized. Inspect the completed run, exact tested commit SHA, conclusion, and relevant logs.
- A queued or in-progress CI run is not a pass.
- Do not merge to `stage` or `main`, deploy, publish, change DNS, alter Vercel settings, or change secrets.
- Preserve unrelated user work. Do not reset, force-push, or rewrite branch history.
- Do not commit or push unless separately authorized for that specific action. Keep the work on the existing `feature` branch.

## 14. Deliverables

1. One reusable shadcn-based breadcrumb implementation applied consistently to all applicable pages.
2. Verified clickable ancestor paths for artwork, collection, Journal, About, and Contact routes.
3. A refined site-wide spacing rhythm with documented shared tokens and justified exceptions.
4. A compact one-line Journal control row on common mobile widths, with accessible narrow-width fallback.
5. One-line desktop sidebar copyright in both locales.
6. A shared long-form justified text treatment with responsive readability safeguards.
7. Homepage Contact section and dedicated bilingual Contact page/sidebar destination.
8. Centralized temporary fictional contact values, intentionally rendered in production until the owner replaces them.
9. Automated tests and inspected visual QA evidence.
10. Updated specification index and task-specific `agent.md`.

## 15. Final report requirements

Report:
- Branch and exact final HEAD SHA.
- Audit findings and route coverage.
- Files changed and architecture decisions.
- Breadcrumb route examples tested, including direct entry and contextual artwork paths.
- Spacing/typography changes and responsive behavior.
- Journal control widths tested and any narrow-width fallback.
- Sidebar copyright results in both locales.
- Contact fixture values and explicit publication approval still required.
- Test commands and exact results.
- CI run URL, conclusion, and tested SHA.
- Visual QA viewports/locales and artifact references.
- Any unresolved blockers.
- Explicit confirmation that no unauthorized merge, deployment, or publication occurred.
