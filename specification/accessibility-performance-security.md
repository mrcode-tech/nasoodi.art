# Accessibility, Performance, Privacy, and Security

**Status:** Proposed non-functional requirements  
**Accessibility target:** WCAG 2.2 AA

## Accessibility
- Use semantic landmarks, logical heading order, one clear H1, and descriptive link text.
- All navigation, locale controls, artwork links, dialogs, and forms must work by keyboard.
- Provide visible focus that is not hidden by sticky elements.
- Verify actual text, control, border, and focus contrast pairs; never rely on color alone.
- Support text resizing and reflow without loss of content or horizontal scrolling.
- Give informative images meaningful alt text; decorative layers empty alt.
- Provide accessible names for icon-only controls.
- Ensure adequate target sizes and spacing for touch.
- Respect reduced motion; avoid flashing and forced waits.
- Label forms, associate errors, announce status, and provide useful recovery instructions.
- Manually review Persian RTL and English LTR with keyboard and screen reader.

## Gallery and lightbox
A dedicated artwork detail page is the default. Lightbox is optional. If added, it must open by explicit action, have an accessible name, move and contain focus, close by visible control and Escape, restore focus, prevent background scrolling without trapping users, announce title/description, allow browser zoom/pinch, and keep close controls reachable on short screens. Previous/next controls appear only when destinations exist. Gestures cannot be the only control.

## Motion
The homepage studio hero is the only multi-stage narrative animation. It must not delay access to navigation or Works. Provide an immediate static composition for prefers-reduced-motion. Avoid autoplay, scroll hijacking, parallax on paintings, flashing, repeated loops, and continuous movement after the scene settles. Do not depict a false painting action unsupported by source assets.

## Performance
- Prefer server components for static content and keep client JavaScript minimal.
- Do not add a CMS, animation library, analytics, or third-party embed without a clear requirement.
- Use responsive derivatives, intrinsic dimensions, and lazy loading below the fold.
- Prioritize only the true hero asset.
- Locally host appropriately licensed fonts where practical.
- Avoid layout shift from images, fonts, and animation.
- Defer non-critical animation code and preserve a complete static fallback.
- Link to Instagram rather than requiring an embedded feed.
- Measure production-like routes on representative mobile conditions.

Suggested Core Web Vitals goals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Record actual route, locale, device profile, environment, and results; these are goals, not guarantees.

## Privacy
Default experience requires no account and collects no visitor data. No analytics, advertising pixels, session replay, or tracking by default.

If a contact form is approved:
- Collect only necessary information.
- Document purpose, recipient, retention, deletion, and privacy notice.
- Validate server-side and protect against spam/abuse.
- Keep credentials server-side and out of client bundles.
- Do not claim delivery until the provider confirms success.
- Define failure handling before launch.
- Avoid sensitive data collection and review applicable privacy obligations.

## Security
- Keep dependencies minimal and maintained.
- Never commit secrets or private contact data.
- Document environment variable names in .env.example without values.
- Validate untrusted form input and safely encode output.
- Audit security headers/CSP against actual Next.js assets and providers.
- Restrict remote image hosts to approved sources.
- Use HTTPS in production.
- Avoid unsafe HTML injection and expose no stack traces or environment data.
- Review dependency advisories and test updates.
- Use safe rel behavior for external links opened in new tabs.

## Browser/device review
Test current stable Chromium, Firefox, and Safari engines where available, plus iOS Safari and Android Chrome. Include keyboard, touch, portrait/landscape, zoom, slow network, and short-height screens. Do not claim untested browser support.

## Acceptance
- [ ] No unresolved critical automated accessibility findings.
- [ ] Keyboard-only core journeys pass.
- [ ] RTL/LTR screen-reader spot checks completed.
- [ ] Reduced-motion behavior verified.
- [ ] Contrast, focus, and reflow manually reviewed.
- [ ] Core Web Vitals measured on production-like builds.
- [ ] No unapproved trackers/embeds.
- [ ] Contact data handling documented if applicable.
- [ ] No secrets or private metadata exposed.
## Design-engineering quality requirements

The interaction and visual quality bar is defined in design-engineering-skills.md. Accessibility and performance are part of design quality, not later cleanup.

- Every motion pattern must have a reduced-motion behavior and must not block access to content.
- Hover interactions must be gated to hover-capable fine pointers and have touch/keyboard equivalents.
- Animate transform/opacity where possible; avoid layout-thrashing properties and unnecessary animation libraries.
- Keep focus indicators visible, avoid clipped focus, and provide immediate feedback for frequent/keyboard actions.
- Validate contrast for every actual token pairing, including muted metadata, active navigation, borders, and disabled states.
- Test real device responsiveness and image-loading behavior; do not rely only on desktop emulation or source inspection.

## Implemented baseline response headers — 2026-10-30

The Next.js application now sets the following response headers on all routes:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000`

The site does not currently require camera, microphone, or geolocation access. HSTS is configured for HTTPS hosting without `includeSubDomains`, because subdomain ownership/policy has not been established.

A Content Security Policy is intentionally not added by this change: Next.js runtime scripts and the site's JSON-LD currently include inline script content, and a correct nonce/hash policy requires a separate production-compatible audit rather than a permissive policy that appears secure but does not protect the application. CSP remains an explicit security review item.

Playwright checks the baseline headers on the localized route. Re-run these checks against the production-like build and review hosting-level header overrides before release.
