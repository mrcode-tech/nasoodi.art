# Internationalization, Content, and SEO Completion Audit

**Updated:** 2026-11-05  
**Branch:** `feature`  
**Scope:** Bilingual routes, canonical JSON content, CV, Contact, Journal/events, SEO, and CI.

## Current architecture

The application uses Next.js App Router, next-intl, English/Persian localized routes, server-rendered content, canonical JSON records, focused repositories, localized metadata, sitemap/robots routes, and Playwright coverage.

Canonical content is stored in:
- `artist-profile.json`
- `cv.json`
- `contact.json`
- `artworks.json`
- `galleries.json`
- `journal/index.json`
- `site.json`
- `homepage-selection.json`

Journal articles and exhibition/event entries share one Journal collection. The event repository is a filtered view, not a second content store. Homepage/About biography uses the same artist-profile record. About CV, CV page, and PDF use the same CV source. Homepage Contact and Contact page use the same Contact source.

## Owner content decisions

- Use the existing canonical JSON content as the site's initial editable content. The owner will revise it after launch.
- Do not add editorial verification, factuality, provenance, artist-approval, or completeness gates that hide content.
- Do not require editorial status/verification flags for CV, Contact, exhibitions, awards, publications, or Journal entries.
- Do not create parallel preview, sample, fictional, verified/unverified, temporary/permanent, or environment-specific content stores.
- Current Contact methods are `g.nasoodi@gmail.com`, `@nasoodi`, and `@ghazalenasoodi`.
- CV content currently contains 16 localized records spanning education, exhibitions, publications, awards, and ongoing practice. The CV download route uses the canonical CV data.
- Technical safeguards remain appropriate for safe URLs, asset paths, route handling, type compatibility, and graceful optional fields. They must not make editorial judgments.

## SEO and localization

- English is LTR and Persian is RTL.
- UI translations remain in next-intl message resources; editorial translations remain in canonical JSON.
- Metadata, canonical links, hreflang, JSON-LD, sitemap, and robots behavior derive from the same localized content repositories.
- Structured data should represent the content actually rendered on the page; do not require a separate verification flag.

## CI verification

The last known completed run before the current content/test changes was run [42018399857](https://github.com/mrcode-tech/nasoodi.art/actions/runs/42018399857), successful for SHA `ee53346740b45c5171a09fd8b883e6e6997f88c9`.

The current branch changes update CV/Contact browser expectations and remove editorial data approval/verification rules from the specifications. The current CI result must be read from the latest GitHub Actions run for the feature-branch HEAD; do not copy the previous successful result as evidence for a later SHA.

## Remaining manual work

- Review English and Persian editorial wording and visual layout.
- Review actual rendered desktop/mobile screenshots.
- Check PDF appearance and download behavior in a browser.
- Confirm the imported CV and exhibition text is the intended initial editable content.
- Do not deploy or merge as part of this task.
