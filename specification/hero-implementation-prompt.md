# Studio Hero Implementation Prompt

**Scope:** Homepage studio hero only, including responsive and reduced-motion variants. This prompt does not authorize fabricated artist content or unrelated route implementation.

## Discovery
1. Read AGENTS.md, README.md, and all specification documents.
2. Inspect branch, worktree, app routes, image assets, dimensions, transparency, and references.
3. Verify intended assets such as artist.png, easel.png, oil-paint-brush.png, and canvase.png; do not infer dimensions or layering from filenames.
4. Confirm public-use approval for every asset.
5. Inspect current CSS, fonts, breakpoints, and dependencies; reuse conventions and avoid unnecessary libraries.

## Creative direction
A restrained layered studio scene:
1. Easel establishes the scene.
2. Approved canvas/artwork layer is revealed.
3. Artist cutout appears in foreground, preserving brush/hand/canvas relationships.
4. Brush movement may be subtle and brief only if technically credible and artist-approved.
5. Composition settles into a stable hero.

This is not permission to generate missing pixels, distort the painting, or misrepresent a real process. If brush alignment looks artificial, omit movement and use a strong static composition.

## Layout
- Desktop: balanced editorial composition with identity/copy and studio scene; no text over important art.
- Tablet: simplify overlaps and retain hierarchy.
- Mobile: prioritize name, role, Works link, and a legible static/simplified scene; do not shrink desktop composition into illegibility.
- Preserve asset proportions; review any crop.
- Never mirror artist/artwork in Persian RTL.
- Navigation and Works remain available without waiting.
- Hero must not consume the entire first viewport.

## Accessibility and motion
Respect prefers-reduced-motion with immediate static composition. No audio, scroll hijacking, forced waiting, repeated loops, flashing, or continuous motion after completion. Copy and links remain in document independently of animation. Decorative layers are hidden from assistive technology; provide one meaningful composite description if needed. Keep focus visible.

## Performance
Prefer CSS transforms/opacity; avoid layout-thrashing and per-frame React state. Load only necessary hero assets eagerly, defer non-critical code, set explicit dimensions, and preserve a complete static fallback if JavaScript is delayed or disabled.

## Evidence and completion
Provide desktop/tablet/mobile/short-height screenshots, both locales, reduced-motion proof, keyboard/screen-reader check, no overflow/CLS, verified source edges/transparency/crop/fidelity, actual asset paths and approvals, lint/typecheck/build results. Complete only after the composition works at target viewports, preserves artwork, keeps Works accessible, and receives artist/site-owner visual approval.


## 5. Homepage hero direction — artwork-led update

The current homepage primary hero is an **approved finished painting**, not a multi-layer studio scene. Follow [homepage-artwork-hero-and-featured-works.md](./homepage-artwork-hero-and-featured-works.md) for the normative composition and content contract. The initial candidate is `specification/assets/artwork.JPG`; inspect the actual file and confirm role, rights, and artist approval before use. Do not assume that the filename establishes its content.

The layered studio scene described above is optional supporting content and must not replace, obscure, delay, or visually compete with the hero painting. Do not automatically animate the artist, brush, or painting. Keep the painting static and fully visible unless a separately approved image treatment is supplied. The hero must include artist identity and a clear route to Works/Galleries, with a complete reduced-motion/static presentation.

## 6. Design-engineering quality bar

Before implementation, read design-engineering-skills.md and design-direction-and-system-refinement.md. The hero must express “the artist's quiet gallery”: restrained editorial typography, deliberate asymmetry, generous warm-paper space, and a finished approved painting as the dominant focal point.

Do not default to a centered marketing banner, text overlay on the painting, generic gradient, decorative blobs, glass panels, oversized rounded cards, or an animated image reveal. The hero must be compelling when completely static. Any entrance effect must pass the motion decision gate, remain brief, and have a reduced-motion equivalent. Verify image fidelity, focal point, crop, and hierarchy at desktop, tablet, mobile, and short-height sizes in both locales.
