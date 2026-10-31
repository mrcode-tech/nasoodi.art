# Nasoodi.art — Design Engineering Skills and Operating Contract

**Status:** Project-wide design quality contract  
**Applies to:** Every visual, interaction, responsive, and content-presentation change  
**Reference philosophies:** Emil Kowalski's design engineering and animation principles; Impeccable's frontend design and refinement workflow

## 1. Purpose

This document translates two external design philosophies into a project-specific, repeatable quality standard. It is not a copy of either upstream skill and does not imply that their command-line tools are installed in this repository. Agents should apply the principles below directly. If the actual skills are installed in the implementation environment, read and follow their current instructions as well.

- **Emil design engineering:** purposeful interaction, exceptional defaults, state feedback, careful animation decisions, interruption handling, accessibility, performance, and invisible details.
- **Impeccable:** distinctive visual direction, deliberate typography and layout, hierarchy, design-system consistency, responsive adaptation, clear UX writing, critique, polish, and removal of generic interface patterns.

The artist's work remains the primary visual content. Craft exists to frame it, not compete with it.

## 2. Mandatory design context

Use the existing project context in visual-identity-and-photo-direction.md as the approved starting point:

- Audience: visitors, collectors, curators, galleries, and people discovering the artist's work.
- Core task: understand the artist's identity and practice, explore finished artworks and curated galleries, discover current Journal entries/events, and find an approved contact route.
- Personality: warm, thoughtful, contemporary, intimate, editorial, gallery-like, and quietly confident.
- Visual anchor: warm paper, dark warm ink, restrained mauve/taupe, generous space, and artist-approved photography.
- Primary content: finished artwork, then the artist's practice and editorial stories.
- Languages: Persian RTL and English LTR.
- Constraints: WCAG 2.2 AA, reduced motion, responsive behavior, high image fidelity, performance, privacy, and factual editorial governance.

If future work changes this context, record the owner's decision in the visual identity specification before redesigning.

## 3. Design workflow — mandatory order

For every new or refined surface:

1. **Understand:** identify audience, task, content priority, route, locale, state, and device context.
2. **Inspect:** read the relevant specification, current shared tokens/components, actual assets, and existing implementation before proposing a new pattern.
3. **Shape:** write a concise design intent: purpose, hierarchy, composition, behavior, responsive transformation, and constraints.
4. **Choose:** establish one coherent visual direction. Do not present a collection of unrelated styles or default to generic SaaS/AI patterns.
5. **Compose:** solve content hierarchy and spatial rhythm before adding decoration or motion.
6. **Specify:** define component anatomy, states, responsive behavior, accessibility, and content-empty/error cases.
7. **Build:** reuse existing project tokens and primitives; extend rather than fork the design system.
8. **Inspect rendered output:** evaluate at actual desktop, tablet, mobile, short-height, Persian, and English contexts. Source review alone is insufficient.
9. **Critique and refine:** fix the largest hierarchy, spacing, typography, image, interaction, and responsive defects first; then inspect again.
10. **Record:** update the relevant specification when a reusable decision changes.

Do not claim a visual audit or rendered verification occurred unless screenshots or a live rendered result were actually inspected.

## 4. Impeccable-inspired visual quality rules

### 4.1 Strong point of view
Every page must have a clear purpose and visual identity consistent with the artist's editorial/gallery world. Distinctiveness should come from composition, scale, typography, imagery, rhythm, and restraint—not decorative gimmicks.

### 4.2 Hierarchy and composition
- Establish one dominant focal point per viewport.
- Use asymmetry where it improves editorial rhythm; do not force symmetry everywhere.
- Vary section density intentionally. Large works deserve breathing room; metadata should stay compact.
- Do not wrap every element in a card. Prefer open editorial layouts, image/text pairings, rules, and whitespace.
- Avoid nested cards, repetitive identical grids, unnecessary badges, excessive pill shapes, generic shadows, glassmorphism, gradient text, neon, decorative blobs, and stock-dashboard patterns.
- Use alignment and spacing to express relationships, not just to fill a grid.
- Avoid centering every heading and paragraph by default.

### 4.3 Typography
- Use a deliberate, licensed Latin and Persian font system with appropriate shaping and weights.
- Define semantic type roles and a responsive scale; do not choose sizes independently per page.
- Use display typography for artist identity and page titles, readable text styles for long-form reading, and compact but legible metadata.
- Avoid excessively thin weights, faux letter spacing in Persian, all-caps body copy, and tiny captions.
- Verify line length, line-height, punctuation, numerals, mixed-script text, and heading wraps at real viewport widths.
- Font choices remain proposed until licensing, rendering, and artist approval are verified.

### 4.4 Color
- Use semantic color tokens from the visual identity specification.
- Keep warm paper and raised-paper surfaces dominant; use warm ink for text and mauve/taupe sparingly.
- Artwork colors are not interface tokens and must never be adjusted to match the UI.
- Validate all real foreground/background combinations against WCAG 2.2 AA.
- Never use color alone to convey navigation state, event status, or availability.

### 4.5 Content-first layouts
- Design for real approved content, not idealized placeholder copy.
- Test long Persian titles, long English titles, missing optional metadata, no upcoming events, no journal posts, one artwork, many artworks, and images with unusual aspect ratios.
- Do not force image crops to make a card grid uniform.
- Keep content hierarchy meaningful when optional sections disappear.

## 5. Emil-inspired interaction and motion rules

### 5.1 The motion decision gate
Before specifying any animation, answer in order:
1. Does this need to animate?
2. What user-visible purpose does the motion serve?
3. Which properties can communicate that purpose without layout churn?
4. Which timing/easing matches the movement and brand character?
5. What happens when the action is interrupted or reversed?
6. What is the reduced-motion equivalent?
7. Does it remain smooth on a real mobile device?

If the motion has no clear purpose, use no animation.

### 5.2 Frequency and urgency
- High-frequency actions and keyboard-triggered actions should respond immediately; do not add entrance/exit motion that makes them feel delayed.
- Frequent hover feedback should be subtle and gated to hover-capable fine pointers.
- Occasional drawers, menus, dialogs, and contextual surfaces may use restrained transitions when they clarify spatial/state change.
- Rare, meaningful editorial moments may use a carefully orchestrated reveal, but never delay access to navigation or artwork.
- Do not animate every section simply because the page scrolls.

### 5.3 Motion properties and performance
- Prefer transform and opacity for movement and transitions.
- Avoid animating layout-affecting properties such as width, height, margin, padding, top, or left when a composited alternative exists.
- Avoid transition: all.
- Do not add a motion library for a small CSS transition.
- Avoid perpetual motion, parallax that distracts from paintings, elastic/bouncy effects, cursor-following decoration, and auto-rotating galleries.
- Define shared duration/easing tokens centrally; do not scatter arbitrary values across components.
- Use transitions for rapidly changing UI states where they can be interrupted and retargeted smoothly.
- Avoid will-change unless profiling demonstrates a need.
- Do not use blur-heavy animation or large moving shadows without measured justification.

### 5.4 Interaction details
- Every interactive control must provide immediate, understandable feedback.
- Use distinct hover, focus-visible, active, disabled, loading, success, and error states where applicable.
- Active press feedback should be subtle and must not reduce target usability.
- Menus and drawers must open from a logical origin and close predictably.
- Focus must move appropriately on open, remain contained when required, and return to the trigger on close.
- Tooltips must not be the only source of essential information.
- Avoid hover-only controls and interactions that require precision pointer movement.
- Gestures must have an equivalent keyboard and touch-accessible path.

### 5.5 Reduced motion
Respect prefers-reduced-motion. Reduce or remove spatial movement, parallax, large transforms, and staggered reveals. Preserve essential state feedback through immediate state changes or subtle opacity/color transitions where appropriate. The experience must remain complete without motion.

## 6. Shared interaction and motion tokens

Inspect existing tokens and extend them rather than creating parallel values. If no equivalent tokens exist, start with this conservative proposal and validate it in the browser:

| Token | Proposed value | Use |
|---|---|---|
| --motion-fast | 120ms | Small hover/press feedback |
| --motion-standard | 180ms | Simple state transitions |
| --motion-panel | 240ms | Drawer/menu movement |
| --ease-out | cubic-bezier(0.23, 1, 0.32, 1) | Entering UI |
| --ease-in-out | cubic-bezier(0.65, 0, 0.35, 1) | On-screen spatial movement |
| --ease-ui | ease | Color/border/hover feedback |

These are initial design tokens, not permission to animate every matching component. A motion decision is still required for each use.

## 7. Responsive and input-mode rules
- Design desktop, tablet, mobile, and short-height behavior intentionally; do not merely shrink desktop.
- Preserve content priority and navigation reachability on small screens.
- Use touch target sizes and spacing appropriate to touch.
- Gate hover-only transforms and reveals behind (hover: hover) and (pointer: fine).
- Keep critical actions visible without hover.
- Ensure the mobile menu, language selector, theme selector, artwork viewer, gallery filters, and Journal filters are usable with keyboard, touch, and assistive technology.
- Avoid horizontal overflow, clipped focus rings, and viewport-height assumptions that fail on mobile browser chrome.

## 8. Component craftsmanship

Every shared component specification must describe purpose and when not to use it; anatomy and semantic HTML role; variants and responsive transformations; meaningful interaction states; keyboard and screen-reader behavior; RTL/LTR behavior; reduced-motion behavior; content-empty, long-content, and error states; and image behavior/loading priority where relevant.

Prefer simple components with good defaults. Do not add configuration options without a real use case. Keep component APIs consistent with existing repository patterns.

## 9. Visual QA and review format

Review meaningful UI changes using a Before/After table:

| Area | Before / observed issue | After / required result | Evidence |
|---|---|---|---|
| Hierarchy | Specific observed issue | Specific intended improvement | Screenshot/route |
| Typography | Specific observed issue | Specific intended improvement | Locale/viewport |
| Layout | Specific observed issue | Specific intended improvement | Viewport |
| Motion | Specific observed issue | Specific intended improvement or removed motion | Interaction/reduced motion |
| Accessibility | Specific observed issue | Specific intended improvement | Keyboard/assistive test |

Do not invent a before state if no previous rendered state was inspected. Mark it as not captured.

Visual acceptance requires desktop, tablet, mobile, and short-height review; Persian RTL and English LTR; normal and reduced motion; keyboard and touch; artwork image comparison against approved source; empty/long content states; and no obvious layout shift, clipping, overflow, or focus loss.

## 10. Anti-patterns and hard prohibitions
- No generic AI/SaaS landing-page template.
- No repetitive card grids for every section.
- No decorative gradients, glass panels, blur, glow, or oversized rounded cards without a brand/content reason.
- No motion that exists only to make the page look active.
- No forced scroll hijacking or automatic carousels.
- No artwork filters, color shifts, mirroring, AI edits, or unapproved crops.
- No invented artist facts, art titles, event details, or editorial text.
- No inaccessible custom controls where native semantic controls suffice.
- No claim of skill execution, browser inspection, or QA without evidence.

## 11. Required use during implementation

For every UI task, agents must read this contract and the applicable page specification. For broad design work, also read design-direction-and-system-refinement.md. For motion-specific work, apply the motion decision gate and record why each animation exists.

Upstream references:
- Emil Kowalski skills: https://github.com/emilkowalski/skills
- Impeccable documentation: https://impeccable.style/docs/

Use upstream sources as living references. Re-check their current instructions when the implementation environment has the actual skill installed. This repository document is the project's enforceable adaptation, not a vendored copy.
