# Nasoodi.art — Professional Artist Portfolio Proposal

**Status:** Proposed  
**Working branch:** `feature`  
**Site:** `https://nasoodi.art`  
**Artist:** Ghazaleh Abdolahzade Nasoodi — غزاله عبداله زاده نسودی  
**Practice:** Oil painting  
**Location:** Iran  
**Social profile supplied by owner:** [Instagram @ghazalenasoodi](https://www.instagram.com/ghazalenasoodi/)

---

## 1. Executive summary

Transform nasoodi.art from a generic starter landing page into a refined, artwork-led professional portfolio for oil painter Ghazaleh Abdolahzade Nasoodi.

The website should feel like a carefully curated digital gallery: calm, confident, visually precise, and respectful of the paintings. It should make it possible to discover the artist's work quickly, explore coherent bodies of work, understand the artist's practice, review verified professional information, and make a direct enquiry.

The site is not intended to imitate a social-media feed or an online marketplace. Instagram can remain an important discovery and social channel, while nasoodi.art becomes the artist-controlled, durable professional home for selected work, biography, exhibition information, and contact.

**Primary principle: the paintings are the interface's main content.** Navigation, typography, motion, color, and decoration must support the artwork rather than compete with it.

## 2. Verified context and assumptions

### 2.1 Facts supplied by the site owner

- The site represents Ghazaleh Abdolahzade Nasoodi.
- Her Persian name is غزاله عبداله زاده نسودی.
- She is an oil painter.
- She lives in Iran.
- Her Instagram handle is @ghazalenasoodi.

The supplied English spelling should be used provisionally. Confirm the artist's preferred English transliteration, capitalization, and whether she prefers a shorter public-facing name before final publication.

### 2.2 Research limitation

The Instagram profile URL was attempted, but the page was not accessible in the browsing environment. Therefore this proposal does not claim to have reviewed the profile's posts, captions, biography, followers, or artwork. The Instagram URL may be linked as a user-supplied social destination; actual works and artist facts must be supplied or approved by the artist.

### 2.3 Explicitly unknown

Do not fabricate or assume:

- Artist statement, biography, training, influences, or artistic themes.
- Artwork titles, dates, dimensions, materials beyond the supplied oil-painting practice, or series names.
- Exhibitions, awards, residencies, publications, collections, representation, or press coverage.
- Whether original paintings are for sale, sold, reserved, or available for commission.
- Prices, shipping destinations, payment methods, studio address, phone number, or personal email.
- Whether all Instagram images are owned by the artist or cleared for reuse.

Missing content is a content dependency, not a reason to create fictional copy.

## 3. Product goals

### Primary goals

1. Present a strong, curated selection of Ghazaleh's oil paintings with accurate color, scale, and detail.
2. Establish a credible professional identity for gallery owners, curators, collectors, and art professionals.
3. Communicate the artist's practice through a concise artist statement and factual biography.
4. Make artwork details and contact/enquiry actions easy to find.
5. Provide a polished experience in Persian and English, including correct right-to-left behavior for Persian.
6. Give the artist control over a permanent web presence independent of social-media algorithms.
7. Make the portfolio discoverable through accessible, technically sound search-engine optimization.

### Secondary goals

- Provide a verified exhibition/CV archive when source material exists.
- Support artwork enquiries and commission enquiries if the artist confirms that she accepts them.
- Provide a downloadable portfolio or press kit if the artist wants one.
- Link to Instagram without making the site dependent on Instagram availability.

### Non-goals for the initial release

- A full e-commerce checkout, inventory system, or payment processing.
- Public display of private studio or home address.
- Unverified press, awards, gallery affiliations, or testimonials.
- A social feed clone, comments, likes, user accounts, or community features.
- A complex CMS before the content volume and editing workflow justify it.
- AI-generated descriptions or artwork imagery presented as authentic artist content.

## 4. Audiences and their needs

| Audience | What they need | Website response |
|---|---|---|
| Gallery owners and curators | Coherent bodies of work, artistic direction, professional background, exhibition history | Curated series, artist statement, factual CV, clear contact |
| Collectors | Strong artwork presentation, dimensions, medium, year, availability, enquiry route | Artwork detail views and a consistent metadata panel |
| Art professionals and press | Accurate biography, selected images, credits, downloadable materials where approved | About, CV, press-kit option, image/contact permissions |
| General visitors | Immediate visual impression, context, simple navigation, social link | Image-led home, accessible gallery, concise about section, Instagram link |

The first screen should communicate the artist's identity and show real artwork immediately. Do not make visitors pass through a decorative intro, splash animation, or long biography before seeing a painting.

## 5. Recommended information architecture

Keep primary navigation short and predictable:

- **Home**
- **Works**
- **About**
- **CV / Exhibitions** (show only when there is verified content)
- **Contact**

A language switcher (فارسی / English) should be visible and keyboard accessible. Instagram should be a clearly identified social link, not a substitute for the site's contact page.

### 5.1 Routes

Proposed route structure:

- `/` — Persian-first or language-aware homepage, subject to the artist's language preference.
- `/en` — English homepage.
- `/works` and `/en/works` — selected works and series.
- `/works/[slug]` and `/en/works/[slug]` — individual artwork or series detail, depending on the approved content model.
- `/about` and `/en/about` — artist statement and biography.
- `/cv` and `/en/cv` — verified exhibitions, education, awards, publications, collections; omit or label as forthcoming until populated.
- `/contact` and `/en/contact` — contact and enquiry options.

Use stable, readable slugs. Avoid duplicating identical content across routes. Add reciprocal language alternates only when both translations are genuinely available. Do not automatically redirect search crawlers based on inferred location.

### 5.2 Homepage content order

1. Compact header with artist name/wordmark and primary navigation.
2. A strong selected painting or curated artwork composition, with the artist's name and the concise discipline descriptor “Oil Painter”.
3. A short, artist-approved introduction or statement excerpt.
4. Selected works / featured series.
5. A restrained about preview with a link to the full biography.
6. Verified exhibition highlights, if available.
7. Contact/enquiry invitation and Instagram link.
8. Minimal footer with language options, copyright, and relevant links.

The artwork must remain visible without requiring a visitor to dismiss a modal or wait for an animation.

## 6. Visual and art direction

### 6.1 Design concept: a quiet contemporary gallery

Use a gallery-like visual language: generous negative space, strong image scale, restrained typography, precise alignment, and subtle editorial details. The site should feel personal and art-directed rather than like a generic agency template.

Use the owner-supplied studio photograph as the initial visual reference. The proposed interface palette is warm paper (#F3F0EA), raised paper (#FAF8F4), warm ink (#302824), muted canvas mauve (#837369), smoky umber (#675A51), and muted sand (#C5B197). This is a starting identity derived from one photograph, not a claim about every painting. See [Visual identity and photo direction](./visual-identity-and-photo-direction.md) for the sampled source colors, semantic tokens, photo placement/cropping rules, homepage composition, and accessibility gates. Keep the interface predominantly light and neutral; do not impose a dark theme or apply filters to artwork.

The current starter's dark violet gradient, generic “Ideas take many forms” messaging, and technology-oriented identity are not suitable as the final art direction. Replace them with an artist-first identity.

### 6.2 Typography

- Choose a refined, highly legible Latin typeface for English.
- Choose a Persian typeface with excellent Persian glyph shaping and readable weights.
- Pair fonts intentionally; do not use faux Persian letter spacing or force Latin typography onto Persian text.
- Use editorial hierarchy: clear page title, understated section labels, and consistent artwork captions.
- Ensure Persian punctuation, numerals, mixed-language text, and bidirectional inline content render correctly.

Font licensing, performance, and local hosting should be reviewed before choosing a final family.

### 6.3 Artwork presentation

- Treat every artwork as a first-class content item, not a decorative background.
- Use consistent image framing and neutral surroundings.
- Provide large images with a deliberate balance between full-bleed presentation and readable margins.
- Preserve original aspect ratios; do not crop a painting merely to fit a uniform card.
- Provide a detail view with a larger image and accurate caption/metadata.
- Offer zoom or a high-resolution view only where source resolution and licensing allow.
- Never apply CSS filters, color overlays, blend modes, or aggressive compression to artwork images.
- Keep interface colors neutral so viewers can judge the painting's colors accurately.
- For textured oil paintings, include detail photographs when they materially reveal brushwork or surface texture; label detail crops as details, not separate artworks.
- Include framed/in-situ photographs only when they add useful scale or context and are approved.

### 6.4 Motion

Motion should be quiet and optional: subtle fades or transitions may help orientation, but no autoplaying carousels, parallax that moves artwork independently, scroll hijacking, forced intro, or animation that delays access to work. Respect `prefers-reduced-motion`.

## 6.5 Site-wide design system and section-level design

The visual identity is not limited to the homepage. Every public route must feel like part of the same carefully curated gallery while retaining a layout appropriate to its content. The detailed, implementation-oriented source for the complete site is [Site-wide design system and section specification](./site-wide-design-system-and-section-specification.md).

That document defines:
- Global header, navigation, locale switcher, page container, and footer.
- Homepage hierarchy and detailed behavior for the animated studio hero, selected works, artist introduction, verified CV highlights, and contact invitation.
- Works index, artwork detail, About, CV/Exhibitions, and Contact page structures.
- Shared typography, color, spacing, grid, image, motion, interaction, and responsive rules.
- Persian RTL and English LTR behavior, accessibility, SEO, content integrity, component inventory, and design QA.

Treat the site-wide specification as the design baseline for all sections. Reuse semantic tokens and shared components, but do not force every page into the same layout. The hero is the signature animated moment; other sections should use quieter editorial presentation so that motion does not compete with the paintings.

The separate [Animated hero implementation prompt](./hero-implementation-prompt.md) is the execution-ready prompt for implementing the four visual layers in this sequence: visible easel appears, artwork is revealed, artist enters the foreground, brush makes a restrained hand-aligned gesture, and the composition settles into the permanent homepage hero. It includes asset integrity, responsive behavior, reduced motion, accessibility, performance, tests, and verification requirements.

The hero prompt is scoped to the hero and its homepage integration. It does not authorize an agent to fabricate content or implement every remaining page as part of that task. Use the site-wide specification and implementation roadmap for the full portfolio.

## 7. Core functional requirements

### 7.1 Work gallery

- Organize work into artist-approved series or collections where meaningful.
- Provide a curated “Selected Works” entry point.
- Allow a visitor to browse without account creation.
- Use responsive layouts that preserve each painting's aspect ratio.
- Provide clear loading, empty, and unavailable states.
- Provide meaningful image alt text based on verified visible content.
- Avoid filters until the catalog is large enough to justify them; if needed, filters should use real metadata (series, year, availability) and remain usable on mobile.

### 7.2 Artwork detail

Each artwork should support the following optional fields when supplied:

- Title.
- Year or date (or “date unknown” internally; do not guess).
- Medium (for example, oil on canvas only when confirmed for that work).
- Dimensions and units.
- Series or collection.
- Short artist-approved note/context.
- Availability state: available, sold, reserved, not for sale, or not disclosed.
- Exhibition/provenance note where verified and approved.
- Main image, optional detail images, and optional installation/context image.
- Image credit/rights information for internal editorial use.

If an artwork is available for enquiry, present a clear “Enquire about this work” action. Do not publish a price or availability claim unless the artist has confirmed it and can keep it current.

### 7.3 About and artist statement

Keep the artist statement distinct from the biography:

- **Artist statement:** first-person explanation of the ideas, questions, materials, and approach behind the work. Aim for approximately 120–250 words, but follow the artist's own voice.
- **Biography:** factual professional summary, usually third person, covering only confirmed background and career information.
- **Portrait/studio image:** optional, supplied and approved by the artist.

Do not write a fictional artist narrative or infer themes from a few images.

### 7.4 CV and exhibitions

If supplied, present entries in reverse chronological order and separate categories where relevant: solo exhibitions, group exhibitions, education, awards, residencies, publications, collections, and press. Omit empty categories rather than showing invented or empty records. A downloadable PDF can be added after its content and accessibility are reviewed.

### 7.5 Contact and enquiries

- Provide one reliable public contact method approved by the artist.
- Use an enquiry form only if a real delivery mechanism and spam protection are configured.
- Include a clear subject/context for artwork enquiries (e.g. artwork title/slug).
- Do not expose private address, phone, or personal information without explicit approval.
- Explain expected response channels only if the artist confirms them.
- Keep Instagram as an optional additional contact/discovery channel.

### 7.6 Social integration

- Link to the exact supplied profile: `https://www.instagram.com/ghazalenasoodi/`.
- Open external links safely and label them accessibly.
- Do not embed a live Instagram feed in the initial release: it adds third-party dependency, privacy/performance cost, and may fail or change.
- Do not scrape, mirror, or download Instagram content without permission and a reliable rights basis.
- Prefer artist-supplied original files for the portfolio, even if the same work is also posted on Instagram.

## 8. Bilingual and RTL requirements

The recommended experience is Persian and English. Persian is essential for the artist's Iranian identity and local audience; English supports international galleries, curators, and collectors. Confirm the artist's preferred primary language before finalizing homepage defaults.

- Implement genuine translations, not machine-translated placeholder copy.
- Persian pages must set `lang="fa"` and `dir="rtl"`; English pages must set `lang="en"` and `dir="ltr"`.
- Use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`, etc.) instead of left/right assumptions.
- Keep artwork imagery itself direction-neutral; do not mirror paintings.
- Ensure navigation, breadcrumbs, gallery controls, forms, icons with directional meaning, and metadata order adapt to direction.
- Isolate Latin names, URLs, email addresses, dates, and numeric dimensions with appropriate bidi handling.
- Test Persian text at mobile widths and with screen readers.
- Provide visible language switching and preserve the equivalent page when a translation exists.

## 9. Image and media pipeline

Artwork reproduction quality is central to this product.

### Source capture guidance

Request high-quality original files from the artist. For physical paintings, photograph or scan straight-on with even lighting, neutral white balance, no glare, no perspective distortion, and no surrounding clutter. Keep a master archival original outside the web delivery pipeline.

### Web delivery

- Generate responsive derivatives at appropriate widths; use Next.js image optimization or a controlled static image pipeline.
- Prefer modern formats such as AVIF/WebP where supported, with sensible fallback.
- Use descriptive, stable filenames based on approved artwork titles/slugs.
- Use `width`, `height`, and/or `sizes` so layout space is reserved and layout shift is minimized.
- Lazy-load below-the-fold images; prioritize only the true hero/first-view artwork.
- Do not lazy-load the main above-the-fold image.
- Keep a high-quality source for zoom/detail where justified; do not serve enormous originals to every thumbnail.
- Compare optimized output against the master on calibrated or consistent displays before publication.
- Keep original source assets and generated derivatives distinguishable.

No artwork may be replaced with generated or stock imagery in production. Temporary design placeholders must be clearly identified and removed before launch.

## 10. SEO and discoverability

Treat the artist's name and artwork metadata as structured content, not decorative text.

- Unique, descriptive title and meta description for every indexable page.
- Canonical URLs and correct Open Graph metadata.
- XML sitemap, robots.txt, clean internal links, and meaningful 404 handling.
- Correct `hreflang` alternates for genuinely translated pages.
- Descriptive, human-readable artwork slugs and image filenames.
- Semantic headings and descriptive image alt text; alt text describes the image, not a list of keywords.
- Artwork pages should include visible text context: title, medium, dimensions, year, and a short note when available.
- Structured data should be selected conservatively (Person for the artist; VisualArtwork for individual work where fields are valid and supported; BreadcrumbList for navigational context). Never emit unsupported properties or fictional values.
- Add the artist's Persian and confirmed English name naturally in relevant metadata and visible copy.
- Verify Search Console after launch; monitor indexing and image search appearance.
- Avoid keyword stuffing, hidden text, and repetitive auto-generated captions.

SEO should support a useful human portfolio, not dictate the artistic presentation.

## 11. Accessibility and usability

Target WCAG 2.2 AA as the quality baseline.

- Semantic landmarks, one clear page-level H1, logical heading order.
- Keyboard-accessible navigation, gallery controls, language switcher, and forms.
- Visible focus indicators and adequate text/control contrast.
- Useful alt text for meaningful artwork; decorative images should not create redundant announcements.
- Do not use color alone to communicate availability or status.
- Provide accessible names for icon-only controls.
- Ensure dialogs/lightboxes trap and restore focus correctly, close with Escape, and expose image descriptions/captions.
- Respect reduced motion and browser zoom.
- Maintain readable caption sizes and touch targets on small screens.
- Test both LTR and RTL pages with keyboard and screen reader workflows.

## 12. Performance and reliability

- Optimize images without visibly degrading artwork fidelity.
- Avoid unnecessary client-side JavaScript; prefer Next.js Server Components.
- Use client components only for interactions such as a lightbox or gallery controls.
- Avoid heavy animation, third-party embeds, and large UI libraries unless justified.
- Reserve image dimensions to avoid cumulative layout shift.
- Aim for good Core Web Vitals on representative mobile devices and slower networks.
- Provide useful loading and error states when image assets fail.
- Ensure the site remains useful if Instagram or other third-party services are unavailable.

## 13. Privacy, security, and operational constraints

- Do not expose private artist contact details or location beyond the approved public description “Iran”.
- Do not collect analytics, marketing, or form data without a documented purpose and appropriate disclosure/consent.
- Minimize third-party scripts and external embeds.
- Validate and rate-limit contact submissions if a backend/form provider is introduced.
- Keep secrets out of source control and document environment variables.
- Review regional availability, legal requirements, and payment-provider eligibility before introducing payment or commerce features. The initial proposal favors direct enquiries rather than checkout.
- Obtain written permission for all portfolio images, portraits, exhibition photos, and third-party photographs.
- Include copyright/usage information where the artist wants it; do not claim rights not verified.

## 14. Content governance and publishing

Create an editorial workflow:

1. Artist supplies original image and factual metadata.
2. Editor checks image quality, rights, title, dimensions, medium, year, and translation.
3. Artist approves public-facing text and image crop.
4. Artwork is added to the structured content source.
5. Preview is reviewed at desktop, tablet, and mobile sizes in both languages.
6. Publish only after content and accessibility checks pass.

Each content field should distinguish “unknown” from “not applicable”. Never silently fill missing dates, dimensions, titles, or professional history.

## 15. Technical direction

Keep the existing Next.js App Router, React, TypeScript, and Tailwind foundation unless repository inspection reveals a concrete reason to change it.

Recommended implementation approach:

- Server-rendered, statically generated portfolio pages where possible.
- Typed, structured artwork and series data as the initial content source.
- A content layer that can later move to a headless CMS without changing the presentation model.
- Next.js image handling with explicit quality and sizing rules.
- Locale-aware route/layout structure with correct HTML language and direction.
- Reusable components for artwork cards, artwork details, captions, series introductions, language navigation, and contact actions.
- Minimal dependencies; no CMS, commerce, or Instagram integration until requirements justify them.

Do not introduce a CMS before the artist's update frequency, content volume, and editing needs are known. A structured local content source is likely sufficient for the first release.

## 16. Acceptance criteria

The initial professional portfolio is acceptable when:

- The homepage clearly identifies Ghazaleh as an oil painter and shows real, approved artwork immediately.
- The visual system is gallery-led and no longer resembles the generic starter landing page.
- Work can be browsed by approved series or as selected works.
- Each published artwork has accurate available metadata and descriptive alt text.
- About/statement content is artist-approved and contains no invented facts.
- Persian and English experiences work correctly, including RTL layout and language alternates.
- Contact route and Instagram link work and are clearly labelled.
- The site is responsive across mobile, tablet, and desktop.
- Keyboard navigation, focus states, lightbox behavior (if used), and reduced motion are verified.
- Artwork images preserve color and aspect ratio and load efficiently.
- Metadata, sitemap, robots, canonical URLs, and structured data are validated.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Automated tests cover core rendering, navigation, locale direction, gallery behavior, and contact links.
- No unapproved artwork, personal data, placeholder claims, or secret values are published.

## 17. Open decisions requiring artist input

These decisions should be collected before final visual/content sign-off:

1. Preferred public English spelling: “Ghazaleh Abdolahzade Nasoodi”, “Ghazale Abdolahzade Nasoodi”, or another artist-approved form?
2. Should Persian or English be the default homepage language?
3. Which paintings and series should be featured first, and which original high-resolution files may be published?
4. Does the artist have official titles, dates, dimensions, and medium details for each work?
5. Is there an approved artist statement, biography, education history, exhibition list, awards, or press coverage?
6. Should visitors enquire about original works, commissions, both, or neither?
7. What public contact email or contact method should appear?
8. Is a portrait or studio photograph available and approved?
9. Does the artist want a downloadable PDF portfolio or press kit?
10. Are there any preferred visual references, colors, typography, or sites she admires?

## 18. Research references

The recommendations above synthesize current artist-portfolio guidance with the specific needs of an oil painter:

- Waida Studio, [Art Portfolio Website: What to Include in 2026](https://waidastudio.com/learn/art-portfolio-website) — concise curated work, series, statement, CV, and contact routes.
- Format, [The Artist Website Problem Nobody Talks About](https://www.format.com/magazine/resources/art/artist-portfolio-website-seo-tips/) — contextual artwork metadata, descriptive alt text, series structure, and discoverability.
- Isee.art, [Artist Portfolio Website: Examples, Structure, Templates](https://isee.art/guides/artist-portfolio-website) — clear page hierarchy, artwork captions, image preparation, and distinct statement/bio.
- Artsume, [Artist Portfolio Best Practices: How to Present Work](https://www.artsume.com/guides/artist-portfolio-best-practices) — curated selection and professional artwork documentation.
- Exhibo, [Artist Portfolio Guide: Structure, Order and Specs](https://exhibo.art/blog/artist-portfolio) — clear navigation, project/series pages, and practical online portfolio structure.

These are secondary practice guides, not binding standards. Validate implementation against primary accessibility, web platform, and search-engine documentation during development.


## 19. Cross-cutting implementation contracts

The following specialist documents are normative companions to this proposal:

- [Artwork imaging and asset pipeline](./artwork-imaging-and-asset-pipeline.md) governs source capture, rights/provenance, derivatives, image fidelity, and alt text.
- [SEO and discovery](./seo-and-discovery.md) governs indexability, metadata, canonical URLs, locale alternates, structured data, sitemap, and search measurement.
- [Accessibility, performance, privacy, and security](./accessibility-performance-security.md) defines non-functional requirements and measurable quality goals.
- [Localization and editorial governance](./localization-and-editorial-governance.md) governs translation approval, RTL/LTR behavior, editorial states, and content review.
- [Testing, visual QA, and release acceptance](./testing-qa-and-release.md) defines verification evidence and release gates.
- [Studio hero implementation prompt](./hero-implementation-prompt.md) is a scoped brief for the layered studio scene; it does not replace the full site specification.

### 19.1 Resolve the hero and artwork-first requirement

The homepage hero may use the approved studio/process scene as the artist's signature identity moment, but that scene is not a substitute for finished paintings. The first viewport must communicate the artist's identity and provide an immediate, visible path to actual selected works. At least one approved finished artwork should be visible in the initial homepage composition or immediately adjacent selected-work section without requiring a visitor to wait for animation or dismiss an overlay. The hero animation is optional enhancement; the static composition is the baseline.

### 19.2 Asset and content publication gate

An asset's presence in the repository does not establish ownership, public-use permission, final image quality, or artist approval. Each public artwork requires a confirmed source/rights basis, approved image/crop/caption, and truthful metadata. Unknown fields are omitted. Studio/process images remain separate from artwork records.

### 19.3 Release authority

Passing CI and visual QA does not itself authorize deployment, public release, or branch merge. Those actions require separate explicit owner authorization.

## Project-wide design quality and visual direction

All visual and interaction implementation must follow [design-engineering-skills.md](./design-engineering-skills.md) and [design-direction-and-system-refinement.md](./design-direction-and-system-refinement.md).

The site direction is “the artist's quiet gallery”: warm, thoughtful, contemporary, intimate, editorial, and restrained. Finished paintings remain the primary visual content. Avoid generic SaaS/AI patterns, repetitive card grids, decorative gradients/glassmorphism, unnecessary motion, and visual effects that compete with the art. Use the existing warm-paper, warm-ink, mauve, and taupe palette as semantic tokens; do not invent a new palette per page. Typography, spacing, navigation, component states, responsive behavior, and motion must be consistent across routes and both locales.

A feature is not visually complete because it compiles. It requires rendered review at desktop, tablet, mobile, and short-height viewports, in Persian RTL and English LTR, with reduced motion and keyboard/touch interaction checked. Record evidence; never claim checks that were not performed.
