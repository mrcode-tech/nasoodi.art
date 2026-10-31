# Repository guidance

## Project baseline

- This repository uses Next.js App Router, React, TypeScript, and Tailwind CSS.
- Application routes and layouts live under `src/app/`.
- Use strict TypeScript and prefer server components unless client-side interactivity is required.
- Keep dependencies minimal and use stable releases.
- The website is the bilingual Persian/English portfolio of oil painter Ghazaleh Abdolahzade Nasoodi. Finished artworks are the primary content; the interface must frame the work rather than compete with it.

## Mandatory specification-first workflow

Before planning, designing, implementing, or refactoring any user-facing page, component, layout, navigation, responsive behavior, interaction, animation, visual asset, or content presentation:

1. Read `specification/README.md` and this file.
2. Read `specification/design-engineering-skills.md` and `specification/design-direction-and-system-refinement.md`. These are mandatory project-wide design authorities for every design task, not optional inspiration.
3. Read `specification/proposal.md`, `specification/visual-identity-and-photo-direction.md`, and `specification/site-wide-design-system-and-section-specification.md` when work affects the overall visual language, shared shell, or multiple pages.
4. Read every relevant specialized specification before changing its surface or behavior. This includes, as applicable:
   - `specification/homepage-artwork-hero-and-featured-works.md`
   - `specification/selected-works-three-level-experience.md`
   - `specification/gallery-collections-and-artwork-detail.md`
   - `specification/journal-and-events.md`
   - `specification/navigation-and-mobile-sidebar.md`
   - `specification/easel-scroll-background.md`
   - `specification/wireframes.md`
   - `specification/content-model.md`
   - `specification/artwork-imaging-and-asset-pipeline.md`
   - `specification/localization-and-editorial-governance.md`
   - `specification/accessibility-performance-security.md`
   - `specification/seo-and-discovery.md`
   - `specification/testing-qa-and-release.md`
   - `specification/implementation-roadmap.md`
5. Inspect the actual implementation, existing design tokens, shared components, route conventions, dependencies, and relevant image assets before deciding whether to reuse, extend, replace, or add anything.
6. If a requirement is ambiguous, contradictory, unsupported by repository evidence, or depends on artist approval, record the issue and ask for clarification rather than inventing a decision.

Do not start implementation based only on a prompt summary or this file. Read the source specifications relevant to the task.

## Design authorities and conflict resolution

- `specification/design-engineering-skills.md` defines the mandatory design workflow, purposeful interaction and motion decisions, component craft, responsive behavior, and visual QA. Its principles are adapted from Emil Kowalski's design-engineering/animation approach and Impeccable's frontend design refinement approach; do not claim the upstream tools are installed or executed unless that is verified.
- `specification/design-direction-and-system-refinement.md` defines the shared creative direction, semantic palette, typography roles, spacing, image composition, navigation, motion language, and page-level composition contracts.
- Specialized page specifications remain authoritative for the unique content, structure, and behavior of their named feature, but must conform to the shared design authorities.
- Preserve factual/editorial constraints, artwork fidelity, accessibility, and privacy requirements when resolving visual conflicts. Do not silently choose between conflicting documents. Identify the conflict, update the relevant specification through the approved workflow, and keep the index/related documents consistent.
- Treat proposals as proposals until verified or approved. Distinguish proposed, implemented, tested, visually verified, artist-approved, and published states.

## Mandatory visual and interaction principles

- Follow the creative direction: warm, thoughtful, contemporary, intimate, editorial, gallery-like, and quietly confident. Avoid generic SaaS/AI styling, dashboard patterns, repetitive card grids, unnecessary badges, decorative gradients, glassmorphism, neon, excessive shadows, and decoration that competes with artwork.
- Establish hierarchy and composition before adding decoration. Give each viewport a clear focal point and use whitespace, typography, image scale, alignment, and editorial rhythm intentionally.
- Reuse the existing design tokens and shared components. Extend the system rather than introducing parallel token sets or one-off styling. Do not add a component or dependency without a clear reusable or functional reason.
- Use semantic color and typography tokens. Verify real foreground/background combinations against WCAG 2.2 AA. Confirm font licensing, Persian shaping, Latin rendering, weights, and responsive wrapping before treating a font choice as final.
- Finished paintings are the primary visual content. Preserve original color, brush texture, aspect ratio, orientation, and signature. Do not crop, filter, recolor, mirror, distort, overlay, or AI-enhance artwork unless the artist explicitly approves the exact treatment. Never use generated or stock paintings as portfolio content.
- The homepage primary hero must be an artist-approved finished painting. Studio/process photography is supporting material and must not replace or be misrepresented as finished artwork.
- Explicit initial-Hero exception: the site owner selected `specification/assets/artwork.JPG` for the feature-branch Hero. It is a studio/process photograph, not a finished painting; describe it factually, do not register it as artwork, and retain the rights/artist-approval release gate. An approved finished painting remains the preferred production Hero when selected.
- Do not invent artwork titles, dates, dimensions, medium, descriptions, gallery groupings, biography, CV entries, exhibitions, awards, prices, availability, contact details, translations, or rights/approval claims. Omit unknown facts and request artist/site-owner confirmation.
- Persian must use correct RTL behavior and English correct LTR behavior. The physical-left sidebar remains left in both locales where the navigation specification requires it; do not mirror artwork or decorative assets as a shortcut.
- Design and test real content states: long Persian and English titles, missing optional metadata, empty archives, no upcoming events, one or many works, unusual image ratios, loading, error, and unavailable states.

## Motion and interaction contract

- Apply the motion decision gate in `specification/design-engineering-skills.md` before adding animation. Every animation must have a user-visible purpose; if none exists, do not animate.
- High-frequency and keyboard-triggered actions should respond immediately. Use restrained, interruptible transform/opacity transitions only where they clarify state or spatial change.
- Avoid `transition: all`, layout-thrashing animation, perpetual motion, automatic artwork movement, scroll hijacking, cursor-following effects, unnecessary parallax, and auto-rotating galleries.
- Respect `prefers-reduced-motion`; the complete experience must remain usable without spatial or scroll-linked motion.
- Every interactive control needs understandable focus, hover (where applicable), active, disabled, loading, success, and error feedback. Provide keyboard and touch equivalents; never make essential functionality hover-only.
- Menus, drawers, dialogs, and overlays must have correct focus movement/containment/restoration, Escape behavior, and predictable dismissal.

## Accessibility, responsive design, and visual verification

- Target WCAG 2.2 AA. Use semantic HTML, accessible names, visible focus indicators, logical keyboard order, adequate touch targets, and non-color-only status communication.
- Verify desktop, tablet, mobile, and short-height layouts. Verify Persian RTL and English LTR. Verify keyboard-only interaction and reduced-motion behavior for affected surfaces.
- Inspect the rendered application at the actual target viewports. Source-code review, successful compilation, or a screenshot file that has not been inspected is not visual verification.
- Capture and review screenshot evidence for materially changed surfaces. Record viewport, locale, theme/state, findings, and artifact location in the task/phase evidence.
- Compare artwork derivatives with approved source masters and verify that image processing has not altered color, texture, crop, orientation, or proportions.
- Fix the highest-impact hierarchy, typography, spacing, image, interaction, and responsive defects first, then repeat visual inspection.
- Never claim visual QA, accessibility review, asset inspection, artist approval, or test success without actual evidence.

## Content, localization, privacy, and SEO

- Treat artist/site-owner approval as mandatory for public-facing artwork selection, imagery, copy, translations, metadata, gallery membership, and factual claims.
- Keep Persian and English content semantically equivalent where translations are approved; do not assume literal machine translation is publishable.
- Follow the content model and editorial governance. Keep Journal as the unified editorial section; do not add a separate top-level Events section unless the owner changes the specification.
- Follow the artwork asset pipeline and document source, rights, approval, master, and derivative relationships.
- Use accurate metadata, canonical URLs, locale alternates, sitemap/robots behavior, and structured data only for supported facts.
- Minimize tracking and third-party dependencies. Do not introduce analytics, embeds, external image services, or data collection without specification and owner approval.
- Do not commit secrets. Keep environment-specific values in local environment files and document required variables in `.env.example`.

## Engineering and repository workflow

- Inspect the current branch, worktree, latest commit, package scripts, route structure, and CI workflows before changing code. Preserve unrelated work.
- Keep work on the existing `feature` branch unless the owner explicitly authorizes a different branch.
- Do not create, switch, reset, or delete branches unless explicitly authorized.
- Do not merge to `main`, push to an unauthorized destination, or deploy without separate explicit authorization.
- Do not commit until implementation, relevant tests, and verification are complete, unless the owner explicitly requests an earlier checkpoint.
- Prefer focused, maintainable changes and strict TypeScript. Keep dependencies minimal and use stable releases.
- Update relevant specifications when implementation reveals a reusable design decision or when approved behavior changes. Keep `specification/README.md`, wireframes, roadmap, and related contracts consistent.

## Quality checks

Inspect `package.json` and CI configuration to confirm available scripts and workflows; do not assume commands exist. At minimum, run the applicable checks before reporting completion. The currently documented baseline is:

```bash
npm run lint
npm run typecheck
npm run build
```

Also run relevant unit, component, integration, accessibility, localization, and end-to-end tests for the changed behavior. Run the actual GitHub Actions workflow when authorized and available; inspect its conclusion and logs. Report exact commands, results, CI run evidence, visual artifacts, unresolved issues, and approvals still needed.

A task is not complete merely because code was written or the build passes. Completion requires the applicable automated checks, rendered visual review, responsive/locale/accessibility checks, and required artist/site-owner approval as defined by the roadmap and release specification.


## Mandatory shadcn/ui component reuse standard

- Treat shadcn/ui as the preferred component foundation for shared application controls. Before implementing a control, inspect `components.json`, `src/components/ui/`, installed Radix primitives, and existing shared components.
- Prefer composing existing shadcn/ui components over bespoke menus, dialogs, drawers, buttons, selects, tabs, tooltips, or navigation controls.
- Use the shadcn Sidebar pattern for persistent desktop navigation when it fits the page contract. Use the shared Sheet/Dialog primitive for modal mobile navigation and Dropdown Menu for compact language selection.
- Preserve Nasoodi's visual tokens and editorial art direction. shadcn is a component architecture and accessibility foundation, not a reason to apply default dashboard styling.
- Do not duplicate primitive implementations. Extend through variants, composition, and shared wrappers.
- Before adding a component or dependency, record why the installed component inventory cannot satisfy the requirement. Keep wrappers thin and reusable.
- Shared controls must support Persian RTL and English LTR, keyboard interaction, visible focus, reduced motion, and relevant WCAG 2.2 AA requirements.
- Update the component reuse specification and inventory whenever shared UI architecture changes. Add component and Playwright coverage for meaningful interaction changes.
- Configuration is `components.json`; shared primitives live under `src/components/ui/`; class utilities live under `src/lib/utils.ts`.
