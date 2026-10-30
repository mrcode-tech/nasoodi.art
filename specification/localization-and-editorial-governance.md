# Localization, Translation, and Editorial Governance

**Status:** Proposed content operations contract  
**Locales:** Persian (fa) and English (en)

## Editorial authority
The artist is authoritative for her name, artwork titles, artist statement, biography, series, professional history, image selection, and public contact details. Distinguish verified facts, artist-authored text, approved translation, editorial draft, and development-only placeholder. Only approved content may be published or indexed. AI may assist with proofreading or translation drafts, but artist/human review is required before publication.

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
- Contact: approved destination and truthful response expectations; privacy notice if data is collected.

## Review checklist
Review artist facts/spelling, Persian grammar and punctuation, English grammar/transliteration, artwork identity and metadata, image rights/crop, alt text, SEO metadata, social preview, and responsive layouts. Record reviewer, date, and approval scope. If rights or facts are disputed, unpublish until resolved.

## Decisions required
Preferred public English name, primary locale at /, approved translations, statement and biography, artwork titles/metadata/order, public asset permissions, CV scope, contact method, form/sales/commission policy, and press-kit decision.
