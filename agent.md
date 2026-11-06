# CURRENT IMPLEMENTATION TASK — Unified JSON Content, Internationalization, and SEO

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Task:** Complete the owner-provided unified JSON content, About/CV, next-intl, route architecture, and international SEO implementation prompt.  
**Audit:** `specification/internationalization-content-seo-completion-audit.md`

## Explicit owner authorization — feature branch only

The owner has authorized the AI agent to make code and documentation changes, create commits, push updates, and run GitHub Actions on the existing `feature` branch. This authorization is active; do not pause for another commit/push confirmation. Work only on `feature`, preserve unrelated work, and use normal non-destructive commits. Do not create or switch branches, force-push, rewrite history, merge into `stage` or `main`, deploy, publish, or change external services. Those actions are outside this authorization and require separate explicit approval.

## Current architecture decisions — 2026-11-05

- Editorial content is canonical localized JSON. UI translations remain in `src/i18n/messages/{en,fa}/`.
- Journal article bodies are structured localized rich-text arrays inside `src/content/data/journal/index.json`; Markdown body files and the generation pipeline are obsolete and must not be reintroduced.
- The artist identity, biography, statement, and profile copy live in `src/content/data/artist-profile.json`. Homepage and About consume the same artist repository.
- CV entries and the optional PDF reference live in one `src/content/data/cv.json` record. CV entries do not use a separate `verified` flag. Do not invent education, awards, exhibitions, qualifications, or dates.
- Contact title, description, and owner-supplied contact destinations live in `src/content/data/contact.json`. Never add invented email addresses or social handles.
- `src/content/data/site.json` owns localized archive metadata for Works, Galleries, Journal, and CV.
- Preserve artwork IDs, original asset paths, gallery membership/order, existing routes, design tokens, responsive behavior, and RTL/LTR behavior.
- No separate preview/sample/fictional/verified content providers, production suppression, or fixture fallback. All environments use the same canonical JSON records.
- Keep content resolution in repositories/adapters, validation in domain utilities, and presentation in route/component layers. Components must not import editorial JSON directly.
- The latest task-specific completion audit is the source for remaining gaps and risk; update it with verified findings as work progresses.

## Implementation checkpoint

The current implementation increment is on `feature`: all eight Journal bodies are localized JSON rich-text; About uses the same artist repository as homepage and CV uses one CV repository; homepage and artwork/gallery/Journal detail routes resolve through focused repositories; sitemap, section metadata, and global Person structured data use those repositories; localized slugs are required and missing locale slugs no longer fall back; Journal cover alt text reuses canonical artwork alt text; the AST i18n audit scans app/components/lib and distinguishes semantic ARIA role descriptors from UI copy; Galleries and Journal pagination are under Suspense for Next.js 16 static rendering. See the current completion audit for exact SHA, CI evidence, remaining validation gaps, and owner-content approvals.

This checkpoint is **not a completion claim**. Run and inspect GitHub Actions against the final tested SHA, fix any failures, complete the remaining route/i18n/SEO/documentation work, and report exact evidence. Do not merge, deploy, or publish.

---

# NEXT IMPLEMENTATION TASK — SITE-WIDE BREADCRUMBS, EDITORIAL SPACING, AND CONTACT EXPERIENCE

**Priority:** Next implementation task on the existing feature branch.  
**Repository:** `mrcode-tech/nasoodi.art`  
**Branch:** `feature` only  
**Complete implementation prompt:** `specification/site-wide-navigation-spacing-and-contact-implementation-prompt.md`

**Implementation checkpoint — 2026-11-05:** The current cross-site refinement is implemented on `feature`. Shared breadcrumb current-page semantics, the homepage-to-Contact destination, semantic spacing tokens, scoped editorial justification, compact narrow-screen Journal controls, and bilingual desktop/mobile Contact navigation are covered by regression tests. GitHub Actions [run #889](https://github.com/mrcode-tech/nasoodi.art/actions/runs/41993382170) passed against commit `01c00996c60313088e06478df4cca7aea47d3569`: lint, i18n audit, TypeScript, content tests, production build, asset audit, SVG validation, 135 Playwright tests, and production smoke test. Rendered English/Persian homepage, Contact, and Journal archive screenshots were inspected from the CI artifact. See the task-specific specification for detailed evidence and remaining owner/publication gates.

## Global typography guardrail — 2026-11-03

All future UI work must follow specification/shared-responsive-typography-system.md and the shared design authorities. Reuse its semantic fluid type tokens across routes; respect Persian and English font metrics and RTL/LTR behavior; preserve natural heading wrapping; and do not add isolated oversized heading values or global no-wrap rules. The Persian homepage artist name and homepage Contact heading are single-line targets only at the reference widths defined by the specification. Update the shared specification before changing the typography system.

## Technical specification and content-independent test policy

All files under specification/ are technical documentation. Do not include actual personal identity, biography, family details, contact destinations, CV entries, artwork or collection titles, Journal copy, production record IDs, production slugs, image filenames, or current editorial record counts. Use generic placeholders and synthetic examples. Canonical editorial content belongs only in the content data layer.

Automated tests validate stable technical behavior, not the current production dataset. Use deterministic fixture factories based on production domain types for unit, integration, and browser tests. Production-backed browser smoke tests may assert route availability and structural behavior, but must not hardcode editorial names, titles, dates, slugs, IDs, image paths, or record counts. Test exact pagination slices with generated datasets at unit level; browser tests verify URL state and distinct slices without requiring a particular production dataset size.

Keep content integrity tests separate from application behavior tests. Integrity tests validate schema, types, stable ID uniqueness, references, safe asset paths, publication mechanics, and optional-field handling. They must not judge editorial truth, quality, completeness, or approval. Never remove meaningful coverage, skip failing tests, or weaken assertions just to make CI green.

Before changing specs or tests, audit the complete specification/ tree and test suite. Replace content examples with placeholders, remove obsolete/conflicting requirements, and preserve all active technical contracts. Maintain a CI audit that detects production editorial values and brittle fixed content counts in technical documentation and tests.

## AI-assisted engineering and refactoring requirements

Before any non-trivial React, Next.js, TypeScript, i18n, content-architecture, or refactoring work, read `specification/ai-assisted-development-and-code-quality.md` in full.

Use the selected skills according to that contract:
- Vercel React Best Practices for React/Next.js implementation, review, and refactoring.
- Frontend Convention Skills (`react-architecture`) when component boundaries, folder organization, or separation of concerns are in scope.
- Patterns and Refactoring for non-trivial, test-backed, behavior-preserving restructuring.
- i18n for Next.js as an advisory checklist for translation and multilingual SEO work.

Invoke the relevant skill if it is installed and available to the active coding agent. Otherwise read its linked `SKILL.md` and apply relevant guidance manually. Never claim a skill was installed or invoked without verifying it. Do not install, update, or execute third-party skills automatically. Official documentation matching the installed Next.js version, this repository's actual `/en` and `/fa` route contract, root `AGENTS.md`, and approved specifications take precedence over third-party examples. In particular, do not copy the i18n skill's default-locale URL or middleware conventions without a compatibility decision.

Refactoring must be incremental and behavior-preserving: establish existing behavior, protect it with tests, make one coherent structural change at a time, and verify focused tests plus the broader relevant checks. Prefer simple code over speculative abstractions. Do not combine unrelated feature work, dependency upgrades, or formatting churn with a refactor.

Implement the cross-site refinement as one coherent experience:

1. A shared shadcn/ui Breadcrumb across all applicable pages, with clickable intermediate ancestors, correct artwork/collection/Journal paths, and robust Persian RTL behavior.
2. A measured, consistent editorial spacing rhythm across the homepage and all pages.
3. Minimal one-line Journal page-size and pagination controls on common mobile widths.
4. One-line desktop sidebar copyright in English and Persian.
5. Consistent justified long-form editorial text that uses the available content width without harming mobile readability or Persian shaping.
6. A homepage Contact section and dedicated bilingual Contact page, using only the canonical owner-supplied Contact JSON. Generate localized metadata and sitemap eligibility from that same record.

Before coding, read in full:
- `AGENTS.md`
- `specification/README.md`
- `specification/site-wide-navigation-spacing-and-contact-implementation-prompt.md`
- `specification/design-engineering-skills.md`
- `specification/design-direction-and-system-refinement.md`
- `specification/site-wide-design-system-and-section-specification.md`
- `specification/navigation-and-mobile-sidebar.md`
- `specification/shadcn-component-reuse-and-bilingual-ui.md`
- `specification/localization-and-editorial-governance.md`
- `specification/accessibility-performance-security.md`
- `specification/testing-qa-and-release.md`
- Relevant route, content-model, Journal, artwork-detail, and page-specific specifications discovered during the audit.

Inspect the current implementation and route hierarchy before editing. Do not assume a breadcrumb parent based only on browser history. Test direct entry, refresh, contextual artwork navigation, and fallback paths. Reuse the installed shadcn primitives and shared navigation architecture. Apply spacing changes through shared tokens/layout primitives before page-specific overrides. Preserve the quiet editorial gallery identity and all approved artwork/content.

**Contact content rule — 2026-11-05:** the canonical Contact JSON contains only owner-supplied public destinations and localized Contact metadata. Do not add invented email addresses, Telegram handles, or social profiles. The current configured destination is the artist's supplied Instagram identity @ghazalenasoodi. Contact indexability and sitemap eligibility follow the canonical localized title/description and valid owner-supplied destination.

Run the complete relevant test suite and CI, inspect actual logs and final tested SHA, and capture/inspect English and Persian desktop/tablet/mobile screenshots. Verify breadcrumb clickability, RTL reading and keyboard order, no overflow, spacing, text measure, Journal controls, copyright fit, and Contact navigation/content.

Work only on the existing `feature` branch. The owner has authorized commits and pushes to this branch; no further confirmation is required. Preserve unrelated work. Do not merge to `stage` or `main`, deploy, publish, change external services, or push any other branch.

---

## Previous task prompt — Journal and event announcement sticker

The previous Journal/sticker task prompt and implementation history are retained below for traceability. It is not the next task unless the owner explicitly reopens it.

# NEXT IMPLEMENTATION TASK — JOURNAL AND EVENT ANNOUNCEMENT STICKER

**Priority:** Next feature implementation; this Journal/sticker task supersedes the previous About/CV task prompt below.  
**Repository:** `mrcode-tech/nasoodi.art`  
**Branch:** `feature` only  
**Primary specification:** `specification/journal-announcement-specification.md`  
**Complete implementation prompt:** `specification/journal-announcement-implementation-prompt.md`  
**Supporting documents:** proposal, wireframes, and task instructions listed below.

The next implementation task is the approved Journal and event-announcement experience. Implement both connected parts as one coherent feature:

1. **Journal experience:** homepage Journal preview, existing unified Journal archive, event-specific detail presentation, and accessible pagination/page-size behavior where the existing archive requires it.
2. **Event announcement sticker:** use the hand-authored restrained paper-sticker SVG (decorative only) and generate a transparent PNG review artifact through GitHub Actions and implement the fixed, dismissible, locale-aware announcement that links to the nearest eligible upcoming Journal event.

Before coding, read in full:
- `specification/README.md`
- `specification/journal-announcement-proposal.md`
- `specification/journal-announcement-wireframes.md`
- `specification/journal-announcement-specification.md`
- `specification/journal-announcement-agent-instructions.md`
- `specification/journal-announcement-sticker-visual-design.md`
- `specification/journal-and-events.md`
- `specification/artwork-discovery-carousel-and-editorial-experience.md`
- All mandatory design, content, localization, navigation, SEO, accessibility, testing, and roadmap authorities referenced by `AGENTS.md` and the primary specification.

**Important reconciled homepage rule:** the in-flow homepage Journal preview is limited to the single newest eligible published entry across article and event types. Do not add a third card or pin an older upcoming event into this preview. The fixed sticker independently selects the nearest eligible upcoming event. Dismissing the sticker must not hide the Journal preview.

**Sticker asset rule:** the checked-in SVG is the editable source of truth and contains only a decorative paper silhouette/edge treatment with transparent background. Do not bake event text, dates, labels, arrows, or controls into the image. Keep all copy and interactions as accessible localized DOM content. Do not use image generation, screenshot tracing, raster painting, or image processing. GitHub Actions must convert the SVG to PNG and verify RGBA transparency, dimensions, and absence of baked text/raster imagery. Do not commit generated PNG until owner review; SVG/CSS may be used directly at runtime. Do not invent an event or imply fictional sample content is real.

The proposal is approved in principle and implementation may proceed. The initial hand-authored torn-edge SVG study is a candidate, not final approval. Review the CI-generated PNG and responsive screenshots with the owner; refine the vector paths directly if requested. Build the functional experience and prepare visual comparisons. The CI-generated PNG is a review artifact, not a final approved asset; do not commit it or declare the visual variant final until the owner selects it. Inspect the real shell, locale-aware sidebar/menu geometry, Journal data model, routes, existing pagination, assets, and CI before coding.

Use `specification/journal-announcement-implementation-prompt.md` as the complete task brief and `specification/journal-announcement-agent-instructions.md` as the concise execution checklist. Preserve all repository safety rules in `AGENTS.md`: work on the existing feature branch, preserve unrelated changes, commit and push to `feature` after verification, do not merge to stage/main, and do not deploy or publish. Run the repository's actual tests and CI, inspect logs, and capture reviewed English/Persian desktop/tablet/mobile screenshots before reporting completion.

---

## Previous task prompt — Artist About experience, CV, and mobile Hero

The following task instructions and implementation history are retained for traceability. They describe the previous About/CV task and are not the next feature scope unless the owner explicitly reopens that work.

# Agent Task: Implement the Artist About Experience, CV, and Mobile Hero Specification

**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature` only  
**Primary specification:** `specification/artist-about-page-and-mobile-hero.md`  
**Execution mode:** Inspect → reconcile → implement → test → visually verify → report  
**Task type:** Full implementation of the approved specification, subject to artist/site-owner content and asset approval gates

---

## 1. Role and expected outcome

Act as a senior product engineer, design engineer, frontend architect, accessibility specialist, localization engineer, and QA lead.

Implement the complete artist About experience and mobile hero refinement defined in the primary specification. The result must be production-quality, bilingual, responsive, accessible, maintainable, and consistent with Nasoodi.art's editorial gallery identity.

Deliver:

1. An artist-approved biography preview directly below the artist's name in the homepage hero.
2. A working in-place Read more / Show less interaction for long biographies.
3. An About destination in the existing global sidebar and mobile drawer.
4. A localized About page with the approved artist image when available, complete approved biography, and a CV section at the end.
5. A working downloadable PDF link only when the actual artist-approved CV file is available.
6. Correct mobile hero order: image → artist name → About/biography → expansion control → existing action 1 → existing action 2.
7. Automated tests, CI evidence, and inspected visual QA artifacts for all relevant states and breakpoints.

Do not treat the task as complete merely because the page compiles or a route exists.

## 2. Mandatory instructions to read

Before editing anything, read in full:

1. Root `AGENTS.md`.
2. `specification/README.md`.
3. `specification/artist-about-page-and-mobile-hero.md`.
4. `specification/design-engineering-skills.md`.
5. `specification/design-direction-and-system-refinement.md`.
6. `specification/proposal.md`.
7. `specification/visual-identity-and-photo-direction.md`.
8. `specification/site-wide-design-system-and-section-specification.md`.
9. `specification/homepage-artwork-hero-and-featured-works.md`.
10. `specification/navigation-and-mobile-sidebar.md`.
11. `specification/content-model.md`.
12. `specification/localization-and-editorial-governance.md`.
13. `specification/artwork-imaging-and-asset-pipeline.md`.
14. `specification/accessibility-performance-security.md`.
15. `specification/seo-and-discovery.md`.
16. `specification/testing-qa-and-release.md`.
17. `specification/phased-implementation-blueprint.md`.
18. `specification/shadcn-component-reuse-and-bilingual-ui.md`.

Also inspect any existing About, artist-profile, CV, hero, sidebar, locale, and content-specific specification or implementation discovered in the repository. Read the relevant source files in full before modifying them.

**Authority:** `AGENTS.md` remains the repository-wide instruction source. This `agent.md` is the task-specific execution prompt. If instructions conflict, follow `AGENTS.md` and the design/content authorities; stop and document any unresolved product-level conflict rather than silently weakening a requirement.

## 3. Repository safety and branch rules

- Inspect the current branch, HEAD SHA, worktree status, latest commits, package scripts, CI workflows, and relevant open PRs before editing.
- Work only on the already-existing `feature` branch.
- Do not create, switch, reset, rename, or delete branches.
- Preserve unrelated and uncommitted user work. Never overwrite unrelated changes.
- Do not merge into `stage` or `main`.
- Push only to the owner-authorized existing `feature` branch; pushes to every other branch are unauthorized.
- Do not deploy, publish, change DNS, alter Vercel settings, modify secrets, or change external services.
- The owner has explicitly requested and authorized commits and pushes to `feature`. Commit after implementation, relevant tests, build, and verification are complete; leave changes uncommitted only if the owner later revokes this authorization.
- Do not use force push or destructive Git commands.
- Do not change the branch's existing history or rewrite commits.

## 4. Inspect before implementation

Create an evidence-based implementation audit before changing code.

Inspect:

- Actual homepage route and hero component tree.
- Current hero image source, dimensions, semantics, and whether it is a finished artwork, portrait, or studio/process image.
- Current artist name, role label, existing two action labels/destinations/order, and responsive layout.
- Existing About route/page and artist-profile content source.
- Existing statement and biography fields and their approval/localization states.
- Existing CV data model, CV route/section, and any public PDF assets.
- Sidebar and mobile drawer implementation, route registry, active-page behavior, and locale routing.
- Translation dictionaries for Persian and English.
- Existing design tokens, typography, shared buttons/links, and shadcn components.
- Current unit/component/E2E tests and visual QA workflow.
- CI scripts and required checks.

Record each relevant requirement as one of: implemented, partially implemented, missing, contradictory, blocked by content/approval, or unverified. Do not infer that a file or asset exists from an earlier report or a specification example.

If the actual code conflicts with the specification, inspect the source and relevant design authorities, then resolve the conflict explicitly. Do not redesign unrelated parts of the site.

## 5. Content and asset integrity — hard gate

- Use canonical localized JSON for all editable editorial content in every environment; do not maintain separate preview/sample providers or production suppression.
- Homepage and About use the same artist profile. CV entries and an optional real PDF reference use one CV JSON record. Journal bodies are localized JSON rich-text blocks.
- Write initial descriptive editorial content as the site's normal data, but never invent factual education, exhibitions, awards, qualifications, institutions, venues, dates, or contact methods. Keep unsupported factual CV categories empty until owner-supplied information is available.
- Contact destinations must be owner-supplied and stored in the canonical Contact JSON. Do not invent email addresses or social handles.
- Do not create synthetic CV PDFs; preserve the download mechanism for an actual owner-supplied PDF.
- Never present fictional biography, education, exhibitions, awards, publications, dates, venues, or qualifications as verified or artist-approved facts.
- Do not machine-translate and publish unreviewed biography or interface copy as approved Persian/English content.
- Do not create synthetic CV PDFs; use the download mechanism only when an actual owner-supplied PDF exists.
- Verify the exact PDF file, public-download permission, readability, and metadata before exposing its link.
- Verify image identity, dimensions, rights, and intended use before adding it to About.
- Preserve all artwork/photo fidelity and existing image-treatment restrictions.
- If approved content or an asset is missing, implement the truthful pending/omitted state defined in the specification and report the exact owner input required. Do not block unrelated structural implementation unnecessarily.
- Do not make pending/unapproved profile content indexable or include it in the sitemap.

## 6. Design and behavior implementation

### 6.1 Homepage hero biography

- Use the canonical localized biography source.
- Place About and the biography immediately below the artist name (and role label if present).
- Keep the initial preview concise; use a responsive line-based clamp and safe truncation for both scripts.
- Short biography: show all text and no Read more.
- Long biography: show preview, ellipsis, and Read more.
- Read more expands the complete biography in place.
- Change the control to Show less; expose expanded state accessibly.
- Preserve paragraphs and approved formatting.
- Keep both existing hero actions after the biography/control.
- Preserve action labels, hrefs, semantics, relative order, and functionality.
- Do not introduce a separate duplicated biography or invent an excerpt.
- Do not navigate away when Read more is activated.

### 6.2 About route and sidebar

- Reuse an existing localized About route if it exists; do not create duplicate routes.
- Add About to the existing desktop/sidebar and mobile drawer navigation.
- Reuse the current navigation system and its focus, Escape, active state, locale, and drawer behavior.
- Do not create a separate CV top-level route or nav item for this task.
- Verify browser back/forward and locale route behavior.

### 6.3 About page

- Present the approved artist image near the top when available and approved.
- Render the full localized biography from the canonical source.
- Keep statement and biography distinct if both are present.
- Place the CV section after the biography and before the global footer.
- Reuse the canonical CV JSON record and display only owner-supplied factual entries; do not add a separate verification flag.
- Add the PDF download action only for a real, valid, approved public PDF.
- Use a safe local public asset path and descriptive filename.
- If the PDF is missing/unapproved/invalid, omit the link and report the blocker. Never render a broken link.

### 6.4 Mobile hero correction

The rendered and logical order must be:

1. Hero image.
2. Artist name.
3. Role label if applicable.
4. About label.
5. Biography.
6. Read more / Show less when applicable.
7. Existing action 1.
8. Existing action 2.

Use a single-column mobile flow. The two actions must never separate the image from the artist text. Preserve the desktop composition where it remains sound. Allow expanded biography to grow naturally and scroll; do not clip it in fixed-height hero containers.

## 7. Component and styling rules

- Reuse existing project components, tokens, and installed shadcn/ui primitives.
- Inspect `components.json`, `src/components/ui/`, installed Radix primitives, and existing wrappers before adding anything.
- Do not duplicate button, link, drawer, sidebar, or navigation primitives.
- Do not add dependencies unless a concrete gap is demonstrated.
- Keep the visual direction warm, editorial, quiet, image-led, and gallery-like.
- Avoid generic SaaS cards, dashboards, gradients, glassmorphism, neon, heavy shadows, decorative blobs, excessive pills, and unnecessary icons.
- Use semantic color/type/spacing tokens, not new page-specific palette values.
- Use CSS logical properties and proper RTL/LTR behavior.
- Keep the physical sidebar placement governed by `navigation-and-mobile-sidebar.md`; do not mirror images.
- Add no animation unless it serves a clear purpose. Respect `prefers-reduced-motion`.

## 8. Accessibility, SEO, and performance

- Target WCAG 2.2 AA.
- Use semantic buttons for expansion and semantic anchors for navigation/PDF.
- Expose `aria-expanded`, controlled-region association, current route state, accessible names, and visible focus.
- Keep keyboard focus stable when expanding/collapsing.
- Preserve logical heading and reading order.
- Validate contrast for all new states.
- Use localized metadata based only on approved facts.
- Follow existing canonical, locale alternate, robots, sitemap, and structured-data rules.
- Do not index pending/unapproved biography.
- Reserve image dimensions to avoid layout shift.
- Do not preload the CV PDF; it should be fetched on visitor activation.
- Do not introduce analytics or third-party requests.

## 9. Required automated tests

Use the actual repository test architecture. Add or update:

### Unit/component tests
- Short and long biography behavior.
- Correct collapsed preview and ellipsis.
- Read more reveals complete biography in place.
- Show less restores preview.
- Persian/English Unicode-safe truncation.
- Localized control labels and direction.
- Missing/unapproved biography behavior.
- CV section visibility for each content/asset state.
- No broken PDF link when missing or invalid.
- No duplicate source of biography data.

### Browser/E2E tests
- About appears in desktop sidebar and mobile drawer.
- About opens the correct localized page.
- Active route state is correct.
- Read more expands without navigation; Show less collapses.
- Existing actions retain labels, destinations, order, and behavior.
- Mobile DOM/visual order is image → name → biography → control → action 1 → action 2.
- Neither action is between image and artist text.
- About page displays approved image and full biography.
- CV appears at the end of substantive content.
- PDF download/response is correct when an approved asset exists.
- Persian RTL and English LTR have no overflow or overlap.
- Keyboard navigation and focus states work.

### Regression tests
Protect artwork identity/fidelity, hero image dimensions/treatment, Works, Selected Works, Galleries, Journal, artwork detail, existing CTAs, and mobile navigation behavior.

## 10. Visual verification

Capture and inspect actual rendered output for:

- Desktop wide.
- Desktop short-height.
- Tablet.
- Mobile portrait.
- Mobile landscape.
- English LTR.
- Persian RTL.
- Biography collapsed.
- Biography expanded.
- CV available.
- CV unavailable.

Record viewport, locale, state, artifact path, and findings. Do not claim a screenshot is visually verified unless it has actually been opened and inspected. Fix major hierarchy, spacing, typography, image, overflow, and interaction issues, then repeat inspection.

## 11. CI and quality checks

Inspect `package.json` and workflow definitions; do not assume scripts. Run all applicable checks, including the documented baseline where present:

```bash
npm run lint
npm run typecheck
npm run build
```

Also run relevant unit, component, integration, accessibility, localization, and Playwright/E2E tests. Trigger GitHub Actions only when the available permissions/workflow allow it and the user has authorized it. Inspect the completed run, exact head SHA, conclusion, and relevant logs. A queued or in-progress run is not a pass.

## 12. Documentation and evidence

- Keep `specification/artist-about-page-and-mobile-hero.md` consistent with implementation.
- Update `specification/README.md` if additional relevant documents are created.
- Update the canonical content model only if a genuine schema extension is needed; avoid duplicating artist-profile fields.
- Record any decisions that require artist/site-owner approval.
- Report exact changed files, implementation summary, test commands/results, CI run evidence, visual artifacts, content/asset blockers, and remaining work.
- Distinguish implemented, tested, visually verified, artist-approved, and published states.

## 13. Completion gate

Do not report completion until:

- All unblocked requirements in the primary specification are implemented.
- Existing hero actions and unrelated portfolio experiences are regression-tested.
- Lint, typecheck, relevant automated tests, and production build pass.
- Required CI has completed successfully and matches the final feature HEAD.
- Desktop/tablet/mobile, Persian/English, collapsed/expanded, and CV states have been visually inspected.
- Any missing biography, portrait, translation, or PDF approvals are clearly reported.
- No merge, deployment, or publication has occurred.

**Final report format:**

1. Branch and final HEAD SHA.
2. Requirement-by-requirement implementation status.
3. Files changed.
4. Tests and exact results.
5. CI workflow/run URL, conclusion, and tested SHA.
6. Visual QA viewports/locales/states and artifact references.
7. Artist/site-owner approvals obtained and still required.
8. Known issues or follow-up work.
9. Explicit confirmation that no unauthorized merge/deploy/publish occurred.



## Architecture contracts — SEO, i18n, and editable content (2026-11-04)

Before any future SEO, localization, or content-refactoring implementation, read these documents in full:

- `specification/international-seo-and-search-discovery-architecture.md`
- `specification/internationalization-and-ui-translation-architecture.md`
- `specification/content-architecture-and-data-separation.md`
- `specification/seo-and-discovery.md`
- `specification/localization-and-editorial-governance.md`
- `specification/content-model.md`
- `specification/artwork-imaging-and-asset-pipeline.md`
- `specification/accessibility-performance-security.md`
- `specification/testing-qa-and-release.md`

The owner requires three separate but coordinated concerns:
1. SEO and multilingual search discovery.
2. UI internationalization through a centralized i18n library (evaluate/adopt next-intl after compatibility audit), with no scattered Persian/English literals or conditional copy in components.
3. Editable artist/portfolio content separated from UI messages, domain types, general utilities, and application logic. Artist profile, artwork, galleries, Journal, events, CV, and contact data belong in a clear content layer; generic utilities must not be content databases.

Treat content as data, types as contracts, utilities/services as behavior, and components as presentation. Adding an artwork/gallery/Journal record should not require editing page or carousel components. Use stable content identity across locales and explicit localized slug mapping. Preserve editorial approval, asset rights, route behavior, ordering, and canonical Contact JSON metadata/sitemap eligibility.

The proposed file-based content layout is a starting point only. First inspect the actual repository, including current util.ts/utils.ts and JSX data, classify each value, and map existing behavior. Use JSON for all editable editorial content, including long-form biography, artist statement, Journal bodies, and event descriptions. Markdown is not an editorial source format for this project. Keep TypeScript for types, schemas, repositories, validation, and logic. Do not adopt a CMS or database without a demonstrated requirement. Migrate incrementally with route/content/metadata parity tests; never perform a blind wholesale rewrite.

For SEO research, the owner mentioned the community AgriciDaniel/claude-seo skill: https://github.com/AgriciDaniel/claude-seo. It may inform audit workflow, but is not a project dependency or authority. Inspect and pin/review its SKILL.md before using it. Validate claims against primary Google Search Central, Next.js, Schema.org, and web.dev documentation and actual production-rendered output. Do not install the full plugin, connect Search Console/analytics, use paid API extensions, or change production without explicit authorization.

These architecture documents are specifications, not authorization to begin this work automatically. The current task at the top of this file remains the active implementation task unless the owner explicitly changes priority. Work on `feature` only; commits and pushes to `feature` are authorized. Do not merge, deploy, or publish without separate authorization.


## Unified JSON implementation update — 2026-11-05

The current implementation contract is `specification/internationalization-content-seo-completion-audit.md`. Canonical JSON content is documented in `specification/content-architecture-and-data-separation.md`; edit those records rather than adding JSX copy, Markdown body files, preview fixtures, or parallel sample/verified providers. The homepage composition, About, CV, detail routes, sitemap, metadata, and global structured data use content repositories. Explicit localized slugs are required for every published route record. Keep factual CV and event history limited to owner-supplied information.

When a production build fails because a Client Component uses `useSearchParams`, retain a narrowly scoped Suspense boundary around that component in its Server Component route. Do not suppress the build check or convert the entire route to client rendering.
