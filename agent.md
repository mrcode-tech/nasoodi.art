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
- Do not push to an unauthorized destination.
- Do not deploy, publish, change DNS, alter Vercel settings, modify secrets, or change external services.
- Do not commit until implementation, relevant tests, build, and verification are complete. If no commit is explicitly requested, leave changes uncommitted and report that.
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

- Use only artist/site-owner-approved material for public production content.
- Explicit owner-authorized exception for this feature-branch design task: use clearly labelled fictional bilingual biography, artist statement, and CV data to populate the existing About page for visual review. Keep it non-approved, noindex, and disabled in production runtime; replace it before any release merge. Do not create a preview route or query parameter.
- Never present fictional biography, education, exhibitions, awards, publications, dates, venues, or qualifications as verified or artist-approved facts.
- Do not machine-translate and publish unreviewed biography or interface copy as approved Persian/English content.
- Do not create a synthetic, placeholder, empty, or inferred CV PDF.
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
- Reuse the existing CV content model and display verified entries only.
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
