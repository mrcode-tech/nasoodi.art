# Nasoodi.art — End-to-End Website Implementation Prompt

**Purpose:** Execute the approved Nasoodi.art portfolio specifications as a complete, production-ready website implementation.
**Repository:** `mrcode-tech/nasoodi.art`
**Working branch:** `feature`
**Execution mode:** Inspect first, implement in roadmap order, verify every phase, and report evidence. This prompt authorizes implementation on the existing `feature` branch only; it does not authorize branch operations, merging, deployment, or publication.

---

## Role and outcome

Act as a senior product engineer, design engineer, frontend architect, accessibility specialist, SEO engineer, and QA lead. Build the bilingual Persian/English portfolio for oil painter Ghazaleh Abdolahzade Nasoodi.

Deliver a distinctive, polished, responsive, accessible, fast, maintainable artist portfolio. The website must feel like **“The artist's quiet gallery”**: warm, thoughtful, contemporary, intimate, editorial, and quietly confident. Finished paintings are the primary content. The interface is a frame around the work, never a competitor to it.

The authoritative delivery sequence and exit criteria are in [phased-implementation-blueprint.md](./phased-implementation-blueprint.md). Execute every unblocked phase, not merely the first visible page. Do not skip tests, content gates, visual QA, or evidence.

## 1. Mandatory repository and specification audit

Before changing files:

1. Read repository-level `AGENTS.md` and `specification/README.md`.
2. Read `specification/design-engineering-skills.md` and `specification/design-direction-and-system-refinement.md`.
3. Read `specification/proposal.md`, `specification/visual-identity-and-photo-direction.md`, and `specification/site-wide-design-system-and-section-specification.md`.
4. Read every relevant specialized contract, including homepage, the Selected Works three-level experience, galleries/artwork detail, Journal/events, navigation, easel background, wireframes, content model, artwork asset pipeline, localization/editorial governance, accessibility/performance/security, SEO, testing/release, and the phased blueprint. For the Selected Works journey, follow `selected-works-three-level-experience.md` as the detailed cross-page contract and Section 15 of `wireframes.md` as the responsive structural reference. Reuse the repository's candidate images under `specification/assets/gallery/` only as unapproved design samples until their identity, rights, metadata, and artist approval are verified.
5. Inspect the actual repository: branch and HEAD, clean/dirty worktree, package scripts, framework versions, routes, components, tokens, dependencies, content, image assets, tests, CI workflows, and current deployment configuration.
6. Inspect the real image files visually and technically. Filenames are not proof of content, dimensions, rights, or intended use.
7. Compare the specifications with current code. Record implemented, partially implemented, missing, contradictory, blocked, and unverified items. Do not assume a specification has already been implemented.

If a required file is missing, locate the actual equivalent or record the gap. Do not invent paths, commands, scripts, CI workflows, assets, or existing behavior.

## 2. Repository safety and change boundaries

- Work only on the already-existing `feature` branch. Do not create, switch, reset, rename, or delete branches.
- Preserve all existing user work. Inspect `git status` and the latest commit before editing; do not overwrite unrelated changes.
- Do not merge or open a pull request to `main`, do not push unless separately authorized, and do not deploy or publish.
- Do not commit until implementation, tests, build, and required verification for the completed scope have passed. If commits are not explicitly requested, leave changes uncommitted and report that fact.
- Never change production settings, DNS, analytics, secrets, or external services without explicit approval.
- Keep dependencies minimal. Add a dependency only when its benefit and maintenance cost are justified.
- Update specifications and the blueprint when implementation reveals a necessary change. Record why; do not silently weaken requirements.

## 3. Non-negotiable content and artwork integrity

- Use only supplied, verified, artist-approved assets and factual content.
- Do not invent artwork titles, dates, dimensions, medium/substrate, descriptions, series, gallery names/groupings, biography, artist statement, education, CV entries, exhibitions, awards, prices, availability, commissions, contact details, translations, testimonials, or rights/approval claims.
- Unknown facts must be omitted or represented as clearly non-public editorial TODOs; never publish placeholders as facts.
- Finished paintings are the primary visual content. Studio/process photographs are supporting material and must never be presented as finished paintings.
- Preserve artwork color, brush texture, native aspect ratio, orientation, and signature. No unapproved crop, filter, recolor, mirror, distortion, overlay, blending, AI enhancement, or destructive optimization.
- Generate derivatives only from approved masters using a documented reproducible pipeline. Compare every derivative with its source.
- The homepage hero must be an approved finished painting. Do not use the studio/process photograph as the primary hero.
- Artist/site-owner approval is required for public artwork selection, captions, translations, gallery membership, biography, CV, public contact routes, and factual claims.

## 4. Design and engineering authorities

Apply the project-specific design workflow adapted from Emil Kowalski's design-engineering principles and Impeccable's frontend refinement principles. Do not claim either upstream tool is installed or executed unless verified.

- Establish composition and hierarchy before decoration.
- Use the existing semantic design tokens and shared components. Extend rather than fork the system.
- Avoid generic SaaS/AI styling, dashboard layouts, repetitive card grids, card-in-card nesting, unnecessary badges, gradients, glassmorphism, neon, excessive shadows, and decorative elements that compete with artwork.
- Prefer editorial image/text pairings, generous but purposeful whitespace, varied section rhythm, and confident typography.
- Choose licensed fonts only after checking Persian shaping, Latin rendering, weights, file size, and responsive behavior.
- Keep the physical-left sidebar on the left in both RTL and LTR. Adapt text direction/alignment, not physical navigation placement.
- Persian must be true RTL; English must be true LTR. Verify mixed-script content, numerals, punctuation, and long titles.
- Follow the motion decision gate. No animation without a user-visible purpose. Respect `prefers-reduced-motion`; no scroll hijacking, auto-rotating galleries, cursor-following decoration, perpetual motion, or artwork animation.
- Target WCAG 2.2 AA. Provide semantic structure, keyboard operation, visible focus, accessible names, touch targets, and clear control states.

## 5. Product and page scope

Implement the full approved portfolio scope described in the specifications and blueprint:

- Shared site shell, persistent desktop physical-left sidebar, accessible mobile off-canvas navigation, locale controls, and approved theme behavior.
- Artwork-led homepage with an approved finished painting hero, selected/featured works, curated featured galleries, latest eligible Journal entries, and appropriate artist introduction/contact invitation.
- Works catalogue and canonical artwork detail pages.
- Multiple curated galleries, each with an index entry and dedicated detail route. An artwork may belong to multiple galleries without duplicating its canonical record.
- Unified Journal for articles and events. Do not create a separate top-level Events navigation item.
- About, CV/Exhibitions (only when verified entries exist), and Contact using an approved contact route.
- The full-page easel scroll background only as specified: subtle, document-relative, reversible, responsive, non-interfering, and disabled/reduced appropriately.
- SEO, localization, accessibility, performance, privacy, security, automated tests, CI, and release-readiness evidence.

Do not add e-commerce, payment, public pricing, commissions, account features, a CMS, or a contact form unless the specifications and owner approval explicitly establish them.

## 6. Required execution method

Follow [phased-implementation-blueprint.md](./phased-implementation-blueprint.md) in order.

For each phase:

1. State its scope, dependencies, current evidence, and open decisions.
2. Inspect the relevant existing implementation and assets.
3. Implement the smallest coherent vertical slice using established project conventions.
4. Add or update unit, component, integration, route, accessibility, and E2E tests appropriate to the change.
5. Run the actual repository commands. Discover scripts from `package.json`; never assume commands exist.
6. Run the relevant CI workflow and inspect its actual result/logs when GitHub permissions and workflow configuration permit.
7. Run the application and inspect rendered pages at desktop, tablet, mobile, and short-height viewports, in Persian RTL and English LTR. Capture screenshots and inspect them; an uninspected screenshot is not visual QA.
8. Test keyboard-only navigation, touch behavior, reduced motion, error/empty/loading states, long content, and image edge cases.
9. Fix the highest-impact defects and repeat affected checks.
10. Update the blueprint's phase status and evidence with commit SHA (if any), changed paths, exact commands/results, CI run URL/conclusion, screenshot locations/viewports, approvals outstanding, blockers, and next dependency.

Do not mark a phase complete merely because code was written or compilation passed. A phase is complete only when all its exit criteria and evidence are satisfied. If an artist approval or unavailable external dependency blocks publication, complete all safe implementation work, keep affected content unpublished, and mark the gate blocked with a precise request.

## 7. Visual QA requirements

Inspect at minimum:
- Desktop wide and standard.
- Tablet portrait/landscape as applicable.
- Mobile narrow and standard.
- Short-height viewport.
- Persian RTL and English LTR.
- Light/dark/system only if the theme requirement is confirmed and fully specified.
- Default, hover, focus, active, disabled, loading, empty, error, and success states where relevant.
- Reduced-motion mode.

Review real rendered output for hierarchy, typography, line wrapping, image fidelity, layout overflow, focus visibility, sidebar behavior, menu/drawer behavior, and section rhythm. Capture screenshots with a manifest containing route, viewport dimensions, locale, theme/state, browser, and timestamp. Record actual artifact paths.

## 8. SEO, accessibility, performance, privacy, and security

Implement the detailed contracts in the corresponding specifications. At minimum:
- Unique, factual localized titles/descriptions; canonical URLs; valid Persian/English alternates; sitemap and robots; Open Graph; structured data only when supported by verified content.
- Semantic headings, landmarks, image alternatives, keyboard/focus behavior, contrast, reduced motion, and WCAG 2.2 AA manual/automated checks.
- Responsive image sizing, correct loading priority, stable dimensions, and measured Core Web Vitals.
- No unnecessary tracking or third-party embeds. Do not claim encryption, privacy, or security properties that are not implemented and verified.
- Validate all public routes, not-found behavior, external links, and locale fallbacks.

## 9. Final acceptance and report

At the end, provide:
- Phase-by-phase status: complete, partial, blocked, or not started.
- Summary of implemented routes, components, data contracts, and behaviors.
- Changed-file list and branch/HEAD/worktree state.
- Exact test/build/lint/typecheck commands and results.
- CI workflow names, run URLs, conclusions, and relevant log evidence.
- Visual QA screenshots/artifacts with viewport and locale details.
- Accessibility, SEO, performance, and artwork-fidelity findings.
- Artist/site-owner approvals still required and all blocked content.
- Known defects, limitations, risks, and recommended next actions.
- Explicit statement that no merge, deployment, or publication occurred unless separately authorized and evidenced.

**Definition of done:** all unblocked blueprint phases meet their exit criteria; implementation and tests are coherent; CI and production build pass; both locales and required viewports are visually inspected; artwork integrity and content governance are respected; and every remaining approval or blocker is clearly documented.
