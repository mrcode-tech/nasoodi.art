# Contact Experience Design Proposal

**Project:** Nasoodi.art  
**Repository:** `mrcode-tech/nasoodi.art`  
**Working branch:** `feature`  
**Status:** Design proposal for owner review; implementation is governed by the existing site-wide Contact implementation prompt.  
**Scope:** Homepage Contact section, dedicated bilingual Contact page, and sidebar/mobile navigation entry.

---

## 1. Purpose and design intent

Create a calm, personal, and memorable way for visitors to contact oil painter Ghazaleh Abdolahzade Nasoodi. The experience should feel like the closing page of a contemporary gallery exhibition catalogue: welcoming, considered, and editorial.

The Contact experience must support practical visitor needs without competing with the artwork or looking like a corporate lead-generation page.

**Design direction: Quiet Editorial.**

The visual hierarchy should come from typography, alignment, whitespace, and restrained interaction—not from a row of social cards, prominent promotional buttons, decorative icons, or heavy containers.

## 2. Information architecture

Provide two complementary entry points that share one source of truth:

1. **Homepage Contact section:** a concise closing section after the existing Gallery and Journal content and before the global footer.
2. **Dedicated Contact page:** a more spacious localized destination linked from the existing desktop sidebar and mobile drawer.

Both surfaces use the same contact data, localized copy, link validation, typography roles, and interaction patterns. The homepage section is a preview, not a separate data implementation.

The dedicated page has the breadcrumb path **Home → Contact** where the shared breadcrumb system is applicable.

Do not add a separate contact-sales flow or additional navigation hierarchy.

## 3. Homepage section composition

The homepage section should be brief and function as a natural conclusion to the visitor's journey.

Recommended content:

- A small editorial eyebrow: **CONTACT**
- A clear heading: **Let's start a conversation.**
- One short invitation explaining that visitors may reach out about exhibitions, collaborations, or the artwork.
- A restrained primary email link.
- Secondary Instagram and Telegram links.
- A quiet text link to the full Contact page only if it adds useful context; avoid duplicating a large call-to-action.

Place the section after the existing Gallery/Journal content and before the footer. Preserve the established homepage section rhythm and avoid introducing an oversized blank gap or a new decorative background.

## 4. Dedicated page: desktop composition

Use an asymmetric two-column editorial layout within the existing page content container.

### Introduction column

- Small eyebrow: **CONTACT**
- Large editorial heading: **Let's start a conversation.**
- A concise, warm invitation.
- Optional supporting sentence that sets a personal, artist-led tone without making unsupported claims about response times, availability, commissions, or services.

### Contact details column

Present the three contact methods as a simple, vertically arranged typographic list:

1. **Email** — primary contact method.
2. **Instagram** — secondary contact method.
3. **Telegram** — secondary contact method.

Each item contains a clear label and a readable value or destination. Use semantic anchors for working destinations. Keep the email easiest to discover and activate.

Do not place each method in its own bordered card. Avoid a three-icon row, repeated horizontal rules, large filled buttons, and unnecessary explanatory copy. A subtle text underline or small directional indicator may appear on hover/focus where it is consistent with existing link patterns.

The columns should feel balanced rather than rigidly equal. Use the existing grid/container system and tokens; do not invent page-specific breakpoints or colors.

## 5. Mobile and tablet behavior

On mobile, stack the content in natural reading order:

1. Eyebrow.
2. Main heading.
3. Invitation copy.
4. Email.
5. Instagram.
6. Telegram.

Keep comfortable vertical separation between contact methods and ensure long email addresses or handles wrap safely without horizontal overflow.

At tablet widths, retain two columns only while both remain comfortably readable. Otherwise transition to the same single-column sequence. Do not compress typography or reduce touch targets to preserve a two-column layout.

Use CSS logical properties and the site's existing responsive breakpoints.

## 6. Persian RTL and English LTR

Treat Persian and English as first-class compositions.

- English uses natural LTR reading and alignment.
- Persian uses natural RTL reading and alignment.
- Preserve the same hierarchy and overall visual balance; do not mechanically mirror every decorative detail.
- Use locale dictionaries for all interface copy.
- Isolate Latin-script email addresses, URLs, and social handles with appropriate directionality so punctuation and mixed-script text render correctly.
- Use logical spacing/alignment properties where possible.
- Verify keyboard focus order follows the visual and DOM reading order in both locales.

Translations must be reviewed according to the repository's localization governance; do not treat unreviewed machine translation as approved copy.

## 7. Typography, color, and spacing

- Reuse the site's existing display, heading, body, label, and link typography roles.
- Reuse semantic theme tokens for both Light and Dark modes.
- Keep contact values comfortably readable and selectable.
- Use whitespace and type scale to distinguish the introduction from the contact methods.
- Avoid new palette values, gradients, glass effects, heavy shadows, pills, nested cards, and decorative blobs.
- Do not add horizontal separators behind or between every contact method.
- Preserve consistent content edges and section spacing with Galleries, Journal, About, and the global footer.

The Contact page should feel related to the rest of the portfolio, not like a separately themed microsite.

## 8. Contact data and link behavior

Use one centralized, typed contact-data source consumed by both the homepage section and dedicated page.

The data model should distinguish the contact method, display label/value, destination, and whether the destination is operational or a temporary design fixture. Validate destinations before rendering anchors.

- Email uses a correctly encoded `mailto:` destination.
- Instagram and Telegram use valid HTTPS destinations when actual profile URLs are supplied.
- The owner explicitly authorizes fictional email and social destinations during the current demo phase. They must be clearly identified as fixtures in source comments and must never be described as real, verified, monitored, or artist-approved.
- Render the owner-authorized demo fixtures normally without approval gates or a visible disclaimer. Keep Contact routes noindex and out of the sitemap until the values are replaced with real owner-supplied details before public launch.
- Preserve the existing artist Instagram handle `@ghazalenasoodi` wherever it is already approved and used. Do not silently change it.
- Do not add a phone number, postal address, opening hours, response-time promise, booking system, commission availability, or other unprovided facts.
- Do not add an unrequested contact form. A form is a separate product decision and requires an approved, reliable message-delivery mechanism, spam protection, privacy review, and explicit owner approval.

The owner has explicitly approved the demo-phase treatment: centralized fictional values render on the homepage and localized Contact pages without approval-state conditions. They remain noindex and excluded from the sitemap until replaced with real details. Never present them as verified artist contact details.

## 9. Interaction and accessibility

Target WCAG 2.2 AA and follow the existing shared component and accessibility standards.

- Use semantic headings, paragraphs, lists, and anchors.
- Every contact link must have a clear accessible name and a meaningful destination.
- Ensure keyboard activation and visible focus states.
- Do not make hover the only way to reveal an affordance.
- Keep touch targets comfortably operable.
- Provide sufficient contrast in Light and Dark themes.
- Respect browser zoom and text resizing.
- Use subtle hover/focus feedback only; no essential animation is required.
- If a transition is used, keep it restrained and respect `prefers-reduced-motion`.
- External links must follow the repository's established safe-link policy, including appropriate handling of new tabs if used.

A copy-email interaction may be considered only if it has a clear benefit, accessible status feedback, and a robust fallback. It is optional, not a requirement.

## 10. Content guidance

Suggested English copy for design exploration:

**Eyebrow:** CONTACT  
**Heading:** Let's start a conversation.  
**Invitation:** For exhibition inquiries, collaborations, or to share your thoughts about the artwork, feel free to get in touch.

This is proposed interface copy, not a factual claim. The final English and Persian wording should be reviewed and approved before publication.

Do not invent artist biography, business hours, physical location, contact availability, response commitments, or commercial services.

## 11. Explicit non-goals

This proposal does not authorize:

- A corporate contact-sales layout or lead-generation funnel.
- A large generic contact form.
- New phone, postal-address, or location details.
- Unverified or invented public contact information.
- Social-media embeds or third-party widgets.
- Analytics, tracking, or new external services.
- A new visual theme, palette, font system, or parallel component library.
- Changes to unrelated artwork, Gallery, Journal, About, or navigation behavior beyond the Contact destination.
- Deployment, release publication, or merging to `stage` or `main`.

## 12. Acceptance criteria

### Homepage

- [ ] Contact appears after the existing editorial/gallery content and before the global footer.
- [ ] The section is concise and visually consistent with the homepage rhythm.
- [ ] Email is the primary contact action; Instagram and Telegram are secondary.
- [ ] It uses the same canonical contact data as the dedicated page.

### Dedicated page

- [ ] A localized Contact page exists for English and Persian.
- [ ] Contact is reachable from the desktop sidebar and mobile drawer.
- [ ] Desktop uses a balanced, asymmetric editorial composition where space permits.
- [ ] Mobile uses a readable single-column sequence.
- [ ] The shared breadcrumb identifies Home → Contact.
- [ ] No generic cards, excessive icons, or unnecessary separators are introduced.

### Localization and accessibility

- [ ] English LTR and Persian RTL are correct, including mixed-script contact values.
- [ ] Copy is localized through the existing dictionaries.
- [ ] Links are keyboard accessible, visibly focused, and correctly named.
- [ ] Light and Dark theme contrast is verified.
- [ ] No horizontal overflow occurs at supported mobile widths and text zoom levels.

### Data and release integrity

- [ ] Both surfaces use one centralized contact data source.
- [ ] Email and social destinations are validated.
- [ ] Temporary fixtures are not misrepresented as real or verified artist contact details.
- [ ] The existing approved Instagram handle remains unchanged.
- [ ] No unsupported contact methods or claims are added.
- [ ] Any publication/release gate for replacing sample data is explicitly satisfied.

## 13. Relationship to implementation specification

This document records the product and visual proposal. It does not replace the detailed engineering brief.

The implementation agent must also follow:

- `specification/site-wide-navigation-spacing-and-contact-implementation-prompt.md` — complete implementation, route, component, testing, CI, and visual-QA contract.
- `AGENTS.md` — repository-wide design, content, accessibility, engineering, and release rules.
- `specification/README.md` — specification index and mandatory reading sequence.
- The shared design, navigation, shadcn reuse, localization, accessibility, and testing specifications referenced by the implementation prompt.

Follow the owner-authorized demo Contact exception in AGENTS.md and the implementation prompt. Implement only on the existing `feature` branch. Do not merge, deploy, or publish without separate authorization.
