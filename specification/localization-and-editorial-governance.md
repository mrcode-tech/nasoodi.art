# Localization, Translation, and Editorial Governance

**Status:** Proposed content operations contract  
**Locales:** Persian (fa) and English (en)

## Editorial authority
The artist is authoritative for her name, artwork titles, artist statement, biography, series, professional history, image selection, and real public contact details. Distinguish verified facts, artist-authored text, approved translation, editorial draft, and development-only placeholder. Only approved factual artist content may be indexed. Owner-authorized demo-phase exception (2026-11-03): fictional email/social Contact destinations may be rendered on the homepage and Contact routes without approval gates, but Contact routes must remain noindex and outside the sitemap until replaced with real details. AI may assist with proofreading or translation drafts, but artist/human review is required before publication.

## Locale behavior
- Persian documents use lang=fa and dir=rtl; English documents use lang=en and dir=ltr.
- Use CSS logical properties.
- Never mirror paintings, photographs, artist cutouts, or studio scenes.
- Adapt only directional interface symbols when meaning requires it.
- Isolate Latin names, URLs, email addresses, and dimensions in RTL content.
- Use a Persian-capable font with correct shaping; never apply faux letter spacing to connected script.
- Confirm numeral policy and use locale-aware dates/numbers without changing underlying facts.

## Translation parity
Each content item may have separate fa and en values. Missing translation remains missing; do not display blank or unreviewed machine translation. Language switcher links to the equivalent translation when available; otherwise use a clear locale-home fallback. Never connect unrelated artwork pages. Emit hreflang only for genuine reciprocal approved translations. Confirm preferred English transliteration and use consistently.

## Editorial states
1. draft — private work in progress.
2. needs-review — factual, linguistic, visual, or rights review required.
3. approved — artist/authorized owner approved public presentation.
4. published — publicly available.
5. archived — intentionally unpublished or superseded.

Changes to image, crop, title, description, date, dimensions, availability, or translation return the item to review. Keep internal approvals and notes private.

## Writing standards
Use calm, precise, personal editorial language. Avoid generic art-world clichés and unsupported claims such as internationally acclaimed. Keep the artist statement first-person and biography third-person factual. Do not infer symbolism, influences, themes, education, or intent. Maintain consistent punctuation, capitalization, date format, units, and transliteration. No keyword stuffing or unconfirmed contact, sales, commission, or availability claims.

## Page-by-page approval
- Home: name, discipline, intro, hero image, selected works.
- Works: image rights, stable slug, title or approved untitled treatment, alt text.
- Artwork: verified metadata only; enquiry only if configured.
- About: separate approved statement and biography.
- CV: sourced, verified entries; omit empty categories.
- Contact: use owner-approved real destinations for public launch. During the authorized demo phase, use the centralized fictional Contact fixture without approval-state gating; keep the route noindex and outside the sitemap. Never imply demo accounts are real, verified, or monitored.

## Review checklist
Review artist facts/spelling, Persian grammar and punctuation, English grammar/transliteration, artwork identity and metadata, image rights/crop, alt text, SEO metadata, social preview, and responsive layouts. Record reviewer, date, and approval scope. If rights or facts are disputed, unpublish until resolved.

## Decisions required
Preferred public English name, primary locale at /, approved translations, statement and biography, artwork titles/metadata/order, public asset permissions, CV scope, contact method, form/sales/commission policy, and press-kit decision.
## Design-engineering alignment

Bilingual design is a first-class visual requirement under design-engineering-skills.md and design-direction-and-system-refinement.md.

- Persian and English must share the same brand identity and hierarchy while allowing script-specific typography, line-height, wrapping, and spacing.
- Never mechanically mirror artwork, photography, or the physical-left sidebar to simulate RTL.
- Review mixed-script names, URLs, dates, numerals, punctuation, and long titles in rendered pages.
- Do not force identical line breaks or component dimensions across locales when natural script metrics differ.
- Translated labels and editorial content require approval; visual polish must not conceal missing or unapproved translations.

## UI message governance — implementation checkpoint 2026-11-05

The CI message audit is a required gate, not a translation approval mechanism. It validates matching namespace files, recursively flattened message keys, duplicate keys across namespaces, missing keys in either locale, non-empty values, and matching interpolation placeholders. It also rejects Persian UI literals in application/component TSX so localized interface copy remains in message resources.

Human review remains mandatory for Persian grammar, English terminology, artist-facing tone, context, and semantic equivalence. A passing audit proves structural consistency only; it does not prove translation quality or artist approval. New UI copy must be added to both locale resources, reviewed in context, and covered by the existing route/component tests. Editorial artist content remains in the content layer, not in UI messages.

## Unified JSON content and locale governance — 2026-11-05

The owner-approved content policy for this implementation supersedes previous demo-fixture and separate About/CV preview rules.

- Store editorial copy in canonical JSON records with localized fields. UI messages alone belong in next-intl resources.
- Use stable entity IDs across locales and explicit localized slugs. Relationships use IDs, not translated titles or slug equality.
- Do not create a second record/provider for verified, unverified, sample, fictional, temporary, or preview content. Do not add status flags solely to label initial copy.
- Homepage and About use the same canonical artist profile. CV uses one canonical JSON record. Journal body text lives in localized JSON rich-text blocks.
- Initial descriptive editorial copy can be authored as the website's normal editable content. Do not fabricate external credentials, education, exhibitions, awards, dates, institutions, or contact channels.
- Missing localized editorial content is an explicit incomplete record, not permission to silently fall back to English. Keep routes from rendering another language as a fallback.
- Contact destinations must be owner-supplied. Preserve the artist's actual Instagram identity and do not retain invented demo email/Telegram destinations.
- Content changes should require JSON edits and validation, not React component changes.
