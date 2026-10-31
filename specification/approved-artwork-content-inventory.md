# Approved artwork and curated gallery content

**Status:** Implemented on `feature`; automated verification pending.
**Approval basis:** The site owner explicitly approved the five photographs in `specification/assets/gallery/` for public portfolio use and authorized editorial titles, descriptions, and multiple overlapping collections.

## Asset delivery

The source masters remain unchanged in the specification folder. `scripts/copy-approved-gallery-assets.mjs` copies them into `public/images/` before development and production builds. The copied files are exact byte-for-byte copies; no crop, recolor, filter, or derivative is applied.

| Source master | Canonical artwork ID | Public image path | Intended use |
|---|---|---|---|
| `specification/assets/gallery/1.jpg` | `artwork-quiet-place` | `/images/approved-artwork-1.jpg` | Homepage, viewer, galleries |
| `specification/assets/gallery/2.jpg` | `artwork-shape-of-remembering` | `/images/approved-artwork-2.jpg` | Homepage, viewer, galleries |
| `specification/assets/gallery/3.jpg` | `artwork-where-light-rests` | `/images/approved-artwork-3.jpg` | Homepage, viewer, galleries |
| `specification/assets/gallery/4.jpg` | `artwork-garden-small-moments` | `/images/approved-artwork-4.jpg` | Homepage, viewer, galleries |
| `specification/assets/gallery/5.jpg` | `artwork-blue-hour-within` | `/images/approved-artwork-5.jpg` | Homepage, viewer, galleries |

The copy command checks that all five source files exist, are non-empty, and that copied byte counts match. The CI asset audit records source dimensions, aspect ratio, and SHA-256. No medium, year, dimensions, provenance, exhibition history, or other unprovided artwork metadata is asserted in the content records.

## Canonical artwork records

| Artwork ID | Slug | English title | Persian title |
|---|---|---|---|
| `artwork-quiet-place` | `a-quiet-place-between-seasons` | A Quiet Place Between Seasons | آرامش میان فصل‌ها |
| `artwork-shape-of-remembering` | `the-shape-of-remembering` | The Shape of Remembering | شکلِ خاطره |
| `artwork-where-light-rests` | `where-light-rests` | Where Light Rests | جایی که نور می‌آرامد |
| `artwork-garden-small-moments` | `a-garden-of-small-moments` | A Garden of Small Moments | باغ لحظه‌های کوچک |
| `artwork-blue-hour-within` | `the-blue-hour-within` | The Blue Hour Within | ساعت آبی درون |

All five records are published, rights-confirmed according to the owner's explicit approval, have English/Persian titles, descriptions, and alt text, and use one primary local image. The descriptions are concise editorial interpretations; they avoid claims about identifiable depicted subjects or unverified materials and dates. Titles and collection names are website editorial labels, not claims that the artist historically named or exhibited these series.

## Curated collections and ordered membership

| Gallery ID | Slug | English / Persian title | Ordered artwork IDs |
|---|---|---|---|
| `gallery-quiet-intervals` | `quiet-intervals` | Quiet Intervals / فاصله‌های آرام | quiet-place → where-light-rests → garden-small-moments |
| `gallery-color-conversation` | `color-in-conversation` | Color in Conversation / گفت‌وگوی رنگ‌ها | where-light-rests → shape-of-remembering → blue-hour-within |
| `gallery-fragments-memory` | `fragments-of-memory` | Fragments of Memory / پاره‌های خاطره | shape-of-remembering → garden-small-moments → blue-hour-within |
| `gallery-selected-works` | `selected-works` | Selected Works / گزیده آثار | quiet-place → shape-of-remembering → where-light-rests → garden-small-moments → blue-hour-within |

The shortened IDs in the table correspond to the full `artwork-...` IDs in the content model. Membership is stored as references to canonical artwork IDs; artworks are not duplicated. Each gallery's cover is a member of its own ordered sequence. The four collections are editorial navigation groupings created for this portfolio.

## Public routes and experience

- Homepage Selected Works uses all five canonical artwork IDs in their explicit order.
- Collection index: `/en/galleries` and `/fa/galleries`.
- Collection details: `/[locale]/galleries/quiet-intervals`, `/[locale]/galleries/color-in-conversation`, `/[locale]/galleries/fragments-of-memory`, and `/[locale]/galleries/selected-works`.
- Canonical artwork details: `/[locale]/works/[artworkSlug]`.
- The shared viewer remains `src/components/artwork-experience.tsx`; homepage and collection contexts pass their own ordered artwork arrays.

## Validation

- Content tests assert exactly five unique published artworks, all five approved source-to-public mappings, localized content, four unique published galleries, valid covers/memberships, overlap, and homepage selection.
- Browser tests cover populated English/Persian collection indexes, homepage artwork viewer opening and navigation, viewer history, collection-scoped navigation, canonical artwork detail routes, and mobile/short-height viewer visibility.
- The build pre-step copies source images before Next.js collects public assets. CI's asset audit and production route smoke test run after the build.

## Verification boundary

Automated publication and route checks can establish that the source files exist, are copied byte-for-byte, and render at the configured paths. They do not substitute for the site owner's visual review of each painting, editorial title/description, and final gallery grouping. The owner should inspect the populated pages before considering the editorial presentation finally accepted.
