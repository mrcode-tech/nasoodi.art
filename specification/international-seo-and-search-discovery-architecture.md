# International SEO and Search Discovery Architecture

**Status:** Proposed implementation contract  
**Locales:** English (en) and Persian (fa)  
**Framework:** Current repository Next.js App Router version

## 1. Purpose

Make genuine, artist-approved portfolio content discoverable in English and Persian. SEO must serve visitors, collectors, curators, galleries, and press. No implementation guarantees rankings, traffic, indexing dates, or rich results.

This document expands the existing SEO guidance. Before coding, inspect current routes, metadata, sitemap, robots, redirects, canonical host, hreflang, JSON-LD, image pipeline, content publication states, tests, and CI. Preserve working behavior and document gaps; do not duplicate capabilities blindly.

## 2. Indexability contract

Only public, complete, approved, published content is indexable. Apply the same eligibility rule to page rendering, sitemap, internal links, hreflang, and structured data.

Exclude drafts, needs-review, archived, private, placeholder, incomplete, untranslated, and internal routes. Preserve the existing rule that Contact routes using fictional demo destinations remain noindex and outside the sitemap until replaced with real owner-supplied details and explicitly authorized for indexing.

Unknown slugs must return real 404 responses. Use permanent redirects only for genuine URL changes; avoid chains. Do not block a URL in robots.txt when crawlers need to see its noindex directive.

## 3. Localized URLs, canonical, and hreflang

Preserve the existing locale-prefixed URL architecture, subject to audit. English and Persian are distinct URLs and normally each has a self-referencing canonical. Never canonicalize Persian to English merely because they are translations.

Localized slugs may differ. Resolve translation relationships through stable content identity and explicit locale-to-route mappings, not by replacing the first URL segment.

For genuine published translations:
- Emit reciprocal hreflang links, including self-reference.
- Use valid language tags (en and fa; region subtags only when justified).
- Emit alternates only when the target is canonical, indexable, published, and returns 200.
- Consider x-default only when there is a deliberate default/language-selection destination.
- If no equivalent translation exists, omit the alternate and provide a clear language-switch fallback.

Centralize alternate generation through Next.js metadata and the shared locale/content resolver.

## 4. Metadata contract

Use the Next.js Metadata API on the server: static metadata for static pages and generateMetadata for data-dependent routes. Use a consistent metadataBase and absolute canonical/social URLs.

Every indexable page needs a unique, accurate localized title and description, canonical URL, appropriate robots policy, language alternates when applicable, meaningful visible H1, and relevant Open Graph/Twitter metadata. Metadata must describe the actual page. Avoid keyword stuffing, global duplicate descriptions, unsupported claims, arbitrary truncation, and client-side title manipulation.

## 5. Page-type rules

- Home: identify the artist and actual practice using approved facts and introduction.
- About/CV: distinguish artist-authored statement from factual biography; publish verified CV entries only.
- Galleries: describe the actual curated collection; exclude empty or thin collections.
- Artwork: use stable identity, localized route mapping, approved title/image/description, and only known medium, support, year, dimensions, or series. Never infer missing facts.
- Journal: use article semantics for genuine published editorial entries.
- Events: dates, venue, attendance mode, and status must be accurate; do not describe past events as upcoming.
- Contact: retain demo-phase noindex protection until genuine details replace fictional values and indexing is authorized.

## 6. Artwork and image SEO

Artwork is primary content. Provide meaningful localized alt text for informative images and empty alt for decorative images. Keep title, caption, context, and nearby copy accurate. Use responsive image delivery, intrinsic dimensions/aspect ratios, optimized formats, and crawlable image URLs. Prioritize the actual LCP image; lazy-load below-the-fold images. Preserve artwork fidelity: never mirror, recolor, or destructively crop paintings. Use approved social preview crops. Do not keyword-stuff alt text.

## 7. Structured data

Use JSON-LD only when it accurately describes visible, verified content. Candidate types include Person, WebSite, WebPage, VisualArtwork, CollectionPage, ItemList, Article, Event, and BreadcrumbList.

Use stable entity identifiers and consistent creator/author references. Never invent awards, address, organization, reviews, ratings, prices, offers, availability, dates, venues, or affiliations. Avoid duplicate/conflicting graphs and serialize safely. Validate JSON-LD syntax and Google eligibility separately; valid markup does not guarantee rich results.

## 8. Sitemap, robots, and crawl paths

Use Next.js metadata routes or the existing equivalent. Sitemap must contain only canonical, public, indexable, 200-status URLs and genuine localized alternates. Derive lastModified from meaningful content updates, not every build timestamp. Exclude noindex, draft, placeholder, redirected, missing-locale, and internal routes.

robots.txt must reference the canonical sitemap and must not block resources required for rendering. Canonical, sitemap, Open Graph, and redirects must use one consistent host/protocol policy. Important pages must be discoverable through ordinary crawlable HTML links. Pagination must have usable links and stable URL state.

## 9. Persian and English search quality

Treat both languages as independent editorial experiences, not machine-translated copies. Set document language and direction correctly (fa/RTL, en/LTR). Write natural localized titles, descriptions, headings, artwork descriptions, and alt text. Research Persian search intent independently; do not mechanically translate English keyword lists. Handle Persian/Arabic character variants consistently without altering names or source facts. Use locale-aware dates and numbers. Avoid keyword stuffing.

## 10. Social sharing, performance, and accessibility

Provide page-relevant Open Graph and Twitter metadata with approved images, absolute URLs, and localized copy. Do not generate unapproved portraits or artwork derivatives solely for SEO.

Render essential content and metadata on the server. Use semantic headings, links, landmarks, and accessible image alternatives. Optimize fonts and images without harming Persian shaping or artwork fidelity. Monitor field Core Web Vitals at the 75th percentile: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1. Lab Lighthouse scores are diagnostic, not substitutes for field metrics.

## 11. Monitoring and privacy

After explicit launch authorization, verify Google Search Console and optionally Bing Webmaster Tools, submit the sitemap, and inspect representative English/Persian pages. Monitor index coverage, canonical selection, hreflang errors, sitemap processing, queries, impressions, clicks, CTR, position, image search, crawl errors, and Core Web Vitals.

Do not add analytics, tracking pixels, session replay, or third-party collection without an explicit privacy/provider decision. A sitemap entry does not prove indexing.

## 12. Automated verification

Add tests for unique localized metadata; canonical URLs; reciprocal hreflang only for real translations; no alternates to 404/noindex/redirected/unpublished routes; correct lang/dir; sitemap eligibility; robots policy; Contact demo noindex; JSON-LD syntax and content parity; real 404 behavior; internal links; artwork alt text/dimensions; and production-rendered HTML/status.

Use synthetic fixtures. Never publish fictional artist facts for tests.

## 13. Evidence-led audit workflow

For each SEO recommendation, state page type, locale, objective, evidence, affected URLs, rationale, dependencies, smallest safe implementation, falsifiable acceptance test, monitoring metric, and rollback consideration. Separate confirmed defects from opportunities and hypotheses. Verify against primary sources and the actual rendered site.

Prioritize by impact, confidence, effort, and dependency. Recheck both locales and adjacent page types. Do not combine SEO extraction with redesign or unapproved content rewrites.

## 14. Implementation sequence

1. Audit current behavior and record baseline.
2. Normalize locale identity and translated route relationships.
3. Centralize metadata, canonical, and hreflang generation.
4. Verify sitemap, robots, HTTP statuses, and indexability gates.
5. Validate artwork/image SEO and structured data.
6. Improve internal links and approved page content.
7. Add CI checks and production-build verification.
8. Configure monitoring only after launch authorization.

## 15. Acceptance criteria

- [ ] Existing routes and SEO behavior audited before edits.
- [ ] Every indexable route has unique accurate localized metadata.
- [ ] Each locale has its own canonical.
- [ ] Hreflang is reciprocal and limited to true published translations.
- [ ] Sitemap contains only canonical eligible URLs.
- [ ] robots.txt does not block required rendering resources.
- [ ] Demo Contact routes remain noindex and outside sitemap.
- [ ] Structured data matches visible verified facts.
- [ ] Missing content returns correct status and is not indexed.
- [ ] English and Persian production HTML are tested.
- [ ] CI validates invariants without external credentials.
- [ ] No unsupported ranking/indexing claims are made.

## 16. Primary references

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Multilingual/multi-regional sites: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Localized versions and hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Images: https://developers.google.com/search/docs/appearance/google-images
- Structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Next.js Metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Next.js robots: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- Schema.org: https://schema.org/
- Core Web Vitals: https://web.dev/articles/vitals

## 17. Claude SEO skill reference

The likely skill mentioned by the owner is the community project AgriciDaniel/claude-seo (MIT), an SEO orchestrator with specialist workflows for technical SEO, content quality, schema, images, sitemap, and international SEO.

Repository: https://github.com/AgriciDaniel/claude-seo

Treat it as a reference tool, not an authority or project dependency. Inspect its SKILL.md and pin/review the revision before use. Verify its output against Google Search Central, Next.js, Schema.org, and the actual rendered site. Do not install the entire plugin or optional API extensions automatically. Do not connect accounts, provide API keys, crawl external services, or change production without authorization. Ignore irrelevant local SEO, ecommerce, backlink, and paid-data workflows for this portfolio.

## Canonical JSON metadata integration — 2026-11-05

Metadata must be resolved from the canonical editorial records:
- Homepage title/description and About metadata use the canonical artist profile.
- Works, Galleries, Journal, and archive descriptions/titles use localized site metadata in `site.json`.
- Artwork, gallery, and Journal detail metadata use the corresponding localized record identified by stable ID.
- CV metadata uses the localized CV/site metadata record.
- Contact metadata uses the canonical Contact record and only owner-supplied contact destinations.

Hreflang is emitted only when the same stable content identity has a complete corresponding localized record. Do not compare localized slug strings to establish identity. Contact indexability and sitemap eligibility follow the presence of complete localized canonical Contact metadata and owner-supplied destinations; no demo destination is treated as a public contact method.

Rendered production HTML is the acceptance source for title, description, canonical, hreflang, Open Graph, Twitter/X, JSON-LD, language/direction, and server-rendered editorial content. Unit tests of metadata helpers alone are insufficient.


## Repository-backed metadata and rendered HTML evidence — 2026-11-05

The sitemap resolves Works, Galleries, Journal, CV, About, and Contact through focused content repositories rather than importing raw JSON adapters. Section metadata and the global Person/WebSite graph also resolve the canonical artist/artwork repositories. Detail-route alternate URLs are found by stable entity ID and then use the target locale's explicit slug. Do not emit an alternate link when the target locale lacks the corresponding published record.

Production acceptance checks actual localized HTML: document `lang`/`dir`, unique title/description, self canonical, reciprocal hreflang, Open Graph/Twitter metadata, robots, sitemap URLs, structured data, and visible server-rendered editorial content. Unit tests of metadata helpers alone are not rendered-HTML evidence.
